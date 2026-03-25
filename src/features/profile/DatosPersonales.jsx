import React, { useEffect, useState } from "react";
import API_URL from '../../config/api';
import Estrellas from "../../ui/Estrellas";
import { Mail, Phone, CheckCircle, Users, Calendar, Briefcase, Wrench, Rocket, ShieldCheck, Star, MapPin, User, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useThemeTokens } from '../../hooks/useThemeTokens';

/* ── Tarjeta de info individual ── */
const InfoCard = ({ icon, iconBg, iconColor, label, children, fullWidth = false }) => {
    const t = useThemeTokens();
    return (
    <div style={{
        padding: '1.1rem 1.4rem', borderRadius: '18px',
        background: t.cardBg, border: `1px solid ${t.cardBorder}`,
        display: 'flex', alignItems: 'center', gap: '14px',
        transition: 'all 0.2s ease', backdropFilter: 'blur(8px)',
        gridColumn: fullWidth ? '1 / -1' : undefined,
    }}
        onMouseEnter={e => { e.currentTarget.style.background = t.darkMode ? t.cardBg2 : 'rgba(255,255,255,0.97)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(249,115,22,0.11)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.22)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = t.cardBg; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = t.cardBorder; }}
    >
        <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: t.textSecondary, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
            <div style={{ marginTop: '4px' }}>{children}</div>
        </div>
    </div>
)};

function DatosPersonales({ usuario, onEdit, onRefresh }) {
    const t = useThemeTokens();
    const [promedio, setPromedio] = useState({ promedio: 0, cantidad: 0 });
    const [habilidades, setHabilidades] = useState([]);
    const [actividadStats, setActividadStats] = useState({
        totales: 0,
        labelTotales: "Actividad",
        proyectosActivos: 0,
        tasaExito: 0,
    });
    const [actividadReciente, setActividadReciente] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    useEffect(() => {
        if (usuario?.id_usuario) {
            cargarPromedio();
            cargarDatosUsuario();
        }
    }, [usuario]);

    const cargarPromedio = async () => {
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/usuario/${usuario.id_usuario}/promedio`);
            const data = await res.json();
            if (res.ok) setPromedio(data);
        } catch (error) {
            console.error("Error al cargar promedio:", error);
        }
    };

    const cargarDatosUsuario = async () => {
        setLoadingData(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        try {
            const isTrabajador = usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador");
            const isEmpleador = usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador");

            let arrHabilidades = [];
            let arrPostulaciones = [];
            let arrPublicaciones = [];

            const fetchPromises = [];

            if (isTrabajador) {
                fetchPromises.push(
                    fetch(`${API_URL}/api/habilidades/usuario/${usuario.id_usuario}`, { headers }).then(res => res.json()).then(data => { arrHabilidades = data; }).catch(err => console.error(err))
                );
                fetchPromises.push(
                    fetch(`${API_URL}/api/postulaciones?id_trabajador=${usuario.id_usuario}`, { headers }).then(res => res.json()).then(data => { arrPostulaciones = data.postulaciones || []; }).catch(err => console.error(err))
                );
            }
            if (isEmpleador) {
                fetchPromises.push(
                    fetch(`${API_URL}/api/trabajos?id_empleador=${usuario.id_usuario}`, { headers }).then(res => res.json()).then(data => { arrPublicaciones = data.trabajos || []; }).catch(err => console.error(err))
                );
            }

            await Promise.allSettled(fetchPromises);

            setHabilidades(Array.isArray(arrHabilidades) ? arrHabilidades : []);

            // ── Calcular Estadísticas ──
            const totalPostulado = arrPostulaciones.length;
            const totalPublicado = arrPublicaciones.length;
            
            const activasTrabajador = arrPostulaciones.filter(p => ['aceptada', 'en_progreso'].includes(p.estado) && p.trabajo?.estado !== 'completado' && p.trabajo?.estado !== 'cancelado').length;
            const activasEmpleador = arrPublicaciones.filter(p => !['completado', 'cancelado'].includes(p.estado)).length;
            const proyectosActivos = activasTrabajador + activasEmpleador;

            let tasaExito = 0;
            if (isTrabajador && totalPostulado > 0) {
                const aceptadas = arrPostulaciones.filter(p => p.estado === 'aceptada' || p.estado === 'completada').length;
                tasaExito = (aceptadas / totalPostulado) * 100;
            } else if (isEmpleador && totalPublicado > 0) {
                const completados = arrPublicaciones.filter(p => p.estado === 'completado').length;
                tasaExito = (completados / totalPublicado) * 100;
            }

            // Si es ambos roles mostrará la suma
            const totalesG = isTrabajador && isEmpleador ? totalPostulado + totalPublicado : (isTrabajador ? totalPostulado : totalPublicado);
            const labelTotalesG = isTrabajador && isEmpleador ? "Operaciones" : (isTrabajador ? "Postulaciones" : "Publicaciones");

            setActividadStats({
                totales: totalesG,
                labelTotales: labelTotalesG,
                proyectosActivos,
                tasaExito: Math.round(tasaExito)
            });

            // ── Construir Feed de Actividad ──
            let feed = [];
            arrPostulaciones.forEach(p => {
                feed.push({
                    id: `post-${p.id_postulacion}`,
                    tipo: 'postulacion',
                    estado: p.estado,
                    titulo: `Postulación ${p.estado} - ${p.trabajo?.titulo || 'Proyecto'}`,
                    fechaRaw: new Date(p.fecha_postulacion),
                    fecha: new Date(p.fecha_postulacion).toLocaleDateString()
                });
            });
            arrPublicaciones.forEach(p => {
                feed.push({
                    id: `pub-${p.id_trabajo}`,
                    tipo: 'publicacion',
                    estado: p.estado,
                    titulo: `Trabajo ${p.estado} - ${p.titulo}`,
                    fechaRaw: new Date(p.fecha_creacion),
                    fecha: new Date(p.fecha_creacion).toLocaleDateString()
                });
            });

            feed.sort((a, b) => b.fechaRaw - a.fechaRaw);
            setActividadReciente(feed.slice(0, 5));

        } catch (error) {
            console.error("Error al cargar datos del usuario:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const handleActivarRol = async (nuevoRol) => {
        const result = await Swal.fire({
            title: 'Confirmar activación',
            text: `¿Quieres activar el perfil de ${nuevoRol}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#f97316',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Sí, activar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/usuarios/agregar-rol`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ rol: nuevoRol })
            });
            if (res.ok) {
                Swal.fire('¡Éxito!', `Ahora tienes el perfil de ${nuevoRol}`, 'success');
                onRefresh();
            } else {
                const data = await res.json();
                Swal.fire('Error', `Error: ${data.error || data.message}`, 'error');
            }
        } catch (error) {
            console.error("Error activando rol:", error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    const getColorForActivity = (estado) => {
        if (estado === 'aceptada' || estado === 'completado') return '#10b981'; // Green
        if (estado === 'pendiente' || estado === 'publicado') return '#f97316'; // Orange
        if (estado === 'rechazada' || estado === 'cancelado') return '#ef4444'; // Red
        return '#3b82f6'; // Blue
    };

    const skillsColors = [
        { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
        { color: '#ea580c', bg: '#fff7ed', border: '#ffedd5' },
        { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' },
        { color: '#ca8a04', bg: '#fefce8', border: '#fef08a' },
        { color: '#7c3aed', bg: '#f5f3ff', border: '#ddd6fe' },
        { color: '#0d9488', bg: '#f0fdfa', border: '#ccfbf1' },
        { color: '#c026d3', bg: '#fdf4ff', border: '#fbcfe8' }
    ];

    if (loadingData) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
                <Loader2 size={30} style={{ color: '#ea580c', animation: 'spin 1s linear infinite' }} />
                <p style={{ color: '#64748b', fontWeight: 600, marginTop: '1rem' }}>Sincronizando tus datos...</p>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
            
            {/* ── COLUMNA IZQUIERDA ── */}
            <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '300px' }}>
                
                {/* TARJETA 1: MI PERFIL */}
                <div style={{
                    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                    borderRadius: '24px', padding: '1.75rem', backdropFilter: 'blur(12px)',
                    boxShadow: t.darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px -8px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg,#ffedd5,#ffedd5)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <User size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: t.textPrimary, margin: 0 }}>Mi Perfil</h3>
                            <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: '2px 0 0' }}>Tu información personal y estado de cuenta.</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                        <InfoCard label="Correo electrónico" icon={<Mail size={19} />} iconBg="linear-gradient(135deg,#dbeafe,#bfdbfe)" iconColor="#1d4ed8">
                            <p style={{ fontSize: '0.93rem', fontWeight: 700, color: t.textPrimary, margin: 0, wordBreak: 'break-all' }}>{usuario.correo}</p>
                        </InfoCard>

                        <InfoCard label="Ubicación" icon={<MapPin size={19} />} iconBg="linear-gradient(135deg,#ffe4e6,#fecdd3)" iconColor="#e11d48">
                            <p style={{ fontSize: '0.93rem', fontWeight: 700, color: t.textPrimary, margin: 0, wordBreak: 'break-all' }}>{usuario.ciudad || "No especificada"}</p>
                        </InfoCard>

                        <InfoCard label="Teléfono" icon={<Phone size={19} />} iconBg="linear-gradient(135deg,#d1fae5,#a7f3d0)" iconColor="#059669">
                            <p style={{ fontSize: '0.93rem', fontWeight: 700, color: t.textPrimary, margin: 0 }}>{usuario.telefono || "No especificado"}</p>
                        </InfoCard>

                        <InfoCard label="Estado de cuenta" icon={<CheckCircle size={19} />}
                            iconBg={usuario.estado === 'activo' ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)' : 'linear-gradient(135deg,#fee2e2,#fecaca)'}
                            iconColor={usuario.estado === 'activo' ? '#16a34a' : '#dc2626'}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '3px 10px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700,
                                background: usuario.estado === 'activo' ? (t.darkMode ? 'rgba(22,163,74,0.15)' : '#ecfdf5') : (t.darkMode ? 'rgba(220,38,38,0.15)' : '#fef2f2'),
                                color: usuario.estado === 'activo' ? '#16a34a' : '#dc2626',
                                border: `1px solid ${usuario.estado === 'activo' ? 'rgba(22,163,74,0.3)' : 'rgba(220,38,38,0.3)'}`,
                            }}>
                                {usuario.estado === 'activo' ? '● Activo' : '● Inactivo'}
                            </span>
                        </InfoCard>

                        <InfoCard label="Identidad" icon={<ShieldCheck size={19} />}
                            iconBg={usuario.verificado ? 'linear-gradient(135deg,#d1fae5,#a7f3d0)' : 'linear-gradient(135deg,#f1f5f9,#e2e8f0)'}
                            iconColor={usuario.verificado ? '#16a34a' : '#94a3b8'}>
                            <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '4px',
                                padding: '3px 10px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700,
                                background: usuario.verificado ? (t.darkMode ? 'rgba(22,163,74,0.15)' : '#ecfdf5') : (t.darkMode ? 'rgba(148,163,184,0.15)' : '#f8fafc'),
                                color: usuario.verificado ? '#16a34a' : t.textSecondary,
                                border: `1px solid ${usuario.verificado ? 'rgba(22,163,74,0.3)' : t.cardBorder}`,
                            }}>
                                {usuario.verificado ? '✓ Verificado' : 'Pendiente'}
                            </span>
                        </InfoCard>

                        <InfoCard label="Miembro desde" icon={<Calendar size={19} />} iconBg="linear-gradient(135deg,#fef3c7,#fde68a)" iconColor="#d97706">
                            <p style={{ fontSize: '0.93rem', fontWeight: 700, color: t.textPrimary, margin: 0 }}>
                                {new Date(usuario.fecha_registro).toLocaleDateString("es-CO", { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </InfoCard>

                        {/* Perfiles activos — ancho completo */}
                        <div style={{
                            padding: '1.1rem 1.4rem', borderRadius: '18px', gridColumn: '1 / -1',
                            background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.9rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={18} />
                                </div>
                                <p style={{ fontSize: '0.72rem', fontWeight: 700, color: t.textSecondary, margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Perfiles activos</p>
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {usuario.rolesAsignados?.map(r => (
                                    <span key={r.rol.id_rol} style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '9px 18px', borderRadius: '13px',
                                        background: r.rol.nombre === 'Empleador'
                                            ? 'linear-gradient(135deg,#1e293b,#0f172a)'
                                            : 'linear-gradient(135deg,#fff7ed,#ffedd5)',
                                        border: `1px solid ${r.rol.nombre === 'Empleador' ? 'transparent' : '#fed7aa'}`,
                                        color: r.rol.nombre === 'Empleador' ? '#f97316' : '#c2410c',
                                        fontWeight: 700, fontSize: '0.9rem',
                                    }}>
                                        {r.rol.nombre === 'Empleador' ? <Briefcase size={17} /> : <Wrench size={17} />}
                                        {r.rol.nombre}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TARJETA 2: ACTIVIDAD RECIENTE */}
                <div style={{
                    background: t.darkMode ? t.cardBg : 'rgba(255,255,255,0.75)', border: t.darkMode ? `1px solid ${t.cardBorder}` : '1px solid rgba(249,115,22,0.15)',
                    borderRadius: '24px', padding: '1.75rem', backdropFilter: 'blur(12px)',
                    boxShadow: t.darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px -8px rgba(0,0,0,0.05)'
                }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: t.darkMode ? 'linear-gradient(135deg,#1e293b,#0f172a)' : 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', color: t.darkMode ? '#94a3b8' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Rocket size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: t.textPrimary, margin: 0 }}>Actividad Reciente</h3>
                            <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: '2px 0 0' }}>Tus últimas interacciones en la plataforma.</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {actividadReciente.length > 0 ? (
                            actividadReciente.map((act, index) => (
                                <div key={act.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', paddingBottom: index < actividadReciente.length - 1 ? '1.25rem' : '0', borderBottom: index < actividadReciente.length - 1 ? `1px solid ${t.cardBorder}` : 'none' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: getColorForActivity(act.estado), marginTop: '4px' }} />
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.95rem', color: t.textPrimary }}>{act.titulo}</p>
                                        <p style={{ margin: 0, fontSize: '0.8rem', color: t.textSecondary, marginTop: '4px' }}>{act.fecha}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: t.textSecondary, fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>No tienes actividad reciente. Envía postulaciones o publica un proyecto.</p>
                        )}
                    </div>
                </div>

                {/* ── EXPANDIR ROLES ── */}
                {(!usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") ||
                    !usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador")) && (
                        <div style={{
                            background: t.darkMode ? 'linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(30,41,59,0.5) 100%)' : 'linear-gradient(135deg, rgba(249,115,22,0.04) 0%, rgba(255,255,255,0.9) 100%)',
                            border: t.darkMode ? `1px solid ${t.cardBorder}` : '1px solid rgba(249,115,22,0.15)', borderRadius: '24px', padding: '1.75rem',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
                                <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: t.darkMode ? 'linear-gradient(135deg,rgba(249,115,22,0.2),rgba(234,88,12,0.1))' : 'linear-gradient(135deg,#fff7ed,#ffedd5)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Rocket size={22} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: t.textPrimary, margin: 0 }}>Expande tus posibilidades</h3>
                                    <p style={{ color: t.textSecondary, fontSize: '0.875rem', margin: '3px 0 0' }}>Activa otro perfil y desbloquea más opciones.</p>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                                {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") && (
                                    <button type="button" onClick={() => handleActivarRol("Empleador")}
                                        style={{ background: t.cardBg2, padding: '1.5rem', borderRadius: '18px', border: `1px solid ${t.cardBorder}`, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: t.darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)', fontFamily: 'var(--font-sans)', color: t.textPrimary }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = t.darkMode ? '0 12px 30px -4px rgba(0,0,0,0.5)' : '0 12px 30px -4px rgba(15,23,42,0.15)'; e.currentTarget.style.borderColor = t.darkMode ? '#f97316' : '#0f172a'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = t.darkMode ? 'none' : '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = t.cardBorder; }}
                                    >
                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: t.darkMode ? 'linear-gradient(135deg,#0f172a,#1e293b)' : 'linear-gradient(135deg,#1e293b,#0f172a)', border: t.darkMode ? '1px solid rgba(255,255,255,0.1)' : 'none', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <Briefcase size={28} />
                                        </div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '6px' }}>Modo Empleador</h4>
                                        <p style={{ color: t.textSecondary, fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>Publica trabajos y contrata profesionales.</p>
                                    </button>
                                )}
                                {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador") && (
                                    <button type="button" onClick={() => handleActivarRol("Trabajador")}
                                        style={{ background: t.cardBg2, padding: '1.5rem', borderRadius: '18px', border: t.darkMode ? `1px solid rgba(249,115,22,0.5)` : '1px solid #fed7aa', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: t.darkMode ? 'none' : '0 2px 8px rgba(249,115,22,0.08)', fontFamily: 'var(--font-sans)', color: t.textPrimary }}
                                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = t.darkMode ? '0 12px 30px -4px rgba(249,115,22,0.15)' : '0 12px 30px -4px rgba(249,115,22,0.25)'; e.currentTarget.style.borderColor = '#f97316'; }}
                                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = t.darkMode ? 'none' : '0 2px 8px rgba(249,115,22,0.08)'; e.currentTarget.style.borderColor = t.darkMode ? 'rgba(249,115,22,0.5)' : '#fed7aa'; }}
                                    >
                                        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <Wrench size={28} />
                                        </div>
                                        <h4 style={{ fontSize: '1rem', fontWeight: 800, color: t.textPrimary, marginBottom: '6px' }}>Modo Trabajador</h4>
                                        <p style={{ color: t.textSecondary, fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>Postúlate a trabajos y ofrece tus servicios.</p>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
            </div>

            {/* ── COLUMNA DERECHA ── */}
            <div style={{ flex: '1 1 30%', display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '280px' }}>
                
                {/* TARJETA 3: ESTADÍSTICAS */}
                <div style={{
                    background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                    borderRadius: '24px', padding: '1.75rem', backdropFilter: 'blur(12px)',
                    boxShadow: t.darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(249,115,22,0.1)'
                }}>
                    <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Star size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: t.textPrimary, margin: 0 }}>Estadísticas</h3>
                            <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: '2px 0 0' }}>En total</p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}`, padding: '1.25rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#f97316', lineHeight: 1.1 }}>{actividadStats.totales}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: t.textSecondary, fontWeight: 700, marginTop: '4px' }}>{actividadStats.labelTotales}</p>
                        </div>
                        <div style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}`, padding: '1.25rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#10b981', lineHeight: 1.1 }}>{actividadStats.proyectosActivos}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: t.textSecondary, fontWeight: 700, marginTop: '4px' }}>Proyectos activos</p>
                        </div>
                        <div style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}`, padding: '1.25rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#3b82f6', lineHeight: 1.1 }}>
                                {promedio.promedio > 0 ? promedio.promedio.toFixed(1) : "N/A"}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: t.textSecondary, fontWeight: 700, marginTop: '4px' }}>Calificación</p>
                        </div>
                        <div style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}`, padding: '1.25rem 1rem', borderRadius: '16px', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#eab308', lineHeight: 1.1 }}>{actividadStats.tasaExito}%</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: t.textSecondary, fontWeight: 700, marginTop: '4px' }}>Tasa de éxito</p>
                        </div>
                    </div>
                </div>

                {/* TARJETA 4: HABILIDADES */}
                {usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador") && (
                    <div style={{
                        background: t.cardBg, border: `1px solid ${t.cardBorder}`,
                        borderRadius: '24px', padding: '1.75rem', backdropFilter: 'blur(12px)',
                        boxShadow: t.darkMode ? '0 8px 32px rgba(0,0,0,0.5)' : '0 10px 30px -10px rgba(249,115,22,0.1)'
                    }}>
                        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'linear-gradient(135deg,#f1f5f9,#e2e8f0)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Wrench size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: t.textPrimary, margin: 0 }}>Habilidades</h3>
                                <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: '2px 0 0' }}>Top skills verificadas</p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {habilidades.length > 0 ? (
                                habilidades.slice(0, 10).map((hab, index) => {
                                    const style = skillsColors[index % skillsColors.length];
                                    return (
                                        <span key={hab.id_habilidad} style={{
                                            padding: '6px 16px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700,
                                            color: t.darkMode ? style.color : style.color, background: t.darkMode ? 'rgba(255,255,255,0.05)' : style.bg, border: `1px solid ${t.darkMode ? 'rgba(255,255,255,0.1)' : style.border}`
                                        }}>
                                            {hab.descripcion}
                                        </span>
                                    );
                                })
                            ) : (
                                <p style={{ color: t.textSecondary, fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>Crea tu primera habilidad en la pestaña "Mis Habilidades".</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DatosPersonales;
