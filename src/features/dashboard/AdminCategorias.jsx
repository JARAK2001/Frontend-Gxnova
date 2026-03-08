import React, { useEffect, useState } from 'react';
import { Search, Trash2, Plus, X, Edit2 } from 'lucide-react';
import API_URL from '../../config/api';

const AdminCategorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtro, setFiltro] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Formulario
    const [formData, setFormData] = useState({ id_categoria: null, nombre: '', descripcion: '' });

    useEffect(() => {
        cargarCategorias();
    }, []);

    const cargarCategorias = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categorias`);
            const data = await res.json();
            if (res.ok) setCategorias(data.categorias);
        } catch (error) {
            console.error("Error al cargar categorías", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const url = isEditing
            ? `${API_URL}/api/categorias/${formData.id_categoria}`
            : `${API_URL}/api/categorias`;
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
                alert(isEditing ? "Categoría actualizada" : "Categoría creada");
                setShowModal(false);
                setFormData({ id_categoria: null, nombre: '', descripcion: '' });
                cargarCategorias();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || error.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta categoría? Si tiene trabajos asociados, podría fallar.")) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/api/categorias/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert("Categoría eliminada");
                cargarCategorias();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error || error.message}`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const abrirEdicion = (cat) => {
        setIsEditing(true);
        setFormData({ id_categoria: cat.id_categoria, nombre: cat.nombre, descripcion: cat.descripcion || '' });
        setShowModal(true);
    };

    const abrirCreacion = () => {
        setIsEditing(false);
        setFormData({ id_categoria: null, nombre: '', descripcion: '' });
        setShowModal(true);
    };

    const categoriasFiltradas = categorias.filter(c =>
        c.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
        (c.descripcion && c.descripcion.toLowerCase().includes(filtro.toLowerCase()))
    );

    return (
        <div className="space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-black text-slate-800">Gestión de Categorías</h1>
                    <p className="text-sm text-slate-500 mt-0.5">Organiza los tipos de servicios de la plataforma</p>
                </div>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar categoría…"
                            className="admin-input pl-9"
                            style={{ width: 220 }}
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                    <button onClick={abrirCreacion} className="admin-btn-primary">
                        <Plus size={16} /> Nueva
                    </button>
                </div>
            </div>

            <div className="admin-card overflow-hidden">
                <table className="w-full text-left">
                    <thead className="admin-table-header">
                        <tr>
                            <th className="px-5 py-3">ID</th>
                            <th className="px-5 py-3">Nombre</th>
                            <th className="px-5 py-3">Descripción</th>
                            <th className="px-5 py-3 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                        {loading ? (
                            <tr><td colSpan={4} className="px-5 py-10 text-center text-slate-400">Cargando categorías…</td></tr>
                        ) : categoriasFiltradas.map((cat) => (
                            <tr key={cat.id_categoria} className="admin-row-hover transition-colors">
                                <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">#{cat.id_categoria}</td>
                                <td className="px-5 py-3.5 font-semibold text-slate-800">{cat.nombre}</td>
                                <td className="px-5 py-3.5 text-slate-500 text-sm">{cat.descripcion || '—'}</td>
                                <td className="px-5 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => abrirEdicion(cat)}
                                            className="p-1.5 rounded-lg transition-colors"
                                            style={{ color: '#ea580c' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(cat.id_categoria)}
                                            className="p-1.5 rounded-lg transition-colors"
                                            style={{ color: '#dc2626' }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-5">
                            <h3 className="text-lg font-black text-slate-800">
                                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleGuardar}>
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="admin-input"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    placeholder="Ej. Carpintería"
                                />
                            </div>
                            <div className="mb-5">
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Descripción</label>
                                <textarea
                                    className="admin-input"
                                    style={{ resize: 'none' }}
                                    rows={3}
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    placeholder="Describe qué servicios cubre esta categoría…"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 font-semibold text-sm transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="admin-btn-primary">
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCategorias;
