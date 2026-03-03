import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap } from "lucide-react";

function CallToAction() {
    const navigate = useNavigate();

    return (
        <section style={{
            position: 'relative',
            padding: '5.5rem 1.5rem',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #ea580c 0%, #f97316 40%, #ef4444 100%)',
        }}>
            {/* Decorative orbs */}
            <div style={{
                position: 'absolute', top: '-60px', right: '-60px',
                width: '300px', height: '300px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.07)',
            }} />
            <div style={{
                position: 'absolute', bottom: '-80px', left: '-40px',
                width: '250px', height: '250px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.05)',
            }} />

            <div className="container mx-auto" style={{ maxWidth: '760px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                {/* Badge */}
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '5px 14px',
                    background: 'rgba(255,255,255,0.18)',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: '999px',
                    fontSize: '0.78rem', fontWeight: 700, color: '#fff',
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                    marginBottom: '1.5rem',
                }}>
                    <Zap size={13} /> Únete hoy mismo
                </div>

                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: 900,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.15,
                    marginBottom: '1.1rem',
                }}>
                    ¿Listo para comenzar?
                </h2>

                <p style={{
                    fontSize: '1.1rem',
                    color: 'rgba(255,255,255,0.85)',
                    marginBottom: '2.5rem',
                    lineHeight: 1.7,
                }}>
                    Únete a nuestra plataforma y conecta con profesionales verificados de toda Colombia.
                    Regístrate gratis en menos de 2 minutos.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px' }}>
                    <button
                        onClick={() => navigate("/auth")}
                        style={{
                            padding: '14px 30px',
                            background: '#fff',
                            color: '#ea580c',
                            border: 'none',
                            borderRadius: '14px',
                            fontWeight: 800,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px',
                            boxShadow: '0 8px 24px -4px rgba(0,0,0,0.2)',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 16px 36px -6px rgba(0,0,0,0.25)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(0,0,0,0.2)'; }}
                    >
                        Crear Cuenta Gratis <ArrowRight size={16} />
                    </button>

                    <button
                        onClick={() => navigate("/servicios")}
                        style={{
                            padding: '14px 30px',
                            background: 'rgba(255,255,255,0.15)',
                            color: '#fff',
                            border: '2px solid rgba(255,255,255,0.5)',
                            borderRadius: '14px',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            fontFamily: 'inherit',
                            backdropFilter: 'blur(8px)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.25)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.7)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; }}
                    >
                        Explorar Servicios
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CallToAction;
