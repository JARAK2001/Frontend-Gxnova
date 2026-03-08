import React, { useEffect, useState } from "react";
import API_URL from '../../config/api';
import Estrellas from "../../ui/Estrellas";
import { Mail, Phone, CheckCircle, Users, Calendar, Briefcase, Wrench, Rocket, ShieldCheck, Star } from 'lucide-react';

/* ── Tarjeta de info individual ── */
const InfoCard = ({ icon, iconBg, iconColor, label, children, fullWidth = false }) => (
    <div style={{
        padding: '1.1rem 1.4rem', borderRadius: '18px',
        background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(249,115,22,0.10)',
        display: 'flex', alignItems: 'center', gap: '14px',
        transition: 'all 0.2s ease', backdropFilter: 'blur(8px)',
        gridColumn: fullWidth ? '1 / -1' : undefined,
    }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.97)'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(249,115,22,0.11)'; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.22)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.75)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = 'rgba(249,115,22,0.10)'; }}
    >
        <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: iconBg, color: iconColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
        </div>
        <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
            <div style={{ marginTop: '4px' }}>{children}</div>
        </div>
    </div>
);

function DatosPersonales({ usuario, onEdit, onRefresh }) {
    const [promedio, setPromedio] = useState({ promedio: 0, cantidad: 0 });

    useEffect(() => {
        if (usuario?.id_usuario) cargarPromedio();
    }, [usuario]);

    const cargarPromedio = async () => {
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/usuario/${usuario.id_usuario}/promedio`);
            const data = await res.json();
            if (res.ok) setPromedio(data);
        } catch (error) {
            console.error("Error al cargar promedio:", error);
        }
    };

    const handleActivarRol = async (nuevoRol) => {
        if (!window.confirm(`¿Quieres activar el perfil de ${nuevoRol}?`)) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/usuarios/agregar-rol`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ rol: nuevoRol })
            });
            if (res.ok) { alert(`Ahora tienes el perfil de ${nuevoRol}`); onRefresh(); }
            else { const data = await res.json(); alert(`Error: ${data.error || data.message}`); }
        } catch (error) { console.error("Error activando rol:", error); alert("Error de conexión"); }
    };

    return (
        <div>
            {/* ── Rating banner (solo si hay reseñas) ── */}
            {promedio.cantidad > 0 && (
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                    border: '1px solid #fed7aa', borderRadius: '18px', padding: '16px 22px',
                    marginBottom: '1.75rem',
                }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#f97316,#ea580c)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Star size={20} color="#fff" fill="#fff" />
                    </div>
                    <div>
                        <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#c2410c', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Calificación promedio</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                            <Estrellas puntuacion={promedio.promedio} />
                            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ea580c' }}>{promedio.promedio.toFixed(1)}</span>
                            <span style={{ fontSize: '0.82rem', color: '#c2410c', fontWeight: 600 }}>({promedio.cantidad} reseñas)</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Grid de tarjetas (2 col en desktop) ── */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
                gap: '1rem',
                marginBottom: '1.75rem',
            }}>
                <InfoCard label="Correo electrónico" icon={<Mail size={19} />} iconBg="linear-gradient(135deg,#dbeafe,#bfdbfe)" iconColor="#1d4ed8">
                    <p style={{ fontSize: '0.93rem', fontWeight: 700, color: '#0f172a', margin: 0, wordBreak: 'break-all' }}>{usuario.correo}</p>
                </InfoCard>

                <InfoCard label="Teléfono" icon={<Phone size={19} />} iconBg="linear-gradient(135deg,#d1fae5,#a7f3d0)" iconColor="#059669">
                    <p style={{ fontSize: '0.93rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{usuario.telefono || "No especificado"}</p>
                </InfoCard>

                <InfoCard label="Estado de cuenta" icon={<CheckCircle size={19} />}
                    iconBg={usuario.estado === 'activo' ? 'linear-gradient(135deg,#dcfce7,#bbf7d0)' : 'linear-gradient(135deg,#fee2e2,#fecaca)'}
                    iconColor={usuario.estado === 'activo' ? '#16a34a' : '#dc2626'}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700,
                        background: usuario.estado === 'activo' ? '#ecfdf5' : '#fef2f2',
                        color: usuario.estado === 'activo' ? '#16a34a' : '#dc2626',
                        border: `1px solid ${usuario.estado === 'activo' ? '#a7f3d0' : '#fecaca'}`,
                    }}>
                        {usuario.estado === 'activo' ? '● Activo' : '● Inactivo'}
                    </span>
                </InfoCard>

                <InfoCard label="Identidad" icon={<ShieldCheck size={19} />}
                    iconBg={usuario.verificado ? 'linear-gradient(135deg,#d1fae5,#a7f3d0)' : 'linear-gradient(135deg,#f1f5f9,#e2e8f0)'}
                    iconColor={usuario.verificado ? '#16a34a' : '#94a3b8'}>
                    <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: '4px',
                        padding: '3px 10px', borderRadius: '999px', fontSize: '0.82rem', fontWeight: 700,
                        background: usuario.verificado ? '#ecfdf5' : '#f8fafc',
                        color: usuario.verificado ? '#16a34a' : '#64748b',
                        border: `1px solid ${usuario.verificado ? '#a7f3d0' : '#e2e8f0'}`,
                    }}>
                        {usuario.verificado ? '✓ Verificado' : 'Pendiente'}
                    </span>
                </InfoCard>

                <InfoCard label="Miembro desde" icon={<Calendar size={19} />} iconBg="linear-gradient(135deg,#fef3c7,#fde68a)" iconColor="#d97706">
                    <p style={{ fontSize: '0.93rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {new Date(usuario.fecha_registro).toLocaleDateString("es-CO", { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </InfoCard>

                {/* Perfiles activos — ancho completo */}
                <div style={{
                    padding: '1.1rem 1.4rem', borderRadius: '18px', gridColumn: '1 / -1',
                    background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(249,115,22,0.10)',
                    backdropFilter: 'blur(8px)',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.9rem' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#f3e8ff,#e9d5ff)', color: '#9333ea', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Users size={19} />
                        </div>
                        <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', margin: 0, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Perfiles activos</p>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                        {usuario.rolesAsignados?.map(r => (
                            <span key={r.rol.id_rol} style={{
                                display: 'inline-flex', alignItems: 'center', gap: '8px',
                                padding: '9px 18px', borderRadius: '13px',
                                background: r.rol.nombre === 'Empleador'
                                    ? 'linear-gradient(135deg,#1e293b,#0f172a)'
                                    : 'linear-gradient(135deg,#fff7ed,#ffedd5)',
                                border: `1px solid ${r.rol.nombre === 'Empleador' ? 'transparent' : '#fed7aa'}`,
                                color: r.rol.nombre === 'Empleador' ? '#f97316' : '#c2410c',
                                fontWeight: 700, fontSize: '0.9rem',
                            }}>
                                {r.rol.nombre === 'Empleador' ? <Briefcase size={17} /> : <Wrench size={17} />}
                                {r.rol.nombre}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Expandir roles ── */}
            {(!usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") ||
                !usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador")) && (
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(249,115,22,0.04) 0%, rgba(255,255,255,0.9) 100%)',
                        border: '1px solid rgba(249,115,22,0.15)', borderRadius: '22px', padding: '1.75rem',
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '1.5rem' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Rocket size={22} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Expande tus posibilidades</h3>
                                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '3px 0 0' }}>Activa otro perfil y desbloquea más opciones en Gxnova.</p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                            {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") && (
                                <button type="button" onClick={() => handleActivarRol("Empleador")}
                                    style={{ background: '#fff', padding: '1.5rem', borderRadius: '18px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', fontFamily: 'var(--font-sans)' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(15,23,42,0.15)'; e.currentTarget.style.borderColor = '#0f172a'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                >
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,#1e293b,#0f172a)', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                        <Briefcase size={28} />
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Modo Empleador</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>Publica trabajos y contrata profesionales.</p>
                                </button>
                            )}
                            {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador") && (
                                <button type="button" onClick={() => handleActivarRol("Trabajador")}
                                    style={{ background: '#fff', padding: '1.5rem', borderRadius: '18px', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 2px 8px rgba(249,115,22,0.08)', fontFamily: 'var(--font-sans)' }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(249,115,22,0.25)'; e.currentTarget.style.borderColor = '#f97316'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 2px 8px rgba(249,115,22,0.08)'; e.currentTarget.style.borderColor = '#fed7aa'; }}
                                >
                                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg,#f97316,#ea580c)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                                        <Wrench size={28} />
                                    </div>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>Modo Trabajador</h4>
                                    <p style={{ color: '#64748b', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>Postúlate a trabajos y ofrece tus servicios.</p>
                                </button>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
}

export default DatosPersonales;
