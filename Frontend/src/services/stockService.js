import api from './api';

// Helper function to calculate semáforo status from expiration date string (YYYY-MM-DD)
export const calcularEstadoSemaforo = (fechaCaducidad) => {
  if (!fechaCaducidad) return { estado: 'verde', dias: 999, label: 'Sin caducidad' };
  
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const caducidad = new Date(fechaCaducidad);
  caducidad.setHours(0, 0, 0, 0);

  const diferenciaMs = caducidad.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diferenciaMs / (1000 * 60 * 60 * 24));

  if (diasRestantes <= 0) {
    return { estado: 'rojo', dias: diasRestantes, label: 'CADUCADO' };
  } else if (diasRestantes <= 15) {
    return { estado: 'rojo', dias: diasRestantes, label: `Urgente (${diasRestantes} días)` };
  } else if (diasRestantes <= 60) {
    return { estado: 'amarillo', dias: diasRestantes, label: `Por caducar (${diasRestantes} días)` };
  } else {
    return { estado: 'verde', dias: diasRestantes, label: `Óptimo (${diasRestantes} días)` };
  }
};

// Initial realistic pharmacy stock mock data
let mockProductosData = [
  {
    id: 101,
    codigo: 'MED-PAR-500',
    nombre: 'Paracetamol 500mg (Caja 20 Tab)',
    categoria: 'Analgésicos',
    stockTotal: 450,
    precio: 45.00,
    lotes: [
      { id: 'L-2024-01', codigoLote: 'LOT-9821', cantidad: 300, fechaCaducidad: '2027-08-15', ubicacion: 'Estante A-1' },
      { id: 'L-2024-02', codigoLote: 'LOT-4412', cantidad: 150, fechaCaducidad: '2026-10-20', ubicacion: 'Estante A-2' } // ~13 días: ROJO
    ]
  },
  {
    id: 102,
    codigo: 'MED-AMO-850',
    nombre: 'Amoxicilina 850mg (Caja 14 Tab)',
    categoria: 'Antibióticos',
    stockTotal: 180,
    precio: 120.50,
    lotes: [
      { id: 'L-2024-03', codigoLote: 'LOT-3320', cantidad: 180, fechaCaducidad: '2026-10-05', ubicacion: 'Estante B-3' } // Caducado hace 2 días: ROJO
    ]
  },
  {
    id: 103,
    codigo: 'MED-IBU-400',
    nombre: 'Ibuprofeno 400mg (Caja 30 Tab)',
    categoria: 'Antiinflamatorios',
    stockTotal: 620,
    precio: 68.00,
    lotes: [
      { id: 'L-2024-04', codigoLote: 'LOT-7719', cantidad: 400, fechaCaducidad: '2026-11-15', ubicacion: 'Estante C-1' }, // ~39 días: AMARILLO
      { id: 'L-2024-05', codigoLote: 'LOT-8822', cantidad: 220, fechaCaducidad: '2027-12-01', ubicacion: 'Estante C-2' }
    ]
  },
  {
    id: 104,
    codigo: 'MED-INS-GLA',
    nombre: 'Insulina Glargina 100 UI/ml (Pluma)',
    categoria: 'Endocrinología',
    stockTotal: 45,
    precio: 540.00,
    lotes: [
      { id: 'L-2024-06', codigoLote: 'LOT-1102', cantidad: 45, fechaCaducidad: '2026-11-02', ubicacion: 'Refrigerador 1' } // ~26 días: AMARILLO
    ]
  },
  {
    id: 105,
    codigo: 'MED-OME-20',
    nombre: 'Omeprazol 20mg (Caja 28 Caps)',
    categoria: 'Gastroenterología',
    stockTotal: 890,
    precio: 85.00,
    lotes: [
      { id: 'L-2024-07', codigoLote: 'LOT-9901', cantidad: 890, fechaCaducidad: '2028-01-10', ubicacion: 'Estante D-4' } // >60 días: VERDE
    ]
  },
  {
    id: 106,
    codigo: 'MED-LOR-5MG',
    nombre: 'Jarabe Loratadina 5mg/5ml (120ml)',
    categoria: 'Antihistamínicos',
    stockTotal: 120,
    precio: 95.00,
    lotes: [
      { id: 'L-2024-08', codigoLote: 'LOT-5510', cantidad: 120, fechaCaducidad: '2026-10-18', ubicacion: 'Estante E-2' } // ~11 días: ROJO
    ]
  }
];

export const stockService = {
  // GET /api/productos - Obtener todos los productos con su semáforo más crítico
  async getProductos() {
    try {
      const response = await api.get('/productos');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return this._procesarMockProductos();
    } catch (error) {
      console.warn('API /productos no disponible. Cargando catálogo mock.');
      return this._procesarMockProductos();
    }
  },

  // GET /api/lotes - Obtener lotes de un producto específico
  async getLotesByProducto(productoId) {
    try {
      const response = await api.get(`/lotes?productoId=${productoId}`);
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      const prod = mockProductosData.find(p => p.id === productoId);
      return prod ? prod.lotes : [];
    } catch (error) {
      const prod = mockProductosData.find(p => p.id === productoId);
      return prod ? prod.lotes : [];
    }
  },

  // POST /api/lotes - Registrar o asociar un nuevo lote a un producto
  async crearLote(nuevoLoteData) {
    try {
      const response = await api.post('/lotes', nuevoLoteData);
      return response.data;
    } catch (error) {
      console.warn('Simulando registro de lote en memoria local.');
      const { productoId, codigoLote, cantidad, fechaCaducidad, ubicacion } = nuevoLoteData;
      const productoIndex = mockProductosData.findIndex(p => p.id === Number(productoId));
      
      const nuevoLote = {
        id: `L-${Date.now()}`,
        codigoLote: codigoLote || `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
        cantidad: Number(cantidad),
        fechaCaducidad,
        ubicacion: ubicacion || 'Almacén Principal'
      };

      if (productoIndex !== -1) {
        mockProductosData[productoIndex].lotes.push(nuevoLote);
        mockProductosData[productoIndex].stockTotal += Number(cantidad);
      }

      return { mensaje: 'Lote registrado con éxito', lote: nuevoLote };
    }
  },

  // Helper privado para enriquecer productos con estado de semáforo global
  _procesarMockProductos() {
    return mockProductosData.map(producto => {
      let estadoGlobal = 'verde';
      let diasMinimos = 999;
      let loteCritico = null;

      if (producto.lotes && producto.lotes.length > 0) {
        producto.lotes.forEach(lote => {
          const semaforo = calcularEstadoSemaforo(lote.fechaCaducidad);
          if (semaforo.dias < diasMinimos) {
            diasMinimos = semaforo.dias;
            estadoGlobal = semaforo.estado;
            loteCritico = lote;
          }
        });
      }

      return {
        ...producto,
        semaforoEstado: estadoGlobal,
        diasParaCaducar: diasMinimos,
        loteCritico
      };
    });
  }
};
