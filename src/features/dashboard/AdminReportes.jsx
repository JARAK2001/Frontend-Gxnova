import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Eye, User, Briefcase, FileText } from 'lucide-react';
import API_URL from '../../config/api';

const AdminReportes = () => {
    const [reportes, setReportes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('pendiente'); // pendiente, resuelto, todos
    const [reporteSeleccionado, setReporteSeleccionado] = useState(null);

    useEffect(() => {
        cargarReportes();
    }, [filtro]);

    const cargarReportes = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const url = filtro === 'todos'
                ? `${API_URL}/api/admin/reportes`
                : `${API_URL}/api/admin/reportes?estado=${filtro}`;

            const res = await fetch(url, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setReportes(data.reportes || []);
            }
        } catch (error) {
            console.error("Error cargando reportes:", error);
        } finally {
            setLoading(false);
        }
    };

    const resolverReporte = async (id, accion) => {
        if (!window.confirm(`¿Confirmar ${accion === 'resolver' ? 'resolver' : 'rechazar'} este reporte?`)) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/reportes/${id}/${accion}`, {
                method: 'PATCH',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert(`Reporte ${accion === 'resolver' ? 'resuelto' : 'rechazado'} correctamente`);
                cargarReportes();
                setReporteSeleccionado(null);
            } else {
                alert('Error al procesar el reporte');
            }
        } catch (error) {
            console.error("Error:", error);
            alert('Error de conexión');
        }
    };

    const getEstadoBadge = (estado) => {
        const badges = {
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            resuelto: 'bg-green-100 text-green-800 border-green-200',
        };
        return badges[estado] || 'bg-gray-100 text-gray-800 border-gray-200';
    };

    const getTipoBadge = (tipo) => {
        const badges = {
            'contenido_inapropiado': 'bg-red-100 text-red-800',
            'fraude': 'bg-orange-100 text-orange-800',
            'spam': 'bg-purple-100 text-purple-800',
            'otro': 'bg-gray-100 text-gray-800',
        };
        return badges[tipo] || 'bg-gray-100 text-gray-800';
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando reportes...</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Gestión de Reportes</h1>
                    <p className="text-gray-500 mt-1">Moderación de contenido y denuncias</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFiltro('pendiente')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === 'pendiente'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Pendientes
                    </button>
                    <button
                        onClick={() => setFiltro('resuelto')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === 'resuelto'
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Resueltos
                    </button>
                    <button
                        onClick={() => setFiltro('todos')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filtro === 'todos'
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Todos
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <AlertTriangle size={24} className="text-yellow-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pendientes</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {reportes.filter(r => r.estado === 'pendiente').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-green-100 rounded-lg">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Resueltos</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {reportes.filter(r => r.estado === 'resuelto').length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 rounded-lg">
                            <FileText size={24} className="text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-800">{reportes.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Lista de Reportes */}
            {reportes.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                    <AlertTriangle size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No hay reportes {filtro !== 'todos' ? filtro + 's' : ''}</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tipo
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reportante
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reportado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Estado
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {reportes.map((reporte) => (
                                    <tr key={reporte.id_reporte} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTipoBadge(reporte.tipo)}`}>
                                                {reporte.tipo.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-900">
                                                    {reporte.reportante?.nombre} {reporte.reportante?.apellido}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <User size={16} className="text-gray-400" />
                                                <span className="text-sm text-gray-900">
                                                    {reporte.reportado?.nombre} {reporte.reportado?.apellido}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(reporte.fecha).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getEstadoBadge(reporte.estado)}`}>
                                                {reporte.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setReporteSeleccionado(reporte)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                >
                                                    <Eye size={18} />
                                                </button>
                                                {reporte.estado === 'pendiente' && (
                                                    <>
                                                        <button
                                                            onClick={() => resolverReporte(reporte.id_reporte, 'resolver')}
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Resolver"
                                                        >
                                                            <CheckCircle size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => resolverReporte(reporte.id_reporte, 'rechazar')}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Rechazar"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modal de Detalles */}
            {reporteSeleccionado && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex justify-between items-start">
                                <h3 className="text-xl font-bold text-gray-800">Detalles del Reporte</h3>
                                <button
                                    onClick={() => setReporteSeleccionado(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle size={24} />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Tipo de Reporte</p>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoBadge(reporteSeleccionado.tipo)}`}>
                                    {reporteSeleccionado.tipo.replace('_', ' ')}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Descripción</p>
                                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg">
                                    {reporteSeleccionado.descripcion || 'Sin descripción'}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Reportante</p>
                                    <p className="text-gray-800 font-medium">
                                        {reporteSeleccionado.reportante?.nombre} {reporteSeleccionado.reportante?.apellido}
                                    </p>
                                    <p className="text-sm text-gray-500">{reporteSeleccionado.reportante?.correo}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Reportado</p>
                                    <p className="text-gray-800 font-medium">
                                        {reporteSeleccionado.reportado?.nombre} {reporteSeleccionado.reportado?.apellido}
                                    </p>
                                    <p className="text-sm text-gray-500">{reporteSeleccionado.reportado?.correo}</p>
                                </div>
                            </div>
                            {reporteSeleccionado.trabajo && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Trabajo Relacionado</p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="font-medium text-gray-800">{reporteSeleccionado.trabajo.titulo}</p>
                                        <p className="text-sm text-gray-600 mt-1">{reporteSeleccionado.trabajo.descripcion}</p>
                                    </div>
                                </div>
                            )}
                            {reporteSeleccionado.estado === 'pendiente' && (
                                <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            resolverReporte(reporteSeleccionado.id_reporte, 'resolver');
                                        }}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        ✅ Resolver Reporte
                                    </button>
                                    <button
                                        onClick={() => {
                                            resolverReporte(reporteSeleccionado.id_reporte, 'rechazar');
                                        }}
                                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                                    >
                                        ❌ Rechazar Reporte
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminReportes;
