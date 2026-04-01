import { Users, Handshake, DollarSign, ListTodo, Clock, TrendingUp, User, Briefcase } from 'lucide-react';
import { useCrm } from '../context/CrmContext';
import { STAGES } from '../data/seedData';
import StatCard from '../components/StatCard';
import './Dashboard.css';

export default function Dashboard() {
  const { contacts, deals, tasks } = useCrm();

  const activeDeals = deals.filter((d) => d.stage !== 'won' && d.stage !== 'lost');
  const pipelineValue = activeDeals.reduce((sum, d) => sum + d.value, 0);
  const pendingTasks = tasks.filter((t) => !t.completed);

  // Recent contacts (latest 5)
  const recentContacts = [...contacts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Recent deals (latest 5)
  const recentDeals = [...deals]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Pipeline chart data
  const stageCounts = Object.keys(STAGES).map((key) => ({
    key,
    label: STAGES[key].label.split(' - ').pop().split(' ').pop(),
    color: STAGES[key].color,
    count: deals.filter((d) => d.stage === key).length,
  }));
  const maxCount = Math.max(...stageCounts.map((s) => s.count), 1);

  const formatCurrency = (n) =>
    '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="dashboard-subtitle">Resumen general de tu CRM</p>

      <div className="dashboard-stats">
        <StatCard icon={Users} label="Contactos" value={contacts.length} color="blue" change="Total registrados" />
        <StatCard icon={Handshake} label="Negocios Activos" value={activeDeals.length} color="purple" change="En pipeline" />
        <StatCard icon={DollarSign} label="Valor Pipeline" value={formatCurrency(pipelineValue)} color="emerald" change="Deals abiertos" />
        <StatCard icon={ListTodo} label="Tareas Pendientes" value={pendingTasks.length} color="amber" change="Por completar" />
      </div>

      <div className="dashboard-grid">
        {/* Recent Contacts */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div className="dashboard-section-title">
            <Clock size={16} />
            Contactos Recientes
          </div>
          <div className="recent-list">
            {recentContacts.map((c) => (
              <div key={c.id} className="recent-item">
                <div className="recent-item-icon contact">
                  <User size={14} />
                </div>
                <div className="recent-item-info">
                  <div className="recent-item-name">{c.name}</div>
                  <div className="recent-item-meta">{c.company}</div>
                </div>
              </div>
            ))}
            {recentContacts.length === 0 && (
              <p className="text-sm text-muted" style={{ padding: '1rem' }}>Sin contactos aún</p>
            )}
          </div>
        </div>

        {/* Pipeline Chart */}
        <div className="card bar-chart">
          <div className="dashboard-section-title">
            <TrendingUp size={16} />
            Pipeline por Etapa
          </div>
          <div className="bar-chart-bars">
            {stageCounts.map((s) => (
              <div key={s.key} className="bar-chart-col">
                <span className="bar-chart-value">{s.count}</span>
                <div
                  className={`bar-chart-bar ${s.color}`}
                  style={{ height: `${(s.count / maxCount) * 100}%`, minHeight: '8px' }}
                />
                <span className="bar-chart-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deals */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div className="dashboard-section-title">
            <Briefcase size={16} />
            Negocios Recientes
          </div>
          <div className="recent-list">
            {recentDeals.map((d) => {
              const contact = contacts.find((c) => c.id === d.contactId);
              return (
                <div key={d.id} className="recent-item">
                  <div className="recent-item-icon deal">
                    <Briefcase size={14} />
                  </div>
                  <div className="recent-item-info">
                    <div className="recent-item-name">{d.title}</div>
                    <div className="recent-item-meta">
                      {contact?.name || 'Sin contacto'} · {formatCurrency(d.value)}
                    </div>
                  </div>
                  <span className={`badge badge-${STAGES[d.stage]?.color}`}>
                    {STAGES[d.stage]?.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
