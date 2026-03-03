import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import API_URL from '../config/api';

const ChatContext = createContext(null);

export const useChat = () => {
    return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [conversaciones, setConversaciones] = useState([]);
    const [mensajesNoLeidos, setMensajesNoLeidos] = useState(0);
    const [chatActivo, setChatActivo] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    const [notificacion, setNotificacion] = useState(null);

    const cargarConversaciones = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/chat/conversaciones`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setConversaciones(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error cargando conversaciones", error);
        }
    }, []);

    useEffect(() => {
        if (user && user.id_usuario) {
            const URL_BACKEND = import.meta.env.VITE_API_URL || API_URL || 'http://localhost:4000';
            const newSocket = io(URL_BACKEND);
            setSocket(newSocket);

            newSocket.on('connect', () => {
                console.log('Conectado al servidor de chat:', newSocket.id);
                newSocket.emit('join_personal_room', user.id_usuario);
            });

            // El backend emite: { chatId, mensaje: { id_emisor, contenido, ... } }
            newSocket.on('new_chat_notification', (data) => {
                console.log("Nueva notificación de chat recibida:", data);
                setMensajesNoLeidos(prev => prev + 1);

                // Extraer contenido del mensaje que envió el backend
                const contenido = data.mensaje?.contenido || data.contenido || 'Nuevo mensaje';

                // Buscar el nombre del emisor en las conversaciones cargadas si están disponibles
                // Por ahora mostramos un toast genérico, el nombre se puede mejorar
                setNotificacion({
                    nombre: 'Mensaje nuevo',
                    contenido,
                    foto: null,
                    chatId: data.chatId,
                });

                cargarConversaciones();
            });

            // También escuchar receive_message para notificar si el chat está cerrado
            newSocket.on('receive_message', (msgData) => {
                // Solo mostrar notificación si el mensaje es de OTRA persona y el chat está cerrado
                if (msgData.id_emisor && msgData.id_emisor !== user.id_usuario) {
                    setNotificacion(prev => {
                        // Evitar duplicar si ya hay una notificación de new_chat_notification
                        if (prev) return prev;
                        return {
                            nombre: 'Mensaje nuevo',
                            contenido: msgData.contenido || 'Tienes un mensaje',
                            foto: null,
                        };
                    });
                }
            });

            return () => {
                newSocket.disconnect();
            };
        }
    }, [user, cargarConversaciones]);

    const joinChat = (chatId) => {
        if (socket) {
            socket.emit('join_chat', chatId);
        }
    };

    const abrirChat = (datos) => {
        setChatActivo(datos);
        setIsPanelOpen(false);
    };

    const cerrarChat = () => {
        setChatActivo(null);
    };

    const clearNotificacion = () => setNotificacion(null);

    return (
        <ChatContext.Provider value={{
            socket,
            conversaciones,
            cargarConversaciones,
            joinChat,
            mensajesNoLeidos,
            setMensajesNoLeidos,
            chatActivo,
            setChatActivo,
            abrirChat,
            cerrarChat,
            isPanelOpen,
            setIsPanelOpen,
            notificacion,
            clearNotificacion,
        }}>
            {children}
        </ChatContext.Provider>
    );
};
