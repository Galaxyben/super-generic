import { useState } from 'react';
import { Plus, Check, User, Calendar, Trash2, ListTodo, Briefcase } from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import Modal from '../components/Modal';
import './Tasks.css';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' },
];

export default function Tasks() {
  const { tasks, contacts, deals, addTask, toggleTask, deleteTask } = useCrm();
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', dueDate: '', contactId: '', dealId: '' });

  const filtered = tasks.filter((t) => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addTask(form);
    setForm({ title: '', dueDate: '', contactId: '', dealId: '' });
    setModalOpen(false);
  };

  return (
    <div className="tasks-page">
      <h1>Tasks</h1>

      <div className="tasks-toolbar">
        <div className="tasks-filters">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              className={`tasks-filter-btn ${filter === f.key ? 'active' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          New Task
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="tasks-list">
          {filtered.map((task) => {
            const contact = contacts.find((c) => c.id === task.contactId);
            const deal = deals.find((d) => d.id === task.dealId);
            return (
              <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                <button
                  className={`task-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleTask(task.id)}
                >
                  {task.completed && <Check size={12} />}
                </button>
                <div className="task-info">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    {contact && (
                      <span className="task-meta-item">
                        <User size={11} />
                        {contact.name}
                      </span>
                    )}
                    {deal && (
                      <span className="task-meta-item">
                        <Briefcase size={11} />
                        {deal.title}
                      </span>
                    )}
                    {task.dueDate && (
                      <span className="task-meta-item">
                        <Calendar size={11} />
                        {task.dueDate}
                      </span>
                    )}
                  </div>
                </div>
                <button className="btn-ghost btn-icon task-delete" onClick={() => deleteTask(task.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card tasks-empty">
          <ListTodo size={48} />
          <p>{filter === 'completed' ? 'No completed tasks' : 'No pending tasks'}</p>
        </div>
      )}

      {/* Create Task Modal */}
      {modalOpen && (
        <Modal title="New Task" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="modal-field">
                <label htmlFor="task-title">Title</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="Task description"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-field">
                <label htmlFor="task-due">Due Date</label>
                <input
                  id="task-due"
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="task-contact">Contact</label>
                <select
                  id="task-contact"
                  value={form.contactId}
                  onChange={(e) => setForm({ ...form, contactId: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label htmlFor="task-deal">Deal</label>
                <select
                  id="task-deal"
                  value={form.dealId}
                  onChange={(e) => setForm({ ...form, dealId: e.target.value })}
                >
                  <option value="">Unassigned</option>
                  {deals.map((d) => (
                    <option key={d.id} value={d.id}>{d.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">Create Task</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
