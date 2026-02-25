import React, { useState, useEffect } from "react";
import API_URL from '../config/api';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Encabezado from "./Encabezado";
import { MapPin } from 'lucide-react';

function CrearTrabajo() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [categorias, setCategorias] = useState([]);
    const [formData, setFormData] = useState({
        id_categoria: "",
        titulo: "",
        descripcion: "",
        tipo_pago: "dinero",
        monto_pago: "",
        descripcion_trueque: "",
        ubicacion: "",
        latitud: "",
        longitud: "",
        fecha_estimada: "",
    });
    const [foto, setFoto] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate("/auth");
            return;
        }
        cargarCategorias();
    }, []);

    const obtenerUbicacionActual = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFormData({
                        ...formData,
                        latitud: position.coords.latitude,
                        longitud: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error obteniendo ubicación:", error);
                    alert("No se pudo obtener la ubicación. Por favor ingrésala manualmente.");
                }
            );
        } else {
            alert("Tu navegador no soporta geolocalización.");
        }
    };

    const cargarCategorias = async () => {
        try {
            const respuesta = await fetch(`${API_URL}/api/categorias`);
            const data = await respuesta.json();
            if (data.categorias) {
                setCategorias(data.categorias);
            }
        } catch (error) {
            console.error("Error al cargar categorías:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.id_categoria || !formData.titulo || !formData.descripcion || !formData.ubicacion) {
            alert("Por favor completa todos los campos obligatorios");
            return;
        }

        if (formData.tipo_pago === "dinero" && !formData.monto_pago) {
            alert("El monto es obligatorio cuando el tipo de pago es dinero");
            return;
        }

        if (formData.tipo_pago === "trueque" && !formData.descripcion_trueque) {
            alert("La descripción del trueque es obligatoria");
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("id_categoria", parseInt(formData.id_categoria));
            formDataToSend.append("titulo", formData.titulo);
            formDataToSend.append("descripcion", formData.descripcion);
            formDataToSend.append("tipo_pago", formData.tipo_pago);
            formDataToSend.append("ubicacion", formData.ubicacion);

            if (formData.latitud) formDataToSend.append("latitud", parseFloat(formData.latitud));
            if (formData.longitud) formDataToSend.append("longitud", parseFloat(formData.longitud));

            if (formData.tipo_pago === "dinero") {
                formDataToSend.append("monto_pago", parseFloat(formData.monto_pago));
            } else {
                formDataToSend.append("descripcion_trueque", formData.descripcion_trueque);
            }

            if (formData.fecha_estimada) {
                formDataToSend.append("fecha_estimada", new Date(formData.fecha_estimada).toISOString());
            }

            if (foto) {
                formDataToSend.append("foto", foto);
            }

            const respuesta = await fetch(`${API_URL}/api/trabajos`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formDataToSend,
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("Trabajo creado exitosamente");
                navigate(`/detalles/${data.trabajo.id_trabajo}`);
            } else {
                alert(` Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error("Error al crear trabajo:", error);
            alert(" Error de conexión con el servidor");
        }
    };

    return (
        <div>
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Publicar Nuevo Trabajo</h1>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Categoría *
                            </label>
                            <select
                                value={formData.id_categoria}
                                onChange={(e) =>
                                    setFormData({ ...formData, id_categoria: e.target.value })
                                }
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                                required
                            >
                                <option value="">Selecciona una categoría</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título *
                            </label>
                            <input
                                type="text"
                                value={formData.titulo}
                                onChange={(e) =>
                                    setFormData({ ...formData, titulo: e.target.value })
                                }
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                                placeholder="Ej: Necesito diseñador para logo"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción *
                            </label>
                            <textarea
                                value={formData.descripcion}
                                onChange={(e) =>
                                    setFormData({ ...formData, descripcion: e.target.value })
                                }
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                                rows="5"
                                placeholder="Describe el trabajo que necesitas..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de Pago *
                            </label>
                            <select
                                value={formData.tipo_pago}
                                onChange={(e) =>
                                    setFormData({ ...formData, tipo_pago: e.target.value })
                                }
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                                required
                            >
                                <option value="dinero">Dinero</option>
                                <option value="trueque">Trueque</option>
                            </select>
                        </div>

                        {formData.tipo_pago === "dinero" ? (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Monto (COP) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.monto_pago}
                                    onChange={(e) =>
                                        setFormData({ ...formData, monto_pago: e.target.value })
                                    }
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                                    placeholder="500000"
                                    required
                                />
                            </div>
                        ) : (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Descripción del Trueque *
                                </label>
                                <textarea
                                    value={formData.descripcion_trueque}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            descripcion_trueque: e.target.value,
                                        })
                                    }
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                                    rows="3"
                                    placeholder="Describe qué ofreces a cambio..."
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ubicación (Dirección o Ciudad) *
                            </label>
                            <input
                                type="text"
                                value={formData.ubicacion}
                                onChange={(e) =>
                                    setFormData({ ...formData, ubicacion: e.target.value })
                                }
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                                placeholder="Bogotá, Colombia"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto del Trabajo (Opcional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFoto(e.target.files[0])}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900"
                            />
                        </div>

                        {/* Coordenadas GPS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Latitud
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.latitud}
                                    onChange={(e) =>
                                        setFormData({ ...formData, latitud: e.target.value })
                                    }
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900"
                                    placeholder="Ej: 4.7110"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Longitud
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    value={formData.longitud}
                                    onChange={(e) =>
                                        setFormData({ ...formData, longitud: e.target.value })
                                    }
                                    className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900"
                                    placeholder="Ej: -74.0721"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={obtenerUbicacionActual}
                            className="text-sm text-orange-600 hover:text-orange-800 font-semibold flex items-center gap-1"
                        >
                            <MapPin className="w-4 h-4 inline mr-1" /> Usar mi ubicación actual
                        </button>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Fecha Estimada (Opcional)
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_estimada}
                                onChange={(e) =>
                                    setFormData({ ...formData, fecha_estimada: e.target.value })
                                }
                                className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-orange-600"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                            >
                                Publicar Trabajo
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/servicios")}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CrearTrabajo;

