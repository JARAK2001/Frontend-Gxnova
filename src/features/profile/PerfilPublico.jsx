import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API_URL from "../../config/api";
import Encabezado from "../../layouts/Encabezado";
import Footer from "../../layouts/Footer";
import {
    Star, Briefcase, MapPin, Calendar, MessageSquare,
    CheckCircle, Clock, ArrowLeft, User, Wrench, Award,
    ShieldCheck, ExternalLink, Loader2, Mail, Phone
} from "lucide-react";

/* ── Star render ── */
function StarRating({ value, size = 16 }) {
    return (
        <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
            {[1, 2, 3, 4, 5].map(i => (
                <Star
                    key={i}
                    size={size}
                    style={{
                        fill: i <= Math.round(value) ? "#f59e0b" : "transparent",
                        color: i <= Math.round(value) ? "#f59e0b" : "#d1d5db",
                    }}
                />
            ))}
        </div>
    );
}

function PerfilPublico() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [perfil, setPerfil] = useState(null);
    const [calificaciones, setCalificaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [pagina, setPagina] = useState(1);
    const POR_PAGINA = 5;

    useEffect(() => {
        cargarPerfil();
        cargarCalificaciones();
    }, [id]);

    const cargarPerfil = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/usuarios/${id}/perfil-publico`);
            const data = await res.json();
            if (res.ok) setPerfil(data.perfil);
        } catch (e) {
            console.error("Error al cargar perfil:", e);
        } finally {
            setLoading(false);
        }
    };

    const cargarCalificaciones = async () => {
        setLoadingReviews(true);
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/usuario/${id}`);
            const data = await res.json();
            if (res.ok) setCalificaciones(data.calificaciones || []);
        } catch (e) {
            console.error("Error al cargar calificaciones:", e);
        } finally {
            setLoadingReviews(false);
        }
    };

    const formatFecha = (f) => new Date(f).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

    if (loading) return (
        <div style={{ minHeight: "100vh", background: "var(--slate-50)" }}>
            <Encabezado />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
                <Loader2 size={48} className="animate-spin" color="var(--orange-500)" />
                <p style={{ color: "var(--slate-600)", fontWeight: 600 }}>Cargando perfil…</p>
            </div>
            <Footer />
        </div>
    );

    if (!perfil) return (
        <div style={{ minHeight: "100vh", background: "var(--slate-50)" }}>
            <Encabezado />
            <div style={{ textAlign: "center", padding: "80px 24px" }}>
                <User size={48} style={{ margin: "0 auto 16px", color: "var(--slate-300)" }} />
                <h2 style={{ fontWeight: 800, color: "var(--slate-900)" }}>Perfil no encontrado</h2>
                <button onClick={() => navigate(-1)} style={{ marginTop: "16px", padding: "12px 24px", borderRadius: "12px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontWeight: 700, border: "none", cursor: "pointer" }}>
                    Volver
                </button>
            </div>
            <Footer />
        </div>
    );

    const avg = perfil.estadisticas?.promedioCalificacion || 0;
    const totalReviews = perfil.estadisticas?.totalCalificaciones || 0;
    const completados = perfil.estadisticas?.trabajosCompletados || 0;
    const fotoUrl = perfil.foto_perfil ? (perfil.foto_perfil.startsWith("http") ? perfil.foto_perfil : `${API_URL}${perfil.foto_perfil}`) : null;

    // Paginación de reseñas
    const totalPaginas = Math.ceil(calificaciones.length / POR_PAGINA);
    const reseñasPag = calificaciones.slice((pagina - 1) * POR_PAGINA, pagina * POR_PAGINA);

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(160deg, #fff7ed 0%, #f8fafc 40%, #f1f5f9 100%)", position: "relative" }}>
            <Encabezado />

            {/* ── Cover Banner ── */}
            <div style={{
                background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                height: '240px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                <div style={{ position: 'absolute', inset: 0, opacity: 0.4,
                    backgroundImage: `radial-gradient(circle at 15% 50%, rgba(255,255,255,0.4) 0%, transparent 40%),
                        radial-gradient(circle at 85% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)` }} />
                <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.03) 39px, rgba(255,255,255,0.03) 40px)' }} />
                
                {/* Back button floated over banner */}
                <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative', height: '100%' }}>
                    <button
                        onClick={() => navigate(-1)}
                        style={{ position: 'absolute', top: '24px', left: '24px', display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', background: 'rgba(0,0,0,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                    >
                        <ArrowLeft size={16} /> Volver
                    </button>
                </div>
            </div>

            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1.5rem 5rem', position: 'relative', zIndex: 1 }}>

                {/* ── Avatar Section ── */}
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem', marginTop: '-70px', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap' }}>
                        {/* Avatar with ring */}
                        <div style={{
                            width: '140px', height: '140px', borderRadius: '32px', padding: '5px', flexShrink: 0,
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            boxShadow: '0 12px 40px -8px rgba(249,115,22,0.5)',
                            position: 'relative'
                        }}>
                            {fotoUrl ? (
                                <img src={fotoUrl} alt={perfil.nombre} style={{ width: '100%', height: '100%', borderRadius: '28px', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.2)' }} />
                            ) : (
                                <div style={{ width: '100%', height: '100%', borderRadius: '28px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '2.5rem', color: '#f97316' }}>
                                    {perfil.nombre?.[0]}{perfil.apellido?.[0]}
                                </div>
                            )}
                            {perfil.verificado && (
                                <div style={{ position: 'absolute', bottom: '-8px', right: '-8px', width: '36px', height: '36px', borderRadius: '12px', background: '#10b981', border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(16,185,129,0.3)' }}>
                                    <ShieldCheck size={18} color="#fff" />
                                </div>
                            )}
                        </div>

                        <div style={{ paddingBottom: '0.75rem' }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                                <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1, letterSpacing: '-0.04em', textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                    {perfil.nombre} {perfil.apellido}
                                </h1>
                                {perfil.verificado && (
                                    <span style={{ padding: '4px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Verificado
                                    </span>
                                )}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--slate-500)', fontWeight: 600, fontSize: '0.94rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="var(--orange-500)" /> {perfil.ubicacion || "Colombia"}</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} color="var(--orange-500)" /> Se unió en {new Date(perfil.fecha_registro).getFullYear()}</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                         {perfil.rolesAsignados?.map(r => (
                             <span key={r.rol.id_rol} style={{
                                 padding: '6px 16px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 800,
                                 background: r.rol.nombre === 'Empleador'
                                     ? 'linear-gradient(135deg, #312e81, #1e1b4b)'
                                     : 'linear-gradient(135deg,#f97316,#ea580c)',
                                 color: '#fff',
                                 boxShadow: r.rol.nombre === 'Trabajador' ? '0 4px 12px rgba(249,115,22,0.3)' : '0 4px 12px rgba(49,46,129,0.2)',
                                 textTransform: 'uppercase', letterSpacing: '0.05em'
                             }}>
                                 {r.rol.nombre}
                             </span>
                         ))}
                         <button style={{ padding: '12px 24px', borderRadius: '14px', background: 'var(--slate-900)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}>
                            <MessageSquare size={18} color="var(--orange-500)" /> Enviar Mensaje
                         </button>
                    </div>
                </div>

                {/* ── Stats Glass Row ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                    {[
                        { label: "Calificación Promedio", value: avg > 0 ? avg.toFixed(1) : "—", icon: <Star size={24} />, color: "#f97316", count: `De ${totalReviews} reseñas` },
                        { label: "Trabajos Realizados", value: completados, icon: <Briefcase size={24} />, color: "#10b981", count: "Proyectos terminados" },
                        { label: "Nivel de Respuesta", value: "Rápida", icon: <Clock size={24} />, color: "#3b82f6", count: "Generalmente en 1h" },
                    ].map(s => (
                        <div key={s.label} style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(249,115,22,0.1)', borderRadius: '24px', padding: '24px', display: 'flex', gap: '20px', alignItems: 'center' }}>
                            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                {s.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0, lineHeight: 1 }}>{s.value}</p>
                                <p style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--slate-900)', opacity: 0.9, margin: '4px 0 0' }}>{s.label}</p>
                                <p style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--slate-500)', margin: '2px 0 0' }}>{s.count}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Content Grid ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(320px, 400px)', gap: '2rem', alignItems: 'start' }}>
                    
                    {/* Left: Habilidades & Portfolio */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <section style={{ background: '#fff', borderRadius: '32px', padding: '2.5rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.75rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #fff7ed, #ffedd5)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Award size={22} />
                                </div>
                                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0 }}>Habilidades Certificadas</h2>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                                {perfil.habilidades?.map(h => (
                                    <div key={h.id_habilidad} style={{ padding: '20px', borderRadius: '20px', background: '#f8fafc', border: '1.5px solid #edf2f7', transition: 'all 0.2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#fed7aa'; e.currentTarget.style.background = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#edf2f7'; e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.transform = ''; }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f97316', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{h.categoria?.nombre}</span>
                                            <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#1e293b' }}>${parseFloat(h.tarifa_hora).toLocaleString('es-CO')}</span>
                                        </div>
                                        <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px', lineHeight: 1.3 }}>{h.descripcion}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#10b981', fontSize: '0.75rem', fontWeight: 700 }}>
                                            <ShieldCheck size={12} /> Verificado con IA
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right: Reseñas */}
                    <aside style={{ background: '#fff', borderRadius: '32px', padding: '2rem', border: '1px solid #f1f5f9', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem' }}>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--slate-900)', margin: 0 }}>Opiniones</h3>
                            <span style={{ padding: '4px 12px', borderRadius: '999px', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 800, color: '#64748b' }}>{calificaciones.length}</span>
                        </div>

                        {loadingReviews ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                                <Loader2 size={32} className="animate-spin" color="var(--orange-500)" />
                            </div>
                        ) : calificaciones.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#94a3b8' }}>
                                <Star size={40} strokeWidth={1} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                                <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Sin reseñas todavía.</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {reseñasPag.map((c, i) => (
                                    <div key={i} style={{ padding: '16px', borderRadius: '20px', background: '#f8fafc', border: '1px solid #edf2f7' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--slate-900)', color: '#fff', fontSize: '0.75rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {c.emisor?.nombre?.[0]}
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{c.emisor?.nombre}</p>
                                                    <p style={{ fontSize: '0.7rem', color: '#64748b', margin: 0 }}>{formatFecha(c.fecha)}</p>
                                                </div>
                                            </div>
                                            <StarRating value={c.puntuacion} size={12} />
                                        </div>
                                        <p style={{ fontSize: '0.85rem', color: '#4b5563', margin: '8px 0 0', lineHeight: 1.5, fontStyle: 'italic' }}>"{c.comentario}"</p>
                                    </div>
                                ))}

                                {totalPaginas > 1 && (
                                    <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "1rem" }}>
                                        {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(p => (
                                            <button key={p} onClick={() => setPagina(p)} style={{ width: "30px", height: "30px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: 800, fontSize: "0.75rem", background: p === pagina ? "#0f172a" : "#f1f5f9", color: p === pagina ? "#fff" : "#64748b", transition: "all 0.2s" }}>
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </aside>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default PerfilPublico;
