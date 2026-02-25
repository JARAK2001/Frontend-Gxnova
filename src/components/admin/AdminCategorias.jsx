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
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestión de Categorías</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 w-64"
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                        />
                    </div>
                    <button
                        onClick={abrirCreacion}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                        <Plus size={20} /> Nueva
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Nombre</th>
                            <th className="px-6 py-4">Descripción</th>
                            <th className="px-6 py-4 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categoriasFiltradas.map((cat) => (
                            <tr key={cat.id_categoria} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-gray-500">#{cat.id_categoria}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{cat.nombre}</td>
                                <td className="px-6 py-4 text-gray-600">{cat.descripcion || '-'}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button
                                            onClick={() => abrirEdicion(cat)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleEliminar(cat.id_categoria)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded"
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

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleGuardar}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500"
                                    rows="3"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                                >
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
