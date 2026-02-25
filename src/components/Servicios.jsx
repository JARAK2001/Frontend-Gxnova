import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Encabezado from "./Encabezado";
import Footer from "./Footer";
import MapaTrabajos from "./servicios/MapaTrabajos";
import { Map, List, Search, MapPin, Tag, RefreshCw } from "lucide-react";
import API_URL from '../config/api';

function Servicios() {
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroCategoria, setFiltroCategoria] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("publicado");
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [filtroUbicacion, setFiltroUbicacion] = useState("");
    const [vistaMapa, setVistaMapa] = useState(false); // Nuevo estado

    useEffect(() => {
        cargarCategorias();

        // Obtener parámetros de la URL
        const params = new URLSearchParams(window.location.search);
        const categoriaParam = params.get("id_categoria");
        if (categoriaParam) {
            setFiltroCategoria(categoriaParam);
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            cargarTrabajos();
        }, 500); // Debounce de 500ms para no saturar con cada tecla
        return () => clearTimeout(timer);
    }, [filtroCategoria, filtroEstado, filtroBusqueda, filtroUbicacion]);

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

    const cargarTrabajos = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/trabajos?estado=${filtroEstado}`;
            if (filtroCategoria) {
                url += `&id_categoria=${filtroCategoria}`;
            }
            if (filtroBusqueda) {
                url += `&busqueda=${encodeURIComponent(filtroBusqueda)}`;
            }
            if (filtroUbicacion) {
                url += `&ubicacion=${encodeURIComponent(filtroUbicacion)}`;
            }

            const respuesta = await fetch(url);
            const data = await respuesta.json();
            if (data.trabajos) {
                setTrabajos(data.trabajos);
            }
        } catch (error) {
            console.error("Error al cargar trabajos:", error);
        } finally {
            setLoading(false);
        }
    };

    const verDetalles = (id) => {
        navigate(`/detalles/${id}`);
    };

    const formatearPrecio = (monto) => {
        if (!monto) return "A convenir";
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(monto);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Servicios Disponibles</h1>
                        <p className="text-gray-600">Encuentra el trabajo perfecto para ti</p>
                    </div>

                    {/* Botón Toggle Mapa/Lista */}
                    <div className="flex bg-white rounded-xl shadow-md border border-gray-200 p-1.5">
                        <button
                            onClick={() => setVistaMapa(false)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${!vistaMapa ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <List size={20} /> Lista
                        </button>
                        <button
                            onClick={() => setVistaMapa(true)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium ${vistaMapa ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <Map size={20} /> Mapa
                        </button>
                    </div>
                </div>

                {/* Filtros */}
                <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Buscador Texto */}
                        <div className="md:col-span-4 lg:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <Search className="w-5 h-5" /> Buscar
                            </label>
                            <input
                                type="text"
                                placeholder="¿Qué estás buscando? (Ej: Plomero, Diseño...)"
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            />
                        </div>

                        {/* Buscador Ubicación */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <MapPin className="w-5 h-5" /> Ubicación
                            </label>
                            <input
                                type="text"
                                placeholder="Ciudad o Dirección"
                                value={filtroUbicacion}
                                onChange={(e) => setFiltroUbicacion(e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            />
                        </div>

                        {/* Filtro Categoría */}
                        <div className="md:col-span-2 lg:col-span-1">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                <Tag className="w-5 h-5" /> Categoría
                            </label>
                            <select
                                value={filtroCategoria}
                                onChange={(e) => setFiltroCategoria(e.target.value)}
                                className="w-full rounded-lg border-2 border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                            >
                                <option value="">Todas</option>
                                {categorias.map((cat) => (
                                    <option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Contenido condicional: Mapa o Lista */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                        <p className="text-gray-500 mt-4 font-medium">Cargando servicios...</p>
                    </div>
                ) : vistaMapa ? (
                    // VISTA MAPA
                    <MapaTrabajos trabajos={trabajos} />
                ) : trabajos.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl shadow-lg">
                        <Search className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-500 text-lg">No hay servicios disponibles con estos filtros</p>
                        <p className="text-gray-400 text-sm mt-2">Intenta ajustar tus criterios de búsqueda</p>
                    </div>
                ) : (
                    // VISTA LISTA
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {trabajos.map((trabajo) => (
                            <div
                                key={trabajo.id_trabajo}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-100 hover:border-orange-200 group"
                                onClick={() => verDetalles(trabajo.id_trabajo)}
                            >
                                {/* Imagen del trabajo */}
                                {trabajo.foto && (
                                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                        <img
                                            src={trabajo.foto.startsWith('http') ? trabajo.foto : `${API_URL}${trabajo.foto}`}
                                            alt={trabajo.titulo}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                                    </div>
                                )}

                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3 gap-2">
                                        <span className="px-3 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 text-xs font-bold rounded-full border border-orange-200">
                                            {trabajo.categoria?.nombre || "Sin categoría"}
                                        </span>
                                        <span className={`px-3 py-1.5 text-xs font-bold rounded-full capitalize border ${trabajo.estado === 'publicado' ? 'bg-green-50 text-green-700 border-green-200' :
                                            trabajo.estado === 'en_progreso' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {trabajo.estado.replace('_', ' ')}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                        {trabajo.titulo}
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                                        {trabajo.descripcion}
                                    </p>

                                    {/* Precio destacado */}
                                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                                        <p className="text-xs text-green-700 font-semibold mb-1">Pago</p>
                                        <p className="text-2xl font-bold text-green-800">
                                            {trabajo.tipo_pago === "dinero"
                                                ? formatearPrecio(trabajo.monto_pago)
                                                : (<><RefreshCw className="w-4 h-4 inline" /> Trueque</>)}
                                        </p>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mb-3">
                                        <span className="font-medium flex items-center gap-1"><MapPin className="w-4 h-4" /> {trabajo.ubicacion}</span>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500 mb-4 pb-4 border-b border-gray-100">
                                        <span>
                                            Por: <span className="font-semibold text-gray-700">{trabajo.empleador?.nombre} {trabajo.empleador?.apellido}</span>
                                        </span>
                                    </div>

                                    <button
                                        className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            verDetalles(trabajo.id_trabajo);
                                        }}
                                    >
                                        Ver Detalles →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Servicios;
