import React, { useState } from "react";
import API_URL from '../../config/api';
import { Camera, User, Mail, Phone, Save, X } from 'lucide-react';

function FormularioPerfil({ usuario, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || "",
        foto_perfil: null,
    });
    const [preview, setPreview] = useState(usuario.foto_perfil || "");
    const [uploading, setUploading] = useState(false);

    const handleActualizar = async (e) => {
        e.preventDefault();
        setUploading(true);
        const token = localStorage.getItem("token");

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('apellido', formData.apellido);
        data.append('correo', formData.correo);
        data.append('telefono', formData.telefono);
        if (formData.foto_perfil) {
            data.append('foto_perfil', formData.foto_perfil);
        }

        try {
            const respuesta = await fetch(
                `${API_URL}/api/usuarios/${usuario.id_usuario}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            );

            const result = await respuesta.json();

            if (respuesta.ok) {
                alert("Perfil actualizado exitosamente");
                onSuccess();
            } else {
                alert(`Error: ${result.error || result.message}`);
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error de conexión con el servidor");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, foto_perfil: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleActualizar} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Header del formulario */}
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                        <User size={22} />
                    </div>
                    Editar Información Personal
                </h3>
                <p style={{ color: '#64748b', fontSize: '1rem' }}>Actualiza tus datos para mantener tu perfil al día</p>
            </div>

            {/* Preview de la foto con diseño mejorado */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <div style={{
                        width: '140px', height: '140px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        padding: '4px', position: 'relative',
                        boxShadow: '0 10px 25px -5px rgba(234,88,12,0.4)',
                        transition: 'transform 0.3s ease'
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img
                            src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nombre)}+${encodeURIComponent(formData.apellido)}&background=random`}
                            alt="Preview"
                            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', background: '#fff' }}
                        />
                    </div>
                    <label
                        htmlFor="file-upload"
                        style={{
                            position: 'absolute', bottom: '0', right: '0',
                            background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                            color: '#fff', padding: '12px', borderRadius: '50%', cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(234,88,12,0.4)',
                            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.1)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(234,88,12,0.6)'; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px rgba(234,88,12,0.4)'; }}
                    >
                        <Camera size={20} />
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Campos del formulario */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={16} color="var(--slate-500)" /> Nombre
                    </label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                        style={{
                            width: '100%', boxSizing: 'border-box', borderRadius: '12px', border: '1.5px solid var(--slate-200)',
                            padding: '12px 14px', fontSize: '1rem', color: 'var(--slate-900)',
                            transition: 'all 0.2s', outline: 'none', fontFamily: 'var(--font-sans)',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = 'none'; }}
                        required
                    />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={16} color="var(--slate-500)" /> Apellido
                    </label>
                    <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                        style={{
                            width: '100%', boxSizing: 'border-box', borderRadius: '12px', border: '1.5px solid var(--slate-200)',
                            padding: '12px 14px', fontSize: '1rem', color: 'var(--slate-900)',
                            transition: 'all 0.2s', outline: 'none', fontFamily: 'var(--font-sans)',
                        }}
                        onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                        onBlur={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = 'none'; }}
                        required
                    />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Mail size={16} color="var(--slate-500)" /> Correo electrónico
                </label>
                <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    style={{
                        width: '100%', boxSizing: 'border-box', borderRadius: '12px', border: '1.5px solid var(--slate-200)',
                        padding: '12px 14px', fontSize: '1rem', color: 'var(--slate-900)',
                        transition: 'all 0.2s', outline: 'none', fontFamily: 'var(--font-sans)',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = 'none'; }}
                    required
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--slate-700)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Phone size={16} color="var(--slate-500)" /> Teléfono
                </label>
                <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    style={{
                        width: '100%', boxSizing: 'border-box', borderRadius: '12px', border: '1.5px solid var(--slate-200)',
                        padding: '12px 14px', fontSize: '1rem', color: 'var(--slate-900)',
                        transition: 'all 0.2s', outline: 'none', fontFamily: 'var(--font-sans)',
                    }}
                    placeholder="Ej: +57 300 123 4567"
                    onFocus={e => { e.currentTarget.style.borderColor = 'var(--orange-500)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249,115,22,0.12)'; }}
                    onBlur={e => { e.currentTarget.style.borderColor = 'var(--slate-200)'; e.currentTarget.style.boxShadow = 'none'; }}
                />
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '1rem' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={uploading}
                    style={{
                        flex: '1', padding: '16px', borderRadius: '16px',
                        background: '#f1f5f9', color: '#475569', fontWeight: 700, fontSize: '1rem',
                        border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                    onMouseEnter={e => { if (!uploading) e.currentTarget.style.background = '#e2e8f0'; }}
                    onMouseLeave={e => { if (!uploading) e.currentTarget.style.background = '#f1f5f9'; }}
                >
                    <X size={20} /> Cancelar
                </button>
                <button
                    type="submit"
                    disabled={uploading}
                    style={{
                        flex: '2', padding: '16px', borderRadius: '16px',
                        background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                        color: '#fff', fontWeight: 700, fontSize: '1rem',
                        border: 'none', cursor: uploading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 14px -2px rgba(249,115,22,0.4)',
                        transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                        opacity: uploading ? 0.7 : 1
                    }}
                    onMouseEnter={e => { if (!uploading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(249,115,22,0.5)'; } }}
                    onMouseLeave={e => { if (!uploading) { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 14px -2px rgba(249,115,22,0.4)'; } }}
                >
                    <Save size={20} />
                    {uploading ? "Guardando cambios..." : "Guardar Cambios"}
                </button>
            </div>
        </form>
    );
}

export default FormularioPerfil;
