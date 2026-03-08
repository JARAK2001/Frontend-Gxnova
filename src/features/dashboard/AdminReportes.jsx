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

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div className="w-10 h-10 rounded-full mx-auto mb-3 animate-spin" style={{ borderColor: '#f97316', borderTopColor: 'transparent', borderWidth: 3, borderStyle: 'solid' }} />
                <p className="text-sm text-slate-500 font-medium">Cargando reportes…</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Gestión de Reportes</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Moderación de contenido y denuncias</p>
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'pendiente', label: 'Pendientes' },
                        { key: 'resuelto', label: 'Resueltos' },
                        { key: 'todos', label: 'Todos' },
                    ].map(btn => (
                        <button
                            key={btn.key}
                            onClick={() => setFiltro(btn.key)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                            style={filtro === btn.key
                                ? { background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', boxShadow: '0 4px 12px -2px rgba(249,115,22,0.45)' }
                                : { background: '#fff', color: '#475569', border: '1.5px solid #e2e8f0' }
                            }
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: <AlertTriangle size={20} />, label: 'Pendientes', value: reportes.filter(r => r.estado === 'pendiente').length, gradient: 'linear-gradient(135deg,#fbbf24,#f59e0b)' },
                    { icon: <CheckCircle size={20} />, label: 'Resueltos', value: reportes.filter(r => r.estado === 'resuelto').length, gradient: 'linear-gradient(135deg,#34d399,#059669)' },
                    { icon: <FileText size={20} />, label: 'Total', value: reportes.length, gradient: 'linear-gradient(135deg,#f97316,#ea580c)' },
                ].map((s, i) => (
                    <div key={i} className="admin-card p-5 flex items-center gap-4">
                        <div className="p-3 rounded-xl text-white flex-shrink-0" style={{ background: s.gradient }}>{s.icon}</div>
                        <div>
                            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{s.label}</p>
                            <p className="text-2xl font-black text-slate-800">{s.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lista de Reportes */}
            {reportes.length === 0 ? (
                <div className="admin-card p-12 text-center">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#fff7ed' }}>
                        <AlertTriangle size={22} className="text-orange-400" />
                    </div>
                    <p className="text-slate-500 font-medium">No hay reportes {filtro !== 'todos' ? filtro + 's' : ''}</p>
                </div>
            ) : (
                <div className="admin-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="admin-table-header">
                                <tr>
                                    <th className="px-5 py-3">Tipo</th>
                                    <th className="px-5 py-3">Reportante</th>
                                    <th className="px-5 py-3">Reportado</th>
                                    <th className="px-5 py-3">Fecha</th>
                                    <th className="px-5 py-3">Estado</th>
                                    <th className="px-5 py-3">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {reportes.map((reporte) => (
                                    <tr key={reporte.id_reporte} className="admin-row-hover transition-colors">
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getTipoBadge(reporte.tipo)}`}>
                                                {reporte.tipo.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                <span className="text-slate-700 text-sm">{reporte.reportante?.nombre} {reporte.reportante?.apellido}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex items-center gap-2">
                                                <User size={14} className="text-slate-400" />
                                                <span className="text-slate-700 text-sm">{reporte.reportado?.nombre} {reporte.reportado?.apellido}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5 text-xs text-slate-400">
                                            {new Date(reporte.fecha).toLocaleDateString('es-CO')}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getEstadoBadge(reporte.estado)}`}>
                                                {reporte.estado}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setReporteSeleccionado(reporte)}
                                                    className="p-1.5 rounded-lg transition-colors"
                                                    title="Ver detalles"
                                                    style={{ color: '#ea580c' }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                >
                                                    <Eye size={17} />
                                                </button>
                                                {reporte.estado === 'pendiente' && (
                                                    <>
                                                        <button
                                                            onClick={() => resolverReporte(reporte.id_reporte, 'resolver')}
                                                            className="p-1.5 text-green-600 rounded-lg transition-colors"
                                                            title="Resolver"
                                                            onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <CheckCircle size={17} />
                                                        </button>
                                                        <button
                                                            onClick={() => resolverReporte(reporte.id_reporte, 'rechazar')}
                                                            className="p-1.5 text-red-600 rounded-lg transition-colors"
                                                            title="Rechazar"
                                                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                                        >
                                                            <XCircle size={17} />
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
