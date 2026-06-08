import { useEffect, useRef } from 'react';

export default function Toast({ message, sub, onClose, duration = 8000 }) {
  const timerRef = useRef();

  useEffect(() => {
    timerRef.current = setTimeout(onClose, duration);
    return () => clearTimeout(timerRef.current);
  }, [onClose, duration]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: '#1e293b',
        color: '#fff',
        padding: '12px 22px',
        borderRadius: 99,
        fontSize: 14,
        fontWeight: 500,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        zIndex: 9999,
        animation: 'slideUp 0.3s ease',
        pointerEvents: 'none',
      }}
    >
      <i className="bi bi-cloud-download" style={{ color: '#6366f1', fontSize: 16 }}></i>
      <span>
        {message}{' '}
        {sub && <span style={{ color: '#94a3b8', fontSize: 12 }}>{sub}</span>}
      </span>
    </div>
  );
}
