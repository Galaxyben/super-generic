import { createContext, useContext, useReducer, useEffect, useCallback, useState } from 'react';
import { loadCollection, saveCollection, isInitialized, markInitialized, generateId } from '../data/store';
import { seedContacts, seedDeals, seedTasks } from '../data/seedData';

const CrmContext = createContext(null);

// --- Reducer ---
function crmReducer(state, action) {
  switch (action.type) {
    // Contacts
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map((c) => (c.id === action.payload.id ? { ...c, ...action.payload } : c)),
      };
    case 'DELETE_CONTACT':
      return { ...state, contacts: state.contacts.filter((c) => c.id !== action.payload) };

    // Deals
    case 'ADD_DEAL':
      return { ...state, deals: [...state.deals, action.payload] };
    case 'UPDATE_DEAL':
      return {
        ...state,
        deals: state.deals.map((d) => (d.id === action.payload.id ? { ...d, ...action.payload } : d)),
      };
    case 'DELETE_DEAL':
      return { ...state, deals: state.deals.filter((d) => d.id !== action.payload) };

    // Tasks
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.payload] };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t)),
      };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.payload) };
    case 'TOGGLE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((t) => (t.id === action.payload ? { ...t, completed: !t.completed } : t)),
      };

    default:
      return state;
  }
}

// --- Initial state from localStorage or seed ---
function getInitialState() {
  if (isInitialized()) {
    return {
      contacts: loadCollection('contacts'),
      deals: loadCollection('deals'),
      tasks: loadCollection('tasks'),
    };
  }
  // First run — seed the data
  markInitialized();
  saveCollection('contacts', seedContacts);
  saveCollection('deals', seedDeals);
  saveCollection('tasks', seedTasks);
  return {
    contacts: seedContacts,
    deals: seedDeals,
    tasks: seedTasks,
  };
}

// --- Provider ---
export function CrmProvider({ children }) {
  const [state, dispatch] = useReducer(crmReducer, null, getInitialState);
  const [toasts, setToasts] = useState([]);

  // Persist to localStorage on every state change
  useEffect(() => {
    saveCollection('contacts', state.contacts);
    saveCollection('deals', state.deals);
    saveCollection('tasks', state.tasks);
  }, [state]);

  // Toast helpers
  const addToast = useCallback((message, type = 'success') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Action creators
  const actions = {
    addContact: (data) => {
      const contact = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      dispatch({ type: 'ADD_CONTACT', payload: contact });
      addToast('Contact created successfully');
      return contact;
    },
    updateContact: (data) => {
      dispatch({ type: 'UPDATE_CONTACT', payload: data });
      addToast('Contact updated');
    },
    deleteContact: (id) => {
      dispatch({ type: 'DELETE_CONTACT', payload: id });
      addToast('Contact deleted', 'info');
    },
    addDeal: (data) => {
      const deal = { ...data, id: generateId(), createdAt: new Date().toISOString() };
      dispatch({ type: 'ADD_DEAL', payload: deal });
      addToast('Deal created successfully');
      return deal;
    },
    updateDeal: (data) => {
      dispatch({ type: 'UPDATE_DEAL', payload: data });
      addToast('Deal updated');
    },
    deleteDeal: (id) => {
      dispatch({ type: 'DELETE_DEAL', payload: id });
      addToast('Deal deleted', 'info');
    },
    addTask: (data) => {
      const task = { ...data, id: generateId(), completed: false, createdAt: new Date().toISOString() };
      dispatch({ type: 'ADD_TASK', payload: task });
      addToast('Task created');
      return task;
    },
    updateTask: (data) => {
      dispatch({ type: 'UPDATE_TASK', payload: data });
    },
    deleteTask: (id) => {
      dispatch({ type: 'DELETE_TASK', payload: id });
      addToast('Task deleted', 'info');
    },
    toggleTask: (id) => {
      dispatch({ type: 'TOGGLE_TASK', payload: id });
    },
  };

  return (
    <CrmContext.Provider value={{ ...state, ...actions, toasts, removeToast }}>
      {children}
    </CrmContext.Provider>
  );
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error('useCrm must be used within CrmProvider');
  return ctx;
}
