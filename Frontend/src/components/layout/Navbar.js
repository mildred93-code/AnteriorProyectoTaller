import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Bell, LogOut, ShieldCheck, AlertTriangle } from 'lucide-react';
import Button from '../common/Button';

const Navbar = ({ search = '', onSearchChange = () => {}, alertCount = 0 }) => {
  const { user, logout } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <header className="navbar">
      {/* Search Input Bar */}
      <div className="navbar-search">
        <Search className="navbar-search-icon" size={18} />
        <input
          type="text"
          placeholder="Buscar producto, código o lote..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Right Side User Profile & Actions */}
      <div className="navbar-actions">
        {/* Quick Expiration Alert Indicator */}
        {alertCount > 0 && (
          <div
            title={`${alertCount} medicamentos caducados o por caducar`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#dc2626',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <AlertTriangle size={16} />
            <span>{alertCount} Alertas</span>
          </div>
        )}

        {/* User Profile Pill */}
        <div className="user-profile-badge">
          <div className="avatar">{getInitials(user?.nombre)}</div>
          <div className="user-info">
            <span className="user-name">{user?.nombre || 'Usuario Farmacia'}</span>
            <span className="user-role" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <ShieldCheck size={12} color="#0ea5e9" />
              {user?.rol || 'Farmacéutico'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          icon={LogOut}
          title="Cerrar sesión"
        >
          Salir
        </Button>
      </div>
    </header>
  );
};

export default Navbar;
