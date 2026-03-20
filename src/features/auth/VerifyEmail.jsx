import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config/api";

const RESEND_COOLDOWN = 60; // segundos

function VerifyEmail({ correo, onVerificado }) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [digits, setDigits] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
    const [resending, setResending] = useState(false);
    const inputs = useRef([]);

    // Cuenta regresiva para el botón de reenvío
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => setCountdown(c => c - 1), 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const handleChange = (index, value) => {
        if (!/^\d?$/.test(value)) return;
        const next = [...digits];
        next[index] = value;
        setDigits(next);
        setError(null);
        if (value && index < 5) inputs.current[index + 1]?.focus();
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !digits[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted) return;
        const next = [...digits];
        for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
        setDigits(next);
        inputs.current[Math.min(pasted.length, 5)]?.focus();
    };

    const handleVerify = async () => {
        const codigo = digits.join("");
        if (codigo.length < 6) {
            setError("Ingresa los 6 dígitos del código.");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/verificar-correo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, codigo }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Código incorrecto.");
            setSuccess("¡Correo verificado! Accediendo a tu cuenta...");
            if (data.token && data.usuario) login(data.token, data.usuario);
            setTimeout(() => onVerificado && onVerificado(data), 1500);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (countdown > 0 || resending) return;
        setResending(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/auth/reenviar-codigo`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setCountdown(RESEND_COOLDOWN);
            setDigits(["", "", "", "", "", ""]);
            inputs.current[0]?.focus();
        } catch (err) {
            setError(err.message);
        } finally {
            setResending(false);
        }
    };

    // Paleta naranja/glassmorphism (Light)
    const glass = {
        background: "#fff",
        borderRadius: "24px",
        boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)",
        border: "1.5px solid #f1f5f9",
    };

    return (
        <div style={{
            minHeight: "100vh",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "1.5rem",
            background: "linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f8fafc 100%)",
            position: "relative", overflow: "hidden",
        }}>
            {/* Orbes decorativos */}
            <div style={{ position: "absolute", top: "-100px", right: "-80px", width: "450px", height: "450px", borderRadius: "50%", background: "radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "-80px", left: "-60px", width: "380px", height: "380px", borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

            <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>

                {/* Ícono superior */}
                <div 
                    onClick={() => navigate("/")}
                    style={{ textAlign: "center", marginBottom: "1.5rem", cursor: "pointer" }}
                >
                    <div style={{
                        width: "68px", height: "68px", margin: "0 auto 16px",
                        background: "linear-gradient(135deg, #ea580c, #f97316)",
                        borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 8px 24px rgba(234,88,12,0.5), 0 0 0 1px rgba(249,115,22,0.3)",
                        fontSize: "32px",
                    }}>🔐</div>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--slate-900)", letterSpacing: "-0.03em", margin: "0 0 6px" }}>
                        Verifica tu correo
                    </h1>
                    <p style={{ fontSize: "0.875rem", color: "var(--slate-500)", margin: 0 }}>
                        Enviamos un código a:
                    </p>
                    <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fb923c", margin: "4px 0 0" }}>
                        {correo}
                    </p>
                </div>

                {/* Card glassmorphism */}
                <div style={{ ...glass, padding: "28px 32px" }}>

                    {/* Inputs de 6 dígitos */}
                    <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "24px" }}
                        onPaste={handlePaste}>
                        {digits.map((d, i) => (
                            <input
                                key={i}
                                ref={el => inputs.current[i] = el}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={d}
                                autoFocus={i === 0}
                                onChange={e => handleChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                style={{
                                    width: "48px", height: "56px",
                                    textAlign: "center",
                                    fontSize: "1.5rem", fontWeight: 800,
                                    color: d ? "var(--slate-800)" : "#94a3b8",
                                    background: d
                                        ? "rgba(249,115,22,0.05)"
                                        : "#f8fafc",
                                    border: d
                                        ? "2px solid rgba(249,115,22,0.5)"
                                        : "1.5px solid #e2e8f0",
                                    borderRadius: "14px",
                                    outline: "none",
                                    caretColor: "#f97316",
                                    transition: "all 0.2s ease",
                                    boxShadow: d ? "0 0 15px rgba(249,115,22,0.1)" : "none",
                                    fontFamily: "'Courier New', monospace",
                                    cursor: "text",
                                }}
                            />
                        ))}
                    </div>

                    {/* Mensajes */}
                    {error && (
                        <div style={{
                            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)",
                            borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
                            color: "#fca5a5", fontSize: "0.85rem", textAlign: "center",
                        }}>
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div style={{
                            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
                            borderRadius: "10px", padding: "10px 14px", marginBottom: "16px",
                            color: "#86efac", fontSize: "0.85rem", textAlign: "center",
                        }}>
                            ✅ {success}
                        </div>
                    )}

                    {/* Botón verificar */}
                    <button
                        onClick={handleVerify}
                        disabled={loading || digits.join("").length < 6}
                        style={{
                            width: "100%", padding: "14px",
                            background: digits.join("").length === 6
                                ? "linear-gradient(135deg, #ea580c, #f97316)"
                                : "#f1f5f9",
                            border: "none", borderRadius: "12px",
                            color: digits.join("").length === 6 ? "#fff" : "#94a3b8",
                            fontWeight: 700, fontSize: "1rem",
                            cursor: digits.join("").length === 6 && !loading ? "pointer" : "not-allowed",
                            transition: "all 0.2s ease",
                            boxShadow: digits.join("").length === 6 ? "0 4px 20px rgba(234,88,12,0.4)" : "none",
                            marginBottom: "16px",
                        }}
                    >
                        {loading ? "Verificando..." : "Confirmar código →"}
                    </button>

                    {/* Reenviar */}
                    <div style={{ textAlign: "center" }}>
                        <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "0 0 6px" }}>
                            ¿No recibiste el correo?
                        </p>
                        <button
                            onClick={handleResend}
                            disabled={countdown > 0 || resending}
                            style={{
                                background: "none", border: "none",
                                color: countdown > 0 ? "#475569" : "#f97316",
                                fontWeight: 700, fontSize: "0.875rem",
                                cursor: countdown > 0 ? "not-allowed" : "pointer",
                                transition: "color 0.2s ease",
                            }}
                        >
                            {resending ? "Enviando..." : countdown > 0 ? `Reenviar código (${countdown}s)` : "Reenviar código"}
                        </button>
                    </div>
                </div>

                <p style={{ textAlign: "center", color: "var(--slate-400)", fontSize: "0.78rem", marginTop: "1.5rem" }}>
                    © {new Date().getFullYear()} GXNOVA · Todos los derechos reservados
                </p>
            </div>
        </div>
    );
}

export default VerifyEmail;
