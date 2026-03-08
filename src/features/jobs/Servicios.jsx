import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Encabezado from "../../layouts/Encabezado";
import Footer from "../../layouts/Footer";
import MapaTrabajos from "./MapaTrabajos";
import {
    Map, List, Search, MapPin, RefreshCw, SlidersHorizontal,
    Sparkles, Briefcase, ArrowRight, LayoutGrid,
} from "lucide-react";
import API_URL from "../../config/api";

/* ══════════════════════════════════════════
   SKELETON CARD
══════════════════════════════════════════ */
const SkeletonCard = () => (
    <div style={{
        background: '#fff', borderRadius: '22px', overflow: 'hidden',
        border: '1px solid #f1f5f9', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.05)',
    }}>
        <div className="skeleton" style={{ height: '180px', borderRadius: 0 }} />
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
                <div className="skeleton" style={{ height: '22px', width: '80px', borderRadius: '999px' }} />
                <div className="skeleton" style={{ height: '22px', width: '60px', borderRadius: '999px' }} />
            </div>
            <div className="skeleton" style={{ height: '20px', width: '80%' }} />
            <div className="skeleton" style={{ height: '14px', width: '100%' }} />
            <div className="skeleton" style={{ height: '14px', width: '65%' }} />
            <div className="skeleton" style={{ height: '50px', borderRadius: '14px', marginTop: '4px' }} />
            <div className="skeleton" style={{ height: '40px', borderRadius: '12px' }} />
        </div>
    </div>
);

