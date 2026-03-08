import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function CategoriasSection({ categorias }) {
    const navigate = useNavigate();
    const sectionRef = useRef(null);

    // Stagger reveal on scroll
    useEffect(() => {
        if (!sectionRef.current) return;
        const cards = sectionRef.current.querySelectorAll('.cat-card');
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
            { threshold: 0.1 }
        );
        cards.forEach(card => observer.observe(card));
        return () => observer.disconnect();
    }, [categorias]);

    if (!categorias || categorias.length === 0) return null;

    const colors = [
        { bg: 'linear-gradient(135deg,#fff7ed,#ffedd5)', accent: '#f97316', ring: 'rgba(249,115,22,0.25)' },
        { bg: 'linear-gradient(135deg,#eff6ff,#dbeafe)', accent: '#3b82f6', ring: 'rgba(59,130,246,0.25)' },
        { bg: 'linear-gradient(135deg,#f0fdf4,#dcfce7)', accent: '#22c55e', ring: 'rgba(34,197,94,0.25)' },
        { bg: 'linear-gradient(135deg,#fdf4ff,#fae8ff)', accent: '#a855f7', ring: 'rgba(168,85,247,0.25)' },
        { bg: 'linear-gradient(135deg,#fff1f2,#ffe4e6)', accent: '#ef4444', ring: 'rgba(239,68,68,0.25)' },
        { bg: 'linear-gradient(135deg,#ecfeff,#cffafe)', accent: '#06b6d4', ring: 'rgba(6,182,212,0.25)' },
    ];

    return (
        <section style={{ padding: '5.5rem 0', background: '#fff' }} ref={sectionRef}>
            <div className="container mx-auto px-4" style={{ maxWidth: '1280px' }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <span className="section-badge" style={{ marginBottom: '12px' }}>Explora por área</span>
                    <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#0f172a', marginTop: '12px', letterSpacing: '-0.02em' }}>
                        Categorías Disponibles
                    </h2>
                    <p style={{ color: '#6b7280', marginTop: '8px', fontSize: '1rem' }}>
                        Encuentra trabajos en las áreas que más te interesan
                    </p>
                </div>

                {/* Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {categorias.map((cat, i) => {
                        const c = colors[i % colors.length];
                        return (
                            <button
                                key={cat.id_categoria}
                                className="cat-card"
                                onClick={() => navigate(`/servicios?id_categoria=${cat.id_categoria}`)}
                                style={{
                                    background: '#fff',
                                    border: '1.5px solid #f3f4f6',
                                    borderRadius: '16px',
                                    padding: '24px 16px',
                                    textAlign: 'center',
                                    cursor: 'pointer',
                                    transition: 'all 0.22s cubic-bezier(0.4,0,0.2,1)',
                                    opacity: 0,
                                    transform: 'translateY(20px)',
                                    transitionDelay: `${i * 50}ms`,
                                    fontFamily: 'inherit',
                                    boxShadow: 'none',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = `0 16px 40px -8px ${c.ring}, 0 0 0 2px ${c.accent}30`;
                                    e.currentTarget.style.borderColor = c.accent + '60';
                                    e.currentTarget.querySelector('.cat-icon').style.background = c.bg;
                                    e.currentTarget.querySelector('.cat-icon').style.boxShadow = `0 4px 16px -4px ${c.ring}`;
                                    e.currentTarget.querySelector('.cat-initial').style.color = c.accent;
                                    e.currentTarget.querySelector('.cat-label').style.color = c.accent;
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.borderColor = '#f3f4f6';
                                    e.currentTarget.querySelector('.cat-icon').style.background = '#f9fafb';
                                    e.currentTarget.querySelector('.cat-icon').style.boxShadow = 'none';
                                    e.currentTarget.querySelector('.cat-initial').style.color = '#6b7280';
                                    e.currentTarget.querySelector('.cat-label').style.color = '#111827';
                                }}
                            >
                                <div className="cat-icon" style={{
                                    width: '56px', height: '56px',
                                    borderRadius: '14px',
                                    background: '#f9fafb',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto 14px',
                                    transition: 'all 0.22s ease',
                                }}>
                                    <span className="cat-initial" style={{
                                        fontSize: '1.4rem', fontWeight: 900,
                                        color: '#6b7280',
                                        transition: 'color 0.22s ease',
                                        lineHeight: 1,
                                    }}>
                                        {cat.nombre.charAt(0)}
                                    </span>
                                </div>
                                <h3 className="cat-label" style={{
                                    fontWeight: 700, fontSize: '0.9rem', color: '#111827',
                                    marginBottom: '4px', transition: 'color 0.22s ease',
                                }}>
                                    {cat.nombre}
                                </h3>
                                {cat.descripcion && (
                                    <p style={{ fontSize: '0.75rem', color: '#9ca3af', lineHeight: 1.4, margin: 0 }}
                                        className="line-clamp-2">
                                        {cat.descripcion}
                                    </p>
                                )}
                            </button>
                        );
                    })}
                </div>

                <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
                    <button
                        onClick={() => navigate("/servicios")}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            color: '#ea580c', background: 'none', border: 'none',
                            fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                            padding: '8px 16px', borderRadius: '8px',
                            fontFamily: 'inherit',
                            transition: 'background 0.18s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fff7ed'}
                        onMouseLeave={e => e.currentTarget.style.background = 'none'}
                    >
                        Ver todas las categorías <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CategoriasSection;
