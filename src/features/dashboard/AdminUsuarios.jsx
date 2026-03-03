import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, ShieldAlert, CheckCircle, Filter } from 'lucide-react';
import API_URL from '../../config/api';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroRol, setFiltroRol] = useState('todos');

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/usuarios`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsuarios(data.usuarios || []);
        } catch (error) {
            console.error("Error al cargar usuarios", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        if (!window.confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/admin/usuarios/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });

            if (res.ok) {
                alert(`Usuario ${nuevoEstado} correctamente`);
                cargarUsuarios();
            } else {
                alert("Error al actualizar usuario");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const usuariosFiltrados = usuarios.filter(u => {
        const cumpleTexto = u.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            u.correo.toLowerCase().includes(filtroTexto.toLowerCase());

        const cumpleEstado = filtroEstado === 'todos' || u.estado === filtroEstado;

        // Verificar roles (un usuario puede tener múltiples roles)
        const rolesUsuario = u.rolesAsignados?.map(ra => ra.rol.nombre) || [];
        const cumpleRol = filtroRol === 'todos' || rolesUsuario.includes(filtroRol);

        return cumpleTexto && cumpleEstado && cumpleRol;
    });

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
                    <p className="text-gray-500 text-sm mt-1">Administra cuentas, roles y estados</p>
                </div>

                <div className="flex flex-wrap gap-3">
                    {/* Filtro Texto */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar usuario..."
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-56 text-sm"
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
                        <option value="activo">Activos</option>
                        <option value="suspendido">Suspendidos</option>
                    </select>

                    {/* Filtro Rol */}
                    <select
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                        value={filtroRol}
                        onChange={(e) => setFiltroRol(e.target.value)}
                    >
                        <option value="todos">Todos los Roles</option>
                        <option value="Trabajador">Trabajadores</option>
                        <option value="Empleador">Empleadores</option>
                        <option value="Administrador">Administradores</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200 text-sm">
                            <tr>
                                <th className="px-6 py-4">Usuario</th>
                                <th className="px-6 py-4">Rol(es)</th>
                                <th className="px-6 py-4">Estado</th>
                                <th className="px-6 py-4">Fecha Registro</th>
                                <th className="px-6 py-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {usuariosFiltrados.map((usuario) => (
                                <tr key={usuario.id_usuario} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 min-w-[2.5rem] rounded-full bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center">
                                                {usuario.foto_perfil ? (
                                                    <img src={usuario.foto_perfil} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-indigo-600 font-bold text-lg">
                                                        {usuario.nombre.charAt(0)}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{usuario.nombre} {usuario.apellido}</p>
                                                <p className="text-xs text-gray-500">{usuario.correo}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {usuario.rolesAsignados && usuario.rolesAsignados.length > 0 ? (
                                                usuario.rolesAsignados.map((ra) => (
                                                    <span key={ra.rol.id_rol} className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs text-gray-600">
                                                        {ra.rol.nombre}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">Sin roles</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${usuario.estado === 'activo'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : 'bg-red-50 text-red-700 border-red-200'
                                            }`}>
                                            {usuario.estado === 'activo' ? 'Activo' : 'Suspendido'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(usuario.fecha_registro).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {usuario.estado === 'activo' ? (
                                            <button
                                                onClick={() => handleCambiarEstado(usuario.id_usuario, 'suspendido')}
                                                className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors font-medium text-xs inline-flex items-center gap-1"
                                            >
                                                <ShieldAlert size={14} /> Suspender
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleCambiarEstado(usuario.id_usuario, 'activo')}
                                                className="text-green-600 hover:text-green-900 hover:bg-green-50 px-3 py-1.5 rounded-lg transition-colors font-medium text-xs inline-flex items-center gap-1"
                                            >
                                                <CheckCircle size={14} /> Activar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {usuariosFiltrados.length === 0 && (
                    <div className="p-12 text-center">
                        <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                            <Search className="text-gray-400" size={24} />
                        </div>
                        <h3 className="text-gray-900 font-medium text-lg">No se encontraron usuarios</h3>
                        <p className="text-gray-500 mt-1">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsuarios;
