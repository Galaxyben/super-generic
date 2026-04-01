import { useState } from 'react';
import { Plus, User, Trash2 } from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { STAGES } from '../data/seedData';
import Modal from '../components/Modal';
import './Pipeline.css';

export default function Pipeline() {
  const { deals, contacts, addDeal, updateDeal, deleteDeal } = useCrm();
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: '', value: '', stage: 'prospect', contactId: '' });

  const formatCurrency = (n) => '$' + Number(n).toLocaleString('en-US');

  // --- Drag & Drop ---
  const handleDragStart = (e, dealId) => {
    setDraggedId(dealId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => setDragOverStage(null);

  const handleDrop = (e, stage) => {
    e.preventDefault();
    setDragOverStage(null);
    if (draggedId) {
      updateDeal({ id: draggedId, stage });
      setDraggedId(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverStage(null);
  };

  // --- Create Deal ---
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addDeal({ ...form, value: Number(form.value) || 0 });
    setForm({ title: '', value: '', stage: 'prospect', contactId: '' });
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Eliminar este negocio?')) {
      deleteDeal(id);
    }
  };

  return (
    <div className="pipeline-page">
      <h1>Pipeline de Ventas</h1>
      <p className="pipeline-subtitle">Arrastra los negocios entre etapas para actualizar su estado</p>

      <div className="pipeline-toolbar">
        <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
          <Plus size={16} />
          Nuevo Negocio
        </button>
      </div>

      <div className="kanban-board">
        {Object.entries(STAGES).map(([stageKey, { label, color }]) => {
          const stageDeals = deals.filter((d) => d.stage === stageKey);
          return (
            <div
              key={stageKey}
              className={`kanban-column ${dragOverStage === stageKey ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, stageKey)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stageKey)}
            >
              <div className="kanban-column-header">
                <div className="kanban-column-title">
                  <span className={`kanban-column-dot ${color}`} />
                  {label}
                </div>
                <span className="kanban-column-count">{stageDeals.length}</span>
              </div>
              <div className="kanban-column-body">
                {stageDeals.length === 0 && (
                  <div className="kanban-empty">Sin negocios</div>
                )}
                {stageDeals.map((deal) => {
                  const contact = contacts.find((c) => c.id === deal.contactId);
                  return (
                    <div
                      key={deal.id}
                      className={`deal-card ${draggedId === deal.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, deal.id)}
                      onDragEnd={handleDragEnd}
                    >
                      <div className="deal-card-title">{deal.title}</div>
                      <div className="deal-card-meta">
                        <span className="deal-card-contact">
                          <User size={12} />
                          {contact?.name || 'Sin asignar'}
                        </span>
                        <span className="deal-card-value">{formatCurrency(deal.value)}</span>
                      </div>
                      <div className="deal-card-actions">
                        <button className="btn-ghost btn-icon" onClick={() => handleDelete(deal.id)}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Deal Modal */}
      {modalOpen && (
        <Modal title="Nuevo Negocio" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="modal-field">
                <label htmlFor="deal-title">Título</label>
                <input
                  id="deal-title"
                  type="text"
                  placeholder="Nombre del negocio"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  autoFocus
                  required
                />
              </div>
              <div className="modal-field">
                <label htmlFor="deal-value">Valor ($)</label>
                <input
                  id="deal-value"
                  type="number"
                  placeholder="0"
                  min="0"
                  value={form.value}
                  onChange={(e) => setForm({ ...form, value: e.target.value })}
                />
              </div>
              <div className="modal-field">
                <label htmlFor="deal-stage">Etapa</label>
                <select
                  id="deal-stage"
                  value={form.stage}
                  onChange={(e) => setForm({ ...form, stage: e.target.value })}
                >
                  {Object.entries(STAGES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="modal-field">
                <label htmlFor="deal-contact">Contacto</label>
                <select
                  id="deal-contact"
                  value={form.contactId}
                  onChange={(e) => setForm({ ...form, contactId: e.target.value })}
                >
                  <option value="">Sin asignar</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">Crear Negocio</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
