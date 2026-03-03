import React from 'react';
import API_URL from '../../config/api';
import { Mail, Wrench, MessageSquare } from 'lucide-react';

function ModalPerfilTrabajador({ trabajador, onClose }) {
    const [perfil, setPerfil] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        cargarPerfil();
    }, [trabajador.id_usuario]);

    const cargarPerfil = async () => {
        try {
            const response = await fetch(`${API_URL}/api/usuarios/${trabajador.id_usuario}/perfil-publico`);
            const data = await response.json();
            if (response.ok) {
                setPerfil(data.perfil);
            } else {
                console.error('Error al cargar perfil:', data.error);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderEstrellas = (puntuacion) => {
        return '⭐'.repeat(Math.round(puntuacion));
    };

    if (!trabajador) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 rounded-t-2xl">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {perfil?.foto_perfil ? (
                                <img
                                    src={perfil.foto_perfil}
                                    alt={`${trabajador.nombre} ${trabajador.apellido}`}
                                    className="w-20 h-20 rounded-full border-4 border-white object-cover"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-orange-600 border-4 border-white">
                                    {trabajador.nombre[0]}{trabajador.apellido[0]}
                                </div>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-white">
                                    {trabajador.nombre} {trabajador.apellido}
                                </h2>
                                <p className="text-orange-100">Perfil del Trabajador</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            <p className="text-gray-500 mt-4">Cargando perfil...</p>
                        </div>
                    ) : perfil ? (
                        <div className="space-y-6">
                            {/* Estadísticas */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 text-center">
                                    <div className="text-3xl font-bold text-green-800">
                                        {perfil.estadisticas.promedioCalificacion.toFixed(1)}
                                    </div>
                                    <div className="text-sm text-green-700 mt-1">
                                        {renderEstrellas(perfil.estadisticas.promedioCalificacion)}
                                    </div>
                                    <div className="text-xs text-green-600 mt-1">Calificación</div>
                                </div>

                                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200 text-center">
                                    <div className="text-3xl font-bold text-blue-800">
                                        {perfil.estadisticas.totalCalificaciones}
                                    </div>
                                    <div className="text-xs text-blue-600 mt-1">Reseñas</div>
                                </div>

                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200 text-center">
                                    <div className="text-3xl font-bold text-purple-800">
                                        {perfil.estadisticas.trabajosCompletados}
                                    </div>
                                    <div className="text-xs text-purple-600 mt-1">Trabajos</div>
                                </div>
                            </div>

                            {/* Información de Contacto */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-orange-600 inline" /> Información de Contacto
                                </h3>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="font-semibold">Email:</span>
                                        <span>{perfil.correo}</span>
                                    </div>
                                    {perfil.telefono && (
                                        <div className="flex items-center gap-2 text-gray-700">
                                            <span className="font-semibold">Teléfono:</span>
                                            <span>{perfil.telefono}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className="font-semibold">Miembro desde:</span>
                                        <span>{new Date(perfil.fecha_registro).toLocaleDateString('es-CO')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Habilidades */}
                            {perfil.habilidades && perfil.habilidades.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <Wrench className="w-5 h-5 text-orange-600 inline" /> Habilidades
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {perfil.habilidades.map((habilidad) => (
                                            <div key={habilidad.id_habilidad} className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                                                <div className="font-bold text-orange-900 flex justify-between items-start">
                                                    <span>{habilidad.categoria?.nombre}</span>
                                                    <span className="text-xs bg-white px-2 py-1 rounded-full border border-orange-100 text-orange-600 shadow-sm">
                                                        ${parseFloat(habilidad.tarifa_hora).toLocaleString('es-CO')} / h
                                                    </span>
                                                </div>
                                                <p className="text-sm text-orange-800 mt-1">{habilidad.descripcion}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Calificaciones Recientes */}
                            {perfil.calificacionesRecientes && perfil.calificacionesRecientes.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-orange-600 inline" /> Reseñas Recientes
                                    </h3>
                                    <div className="space-y-3">
                                        {perfil.calificacionesRecientes.map((cal, index) => (
                                            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <p className="font-semibold text-gray-900">
                                                            {cal.emisor.nombre} {cal.emisor.apellido}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {new Date(cal.fecha).toLocaleDateString('es-CO')}
                                                        </p>
                                                    </div>
                                                    <div className="text-yellow-500 font-semibold">
                                                        {renderEstrellas(cal.puntuacion)}
                                                    </div>
                                                </div>
                                                {cal.comentario && (
                                                    <p className="text-gray-700 text-sm italic">"{cal.comentario}"</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No se pudo cargar el perfil</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-4 rounded-b-2xl border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-500 text-white font-bold rounded-lg hover:from-gray-700 hover:to-gray-600 transition-all"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ModalPerfilTrabajador;
