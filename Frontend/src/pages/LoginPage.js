import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Pill, Mail, Lock, User, Shield, AlertCircle } from 'lucide-react';
import '../assets/styles/login.css';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: 'Farmacéutico'
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.nombre, formData.email, formData.password, formData.rol);
        await login(formData.email, formData.password);
      }
      setLoading(false);
      navigate('/dashboard');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.message || 'Credenciales inválidas o error en servidor.');
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin') {
      setFormData({
        nombre: 'Dra. María González',
        email: 'admin@farmacia.com',
        password: 'password123',
        rol: 'Administrador'
      });
    } else {
      setFormData({
        nombre: 'Lic. Carlos Ruiz',
        email: 'farmaceutico@farmacia.com',
        password: 'password123',
        rol: 'Farmacéutico'
      });
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        {/* Header & Logo */}
        <div className="login-header">
          <div className="login-logo">
            <Pill size={32} />
          </div>
          <h1 className="login-title">PharmaStock Pro</h1>
          <p className="login-subtitle">Gestión de Inventario y Semáforo de Caducidad</p>
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs">
          <button
            type="button"
            className={`tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            className={`tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
          >
            Registrar Usuario
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(239, 68, 68, 0.2)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              color: '#fca5a5',
              fontSize: '0.85rem',
              fontWeight: 600,
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <AlertCircle size={18} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <Input
              label="Nombre Completo"
              name="nombre"
              placeholder="Ej: Dra. Elena Ramírez"
              value={formData.nombre}
              onChange={handleChange}
              icon={User}
              required
            />
          )}

          <Input
            label="Correo Electrónico"
            type="email"
            name="email"
            placeholder="usuario@farmacia.com"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            icon={Lock}
            required
          />

          {!isLogin && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
                Rol de Usuario
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Shield size={18} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '8px',
                    background: 'rgba(15, 23, 42, 0.7)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: '#ffffff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="Farmacéutico" style={{ background: '#1e293b' }}>Farmacéutico</option>
                  <option value="Administrador" style={{ background: '#1e293b' }}>Administrador</option>
                </select>
              </div>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={loading}
            style={{ marginTop: '0.75rem', width: '100%' }}
          >
            {isLogin ? 'Ingresar al Sistema' : 'Crear Cuenta'}
          </Button>
        </form>

        {/* Quick Demo Credential Buttons */}
        <div className="demo-credentials">
          <p className="demo-credentials-title">Acceso Rápido de Prueba</p>
          <div className="demo-buttons">
            <button
              type="button"
              className="demo-btn"
              onClick={() => fillDemo('admin')}
            >
              Demo Admin
            </button>
            <button
              type="button"
              className="demo-btn"
              onClick={() => fillDemo('farmaceutico')}
            >
              Demo Farmacéutico
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;