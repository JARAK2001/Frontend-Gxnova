import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { useChat } from '../../../context/ChatContext';
import { useAuth } from '../../../context/AuthContext';
import API_URL from '../../../config/api';
import { X, Send, Minus } from 'lucide-react';

const ChatWindow = ({ conversacion, onClose }) => {
    const { socket, joinChat, cerrarChat } = useChat();
    const { user } = useAuth();

    // Función de cierre que usa tanto el prop como el contexto (doble seguro)
    const handleClose = (e) => {
        if (e) e.stopPropagation();
        cerrarChat();
        if (onClose) onClose();
    };
    const [mensajes, setMensajes] = useState([]);
    const [nuevoMensaje, setNuevoMensaje] = useState("");
    const [minimizado, setMinimizado] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const mensajesFinRef = useRef(null);
    const inputRef = useRef(null);

    if (!user || !conversacion) return null;

    const chatId = conversacion.id_conversacion;

    const receptor = conversacion.trabajador?.id_usuario === user.id_usuario
        ? conversacion.empleador
        : conversacion.trabajador;

    useEffect(() => {
        if (chatId) {
            joinChat(chatId);
            cargarHistorial(chatId);
        } else {
            setMensajes([]);
        }

        if (socket) {
            const handleMessage = (msgData) => {
                if (chatId && msgData.id_conversacion === chatId) {
                    setMensajes((prev) => [...prev, msgData]);
                }
            };
            socket.on('receive_message', handleMessage);
            return () => socket.off('receive_message', handleMessage);
        }
    }, [chatId, socket, user?.id_usuario]);

    useEffect(() => {
        if (!minimizado) {
            mensajesFinRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [mensajes, minimizado]);

    useEffect(() => {
        if (!minimizado) {
            setTimeout(() => inputRef.current?.focus(), 150);
        }
    }, [minimizado]);

    const cargarHistorial = async (id) => {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/api/chat/conversaciones/${id}/mensajes`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setMensajes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error al cargar historial", error);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!nuevoMensaje.trim() || enviando) return;

        setEnviando(true);
        const token = localStorage.getItem('token');
        try {
            const payload = {
                contenido: nuevoMensaje,
                id_receptor: receptor?.id_usuario,
                id_trabajo: conversacion.id_trabajo || null,
            };
            if (chatId) payload.id_conversacion = chatId;

            await fetch(`${API_URL}/api/chat/mensajes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            setNuevoMensaje("");
        } catch (error) {
            console.error("Error enviando mensaje", error);
        } finally {
            setEnviando(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend(e);
        }
    };

    const formatTime = (fecha) => {
        if (!fecha) return '';
        const d = new Date(fecha);
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    return ReactDOM.createPortal(
        <>
            <style>{`
                @keyframes slideUpChat {
                    from { transform: translateY(20px) scale(0.97); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes msgBubble {
                    from { transform: translateY(5px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .chat-bubble { animation: msgBubble 0.18s ease-out; }
                .chat-win-scroll::-webkit-scrollbar { width: 4px; }
                .chat-win-scroll::-webkit-scrollbar-track { background: transparent; }
                .chat-win-scroll::-webkit-scrollbar-thumb { background: #fed7aa; border-radius: 4px; }
                .chat-win-scroll::-webkit-scrollbar-thumb:hover { background: #fdba74; }
                .chat-win-input:focus { outline: none; box-shadow: 0 0 0 2px rgba(249,115,22,0.3); border-color: #f97316; }
                .chat-send-btn:hover:not(:disabled) { transform: scale(1.08); }
            `}</style>

            <div style={{
                position: 'fixed',
                bottom: '16px',
                right: '16px',
                width: '340px',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '18px',
                overflow: 'hidden',
                zIndex: 9100,
                boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 20px rgba(249,115,22,0.12)',
                border: '1px solid #fed7aa',
                animation: 'slideUpChat 0.3s cubic-bezier(0.34, 1.36, 0.64, 1)',
                background: '#fff',
            }}>

                {/* ── CABECERA ── */}
                <div style={{
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    padding: '12px 14px',
                    display: 'flex', alignItems: 'center', gap: '10px',
                }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                        <img
                            src={receptor?.foto_perfil || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"}
                            alt="perfil"
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.5)' }}
                        />
                        <span style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: '10px', height: '10px', borderRadius: '50%',
                            background: '#86efac', border: '2px solid #ea580c'
                        }} />
                    </div>

                    {/* Nombre */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {receptor?.nombre} {receptor?.apellido}
                        </p>
                        <p style={{ margin: '1px 0 0', fontSize: '11px', color: '#fed7aa' }}>En línea</p>
                    </div>

                    {/* Botones minimizar y cerrar */}
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                        <button
                            onClick={() => setMinimizado(m => !m)}
                            title={minimizado ? 'Expandir' : 'Minimizar'}
                            style={{
                                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px',
                                padding: '5px', cursor: 'pointer', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.3)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            <Minus size={14} />
                        </button>
                        <button
                            onClick={handleClose}
                            title="Cerrar chat"
                            style={{
                                background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '8px',
                                padding: '5px', cursor: 'pointer', color: 'white',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* ── MENSAJES ── */}
                {!minimizado && (
                    <>
                        <div
                            className="chat-win-scroll"
                            style={{
                                padding: '14px',
                                overflowY: 'auto',
                                height: '270px',
                                background: '#fafafa',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}
                        >
                            {mensajes.length === 0 && (
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: 0.5 }}>
                                    <div style={{
                                        width: '46px', height: '46px', borderRadius: '50%',
                                        background: '#fff7ed',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Send size={18} color="#f97316" />
                                    </div>
                                    <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', textAlign: 'center' }}>
                                        Sé el primero en enviar un mensaje
                                    </p>
                                </div>
                            )}

                            {mensajes.map((msg, index) => {
                                const esMio = msg.id_emisor === user.id_usuario;
                                return (
                                    <div key={index} className="chat-bubble" style={{ display: 'flex', justifyContent: esMio ? 'flex-end' : 'flex-start' }}>
                                        <div style={{
                                            maxWidth: '78%',
                                            padding: '9px 12px',
                                            borderRadius: esMio ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                                            background: esMio
                                                ? 'linear-gradient(135deg, #f97316, #ea580c)'
                                                : '#ffffff',
                                            color: esMio ? '#fff' : '#1f2937',
                                            fontSize: '13px',
                                            lineHeight: '1.5',
                                            boxShadow: esMio
                                                ? '0 3px 12px rgba(249,115,22,0.3)'
                                                : '0 1px 6px rgba(0,0,0,0.08)',
                                            border: esMio ? 'none' : '1px solid #f3f4f6',
                                            wordBreak: 'break-word',
                                        }}>
                                            {msg.contenido}
                                            {(msg.enviado_en || msg.fecha_envio) && (
                                                <div style={{ fontSize: '10px', marginTop: '4px', opacity: 0.65, textAlign: esMio ? 'right' : 'left' }}>
                                                    {formatTime(msg.enviado_en || msg.fecha_envio)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={mensajesFinRef} />
                        </div>

                        {/* ── INPUT ── */}
                        <form
                            onSubmit={handleSend}
                            style={{
                                padding: '10px 12px',
                                background: '#ffffff',
                                borderTop: '1px solid #f3f4f6',
                                display: 'flex',
                                gap: '8px',
                                alignItems: 'center',
                            }}
                        >
                            <input
                                ref={inputRef}
                                className="chat-win-input"
                                type="text"
                                value={nuevoMensaje}
                                onChange={(e) => setNuevoMensaje(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Escribe un mensaje..."
                                style={{
                                    flex: 1,
                                    background: '#f9fafb',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '12px',
                                    padding: '9px 14px',
                                    fontSize: '13px',
                                    color: '#1f2937',
                                    transition: 'box-shadow 0.2s, border-color 0.2s',
                                }}
                            />
                            <button
                                type="submit"
                                className="chat-send-btn"
                                disabled={!nuevoMensaje.trim() || enviando}
                                style={{
                                    background: nuevoMensaje.trim() && !enviando
                                        ? 'linear-gradient(135deg, #f97316, #ea580c)'
                                        : '#f3f4f6',
                                    border: 'none',
                                    borderRadius: '12px',
                                    width: '38px',
                                    height: '38px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: nuevoMensaje.trim() && !enviando ? 'pointer' : 'not-allowed',
                                    transition: 'background 0.2s, transform 0.15s',
                                    flexShrink: 0,
                                    boxShadow: nuevoMensaje.trim() && !enviando ? '0 3px 10px rgba(249,115,22,0.35)' : 'none',
                                }}
                            >
                                <Send size={15} color={nuevoMensaje.trim() && !enviando ? 'white' : '#9ca3af'} />
                            </button>
                        </form>
                    </>
                )}
            </div>
        </>,
        document.body
    );
};

export default ChatWindow;
