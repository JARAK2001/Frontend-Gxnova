import React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function MobileMenu({
    mostrarMenuMovil,
    setMostrarMenuMovil,
    busqueda,
    setBusqueda,
    handleBuscar,
    estaLogueado,
    cantidadNotificaciones,
    handleLogout,
    inputClasses
}) {
    const navigate = useNavigate();

    if (!mostrarMenuMovil) return null;

    return (
        <div className="md:hidden pb-3 border-t border-gray-200 mt-2 pt-3">
            <form onSubmit={handleBuscar}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar proyectos o freelancers..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className={`pl-10 pr-4 bg-gray-100 border-gray-300 focus:bg-white focus:border-primary/30 transition-all duration-200 ${inputClasses}`}
                    />
                </div>
            </form>

            {/* Menú móvil expandido */}
            <div className="mt-3 space-y-2">
                <button
                    onClick={() => {
                        navigate("/servicios");
                        setMostrarMenuMovil(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                    Servicios
                </button>
                {estaLogueado ? (
                    <>
                        <button
                            onClick={() => {
                                navigate("/crear-trabajo");
                                setMostrarMenuMovil(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Publicar Trabajo
                        </button>
                        <button
                            onClick={() => {
                                navigate("/perfil");
                                setMostrarMenuMovil(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            Mi Perfil
                        </button>
                        <button
                            onClick={() => {
                                navigate("/notificaciones");
                                setMostrarMenuMovil(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md flex items-center justify-between"
                        >
                            Notificaciones
                            {cantidadNotificaciones > 0 && (
                                <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {cantidadNotificaciones}
                                </span>
                            )}
                        </button>
                        <button
                            onClick={() => {
                                handleLogout();
                                setMostrarMenuMovil(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md"
                        >
                            Cerrar Sesión
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => {
                            navigate("/auth");
                            setMostrarMenuMovil(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                        Iniciar Sesión
                    </button>
                )}
            </div>
        </div>
    );
}

export default MobileMenu;
