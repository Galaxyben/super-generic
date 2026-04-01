import './StatCard.css';

export default function StatCard({ icon: Icon, label, value, color = 'blue', change }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-header">
        <div className={`stat-card-icon ${color}`}>
          <Icon size={20} />
        </div>
        <span className="stat-card-label">{label}</span>
      </div>
      <div className="stat-card-value">{value}</div>
      {change && <div className="stat-card-change">{change}</div>}
    </div>
  );
}
