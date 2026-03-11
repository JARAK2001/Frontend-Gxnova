import React, { useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, MapPin, Award } from 'lucide-react';

const beneficios = [
    {
        icono: ShieldCheck,
        titulo: 'Seguridad Verificada',
        descripcion: 'Todos los usuarios pasan por verificación de identidad. Tu seguridad es nuestra prioridad.',
        accent: '#22c55e',
        bg: '#f0fdf4',
        borderColor: '#bbf7d0',
    },
    {
        icono: RefreshCw,
        titulo: 'Pagos Flexibles',
        descripcion: 'Única plataforma que permite pagos en dinero o trueque. Tú decides cómo pagar.',
        accent: '#3b82f6',
        bg: '#eff6ff',
        borderColor: '#bfdbfe',
    },
    {
        icono: MapPin,
        titulo: 'Talento Local',
        descripcion: 'Encuentra expertos cerca de ti. Fomentamos la economía local y reducimos los tiempos de espera.',
        accent: '#a855f7',
        bg: '#fdf4ff',
        borderColor: '#e9d5ff',
    },
    {
        icono: Award,
        titulo: 'Sin Comisiones Ocultas',
        descripcion: 'Trato directo entre cliente y profesional. Sin intermediarios que encarezcan el servicio.',
        accent: '#f97316',
        bg: '#fff7ed',
        borderColor: '#fed7aa',
    },
];

const Beneficios = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const cards = sectionRef.current.querySelectorAll('.benefit-card');
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; observer.unobserve(e.target); }
            }),
            { threshold: 0.1 }
        );
        cards.forEach(c => observer.observe(c));
        return () => observer.disconnect();
    }, []);

    return (
        <section style={{ padding: '5.5rem 0', background: 'var(--slate-50)' }} ref={sectionRef}>
            <div className="container mx-auto px-6" style={{ maxWidth: '1200px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span className="section-badge">Ventajas Exclusivas</span>
                    <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: 'var(--slate-900)', marginTop: '14px', letterSpacing: '-0.02em' }}>
                        ¿Por qué elegir{' '}
                        <span style={{ color: 'var(--orange-600)' }}>Gxnova</span>?
                    </h2>
                    <p style={{ marginTop: '10px', color: 'var(--slate-600)', fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
                        Más que una app de servicios, somos una comunidad diseñada para conectar talento con oportunidades reales.
                    </p>
                </div>

                {/* Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: '20px',
                }}>
                    {beneficios.map((b, i) => {
                        const Icon = b.icono;
                        return (
                            <div
                                key={i}
                                className="benefit-card"
                                style={{
                                    background: '#fff',
                                    borderRadius: '20px',
                                    padding: '32px 28px',
                                    border: `1.5px solid var(--slate-100)`,
                                    borderLeft: `4px solid ${b.accent}`,
                                    boxShadow: 'var(--shadow-md)',
                                    opacity: 0,
                                    transform: 'translateY(24px)',
                                    transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, box-shadow 0.22s ease`,
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 16px 40px -8px ${b.accent}25, 0 2px 12px -4px rgba(0,0,0,0.06)`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'var(--slate-200)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--slate-100)'; }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '52px', height: '52px',
                                    background: `${b.accent}18`,
                                    borderRadius: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px',
                                    border: `1px solid ${b.accent}30`,
                                }}>
                                    <Icon size={24} color={b.accent} />
                                </div>

                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '10px' }}>
                                    {b.titulo}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)', lineHeight: 1.7, margin: 0 }}>
                                    {b.descripcion}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default Beneficios;
