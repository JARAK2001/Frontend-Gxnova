import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Encabezado from "../../layouts/Encabezado";
import Footer from "../../layouts/Footer";
import DatosPersonales from "./DatosPersonales";
import FormularioPerfil from "./FormularioPerfil";
import SeccionHabilidades from "./SeccionHabilidades";
import MisPublicaciones from "./MisPublicaciones";
import MisPostulaciones from "./MisPostulaciones";
import MisEstadisticas from "./MisEstadisticas";
import MisRutas from "./MisRutas";
import { User, Wrench, Briefcase, Send, Loader2, PenLine, BarChart2, Map, Star } from "lucide-react";

const tabs = [
    { id: "perfil",        label: "Mi Perfil",         icon: User,     requiresRole: null },
    { id: "habilidades",   label: "Mis Habilidades",   icon: Wrench,   requiresRole: "Trabajador" },
    { id: "postulaciones", label: "Mis Postulaciones", icon: Send,     requiresRole: "Trabajador" },
    { id: "rutas",         label: "Mis Rutas",         icon: Map,      requiresRole: "Trabajador" },
    { id: "estadisticas",  label: "Estadísticas",      icon: BarChart2,requiresRole: "Trabajador" },
    { id: "publicaciones", label: "Mis Publicaciones", icon: Briefcase,requiresRole: "Empleador" },
];

/* ── sección header reutilizable ── */
const SectionHeader = ({ icon: Icon, title, subtitle, action }) => (
    <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem',
        paddingBottom: '1.25rem',
        borderBottom: '1px solid rgba(249,115,22,0.10)',
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
                width: '48px', height: '48px', borderRadius: '16px', flexShrink: 0,
                background: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
                color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <Icon size={22} />
            </div>
            <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>{title}</h2>
                {subtitle && <p style={{ fontSize: '0.875rem', color: '#64748b', margin: '4px 0 0', fontWeight: 500 }}>{subtitle}</p>}
            </div>
        </div>
        {action}
    </div>
);

