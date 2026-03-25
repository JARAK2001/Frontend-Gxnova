import React from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { useThemeTokens } from "../../hooks/useThemeTokens";

function Hero() {
    const [busqueda, setBusqueda] = React.useState("");
    const navigate = useNavigate();
    const t = useThemeTokens();

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(busqueda.trim()
            ? `/servicios?busqueda=${encodeURIComponent(busqueda)}`
            : "/servicios"
        );
    };

    const tags = ['Limpieza', 'Desarrollo Web', 'Mecánica', 'Diseño', 'Clases'];

    return (
        <section style={{
            position: 'relative',
            overflow: 'hidden',
            background: t.darkMode ? '#0f1117' : 'linear-gradient(160deg, #fff7ed 0%, #ffffff 40%, #f8fafc 100%)',
            paddingTop: '5rem',
            paddingBottom: '6rem',
            transition: 'background 0.3s',
        }}>
            {/* ── Orbes decorativos ── */}
            <div style={{
                position: 'absolute', top: '-80px', left: '-80px',
                width: '500px', height: '500px',
                background: 'radial-gradient(circle, rgba(240, 121, 23, 0.55) 0%, transparent 70%)',
                borderRadius: '50%',
            }} className="animate-blob" />
            <div style={{
                position: 'absolute', top: '40px', right: '-60px',
                width: '420px', height: '420px',
                background: 'radial-gradient(circle, rgba(187, 99, 36, 0.44) 0%, transparent 70%)',
                borderRadius: '50%',
            }} className="animate-blob animation-delay-2000" />
            <div style={{
                position: 'absolute', bottom: '-60px', left: '35%',
                width: '300px', height: '300px',
                background: 'radial-gradient(circle, rgba(209, 170, 125, 0.62) 0%, transparent 70%)',
                borderRadius: '50%',
            }} className="animate-blob animation-delay-4000" />

            {/* ── Content ── */}
            <div className="container mx-auto px-4 max-w-5xl text-center relative" style={{ zIndex: 1 }}>

                {/* Badge */}
                <div className="animate-fade-in" style={{ animationDelay: '0.05s' }}>
                    <span className="section-badge mb-5 inline-flex">
                        <Sparkles style={{ width: 13, height: 13 }} />
                        Conecta con profesionales en Colombia
                    </span>
                </div>

                {/* Headline */}
                <h1
                    className="animate-fade-in-up"
                    style={{
                        fontSize: 'clamp(2.4rem, 5.5vw, 4rem)',
                        fontWeight: 900,
                        lineHeight: 1.13,
                        color: t.textPrimary,
                        marginBottom: '1.4rem',
                        animationDelay: '0.1s',
                        letterSpacing: '-0.02em',
                    }}
                >
                    Encuentra talento{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                        filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.4))',
                    }}>
                        experto
                    </span>
                    {' '}para<br className="hidden md:block" />
                    {' '}proyectos reales
                </h1>

                <p
                    className="animate-fade-in-up"
                    style={{
                        fontSize: '1.15rem',
                        color: t.textSecondary,
                        maxWidth: '680px',
                        margin: '0 auto 2.5rem',
                        lineHeight: 1.75,
                        animationDelay: '0.18s',
                    }}
                >
                    Conecta con profesionales verificados. Gestiona pagos seguros en dinero o trueque.
                    Únete a la comunidad líder de servicios en Colombia.
                </p>

                {/* ── Search bar ── */}
                <form
                    onSubmit={handleSearch}
                    className="animate-scale-in"
                    style={{
                        maxWidth: '680px',
                        margin: '0 auto 1.5rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        animationDelay: '0.22s',
                    }}
                >
                    <div style={{
                        display: 'flex',
                        background: t.cardBg,
                        borderRadius: '18px',
                        padding: '8px 8px 8px 20px',
                        boxShadow: t.darkMode ? '0 10px 30px rgba(0,0,0,0.5)' : 'var(--shadow-lg), 0 0 0 1px rgba(0,0,0,0.02)',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'box-shadow 0.2s ease, background 0.3s',
                        border: `1.5px solid ${t.cardBorder}`,
                    }}
                        onFocus={() => { }} // handled by child
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.textMuted} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                        </svg>
                        <input
                            type="text"
                            placeholder="¿Qué servicio necesitas hoy? (Ej: Plomero, Contador...)"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                fontSize: '1rem',
                                color: t.textPrimary,
                                background: 'transparent',
                                fontFamily: 'inherit',
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                border: 'none',
                                borderRadius: '12px',
                                padding: '12px 26px',
                                color: '#fff',
                                fontWeight: 700,
                                fontSize: '0.95rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 4px 14px -2px rgba(249,115,22,0.45)',
                                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(249,115,22,0.5)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(249,115,22,0.45)'; }}
                        >
                            Buscar <ArrowRight size={16} />
                        </button>
                    </div>
                </form>

                {/* ── Tags rápidas ── */}
                <div
                    className="animate-fade-in"
                    style={{
                        display: 'flex', flexWrap: 'wrap', justifyContent: 'center',
                        gap: '8px', animationDelay: '0.3s',
                    }}
                >
                    <span style={{ fontSize: '0.85rem', color: t.textSecondary, alignSelf: 'center', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <TrendingUp size={13} /> Tendencias:
                    </span>
                    {tags.map((tag) => (
                        <button
                            key={tag}
                            onClick={() => navigate(`/servicios?busqueda=${encodeURIComponent(tag)}`)}
                            style={{
                                padding: '5px 14px',
                                borderRadius: '999px',
                                border: `1.5px solid ${t.cardBorder}`,
                                background: t.cardBg,
                                color: t.textSecondary,
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                fontFamily: 'inherit',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.borderColor = t.orange; e.currentTarget.style.color = t.orange; e.currentTarget.style.background = t.tagBg; }}
                            onMouseLeave={e => { e.currentTarget.style.borderColor = t.cardBorder; e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.background = t.cardBg; }}
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Hero;
