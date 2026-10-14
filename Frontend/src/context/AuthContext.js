import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session state on load
  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('usuario');

      if (storedToken && storedUser) {
        try {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parseando información de usuario local:', e);
          authService.logout();
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(email, password);
      setUser(data.usuario);
      setToken(data.token);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      setLoading(false);
      throw err;
    }
  };

  // Register handler
  const register = async (nombre, email, password, rol) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.registro(nombre, email, password, rol);
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message || 'Error al registrar usuario');
      setLoading(false);
      throw err;
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token && !!user,
    login,
    register,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to consume AuthContext safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};

export default AuthContext;
