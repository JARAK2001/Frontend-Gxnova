import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { MessageCircle, X } from 'lucide-react';

const ChatToast = ({ notificacion, onClose }) => {
    const [visible, setVisible] = useState(false);
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        if (notificacion) {
            setVisible(true);
            setClosing(false);
            const timer = setTimeout(() => handleClose(), 4500);
            return () => clearTimeout(timer);
        }
    }, [notificacion]);

    const handleClose = () => {
        setClosing(true);
        setTimeout(() => {
            setVisible(false);
            onClose();
        }, 300);
    };

    if (!visible || !notificacion) return null;

    return ReactDOM.createPortal(
        <div
            style={{
                position: 'fixed',
                bottom: '90px',
                right: '20px',
                zIndex: 9999,
                width: '300px',
                background: '#ffffff',
                borderRadius: '14px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.15), 0 2px 10px rgba(249,115,22,0.15)',
                border: '1px solid #fed7aa',
                overflow: 'hidden',
                transform: closing ? 'translateX(120%)' : 'translateX(0)',
                opacity: closing ? 0 : 1,
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                animation: !closing ? 'slideInToast 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'none',
            }}
        >
            <style>{`
                @keyframes slideInToast {
                    from { transform: translateX(120%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes progressBarOrange {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>

            {/* Barra de progreso naranja */}
            <div style={{
                height: '3px',
                background: 'linear-gradient(90deg, #f97316, #ea580c)',
                animation: 'progressBarOrange 4.5s linear forwards',
            }} />

            <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Avatar o ícono */}
                <div style={{ flexShrink: 0, position: 'relative' }}>
                    {notificacion.foto ? (
                        <img
                            src={notificacion.foto}
                            alt="Avatar"
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fed7aa' }}
                        />
                    ) : (
                        <div style={{
                            width: '42px', height: '42px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <MessageCircle size={20} color="white" />
                        </div>
                    )}
                    <span style={{
                        position: 'absolute', bottom: 0, right: 0,
                        width: '11px', height: '11px', borderRadius: '50%',
                        background: '#22c55e', border: '2px solid white'
                    }} />
                </div>

                {/* Texto */}
                <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificacion.nombre}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {notificacion.contenido}
                    </p>
                </div>

                {/* Botón cerrar */}
                <button
                    onClick={handleClose}
                    style={{
                        flexShrink: 0, background: '#fee2e2',
                        border: 'none', borderRadius: '8px', padding: '5px',
                        cursor: 'pointer', color: '#ef4444', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                        transition: 'background 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                    onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                >
                    <X size={13} />
                </button>
            </div>
        </div>,
        document.body
    );
};

export default ChatToast;
