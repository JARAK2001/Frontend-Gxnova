import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API_URL from '../../config/api';
import Encabezado from "../../layouts/Encabezado";
import ModalCalificar from "../profile/ModalCalificar";
import ModalPerfilTrabajador from "../profile/ModalPerfilTrabajador";
import Estrellas from "../../ui/Estrellas";
import ConfirmacionTransaccion from "./ConfirmacionTransaccion";
import {
    DollarSign, MapPin, Calendar, User, ClipboardList,
    MessageSquare, Rocket, X, Clock, ArrowLeft,
    CheckCircle, Star, Briefcase, RefreshCw, Loader2,
    Trash2, XCircle, AlertCircle, Tag
} from 'lucide-react';
import Swal from 'sweetalert2';
import { useChat } from "../../context/ChatContext";

function Detalles() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { abrirChat } = useChat();
    const [trabajo, setTrabajo] = useState(null);
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [precioPropuesto, setPrecioPropuesto] = useState("");
    const [mostrarFormPostulacion, setMostrarFormPostulacion] = useState(false);
    const [modalCalificarOpen, setModalCalificarOpen] = useState(false);
    const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
    const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
    const [miCalificacion, setMiCalificacion] = useState(null);
    const [usuarioAReceptar, setUsuarioAReceptar] = useState(null);
    const [transaccion, setTransaccion] = useState(null);
    const [actionModal, setActionModal] = useState({ isOpen: false, type: null });
    const [actionLoading, setActionLoading] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
        cargarUsuario();
        cargarTrabajo();
        cargarPostulaciones();
    }, [id]);

    useEffect(() => {
        if (usuario && trabajo) {
            verificarSiYaCalifico();
            determinarUsuarioAReceptar();
            if (trabajo.estado === 'en_proceso' || trabajo.estado === 'completado') cargarTransaccion();
        }
    }, [usuario, trabajo, postulaciones]);

    const cargarUsuario = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/usuarios/perfil`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (res.ok) setUsuario(data.usuario);
        } catch (err) { console.error("Error cargando usuario:", err); }
    };

    const cargarTrabajo = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/trabajos/${id}`);
            const data = await res.json();
            if (data.trabajo) setTrabajo(data.trabajo);
        } catch (err) { console.error("Error al cargar trabajo:", err); }
        finally { setLoading(false); }
    };

    const cargarTransaccion = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const postulacionAceptada = postulaciones.find(p => p.estado === 'aceptada');
            if (!postulacionAceptada) return;
            let idAcuerdo = postulacionAceptada?.acuerdo?.id_acuerdo;
            if (!idAcuerdo) {
                const resA = await fetch(`${API_URL}/api/acuerdos?id_trabajo=${id}&id_trabajador=${postulacionAceptada.id_trabajador}`, { headers: { Authorization: `Bearer ${token}` } });
                const dataA = await resA.json();
                if (dataA.acuerdos?.length > 0) idAcuerdo = dataA.acuerdos[0].id_acuerdo;
            }
            if (!idAcuerdo) return;
            const res = await fetch(`${API_URL}/api/transacciones?id_acuerdo=${idAcuerdo}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.transacciones?.length > 0) setTransaccion(data.transacciones[0]);
        } catch (err) { console.error("Error cargando transacción:", err); }
    };

    const cargarPostulaciones = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/postulaciones?id_trabajo=${id}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.postulaciones) setPostulaciones(data.postulaciones);
        } catch (err) { console.error("Error al cargar postulaciones:", err); }
    };

    const determinarUsuarioAReceptar = () => {
        if (!usuario || !trabajo) return;
        if (usuario.id_usuario === trabajo.id_empleador) {
            const pa = postulaciones.find(p => p.estado === 'aceptada');
            if (pa) setUsuarioAReceptar(pa.trabajador);
        } else {
            const soy = postulaciones.some(p => p.id_trabajador === usuario.id_usuario && p.estado === 'aceptada');
            if (soy) setUsuarioAReceptar(trabajo.empleador);
        }
    };

    const verificarSiYaCalifico = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/verificar?id_trabajo=${id}`, { headers: { Authorization: `Bearer ${token}` } });
            const data = await res.json();
            if (data.yaCalifico) setMiCalificacion(data.calificacion);
        } catch (err) { console.error("Error verificando calificación:", err); }
    };

    const handleCalificar = async (datos) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/calificaciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ id_trabajo: id, id_usuario_receptor: usuarioAReceptar.id_usuario, puntuacion: datos.puntuacion, comentario: datos.comentario }),
            });
            if (res.ok) { Swal.fire('¡Éxito!', "Calificación enviada exitosamente", 'success'); verificarSiYaCalifico(); }
            else { const d = await res.json(); Swal.fire('Error', `Error: ${d.error}`, 'error'); }
        } catch (err) { Swal.fire('Error', "Error de conexión", 'error'); }
    };

    const handlePostular = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        if (!token) { setShowLoginModal(true); return; }
        try {
            const res = await fetch(`${API_URL}/api/postulaciones`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ id_trabajo: parseInt(id), mensaje, precio_propuesto: precioPropuesto ? parseFloat(precioPropuesto) : null }),
            });
            const data = await res.json();
            if (res.ok) { Swal.fire('¡Éxito!', "Postulación enviada exitosamente", 'success'); setMensaje(""); setPrecioPropuesto(""); setMostrarFormPostulacion(false); cargarPostulaciones(); }
            else { Swal.fire('Error', `Error: ${data.error || data.message}`, 'error'); }
        } catch (err) { Swal.fire('Error', "Error de conexión con el servidor", 'error'); }
    };

    const confirmarAccion = async () => {
        setActionLoading(true);
        const token = localStorage.getItem('token');
        try {
            let options = { headers: { 'Authorization': `Bearer ${token}` } };
            if (actionModal.type === 'cancelar') {
                options.method = 'PUT';
                options.headers['Content-Type'] = 'application/json';
                options.body = JSON.stringify({ estado: 'cancelado' });

                const res = await fetch(`${API_URL}/api/trabajos/${id}`, options);
                if (res.ok) {
                    Swal.fire('¡Cancelado!', "Trabajo cancelado exitosamente.", 'success');
                    cargarTrabajo();
                } else {
                    const data = await res.json();
                    Swal.fire('Error', `Error: ${data.error || 'No se pudo cancelar el trabajo.'}`, 'error');
                }
            } else if (actionModal.type === 'eliminar') {
                options.method = 'DELETE';
                const res = await fetch(`${API_URL}/api/trabajos/${id}`, options);
                if (res.ok) {
                    Swal.fire('¡Eliminado!', "Trabajo eliminado.", 'success');
                    navigate('/perfil');
                } else {
                    const data = await res.json();
                    Swal.fire('Error', `Error: ${data.error || 'No se pudo eliminar el trabajo.'}`, 'error');
                }
            }
        } catch (error) {
            console.error("Error al ejecutar acción:", error);
            Swal.fire('Error', "Error de conexión al servidor.", 'error');
        } finally {
            setActionLoading(false);
            setActionModal({ isOpen: false, type: null });
        }
    };

    const handleGestionarPostulacion = async (idPostulacion, accion) => {
        const result = await Swal.fire({
            title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} postulación?`,
            text: `¿Estás seguro de ${accion} esta postulación?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: accion === 'aceptar' ? '#16a34a' : '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Sí, ${accion}`,
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/postulaciones/${idPostulacion}/${accion}`, { method: "PATCH", headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) { Swal.fire('¡Éxito!', `Postulación ${accion === 'aceptar' ? 'aceptada' : 'rechazada'} correctamente`, 'success'); cargarPostulaciones(); cargarTrabajo(); }
            else { const d = await res.json(); Swal.fire('Error', `Error: ${d.error || d.message}`, 'error'); }
        } catch (err) { console.error(err); Swal.fire('Error', 'Hubo un error de conexión', 'error'); }
    };

    const formatearPrecio = (m) => {
        if (!m) return "A convenir";
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(m);
    };
    const formatearFecha = (f) => {
        if (!f) return "No especificada";
        return new Date(f).toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });
    };

    const estadoBadge = (estado) => {
        const cfg = {
            publicado: { label: 'Publicado', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' },
            en_proceso: { label: 'En Proceso', bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
            completado: { label: 'Completado', bg: '#f0fdf4', color: '#166534', border: '#bbf7d0' },
        };
        return cfg[estado] || { label: estado, bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    };

    /* ── Loading / Not found ── */
    if (loading) return (
        <div className="min-h-screen bg-slate-50">
            <Encabezado />
            <div className="flex items-center justify-center h-80">
                <div className="text-center">
                    <div className="w-12 h-12 rounded-full mx-auto mb-3 animate-spin" style={{ borderColor: '#f97316', borderTopColor: 'transparent', borderWidth: 3, borderStyle: 'solid' }} />
                    <p className="text-sm text-slate-500 font-semibold">Cargando detalles…</p>
                </div>
            </div>
        </div>
    );

    if (!trabajo) return (
        <div className="min-h-screen bg-slate-50">
            <Encabezado />
            <div className="container mx-auto px-4 py-16 text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#fff7ed,#fed7aa)' }}>
                    <Briefcase size={28} className="text-orange-500" />
                </div>
                <h2 className="text-xl font-black text-slate-800 mb-2">Trabajo no encontrado</h2>
                <p className="text-slate-500 text-sm mb-6">Este trabajo ya no está disponible o fue eliminado.</p>
                <button onClick={() => navigate("/servicios")} className="px-6 py-3 rounded-xl text-white font-bold text-sm" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                    Ver otros trabajos
                </button>
            </div>
        </div>
    );

    const { label: estadoLabel, bg: estadoBg, color: estadoColor, border: estadoBorder } = estadoBadge(trabajo.estado);
    const fotoUrl = trabajo.foto ? (trabajo.foto.startsWith('http') ? trabajo.foto : `${API_URL}${trabajo.foto}`) : null;
    const yaPostulado = usuario ? postulaciones.some(p => p.id_trabajador === usuario.id_usuario) : false;

    return (
        <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #fff7ed 0%, #f8fafc 40%, #fff 100%)' }}>
            <Encabezado />

            {/* ── Hero ── */}
            <div className="relative overflow-hidden" style={{ minHeight: fotoUrl ? 340 : 200 }}>
                {/* Background */}
                {fotoUrl ? (
                    <>
                        <img src={fotoUrl} alt={trabajo.titulo} className="absolute inset-0 w-full h-full object-cover" />
                        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,15,15,0.35) 0%, rgba(15,15,15,0.75) 100%)' }} />
                    </>
                ) : (
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)' }}>
                        <div style={{ position: 'absolute', top: -40, right: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                        <div style={{ position: 'absolute', bottom: -30, left: '40%', width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                    </div>
                )}

                {/* Content */}
                <div className="relative container mx-auto px-4 py-10 max-w-6xl flex flex-col justify-end h-full" style={{ minHeight: 'inherit' }}>
                    <button
                        onClick={() => navigate("/servicios")}
                        className="mb-6 flex items-center gap-2 text-sm font-semibold transition-colors self-start"
                        style={{ color: fotoUrl ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.9)' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                        onMouseLeave={e => e.currentTarget.style.color = fotoUrl ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.9)'}
                    >
                        <ArrowLeft size={16} /> Volver a Servicios
                    </button>

                    <div className="flex flex-wrap gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(255,255,255,0.22)', color: '#fff', backdropFilter: 'blur(6px)' }}>
                            {trabajo.categoria?.nombre || "Sin categoría"}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: estadoBg, color: estadoColor, borderColor: estadoBorder }}>
                            {estadoLabel}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-sm max-w-3xl">
                        {trabajo.titulo}
                    </h1>
                    <p className="mt-2 text-sm font-medium text-white/75 flex items-center gap-1.5">
                        <MapPin size={14} /> {trabajo.ubicacion}
                    </p>
                </div>
            </div>

            {/* ── Main Layout ── */}
            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* ── Left Column ── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Descripción */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-1 h-6 rounded-full" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }} />
                                <h2 className="text-lg font-black text-slate-800">Descripción</h2>
                            </div>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap text-base">{trabajo.descripcion}</p>
                        </div>

                        {/* Trabajo Completado → Calificar */}
                        {trabajo.estado === 'completado' && usuarioAReceptar && (
                            <div className="rounded-2xl border-2 p-6" style={{ borderColor: '#fbbf24', background: 'linear-gradient(135deg,#fffbeb,#fef3c7)' }}>
                                <h3 className="font-black text-slate-800 flex items-center gap-2 mb-3">
                                    <Star size={18} className="text-yellow-500 fill-yellow-500" /> Calificación del Servicio
                                </h3>
                                {miCalificacion ? (
                                    <div>
                                        <p className="text-sm text-slate-600 mb-2">Ya calificaste este servicio:</p>
                                        <Estrellas puntuacion={miCalificacion.puntuacion} />
                                        {miCalificacion.comentario && (
                                            <p className="text-slate-700 mt-3 italic bg-white/70 p-4 rounded-xl text-sm">"{miCalificacion.comentario}"</p>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <p className="text-slate-700 mb-4 text-sm">El trabajo ha finalizado. Por favor califica a <strong>{usuarioAReceptar.nombre}</strong>.</p>
                                        <button
                                            onClick={() => setModalCalificarOpen(true)}
                                            className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-md"
                                            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(245,158,11,0.5)'}
                                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                                        >
                                            ★ Calificar a {usuarioAReceptar.nombre}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Postularme */}
                        {trabajo.estado === 'publicado' && (!usuario || usuario.id_usuario !== trabajo.id_empleador) && (
                            <div>
                                {yaPostulado ? (
                                    <div className="w-full flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl bg-slate-100 text-slate-500 font-bold text-base border-2 border-slate-200">
                                        <CheckCircle size={18} /> Ya te postulaste a este Trabajo
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => {
                                            const token = localStorage.getItem("token");
                                            if (!token) { setShowLoginModal(true); }
                                            else setMostrarFormPostulacion(!mostrarFormPostulacion);
                                        }}
                                        className="w-full flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl text-white font-black text-base transition-all"
                                        style={{
                                            background: mostrarFormPostulacion ? '#94a3b8' : 'linear-gradient(135deg,#f97316,#ea580c)',
                                            boxShadow: mostrarFormPostulacion ? 'none' : '0 8px 24px -4px rgba(249,115,22,0.45)',
                                        }}
                                    >
                                        {mostrarFormPostulacion
                                            ? <><X size={18} /> Cancelar Postulación</>
                                            : <><Rocket size={18} /> Postularme a este Trabajo</>
                                        }
                                    </button>
                                )}

                                {mostrarFormPostulacion && (
                                    <form onSubmit={handlePostular} className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                                        <h3 className="font-black text-slate-800 mb-3 flex items-center gap-2">
                                            <MessageSquare size={16} className="text-orange-500" /> Tu propuesta al empleador
                                        </h3>
                                        <textarea
                                            value={mensaje}
                                            onChange={(e) => setMensaje(e.target.value)}
                                            className="w-full rounded-xl border border-slate-200 py-3 px-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm font-medium mb-3 transition-all"
                                            rows={4}
                                            placeholder="Preséntate y explica por qué eres el mejor candidato para este trabajo…"
                                            style={{ resize: 'none' }}
                                        />
                                        <div className="mb-4">
                                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                                <Tag size={12} className="text-orange-400" /> Precio propuesto (opcional)
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    step="1000"
                                                    value={precioPropuesto}
                                                    onChange={(e) => setPrecioPropuesto(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 py-3 pl-8 pr-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 text-sm font-medium transition-all"
                                                    placeholder="Ej: 150000"
                                                />
                                            </div>
                                            <p className="text-xs text-slate-400 mt-1">Ingresa el monto en COP que propones por este trabajo. Déjalo vacío si prefieres negociarlo en el chat.</p>
                                        </div>
                                        <button
                                            type="submit"
                                            className="px-6 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-md"
                                            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
                                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(249,115,22,0.5)'}
                                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                                        >
                                            Enviar Postulación
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Trabajo en proceso – transacción */}
                        {trabajo.estado === 'en_proceso' && usuario && transaccion && (() => {
                            const pa = postulaciones.find(p => p.estado === 'aceptada');
                            return (
                                <ConfirmacionTransaccion
                                    transaccion={transaccion}
                                    idUsuario={usuario.id_usuario}
                                    idEmpleador={trabajo.id_empleador}
                                    idTrabajador={pa?.id_trabajador}
                                    onActualizado={() => { cargarTrabajo(); cargarTransaccion(); }}
                                />
                            );
                        })()}

                        {/* Trabajo en proceso – sin transacción (empleador) */}
                        {trabajo.estado === 'en_proceso' && usuario && usuario.id_usuario === trabajo.id_empleador && !transaccion && (
                            <div className="rounded-2xl border-2 p-6" style={{ borderColor: '#fed7aa', background: 'linear-gradient(135deg,#fff7ed,#ffedd5)' }}>
                                <h3 className="font-black text-orange-900 flex items-center gap-2 mb-3">
                                    <Clock size={18} className="text-orange-500" /> Trabajo en Curso
                                </h3>
                                <p className="text-orange-800 text-sm mb-5 leading-relaxed">
                                    El trabajo está en progreso. Cuando realices el pago, crea la transacción para iniciar el proceso de confirmación.
                                </p>
                                <button
                                    id="btn-crear-transaccion"
                                    onClick={async () => {
                                        const token = localStorage.getItem("token");
                                        const pa = postulaciones.find(p => p.estado === 'aceptada');
                                        if (!pa) { Swal.fire('Atención', "No se encontró una postulación aceptada.", 'warning'); return; }
                                        let idAcuerdo = pa?.acuerdo?.id_acuerdo;
                                        if (!idAcuerdo) {
                                            try {
                                                const r = await fetch(`${API_URL}/api/acuerdos?id_trabajo=${trabajo.id_trabajo}&id_trabajador=${pa.id_trabajador}`, { headers: { Authorization: `Bearer ${token}` } });
                                                const d = await r.json();
                                                if (d.acuerdos?.length > 0) idAcuerdo = d.acuerdos[0].id_acuerdo;
                                            } catch (_) { }
                                        }
                                        if (!idAcuerdo) {
                                            try {
                                                const r = await fetch(`${API_URL}/api/acuerdos`, {
                                                    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                                    body: JSON.stringify({ id_trabajo: trabajo.id_trabajo, id_trabajador: pa.id_trabajador, tipo_pago: trabajo.tipo_pago, valor_acordado: trabajo.monto_pago, detalle_trueque: trabajo.descripcion_trueque })
                                                });
                                                const d = await r.json();
                                                if (r.ok && d.acuerdo) idAcuerdo = d.acuerdo.id_acuerdo;
                                                else { Swal.fire('Error', "No se pudo crear el acuerdo.", 'error'); return; }
                                            } catch (_) { Swal.fire('Error', "Error de conexión al crear el acuerdo.", 'error'); return; }
                                        }
                                        try {
                                            const r = await fetch(`${API_URL}/api/transacciones`, {
                                                method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                                                body: JSON.stringify({ id_acuerdo: idAcuerdo, tipo_pago: trabajo.tipo_pago })
                                            });
                                            if (r.ok) { await cargarPostulaciones(); await cargarTransaccion(); }
                                            else { const d = await r.json(); Swal.fire('Error', `Error: ${d.error}`, 'error'); }
                                        } catch (ex) { Swal.fire('Error', "Error de conexión", 'error'); }
                                    }}
                                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm transition-all shadow-md"
                                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
                                    onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(249,115,22,0.5)'}
                                    onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                                >
                                    🧾 Iniciar Proceso de Pago
                                </button>
                            </div>
                        )}

                        {/* Trabajo en proceso – sin transacción (trabajador) */}
                        {trabajo.estado === 'en_proceso' && usuario && usuario.id_usuario !== trabajo.id_empleador && !transaccion && (
                            <div className="rounded-2xl border-2 p-5" style={{ borderColor: '#bfdbfe', background: 'linear-gradient(135deg,#eff6ff,#dbeafe)' }}>
                                <h3 className="font-black text-blue-800 flex items-center gap-2 mb-2">
                                    <Clock size={16} className="text-blue-500" /> Trabajo en Progreso
                                </h3>
                                <p className="text-blue-700 text-sm">
                                    El empleador aún no ha iniciado el proceso de pago. Recibirás una notificación cuando esté listo para confirmar.
                                </p>
                            </div>
                        )}

                        {/* Postulaciones */}
                        {postulaciones.length > 0 && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
                                <div className="flex items-center gap-3 mb-5">
                                    <ClipboardList size={20} className="text-orange-500" />
                                    <h2 className="text-lg font-black text-slate-800">Postulaciones</h2>
                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
                                        {postulaciones.length}
                                    </span>
                                </div>
                                <div className="space-y-4">
                                    {postulaciones.map((post) => {
                                        const estadoPost = post.estado === 'aceptada'
                                            ? { label: 'Aceptada', bg: '#dcfce7', color: '#15803d', border: '#bbf7d0' }
                                            : post.estado === 'rechazada'
                                                ? { label: 'Rechazada', bg: '#fee2e2', color: '#dc2626', border: '#fecaca' }
                                                : { label: 'Pendiente', bg: '#fefce8', color: '#854d0e', border: '#fde68a' };
                                        return (
                                            <div
                                                key={post.id_postulacion}
                                                className="rounded-xl border-2 p-5 transition-all"
                                                style={{ borderColor: post.estado === 'aceptada' ? '#bbf7d0' : '#e2e8f0', background: post.estado === 'aceptada' ? '#f0fdf4' : '#fafafa' }}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="flex items-center gap-3">
                                                        {/* Avatar */}
                                                        <Link to={`/trabajador/${post.trabajador?.id_usuario}`} className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0 hover:opacity-80 transition-opacity"
                                                            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                                                            {post.trabajador?.nombre?.[0]}{post.trabajador?.apellido?.[0]}
                                                        </Link>
                                                        <div>
                                                            <Link to={`/trabajador/${post.trabajador?.id_usuario}`} className="font-bold text-slate-800 text-sm hover:text-orange-600 transition-colors">{post.trabajador?.nombre} {post.trabajador?.apellido}</Link>
                                                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                                                <Calendar size={11} />
                                                                {new Date(post.fecha_postulacion).toLocaleDateString("es-CO", { year: 'numeric', month: 'short', day: 'numeric' })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {post.precio_propuesto && (
                                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
                                                                <Tag size={10} /> ${parseFloat(post.precio_propuesto).toLocaleString('es-CO')}
                                                            </span>
                                                        )}
                                                        <span className="px-3 py-1 rounded-full text-xs font-bold border" style={{ background: estadoPost.bg, color: estadoPost.color, borderColor: estadoPost.border }}>
                                                            {estadoPost.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Mensaje */}
                                                {post.mensaje && (
                                                    <div className="mt-3 pl-14">
                                                        <div className="bg-white rounded-xl p-3.5 border border-slate-100 text-sm text-slate-600 italic leading-relaxed" style={{ borderLeft: '3px solid #f97316' }}>
                                                            "{post.mensaje}"
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Acciones de la postulación */}
                                                <div className="mt-3 pl-14 flex flex-wrap gap-2">
                                                    {/* Ver Perfil */}
                                                    <button
                                                        onClick={() => { setTrabajadorSeleccionado(post.trabajador); setModalPerfilOpen(true); }}
                                                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                        style={{ background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }}
                                                        onMouseEnter={e => e.currentTarget.style.background = '#ffedd5'}
                                                        onMouseLeave={e => e.currentTarget.style.background = '#fff7ed'}
                                                    >
                                                        <User size={13} /> Ver Perfil
                                                    </button>

                                                    {/* Chatear (empleador) */}
                                                    {usuario && trabajo && usuario.id_usuario === trabajo.id_empleador && (
                                                        <button
                                                            onClick={() => abrirChat({ id_trabajador: post.trabajador.id_usuario, id_empleador: usuario.id_usuario, id_trabajo: trabajo.id_trabajo, trabajador: post.trabajador, empleador: usuario })}
                                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                                                            style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}
                                                            onMouseEnter={e => e.currentTarget.style.background = '#e2e8f0'}
                                                            onMouseLeave={e => e.currentTarget.style.background = '#f1f5f9'}
                                                        >
                                                            <MessageSquare size={13} /> Chatear
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Aceptar / Rechazar (empleador, pendiente) */}
                                                {usuario && trabajo && usuario.id_usuario === trabajo.id_empleador && post.estado === 'pendiente' && (
                                                    <div className="mt-4 pt-4 border-t border-slate-100 flex gap-3">
                                                        <button
                                                            onClick={() => handleGestionarPostulacion(post.id_postulacion, 'aceptar')}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
                                                            style={{ background: 'linear-gradient(135deg,#16a34a,#15803d)' }}
                                                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(22,163,74,0.4)'}
                                                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                                                        >
                                                            <CheckCircle size={16} /> Aceptar
                                                        </button>
                                                        <button
                                                            onClick={() => handleGestionarPostulacion(post.id_postulacion, 'rechazar')}
                                                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold text-sm transition-all"
                                                            style={{ background: 'linear-gradient(135deg,#dc2626,#b91c1c)' }}
                                                            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px -2px rgba(220,38,38,0.4)'}
                                                            onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
                                                        >
                                                            <X size={16} /> Rechazar
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Right Column (Sidebar) ── */}
                    <div className="lg:col-span-1 space-y-4">

                        {/* Pago */}
                        <div className="rounded-2xl shadow-sm overflow-hidden" style={{ background: 'linear-gradient(135deg,#fff7ed,#ffedd5)', border: '2px solid #fed7aa' }}>
                            <div className="px-6 py-5">
                                <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">Compensación</p>
                                <p className="text-3xl font-black text-orange-700">
                                    {trabajo.tipo_pago === "dinero" ? formatearPrecio(trabajo.monto_pago) : "Trueque"}
                                </p>
                                {trabajo.tipo_pago === "trueque" && trabajo.descripcion_trueque && (
                                    <p className="text-sm text-orange-800 mt-2 leading-relaxed bg-white/60 rounded-xl px-3 py-2">
                                        {trabajo.descripcion_trueque}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Ubicación */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <MapPin size={12} className="text-orange-400" /> Ubicación
                            </p>
                            <p className="font-bold text-slate-800 text-sm">{trabajo.ubicacion}</p>
                        </div>

                        {/* Fecha */}
                        {trabajo.fecha_estimada && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Calendar size={12} className="text-orange-400" /> Fecha Estimada
                                </p>
                                <p className="font-bold text-slate-800 text-sm">{formatearFecha(trabajo.fecha_estimada)}</p>
                            </div>
                        )}

                        {/* Empleador */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <User size={12} className="text-orange-400" /> Publicado por
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                                    {trabajo.empleador?.nombre?.[0]}{trabajo.empleador?.apellido?.[0]}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{trabajo.empleador?.nombre} {trabajo.empleador?.apellido}</p>
                                    <p className="text-xs text-slate-400">Empleador</p>
                                </div>
                            </div>
                        </div>

                        {/* Publicado hace */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Publicado</p>
                            <p className="font-bold text-slate-600 text-sm">{formatearFecha(trabajo.fecha_creacion)}</p>
                        </div>

                        {/* Acciones del Empleador */}
                        {usuario && trabajo && usuario.id_usuario === trabajo.id_empleador && trabajo.estado === 'publicado' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Briefcase size={12} className="text-orange-400" /> Gestionar Trabajo
                                </p>
                                <div className="flex flex-col gap-3">
                                    <button
                                        onClick={() => setActionModal({ isOpen: true, type: 'cancelar' })}
                                        className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm transition-all shadow-sm"
                                        onMouseEnter={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.color = '#0f172a'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#64748b'; }}
                                    >
                                        <XCircle size={16} /> Cancelar Trabajo
                                    </button>
                                    <button
                                        onClick={() => setActionModal({ isOpen: true, type: 'eliminar' })}
                                        className="w-full flex justify-center items-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 font-bold text-sm transition-all shadow-sm"
                                        onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2'; e.currentTarget.style.color = '#dc2626'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#ef4444'; }}
                                    >
                                        <Trash2 size={16} /> Eliminar Permanente
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modales */}
            <ModalCalificar
                isOpen={modalCalificarOpen}
                onClose={() => setModalCalificarOpen(false)}
                onSubmit={handleCalificar}
                usuarioReceptor={usuarioAReceptar}
            />
            {modalPerfilOpen && trabajadorSeleccionado && (
                <ModalPerfilTrabajador
                    trabajador={trabajadorSeleccionado}
                    onClose={() => { setModalPerfilOpen(false); setTrabajadorSeleccionado(null); }}
                />
            )}

            {/* Modal: Debes iniciar sesión para postularte */}
            {showLoginModal && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
                    }}
                    onClick={() => setShowLoginModal(false)}
                >
                    <div
                        style={{
                            background: '#fff', borderRadius: '24px', padding: '2rem',
                            width: '100%', maxWidth: '380px',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                            animation: 'fadeInUp 0.3s ease-out forwards',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.25rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '16px',
                                background: 'linear-gradient(135deg, #fff7ed, #ffedd5)',
                                color: '#ea580c',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <AlertCircle size={24} />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                Inicia sesión
                            </h3>
                        </div>
                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                            Debes iniciar sesión para postularte a este trabajo.
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setShowLoginModal(false)}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', background: '#f1f5f9', cursor: 'pointer',
                                    color: '#475569', fontWeight: 700, fontSize: '0.95rem', border: 'none', fontFamily: 'inherit',
                                }}
                            >
                                Cerrar
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowLoginModal(false); navigate('/auth'); }}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #f97316, #ea580c)', color: '#fff',
                                    fontWeight: 700, fontSize: '0.95rem', border: 'none', fontFamily: 'inherit',
                                    boxShadow: '0 4px 14px -2px rgba(249,115,22,0.4)',
                                }}
                            >
                                Iniciar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Confirmación Acción Empleador */}
            {actionModal.isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
                }}>
                    <div style={{
                        background: '#fff', borderRadius: '24px', padding: '2rem',
                        width: '100%', maxWidth: '400px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                        animation: 'fadeInUp 0.3s ease-out forwards'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '1.5rem' }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '16px',
                                background: actionModal.type === 'eliminar' ? '#fef2f2' : '#fffbeb',
                                color: actionModal.type === 'eliminar' ? '#ef4444' : '#f59e0b',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                                    {actionModal.type === 'eliminar' ? '¿Eliminar trabajo?' : '¿Cancelar trabajo?'}
                                </h3>
                            </div>
                        </div>

                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '2rem' }}>
                            {actionModal.type === 'eliminar'
                                ? `Estás a punto de eliminar permanentemente "${trabajo?.titulo}". Esta acción borrará el registro de la base de datos y no se puede deshacer.`
                                : `Estás a punto de cancelar "${trabajo?.titulo}". Esto impedirá nuevas postulaciones.`}
                        </p>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setActionModal({ isOpen: false, type: null })}
                                disabled={actionLoading}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', background: '#f1f5f9', cursor: actionLoading ? 'not-allowed' : 'pointer',
                                    color: '#475569', fontWeight: 700, fontSize: '0.95rem', border: 'none', transition: 'background 0.2s'
                                }}
                                onMouseEnter={e => !actionLoading && (e.currentTarget.style.background = '#e2e8f0')}
                                onMouseLeave={e => !actionLoading && (e.currentTarget.style.background = '#f1f5f9')}
                            >
                                Volver
                            </button>
                            <button
                                onClick={confirmarAccion}
                                disabled={actionLoading}
                                style={{
                                    flex: 1, padding: '12px', borderRadius: '12px', cursor: actionLoading ? 'not-allowed' : 'pointer',
                                    background: actionModal.type === 'eliminar' ? '#ef4444' : '#f59e0b',
                                    color: '#fff', fontWeight: 700, fontSize: '0.95rem', border: 'none', transition: 'background 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center'
                                }}
                                onMouseEnter={e => !actionLoading && (e.currentTarget.style.background = actionModal.type === 'eliminar' ? '#dc2626' : '#d97706')}
                                onMouseLeave={e => !actionLoading && (e.currentTarget.style.background = actionModal.type === 'eliminar' ? '#ef4444' : '#f59e0b')}
                            >
                                {actionLoading ? (
                                    <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                ) : (
                                    actionModal.type === 'eliminar' ? 'Sí, eliminar' : 'Sí, cancelar'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Detalles;
