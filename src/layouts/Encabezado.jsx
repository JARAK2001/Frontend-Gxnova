import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Bell, Plus, Menu, X } from "lucide-react";
import logoGxnova from "../assets/gxnova-logo.png";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import UserMenu from "./UserMenu";
import MobileMenu from "./MobileMenu";
import ChatButton from "../features/chat/components/ChatButton";
import API_URL from '../config/api';

function Encabezado() {
    const navigate = useNavigate();
    const { user, token, logout } = useAuth();
    const [cantidadNotificaciones, setCantidadNotificaciones] = useState(0);
    const [mostrarMenuUsuario, setMostrarMenuUsuario] = useState(false);
    const [mostrarMenuMovil, setMostrarMenuMovil] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (token) cargarNotificacionesNoLeidas();
    }, [token]);

    const cargarNotificacionesNoLeidas = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/notificaciones/no-leidas`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                const data = await res.json();
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

    const estaLogueado = !!user;
    const esEmpleador = user?.rolesAsignados?.some(r => r.rol?.nombre === 'Empleador') || false;

    /* ── style helpers ── */
    const headerStyle = {
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        background: scrolled ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,1)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(249,115,22,0.12)' : '1px solid #f3f4f6',
        boxShadow: scrolled ? '0 4px 24px -4px rgba(0,0,0,0.08)' : 'none',
    };

    const ghostBtn = "p-2 rounded-full transition-all duration-200 text-gray-600 hover:bg-orange-50 hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400/40";
    const badgeCls = "absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-[10px] flex items-center justify-center font-bold shadow border-2 border-white";

    return (
        <header style={headerStyle}>
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="flex h-16 items-center justify-between gap-4">

                    {/* ── Logo ── */}
                    <div
                        className="flex items-center gap-2.5 cursor-pointer group flex-shrink-0"
                        onClick={() => navigate("/")}
                    >
                        <img
                            src={logoGxnova}
                            alt="GXNOVA"
                            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <span className="hidden sm:block text-xl font-black tracking-tight"
                            style={{ background: 'linear-gradient(135deg, #ea580c, #f97316, #fbbf24)', WebkitBackgroundClip: 'text', color: 'transparent' }}>
                            GXNOVA
                        </span>
                    </div>

                    {/* ── Navegación centrada ── */}
                    <div className="hidden md:flex flex-1 justify-center">
                        <Navbar estaLogueado={estaLogueado} esEmpleador={esEmpleador} ghostButtonClasses={ghostBtn} />
                    </div>

                    {/* ── Acciones ── */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {estaLogueado ? (
                            <>
                                {/* Publicar Proyecto */}
                                <button
                                    onClick={() => navigate("/crear-trabajo")}
                                    id="boton-publicar-proyecto"
                                    className="hidden lg:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                                    style={{
                                        background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                        boxShadow: '0 4px 14px -2px rgba(249,115,22,0.45)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(249,115,22,0.55)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(249,115,22,0.45)'}
                                >
                                    <Plus className="w-4 h-4" />
                                    Publicar Proyecto
                                </button>

                                {/* Publicar (mobile) */}
                                <button
                                    className="p-2 rounded-full lg:hidden text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors"
                                    onClick={() => navigate("/crear-trabajo")}
                                    aria-label="Publicar Proyecto"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>

                                {/* Notificaciones */}
                                <button
                                    className={`relative ${ghostBtn}`}
                                    aria-label="Notificaciones"
                                    onClick={() => navigate("/notificaciones")}
                                >
                                    <Bell className="w-5 h-5" />
                                    {cantidadNotificaciones > 0 && (
                                        <span className={`${badgeCls} bg-red-500 animate-pulse`}>
                                            {cantidadNotificaciones > 99 ? '99+' : cantidadNotificaciones}
                                        </span>
                                    )}
                                </button>

                                {/* Chat */}
                                <div className="relative flex items-center">
                                    <ChatButton />
                                </div>

                                {/* Perfil */}
                                <div className="pl-2 border-l border-gray-200 ml-0.5">
                                    <UserMenu
                                        usuario={user}
                                        cantidadNotificaciones={cantidadNotificaciones}
                                        mostrarMenuUsuario={mostrarMenuUsuario}
                                        setMostrarMenuUsuario={setMostrarMenuUsuario}
                                        handleLogout={handleLogout}
                                        esEmpleador={esEmpleador}
                                        ghostButtonClasses={ghostBtn}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <button
                                    className={`${ghostBtn} hidden sm:flex font-semibold text-sm px-3`}
                                    onClick={() => navigate("/auth")}
                                >
                                    Iniciar Sesión
                                </button>
                                <button
                                    className="hidden sm:flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5"
                                    style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)', boxShadow: '0 4px 14px -2px rgba(249,115,22,0.4)' }}
                                    onClick={() => navigate("/auth")}
                                >
                                    Regístrate Gratis
                                </button>
                            </>
                        )}

                        {/* Hamburger */}
                        <button
                            className={`md:hidden ${ghostBtn} p-2 bg-gray-50 rounded-lg`}
                            aria-label="Menú de navegación"
                            onClick={() => setMostrarMenuMovil(!mostrarMenuMovil)}
                        >
                            {mostrarMenuMovil
                                ? <X className="w-5 h-5 text-gray-700" />
                                : <Menu className="w-5 h-5 text-gray-700" />
                            }
                        </button>
                    </div>
                </div>
            </div>

            <MobileMenu
                mostrarMenuMovil={mostrarMenuMovil}
                setMostrarMenuMovil={setMostrarMenuMovil}
                estaLogueado={estaLogueado}
                esEmpleador={esEmpleador}
                cantidadNotificaciones={cantidadNotificaciones}
                handleLogout={handleLogout}
            />

            {mostrarMenuUsuario && (
                <div className="fixed inset-0 z-40" onClick={() => setMostrarMenuUsuario(false)} />
            )}
        </header>
    );
}

export default Encabezado;
