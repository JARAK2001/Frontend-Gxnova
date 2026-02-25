import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { Wrench, Plus, Folder, FileText, DollarSign, Save, Trash2, Loader2 } from 'lucide-react';

function SeccionHabilidades({ usuarioId }) {
    const [habilidades, setHabilidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mostrarFormHabilidad, setMostrarFormHabilidad] = useState(false);
    const [nuevaHabilidad, setNuevaHabilidad] = useState({
        id_categoria: "",
        descripcion: "",
        tarifa_hora: "",
    });

    useEffect(() => {
        if (usuarioId) {
            cargarCategorias();
            cargarHabilidades();
        }
    }, [usuarioId]);

    const cargarCategorias = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categorias`);
            const data = await res.json();
            if (res.ok) setCategorias(data.categorias || []);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };

    const cargarHabilidades = async () => {
        if (!usuarioId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/habilidades/usuario/${usuarioId}`);
            const data = await res.json();
            if (res.ok) {
                setHabilidades(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error cargando habilidades:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearHabilidad = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!nuevaHabilidad.id_categoria || !nuevaHabilidad.descripcion || !nuevaHabilidad.tarifa_hora) {
            alert("Por favor completa todos los campos de la habilidad.");
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/habilidades`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(nuevaHabilidad),
            });
            const data = await res.json();
            if (res.ok) {
                alert("✅ Habilidad agregada");
                setNuevaHabilidad({ id_categoria: "", descripcion: "", tarifa_hora: "" });
                setMostrarFormHabilidad(false);
                cargarHabilidades();
            } else {
                alert(`❌ Error: ${data.message || "No se pudo agregar"}`);
            }
        } catch (error) {
            console.error("Error creando habilidad:", error);
        }
    };

    const handleEliminarHabilidad = async (id_habilidad) => {
        if (!window.confirm("¿Seguro que deseas eliminar esta habilidad?")) return;
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/api/habilidades/${id_habilidad}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                cargarHabilidades();
            } else {
                alert("❌ Error al eliminar");
            }
        } catch (error) {
            console.error("Error eliminando habilidad:", error);
        }
    };

    return (
        <div className="mt-8 pt-8 border-t-2 border-gray-200">
            {/* Header de la sección */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Wrench className="w-7 h-7 text-green-600" /> Mis Habilidades
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                        Agrega tus habilidades y tarifas para que los empleadores te encuentren
                    </p>
                </div>
                <button
                    onClick={() => setMostrarFormHabilidad(!mostrarFormHabilidad)}
                    className={`px-5 py-2.5 font-bold rounded-xl transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 ${mostrarFormHabilidad
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                        }`}
                >
                    <span className="flex items-center gap-2">
                        {mostrarFormHabilidad ? "Cancelar" : "Agregar Habilidad"}
                    </span>
                </button>
            </div>

            {/* Formulario para agregar habilidad */}
            {mostrarFormHabilidad && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl mb-6 border-2 border-green-200 shadow-lg">
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Plus className="w-6 h-6 text-green-600" /> Nueva Habilidad
                    </h4>
                    <form onSubmit={handleCrearHabilidad} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Folder className="w-4 h-4" /> Categoría
                                </label>
                                <select
                                    value={nuevaHabilidad.id_categoria}
                                    onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, id_categoria: e.target.value })}
                                    className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    required
                                >
                                    <option value="">Selecciona una categoría...</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> Descripción
                                </label>
                                <input
                                    type="text"
                                    value={nuevaHabilidad.descripcion}
                                    onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, descripcion: e.target.value })}
                                    className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Ej: Instalación de cableado eléctrico"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <DollarSign className="w-4 h-4" /> Tarifa por Hora
                                </label>
                                <input
                                    type="number"
                                    value={nuevaHabilidad.tarifa_hora}
                                    onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, tarifa_hora: e.target.value })}
                                    className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Ej: 50000"
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" /> Guardar Habilidad
                        </button>
                    </form>
                </div>
            )}

            {/* Lista de Habilidades */}
            {loading ? (
                <div className="text-center py-12">
                    <Loader2 className="inline-block animate-spin h-12 w-12 text-green-600" />
                    <p className="text-gray-500 mt-4">Cargando habilidades...</p>
                </div>
            ) : habilidades.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {habilidades.map((hab) => (
                        <div
                            key={hab.id_habilidad}
                            className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:shadow-xl hover:border-green-200 transition-all duration-300 group relative overflow-hidden"
                        >
                            {/* Decoración de fondo */}
                            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity"></div>

                            <div className="relative">
                                {/* Badge de categoría */}
                                <span className="inline-block px-3 py-1.5 mb-3 text-xs font-bold text-green-800 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full border border-green-200">
                                    {hab.categoria.nombre}
                                </span>

                                {/* Descripción */}
                                <p className="text-base font-bold text-gray-900 mb-3 line-clamp-2">
                                    {hab.descripcion}
                                </p>

                                {/* Tarifa */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                        <div>
                                            <p className="text-xs text-gray-500">Tarifa por hora</p>
                                            <p className="text-lg font-bold text-green-600">
                                                ${parseInt(hab.tarifa_hora).toLocaleString('es-CO')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón eliminar */}
                                <button
                                    onClick={() => handleEliminarHabilidad(hab.id_habilidad)}
                                    className="w-full mt-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-semibold text-sm transition-all border border-red-200 hover:border-red-300 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300">
                    <Wrench className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600 font-medium mb-2">No tienes habilidades registradas aún</p>
                    <p className="text-sm text-gray-500">
                        Agrega tus habilidades para que los empleadores puedan encontrarte
                    </p>
                </div>
            )}
        </div>
    );
}

export default SeccionHabilidades;
