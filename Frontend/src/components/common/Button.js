import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon = null,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return {
          background: '#e2e8f0',
          color: '#1e293b',
          border: '1px solid #cbd5e1'
        };
      case 'danger':
        return {
          background: '#ef4444',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        };
      case 'success':
        return {
          background: '#10b981',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
        };
      case 'outline':
        return {
          background: 'transparent',
          color: '#0ea5e9',
          border: '1.5px solid #0ea5e9'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: '#64748b',
          border: 'none'
        };
      case 'primary':
      default:
        return {
          background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.35)'
        };
    }
  };

  const getSizePadding = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '0.8rem' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '1rem' };
      case 'md':
      default:
        return { padding: '9px 18px', fontSize: '0.875rem' };
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontWeight: 600,
    borderRadius: '8px',
    cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
    opacity: disabled || isLoading ? 0.65 : 1,
    transition: 'all 0.18s ease-in-out',
    ...getVariantStyles(),
    ...getSizePadding()
  };

  return (
    <button
      type={type}
      style={baseStyle}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`custom-btn ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};

export default Button;
