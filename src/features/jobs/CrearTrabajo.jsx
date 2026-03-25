import React, { useState, useEffect, useRef } from "react";
import API_URL from '../../config/api';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Encabezado from "../../layouts/Encabezado";
import { useThemeTokens } from '../../hooks/useThemeTokens';
import {
    MapPin, DollarSign, ArrowRight, Image as ImageIcon,
    Briefcase, Tag, FileText, Calendar, Navigation,
    X, CheckCircle, Loader2, RefreshCw
} from 'lucide-react';
import Swal from 'sweetalert2';

function CrearTrabajo() {
    const navigate = useNavigate();
    const t = useThemeTokens();
    const { token } = useAuth();
    const fileInputRef = useRef(null);

    const [categorias, setCategorias] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [fotoPreview, setFotoPreview] = useState(null);
    const [formData, setFormData] = useState({
        id_categoria: "",
        titulo: "",
        descripcion: "",
        tipo_pago: "dinero",
        monto_pago: "",
        descripcion_trueque: "",
        ubicacion: "",
        latitud: "",
        longitud: "",
        fecha_estimada: "",
    });
    const [foto, setFoto] = useState(null);

    useEffect(() => {
        if (!token) { navigate("/auth"); return; }
        cargarCategorias();
    }, []);

    const obtenerUbicacionActual = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setFormData(prev => ({ ...prev, latitud: pos.coords.latitude, longitud: pos.coords.longitude })),
                () => Swal.fire('Error', "No se pudo obtener la ubicación. Por favor ingrésala manualmente.", 'error')
            );
        } else {
            Swal.fire('Error', "Tu navegador no soporta geolocalización.", 'error');
        }
    };

    const cargarCategorias = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categorias`);
            const data = await res.json();
            if (data.categorias) setCategorias(data.categorias);
        } catch (err) {
            console.error("Error al cargar categorías:", err);
        }
    };

    const handleFoto = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setFoto(file);
        const reader = new FileReader();
        reader.onloadend = () => setFotoPreview(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.id_categoria || !formData.titulo || !formData.descripcion || !formData.ubicacion) {
            Swal.fire('Atención', "Por favor completa todos los campos obligatorios", 'warning');
            return;
        }
        if (formData.tipo_pago === "dinero" && !formData.monto_pago) {
            Swal.fire('Atención', "El monto es obligatorio cuando el tipo de pago es dinero", 'warning');
            return;
        }
        if (formData.tipo_pago === "trueque" && !formData.descripcion_trueque) {
            Swal.fire('Atención', "La descripción del trueque es obligatoria", 'warning');
            return;
        }

        setSubmitting(true);
        try {
            const fd = new FormData();
            fd.append("id_categoria", parseInt(formData.id_categoria));
            fd.append("titulo", formData.titulo);
            fd.append("descripcion", formData.descripcion);
            fd.append("tipo_pago", formData.tipo_pago);
            fd.append("ubicacion", formData.ubicacion);
            if (formData.latitud) fd.append("latitud", parseFloat(formData.latitud));
            if (formData.longitud) fd.append("longitud", parseFloat(formData.longitud));
            if (formData.tipo_pago === "dinero") {
                fd.append("monto_pago", parseFloat(formData.monto_pago));
            } else {
                fd.append("descripcion_trueque", formData.descripcion_trueque);
            }
            if (formData.fecha_estimada) fd.append("fecha_estimada", new Date(formData.fecha_estimada).toISOString());
            if (foto) fd.append("foto", foto);

            const res = await fetch(`${API_URL}/api/trabajos`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: fd,
            });
            const data = await res.json();
            if (res.ok) {
                Swal.fire('¡Éxito!', 'Trabajo publicado correctamente', 'success').then(() => {
                    navigate(`/detalles/${data.trabajo.id_trabajo}`);
                });
            } else {
                Swal.fire('Error', `Error: ${data.error || data.message}`, 'error');
            }
        } catch (err) {
            console.error("Error al crear trabajo:", err);
            Swal.fire('Error', "Error de conexión con el servidor", 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = "w-full rounded-xl border py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400 transition-all text-sm font-medium shadow-sm " + (t.darkMode ? "placeholder-slate-500" : "placeholder-slate-400");
    const labelClass = "block text-sm font-bold mb-1.5";
    
    const inputStyle = {
        background: t.darkMode ? t.cardBg2 : '#fff',
        borderColor: t.cardBorder,
        color: t.textPrimary
    };

    return (
        <div className="min-h-screen" style={{ background: t.pageBg, transition: 'background 0.3s' }}>
            <Encabezado />

            {/* Hero Banner */}
            <div style={{ background: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)', position: 'relative', overflow: 'hidden' }}>
                {/* decorative circles */}
                <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
                <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
                <div className="container mx-auto px-4 py-10 max-w-3xl relative">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-bold text-orange-900" style={{ background: 'rgba(255,255,255,0.25)' }}>
                            Empleador
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-white leading-tight mb-2">
                        Publica un Trabajo
                    </h1>
                    <p className="text-orange-100 text-base font-medium">
                        Encuentra al profesional ideal para tu proyecto en minutos
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Sección 1: Información Básica */}
                    <div className="rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300" style={{ background: t.cardBg, borderColor: t.cardBorder }}>
                        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: t.cardBorder }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                                <Briefcase size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-black text-sm" style={{ color: t.textPrimary }}>Información del Trabajo</h2>
                                <p className="text-xs" style={{ color: t.textSecondary }}>Cuéntanos qué necesitas</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Categoría */}
                            <div>
                                <label className={labelClass} style={{ color: t.textPrimary }}>
                                    <Tag size={13} className="inline mr-1.5 text-orange-500" />
                                    Categoría <span className="text-orange-500">*</span>
                                </label>
                                <select
                                    value={formData.id_categoria}
                                    onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                                    className={inputClass}
                                    style={inputStyle}
                                    required
                                >
                                    <option value="">Selecciona una categoría…</option>
                                    {categorias.map((cat) => (
                                        <option key={cat.id_categoria} value={cat.id_categoria}>{cat.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Título */}
                            <div>
                                <label className={labelClass} style={{ color: t.textPrimary }}>
                                    <FileText size={13} className="inline mr-1.5 text-orange-500" />
                                    Título <span className="text-orange-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.titulo}
                                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                                    className={inputClass}
                                    style={inputStyle}
                                    placeholder="Ej: Necesito plomero para arreglar tubería"
                                    required
                                />
                            </div>

                            {/* Descripción */}
                            <div>
                                <label className={labelClass} style={{ color: t.textPrimary }}>
                                    <FileText size={13} className="inline mr-1.5 text-orange-500" />
                                    Descripción <span className="text-orange-500">*</span>
                                </label>
                                <textarea
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    className={inputClass}
                                    style={{ ...inputStyle, resize: 'vertical' }}
                                />
                                <p className="text-xs text-slate-400 mt-1">Una buena descripción atrae mejores trabajadores</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Tipo de Pago */}
                    <div className="rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300" style={{ background: t.cardBg, borderColor: t.cardBorder }}>
                        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: t.cardBorder }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                                <DollarSign size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-black text-sm" style={{ color: t.textPrimary }}>Forma de Pago</h2>
                                <p className="text-xs" style={{ color: t.textSecondary }}>¿Cómo compensarás al trabajador?</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Tarjetas de Tipo de Pago */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { value: 'dinero', icon: '💵', label: 'Dinero', desc: 'Pago en efectivo o transferencia' },
                                    { value: 'trueque', icon: '🤝', label: 'Trueque', desc: 'Intercambio de servicios o bienes' },
                                ].map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, tipo_pago: opt.value })}
                                        className="p-4 rounded-xl border-2 text-left transition-all cursor-pointer"
                                        style={formData.tipo_pago === opt.value
                                            ? { borderColor: '#f97316', background: t.darkMode ? `${t.orange}15` : 'linear-gradient(135deg,#fff7ed,#ffedd5)', boxShadow: '0 0 0 3px rgba(249,115,22,0.15)' }
                                            : { borderColor: t.cardBorder, background: t.darkMode ? t.cardBg2 : '#f8fafc' }
                                        }
                                    >
                                        <div className="text-2xl mb-2">{opt.icon}</div>
                                        <p className="font-bold text-sm" style={{ color: t.textPrimary }}>{opt.label}</p>
                                        <p className="text-xs mt-0.5" style={{ color: t.textSecondary }}>{opt.desc}</p>
                                        {formData.tipo_pago === opt.value && (
                                            <div className="mt-2">
                                                <CheckCircle size={14} className="text-orange-500" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Campo según tipo de pago */}
                            {formData.tipo_pago === "dinero" ? (
                                <div>
                                    <label className={labelClass} style={{ color: t.textPrimary }}>
                                        Monto (COP) <span className="text-orange-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-sm" style={{ color: t.textSecondary }}>$</span>
                                        <input
                                            type="number"
                                            value={formData.monto_pago}
                                            onChange={(e) => setFormData({ ...formData, monto_pago: e.target.value })}
                                            className={inputClass + " pl-8"}
                                            style={inputStyle}
                                            placeholder="500.000"
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <p className="text-xs mt-1" style={{ color: t.textSecondary }}>Ingresa el valor en pesos colombianos</p>
                                </div>
                            ) : (
                                <div>
                                    <label className={labelClass} style={{ color: t.textPrimary }}>
                                        ¿Qué ofreces a cambio? <span className="text-orange-500">*</span>
                                    </label>
                                    <textarea
                                        value={formData.descripcion_trueque}
                                        onChange={(e) => setFormData({ ...formData, descripcion_trueque: e.target.value })}
                                        className={inputClass}
                                        style={{ ...inputStyle, resize: 'none' }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sección 3: Ubicación y Fecha */}
                    <div className="rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300" style={{ background: t.cardBg, borderColor: t.cardBorder }}>
                        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: t.cardBorder }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                                <MapPin size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-black text-sm" style={{ color: t.textPrimary }}>Ubicación y Fecha</h2>
                                <p className="text-xs" style={{ color: t.textSecondary }}>¿Dónde y cuándo se realiza el trabajo?</p>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Ubicación */}
                            <div>
                                <label className={labelClass}>
                                    Dirección o Ciudad <span className="text-orange-500">*</span>
                                </label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input
                                        type="text"
                                        value={formData.ubicacion}
                                        onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                                        className={inputClass + " pl-10"}
                                        placeholder="Ej: Bogotá, Chapinero"
                                        required
                                    />
                                </div>
                            </div>

                            {/* GPS */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className={labelClass} style={{ color: t.textPrimary }}>Latitud <span className="font-normal mx-1" style={{ color: t.textSecondary }}>(opcional)</span></label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.latitud}
                                        onChange={(e) => setFormData({ ...formData, latitud: e.target.value })}
                                        className={inputClass}
                                        style={inputStyle}
                                        placeholder="4.7110"
                                    />
                                </div>
                                <div>
                                    <label className={labelClass} style={{ color: t.textPrimary }}>Longitud <span className="font-normal mx-1" style={{ color: t.textSecondary }}>(opcional)</span></label>
                                    <input
                                        type="number"
                                        step="any"
                                        value={formData.longitud}
                                        onChange={(e) => setFormData({ ...formData, longitud: e.target.value })}
                                        className={inputClass}
                                        style={inputStyle}
                                        placeholder="-74.0721"
                                    />
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={obtenerUbicacionActual}
                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all"
                                style={{ borderColor: t.darkMode ? '#ea580c' : '#fed7aa', color: t.darkMode ? '#fdba74' : '#ea580c', background: t.darkMode ? 'transparent' : '#fff7ed' }}
                            >
                                <Navigation size={15} />
                                Usar mi ubicación actual (GPS)
                                {formData.latitud && formData.longitud && (
                                    <CheckCircle size={14} className="text-green-500 ml-1" />
                                )}
                            </button>

                            {/* Fecha */}
                            <div>
                                <label className={labelClass} style={{ color: t.textPrimary }}>
                                    <Calendar size={13} className="inline mr-1.5 text-orange-500" />
                                    Fecha Estimada <span className="font-normal mx-1" style={{ color: t.textSecondary }}>(opcional)</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.fecha_estimada}
                                    onChange={(e) => setFormData({ ...formData, fecha_estimada: e.target.value })}
                                    className={inputClass}
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Foto */}
                    <div className="rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300" style={{ background: t.cardBg, borderColor: t.cardBorder }}>
                        <div className="px-6 py-4 border-b flex items-center gap-3" style={{ borderColor: t.cardBorder }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                                <ImageIcon size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="font-black text-sm" style={{ color: t.textPrimary }}>Foto del Trabajo</h2>
                                <p className="text-xs" style={{ color: t.textSecondary }}>Una imagen dice más que mil palabras</p>
                            </div>
                        </div>
                        <div className="p-6">
                            {fotoPreview ? (
                                <div className="relative rounded-xl overflow-hidden border-2 border-orange-200">
                                    <img src={fotoPreview} alt="Preview" className="w-full object-cover max-h-64" />
                                    <button
                                        type="button"
                                        onClick={() => { setFoto(null); setFotoPreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                                        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors shadow-md"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="absolute bottom-3 left-3">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md transition-colors"
                                            style={{ background: t.cardBg, color: t.textPrimary }}
                                        >
                                            <RefreshCw size={12} /> Cambiar foto
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full border-2 border-dashed rounded-xl py-10 px-4 text-center transition-all"
                                    style={{ borderColor: t.cardBorder, background: t.darkMode ? t.cardBg2 : '#fffbf7' }}
                                >
                                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#fff7ed,#fed7aa)' }}>
                                        <ImageIcon size={22} className="text-orange-500" />
                                    </div>
                                    <p className="font-bold text-sm" style={{ color: t.textPrimary }}>Haz clic para subir una foto</p>
                                    <p className="text-xs mt-1" style={{ color: t.textSecondary }}>PNG, JPG, WEBP — máx. 5 MB</p>
                                </button>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFoto}
                                className="hidden"
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex flex-col sm:flex-row gap-3 pb-10">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 flex items-center justify-center gap-2 py-4 px-8 rounded-2xl text-white font-black text-base transition-all"
                            style={{
                                background: submitting ? '#fdba74' : 'linear-gradient(135deg,#f97316,#ea580c)',
                                boxShadow: submitting ? 'none' : '0 8px 24px -4px rgba(249,115,22,0.5)',
                            }}
                            onMouseEnter={e => { if (!submitting) e.currentTarget.style.boxShadow = '0 12px 32px -4px rgba(249,115,22,0.6)'; }}
                            onMouseLeave={e => e.currentTarget.style.boxShadow = submitting ? 'none' : '0 8px 24px -4px rgba(249,115,22,0.5)'}
                        >
                            {submitting ? (
                                <><Loader2 size={18} className="animate-spin" /> Publicando…</>
                            ) : (
                                <><ArrowRight size={18} /> Publicar Trabajo</>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate("/servicios")}
                            className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm border transition-all"
                            style={{ background: t.cardBg, borderColor: t.cardBorder, color: t.textSecondary }}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CrearTrabajo;
