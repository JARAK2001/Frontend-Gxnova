import React, { useEffect, useState } from 'react';
import { Search, Trash2, Eye, Briefcase } from 'lucide-react';
import API_URL from '../../config/api';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const estadoStyle = {
    publicado: { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' },
    cancelado: { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' },
    en_progreso: { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' },
    completado: { background: '#f8fafc', color: '#475569', border: '1px solid #e2e8f0' },
};

const AdminTrabajos = () => {
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [filtroFecha, setFiltroFecha] = useState('todos');

    useEffect(() => { cargarDatos(); }, []);

    const cargarDatos = async () => {
        try {
            const token = localStorage.getItem('token');
            const [resTrabajos, resCategorias] = await Promise.all([
                fetch(`${API_URL}/api/admin/trabajos`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/api/categorias`)
            ]);
            if (resTrabajos.ok) { const d = await resTrabajos.json(); setTrabajos(d.trabajos || []); }
            if (resCategorias.ok) { const d = await resCategorias.json(); setCategorias(d.categorias || []); }
        } catch (error) {
            console.error('Error al cargar datos', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar trabajo?',
            text: '¿Estás seguro de eliminar este trabajo? Esta acción no se puede deshacer.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/admin/trabajos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                Swal.fire('¡Éxito!', 'Trabajo eliminado correctamente', 'success');
                cargarDatos();
            }
            else {
                Swal.fire('Error', 'Error al eliminar trabajo', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    const filtrarPorFecha = (trabajo) => {
        if (filtroFecha === 'todos') return true;
        const fecha = new Date(trabajo.fecha_creacion);
        const hoy = new Date();
        if (filtroFecha === 'semana') { const d = new Date(); d.setDate(hoy.getDate() - 7); return fecha >= d; }
        if (filtroFecha === 'mes') { const d = new Date(); d.setMonth(hoy.getMonth() - 1); return fecha >= d; }
        return true;
    };

    const trabajosFiltrados = trabajos.filter(t => {
        const cumpleTexto = t.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            (t.empleador?.nombre + ' ' + t.empleador?.apellido).toLowerCase().includes(filtroTexto.toLowerCase());
        const cumpleEstado = filtroEstado === 'todos' || t.estado === filtroEstado;
        const cumpleCategoria = filtroCategoria === 'todas' || t.id_categoria === parseInt(filtroCategoria);
        return cumpleTexto && cumpleEstado && cumpleCategoria && filtrarPorFecha(t);
    });

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Gestión de Trabajos</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Supervisa las ofertas laborales publicadas</p>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar trabajo…"
                            className="admin-input pl-9"
                            style={{ width: 220 }}
                            value={filtroTexto}
                            onChange={e => setFiltroTexto(e.target.value)}
                        />
                    </div>
                    <select className="admin-select" value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}>
                        <option value="todos">Todos los Estados</option>
                        <option value="publicado">Publicados</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="completado">Completados</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                    <select className="admin-select" value={filtroCategoria} onChange={e => setFiltroCategoria(e.target.value)}
                        style={{ maxWidth: 160 }}>
                        <option value="todas">Todas las Categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                        ))}
                    </select>
                    <select className="admin-select" value={filtroFecha} onChange={e => setFiltroFecha(e.target.value)}>
                        <option value="todos">Cualquier Fecha</option>
                        <option value="semana">Última Semana</option>
                        <option value="mes">Último Mes</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="admin-table-header">
                            <tr>
                                <th className="px-5 py-3">Trabajo</th>
                                <th className="px-5 py-3">Empleador</th>
                                <th className="px-5 py-3">Categoría</th>
                                <th className="px-5 py-3">Estado</th>
                                <th className="px-5 py-3">Fecha</th>
                                <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                                        Cargando trabajos…
                                    </td>
                                </tr>
                            ) : trabajosFiltrados.map(trabajo => (
                                <tr key={trabajo.id_trabajo} className="admin-row-hover transition-colors">
                                    <td className="px-5 py-3.5 font-semibold text-slate-800 max-w-[180px] truncate">
                                        {trabajo.titulo}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center admin-avatar text-xs flex-shrink-0">
                                                {trabajo.empleador?.foto_perfil
                                                    ? <img src={trabajo.empleador.foto_perfil} alt="" className="h-full w-full object-cover" />
                                                    : <span>{trabajo.empleador?.nombre?.charAt(0)}</span>
                                                }
                                            </div>
                                            <span className="text-slate-600 text-sm">
                                                {trabajo.empleador?.nombre} {trabajo.empleador?.apellido}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className="px-2 py-0.5 text-xs font-medium rounded-full"
                                            style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}
                                        >
                                            {trabajo.categoria?.nombre || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className="px-2.5 py-1 text-xs font-bold rounded-full capitalize"
                                            style={estadoStyle[trabajo.estado] || estadoStyle.completado}
                                        >
                                            {trabajo.estado.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-slate-400">
                                        {new Date(trabajo.fecha_creacion).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/detalles/${trabajo.id_trabajo}`)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                title="Ver detalles"
                                                style={{ color: '#ea580c' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fff7ed'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                <Eye size={17} />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(trabajo.id_trabajo)}
                                                className="p-1.5 rounded-lg transition-colors"
                                                title="Eliminar trabajo"
                                                style={{ color: '#dc2626' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                                            >
                                                <Trash2 size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && trabajosFiltrados.length === 0 && (
                    <div className="p-12 text-center">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                            style={{ background: '#fff7ed' }}
                        >
                            <Briefcase size={22} className="text-orange-400" />
                        </div>
                        <h3 className="text-slate-700 font-semibold">No se encontraron trabajos</h3>
                        <p className="text-slate-400 text-sm mt-1">Intenta cambiar los filtros seleccionados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTrabajos;
