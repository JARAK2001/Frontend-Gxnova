import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { Link } from "react-router-dom";
import { Clock, CheckCircle, XCircle, Briefcase, Eye, Calendar, MapPin } from 'lucide-react';

function MisPostulaciones({ usuarioId }) {
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtroTab, setFiltroTab] = useState('activas');

    useEffect(() => {
        if (usuarioId) cargarPostulaciones();
    }, [usuarioId]);

    const cargarPostulaciones = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/postulaciones?id_trabajador=${usuarioId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setPostulaciones(data.postulaciones || []);
        } catch (error) {
            console.error("Error cargando mis postulaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const filtradas = postulaciones.filter(post => {
        const esHistorial = post.estado === 'rechazada' ||
            (post.trabajo && (post.trabajo.estado === 'completado' || post.trabajo.estado === 'cancelado'));
        if (filtroTab === 'activas') return !esHistorial;
        return esHistorial;
    });



    const StatusBadge = ({ estado, trabajoEstado }) => {
        const config = {
            aceptada: { icon: CheckCircle, bg: "#ecfdf5", color: "#059669", border: "#a7f3d0", shadow: "rgba(16,185,129,0.2)" },
            pendiente: { icon: Clock, bg: "#fffbeb", color: "#d97706", border: "#fde68a", shadow: "rgba(234,179,8,0.2)" },
            rechazada: { icon: XCircle, bg: "#fef2f2", color: "#dc2626", border: "#fecaca", shadow: "rgba(239,68,68,0.2)" },
        };
        const item = config[estado] || config.pendiente;
        const Icon = item.icon;

        return (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '12px', fontSize: '0.82rem', fontWeight: 800,
                    background: item.bg, color: item.color, border: `1px solid ${item.border}`, textTransform: 'uppercase', boxShadow: `0 2px 10px -2px ${item.shadow}`
                }}>
                    <Icon size={14} /> {estado}
                </span>
                {trabajoEstado && (trabajoEstado === 'completado' || trabajoEstado === 'cancelado') && (
                    <span style={{ padding: '6px 14px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 700, background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0', textTransform: 'uppercase' }}>
                        Proyecto {trabajoEstado}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div style={{ marginTop: '0.5rem' }}>

            {/* Pill tabs redesign */}
            <div style={{
                display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', gap: '1rem'
            }}>
                <div style={{
                    display: 'inline-flex', background: 'rgba(241,245,249,0.8)', padding: '5px', borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(8px)',
                }}>
                <button
                    onClick={() => setFiltroTab('activas')}
                    style={{
                        padding: '12px 28px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 800,
                        border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                        background: filtroTab === 'activas' ? '#fff' : 'transparent',
                        color: filtroTab === 'activas' ? '#ea580c' : '#64748b',
                        boxShadow: filtroTab === 'activas' ? '0 10px 20px -5px rgba(0,0,0,0.1)' : 'none',
                        fontFamily: 'var(--font-sans)',
                    }}
                >
                    En Proceso
                </button>
                <button
                    onClick={() => setFiltroTab('historial')}
                    style={{
                        padding: '12px 28px', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 800,
                        border: 'none', cursor: 'pointer', transition: 'all 0.3s ease',
                        background: filtroTab === 'historial' ? '#fff' : 'transparent',
                        color: filtroTab === 'historial' ? '#ea580c' : '#64748b',
                        boxShadow: filtroTab === 'historial' ? '0 10px 20px -5px rgba(0,0,0,0.1)' : 'none',
                        fontFamily: 'var(--font-sans)',
                    }}
                >
                    Historial
                </button>
            </div>

            </div>

            {loading ? (
                <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : filtradas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4.5rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Briefcase size={34} />
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                        {filtroTab === 'activas' ? "No hay aplicaciones vigentes" : "Historial vacío"}
                    </h4>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
                        {filtroTab === 'activas' ? "¿A qué esperas para conseguir tu próximo gran proyecto?" : "Aquí verás los trabajos en los que ya has finalizado tu participación."}
                    </p>
                    {filtroTab === 'activas' && (
                        <Link to="/servicios" style={{ padding: '14px 32px', borderRadius: '14px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff', fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 20px -4px rgba(249,115,22,0.4)', transition: 'all 0.2s' }}>
                            Explorar Proyectos
                        </Link>
                    )}
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
                    {filtradas.map((postulacion) => (
                        <div key={postulacion.id_postulacion} style={{
                            background: '#fff', borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden',
                            border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', transition: 'all 0.3s',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(0,0,0,0.06), 0 5px 15px -5px rgba(249,115,22,0.1)'; e.currentTarget.style.borderColor = '#fed7aa'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                        >
                            <div style={{ marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                                        {postulacion.trabajo?.titulo || "Proyecto Eliminado"}
                                    </h3>
                                    <StatusBadge estado={postulacion.estado} trabajoEstado={postulacion.trabajo?.estado} />
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '14px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                                        <Calendar size={14} />
                                        <span>{new Date(postulacion.fecha_postulacion).toLocaleDateString("es-CO", { day: 'numeric', month: 'short' })}</span>
                                    </div>
                                    {postulacion.trabajo?.ubicacion && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                                            <MapPin size={14} />
                                            <span>{postulacion.trabajo.ubicacion}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div style={{ marginTop: 'auto' }}>
                                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginBottom: '1.25rem' }} />
                                <Link
                                    to={postulacion.trabajo ? `/detalles/${postulacion.trabajo.id_trabajo}` : "#"}
                                    style={{
                                        width: '100%', padding: '12px', borderRadius: '14px', boxSizing: 'border-box',
                                        background: '#f8fafc', color: '#1e293b', fontWeight: 800, fontSize: '0.9rem',
                                        border: '1px solid #e2e8f0', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                        transition: 'all 0.2s ease', cursor: postulacion.trabajo ? 'pointer' : 'not-allowed', opacity: postulacion.trabajo ? 1 : 0.6
                                    }}
                                    onMouseEnter={e => { if(postulacion.trabajo) { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = '#0f172a'; } }}
                                    onMouseLeave={e => { if(postulacion.trabajo) { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#1e293b'; e.currentTarget.style.borderColor = '#e2e8f0'; } }}
                                >
                                    <Eye size={18} /> Detalles de la Postulación
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MisPostulaciones;
