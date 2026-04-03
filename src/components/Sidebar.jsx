import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Kanban, CheckSquare, Zap } from 'lucide-react';
import './Sidebar.css';

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/contacts', icon: Users, label: 'Contacts' },
  { to: '/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Zap size={18} />
          </div>
          <div className="sidebar-logo-text">
            <span>Super CRM</span>
            <span>Generic Edition</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="sidebar-nav-label">Main Menu</span>
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <Icon />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-info">
          <div className="sidebar-avatar">AD</div>
          <div>
            <div className="sidebar-user-name">Admin User</div>
            <div className="sidebar-user-role">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
