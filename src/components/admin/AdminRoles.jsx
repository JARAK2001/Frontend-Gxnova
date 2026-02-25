import React, { useEffect, useState } from 'react';
import { Search, Plus, Edit2, Trash2, Shield, X, Users } from 'lucide-react';
import API_URL from '../../config/api';

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
                alert(isEditing ? "Rol actualizado" : "Rol creado");
                setShowModal(false);
                setFormData({ id_rol: null, nombre: '', descripcion: '' });
                cargarRoles();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || error.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar este rol? Esta acción no se puede deshacer.")) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/admin/roles/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Rol eliminado");
                cargarRoles();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || error.message}`);
            }
        } catch (error) {
            console.error(error);
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
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
                    <p className="text-gray-500 text-sm mt-1">Define los perfiles de acceso al sistema</p>
                </div>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar rol..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 w-64 bg-white"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={abrirCreacion}
                        className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium shadow-sm"
                    >
                        <Plus size={20} /> Nuevo Rol
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rolesFiltrados.map((rol) => {
                    const esCritico = rolesCriticos.includes(rol.nombre);
                    return (
                        <div key={rol.id_rol} className={`bg-white rounded-xl shadow-sm p-6 border transition-all hover:shadow-md ${esCritico ? 'border-orange-100 bg-orange-50/30' : 'border-gray-100'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-lg ${esCritico ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                                    <Shield size={24} />
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => abrirEdicion(rol)}
                                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    {!esCritico && (
                                        <button
                                            onClick={() => handleEliminar(rol.id_rol)}
                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-1">{rol.nombre}</h3>
                            <p className="text-gray-600 text-sm mb-4 h-10 line-clamp-2">
                                {rol.descripcion || 'Sin descripción'}
                            </p>

                            <div className="flex items-center gap-2 text-sm text-gray-500 pt-4 border-t border-gray-100">
                                <Users size={16} />
                                <span>{rol._count?.usuarios || 0} Usuarios asignados</span>
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
