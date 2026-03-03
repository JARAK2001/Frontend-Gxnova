import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Encabezado from "../../layouts/Encabezado";
import Footer from "../../layouts/Footer";
import MapaTrabajos from "./MapaTrabajos";
import { Map, List, Search, MapPin, RefreshCw, SlidersHorizontal, Sparkles } from "lucide-react";
import API_URL from "../../config/api";

/* ── SKELETON CARD ── */
const SkeletonCard = () => (
    <div style={{
        background: '#fff', borderRadius: '20px', overflow: 'hidden',
        border: '1.5px solid #f1f5f9', boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)',
    }}>
        <div className="skeleton" style={{ height: '192px', borderRadius: 0 }} />
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <div className="skeleton" style={{ height: '22px', width: '80px', borderRadius: '999px' }} />
                <div className="skeleton" style={{ height: '22px', width: '70px', borderRadius: '999px' }} />
            </div>
            <div className="skeleton" style={{ height: '22px', width: '85%', marginBottom: '8px' }} />
            <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '4px' }} />
            <div className="skeleton" style={{ height: '16px', width: '65%', marginBottom: '16px' }} />
            <div className="skeleton" style={{ height: '52px', borderRadius: '12px' }} />
            <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                <div className="skeleton" style={{ height: '14px', width: '100px' }} />
            </div>
            <div className="skeleton" style={{ height: '42px', borderRadius: '12px', marginTop: '16px' }} />
        </div>
    </div>
);

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

    /* ── TOGGLE BUTTON ── */
    const ToggleBtn = ({ active, onClick, icon: Icon, label }) => (
        <button
            onClick={onClick}
            style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 18px', borderRadius: '10px',
                fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer',
                fontFamily: 'inherit', border: 'none',
                transition: 'all 0.2s ease',
                background: active ? 'linear-gradient(135deg, #f97316, #ea580c)' : 'transparent',
                color: active ? '#fff' : '#6b7280',
                boxShadow: active ? '0 4px 12px -2px rgba(249,115,22,0.4)' : 'none',
            }}
        >
            <Icon size={17} /> {label}
        </button>
    );

    return (
        <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
            <Encabezado />

            <div className="container mx-auto px-4" style={{ maxWidth: '1280px', paddingTop: '2.5rem', paddingBottom: '4rem' }}>

                {/* ── Page Header ── */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
                        <div>
                            <span className="section-badge" style={{ marginBottom: '10px' }}>Catálogo</span>
                            <h1 style={{ fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', marginTop: '8px' }}>
                                Servicios Disponibles
                            </h1>
                            <p style={{ color: '#6b7280', marginTop: '4px' }}>
                                {loading ? 'Cargando...' : `${trabajos.length} servicio${trabajos.length !== 1 ? 's' : ''} disponible${trabajos.length !== 1 ? 's' : ''}`}
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
                            {/* Vista toggle */}
                            <div style={{
                                display: 'flex', background: '#fff', borderRadius: '14px',
                                border: '1.5px solid #e5e7eb', padding: '4px',
                                boxShadow: '0 2px 8px -2px rgba(0,0,0,0.06)',
                            }}>
                                <ToggleBtn active={!vistaMapa} onClick={() => setVistaMapa(false)} icon={List} label="Lista" />
                                <ToggleBtn active={vistaMapa} onClick={() => setVistaMapa(true)} icon={Map} label="Mapa" />
                            </div>

                            {/* Skills toggle */}
                            {token && (
                                <button
                                    onClick={() => setSoloHabilidades(!soloHabilidades)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '7px',
                                        padding: '9px 18px', borderRadius: '12px',
                                        fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer',
                                        fontFamily: 'inherit', border: '1.5px solid transparent',
                                        transition: 'all 0.2s ease',
                                        background: soloHabilidades
                                            ? 'linear-gradient(135deg, #6366f1, #4f46e5)'
                                            : '#fff',
                                        color: soloHabilidades ? '#fff' : '#6b7280',
                                        borderColor: soloHabilidades ? 'transparent' : '#e5e7eb',
                                        boxShadow: soloHabilidades ? '0 4px 14px -2px rgba(99,102,241,0.4)' : '0 2px 8px -2px rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <Sparkles size={16} />
                                    {soloHabilidades ? 'Recomendados para mí' : 'Todos los trabajos'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Filtros ── */}
                <div style={{
                    background: '#fff', borderRadius: '20px',
                    border: '1.5px solid #f1f5f9',
                    boxShadow: '0 4px 20px -4px rgba(0,0,0,0.07)',
                    padding: '20px 24px', marginBottom: '2rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                        <SlidersHorizontal size={16} style={{ color: '#f97316' }} />
                        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>Filtros</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                        {/* Busqueda */}
                        <div style={{ position: 'relative' }}>
                            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="¿Qué estás buscando? (Ej: Plomero...)"
                                value={filtroBusqueda}
                                onChange={(e) => setFiltroBusqueda(e.target.value)}
                                className="input-modern"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                        {/* Ubicacion */}
                        <div style={{ position: 'relative' }}>
                            <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                            <input
                                type="text"
                                placeholder="Ciudad o Dirección"
                                value={filtroUbicacion}
                                onChange={(e) => setFiltroUbicacion(e.target.value)}
                                className="input-modern"
                                style={{ paddingLeft: '40px' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Contenido ── */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {[1, 2, 3, 4, 5, 6].map(n => <SkeletonCard key={n} />)}
                    </div>
                ) : vistaMapa ? (
                    <MapaTrabajos trabajos={trabajos} />
                ) : trabajos.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '5rem 2rem',
                        background: '#fff', borderRadius: '20px',
                        border: '1.5px solid #f1f5f9',
                        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.06)',
                    }}>
                        <div style={{
                            width: '72px', height: '72px', borderRadius: '20px',
                            background: '#fff7ed', display: 'flex', alignItems: 'center',
                            justifyContent: 'center', margin: '0 auto 20px',
                        }}>
                            <Search size={28} style={{ color: '#f97316' }} />
                        </div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Sin resultados</h3>
                        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No hay servicios con estos filtros. Intenta ajustar tu búsqueda.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {trabajos.map((trabajo) => (
                            <div
                                key={trabajo.id_trabajo}
                                onClick={() => verDetalles(trabajo.id_trabajo)}
                                style={{
                                    background: '#fff', borderRadius: '20px',
                                    border: '1.5px solid #f1f5f9',
                                    boxShadow: '0 2px 12px -4px rgba(0,0,0,0.06)',
                                    overflow: 'hidden', cursor: 'pointer',
                                    transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 20px 48px -8px rgba(0,0,0,0.12)'; e.currentTarget.style.borderColor = '#fed7aa'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 12px -4px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
                            >
                                {/* Image */}
                                {trabajo.foto && (
                                    <div style={{ height: '192px', overflow: 'hidden', position: 'relative' }}>
                                        <img
                                            src={trabajo.foto.startsWith('http') ? trabajo.foto : `${API_URL}${trabajo.foto}`}
                                            alt={trabajo.titulo}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.07)'}
                                            onMouseLeave={e => e.currentTarget.style.transform = ''}
                                        />
                                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent 50%)' }} />
                                    </div>
                                )}

                                <div style={{ padding: '20px' }}>
                                    {/* Badges */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700,
                                            background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa',
                                        }}>
                                            {trabajo.categoria?.nombre || 'Sin categoría'}
                                        </span>
                                        <span style={{
                                            padding: '4px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700,
                                            background: trabajo.estado === 'publicado' ? '#f0fdf4' : '#f0f9ff',
                                            color: trabajo.estado === 'publicado' ? '#15803d' : '#0369a1',
                                            border: `1px solid ${trabajo.estado === 'publicado' ? '#bbf7d0' : '#bae6fd'}`,
                                            textTransform: 'capitalize',
                                        }}>
                                            {trabajo.estado.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px', lineHeight: 1.4 }}
                                        className="line-clamp-2">
                                        {trabajo.titulo}
                                    </h3>
                                    <p style={{ fontSize: '0.85rem', color: '#6b7280', lineHeight: 1.6, marginBottom: '14px' }}
                                        className="line-clamp-2">
                                        {trabajo.descripcion}
                                    </p>

                                    {/* Precio */}
                                    <div style={{
                                        padding: '12px 14px', borderRadius: '12px',
                                        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                                        border: '1px solid #bbf7d0', marginBottom: '12px',
                                    }}>
                                        <p style={{ fontSize: '0.7rem', color: '#15803d', fontWeight: 600, marginBottom: '2px' }}>Pago</p>
                                        <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#14532d', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {trabajo.tipo_pago === 'dinero'
                                                ? formatearPrecio(trabajo.monto_pago)
                                                : <><RefreshCw size={14} /> Trueque</>}
                                        </p>
                                    </div>

                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                                        <MapPin size={13} /> {trabajo.ubicacion}
                                    </p>
                                    <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginBottom: '14px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
                                        Por: <strong style={{ color: '#374151' }}>{trabajo.empleador?.nombre} {trabajo.empleador?.apellido}</strong>
                                    </p>

                                    {/* CTA */}
                                    <button
                                        onClick={(e) => { e.stopPropagation(); verDetalles(trabajo.id_trabajo); }}
                                        style={{
                                            width: '100%', padding: '11px',
                                            background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                            border: 'none', borderRadius: '12px',
                                            color: '#fff', fontWeight: 700, fontSize: '0.9rem',
                                            cursor: 'pointer', fontFamily: 'inherit',
                                            boxShadow: '0 4px 14px -2px rgba(249,115,22,0.35)',
                                            transition: 'all 0.18s ease',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(249,115,22,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(249,115,22,0.35)'; e.currentTarget.style.transform = ''; }}
                                    >
                                        Ver Detalles →
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Servicios;
