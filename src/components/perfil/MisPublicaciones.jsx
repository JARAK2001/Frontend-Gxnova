import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { Link } from "react-router-dom";
import { Inbox } from 'lucide-react';

function MisPublicaciones({ usuarioId }) {
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (usuarioId) {
            cargarMios();
        }
    }, [usuarioId]);

    const cargarMios = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/trabajos?id_empleador=${usuarioId}`);
            const data = await res.json();
            if (res.ok) {
                setTrabajos(data.trabajos || []);
            }
        } catch (error) {
            console.error("Error cargando mis publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p className="text-gray-500 mt-4">Cargando tus publicaciones...</p>;

    if (trabajos.length === 0) {
        return (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg text-center border border-gray-200">
                <p className="text-gray-600 mb-4">No has publicado ningún trabajo aún.</p>
                <Link
                    to="/crear-trabajo"
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-medium"
                >
                    Publicar mi primer trabajo
                </Link>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Mis Publicaciones</h2>
            <div className="space-y-4">
                {trabajos.map((job) => (
                    <div key={job.id_trabajo} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    <Link to={`/detalles/${job.id_trabajo}`} className="hover:text-orange-600">
                                        {job.titulo}
                                    </Link>
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 mb-2">
                                    Publicado el: {new Date(job.fecha_creacion).toLocaleDateString()}
                                </p>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${job.estado === 'publicado' ? 'bg-green-100 text-green-800' :
                                    job.estado === 'completado' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {job.estado}
                                </span>
                            </div>
                            <Link
                                to={`/detalles/${job.id_trabajo}`}
                                className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                            >
                                Ver detalles →
                            </Link>
                        </div>
                        {/* Stats rápidas (opcional) */}
                        {job.postulaciones && job.postulaciones.length > 0 && (
                            <div className="mt-3 text-sm text-gray-600">
                                <Inbox className="w-4 h-4 inline mr-1" /> {job.postulaciones.length} postulaciones
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MisPublicaciones;
