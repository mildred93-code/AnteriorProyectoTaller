import React from 'react';
import { 
  Pill, 
  LayoutDashboard, 
  Boxes, 
  CalendarClock, 
  AlertOctagon, 
  Settings,
  Activity
} from 'lucide-react';

const Sidebar = ({ activeTab = 'inventory', setActiveTab = () => {} }) => {
  const menuItems = [
    { id: 'inventory', label: 'Panel & Inventario', icon: LayoutDashboard },
    { id: 'stock', label: 'Control de Stock', icon: Boxes },
    { id: 'lotes', label: 'Gestión de Lotes', icon: CalendarClock },
    { id: 'alertas', label: 'Alertas Semáforo', icon: AlertOctagon },
  ];

  return (
    <aside className="sidebar">
      {/* Sidebar Header / Logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo-icon">
          <Pill size={22} />
        </div>
        <div>
          <h2 className="sidebar-title">PharmaStock</h2>
          <span style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: 600 }}>
            Pro v2.0
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{
                width: '100%',
                border: 'none',
                textAlign: 'left'
              }}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <Activity size={14} color="#10b981" />
          <span style={{ color: '#cbd5e1', fontWeight: 600 }}>Semáforo Activo</span>
        </div>
        <p>Sistema de Control de Farmacia &copy; 2026</p>
      </div>
    </aside>
  );
};

export default Sidebar;
