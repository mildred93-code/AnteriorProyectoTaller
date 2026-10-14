import React from 'react';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder = '',
  error = '',
  icon: Icon = null,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <div style={{ position: 'absolute', left: '12px', color: '#94a3b8', display: 'flex' }}>
            <Icon size={18} />
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: Icon ? '10px 12px 10px 38px' : '10px 12px',
            fontSize: '0.9rem',
            borderRadius: '8px',
            border: error ? '1px solid #ef4444' : '1px solid #cbd5e1',
            outline: 'none',
            transition: 'all 0.2s ease-in-out',
            backgroundColor: '#ffffff',
            color: '#0f172a'
          }}
          className={`custom-input ${className}`}
          {...props}
        />
      </div>
      {error && (
        <span style={{ fontSize: '0.775rem', color: '#ef4444', fontWeight: 500 }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default Input;
