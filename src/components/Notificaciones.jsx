import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from '../config/api';
import Encabezado from "./Encabezado";

function Notificaciones() {
    const navigate = useNavigate();
    const [notificaciones, setNotificaciones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/auth");
            return;
        }
        cargarNotificaciones();
    }, []);

    const cargarNotificaciones = async () => {
        const token = localStorage.getItem("token");
        setLoading(true);
        try {
            const respuesta = await fetch(`${API_URL}/api/notificaciones`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (respuesta.status === 401) {
                localStorage.removeItem("token");
                navigate("/auth");
                return;
            }

            const data = await respuesta.json();
            if (data.notificaciones) {
                setNotificaciones(data.notificaciones);
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const marcarComoLeida = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const respuesta = await fetch(
                `${API_URL}/api/notificaciones/${id}/leida`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (respuesta.ok) {
                cargarNotificaciones();
            }
        } catch (error) {
            console.error("Error al marcar como leída:", error);
        }
    };

    const marcarTodasComoLeidas = async () => {
        const token = localStorage.getItem("token");
        try {
            const respuesta = await fetch(
                `${API_URL}/api/notificaciones/marcar-todas-leidas`,
                {
                    method: "PATCH",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (respuesta.ok) {
                cargarNotificaciones();
            }
        } catch (error) {
            console.error("Error al marcar todas como leídas:", error);
        }
    };

    const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

    if (loading) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">Cargando notificaciones...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Notificaciones</h1>
                    {notificacionesNoLeidas > 0 && (
                        <button
                            onClick={marcarTodasComoLeidas}
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </div>

                {notificaciones.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <p className="text-gray-500">No tienes notificaciones</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notificaciones.map((notif) => (
                            <div
                                key={notif.id_notificacion}
                                onClick={() => {
                                    if (notif.enlace) {
                                        navigate(notif.enlace);
                                        if (!notif.leida) {
                                            marcarComoLeida(notif.id_notificacion);
                                        }
                                    }
                                }}
                                className={`bg-white rounded-lg shadow-md p-6 ${!notif.leida ? "border-l-4 border-orange-600" : ""
                                    } ${notif.enlace ? "cursor-pointer hover:shadow-lg transition-shadow" : ""}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span
                                                className={`px-3 py-1 text-xs font-semibold rounded-full ${!notif.leida
                                                    ? "bg-orange-100 text-orange-800"
                                                    : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {notif.tipo}
                                            </span>
                                            {!notif.leida && (
                                                <span className="w-2 h-2 bg-orange-600 rounded-full"></span>
                                            )}
                                        </div>
                                        {notif.mensaje && (
                                            <p className="text-gray-900 mb-2">{notif.mensaje}</p>
                                        )}
                                        <p className="text-sm text-gray-500">
                                            {new Date(notif.fecha).toLocaleString("es-CO")}
                                        </p>
                                    </div>
                                    {!notif.leida && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                marcarComoLeida(notif.id_notificacion);
                                            }}
                                            className="ml-4 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                                        >
                                            Marcar como leída
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notificaciones;

