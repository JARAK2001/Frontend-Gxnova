import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle } from 'lucide-react';

function MisPostulaciones({ usuarioId }) {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtroTab, setFiltroTab] = useState('activas'); // 'activas' o 'historial'

    useEffect(() => {
        if (usuarioId) {
            cargarPostulaciones();
        }
    }, [usuarioId]);

    const cargarPostulaciones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/postulaciones?id_trabajador=${usuarioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if (res.ok) {
                setPostulaciones(data.postulaciones || []);
            }
        } catch (error) {
            console.error("Error cargando mis postulaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    // Clasificar postulaciones según la pestaña seleccionada
    // Activas: Estado pendiente o "aceptada" (pero el trabajo no está completado ni cancelado)
    // Historial: Estado "rechazada" o (Estado "aceptada" pero trabajo completado/cancelado)
    const filtradas = postulaciones.filter(post => {
        const esHistorial = post.estado === 'rechazada' ||
            (post.trabajo && (post.trabajo.estado === 'completado' || post.trabajo.estado === 'cancelado'));

        if (filtroTab === 'activas') return !esHistorial;
        return esHistorial;
    });

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-orange-600" />
                Mis Postulaciones
            </h2>

            {/* Sistema de Pestañas (Tabs) */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 max-w-sm">
                <button
                    onClick={() => setFiltroTab('activas')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${filtroTab === 'activas'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    En Curso / Pendientes
                </button>
                <button
                    onClick={() => setFiltroTab('historial')}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${filtroTab === 'historial'
                        ? 'bg-white text-orange-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Historial
                </button>
            </div>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2].map(i => (
                        <div key={i} className="h-24 bg-gray-100 rounded-lg w-full"></div>
                    ))}
                </div>
            ) : filtradas.length === 0 ? (
                <div className="p-8 bg-gray-50 rounded-lg text-center border border-gray-200">
                    <p className="text-gray-600 mb-4">
                        {filtroTab === 'activas'
                            ? "No tienes postulaciones activas por el momento."
                            : "Tu historial está vacío."}
                    </p>
                    {filtroTab === 'activas' && (
                        <Link
                            to="/servicios"
                            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium inline-block"
                        >
                            Explorar Trabajos
                        </Link>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {filtradas.map((postulacion) => (
                        <div key={postulacion.id_postulacion} className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            {/* Borde izquierdo de color para indicar estado */}
                            <div className={`absolute top-0 left-0 bottom-0 w-1 ${postulacion.estado === 'aceptada' ? 'bg-green-500' :
                                postulacion.estado === 'pendiente' ? 'bg-yellow-400' : 'bg-red-400'
                                }`}></div>

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 pr-12">
                                        {postulacion.trabajo ? (
                                            <Link to={`/detalles/${postulacion.trabajo.id_trabajo}`} className="hover:text-orange-600">
                                                {postulacion.trabajo.titulo}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-500 italic">Trabajo Eliminado</span>
                                        )}
                                    </h3>

                                    <p className="text-sm text-gray-500 mt-1 mb-3 flex items-center gap-2">
                                        Postulado el: {new Date(postulacion.fecha_postulacion).toLocaleDateString()}
                                    </p>

                                    <div className="flex flex-wrap items-center gap-2">
                                        {/* Badge de estado de la postulación */}
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${postulacion.estado === 'aceptada' ? 'bg-green-100 text-green-800' :
                                            postulacion.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {postulacion.estado === 'aceptada' && <CheckCircle className="w-3 h-3 mr-1" />}
                                            {postulacion.estado === 'rechazada' && <XCircle className="w-3 h-3 mr-1" />}
                                            {postulacion.estado === 'pendiente' && <Clock className="w-3 h-3 mr-1" />}
                                            {postulacion.estado.charAt(0).toUpperCase() + postulacion.estado.slice(1)}
                                        </span>

                                        {/* Badge de estado del Trabajo (solo si está aceptada y el trabajo está finalizado) */}
                                        {postulacion.trabajo && (postulacion.trabajo.estado === 'completado' || postulacion.trabajo.estado === 'cancelado') && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                                Trabajo {postulacion.trabajo.estado}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {postulacion.trabajo && (
                                    <Link
                                        to={`/detalles/${postulacion.trabajo.id_trabajo}`}
                                        className="text-orange-600 hover:text-orange-800 text-sm font-medium whitespace-nowrap"
                                    >
                                        Ver detalles →
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MisPostulaciones;
