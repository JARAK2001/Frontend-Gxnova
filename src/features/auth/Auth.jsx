import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoGxnova from "../../assets/gxnova-logo.png";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import VerifyEmail from "./VerifyEmail";
import IdentityVerification from "./IdentityVerification";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import FacialLogin from "./FacialLogin";
import API_URL from "../../config/api";
import { CheckCircle, XCircle, Info } from "lucide-react";
import Swal from 'sweetalert2';

const PRIMARY_COLOR = "orange-600";
const HOVER_COLOR = "orange-700";

function Auth() {
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [view, setView] = useState('login');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);
    const [pendingVerificationCorreo, setPendingVerificationCorreo] = useState(null);
    const [pendingIdentityCorreo, setPendingIdentityCorreo] = useState(null); // Paso 3: identidad
    const [resetCorreo, setResetCorreo] = useState(null); // Recuperación de contraseña

    // Add loading state for registration
    const [isLoading, setIsLoading] = useState(false);

    // Login states
    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // Register states
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [emailRegister, setEmailRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rolNombre, setRolNombre] = useState("Trabajador");
    const [terminosAceptados, setTerminosAceptados] = useState(false);
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const handleToggleView = (nextView) => {
        setView(nextView);
        setMessage(null);
        setMessageType(null);
    };

    const showMessage = (type, text) => {
        setMessageType(type);
        setMessage(text);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        showMessage(null, null);
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo: emailLogin, password: passwordLogin }),
            });
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Credenciales incorrectas.');
            }
            const data = await res.json();
            // Verificar si requiere verificación de correo
            if (data.requiereVerificacion) {
                setPendingVerificationCorreo(data.correo || emailLogin);
                return;
            }
            if (data.token) {
                login(data.token, data.usuario);
                showMessage('success', "Inicio de sesión exitoso. Redirigiendo...");
                const esAdmin = data.usuario.rolesAsignados?.some(r => r.rol.nombre === 'Administrador');
                setTimeout(() => navigate(esAdmin ? "/admin" : "/"), 1500);
            } else {
                showMessage('error', "Token no recibido del servidor.");
            }
        } catch (error) {
            showMessage('error', error.message);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        showMessage(null, null);

        if (!nombre || !apellido || !emailRegister || !passwordRegister || !confirmPassword) {
            Swal.fire({
                icon: 'warning',
                title: 'Campos incompletos',
                text: 'Todos los campos son obligatorios.',
                confirmButtonColor: '#ea580c'
            });
            return;
        }
        if (!terminosAceptados) {
            Swal.fire({
                icon: 'warning',
                title: 'Términos y condiciones',
                text: 'Debes aceptar los Términos y la Política de Privacidad.',
                confirmButtonColor: '#ea580c'
            });
            return;
        }
        if (passwordRegister !== confirmPassword) {
            Swal.fire({
                icon: 'error',
                title: 'Contraseñas diferentes',
                text: 'Las contraseñas no coinciden.',
                confirmButtonColor: '#ea580c'
            });
            return;
        }


        try {
            document.activeElement?.blur();
            setIsLoading(true);

            Swal.fire({
                title: 'Creando tu cuenta...',
                text: 'Estamos registrando tu información.',
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
                didOpen: () => { Swal.showLoading(); }
            });

            const res = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, apellido, correo: emailRegister, password: passwordRegister, telefono, rolNombre, terminosAceptados: true })
            });
            const data = await res.json();

            Swal.close();

            if (res.ok) {
                if (data.requiereVerificacion) {
                    setPendingVerificationCorreo(data.usuario?.correo || emailRegister);
                    setNombre(''); setApellido(''); setEmailRegister(''); setPasswordRegister('');
                    setConfirmPassword(''); setTelefono(''); setRolNombre('Trabajador'); setTerminosAceptados(false);
                    return;
                }
            } else {
                Swal.fire({ icon: 'error', title: 'Error al registrar', text: data.message || 'Error desconocido.', confirmButtonColor: '#dc2626' });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error de conexión',
                text: 'No se pudo conectar con el servidor. Por favor, intenta de nuevo.',
                confirmButtonColor: '#dc2626'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleForgotPassword = async (correo) => {
        showMessage(null, null);
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/api/auth/recuperar-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo })
            });
            const data = await res.json();
            if (res.ok) {
                setResetCorreo(correo);
                setView('reset-password');
                showMessage('success', data.message || "Código enviado.");
            } else {
                showMessage('error', data.message || "Error al solicitar código.");
            }
        } catch (error) {
            showMessage('error', "Error de conexión.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (correo, codigo, nuevaPassword, confirmarPassword) => {
        showMessage(null, null);
        if (nuevaPassword !== confirmarPassword) {
            return showMessage('error', "Las contraseñas no coinciden.");
        }
        try {
            setIsLoading(true);
            const res = await fetch(`${API_URL}/api/auth/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ correo, codigo, nuevaPassword })
            });
            const data = await res.json();
            if (res.ok) {
                showMessage('success', "Contraseña actualizada. Inicia sesión.");
                setView('login');
            } else {
                showMessage('error', data.message || "Error al restablecer contraseña.");
            }
        } catch (error) {
            showMessage('error', "Error de conexión.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFacialLogin = async (correo, selfieFile) => {
        showMessage(null, null);
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append("correo", correo);
            formData.append("selfie", selfieFile);

            const res = await fetch(`${API_URL}/api/auth/login-facial`, {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            if (res.ok && data.token) {
                login(data.token, data.usuario);
                showMessage('success', "Ingreso facial exitoso.");
                const esAdmin = data.usuario.rolesAsignados?.some(r => r.rol.nombre === 'Administrador');
                setTimeout(() => navigate(esAdmin ? "/admin" : "/"), 1500);
            } else {
                showMessage('error', data.message || "Error en inicio de sesión facial.");
            }
        } catch (error) {
            showMessage('error', "Error de conexión con el servicio facial.");
        } finally {
            setIsLoading(false);
        }
    };

    /* ── Message ── */
    const msgConfig = {
        error: { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', Icon: XCircle },
        info: { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', Icon: Info },
        success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', Icon: CheckCircle },
    };
    const mc = msgConfig[messageType] || {};

    // Paso 2: Verificar correo
    if (pendingVerificationCorreo) {
        return (
            <VerifyEmail
                correo={pendingVerificationCorreo}
                onVerificado={() => {
                    // Al verificar el correo → ir al Paso 3 (identidad)
                    setPendingIdentityCorreo(pendingVerificationCorreo);
                    setPendingVerificationCorreo(null);
                }}
            />
        );
    }

    // Paso 3: Verificar identidad
    if (pendingIdentityCorreo) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '1.5rem',
                background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f8fafc 100%)',
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{
                        background: '#fff',
                        borderRadius: '24px',
                        boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1)',
                        border: '1.5px solid #f1f5f9',
                        padding: '28px'
                    }}>
                        <IdentityVerification
                            correo={pendingIdentityCorreo}
                            onVerificado={(data) => {
                                login(data.token, data.usuario);
                                const esAdmin = data.usuario?.rolesAsignados?.some(r => r.rol.nombre === 'Administrador');
                                navigate(esAdmin ? '/admin' : '/');
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #fff7ed 0%, #ffffff 40%, #f8fafc 100%)',
        }}>
            {/* Decorative orbs */}
            <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '450px', height: '450px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,146,60,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '380px', height: '380px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div className="animate-scale-in" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: '72px', height: '72px',
                        background: '#fff',
                        borderRadius: '20px', margin: '0 auto 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: 'var(--shadow-orange), 0 0 0 1px rgba(0,0,0,0.02)',
                        border: '1.5px solid var(--slate-100)',
                    }}>
                        <img src={logoGxnova} alt="GXNOVA" style={{ width: '52px', height: 'auto' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--slate-900)', letterSpacing: '-0.03em', marginBottom: '4px' }}>GXNOVA</h1>
                    <p style={{ fontSize: '0.875rem', color: 'var(--slate-500)' }}>Conectamos talento con oportunidades</p>
                </div>

                {/* Card */}
                <div style={{
                    background: '#fff',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px -12px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.02)',
                    border: '1.5px solid var(--slate-100)',
                    overflow: 'hidden',
                }}>
                    {/* Tabs */}
                    {['login', 'register'].includes(view) && (
                    <div style={{ display: 'flex', borderBottom: '1.5px solid var(--slate-100)', position: 'relative', padding: '6px 6px 0' }}>
                        {(['login', 'register']).map(v => (
                            <button
                                key={v}
                                onClick={() => handleToggleView(v)}
                                style={{
                                    flex: 1, padding: '11px 0',
                                    fontFamily: 'inherit',
                                    background: 'none', border: 'none',
                                    fontWeight: 700, fontSize: '0.9rem',
                                    cursor: 'pointer',
                                    color: view === v ? 'var(--orange-600)' : 'var(--slate-500)',
                                    borderRadius: '12px 12px 0 0',
                                    transition: 'color 0.18s ease',
                                    position: 'relative',
                                }}
                            >
                                {v === 'login' ? 'Iniciar Sesión' : 'Registrarse'}
                                {view === v && (
                                    <div style={{
                                        position: 'absolute', bottom: '-1.5px', left: '20%', right: '20%',
                                        height: '2.5px', borderRadius: '999px',
                                        background: 'linear-gradient(90deg, #f97316, #ea580c)',
                                    }} />
                                )}
                            </button>
                        ))}
                    </div>
                    )}

                    <div style={{ padding: '24px' }}>
                        {/* Feedback message */}
                        {message && mc.Icon && (
                            <div className="animate-fade-in" style={{
                                display: 'flex', alignItems: 'flex-start', gap: '10px',
                                padding: '12px 14px', borderRadius: '12px', marginBottom: '16px',
                                background: mc.bg, border: `1.5px solid ${mc.border}`, color: mc.color,
                                fontSize: '0.875rem', lineHeight: 1.5,
                            }}>
                                <mc.Icon size={17} style={{ flexShrink: 0, marginTop: '1px' }} />
                                <span>{message}</span>
                            </div>
                        )}

                        {view === "login" ? (
                            <LoginForm
                                handleLogin={handleLogin}
                                emailLogin={emailLogin} setEmailLogin={setEmailLogin}
                                passwordLogin={passwordLogin} setPasswordLogin={setPasswordLogin}
                                showLoginPassword={showLoginPassword} setShowLoginPassword={setShowLoginPassword}
                                handleToggleView={handleToggleView}
                                PRIMARY_COLOR={PRIMARY_COLOR} HOVER_COLOR={HOVER_COLOR}
                            />
                        ) : view === "register" ? (
                            <RegisterForm
                                handleRegister={handleRegister}
                                nombre={nombre} setNombre={setNombre}
                                apellido={apellido} setApellido={setApellido}
                                emailRegister={emailRegister} setEmailRegister={setEmailRegister}
                                passwordRegister={passwordRegister} setPasswordRegister={setPasswordRegister}
                                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                                telefono={telefono} setTelefono={setTelefono}
                                rolNombre={rolNombre} setRolNombre={setRolNombre}
                                terminosAceptados={terminosAceptados} setTerminosAceptados={setTerminosAceptados}
                                showRegisterPassword={showRegisterPassword} setShowRegisterPassword={setShowRegisterPassword}
                                PRIMARY_COLOR={PRIMARY_COLOR} HOVER_COLOR={HOVER_COLOR}
                            />
                        ) : view === "forgot-password" ? (
                            <ForgotPassword
                                handleToggleView={handleToggleView}
                                onCodeSent={handleForgotPassword}
                                PRIMARY_COLOR={PRIMARY_COLOR}
                                HOVER_COLOR={HOVER_COLOR}
                            />
                        ) : view === "reset-password" ? (
                            <ResetPassword
                                correo={resetCorreo}
                                onResetSuccess={handleResetPassword}
                                handleToggleView={handleToggleView}
                                PRIMARY_COLOR={PRIMARY_COLOR}
                                HOVER_COLOR={HOVER_COLOR}
                            />
                        ) : view === "facial-login" ? (
                            <FacialLogin
                                handleFacialLogin={handleFacialLogin}
                                handleToggleView={handleToggleView}
                                PRIMARY_COLOR={PRIMARY_COLOR}
                                HOVER_COLOR={HOVER_COLOR}
                            />
                        ) : null}
                    </div>
                </div>

                <p style={{ textAlign: 'center', color: 'var(--slate-400)', fontSize: '0.78rem', marginTop: '1.5rem' }}>
                    © {new Date().getFullYear()} GXNOVA · Todos los derechos reservados
                </p>
            </div>
        </div>
    );
}

export default Auth;