import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import SemaforoBadge from './SemaforoBadge';
import { stockService, calcularEstadoSemaforo } from '../../services/stockService';
import { Calendar, Plus, Package, MapPin, Hash, CheckCircle } from 'lucide-react';

const LotesModal = ({ isOpen, onClose, producto, onRefreshStock }) => {
  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
  const [formData, setFormData] = useState({
    codigoLote: '',
    cantidad: '',
    fechaCaducidad: '',
    ubicacion: 'Estante A-1'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!producto) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleCreateLote = async (e) => {
    e.preventDefault();
    if (!formData.cantidad || !formData.fechaCaducidad) {
      setErrorMsg('Por favor completa la cantidad y la fecha de caducidad.');
      return;
    }

    setIsSubmitting(true);
    try {
      await stockService.crearLote({
        productoId: producto.id,
        codigoLote: formData.codigoLote || `LOT-${Math.floor(1000 + Math.random() * 9000)}`,
        cantidad: Number(formData.cantidad),
        fechaCaducidad: formData.fechaCaducidad,
        ubicacion: formData.ubicacion
      });

      setSuccessMsg('¡Lote registrado correctamente!');
      setIsSubmitting(false);

      setTimeout(() => {
        setSuccessMsg('');
        setFormData({ codigoLote: '', cantidad: '', fechaCaducidad: '', ubicacion: 'Estante A-1' });
        setActiveTab('list');
        if (onRefreshStock) onRefreshStock();
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setErrorMsg(err.message || 'Error al guardar el lote');
    }
  };

  // Preview semáforo dynamically as date is selected in form
  const semaforoPreview = formData.fechaCaducidad
    ? calcularEstadoSemaforo(formData.fechaCaducidad)
    : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Lotes de: ${producto.nombre}`}
      maxWidth="650px"
    >
      {/* Modal Tab Switcher */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', marginBottom: '1.25rem' }}>
        <button
          onClick={() => setActiveTab('list')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'list' ? '2.5px solid #0ea5e9' : 'none',
            color: activeTab === 'list' ? '#0ea5e9' : '#64748b',
            fontWeight: 700,
            cursor: 'pointer'
          }}
        >
          Lotes Existentes ({producto.lotes ? producto.lotes.length : 0})
        </button>
        <button
          onClick={() => setActiveTab('create')}
          style={{
            flex: 1,
            padding: '10px',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'create' ? '2.5px solid #0ea5e9' : 'none',
            color: activeTab === 'create' ? '#0ea5e9' : '#64748b',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Plus size={16} /> Registrar Nuevo Lote
        </button>
      </div>

      {/* Tab 1: List Lotes */}
      {activeTab === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(!producto.lotes || producto.lotes.length === 0) ? (
            <p style={{ textAlign: 'center', color: '#94a3b8', padding: '1.5rem' }}>
              Este producto no tiene lotes registrados aún.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {producto.lotes.map((lote) => (
                <div
                  key={lote.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                        {lote.codigoLote}
                      </span>
                      <span style={{ fontSize: '0.75rem', background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', color: '#475569', fontWeight: 600 }}>
                        {lote.ubicacion || 'Sin ubicación'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '12px' }}>
                      <span>Cantidad: <strong style={{ color: '#0f172a' }}>{lote.cantidad} unid.</strong></span>
                      <span>Caducidad: <strong style={{ color: '#0f172a' }}>{lote.fechaCaducidad}</strong></span>
                    </div>
                  </div>

                  <SemaforoBadge fechaCaducidad={lote.fechaCaducidad} />
                </div>
              ))}
            </div>
          )}

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="secondary" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      )}

      {/* Tab 2: Create Lote Form */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateLote} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {successMsg && (
            <div style={{ padding: '10px', background: '#d1fae5', color: '#065f46', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle size={18} />
              <span>{successMsg}</span>
            </div>
          )}

          {errorMsg && (
            <div style={{ padding: '10px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              {errorMsg}
            </div>
          )}

          <Input
            label="Código / Número de Lote"
            name="codigoLote"
            placeholder="Ej: LOT-9982 (opcional)"
            value={formData.codigoLote}
            onChange={handleChange}
            icon={Hash}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Cantidad a Ingresar"
              name="cantidad"
              type="number"
              placeholder="Ej: 100"
              value={formData.cantidad}
              onChange={handleChange}
              icon={Package}
              required
            />

            <Input
              label="Fecha de Caducidad"
              name="fechaCaducidad"
              type="date"
              value={formData.fechaCaducidad}
              onChange={handleChange}
              icon={Calendar}
              required
            />
          </div>

          <Input
            label="Ubicación / Estante"
            name="ubicacion"
            placeholder="Ej: Estante B-2, Refrigerador 1"
            value={formData.ubicacion}
            onChange={handleChange}
            icon={MapPin}
          />

          {/* Real-time Dynamic Semáforo Indicator Preview */}
          {semaforoPreview && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
                Vista Previa Semáforo:
              </span>
              <SemaforoBadge
                estadoOverride={semaforoPreview.estado}
                diasOverride={semaforoPreview.dias}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
            <Button variant="secondary" onClick={() => setActiveTab('list')}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" isLoading={isSubmitting}>
              Guardar Lote
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};

export default LotesModal;
