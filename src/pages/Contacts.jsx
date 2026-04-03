import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Users } from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import Modal from '../components/Modal';
import './Contacts.css';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #3b82f6, #06b6d4)',
  'linear-gradient(135deg, #8b5cf6, #ec4899)',
  'linear-gradient(135deg, #10b981, #14b8a6)',
  'linear-gradient(135deg, #f59e0b, #ef4444)',
  'linear-gradient(135deg, #6366f1, #8b5cf6)',
];

function getInitials(name) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

const EMPTY_FORM = { name: '', email: '', phone: '', company: '', status: 'active' };

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact } = useCrm();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.company.toLowerCase().includes(q)
    );
  });

  const openCreate = () => {
    setEditingContact(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (contact) => {
    setEditingContact(contact);
    setForm({
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      status: contact.status || 'active',
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (editingContact) {
      updateContact({ ...editingContact, ...form });
    } else {
      addContact(form);
    }
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this contact?')) {
      deleteContact(id);
    }
  };

  return (
    <div className="contacts-page">
      <h1>Contacts</h1>

      <div className="contacts-toolbar">
        <div className="contacts-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by name, email or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} />
          New Contact
        </button>
      </div>

      {filtered.length > 0 ? (
        <div className="contacts-table-wrapper">
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th style={{ width: 90 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id}>
                  <td>
                    <div className="contact-name-cell">
                      <div
                        className="contact-avatar"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        {getInitials(c.name)}
                      </div>
                      <span className="contact-name">{c.name}</span>
                    </div>
                  </td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.company}</td>
                  <td>
                    <span className={`badge badge-${c.status === 'active' ? 'emerald' : c.status === 'lead' ? 'blue' : 'rose'}`}>
                      {c.status === 'active' ? 'Active' : c.status === 'lead' ? 'Lead' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="contact-actions">
                      <button className="btn-ghost btn-icon" title="Edit" onClick={() => openEdit(c)}>
                        <Pencil size={14} />
                      </button>
                      <button className="btn-ghost btn-icon" title="Delete" onClick={() => handleDelete(c.id)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card contacts-empty">
          <Users size={48} />
          <p>No contacts found</p>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <Modal
          title={editingContact ? 'Edit Contact' : 'New Contact'}
          onClose={() => setModalOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="modal-field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="email@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="contact-phone">Phone</label>
                <input
                  id="contact-phone"
                  type="text"
                  placeholder="+52 55 1234 5678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="contact-company">Company</label>
                <input
                  id="contact-company"
                  type="text"
                  placeholder="Company name"
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="contact-status">Status</label>
                <select
                  id="contact-status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="lead">Lead</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingContact ? 'Save Changes' : 'Create Contact'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
