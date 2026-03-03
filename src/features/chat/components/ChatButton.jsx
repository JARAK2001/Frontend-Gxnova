import React, { useEffect, useRef } from 'react';
import { useChat } from '../../../context/ChatContext';
import { MessageCircle, ChevronRight, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import ChatToast from './ChatToast';
import { useAuth } from '../../../context/AuthContext';

const ChatButton = () => {
    const {
        conversaciones,
        mensajesNoLeidos,
        cargarConversaciones,
        setMensajesNoLeidos,
        chatActivo,
        setChatActivo,
        isPanelOpen,
        setIsPanelOpen,
        notificacion,
        clearNotificacion,
    } = useChat();

    const { user } = useAuth();
    const panelRef = useRef(null);
    const btnRef = useRef(null);

    // Cerrar panel al hacer clic fuera (excluyendo el botón y el panel mismo)
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                panelRef.current && !panelRef.current.contains(e.target) &&
                btnRef.current && !btnRef.current.contains(e.target)
            ) {
                setIsPanelOpen(false);
            }
        };
        if (isPanelOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isPanelOpen, setIsPanelOpen]);

    const togglePanel = () => {
        if (!isPanelOpen) {
            cargarConversaciones();
            setMensajesNoLeidos(0);
        }
        setIsPanelOpen(prev => !prev);
    };

    const abrirConversacion = (conv) => {
        setChatActivo(conv);
        setIsPanelOpen(false);
    };

    return (
        <>
            {/* Toast de notificación (fuera de cualquier div posicionado) */}
            <ChatToast notificacion={notificacion} onClose={clearNotificacion} />

            {/* ChatWindow fuera del panelRef para que el clic en ella no cierre el panel */}
            {chatActivo && (
                <ChatWindow
                    conversacion={chatActivo}
                    onClose={() => setChatActivo(null)}
                />
            )}

            {/* Botón del ícono en la navbar */}
            <div className="relative">
                <button
                    ref={btnRef}
                    onClick={togglePanel}
                    className="relative p-2 text-gray-500 hover:text-orange-500 transition-colors rounded-full hover:bg-orange-50"
                    aria-label="Abrir mensajes"
                >
                    <MessageCircle className="w-6 h-6" />
                    {mensajesNoLeidos > 0 && (
                        <span style={{
                            position: 'absolute', top: '2px', right: '2px',
                            minWidth: '18px', height: '18px',
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            borderRadius: '999px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '10px', fontWeight: '700', color: 'white',
                            border: '2px solid white',
                            padding: '0 3px',
                            boxShadow: '0 2px 6px rgba(249,115,22,0.5)',
                            animation: 'pulseBadgeOrange 1.5s infinite',
                        }}>
                            <style>{`@keyframes pulseBadgeOrange { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }`}</style>
                            {mensajesNoLeidos > 9 ? '9+' : mensajesNoLeidos}
                        </span>
                    )}
                </button>

                {/* Panel desplegable */}
                {isPanelOpen && (
                    <div
                        ref={panelRef}
                        style={{
                            position: 'absolute',
                            right: 0,
                            top: 'calc(100% + 10px)',
                            width: '320px',
                            background: '#ffffff',
                            borderRadius: '16px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(249,115,22,0.1)',
                            border: '1px solid #fed7aa',
                            zIndex: 9000,
                            overflow: 'hidden',
                            animation: 'dropInLight 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }}
                    >
                        <style>{`
                            @keyframes dropInLight {
                                from { transform: translateY(-10px) scale(0.95); opacity: 0; }
                                to { transform: translateY(0) scale(1); opacity: 1; }
                            }
                        `}</style>

                        {/* Header del panel */}
                        <div style={{
                            padding: '14px 16px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            borderBottom: '1px solid #fee2e2',
                            background: 'linear-gradient(135deg, #fff7ed, #fff)',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <MessageCircle size={16} color="#f97316" />
                                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111827' }}>Mensajes</span>
                                {mensajesNoLeidos > 0 && (
                                    <span style={{
                                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                        color: 'white', borderRadius: '999px',
                                        fontSize: '10px', fontWeight: '700', padding: '1px 7px',
                                    }}>
                                        {mensajesNoLeidos}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => setIsPanelOpen(false)}
                                style={{
                                    background: '#fee2e2', border: 'none', borderRadius: '8px',
                                    padding: '5px', cursor: 'pointer', color: '#ef4444',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#fecaca'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fee2e2'}
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Lista de conversaciones */}
                        <div style={{ maxHeight: '380px', overflowY: 'auto' }}>
                            {!Array.isArray(conversaciones) || conversaciones.length === 0 ? (
                                <div style={{ padding: '36px 16px', textAlign: 'center' }}>
                                    <div style={{
                                        width: '52px', height: '52px', borderRadius: '50%',
                                        background: '#fff7ed',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 12px',
                                    }}>
                                        <MessageCircle size={24} color="#f97316" />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af' }}>No tienes mensajes aún.</p>
                                </div>
                            ) : (
                                conversaciones.map((conv) => {
                                    const receptor = conv.trabajador?.id_usuario === user?.id_usuario
                                        ? conv.empleador
                                        : conv.trabajador;
                                    const ultimoMensaje = conv.mensajes?.[0]?.contenido || 'Sin mensajes';
                                    const esActivo = chatActivo?.id_conversacion === conv.id_conversacion;

                                    return (
                                        <div
                                            key={conv.id_conversacion}
                                            onClick={() => abrirConversacion(conv)}
                                            style={{
                                                padding: '12px 16px',
                                                display: 'flex', alignItems: 'center', gap: '12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #f9fafb',
                                                background: esActivo ? '#fff7ed' : 'transparent',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseEnter={e => { if (!esActivo) e.currentTarget.style.background = '#fff7ed'; }}
                                            onMouseLeave={e => { if (!esActivo) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            <div style={{ position: 'relative', flexShrink: 0 }}>
                                                <img
                                                    src={receptor?.foto_perfil || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                                                    alt="Avatar"
                                                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #fed7aa' }}
                                                />
                                                <span style={{
                                                    position: 'absolute', bottom: 0, right: 0,
                                                    width: '10px', height: '10px', borderRadius: '50%',
                                                    background: '#22c55e', border: '2px solid white',
                                                }} />
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#111827', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {receptor?.nombre} {receptor?.apellido}
                                                </p>
                                                <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                    {ultimoMensaje}
                                                </p>
                                            </div>
                                            <ChevronRight size={14} color="#d1d5db" style={{ flexShrink: 0 }} />
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ChatButton;
