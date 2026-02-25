import React from "react";
import { useNavigate } from "react-router-dom";
import { Flame, MapPin, AlertCircle } from 'lucide-react';

function TrabajosDestacados({ trabajos, loading, titulo }) {
    const navigate = useNavigate();

    const formatearPrecio = (monto) => {
        if (!monto) return "A convenir";
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(monto);
    };

    const esUrgente = (fecha) => {
        if (!fecha) return false;
        const fechaEstimada = new Date(fecha);
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        return fechaEstimada <= manana && fechaEstimada >= new Date();
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        {titulo || "Trabajos Destacados"}
                    </h2>
                    <p className="text-gray-600">
                        Proyectos recientes que buscan talento
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Cargando trabajos...</p>
                    </div>
                ) : trabajos.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No hay trabajos disponibles</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trabajos.map((trabajo) => {
                            const urgente = esUrgente(trabajo.fecha_estimada);
                            return (
                                <div
                                    key={trabajo.id_trabajo}
                                    className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 cursor-pointer relative overflow-hidden ${urgente ? 'border-2 border-red-500' : ''
                                        }`}
                                    onClick={() => navigate(`/detalles/${trabajo.id_trabajo}`)}
                                >
                                    {urgente && (
                                        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                                            <Flame className="w-4 h-4 inline mr-1" /> URGENTE
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-3">
                                        <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                                            {trabajo.categoria?.nombre || "Sin categoría"}
                                        </span>
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${trabajo.estado === 'publicado' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {trabajo.estado}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                        {trabajo.titulo}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                        {trabajo.descripcion}
                                    </p>

                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Tipo de pago:</p>
                                            <p className="font-semibold text-gray-900 capitalize">
                                                {trabajo.tipo_pago === "dinero"
                                                    ? formatearPrecio(trabajo.monto_pago)
                                                    : "Trueque"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {trabajo.ubicacion}</span>
                                    </div>

                                    <button
                                        className={`w-full px-4 py-2 text-white rounded-md transition-colors ${urgente ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-600 hover:bg-orange-700'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/detalles/${trabajo.id_trabajo}`);
                                        }}
                                    >
                                        {urgente ? (<><AlertCircle className="w-4 h-4 inline mr-1" /> Ver Urgencia</>) : 'Ver Detalles'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate("/servicios")}
                        className="px-6 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-semibold"
                    >
                        Ver todos los trabajos →
                    </button>
                </div>
            </div>
        </section>
    );
}

export default TrabajosDestacados;
