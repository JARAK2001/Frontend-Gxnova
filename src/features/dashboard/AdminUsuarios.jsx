import React, { useEffect, useState } from 'react';
import { Search, ShieldAlert, CheckCircle, Users } from 'lucide-react';
import API_URL from '../../config/api';
import Swal from 'sweetalert2';

const AdminUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroTexto, setFiltroTexto] = useState('');
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [filtroRol, setFiltroRol] = useState('todos');

    // Estado para el modal de crear personal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [nuevoPersonal, setNuevoPersonal] = useState({
        nombre: '', apellido: '', correo: '', password: '', rol: 'Administrador'
    });

    useEffect(() => { cargarUsuarios(); }, []);

    const cargarUsuarios = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/usuarios`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsuarios(data.usuarios || []);
        } catch (error) {
            console.error('Error al cargar usuarios', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCambiarEstado = async (id, nuevoEstado) => {
        const result = await Swal.fire({
            title: `¿Cambiar a ${nuevoEstado}?`,
            text: `¿Estás seguro de cambiar el estado del usuario a ${nuevoEstado}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: nuevoEstado === 'activo' ? '#16a34a' : '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Sí, ${nuevoEstado}`,
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/admin/usuarios/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (res.ok) {
                Swal.fire('¡Éxito!', `Usuario ${nuevoEstado} correctamente`, 'success');
                cargarUsuarios();
            }
            else {
                Swal.fire('Error', 'Error al actualizar usuario', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    const handleCrearPersonal = async (e) => {
        e.preventDefault();
        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/admin/usuarios/personal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(nuevoPersonal)
            });
            const data = await res.json();
            
            if (res.ok) {
                Swal.fire('¡Éxito!', data.message || 'Personal creado correctamente', 'success');
                setIsModalOpen(false);
                setNuevoPersonal({ nombre: '', apellido: '', correo: '', password: '', rol: 'Administrador' });
                cargarUsuarios();
            } else {
                Swal.fire('Error', data.error || 'Error al crear personal', 'error');
            }
        } catch (error) {
            console.error("Error creando personal:", error);
            Swal.fire('Error', 'Error de conexión', 'error');
        } finally {
            setSaving(false);
        }
    };

    const usuariosFiltrados = usuarios.filter(u => {
        const cumpleTexto = u.nombre.toLowerCase().includes(filtroTexto.toLowerCase()) ||
            u.correo.toLowerCase().includes(filtroTexto.toLowerCase());
        const cumpleEstado = filtroEstado === 'todos' || u.estado === filtroEstado;
        const rolesUsuario = u.rolesAsignados?.map(ra => ra.rol.nombre) || [];
        const cumpleRol = filtroRol === 'todos' || rolesUsuario.includes(filtroRol);
        return cumpleTexto && cumpleEstado && cumpleRol;
    });

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Gestión de Usuarios</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Administra cuentas, roles y estados</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-orange-600/20 transition-all flex items-center gap-2"
                    >
                        <Users size={16} /> Crear Personal
                    </button>
                </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar usuario…"
                            className="admin-input pl-9"
                            style={{ width: 220 }}
                            value={filtroTexto}
                            onChange={e => setFiltroTexto(e.target.value)}
                        />
                    </div>
                    <select
                        className="admin-select"
                        value={filtroEstado}
                        onChange={e => setFiltroEstado(e.target.value)}
                    >
                        <option value="todos">Todos los Estados</option>
                        <option value="activo">Activos</option>
                        <option value="suspendido">Suspendidos</option>
                    </select>
                    <select
                        className="admin-select"
                        value={filtroRol}
                        onChange={e => setFiltroRol(e.target.value)}
                    >
                        <option value="todos">Todos los Roles</option>
                        <option value="Trabajador">Trabajadores</option>
                        <option value="Empleador">Empleadores</option>
                        <option value="Administrador">Administradores</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="admin-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="admin-table-header">
                            <tr>
                                <th className="px-5 py-3">Usuario</th>
                                <th className="px-5 py-3">Rol(es)</th>
                                <th className="px-5 py-3">Estado</th>
                                <th className="px-5 py-3">Fecha Registro</th>
                                <th className="px-5 py-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-sm">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-5 py-10 text-center text-slate-400">
                                        Cargando usuarios…
                                    </td>
                                </tr>
                            ) : usuariosFiltrados.map(usuario => (
                                <tr key={usuario.id_usuario} className="admin-row-hover transition-colors">
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="h-9 w-9 min-w-[2.25rem] rounded-full overflow-hidden flex items-center justify-center admin-avatar text-sm"
                                            >
                                                {usuario.foto_perfil
                                                    ? <img src={usuario.foto_perfil} alt="" className="h-full w-full object-cover" />
                                                    : <span>{usuario.nombre.charAt(0).toUpperCase()}</span>
                                                }
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-800">
                                                    {usuario.nombre} {usuario.apellido}
                                                </p>
                                                <p className="text-xs text-slate-400">{usuario.correo}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex flex-wrap gap-1">
                                            {usuario.rolesAsignados?.length > 0
                                                ? usuario.rolesAsignados.map(ra => (
                                                    <span
                                                        key={ra.rol.id_rol}
                                                        className="px-2 py-0.5 text-xs font-medium rounded-full"
                                                        style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}
                                                    >
                                                        {ra.rol.nombre}
                                                    </span>
                                                ))
                                                : <span className="text-xs text-slate-400 italic">Sin roles</span>
                                            }
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span
                                            className="px-2.5 py-1 text-xs font-bold rounded-full"
                                            style={
                                                usuario.estado === 'activo'
                                                    ? { background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }
                                                    : { background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }
                                            }
                                        >
                                            {usuario.estado === 'activo' ? 'Activo' : 'Suspendido'}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-slate-400">
                                        {new Date(usuario.fecha_registro).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="px-5 py-3.5 text-right">
                                        {usuario.estado === 'activo' ? (
                                            <button
                                                onClick={() => handleCambiarEstado(usuario.id_usuario, 'suspendido')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                                style={{ color: '#dc2626', background: '#fef2f2' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#fecaca'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#fef2f2'; }}
                                            >
                                                <ShieldAlert size={13} /> Suspender
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleCambiarEstado(usuario.id_usuario, 'activo')}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                                                style={{ color: '#16a34a', background: '#f0fdf4' }}
                                                onMouseEnter={e => { e.currentTarget.style.background = '#bbf7d0'; }}
                                                onMouseLeave={e => { e.currentTarget.style.background = '#f0fdf4'; }}
                                            >
                                                <CheckCircle size={13} /> Activar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!loading && usuariosFiltrados.length === 0 && (
                    <div className="p-12 text-center">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                            style={{ background: '#fff7ed' }}
                        >
                            <Users size={22} className="text-orange-400" />
                        </div>
                        <h3 className="text-slate-700 font-semibold">No se encontraron usuarios</h3>
                        <p className="text-slate-400 text-sm mt-1">Intenta ajustar los filtros de búsqueda</p>
                    </div>
                )}
            </div>

            {/* Modal Crear Personal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-bold text-slate-800">Crear Nuevo Personal</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleCrearPersonal} className="p-5 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre</label>
                                    <input type="text" required className="admin-input w-full"
                                        value={nuevoPersonal.nombre} onChange={e => setNuevoPersonal({ ...nuevoPersonal, nombre: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Apellido</label>
                                    <input type="text" required className="admin-input w-full"
                                        value={nuevoPersonal.apellido} onChange={e => setNuevoPersonal({ ...nuevoPersonal, apellido: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Correo Electrónico</label>
                                <input type="email" required className="admin-input w-full"
                                    value={nuevoPersonal.correo} onChange={e => setNuevoPersonal({ ...nuevoPersonal, correo: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Contraseña Asignada</label>
                                <input type="text" required minLength="6" className="admin-input w-full"
                                    placeholder="Contraseña inicial..."
                                    value={nuevoPersonal.password} onChange={e => setNuevoPersonal({ ...nuevoPersonal, password: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">Rol Administrativo</label>
                                <select className="admin-select w-full" value={nuevoPersonal.rol} onChange={e => setNuevoPersonal({ ...nuevoPersonal, rol: e.target.value })}>
                                    <option value="Administrador">Administrador</option>
                                    {/* Si en el futuro hay otros roles como "Soporte", se añaden aquí */}
                                </select>
                            </div>
                            <div className="pt-3 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50">
                                    {saving ? 'Creando...' : 'Guardar Personal'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsuarios;
