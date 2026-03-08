import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { Link } from "react-router-dom";
import { Inbox, Calendar, Users, Eye, Trash2, XCircle, AlertCircle, Plus, LayoutDashboard } from 'lucide-react';

function MisPublicaciones({ usuarioId }) {
    const [trabajos, setTrabajos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filtroTab, setFiltroTab] = useState('activas'); // 'activas' o 'historial'
    const [actionModal, setActionModal] = useState({ isOpen: false, type: null, job: null });
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        if (usuarioId) cargarMios();
    }, [usuarioId]);

    const cargarMios = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/trabajos?id_empleador=${usuarioId}`);
            const data = await res.json();
            if (res.ok) setTrabajos(data.trabajos || []);
        } catch (error) {
            console.error("Error cargando mis publicaciones:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmarAccion = async () => {
        if (!actionModal.job) return;
        setActionLoading(true);
        const { type, job } = actionModal;
        const token = localStorage.getItem('token');

        try {
            let options = { headers: { 'Authorization': `Bearer ${token}` } };
            if (type === 'cancelar') {
                options.method = 'PUT';
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({ estado: 'cancelado' });
                const res = await fetch(`${API_URL}/api/trabajos/${job.id_trabajo}`, options);
                if (res.ok) setTrabajos(prev => prev.map(t => t.id_trabajo === job.id_trabajo ? { ...t, estado: 'cancelado' } : t));
            } else if (type === 'eliminar') {
                options.method = 'DELETE';
                const res = await fetch(`${API_URL}/api/trabajos/${job.id_trabajo}`, options);
                if (res.ok) setTrabajos(prev => prev.filter(t => t.id_trabajo !== job.id_trabajo));
            }
        } catch (error) {
            console.error("Error al ejecutar acción:", error);
            alert("Error de conexión al servidor.");
        } finally {
            setActionLoading(false);
            setActionModal({ isOpen: false, type: null, job: null });
        }
    };

    const filtrados = trabajos.filter(job => {
        const esHistorial = job.estado === 'completado' || job.estado === 'cancelado';
        if (filtroTab === 'activas') return !esHistorial;
        return esHistorial;
    });

    const StatusBadge = ({ estado }) => {
        const config = {
            publicado: { bg: "#ecfdf5", color: "#059669", border: "#a7f3d0" },
            completado: { bg: "#f0f9ff", color: "#0284c7", border: "#bae6fd" },
            cancelado: { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" },
        };
        const item = config[estado] || { bg: "#f8fafc", color: "#64748b", border: "#e2e8f0" };
        return (
            <span style={{
                display: 'inline-flex', padding: '4px 12px', borderRadius: '999px', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase',
                background: item.bg, color: item.color, border: `1px solid ${item.border}`, letterSpacing: '0.04em'
            }}>
                {estado}
            </span>
        );
    };

    return (
        <div style={{ marginTop: '0.5rem' }}>
            {/* Header / Tabs Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
                <div style={{
                    display: 'flex', background: 'rgba(241,245,249,0.8)', padding: '5px', borderRadius: '18px',
                    border: '1px solid rgba(0,0,0,0.05)', backdropFilter: 'blur(8px)',
                }}>
                    <button
                        onClick={() => setFiltroTab('activas')}
                        style={{
                            padding: '10px 24px', borderRadius: '14px', fontSize: '0.88rem', fontWeight: 800, border: 'none', cursor: 'pointer',
                            background: filtroTab === 'activas' ? '#fff' : 'transparent',
                            color: filtroTab === 'activas' ? '#ea580c' : '#64748b',
                            boxShadow: filtroTab === 'activas' ? '0 8px 16px -4px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        Publicaciones
                    </button>
                    <button
                        onClick={() => setFiltroTab('historial')}
                        style={{
                            padding: '10px 24px', borderRadius: '14px', fontSize: '0.88rem', fontWeight: 800, border: 'none', cursor: 'pointer',
                            background: filtroTab === 'historial' ? '#fff' : 'transparent',
                            color: filtroTab === 'historial' ? '#ea580c' : '#64748b',
                            boxShadow: filtroTab === 'historial' ? '0 8px 16px -4px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s',
                        }}
                    >
                        Historial
                    </button>
                </div>

                <Link
                    to="/crear-trabajo"
                    style={{
                        padding: '12px 24px', borderRadius: '14px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                        color: '#fff', fontWeight: 800, fontSize: '0.9rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 8px 16px -4px rgba(15,23,42,0.25)', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(15,23,42,0.35)'; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 8px 16px -4px rgba(15,23,42,0.25)'; }}
                >
                    <Plus size={18} color="#f97316" /> Nueva Publicación
                </Link>
            </div>

            {loading ? (
                <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #fbd38d', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                </div>
            ) : filtrados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4.5rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Inbox size={34} />
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Catálogo de trabajos vacío</h4>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>Gestiona tus proyectos publicados aquí. Empieza publicando un nuevo requerimiento.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.25rem' }}>
                    {filtrados.map((job) => (
                        <div key={job.id_trabajo} style={{
                            background: '#fff', borderRadius: '24px', padding: '24px', position: 'relative', overflow: 'hidden',
                            border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: '0 4px 10px rgba(0,0,0,0.02)'
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 15px 35px -5px rgba(0,0,0,0.06), 0 5px 15px -5px rgba(249,115,22,0.1)'; e.currentTarget.style.borderColor = '#fed7aa'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#f1f5f9'; }}>
                            
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px', marginBottom: '14px' }}>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, lineHeight: 1.3 }}>
                                        {job.titulo}
                                    </h3>
                                    <StatusBadge estado={job.estado} />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '0.85rem' }}>
                                    <Calendar size={14} />
                                    <span>Publicado el {new Date(job.fecha_creacion).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', background: '#f8fafc', borderRadius: '18px', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                                        <Users size={18} />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Postulantes</span>
                                </div>
                                <span style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ea580c' }}>
                                    {job.postulaciones ? job.postulaciones.length : 0}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Link
                                    to={`/detalles/${job.id_trabajo}`}
                                    style={{
                                        padding: '12px', borderRadius: '14px', background: '#0f172a', color: '#fff', fontWeight: 800, fontSize: '0.9rem',
                                        textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#0f172a'}
                                >
                                    <LayoutDashboard size={18} color="#f97316" /> Gestionar Candidatos
                                </Link>
                                
                                {filtroTab === 'activas' && job.estado === 'publicado' && (
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => setActionModal({ isOpen: true, type: 'cancelar', job })}
                                            style={{
                                                flex: 1, padding: '12px', borderRadius: '14px', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: '0.85rem',
                                                border: '1px solid #e2e8f0', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#0f172a'; e.currentTarget.style.color = '#0f172a'; }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'; }}
                                        >
                                            <XCircle size={16} /> Finalizar
                                        </button>
                                        <button
                                            onClick={() => setActionModal({ isOpen: true, type: 'eliminar', job })}
                                            style={{
                                                width: '48px', height: '46px', borderRadius: '14px', background: '#fff1f2', color: '#e11d48',
                                                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.background = '#ffe4e6'}
                                            onMouseLeave={e => e.currentTarget.style.background = '#fff1f2'}
                                            title="Eliminar permanentemente"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Redesign */}
            {actionModal.isOpen && (
                <div style={{
                    position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(8px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '28px', padding: '2.5rem', width: '100%', maxWidth: '420px',
                        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '20px', margin: '0 auto 1.5rem',
                                background: actionModal.type === 'eliminar' ? '#fff1f2' : '#fffbeb',
                                color: actionModal.type === 'eliminar' ? '#e11d48' : '#d97706',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <AlertCircle size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                                {actionModal.type === 'eliminar' ? '¿Eliminar para siempre?' : '¿Finalizar publicación?'}
                            </h3>
                            <p style={{ color: '#64748b', fontSize: '0.98rem', marginTop: '1rem', lineHeight: 1.5 }}>
                                {actionModal.type === 'eliminar'
                                    ? `Estás a punto de borrar "${actionModal.job?.titulo}". Esta acción es irreversible.`
                                    : `Si finalizas "${actionModal.job?.titulo}", ya no podrá recibir nuevos candidatos.`}
                            </p>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setActionModal({ isOpen: false, type: null, job: null })}
                                style={{ flex: 1, padding: '14px', borderRadius: '16px', background: '#f1f5f9', color: '#475569', fontWeight: 800, border: 'none', cursor: 'pointer' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmarAccion}
                                disabled={actionLoading}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '16px',
                                    background: actionModal.type === 'eliminar' ? '#e11d48' : '#0f172a',
                                    color: '#fff', fontWeight: 800, border: 'none', cursor: actionLoading ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {actionLoading ? <div style={{ width: '20px', height: '20px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MisPublicaciones;
