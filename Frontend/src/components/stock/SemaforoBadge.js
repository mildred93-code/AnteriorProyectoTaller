import React from 'react';
import { calcularEstadoSemaforo } from '../../services/stockService';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';

const SemaforoBadge = ({ fechaCaducidad, estadoOverride = null, diasOverride = null }) => {
  let estado = estadoOverride;
  let dias = diasOverride;
  let label = '';

  if (!estado && fechaCaducidad) {
    const res = calcularEstadoSemaforo(fechaCaducidad);
    estado = res.estado;
    dias = res.dias;
    label = res.label;
  }

  const getIcon = () => {
    switch (estado) {
      case 'rojo':
        return <AlertCircle size={15} />;
      case 'amarillo':
        return <AlertTriangle size={15} />;
      case 'verde':
      default:
        return <CheckCircle2 size={15} />;
    }
  };

  const getDisplayText = () => {
    if (label) return label;
    if (estado === 'rojo') {
      return dias <= 0 ? 'CADUCADO' : `URGENTE (${dias}d)`;
    }
    if (estado === 'amarillo') {
      return `POR CADUCAR (${dias}d)`;
    }
    return `VIGENTE (${dias}d)`;
  };

  return (
    <div className={`badge-semaforo ${estado || 'verde'}`}>
      <span className={`dot-indicator ${estado || 'verde'}`} />
      {getIcon()}
      <span>{getDisplayText()}</span>
    </div>
  );
};

export default SemaforoBadge;
