import api from './api';

export const authService = {
  // Conexión con POST /api/auth/login
  async login(email, password) {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('usuario', JSON.stringify(response.data.usuario || { email, nombre: 'Usuario Farmacia' }));
      }
      return response.data;
    } catch (error) {
      // Fallback demo simulation if backend is unreachable or returning error in dev environment
      if (!error.response || error.code === 'ERR_NETWORK') {
        console.warn('Servidor Backend no alcanzado. Usando modo demostración local.');
        const mockUser = {
          id: 1,
          nombre: email.includes('admin') ? 'Dra. María González' : 'Lic. Carlos Ruiz',
          email: email,
          rol: email.includes('admin') ? 'Administrador' : 'Farmacéutico'
        };
        const mockToken = 'mock-jwt-token-farmacia-2026';
        localStorage.setItem('token', mockToken);
        localStorage.setItem('usuario', JSON.stringify(mockUser));
        return { token: mockToken, usuario: mockUser };
      }
      throw error.response?.data?.mensaje ? new Error(error.response.data.mensaje) : error;
    }
  },

  // Conexión con POST /api/auth/registro
  async registro(nombre, email, password, rol = 'Farmacéutico') {
    try {
      const response = await api.post('/auth/registro', { nombre, email, password, rol });
      return response.data;
    } catch (error) {
      if (!error.response || error.code === 'ERR_NETWORK') {
        return { mensaje: 'Usuario registrado exitosamente (Modo Demo)', usuario: { nombre, email, rol } };
      }
      throw error.response?.data?.mensaje ? new Error(error.response.data.mensaje) : error;
    }
  },

  // Conexión con GET /api/auth/perfil
  async getPerfil() {
    try {
      const response = await api.get('/auth/perfil');
      return response.data.usuario;
    } catch (error) {
      const savedUser = localStorage.getItem('usuario');
      if (savedUser) return JSON.parse(savedUser);
      throw error;
    }
  },

  // Cerrar sesión
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
};
