import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Encabezado from "../../layouts/Encabezado";
import Footer from "../../layouts/Footer";
import { useAuth } from "../../context/AuthContext";
import { useChat } from "../../context/ChatContext";
import API_URL from "../../config/api";
import {
    Search, Users, Star, MessageCircle, ExternalLink,
    Wrench, Loader2, LayoutGrid, ChevronDown,
} from "lucide-react";

/* ── Skeleton card ── */
const SkeletonCard = () => (
    <div style={{ background: '#fff', borderRadius: '22px', padding: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
            <div className="skeleton" style={{ width: '64px', height: '64px', borderRadius: '50%', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: '18px', width: '55%', marginBottom: '8px' }} />
                <div className="skeleton" style={{ height: '14px', width: '40%' }} />
            </div>
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
            {[1, 2, 3].map(n => <div key={n} className="skeleton" style={{ height: '24px', width: '70px', borderRadius: '999px' }} />)}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
            <div className="skeleton" style={{ height: '40px', flex: 1, borderRadius: '12px' }} />
            <div className="skeleton" style={{ height: '40px', width: '44px', borderRadius: '12px' }} />
        </div>
    </div>
);

/* ── Estrellas mini ── */
const MiniStars = ({ valor }) => {
    const stars = Math.round(valor);
    return (
        <span style={{ display: 'inline-flex', gap: '1px' }}>
            {[1, 2, 3, 4, 5].map(i => (
                <span key={i} style={{ color: i <= stars ? '#f97316' : '#e2e8f0', fontSize: '0.75rem' }}>★</span>
            ))}
        </span>
    );
};

function Trabajadores() {
    const navigate = useNavigate();
    const { token } = useAuth();
    const { abrirChat } = useChat();

    const [trabajadores, setTrabajadores] = useState([]);
    const [categorias, setCategorias]     = useState([]);
    const [loading, setLoading]           = useState(true);
    const [busqueda, setBusqueda]         = useState("");
    const [categoria, setCategoria]       = useState("");

    /* Carga categorías para el select filtro */
    useEffect(() => {
        fetch(`${API_URL}/api/categorias`)
            .then(r => r.json())
            .then(d => setCategorias(d.categorias || []))
            .catch(() => {});
    }, []);

    /* Carga trabajadores con debounce */
    useEffect(() => {
        const timer = setTimeout(() => cargarTrabajadores(), 450);
        return () => clearTimeout(timer);
    }, [busqueda, categoria]);

    const cargarTrabajadores = async () => {
        if (!token) return;
        setLoading(true);
        try {
            let url = `${API_URL}/api/usuarios/trabajadores`;
            const params = new URLSearchParams();
            if (busqueda)  params.set('busqueda',  busqueda);
            if (categoria) params.set('categoria', categoria);
            if ([...params].length) url += `?${params}`;

            const res  = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            setTrabajadores(data.trabajadores || []);
        } catch (err) {
            console.error("Error cargando trabajadores:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleContactar = (trabajador) => {
        abrirChat({
            idUsuario: trabajador.id_usuario,
            nombre:    `${trabajador.nombre} ${trabajador.apellido}`,
            foto:      trabajador.foto_perfil,
        });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#fff7ed 0%,#f8fafc 35%,#f1f5f9 100%)', position: 'relative' }}>
            {/* Blobs */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '8%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle,rgba(249,115,22,0.06) 0%,transparent 70%)', borderRadius: '50%' }} />
                <div style={{ position: 'absolute', bottom: '15%', left: '-8%', width: '550px', height: '550px', background: 'radial-gradient(circle,rgba(249,115,22,0.04) 0%,transparent 70%)', borderRadius: '50%' }} />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <Encabezado />

                {/* ══ HERO ══ */}
                <div style={{
                    background: 'linear-gradient(135deg,#fb923c 0%,#f97316 45%,#ea580c 100%)',
                    padding: '3.5rem 1.5rem 4.5rem', position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ position: 'absolute', inset: 0, opacity: 0.4, backgroundImage: `radial-gradient(circle at 18% 55%,rgba(255,255,255,0.42) 0%,transparent 40%),radial-gradient(circle at 82% 18%,rgba(255,255,255,0.22) 0%,transparent 50%)` }} />
                    <div style={{ position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,rgba(255,255,255,0.04) 39px,rgba(255,255,255,0.04) 40px)' }} />

                    <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', marginBottom: '1.2rem' }}>
                            <LayoutGrid size={15} color="#fff" />
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff', letterSpacing: '0.04em' }}>Directorio de profesionales</span>
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.9rem,4vw,2.8rem)', fontWeight: 900, color: '#fff', margin: 0, lineHeight: 1.1, letterSpacing: '-0.025em', textShadow: '0 2px 12px rgba(0,0,0,0.15)' }}>
                            Encuentra el trabajador<br />ideal para tu proyecto
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.88)', marginTop: '1rem', fontSize: '1rem', fontWeight: 500, maxWidth: '500px', lineHeight: 1.6 }}>
                            Conecta directamente con profesionales verificados en tu área. Revisa sus habilidades, calificaciones y contáctalos al instante.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1.75rem' }}>
                            {[
                                { label: `${loading ? '...' : trabajadores.length} profesionales`, icon: Users },
                                { label: 'Habilidades certificadas', icon: Wrench },
                            ].map(({ label, icon: Icon }) => (
                                <div key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '7px 16px', borderRadius: '999px', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                                    <Icon size={14} color="#fff" />
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ CONTENIDO ══ */}
                <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1.5rem 5rem' }}>

                    {/* Barra de filtros glassmorphism */}
                    <div style={{
                        marginTop: '-2.5rem', marginBottom: '2rem',
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                        borderRadius: '22px', padding: '1.5rem',
                        border: '1px solid rgba(249,115,22,0.10)',
                        boxShadow: '0 8px 40px -8px rgba(0,0,0,0.12)',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.25rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '11px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Search size={17} />
                            </div>
                            <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Buscar profesionales</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: '12px' }}>
                            {/* Búsqueda por nombre */}
                            <div style={{ position: 'relative' }}>
                                <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                                <input
                                    type="text"
                                    placeholder="Nombre del profesional..."
                                    value={busqueda}
                                    onChange={e => setBusqueda(e.target.value)}
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '12px 16px 12px 42px', borderRadius: '14px',
                                        border: '1.5px solid #e2e8f0', background: '#f8fafc',
                                        color: '#0f172a', fontSize: '0.9rem', fontWeight: 500,
                                        outline: 'none', fontFamily: 'inherit',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; e.target.style.background = '#fff'; }}
                                    onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = ''; e.target.style.background = '#f8fafc'; }}
                                />
                            </div>
                            {/* Filtro por categoría */}
                            <div style={{ position: 'relative' }}>
                                <Wrench size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                                <ChevronDown size={14} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none' }} />
                                <select
                                    value={categoria}
                                    onChange={e => setCategoria(e.target.value)}
                                    style={{
                                        width: '100%', boxSizing: 'border-box',
                                        padding: '12px 40px 12px 42px', borderRadius: '14px',
                                        border: '1.5px solid #e2e8f0', background: '#f8fafc',
                                        color: categoria ? '#0f172a' : '#94a3b8',
                                        fontSize: '0.9rem', fontWeight: 500,
                                        outline: 'none', fontFamily: 'inherit',
                                        appearance: 'none', cursor: 'pointer',
                                        transition: 'border-color 0.2s, box-shadow 0.2s',
                                    }}
                                    onFocus={e => { e.target.style.borderColor = '#f97316'; e.target.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; e.target.style.background = '#fff'; }}
                                    onBlur={e  => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = ''; e.target.style.background = '#f8fafc'; }}
                                >
                                    <option value="">Todas las especialidades</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id_categoria} value={cat.nombre}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Contador */}
                    {!loading && (
                        <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600, marginBottom: '1.25rem' }}>
                            {trabajadores.length === 0
                                ? 'No se encontraron profesionales con estos filtros'
                                : `${trabajadores.length} profesional${trabajadores.length !== 1 ? 'es' : ''} disponible${trabajadores.length !== 1 ? 's' : ''}`}
                        </p>
                    )}

                    {/* Grid */}
                    {loading ? (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
                            {[1,2,3,4,5,6].map(n => <SkeletonCard key={n} />)}
                        </div>
                    ) : trabajadores.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', borderRadius: '24px', border: '1px solid rgba(249,115,22,0.08)', boxShadow: '0 4px 24px -6px rgba(0,0,0,0.06)' }}>
                            <div style={{ width: '72px', height: '72px', borderRadius: '22px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 16px -4px rgba(249,115,22,0.2)' }}>
                                <Users size={28} color="#f97316" />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Sin resultados</h3>
                            <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '360px', margin: '0 auto' }}>
                                No hay profesionales disponibles con esos filtros. Intenta con otra categoría o nombre.
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: '20px' }}>
                            {trabajadores.map(t => (
                                <TrabajadorCard
                                    key={t.id_usuario}
                                    trabajador={t}
                                    onContactar={() => handleContactar(t)}
                                    onVerPerfil={() => navigate(`/trabajador/${t.id_usuario}`)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </div>
    );
}

/* ══ TARJETA de trabajador ══ */
function TrabajadorCard({ trabajador, onContactar, onVerPerfil }) {
    const { nombre, apellido, foto_perfil, habilidades = [], estadisticas } = trabajador;
    const initiales = `${nombre?.charAt(0) || ''}${apellido?.charAt(0) || ''}`.toUpperCase();
    const promedio  = estadisticas?.promedio || 0;
    const total     = estadisticas?.total    || 0;

    return (
        <div
            style={{
                background: '#fff', borderRadius: '22px', padding: '22px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 2px 16px -4px rgba(0,0,0,0.06)',
                display: 'flex', flexDirection: 'column', gap: '14px',
                transition: 'transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px -8px rgba(0,0,0,0.10), 0 4px 16px -4px rgba(249,115,22,0.10)'; e.currentTarget.style.borderColor = '#fed7aa'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 16px -4px rgba(0,0,0,0.06)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}
        >
            {/* Header: avatar + nombre + rating */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                {/* Avatar */}
                <div style={{ flexShrink: 0 }}>
                    {foto_perfil ? (
                        <img
                            src={foto_perfil}
                            alt={`${nombre} ${apellido}`}
                            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(249,115,22,0.2)' }}
                        />
                    ) : (
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, border: '3px solid rgba(249,115,22,0.2)' }}>
                            {initiales}
                        </div>
                    )}
                </div>

                <div style={{ minWidth: 0, flex: 1 }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {nombre} {apellido}
                    </h3>
                    {/* Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '5px' }}>
                        <MiniStars valor={promedio} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#f97316' }}>{promedio > 0 ? promedio.toFixed(1) : '—'}</span>
                        {total > 0 && <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>({total})</span>}
                    </div>
                </div>
            </div>

            {/* Habilidades */}
            {habilidades.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {habilidades.map(hab => (
                        <span key={hab.id_habilidad} style={{
                            padding: '4px 10px', borderRadius: '999px', fontSize: '0.73rem', fontWeight: 700,
                            background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa',
                        }}>
                            {hab.categoria?.nombre || hab.descripcion}
                        </span>
                    ))}
                </div>
            ) : (
                <p style={{ fontSize: '0.82rem', color: '#94a3b8', margin: 0 }}>Sin especialidades listadas</p>
            )}

            {/* Tarifa mínima */}
            {habilidades.length > 0 && habilidades[0].tarifa_hora && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', borderRadius: '13px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', border: '1px solid #fed7aa' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#c2410c', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Desde / hora</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#9a3412' }}>
                        {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(
                            Math.min(...habilidades.map(h => Number(h.tarifa_hora) || Infinity).filter(v => v !== Infinity))
                        )}
                    </span>
                </div>
            )}

            {/* Acciones */}
            <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                <button
                    onClick={onContactar}
                    style={{
                        flex: 1, padding: '11px', borderRadius: '13px',
                        background: 'linear-gradient(135deg,#f97316,#ea580c)',
                        color: '#fff', fontWeight: 700, fontSize: '0.87rem',
                        border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px',
                        boxShadow: '0 4px 14px -2px rgba(249,115,22,0.35)',
                        transition: 'all 0.18s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(249,115,22,0.5)'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(249,115,22,0.35)'; e.currentTarget.style.transform = ''; }}
                >
                    <MessageCircle size={16} /> Contactar
                </button>
                <button
                    onClick={onVerPerfil}
                    title="Ver perfil completo"
                    style={{
                        width: '44px', height: '44px', borderRadius: '13px',
                        background: '#f1f5f9', color: '#475569',
                        border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.18s ease', flexShrink: 0,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0f172a'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f1f5f9'; e.currentTarget.style.color = '#475569'; }}
                >
                    <ExternalLink size={17} />
                </button>
            </div>
        </div>
    );
}

export default Trabajadores;
