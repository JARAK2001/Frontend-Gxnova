import React, { useEffect, useState } from 'react';
import { Search, Trash2, Eye, Filter, Calendar } from 'lucide-react';
import API_URL from '../../config/api';
import { useNavigate } from 'react-router-dom';

const AdminTrabajos = () => {
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filtros
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroCategoria, setFiltroCategoria] = useState('todas');
    const [filtroFecha, setFiltroFecha] = useState('todos');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const token = localStorage.getItem('token');
            const [resTrabajos, resCategorias] = await Promise.all([
                fetch(`${API_URL}/api/admin/trabajos`, { headers: { Authorization: `Bearer ${token}` } }),
                fetch(`${API_URL}/api/categorias`)
            ]);

            if (resTrabajos.ok) {
                const data = await resTrabajos.json();
                setTrabajos(data.trabajos || []);
            }
            if (resCategorias.ok) {
                const data = await resCategorias.json();
                setCategorias(data.categorias || []);
            }
        } catch (error) {
            console.error("Error al cargar datos", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar este trabajo? Esta acción no se puede deshacer.")) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/admin/trabajos/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Trabajo eliminado correctamente");
                cargarDatos(); // Recargar todo por si acaso
            } else {
                alert("Error al eliminar trabajo");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const filtrarPorFecha = (trabajo) => {
        if (filtroFecha === 'todos') return true;

        const fechaTrabajo = new Date(trabajo.fecha_creacion);
        const hoy = new Date();
        const haceUnaSemana = new Date();
        haceUnaSemana.setDate(hoy.getDate() - 7);
        const haceUnMes = new Date();
        haceUnMes.setMonth(hoy.getMonth() - 1);

        if (filtroFecha === 'semana') return fechaTrabajo >= haceUnaSemana;
        if (filtroFecha === 'mes') return fechaTrabajo >= haceUnMes;
        return true;
    };

    const trabajosFiltrados = trabajos.filter(t => {
        // Filtro Texto
        const cumpleTexto = t.titulo.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            (t.empleador?.nombre + ' ' + t.empleador?.apellido).toLowerCase().includes(filtroTexto.toLowerCase());

        // Filtro Estado
        const cumpleEstado = filtroEstado === 'todos' || t.estado === filtroEstado;

        // Filtro Categoría
        const cumpleCategoria = filtroCategoria === 'todas' || t.id_categoria === parseInt(filtroCategoria);

        // Filtro Fecha
        const cumpleFecha = filtrarPorFecha(t);

        return cumpleTexto && cumpleEstado && cumpleCategoria && cumpleFecha;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Trabajos</h1>
                    <p className="text-gray-500 text-sm mt-1">Supervisa las ofertas laborales publicadas</p>
                </div>

                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                    {/* Filtro Texto */}
                    <div className="relative flex-grow md:flex-grow-0">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar trabajo..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-full md:w-56 text-sm"
                            value={filtroTexto}
                            onChange={(e) => setFiltroTexto(e.target.value)}
                        />
                    </div>

                    {/* Filtro Estado */}
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                        value={filtroEstado}
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos los Estados</option>
                        <option value="publicado">Publicados</option>
                        <option value="en_progreso">En Progreso</option>
                        <option value="completado">Completados</option>
                        <option value="cancelado">Cancelados</option>
                    </select>

                    {/* Filtro Categoría */}
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white max-w-[150px]"
                        value={filtroCategoria}
                        onChange={(e) => setFiltroCategoria(e.target.value)}
                    >
                        <option value="todas">Todas las Categorías</option>
                        {categorias.map(cat => (
                            <option key={cat.id_categoria} value={cat.id_categoria}>
                                {cat.nombre}
                            </option>
                        ))}
                    </select>

                    {/* Filtro Fecha */}
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                        value={filtroFecha}
                        onChange={(e) => setFiltroFecha(e.target.value)}
                    >
                        <option value="todos">Cualquier Fecha</option>
                        <option value="semana">Última Semana</option>
                        <option value="mes">Último Mes</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 text-sm">
                            <tr>
                                <th className="px-6 py-4">Trabajo</th>
                                <th className="px-6 py-4">Empleador</th>
                                <th className="px-6 py-4">Categoría</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Fecha</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {trabajosFiltrados.map((trabajo) => (
                                <tr key={trabajo.id_trabajo} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        {trabajo.titulo}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <div className="h-6 w-6 rounded-full bg-gray-200 overflow-hidden">
                                                {trabajo.empleador?.foto_perfil ? (
                                                    <img src={trabajo.empleador.foto_perfil} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-600 text-xs font-bold">
                                                        {trabajo.empleador?.nombre?.charAt(0)}
                                                    </div>
                                                )}
                                            </div>
                                            <span>
                                                {trabajo.empleador?.nombre} {trabajo.empleador?.apellido}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md border border-gray-200">
                                            {trabajo.categoria?.nombre || "N/A"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize border ${trabajo.estado === 'publicado' ? 'bg-green-50 text-green-700 border-green-200' :
                                                trabajo.estado === 'cancelado' ? 'bg-red-50 text-red-700 border-red-200' :
                                                    trabajo.estado === 'en_progreso' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                        'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {trabajo.estado.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(trabajo.fecha_creacion).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => navigate(`/detalles/${trabajo.id_trabajo}`)}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Ver detalles"
                                            >
                                                <Eye size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleEliminar(trabajo.id_trabajo)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Eliminar trabajo"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {trabajosFiltrados.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg">No se encontraron trabajos</h3>
                        <p className="text-gray-500 mt-1">Intenta cambiar los filtros seleccionados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminTrabajos;
