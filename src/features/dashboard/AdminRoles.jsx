import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, X, Users } from 'lucide-react';
import API_URL from '../../config/api';
import Swal from 'sweetalert2';

const AdminRoles = () => {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Roles críticos que no se pueden borrar/editar nombre
    const rolesCriticos = ['Administrador', 'Trabajador', 'Empleador'];

    // Formulario
    const [formData, setFormData] = useState({ id_rol: null, nombre: '', descripcion: '' });

    useEffect(() => {
        cargarRoles();
    }, []);

    const cargarRoles = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/roles`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setRoles(data.roles);
            }
        } catch (error) {
            console.error("Error al cargar roles", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = isEditing
            ? `${API_URL}/api/admin/roles/${formData.id_rol}`
            : `${API_URL}/api/admin/roles`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    nombre: formData.nombre,
                    descripcion: formData.descripcion
                })
            });

            if (res.ok) {
                Swal.fire('¡Éxito!', isEditing ? "Rol actualizado" : "Rol creado", 'success');
                setShowModal(false);
                setFormData({ id_rol: null, nombre: '', descripcion: '' });
                cargarRoles();
            } else {
                const error = await res.json();
                Swal.fire('Error', `Error: ${error.error || error.message}`, 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    const handleEliminar = async (id) => {
        const result = await Swal.fire({
            title: '¿Eliminar rol?',
            text: '¿Seguro que quieres eliminar este rol? Esta acción no se puede deshacer.',
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
            const res = await fetch(`${API_URL}/api/admin/roles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                Swal.fire('Eliminado', "Rol eliminado correctamente", 'success');
                cargarRoles();
            } else {
                const error = await res.json();
                Swal.fire('Error', `Error: ${error.error || error.message}`, 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    const abrirEdicion = (rol) => {
        setIsEditing(true);
        setFormData({ id_rol: rol.id_rol, nombre: rol.nombre, descripcion: rol.descripcion || '' });
        setShowModal(true);
    };

    const abrirCreacion = () => {
        setIsEditing(false);
        setFormData({ id_rol: null, nombre: '', descripcion: '' });
        setShowModal(true);
    };

    const rolesFiltrados = roles.filter(r =>
        r.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        (r.descripcion && r.descripcion.toLowerCase().includes(filtro.toLowerCase()))
    );

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Gestión de Roles</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Define los perfiles de acceso al sistema</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar rol…"
                            className="admin-input pl-9"
                            style={{ width: 220 }}
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                    <button onClick={abrirCreacion} className="admin-btn-primary">
                        <Plus size={16} /> Nuevo Rol
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rolesFiltrados.map((rol) => {
                    const esCritico = rolesCriticos.includes(rol.nombre);
                    return (
                        <div key={rol.id_rol} className={`admin-card p-5 transition-all ${esCritico ? 'border-orange-200' : ''}`}
                            style={esCritico ? { background: 'linear-gradient(135deg, #fff7ed 0%, #fff 100%)' } : {}}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div
                                    className="p-3 rounded-xl"
                                    style={esCritico
                                        ? { background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff' }
                                        : { background: '#f1f5f9', color: '#64748b' }}
                                >
                                    <Shield size={20} />
                                </div>
                                <div className="flex gap-1.5">
                                    <button
                                        onClick={() => abrirEdicion(rol)}
                                        className="p-1.5 rounded-lg transition-colors"
                                        title="Editar"
                                        style={{ color: '#ea580c' }}
                                        onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    {!esCritico && (
                                        <button
                                            onClick={() => handleEliminar(rol.id_rol)}
                                            className="p-1.5 text-red-500 rounded-lg transition-colors"
                                            title="Eliminar"
                                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-slate-800 mb-1">{rol.nombre}</h3>
                            <p className="text-slate-500 text-sm mb-4 line-clamp-2">{rol.descripcion || 'Sin descripción'}</p>

                            <div className="flex items-center gap-2 text-xs text-slate-400 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
                                <Users size={14} />
                                <span>{rol._count?.usuarios || 0} usuarios asignados</span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Editar Rol' : 'Nuevo Rol'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleGuardar}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Rol</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    disabled={isEditing && rolesCriticos.includes(formData.nombre)}
                                    placeholder="Ej. Moderador"
                                />
                                {isEditing && rolesCriticos.includes(formData.nombre) && (
                                    <p className="text-xs text-orange-500 mt-1">El nombre de este rol no puede modificarse.</p>
                                )}
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    className="w-full rounded-lg border border-gray-300 py-2.5 px-3 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                                    rows="3"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Describe los permisos o propósito de este rol..."
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-medium transition-colors"
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-orange-600 rounded-lg hover:bg-orange-700 font-medium shadow-sm transition-colors"
                                    disabled={loading}
                                >
                                    {isEditing ? 'Guardar Cambios' : 'Crear Rol'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminRoles;
