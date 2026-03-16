import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { Wrench, Plus, Folder, FileText, DollarSign, Save, Trash2, Loader2, Star, Clock, CheckCircle, XCircle } from 'lucide-react';
import Swal from 'sweetalert2';

function SeccionHabilidades({ usuarioId }) {
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
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            text: "¿Seguro que deseas eliminar esta habilidad?",
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
                display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '999px',
                fontSize: '0.75rem', fontWeight: 800, background: item.bg, color: item.color, border: `1px solid ${item.border}`
            }}>
                <Icon size={12} /> {item.text}
            </span>
        );
    };

    const statsAprobadas = habilidades.filter(h => h.estado === 'aprobada').length;
    const statsPendientes = habilidades.filter(h => h.estado === 'pendiente_revision').length;

    return (
        <div style={{ marginTop: '0.5rem' }}>
            {/* Stats rápidas */}
            {habilidades.length > 0 && (
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
                    {[
                        { label: 'Total', value: habilidades.length, bg: '#f8fafc', color: '#475569', border: '#e2e8f0' },
                        { label: 'Aprobadas', value: statsAprobadas, bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' },
                        { label: 'En revisión', value: statsPendientes, bg: '#fefce8', color: '#ca8a04', border: '#fde047' },
                    ].map(stat => (
                        <div key={stat.label} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '10px 18px', borderRadius: '14px',
                            background: stat.bg, border: `1px solid ${stat.border}`,
                        }}>
                            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: stat.color, lineHeight: 1 }}>{stat.value}</span>
                            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: stat.color, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{stat.label}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Toolbar row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '420px', margin: 0, lineHeight: 1.5 }}>
                    Añade tus especialidades para que los empleadores sepan en qué destacas y cuál es tu tarifa base.
                </p>
                <button
                    onClick={() => setMostrarFormHabilidad(!mostrarFormHabilidad)}
                    style={{
                        padding: '10px 20px', fontWeight: 700, borderRadius: '12px', transition: 'all 0.2s',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
                        background: mostrarFormHabilidad ? '#f1f5f9' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: mostrarFormHabilidad ? '#475569' : '#fff',
                        boxShadow: mostrarFormHabilidad ? 'none' : '0 4px 12px rgba(249,115,22,0.3)',
                    }}
                >
                    {mostrarFormHabilidad ? "Cerrar" : <><Plus size={18} /> Nueva Habilidad</>}
                </button>
            </div>

            {/* Formulario */}
            {mostrarFormHabilidad && (
                <div style={{
                    background: 'rgba(255,255,255,0.6)', padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem',
                    border: '1px solid rgba(249,115,22,0.25)', boxShadow: '0 10px 25px -5px rgba(249,115,22,0.1)',
                    backdropFilter: 'blur(10px)',
                }}>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: '#0f172a', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Star size={22} color="#f97316" /> Agregar nueva especialidad
                    </h4>
                    <form onSubmit={handleCrearHabilidad} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-700)' }}>Categoría</label>
                                <select
                                    value={nuevaHabilidad.id_categoria}
                                    onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, id_categoria: e.target.value })}
                                    style={{ width: '100%', borderRadius: '14px', border: '1.5px solid var(--slate-200)', padding: '12px 16px', fontSize: '0.95rem', background: '#fff' }}
                                    required
                                >
                                    <option value="" disabled>Selecciona un rubro...</option>
                                    {categorias.map(cat => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-700)' }}>Descripción breve (Ej: Pintor profesional)</label>
                                <input
                                    type="text"
                                    value={nuevaHabilidad.descripcion}
                                    onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, descripcion: e.target.value })}
                                    style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: '1.5px solid var(--slate-200)', padding: '12px 16px', fontSize: '0.95rem' }}
                                    required
                                />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-700)' }}>Tarifa / hora (COP)</label>
                                <div style={{ position: 'relative' }}>
                                    <DollarSign size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                    <input
                                        type="number"
                                        value={nuevaHabilidad.tarifa_hora}
                                        onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, tarifa_hora: e.target.value })}
                                        style={{ width: '100%', boxSizing: 'border-box', borderRadius: '14px', border: '1.5px solid var(--slate-200)', padding: '12px 16px 12px 38px', fontSize: '0.95rem' }}
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-700)' }}>Tipo de Documento a Subir</label>
                                <select
                                    value={nuevaHabilidad.tipo_documento}
                                    onChange={(e) => setNuevaHabilidad({ ...nuevaHabilidad, tipo_documento: e.target.value })}
                                    style={{ width: '100%', borderRadius: '14px', border: '1.5px solid var(--slate-200)', padding: '12px 16px', fontSize: '0.95rem', background: '#fff' }}
                                    required
                                >
                                    <option value="certificado">Certificado Técnico/Curso</option>
                                    <option value="diploma">Diploma de Bachiller</option>
                                </select>
                            </div>

                            <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--slate-700)' }}>Diploma o Certificado (Imagen)</label>
                                <div style={{ border: '2px dashed #cbd5e1', borderRadius: '16px', padding: '20px', background: '#f8fafc', textAlign: 'center' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setArchivoCertificado(e.target.files[0])}
                                        style={{ fontSize: '0.9rem', color: '#475569' }}
                                        required
                                    />
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '10px', margin: 0 }}>Sube un documento válido para certificar tu conocimiento.</p>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={creandoHabilidad}
                            style={{
                                padding: '14px', borderRadius: '14px', background: creandoHabilidad ? '#94a3b8' : 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                                color: '#fff', fontWeight: 800, border: 'none', cursor: creandoHabilidad ? 'not-allowed' : 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 8px 20px -4px rgba(249,115,22,0.4)',
                                transition: 'all 0.2s',
                            }}
                        >
                            {creandoHabilidad ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {creandoHabilidad ? "Certificando con IA..." : "Someter para Verificación"}
                        </button>
                    </form>
                </div>
            )}

            {/* Lista de Habilidades */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <Loader2 className="animate-spin" size={40} color="#ea580c" />
                </div>
            ) : habilidades.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
                    {habilidades.map((hab) => (
                        <div
                            key={hab.id_habilidad}
                            style={{
                                background: '#fff', borderRadius: '22px', padding: '24px', position: 'relative',
                                border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', cursor: 'default',
                                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(249,115,22,0.08)';
                                e.currentTarget.style.borderColor = '#fed7aa';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)';
                                e.currentTarget.style.borderColor = '#f1f5f9';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#f97316', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{hab.categoria.nombre}</span>
                                    <h4 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{hab.descripcion}</h4>
                                </div>
                                <StatusBadge estado={hab.estado} />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '16px' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>TARIFA HORA</span>
                                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ea580c' }}>${parseInt(hab.tarifa_hora).toLocaleString('es-CO')}</span>
                            </div>

                            <button
                                onClick={() => handleEliminarHabilidad(hab.id_habilidad)}
                                style={{
                                    width: '100%', padding: '10px', borderRadius: '12px', background: '#fff1f2', color: '#e11d48',
                                    fontWeight: 800, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#ffe4e6'}
                                onMouseLeave={e => e.currentTarget.style.background = '#fff1f2'}
                            >
                                <Trash2 size={16} /> Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', margin: '0 auto 1.5rem' }}>
                        <Star size={32} />
                    </div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Tu catálogo de servicios está vacío</h4>
                    <p style={{ color: '#64748b', fontSize: '0.92rem', maxWidth: '350px', margin: '0 auto' }}>Publica tu primera habilidad certificada para empezar a recibir ofertas de trabajo.</p>
                </div>
            )}
        </div>
    );
}

export default SeccionHabilidades;
