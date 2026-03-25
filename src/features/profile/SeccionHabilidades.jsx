import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { useThemeTokens } from "../../hooks/useThemeTokens";
import { Wrench, Plus, Folder, FileText, DollarSign, Save, Trash2, Loader2, Star, Clock, CheckCircle, XCircle, Lightbulb, Camera, Edit3 } from 'lucide-react';
import Swal from 'sweetalert2';

function SeccionHabilidades({ usuarioId }) {
    const t = useThemeTokens();
    const [habilidades, setHabilidades] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mostrarFormHabilidad, setMostrarFormHabilidad] = useState(false);
    const [creandoHabilidad, setCreandoHabilidad] = useState(false);
    const [archivoCertificado, setArchivoCertificado] = useState(null);
    const [nuevaHabilidad, setNuevaHabilidad] = useState({
        id_categoria: "",
        descripcion: "",
        tarifa_hora: "",
        tipo_documento: "certificado",
    });

    useEffect(() => {
        if (usuarioId) {
            cargarCategorias();
            cargarHabilidades();
        }
    }, [usuarioId]);

    const cargarCategorias = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categorias`);
            const data = await res.json();
            if (res.ok) setCategorias(data.categorias || []);
        } catch (error) {
            console.error("Error cargando categorías:", error);
        }
    };

    const cargarHabilidades = async () => {
        if (!usuarioId) return;
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/habilidades/usuario/${usuarioId}`);
            const data = await res.json();
            if (res.ok) {
                setHabilidades(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Error cargando habilidades:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCrearHabilidad = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!nuevaHabilidad.id_categoria || !nuevaHabilidad.descripcion || !nuevaHabilidad.tarifa_hora) {
            Swal.fire('Atención', "Por favor completa todos los campos de la habilidad.", 'warning');
            return;
        }
        if (!archivoCertificado) {
            Swal.fire('Atención', "Por favor sube un certificado o diploma para validar tu habilidad.", 'warning');
            return;
        }

        setCreandoHabilidad(true);

        try {
            const formData = new FormData();
            formData.append('id_categoria', nuevaHabilidad.id_categoria);
            formData.append('descripcion', nuevaHabilidad.descripcion);
            formData.append('tarifa_hora', nuevaHabilidad.tarifa_hora);
            formData.append('tipo_documento', nuevaHabilidad.tipo_documento);
            formData.append('certificado', archivoCertificado);

            const res = await fetch(`${API_URL}/api/habilidades`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            const data = await res.json();
            if (res.status === 200 || res.status === 201 || res.status === 202) {
                setNuevaHabilidad({ id_categoria: "", descripcion: "", tarifa_hora: "", tipo_documento: "certificado" });
                setArchivoCertificado(null);
                setMostrarFormHabilidad(false);
                cargarHabilidades();
                if (res.status === 202) {
                    Swal.fire('¡Enviada!', "Habilidad enviada. Debido a que el sistema IA tiene dudas, un administrador revisará tu certificado manualmente.", 'success');
                } else {
                    Swal.fire('¡Éxito!', "Habilidad comprobada y agregada exitosamente.", 'success');
                }
            } else {
                let errorMsg = data.error || "No se pudo agregar";
                if (data.detalles && Array.isArray(data.detalles)) {
                    errorMsg += `\nFalta: ${data.detalles.join(", ")}`;
                }
                Swal.fire('Error', `Error: ${errorMsg}`, 'error');
            }
        } catch (error) {
            console.error("Error creando habilidad:", error);
            Swal.fire('Error', "Hubo un error de conexión al intentar validar el certificado.", 'error');
        } finally {
            setCreandoHabilidad(false);
        }
    };

    const handleEliminarHabilidad = async (id_habilidad) => {
        const result = await Swal.fire({
            title: '¿Eliminar habilidad?',
            text: "¿Seguro que deseas eliminar esta especialidad permanentemente?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ea580c',
            cancelButtonColor: '#64748b',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        const token = localStorage.getItem("token");

        try {
            const res = await fetch(`${API_URL}/api/habilidades/${id_habilidad}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                cargarHabilidades();
                Swal.fire('Eliminada', 'Habilidad eliminada correctamente', 'success');
            } else {
                Swal.fire('Error', "Error al eliminar la habilidad", 'error');
            }
        } catch (error) {
            console.error("Error eliminando habilidad:", error);
            Swal.fire('Error', 'Error de conexión', 'error');
        }
    };

    const handleEditarHabilidad = () => {
         Swal.fire('Edición', 'La funcionalidad de edición de habilidades estará disponible en la próxima actualización.', 'info');
    };

    const StatusBadge = ({ estado }) => {
        const config = {
            aprobada: { icon: CheckCircle, text: "Aprobada", bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
            pendiente_revision: { icon: Clock, text: "En Revisión", bg: "#fefce8", color: "#ca8a04", border: "#fef08a" },
            rechazada: { icon: XCircle, text: "Rechazada", bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
        };
        const item = config[estado] || config.pendiente_revision;
        const Icon = item.icon;
        return (
            <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '10px',
                fontSize: '0.72rem', fontWeight: 800, background: item.bg, color: item.color, border: `1px solid ${item.border}`, letterSpacing: '0.04em'
            }}>
                <Icon size={12} /> {item.text}
            </span>
        );
    };

    const statsAprobadas = habilidades.filter(h => h.estado === 'aprobada').length;
    const statsPendientes = habilidades.filter(h => h.estado === 'pendiente_revision').length;

    const cardsColors = [
        { dot: '#2563eb', border: '#3b82f6' },
        { dot: '#eab308', border: '#facc15' },
        { dot: '#10b981', border: '#34d399' },
        { dot: '#f97316', border: '#fb923c' },
        { dot: '#8b5cf6', border: '#a78bfa' },
    ];

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start', marginTop: '0.5rem' }}>
            
            {/* ── COLUMNA IZQUIERDA (Principal) ── */}
            <div style={{ flex: '1 1 60%', display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: '320px' }}>
                
                {/* 1. Header & Stats */}
                <div style={{
                    background: t.darkMode ? '#1a1d2e' : 'rgba(255,255,255,0.75)',
                    border: `1px solid ${t.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(249,115,22,0.15)'}`,
                    borderRadius: '24px', padding: '1.75rem',
                    backdropFilter: 'blur(12px)',
                    boxShadow: t.shadowCard,
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: t.darkMode ? '#21253a' : 'linear-gradient(135deg,#f8fafc,#f1f5f9)', color: t.textSecondary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Wrench size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: t.textPrimary, margin: 0 }}>Mis Habilidades</h3>
                            <p style={{ fontSize: '0.88rem', color: t.textSecondary, margin: '2px 0 0' }}>Tus especialidades certificadas y tarifas.</p>
                        </div>
                    </div>

                    {/* Stats Pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderRadius: '14px', background: t.cardBg2, border: `1px solid ${t.cardBorder}` }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: t.textPrimary, lineHeight: 1 }}>{habilidades.length}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: t.textSecondary }}>Total</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderRadius: '14px', background: t.greenBg, border: `1px solid ${t.greenBorder}` }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: t.greenColor, lineHeight: 1 }}>{statsAprobadas}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: t.greenColor }}>Aprobadas</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 18px', borderRadius: '14px', background: t.yellowBg, border: `1px solid ${t.yellowBorder}` }}>
                            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: t.yellowColor, lineHeight: 1 }}>{statsPendientes}</span>
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: t.yellowColor }}>En revisión</span>
                        </div>
                    </div>
                </div>

                {/* 2. Banner Acción Nueva Habilidad */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', padding: '1.5rem', background: t.cardBg, borderRadius: '20px', border: `1px dashed ${t.inputBorder}` }}>
                    <p style={{ color: t.textSecondary, fontSize: '0.92rem', maxWidth: '380px', margin: 0, lineHeight: 1.5 }}>
                        Añade tus especialidades para que los empleadores sepan en qué destacas y cuál es tu tarifa base.
                    </p>
                    <button
                        onClick={() => setMostrarFormHabilidad(!mostrarFormHabilidad)}
                        style={{
                            padding: '12px 24px', fontWeight: 800, borderRadius: '14px', transition: 'all 0.2s', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                            background: mostrarFormHabilidad ? '#f1f5f9' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            color: mostrarFormHabilidad ? '#475569' : '#fff',
                            boxShadow: mostrarFormHabilidad ? 'none' : '0 8px 20px -4px rgba(249,115,22,0.35)',
                        }}
                    >
                        {mostrarFormHabilidad ? "Cerrar Panel" : <><Plus size={18} /> Nueva Habilidad</>}
                    </button>
                </div>

                {/* 3. Formulario (Acordeón) */}
                {mostrarFormHabilidad && (
                    <div style={{ background: t.cardBg, padding: '2.5rem', borderRadius: '24px', border: `1px solid ${t.darkMode ? 'rgba(249,115,22,0.25)' : 'rgba(249,115,22,0.2)'}`, boxShadow: t.darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px -5px rgba(249,115,22,0.08)' }}>
                        <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: t.textPrimary, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Star size={22} color="#f97316" /> Agregar nueva especialidad
                        </h4>
                        <form onSubmit={handleCrearHabilidad} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: t.textSecondary }}>Categoría</label>
                                    <select
                                        value={nuevaHabilidad.id_categoria}
                                        onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, id_categoria: e.target.value })}
                                        style={{ width: '100%', borderRadius: '14px', border: `1.5px solid ${t.inputBorder}`, padding: '12px 16px', fontSize: '0.95rem', background: t.inputBg, color: t.textPrimary }}
                                        required
                                    >
                                        <option value="" disabled>Selecciona un rubro...</option>
                                        {categorias.map(cat => (
                                            <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: t.textSecondary }}>Descripción / Título (Ej: Experta en fugas)</label>
                                    <input
                                        type="text"
                                        value={nuevaHabilidad.descripcion}
                                        onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, descripcion: e.target.value })}
                                        style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: `1.5px solid ${t.inputBorder}`, padding: '12px 16px', fontSize: '0.95rem', background: t.inputBg, color: t.textPrimary }}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: t.textSecondary }}>Tarifa estimada por hora (COP)</label>
                                    <div style={{ position: 'relative' }}>
                                        <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: t.textSecondary }} />
                                        <input
                                            type="number"
                                            value={nuevaHabilidad.tarifa_hora}
                                            onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, tarifa_hora: e.target.value })}
                                            style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: `1.5px solid ${t.inputBorder}`, padding: '12px 16px 12px 38px', fontSize: '0.95rem', background: t.inputBg, color: t.textPrimary }}
                                            required
                                        />
                                    </div>
                                </div>
                                
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: t.textSecondary }}>Documento de Respaldo</label>
                                    <select
                                        value={nuevaHabilidad.tipo_documento}
                                        onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, tipo_documento: e.target.value })}
                                        style={{ width: '100%', borderRadius: '14px', border: `1.5px solid ${t.inputBorder}`, padding: '12px 16px', fontSize: '0.95rem', background: t.inputBg, color: t.textPrimary }}
                                        required
                                    >
                                        <option value="certificado">Certificado Técnico/Curso</option>
                                        <option value="diploma">Diploma de Bachiller</option>
                                    </select>
                                </div>

                                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 800, color: t.textSecondary }}>Sube la Foto del Diploma/Certificado</label>
                                    <div style={{ border: `2px dashed ${t.inputBorder}`, borderRadius: '16px', padding: '20px', background: t.inputBg, textAlign: 'center' }}>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => setArchivoCertificado(e.target.files[0])}
                                            style={{ fontSize: '0.9rem', color: t.textSecondary }}
                                            required
                                        />
                                        <p style={{ fontSize: '0.75rem', color: t.textMuted, marginTop: '10px', margin: 0 }}>La Inteligencia Artificial validará tu documento automáticamente en segundos.</p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={creandoHabilidad}
                                style={{
                                    padding: '16px', borderRadius: '16px', background: creandoHabilidad ? '#94a3b8' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                    color: '#fff', fontWeight: 800, fontSize: '1rem', border: 'none', cursor: creandoHabilidad ? 'not-allowed' : 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 24px -6px rgba(249,115,22,0.45)',
                                    transition: 'all 0.2s', marginTop: '0.5rem'
                                }}
                            >
                                {creandoHabilidad ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                {creandoHabilidad ? "Certificando con IA..." : "Validar y Guardar Habilidad"}
                            </button>
                        </form>
                    </div>
                )}

                {/* 4. Lista (Grid) de Habilidades - Diseño mejorado */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                        <Loader2 className="animate-spin" size={40} color="#ea580c" />
                    </div>
                ) : habilidades.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                        {habilidades.map((hab, index) => {
                            const look = cardsColors[index % cardsColors.length];
                            return (
                                <div key={hab.id_habilidad} style={{
                                    background: t.cardBg, borderRadius: '24px', position: 'relative',
                                    border: `1px solid ${t.cardBorder}`, borderTop: `5px solid ${look.border}`,
                                    display: 'flex', flexDirection: 'column', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'default',
                                    boxShadow: t.shadowCard, overflow: 'hidden'
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-6px)'; e.currentTarget.style.boxShadow = '0 20px 30px -10px rgba(0,0,0,0.1)'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 10px 25px -10px rgba(0,0,0,0.05)'; }}
                                >
                                    <div style={{ padding: '24px 24px 16px', flexGrow: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                            <span style={{ 
                                                fontSize: '0.72rem', fontWeight: 900, color: t.textSecondary, letterSpacing: '0.06em', textTransform: 'uppercase', 
                                                display: 'flex', alignItems: 'center', gap: '6px'
                                            }}>
                                                <span style={{ display: 'block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: look.dot }} />
                                                {hab.categoria.nombre}
                                            </span>
                                            <StatusBadge estado={hab.estado} />
                                        </div>
                                        
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: 900, color: t.textPrimary, margin: '0 0 8px 0', lineHeight: 1.25 }}>Servicios de {hab.categoria.nombre}</h4>
                                        <p style={{ fontSize: '0.88rem', color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>
                                            {hab.descripcion}
                                        </p>
                                    </div>
                                    
                                    {/* Tarifa Box */}
                                    <div style={{ background: t.cardBg2, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px dashed ${t.cardBorder}`, borderBottom: `1px dashed ${t.cardBorder}` }}>
                                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: t.textSecondary, letterSpacing: '0.05em' }}>TARIFA / HORA</span>
                                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f97316' }}>${parseInt(hab.tarifa_hora).toLocaleString('es-CO')}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8' }}>/hr</span>
                                        </div>
                                    </div>

                                    {/* Footer Botones */}
                                    <div style={{ display: 'flex', gap: '10px', padding: '16px 24px' }}>
                                        <button onClick={handleEditarHabilidad} style={{
                                            flex: 1, padding: '10px', borderRadius: '12px', background: '#fff', color: '#475569', fontWeight: 700, fontSize: '0.85rem',
                                            border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                                        }} onMouseEnter={e => { e.currentTarget.style.borderColor = '#94a3b8'; e.currentTarget.style.color = '#0f172a'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'; }}>
                                            <Edit3 size={15} /> Editar
                                        </button>

                                        <button onClick={() => handleEliminarHabilidad(hab.id_habilidad)} style={{
                                            flex: 1, padding: '10px', borderRadius: '12px', background: '#fff', color: '#e11d48', fontWeight: 700, fontSize: '0.85rem',
                                            border: '1px solid #fecdd3', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s'
                                        }} onMouseEnter={e => e.currentTarget.style.background = '#fff1f2'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
                                            <Trash2 size={15} /> Eliminar
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '4.5rem 2rem', background: t.cardBg2, borderRadius: '24px', border: `2px dashed ${t.cardBorder}` }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: t.cardBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted, margin: '0 auto 1.5rem', boxShadow: t.shadowCard }}>
                            <Star size={32} />
                        </div>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: t.textPrimary, marginBottom: '8px' }}>Tu catálogo de servicios está vacío</h4>
                        <p style={{ color: t.textSecondary, fontSize: '0.92rem', maxWidth: '380px', margin: '0 auto' }}>Publica tu primera habilidad y obtén el sello de certificación IA para destacar frente a contratistas.</p>
                    </div>
                )}
            </div>

            {/* ── COLUMNA DERECHA (Sidebar Consejos) ── */}
            <div style={{ flex: '1 1 30%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{
                    background: t.darkMode ? '#1a1d2e' : 'rgba(255,255,255,0.85)',
                    border: `1px solid ${t.darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(249,115,22,0.15)'}`,
                    borderRadius: '24px', padding: '1.75rem',
                    backdropFilter: 'blur(12px)',
                    boxShadow: t.darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px -10px rgba(249,115,22,0.1)'
                }}>
                    <div style={{ marginBottom: '1.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '46px', height: '46px', borderRadius: '16px', background: t.darkMode ? 'rgba(251,191,36,0.15)' : 'linear-gradient(135deg,#fef3c7,#fde68a)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Lightbulb size={24} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: t.textPrimary, margin: 0 }}>Consejos</h3>
                            <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: '2px 0 0' }}>Mejora tu visibilidad</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                 <span style={{ color: '#f97316' }}><Camera size={20} /></span>
                                 <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: t.textPrimary, margin: 0 }}>Agrega fotos de tu trabajo</h4>
                             </div>
                             <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>Los perfiles con portafolio visual reciben 3x más solicitudes de empleadores.</p>
                        </div>

                        <div style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                 <span style={{ color: '#10b981' }}><FileText size={20} /></span>
                                 <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: t.textPrimary, margin: 0 }}>Sube tus certificaciones</h4>
                             </div>
                             <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>Los certificados verificados por IA aumentan la confianza y te posicionan mejor en búsquedas.</p>
                        </div>

                        <div style={{ background: t.cardBg2, border: `1px solid ${t.cardBorder}`, borderRadius: '20px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                             <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                 <span style={{ color: '#3b82f6' }}><DollarSign size={20} /></span>
                                 <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: t.textPrimary, margin: 0 }}>Actualiza tus tarifas</h4>
                             </div>
                             <p style={{ fontSize: '0.85rem', color: t.textSecondary, margin: 0, lineHeight: 1.5 }}>Revisa tus precios cada trimestre para mantenerte competitivo en tu zona.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default SeccionHabilidades;
