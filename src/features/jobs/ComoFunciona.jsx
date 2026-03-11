import React, { useEffect, useRef } from 'react';
import { Search, MessageSquare, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const pasos = [
    {
        icono: <Search className="w-7 h-7" style={{ color: '#f97316' }} />,
        titulo: 'Publica o Busca',
        descripcion: 'Describe el servicio que necesitas o explora ofertas de trabajo disponibles en tu zona.',
        color: '#f97316',
        bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
    },
    {
        icono: <MessageSquare className="w-7 h-7" style={{ color: '#3b82f6' }} />,
        titulo: 'Conecta y Acuerda',
        descripcion: 'Chat directo. Negocia el precio o propón un trueque justo sin intermediarios.',
        color: '#3b82f6',
        bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)',
    },
    {
        icono: <Star className="w-7 h-7" style={{ color: '#22c55e' }} />,
        titulo: 'Realiza y Califica',
        descripcion: 'Completa el trabajo con seguridad y califica la experiencia para ayudar a la comunidad.',
        color: '#22c55e',
        bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)',
    },
];

const ComoFunciona = () => {
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    useEffect(() => {
        if (!sectionRef.current) return;
        const items = sectionRef.current.querySelectorAll('.step-item');
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => {
                if (e.isIntersecting) { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; observer.unobserve(e.target); }
            }),
            { threshold: 0.15 }
        );
        items.forEach(item => observer.observe(item));
        return () => observer.disconnect();
    }, []);

    return (
        <section style={{ padding: '5.5rem 0', background: 'var(--slate-50)' }} ref={sectionRef}>
            <div className="container mx-auto px-6" style={{ maxWidth: '1100px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span className="section-badge">Proceso Simple</span>
                    <h2 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 800, color: 'var(--slate-900)', marginTop: '16px', letterSpacing: '-0.02em' }}>
                        ¿Cómo funciona <span style={{ color: 'var(--orange-600)' }}>Gxnova</span>?
                    </h2>
                    <p style={{ marginTop: '12px', color: 'var(--slate-600)', maxWidth: '540px', margin: '12px auto 0', lineHeight: 1.7 }}>
                        Conectamos necesidades con talentos de forma rápida, segura y flexible.
                    </p>
                </div>

                {/* Steps */}
                <div style={{ position: 'relative' }}>
                    {/* Connector line */}
                    <div style={{
                        position: 'absolute', top: '52px', left: '22%', right: '22%', height: '2px',
                        background: 'linear-gradient(90deg, #f97316, #3b82f6, #22c55e)',
                        backgroundSize: '300% 100%',
                        animation: 'gradientFlow 3s linear infinite',
                        opacity: 0.3,
                        display: 'none',  // shown via media query workaround below
                    }} className="step-connector" />

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '32px',
                    }}>
                        {pasos.map((paso, i) => (
                            <div
                                key={i}
                                className="step-item"
                                style={{
                                    background: '#fff',
                                    borderRadius: '20px',
                                    padding: '36px 28px',
                                    border: '1.5px solid var(--slate-100)',
                                    boxShadow: 'var(--shadow-md)',
                                    textAlign: 'center',
                                    opacity: 0,
                                    transform: 'translateY(24px)',
                                    transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                            >
                                {/* Step number accent */}
                                <div style={{
                                    position: 'absolute', top: '-10px', right: '-10px',
                                    width: '60px', height: '60px', borderRadius: '50%',
                                    background: paso.color + '12',
                                    zIndex: 0,
                                }} />

                                {/* Icon */}
                                <div style={{
                                    width: '72px', height: '72px',
                                    background: paso.bg,
                                    borderRadius: '20px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 20px',
                                    boxShadow: `0 8px 24px -6px ${paso.color}30`,
                                    position: 'relative', zIndex: 1,
                                }}>
                                    {paso.icono}
                                    {/* Number badge */}
                                    <div style={{
                                        position: 'absolute', bottom: '-6px', right: '-6px',
                                        width: '24px', height: '24px', borderRadius: '50%',
                                        background: paso.color,
                                        color: '#fff',
                                        fontSize: '0.72rem', fontWeight: 800,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        border: '2px solid #fff',
                                    }}>
                                        {i + 1}
                                    </div>
                                </div>

                                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--slate-900)', marginBottom: '10px' }}>
                                    {paso.titulo}
                                </h3>
                                <p style={{ fontSize: '0.9rem', color: 'var(--slate-600)', lineHeight: 1.7 }}>
                                    {paso.descripcion}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <button
                        onClick={() => navigate('/auth')}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '13px 28px',
                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                            border: 'none', borderRadius: '14px',
                            color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                            cursor: 'pointer', fontFamily: 'inherit',
                            boxShadow: '0 6px 20px -4px rgba(249,115,22,0.45)',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 28px -4px rgba(249,115,22,0.5)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 6px 20px -4px rgba(249,115,22,0.45)'; }}
                    >
                        Comenzar ahora <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ComoFunciona;