function Perfil() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);
    const [activeTab, setActiveTab] = useState("perfil");

    useEffect(() => { cargarPerfil(); }, []);

    const cargarPerfil = async () => {
        if (!token) { navigate("/auth"); return; }
        setLoading(true);
        try {
            const respuesta = await fetch(`${API_URL}/api/usuarios/perfil`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (respuesta.status === 401) { logout(); navigate("/auth"); return; }
            const data = await respuesta.json();
            if (data.usuario) setUsuario(data.usuario);
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    const tieneTrabajador = usuario?.rolesAsignados?.some(r => r.rol.nombre === "Trabajador");
    const tieneEmpleador  = usuario?.rolesAsignados?.some(r => r.rol.nombre === "Empleador");

    const tabsVisibles = tabs.filter(t => {
        if (!t.requiresRole) return true;
        if (t.requiresRole === "Trabajador") return tieneTrabajador;
        if (t.requiresRole === "Empleador")  return tieneEmpleador;
        return false;
    });


    const tabMeta = {
        perfil:        { icon: User,      title: "Mi Perfil",         subtitle: "Tu información personal y estado de cuenta." },
        habilidades:   { icon: Wrench,    title: "Mis Habilidades",   subtitle: "Tus especialidades certificadas y tarifas." },
        postulaciones: { icon: Send,      title: "Mis Postulaciones", subtitle: "Los proyectos a los que te has aplicado." },
        rutas:         { icon: Map,       title: "Mis Rutas",         subtitle: "Tus rutas programadas hacia los trabajos aceptados." },
        estadisticas:  { icon: BarChart2, title: "Mis Estadísticas",  subtitle: "Analiza tus ganancias y zonas de alta demanda." },
        publicaciones: { icon: Briefcase, title: "Mis Publicaciones", subtitle: "Los trabajos que has publicado como empleador." },
    };

    // ── Loading ──
    if (loading) return (
        <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>
            <Encabezado />
            <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Loader2 size={40} style={{ color: 'var(--orange-500)', animation: 'spin 0.8s linear infinite' }} />
                <p style={{ color: 'var(--slate-600)', fontWeight: 600, marginTop: '1rem' }}>Cargando tu perfil...</p>
            </div>
            <Footer />
        </div>
    );

    // ── Error ──
    if (!usuario) return (
        <div style={{ minHeight: '100vh', background: 'var(--slate-50)' }}>
            <Encabezado />
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem' }}>
                <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '24px', boxShadow: 'var(--shadow-md)', textAlign: 'center', maxWidth: '400px' }}>
                    <p style={{ color: 'var(--slate-700)', fontWeight: 500, marginBottom: '1.5rem' }}>No se pudo cargar el perfil.</p>
                    <button onClick={() => navigate('/auth')} style={{ padding: '12px 28px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>
                        Volver al inicio
                    </button>
                </div>
            </div>
            <Footer />
        </div>
    );

    const meta = tabMeta[activeTab] || tabMeta.perfil;

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #fff7ed 0%, #f8fafc 40%, #f1f5f9 100%)', position: 'relative' }}>
            {/* Blobs decorativos */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '5%', right: '0%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)', borderRadius: '50%' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Encabezado />

                {/* ══ BANNER ══ */}
                <div style={{
                    background: 'linear-gradient(135deg, #fb923c 0%, #f97316 45%, #ea580c 100%)',
                    height: '240px', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.45,
                        backgroundImage: `radial-gradient(circle at 18% 55%, rgba(255,255,255,0.42) 0%, transparent 40%),
                            radial-gradient(circle at 82% 18%, rgba(255,255,255,0.22) 0%, transparent 50%)` }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px)' }} />
                </div>

                {/* ══ MAIN CONTAINER ══ */}
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 5rem', position: 'relative', zIndex: 10 }}>

                    {/* ── Avatar + nombre ── */}
                    <div style={{
                        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
                        flexWrap: 'wrap', gap: '1.25rem',
                        marginTop: '-72px', marginBottom: '2rem',
                    }}>
                        {/* Izquierda: avatar + nombre */}
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.25rem', flexWrap: 'wrap' }}>
                            {/* Avatar */}
                            <div style={{
                                width: '140px', height: '140px', borderRadius: '50%', padding: '5px', flexShrink: 0,
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                boxShadow: '0 8px 32px -4px rgba(249,115,22,0.50)',
                                border: '4px solid #fff',
                            }}>
                                <img
                                    src={usuario.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre)}+${encodeURIComponent(usuario.apellido)}&background=1e293b&color=f97316&size=256`}
                                    alt="Foto de perfil"
                                    style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            </div>

                            {/* Nombre + badges */}
                            <div style={{ paddingBottom: '0.75rem' }}>
                                <h1 style={{ fontSize: 'clamp(1.5rem,3vw,2.1rem)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.15, letterSpacing: '-0.02em', textShadow: '0 2px 8px rgba(0,0,0,0.22)' }}>
                                    {usuario.nombre} {usuario.apellido}
                                </h1>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                                    {usuario.rolesAsignados?.map(r => (
                                        <span key={r.rol.id_rol} style={{
                                            padding: '4px 13px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700,
                                            background: r.rol.nombre === 'Empleador'
                                                ? 'rgba(30,27,75,0.85)'
                                                : 'rgba(249,115,22,0.85)',
                                            color: '#fff',
                                            backdropFilter: 'blur(8px)',
                                            border: '1px solid rgba(255,255,255,0.2)',
                                        }}>
                                            {r.rol.nombre}
                                        </span>
                                    ))}
                                    {usuario.verificado && (
                                        <span style={{ padding: '4px 13px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, background: 'rgba(22,163,74,0.85)', color: '#fff', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                            ✓ Verificado
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Botón editar y Premium */}
                        {!editando && (
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                <button
                                    onClick={() => navigate("/pricing")}
                                    style={{
                                        padding: '11px 22px', background: 'linear-gradient(135deg, #fb923c, #ea580c)', color: '#fff',
                                        borderRadius: '14px', fontWeight: 700, border: 'none',
                                        cursor: 'pointer', boxShadow: '0 4px 16px -2px rgba(234,88,12,0.35)',
                                        transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                                        gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.92rem',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px -2px rgba(234,88,12,0.5)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px -2px rgba(234,88,12,0.35)'; }}
                                >
                                    <Star size={17} color="#fbbf24" fill="#fbbf24" /> Premium
                                </button>
                                <button
                                    onClick={() => { setActiveTab("perfil"); setEditando(true); }}
                                    style={{
                                        padding: '11px 22px', background: '#fff', color: '#ea580c',
                                        borderRadius: '14px', fontWeight: 700, border: '2px solid rgba(249,115,22,0.3)',
                                        cursor: 'pointer', boxShadow: '0 4px 16px -2px rgba(249,115,22,0.15)',
                                        transition: 'all 0.2s', display: 'flex', alignItems: 'center',
                                        gap: '8px', fontFamily: 'var(--font-sans)', fontSize: '0.92rem',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.background = '#f97316'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#f97316'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ea580c'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.3)'; }}
                                >
                                    <PenLine size={17} /> Editar perfil
                                </button>
                            </div>
                        )}
                    </div>

                    {/* ── Tab bar ── */}
                    {!editando && (
                        <div style={{
                            display: 'flex', gap: '4px', flexWrap: 'wrap',
                            background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(14px)',
                            WebkitBackdropFilter: 'blur(14px)',
                            borderRadius: '18px', padding: '6px',
                            border: '1px solid rgba(249,115,22,0.12)',
                            boxShadow: '0 4px 20px -6px rgba(0,0,0,0.08)',
                            marginBottom: '1.75rem',
                        }}>
                            {tabsVisibles.map(tab => {
                                const isActive = activeTab === tab.id;
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        style={{
                                            flex: '1', minWidth: '110px', padding: '11px 16px',
                                            borderRadius: '13px', fontWeight: 700, fontSize: '0.87rem',
                                            border: 'none', cursor: 'pointer',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                            fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                                            background: isActive ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
                                            color: isActive ? '#fff' : 'var(--slate-500)',
                                            boxShadow: isActive ? '0 4px 14px -2px rgba(249,115,22,0.35)' : 'none',
                                        }}
                                    >
                                        <Icon size={15} /> {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {/* ── Contenido ── */}
                    <div style={{
                        background: 'rgba(255,255,255,0.90)',
                        backdropFilter: 'blur(18px)',
                        WebkitBackdropFilter: 'blur(18px)',
                        borderRadius: '26px',
                        border: '1px solid rgba(249,115,22,0.10)',
                        boxShadow: '0 8px 40px -8px rgba(0,0,0,0.10)',
                        overflow: 'hidden',
                    }}>
                        {/* Barra naranja superior */}
                        <div style={{ height: '4px', background: 'linear-gradient(90deg, #f97316, #ea580c, #fb923c)', width: '100%' }} />

                        <div style={{ padding: '2rem 2rem 2.5rem' }}>
                            {editando ? (
                                <FormularioPerfil
                                    usuario={usuario}
                                    onCancel={() => setEditando(false)}
                                    onSuccess={() => { setEditando(false); cargarPerfil(); }}
                                />
                            ) : (
                                <>
                                    {/* Encabezado de sección */}
                                    <SectionHeader
                                        icon={meta.icon}
                                        title={meta.title}
                                        subtitle={meta.subtitle}
                                    />

                                    {activeTab === "perfil" && (
                                        <DatosPersonales usuario={usuario} onEdit={() => setEditando(true)} onRefresh={cargarPerfil} />
                                    )}
                                    {activeTab === "habilidades" && tieneTrabajador && (
                                        <SeccionHabilidades usuarioId={usuario.id_usuario} />
                                    )}
                                    {activeTab === "postulaciones" && tieneTrabajador && (
                                        <MisPostulaciones usuarioId={usuario.id_usuario} />
                                    )}
                                    {activeTab === "rutas" && tieneTrabajador && (
                                        <MisRutas usuarioId={usuario.id_usuario} />
                                    )}
                                    {activeTab === "estadisticas" && tieneTrabajador && (
                                        <MisEstadisticas />
                                    )}
                                    {activeTab === "publicaciones" && tieneEmpleador && (
                                        <MisPublicaciones usuarioId={usuario.id_usuario} />
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default Perfil;
