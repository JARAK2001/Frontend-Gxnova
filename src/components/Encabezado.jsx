import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Search, Bell, MessageSquare, Plus, Menu } from "lucide-react";
import logoGxnova from "../assets/gxnova-logo.png";
import { useNavigate } from "react-router-dom";
import Navbar from "./layout/Navbar";
import UserMenu from "./layout/UserMenu";
import MobileMenu from "./layout/MobileMenu";
import API_URL from '../config/api';

function Encabezado() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
    const [mostrarMenuMovil, setMostrarMenuMovil] = useState(false);

    // Sincronizar notificaciones cuando hay usuario
    useEffect(() => {
        if (token) {
            cargarNotificacionesNoLeidas();
        }
    }, [token]);

    const cargarNotificacionesNoLeidas = async () => {
        if (!token) return;

        try {
            const respuesta = await fetch(`${API_URL}/api/notificaciones/no-leidas`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                setCantidadNotificaciones(data.cantidad || 0);
            }
        } catch (error) {
            console.error("Error al cargar notificaciones:", error);
        }
    };

    const handleLogout = () => {
        logout();
        setCantidadNotificaciones(0);
        setMostrarMenuUsuario(false);
        navigate("/");
    };

    const ghostButtonClasses = "p-2 rounded-full transition-all duration-300 text-gray-700 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50";
    const defaultButtonClasses = "h-10 px-6 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500/50 flex items-center justify-center";
    const badgeClasses = "absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs p-0 flex items-center justify-center font-bold shadow-sm border-2 border-white";

    const estaLogueado = !!user;

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex h-20 items-center justify-between gap-6">

                    {/* Logo y marca */}
                    <div
                        className="flex items-center gap-3 cursor-pointer group"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logoGxnova}
                            alt="GXNOVA"
                            className="h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="flex flex-col hidden sm:block">
                            <span className="text-2xl font-black bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500 bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105">
                                GXNOVA
                            </span>
                        </div>
                    </div>

                    {/* Navegación Principal (Centrada) */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <Navbar estaLogueado={!!user} ghostButtonClasses={ghostButtonClasses} />
                    </div>

                    {/* Acciones del usuario */}
                    <div className="flex items-center gap-3 sm:gap-4">

                        {estaLogueado ? (
                            <>
                                {/* Publicar proyecto */}
                                <button
                                    className={`gap-2 ${defaultButtonClasses} hidden lg:flex`}
                                    id="boton-publicar-proyecto"
                                    onClick={() => navigate("/crear-trabajo")}
                                >
                                    <Plus className="w-5 h-5" />
                                    <span>Publicar Proyecto</span>
                                </button>
                                <button
                                    className={`p-2 rounded-full lg:hidden bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors`}
                                    onClick={() => navigate("/crear-trabajo")}
                                    aria-label="Publicar Proyecto"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>

                                {/* Notificaciones */}
                                <button
                                    className={`relative ${ghostButtonClasses}`}
                                    aria-label="Notificaciones"
                                    onClick={() => navigate("/notificaciones")}
                                >
                                    <Bell className="w-6 h-6" />
                                    {cantidadNotificaciones > 0 && (
                                        <span
                                            className={`${badgeClasses} bg-red-600 animate-pulse`}
                                            aria-label={`${cantidadNotificaciones} notificaciones nuevas`}
                                        >
                                            {cantidadNotificaciones > 99 ? '99+' : cantidadNotificaciones}
                                        </span>
                                    )}
                                </button>

                                {/* Mensajes */}
                                <button
                                    className={`relative ${ghostButtonClasses}`}
                                    aria-label="Mensajes"
                                >
                                    <MessageSquare className="w-6 h-6" />
                                </button>

                                {/* Perfil */}
                                <div className="pl-2 border-l border-gray-200 ml-1">
                                    <UserMenu
                                        usuario={user}
                                        cantidadNotificaciones={cantidadNotificaciones}
                                        mostrarMenuUsuario={mostrarMenuUsuario}
                                        setMostrarMenuUsuario={setMostrarMenuUsuario}
                                        handleLogout={handleLogout}
                                        ghostButtonClasses={ghostButtonClasses}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Botones Iniciar Sesión y Registrarse */}
                                <button
                                    className={`${ghostButtonClasses} hidden sm:flex font-semibold`}
                                    onClick={() => navigate("/auth")}
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    className={`${defaultButtonClasses} hidden sm:flex`}
                                    onClick={() => navigate("/auth")}
                                >
                                    Regístrate Gratis
                                </button>
                            </>
                        )}

                        {/* Menú móvil */}
                        <button
                            className={`md:hidden ${ghostButtonClasses} p-2 bg-gray-50 rounded-lg hover:bg-gray-100`}
                            aria-label="Menú de navegación"
                            onClick={() => setMostrarMenuMovil(!mostrarMenuMovil)}
                        >
                            <Menu className="w-6 h-6 text-gray-800" />
                        </button>
                    </div>
                </div>

                <MobileMenu
                    mostrarMenuMovil={mostrarMenuMovil}
                    setMostrarMenuMovil={setMostrarMenuMovil}
                    estaLogueado={estaLogueado}
                    cantidadNotificaciones={cantidadNotificaciones}
                    handleLogout={handleLogout}
                />
            </div>

            {/* Overlay para cerrar menú al hacer click fuera */}
            {mostrarMenuUsuario && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMostrarMenuUsuario(false)}
                ></div>
            )}
        </header>
    );
}

export default Encabezado;

