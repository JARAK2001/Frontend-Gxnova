import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Camera, CreditCard, CheckCircle, RefreshCw, AlertCircle } from "lucide-react";
import API_URL from "../../config/api";
import Swal from "sweetalert2";

/**
 * Paso 3 del Registro: Verificación de Identidad
 * Se muestra al usuario después de que verifica su correo electrónico.
 * Llama a POST /api/auth/verificar-identidad con la selfie.
 */
function IdentityVerification({ correo, onVerificado }) {
    const navigate = useNavigate();
    const [selfie, setSelfie] = useState(null);
    const [fotoPerfil, setFotoPerfil] = useState(null);
    const [previewSelfie, setPreviewSelfie] = useState(null);
    const [previewPerfil, setPreviewPerfil] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const selfieRef = useRef();
    const perfilRef = useRef();

    const handleFile = (file, setter, previewSetter) => {
        if (!file) return;
        setter(file);
        const reader = new FileReader();
        reader.onloadend = () => previewSetter(reader.result);
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selfie) {
            setError("La selfie es obligatoria.");
            return;
        }

        setIsLoading(true);
        Swal.fire({
            title: "Verificando identidad...",
            text: "Nuestro sistema de IA está comparando tu rostro. Esto puede tardar unos segundos.",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            const formData = new FormData();
            formData.append("correo", correo);
            formData.append("selfie", selfie);
            if (fotoPerfil) formData.append("foto_perfil", fotoPerfil);

            const res = await fetch(`${API_URL}/api/auth/verificar-identidad`, {
                method: "POST",
                body: formData
            });
            const data = await res.json();

            Swal.close();

            if (res.ok) {
                await Swal.fire({
                    icon: "success",
                    title: "¡Identidad verificada!",
                    text: "Tu cuenta está lista. ¡Bienvenido a Gxnova!",
                    confirmButtonColor: "#16a34a"
                });
                if (onVerificado) onVerificado(data);
            } else {
                setError(data.message || "Error al verificar la identidad.");
            }
        } catch {
            Swal.close();
            setError("No se pudo conectar con el servidor. Intenta de nuevo.");
        } finally {
            setIsLoading(false);
        }
    };

    const FileCard = ({ icon: Icon, title, subtitle, preview, onSelect, inputRef, accept, capture }) => (
        <div
            onClick={() => inputRef.current?.click()}
            style={{
                border: preview ? "2px solid #16a34a" : "2px dashed #d1d5db",
                borderRadius: "14px",
                padding: preview ? "8px" : "20px 12px",
                cursor: "pointer",
                textAlign: "center",
                background: preview ? "#f0fdf4" : "#f9fafb",
                transition: "all 0.2s",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept={accept || "image/*"}
                capture={capture}
                style={{ display: "none" }}
                onChange={(e) => handleFile(e.target.files[0], onSelect[0], onSelect[1])}
            />
            {preview ? (
                <>
                    <img
                        src={preview}
                        alt={title}
                        style={{ width: "100%", height: "120px", objectFit: "cover", borderRadius: "10px" }}
                    />
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginTop: "6px" }}>
                        <CheckCircle size={14} color="#16a34a" />
                        <span style={{ fontSize: "0.75rem", color: "#15803d", fontWeight: 600 }}>Cargado</span>
                        <RefreshCw size={12} color="#6b7280" style={{ marginLeft: "4px" }} />
                    </div>
                </>
            ) : (
                <>
                    <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px" }}>
                        <Icon size={22} color="#6b7280" />
                    </div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", margin: "0 0 2px" }}>{title}</p>
                    <p style={{ fontSize: "0.72rem", color: "#9ca3af", margin: 0 }}>{subtitle}</p>
                </>
            )}
        </div>
    );

    return (
        <div>
            {/* Header */}
            <div 
                onClick={() => navigate("/")}
                style={{ textAlign: "center", marginBottom: "20px", cursor: "pointer" }}
            >
                <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px", boxShadow: "0 8px 20px rgba(249,115,22,0.3)" }}>
                    <Shield size={26} color="#fff" />
                </div>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0f172a", margin: "0 0 4px" }}>
                    Verificación de Identidad
                </h2>
                <p style={{ fontSize: "0.82rem", color: "#64748b", margin: 0 }}>
                    Paso 3 de 3 · Tomamos esto muy en serio para proteger la comunidad
                </p>
            </div>

            {/* Progress bar */}
            <div style={{ height: "4px", background: "#f1f5f9", borderRadius: "99px", marginBottom: "20px" }}>
                <div style={{ height: "100%", width: "100%", background: "linear-gradient(90deg, #f97316, #ea580c)", borderRadius: "99px" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {/* Fotos requeridas */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                    <FileCard
                        icon={Camera}
                        title="Selfie"
                        subtitle="Foto de tu rostro visible"
                        preview={previewSelfie}
                        onSelect={[setSelfie, setPreviewSelfie]}
                        inputRef={selfieRef}
                        accept="image/*"
                        capture="user"
                    />
                </div>

                {/* Foto de perfil opcional */}
                <div>
                    <p style={{ fontSize: "0.78rem", color: "#94a3b8", marginBottom: "6px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                        Opcional
                    </p>
                    <FileCard
                        icon={Camera}
                        title="Foto de Perfil"
                        subtitle="La que verán otros usuarios"
                        preview={previewPerfil}
                        onSelect={[setFotoPerfil, setPreviewPerfil]}
                        inputRef={perfilRef}
                        accept="image/*"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div style={{ background: "#fef2f2", border: "1.5px solid #fecaca", borderRadius: "10px", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <AlertCircle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: "1px" }} />
                        <span style={{ fontSize: "0.84rem", color: "#b91c1c", lineHeight: 1.5 }}>{error}</span>
                    </div>
                )}

                {/* Nota de seguridad */}
                <div style={{ background: "#f0f9ff", borderRadius: "10px", padding: "10px 14px", fontSize: "0.78rem", color: "#0369a1", display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <Shield size={14} style={{ flexShrink: 0, marginTop: "1px" }} color="#0284c7" />
                    <span>
                        Tus fotos son procesadas por un sistema de IA local y encriptadas en Cloudinary. Nunca se comparten con terceros.
                    </span>
                </div>

                <button
                    type="submit"
                    disabled={isLoading || !selfie}
                    style={{
                        width: "100%",
                        padding: "11px",
                        borderRadius: "10px",
                        background: (!selfie) ? "#e5e7eb" : "linear-gradient(135deg, #f97316, #ea580c)",
                        color: (!selfie) ? "#9ca3af" : "#fff",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        border: "none",
                        cursor: (!selfie) ? "not-allowed" : "pointer",
                        transition: "all 0.2s",
                        boxShadow: (!selfie) ? "none" : "0 4px 14px rgba(249,115,22,0.35)"
                    }}
                >
                    {isLoading ? "Verificando..." : "Verificar Identidad y Entrar"}
                </button>
            </form>
        </div>
    );
}

export default IdentityVerification;
