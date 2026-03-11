import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, MapPin, AlertCircle, ArrowRight, Clock } from 'lucide-react';

function TrabajosDestacados({ trabajos, loading, titulo, esRecientes }) {
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    const formatearPrecio = (monto) => {
        if (!monto) return "A convenir";
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(monto);
    };

    const esUrgente = (fecha) => {
        if (!fecha) return false;
        const fechaEstimada = new Date(fecha);
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        return fechaEstimada <= manana && fechaEstimada >= new Date();
    };

    useEffect(() => {
        if (!sectionRef.current) return;
        const cards = sectionRef.current.querySelectorAll('.job-card');
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.08 }
        );
        cards.forEach(card => observer.observe(card));
        return () => observer.disconnect();
    }, [trabajos]);

    return (
        <section style={{ padding: '5.5rem 0', background: 'var(--slate-50)' }} ref={sectionRef}>
            <div className="container mx-auto px-4" style={{ maxWidth: '1280px' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="section-badge" style={{ marginBottom: '12px' }}>
                        {titulo ? <AlertCircle style={{ width: 13, height: 13 }} /> : esRecientes ? <Clock style={{ width: 13, height: 13 }} /> : <Flame style={{ width: 13, height: 13 }} />}
                        {titulo ? 'Urgentes' : esRecientes ? 'Recientes' : 'Oportunidades'}
                    </span>
                    <h2 style={{
                        fontSize: 'clamp(1.8rem, 3vw, 2.4rem)',
                        fontWeight: 800,
                        color: 'var(--slate-900)',
                        marginTop: '12px',
                        letterSpacing: '-0.02em',
                    }}>
                        {titulo || (esRecientes ? 'Trabajos recientes' : 'Trabajos destacados')}
                    </h2>
                    <p style={{ color: 'var(--slate-600)', marginTop: '8px', fontSize: '1rem' }}>
                        {titulo ? 'Proyectos que cierran en las próximas 24 horas' : 'Proyectos recientes que buscan talento'}
                    </p>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280', fontSize: '1rem' }}>
                        Cargando trabajos...
                    </div>
                ) : !trabajos || trabajos.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem',
                        background: '#fff',
                        borderRadius: 'var(--radius-card)',
                        border: '1.5px solid var(--slate-100)',
                        color: 'var(--slate-500)',
                        fontSize: '1rem',
                        boxShadow: 'var(--shadow-sm)',
                    }}>
                        No hay trabajos disponibles en este momento
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px',
                    }}>
                        {trabajos.map((trabajo, i) => {
                            const urgente = esUrgente(trabajo.fecha_estimada);
                            return (
                                <article
                                    key={trabajo.id_trabajo}
                                    className="job-card"
                                    onClick={() => navigate(`/detalles/${trabajo.id_trabajo}`)}
                                    style={{
                                        background: '#fff',
                                        borderRadius: 'var(--radius-card)',
                                        padding: '24px',
                                        border: urgente ? '2px solid rgba(239,68,68,0.4)' : '1.5px solid var(--slate-100)',
                                        boxShadow: 'var(--shadow-sm)',
                                        cursor: 'pointer',
                                        opacity: 0,
                                        transform: 'translateY(20px)',
                                        transition: 'transform 0.22s cubic-bezier(0.4,0,0.2,1), box-shadow 0.22s ease, border-color 0.22s ease',
                                        transitionDelay: `${i * 50}ms`,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'translateY(-6px)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                                        if (urgente) e.currentTarget.style.borderColor = 'rgba(239,68,68,0.6)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        if (urgente) e.currentTarget.style.borderColor = 'rgba(239,68,68,0.4)';
                                    }}
                                >
                                    {urgente && (
                                        <div style={{
                                            position: 'absolute', top: 0, right: 0,
                                            background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                                            color: '#fff',
                                            fontSize: '0.7rem',
                                            fontWeight: 800,
                                            padding: '6px 12px',
                                            borderRadius: '0 0 0 12px',
                                            display: 'flex', alignItems: 'center', gap: '4px',
                                            boxShadow: '0 2px 8px rgba(239,68,68,0.35)',
                                        }}>
                                            <AlertCircle size={12} /> URGENTE
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                                        <span style={{
                                            padding: '5px 12px',
                                            background: 'var(--orange-50)',
                                            border: '1px solid var(--orange-100)',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: 'var(--orange-600)',
                                        }}>
                                            {trabajo.categoria?.nombre || 'Sin categoría'}
                                        </span>
                                        <span style={{
                                            padding: '5px 10px',
                                            borderRadius: '999px',
                                            fontSize: '0.72rem',
                                            fontWeight: 700,
                                            textTransform: 'capitalize',
                                            background: trabajo.estado === 'publicado' ? '#f0fdf4' : 'var(--slate-50)',
                                            color: trabajo.estado === 'publicado' ? '#16a34a' : 'var(--slate-500)',
                                            border: `1px solid ${trabajo.estado === 'publicado' ? '#dcfce7' : 'var(--slate-100)'}`,
                                        }}>
                                            {trabajo.estado}
                                        </span>
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.1rem',
                                        fontWeight: 800,
                                        color: 'var(--slate-900)',
                                        marginBottom: '8px',
                                        lineHeight: 1.35,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {trabajo.titulo}
                                    </h3>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: 'var(--slate-600)',
                                        lineHeight: 1.6,
                                        marginBottom: '16px',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}>
                                        {trabajo.descripcion}
                                    </p>
                                    <div style={{ marginBottom: '12px' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--slate-500)', marginBottom: '2px' }}>Tipo de pago</p>
                                        <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--slate-900)' }}>
                                            {trabajo.tipo_pago === 'dinero' ? formatearPrecio(trabajo.monto_pago) : 'Trueque'}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--slate-500)', marginBottom: '16px' }}>
                                        <MapPin size={14} /> {trabajo.ubicacion}
                                    </div>
                                    <button
                                        type="button"
                                        style={{
                                            width: '100%',
                                            padding: '12px 20px',
                                            background: urgente
                                                ? 'linear-gradient(135deg, #dc2626, #b91c1c)'
                                                : 'linear-gradient(135deg, #f97316, #ea580c)',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            boxShadow: urgente ? '0 4px 14px -2px rgba(239,68,68,0.4)' : 'var(--shadow-orange)',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                            fontFamily: 'var(--font-sans)',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/detalles/${trabajo.id_trabajo}`);
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                            e.currentTarget.style.boxShadow = urgente ? '0 8px 20px -4px rgba(239,68,68,0.5)' : '0 8px 24px -4px rgba(249,115,22,0.45)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.transform = '';
                                            e.currentTarget.style.boxShadow = urgente ? '0 4px 14px -2px rgba(239,68,68,0.4)' : 'var(--shadow-orange)';
                                        }}
                                    >
                                        {urgente ? <><AlertCircle size={16} /> Ver urgencia</> : 'Ver detalles'}
                                    </button>
                                </article>
                            );
                        })}
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <button
                        type="button"
                        onClick={() => navigate("/servicios")}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: 'var(--orange-600)', background: 'none', border: 'none',
                            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                            padding: '10px 20px', borderRadius: '12px',
                            fontFamily: 'inherit',
                            transition: 'background 0.18s, color 0.18s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; }}
                    >
                        Ver todos los trabajos <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default TrabajosDestacados;
