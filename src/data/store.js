// localStorage CRUD helpers — generic store layer

const STORAGE_KEYS = {
  contacts: 'crm_contacts',
  deals: 'crm_deals',
  tasks: 'crm_tasks',
  initialized: 'crm_initialized',
};

export function loadCollection(key) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS[key]);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCollection(key, data) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
}

export function isInitialized() {
  return localStorage.getItem(STORAGE_KEYS.initialized) === 'true';
}

export function markInitialized() {
  localStorage.setItem(STORAGE_KEYS.initialized, 'true');
}

export function clearAll() {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
}

export function generateId() {
  return crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2);
}
