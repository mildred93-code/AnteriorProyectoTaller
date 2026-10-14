import React from 'react';
import SemaforoBadge from './SemaforoBadge';
import Button from '../common/Button';
import { Layers, Plus, Package } from 'lucide-react';

const StockTable = ({
  productos = [],
  onManageLotes = () => {},
  selectedFilter = 'all',
  onFilterChange = () => {}
}) => {
  return (
    <div className="content-card">
      {/* Table Top Filter Bar */}
      <div className="card-filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Package size={18} color="#0ea5e9" />
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>
            Inventario de Medicamentos ({productos.length})
          </h3>
        </div>

        {/* Semáforo Filters */}
        <div className="filter-group">
          <span style={{ fontSize: '0.775rem', fontWeight: 600, color: '#64748b' }}>
            Filtrar Semáforo:
          </span>
          <button
            onClick={() => onFilterChange('all')}
            className={`filter-btn ${selectedFilter === 'all' ? 'active-all' : ''}`}
          >
            Todos
          </button>
          <button
            onClick={() => onFilterChange('rojo')}
            className={`filter-btn ${selectedFilter === 'rojo' ? 'active-rojo' : ''}`}
          >
            🔴 Críticos (Caducados / &le;15d)
          </button>
          <button
            onClick={() => onFilterChange('amarillo')}
            className={`filter-btn ${selectedFilter === 'amarillo' ? 'active-amarillo' : ''}`}
          >
            🟡 Advertencia (16-60d)
          </button>
          <button
            onClick={() => onFilterChange('verde')}
            className={`filter-btn ${selectedFilter === 'verde' ? 'active-verde' : ''}`}
          >
            🟢 Óptimos (&gt;60d)
          </button>
        </div>
      </div>

      {/* Table Data */}
      <div className="table-container">
        {productos.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ fontSize: '1rem', fontWeight: 600 }}>No se encontraron medicamentos en el inventario.</p>
            <p style={{ fontSize: '0.85rem' }}>Prueba cambiando el filtro de búsqueda o semáforo.</p>
          </div>
        ) : (
          <table className="stock-table">
            <thead>
              <tr>
                <th>Código / Nombre</th>
                <th>Categoría</th>
                <th>Stock Total</th>
                <th>Lotes Registrados</th>
                <th>Estado Semáforo</th>
                <th style={{ textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>
                    <div className="product-info-cell">
                      <span className="product-name">{producto.nombre}</span>
                      <span className="product-code">{producto.codigo}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: '#f1f5f9',
                        borderRadius: '6px',
                        fontSize: '0.775rem',
                        fontWeight: 600,
                        color: '#475569'
                      }}
                    >
                      {producto.categoria}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                      {producto.stockTotal} <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>unid.</span>
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#0ea5e9' }}>
                      {producto.lotes ? producto.lotes.length : 0} Lote(s)
                    </span>
                  </td>
                  <td>
                    <SemaforoBadge
                      fechaCaducidad={producto.loteCritico?.fechaCaducidad}
                      estadoOverride={producto.semaforoEstado}
                      diasOverride={producto.diasParaCaducar}
                    />
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      icon={Layers}
                      onClick={() => onManageLotes(producto)}
                    >
                      Administrar Lotes
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StockTable;