/* ══════════════════════════════════════════
   TOGGLE BUTTON (vista lista/mapa)
══════════════════════════════════════════ */
const ToggleBtn = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '8px 18px', borderRadius: '10px',
            fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
            fontFamily: 'inherit', border: 'none', transition: 'all 0.2s ease',
            background: active ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'transparent',
            color: active ? '#fff' : '#64748b',
            boxShadow: active ? '0 4px 12px -2px rgba(249,115,22,0.4)' : 'none',
        }}
    >
        <Icon size={16} /> {label}
    </button>
);

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
function Servicios() {
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [filtroUbicacion, setFiltroUbicacion] = useState("");
    const [vistaMapa, setVistaMapa] = useState(false);
    const [soloHabilidades, setSoloHabilidades] = useState(false);

    const token = localStorage.getItem('token');

    useEffect(() => {
        const timer = setTimeout(() => { cargarTrabajos(); }, 500);
        return () => clearTimeout(timer);
    }, [filtroBusqueda, filtroUbicacion, soloHabilidades]);

    const cargarTrabajos = async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/api/trabajos?estado=publicado`;
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;
            if (filtroBusqueda) url += `&busqueda=${encodeURIComponent(filtroBusqueda)}`;
            if (filtroUbicacion) url += `&ubicacion=${encodeURIComponent(filtroUbicacion)}`;
            if (soloHabilidades) url += `&soloHabilidades=true`;
            const res = await fetch(url, { headers });
            const data = await res.json();
            if (data.trabajos) setTrabajos(data.trabajos);
        } catch (error) {
            console.error("Error al cargar trabajos:", error);
        } finally {
            setLoading(false);
        }
    };

    const verDetalles = (id) => navigate(`/detalles/${id}`);

    const formatearPrecio = (monto) => {
        if (!monto) return "A convenir";
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(monto);
    };

    /* ── Placeholder para cards sin foto ─────────────────── */
    const PlaceholderImagen = ({ titulo }) => {
        const letra = titulo?.charAt(0)?.toUpperCase() || "S";
        return (
            <div style={{
                height: '180px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: 900 }}>
                    {letra}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#c2410c', fontWeight: 600 }}>Sin imagen</span>
            </div>
        );
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#fff7ed 0%,#f8fafc 35%,#f1f5f9 100%)', position: 'relative' }}>
            {/* Blobs decorativos */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '15%', left: '-8%', width: '550px', height: '550px', background: 'radial-gradient(circle,rgba(249,115,22,0.04) 0%,transparent 70%)', borderRadius: '50%' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Encabezado />

                {/* ══ HERO BANNER ══ */}
                <div style={{
                    background: 'linear-gradient(135deg,#fb923c 0%,#f97316 45%,#ea580c 100%)',
                    padding: '3.5rem 1.5rem 4.5rem', position: 'relative', overflow: 'hidden',
                }}>
                    {/* Mesh */}
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(circle at 18% 55%,rgba(255,255,255,0.42) 0%,transparent 40%),radial-gradient(circle at 82% 18%,rgba(255,255,255,0.22) 0%,transparent 50%)` }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px)' }} />

                    <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        {/* Badge */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '1.2rem' }}>
                            <LayoutGrid size={15} color="#fff" />
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>Catálogo de servicios</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1, letterSpacing: '-0.025em', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                            Encuentra el profesional<br />perfecto para tu proyecto
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.88)', marginTop: '1rem', fontSize: '1rem', fontWeight: 500, maxWidth: '520px', lineHeight: 1.6 }}>
                            Conecta con trabajadores verificados en Colombia. Filtra por categoría, ubicación o tipo de pago.
                        </p>

                        {/* Stat pills */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1.75rem' }}>
                            {[
                                { label: `${loading ? '...' : trabajos.length} servicios`, icon: Briefcase },
                                { label: 'Trabajadores verificados', icon: Sparkles },
                            ].map(({ label, icon: Icon }) => (
                                <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '7px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                                    <Icon size={14} color="#fff" />
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ MAIN CONTENT ══ */}
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>

                    {/* ── Barra de filtros (levitando sobre el banner) ── */}
                    <div style={{
                        marginTop: '-2.5rem', marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '22px', padding: '1.5rem',
                        border: '1px solid rgba(249,115,22,0.10)',
                        boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12)',
                    }}>
                        {/* Header de filtros */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <SlidersHorizontal size={17} />
                                </div>
                                <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Filtrar servicios</span>
                            </div>

                            {/* Controles derecha */}
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                                {/* Vista Lista/Mapa */}
                                <div style={{ background: '#f1f5f9', borderRadius: '12px', padding: '4px', display: 'flex' }}>
                                    <ToggleBtn active={!vistaMapa} onClick={() => setVistaMapa(false)} icon={List} label="Lista" />
                                    <ToggleBtn active={vistaMapa}  onClick={() => setVistaMapa(true)}  icon={Map}  label="Mapa"  />
                                </div>
                                {/* Recomendados */}
                                {token && (
                                    <button
                                        onClick={() => setSoloHabilidades(!soloHabilidades)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '7px',
                                            padding: '9px 16px', borderRadius: '12px',
                                            fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer',
                                            fontFamily: 'inherit', border: '1.5px solid transparent',
                                            transition: 'all 0.2s ease',
                                            background: soloHabilidades ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#fff',
                                            color: soloHabilidades ? '#fff' : '#64748b',
                                            borderColor: soloHabilidades ? 'transparent' : '#e2e8f0',
                                            boxShadow: soloHabilidades ? '0 4px 14px -2px rgba(249,115,22,0.4)' : '0 1px 4px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <Sparkles size={15} />
                                        {soloHabilidades ? 'Recomendados para mí' : 'Para mí'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Inputs */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '12px' }}>
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="¿Qué estás buscando? (Ej: Plomero...)"
                                    value={filtroBusqueda}
                                    onChange={e => setFiltroBusqueda(e.target.value)}
                                    style={{
                                        width: '100%', boxSizing: 'border-box', paddingLeft: '42px',
                                        padding: '12px 16px 12px 42px', borderRadius: '14px',
                                        border: '1.5px solid #e2e8f0', background: '#f8fafc',
                                        color: '#0f172a', fontSize: '0.9rem', fontWeight: 500,
                                        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; e.target.style.background = '#fff'; }}
                                    onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = ''; e.target.style.background = '#f8fafc'; }}
                                />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Ciudad o dirección"
                                    value={filtroUbicacion}
                                    onChange={e => setFiltroUbicacion(e.target.value)}
                                    style={{
                                        width: '100%', boxSizing: 'border-box', paddingLeft: '42px',
                                        padding: '12px 16px 12px 42px', borderRadius: '14px',
                                        border: '1.5px solid #e2e8f0', background: '#f8fafc',
                                        color: '#0f172a', fontSize: '0.9rem', fontWeight: 500,
                                        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s',
                                        fontFamily: 'inherit',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; e.target.style.background = '#fff'; }}
                                    onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = ''; e.target.style.background = '#f8fafc'; }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Contador de resultados ── */}
                    {!loading && !vistaMapa && (
                        <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '1.25rem' }}>
                            {trabajos.length === 0
                                ? 'Sin resultados para estos filtros'
                                : `${trabajos.length} servicio${trabajos.length !== 1 ? 's' : ''} encontrado${trabajos.length !== 1 ? 's' : ''}`
                            }
                        </p>
                    )}

                    {/* ── Contenido ── */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
                            {[1,2,3,4,5,6].map(n => <SkeletonCard key={n} />)}
                        </div>
                    ) : vistaMapa ? (
                        <MapaTrabajos trabajos={trabajos} />
                    ) : trabajos.length === 0 ? (
                        /* ── Empty state ── */
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: '24px', border: '1px solid rgba(249,115,22,0.08)', boxShadow: '0 4px 24px -6px rgba(0,0,0,0.06)' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '22px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 16px -4px rgba(249,115,22,0.2)' }}>
                                <Search size={28} color="#f97316" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Sin resultados</h3>
                            <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '360px', margin: '0 auto' }}>No hay servicios con estos filtros. Intenta con otras palabras o limpia la búsqueda.</p>
                        </div>
                    ) : (
                        /* ── Grid de tarjetas ── */
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
                            {trabajos.map((trabajo) => (
                                <div
                                    key={trabajo.id_trabajo}
                                    onClick={() => verDetalles(trabajo.id_trabajo)}
                                    style={{
                                        background: '#fff', borderRadius: '22px',
                                        border: '1px solid #f1f5f9',
                                        boxShadow: '0 2px 16px -4px rgba(0,0,0,0.06)',
                                        overflow: 'hidden', cursor: 'pointer',
                                        transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                                        display: 'flex', flexDirection: 'column',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 48px -8px rgba(0,0,0,0.11), 0 4px 16px -4px rgba(249,115,22,0.12)'; e.currentTarget.style.borderColor = '#fed7aa'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px -4px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                                >
                                    {/* Imagen / Placeholder */}
                                    {trabajo.foto ? (
                                        <div style={{ height: '180px', overflow: 'hidden', position: 'relative', flexShrink: 0 }}>
                                            <img
                                                src={trabajo.foto.startsWith('http') ? trabajo.foto : `${API_URL}${trabajo.foto}`}
                                                alt={trabajo.titulo}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                                                onMouseLeave={e => e.currentTarget.style.transform = ''}
                                            />
                                            {/* Gradient overlay */}
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,0.4) 0%,transparent 55%)' }} />
                                            {/* Categoría encima de la imagen */}
                                            <span style={{
                                                position: 'absolute', bottom: '12px', left: '12px',
                                                padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                                                background: 'rgba(255,255,255,0.92)', color: '#c2410c', backdropFilter: 'blur(6px)',
                                            }}>
                                                {trabajo.categoria?.nombre || 'Sin categoría'}
                                            </span>
                                        </div>
                                    ) : (
                                        <div style={{ position: 'relative', flexShrink: 0 }}>
                                            <PlaceholderImagen titulo={trabajo.titulo} />
                                            <span style={{
                                                position: 'absolute', bottom: '12px', left: '12px',
                                                padding: '4px 12px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                                                background: 'rgba(255,255,255,0.92)', color: '#c2410c',
                                            }}>
                                                {trabajo.categoria?.nombre || 'Sin categoría'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Cuerpo de la tarjeta */}
                                    <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                                        {/* Estado */}
                                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                                            <span style={{
                                                padding: '3px 10px', borderRadius: '999px', fontSize: '0.70rem', fontWeight: 800,
                                                textTransform: 'uppercase', letterSpacing: '0.04em',
                                                background: trabajo.estado === 'publicado' ? '#f0fdf4' : '#f0f9ff',
                                                color: trabajo.estado === 'publicado' ? '#15803d' : '#0369a1',
                                                border: `1px solid ${trabajo.estado === 'publicado' ? '#bbf7d0' : '#bae6fd'}`,
                                            }}>
                                                {trabajo.estado.replace('_', ' ')}
                                            </span>
                                        </div>

                                        {/* Título */}
                                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', lineHeight: 1.35 }}
                                            className="line-clamp-2">
                                            {trabajo.titulo}
                                        </h3>
                                        <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, marginBottom: '14px', flex: 1 }}
                                            className="line-clamp-2">
                                            {trabajo.descripcion}
                                        </p>

                                        {/* Precio */}
                                        <div style={{
                                            padding: '11px 14px', borderRadius: '14px',
                                            background: 'linear-gradient(135deg,#fff7ed,#ffedd5)',
                                            border: '1px solid #fed7aa', marginBottom: '12px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        }}>
                                            <p style={{ fontSize: '0.7rem', color: '#c2410c', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Pago</p>
                                            <p style={{ fontSize: '1.1rem', fontWeight: 800, color: '#9a3412', display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                                                {trabajo.tipo_pago === 'dinero'
                                                    ? formatearPrecio(trabajo.monto_pago)
                                                    : <><RefreshCw size={13} /> Trueque</>}
                                            </p>
                                        </div>

                                        {/* Meta info */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                                                <MapPin size={13} color="#f97316" /> {trabajo.ubicacion || 'Sin ubicación'}
                                            </p>
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                                                Por: <strong style={{ color: '#475569', fontWeight: 700 }}>{trabajo.empleador?.nombre} {trabajo.empleador?.apellido}</strong>
                                            </p>
                                        </div>

                                        {/* CTA */}
                                        <button
                                            onClick={e => { e.stopPropagation(); verDetalles(trabajo.id_trabajo); }}
                                            style={{
                                                width: '100%', padding: '12px',
                                                background: 'linear-gradient(135deg,#f97316,#ea580c)',
                                                border: 'none', borderRadius: '13px',
                                                color: '#fff', fontWeight: 700, fontSize: '0.88rem',
                                                cursor: 'pointer', fontFamily: 'inherit',
                                                boxShadow: '0 4px 14px -2px rgba(249,115,22,0.35)',
                                                transition: 'all 0.18s ease',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(249,115,22,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(249,115,22,0.35)'; e.currentTarget.style.transform = ''; }}
                                        >
                                            Ver detalles <ArrowRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </div>
    );
}

export default Servicios;
