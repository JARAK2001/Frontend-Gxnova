import React, { useEffect, useRef } from 'react';
import { ShieldCheck, RefreshCw, MapPin, Award } from 'lucide-react';
import { useThemeTokens } from '../../hooks/useThemeTokens';

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
    const t = useThemeTokens();
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
        <section style={{ padding: '5.5rem 0', background: t.pageBg, transition: 'background 0.3s' }} ref={sectionRef}>
            <div className="container mx-auto px-6" style={{ maxWidth: '1200px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <span className="section-badge">Ventajas Exclusivas</span>
                    <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: t.textPrimary, marginTop: '14px', letterSpacing: '-0.02em', transition: 'color 0.3s' }}>
                        ¿Por qué elegir{' '}
                        <span style={{ color: t.orange }}>Gxnova</span>?
                    </h2>
                    <p style={{ marginTop: '10px', color: t.textSecondary, fontSize: '1.05rem', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7, transition: 'color 0.3s' }}>
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
                                    background: t.cardBg,
                                    borderRadius: '20px',
                                    padding: '32px 28px',
                                    border: `1.5px solid ${t.cardBorder}`,
                                    borderLeft: `4px solid ${b.accent}`,
                                    boxShadow: t.darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : 'var(--shadow-md)',
                                    opacity: 0,
                                    transform: 'translateY(24px)',
                                    transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s, box-shadow 0.22s ease, background 0.3s`,
                                    cursor: 'default',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.boxShadow = t.darkMode ? `0 16px 40px -8px ${b.accent}40` : `0 16px 40px -8px ${b.accent}25, 0 2px 12px -4px rgba(0,0,0,0.06)`; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = t.darkMode ? b.accent + '60' : 'var(--slate-200)'; }}
                                onMouseLeave={e => { e.currentTarget.style.boxShadow = t.darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = t.cardBorder; }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '52px', height: '52px',
                                    background: t.darkMode ? t.cardBg2 : `${b.accent}18`,
                                    borderRadius: '14px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: '20px',
                                    border: `1px solid ${b.accent}30`,
                                }}>
                                    <Icon size={24} color={b.accent} />
                                </div>

                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: t.textPrimary, marginBottom: '10px', transition: 'color 0.3s' }}>
                                    {b.titulo}
                                </h3>
                                <p style={{ fontSize: '0.875rem', color: t.textSecondary, lineHeight: 1.7, margin: 0, transition: 'color 0.3s' }}>
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
