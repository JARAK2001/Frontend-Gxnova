import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logoGxnova from "../../assets/gxnova-logo.png";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import API_URL from "../../config/api";
import { CheckCircle, XCircle, Info } from "lucide-react";

const PRIMARY_COLOR = "orange-600";
const HOVER_COLOR = "orange-700";

function Auth() {
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [view, setView] = useState('login');
    const [message, setMessage] = useState(null);
    const [messageType, setMessageType] = useState(null);

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
            showMessage('error', "Todos los campos son obligatorios.");
            return;
        }
        if (!terminosAceptados) {
            showMessage('error', "Debes aceptar los Términos y la Política de Privacidad.");
            return;
        }
        if (passwordRegister !== confirmPassword) {
            showMessage('error', "Las contraseñas no coinciden.");
            return;
        }
        const fotoCedula = document.getElementById('foto_cedula').files[0];
        const selfie = document.getElementById('selfie').files[0];
        if (!fotoCedula || !selfie) {
            showMessage('error', "La foto de cédula y la selfie son obligatorias.");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('apellido', apellido);
            formData.append('correo', emailRegister);
            formData.append('password', passwordRegister);
            formData.append('telefono', telefono);
            formData.append('rolNombre', rolNombre);
            formData.append('terminosAceptados', terminosAceptados);
            formData.append('foto_cedula', fotoCedula);
            formData.append('selfie', selfie);
            const fotoPerfil = document.getElementById('foto_perfil').files[0];
            if (fotoPerfil) formData.append('foto_perfil', fotoPerfil);

            showMessage('info', "Verificando tu identidad... Esto puede tardar unos segundos.");
            const res = await fetch(`${API_URL}/api/auth/register`, { method: "POST", body: formData });
            const data = await res.json();
            if (res.ok) {
                showMessage('success', "Registro exitoso. Ahora puedes iniciar sesión.");
                setNombre(''); setApellido(''); setEmailRegister(''); setPasswordRegister('');
                setConfirmPassword(''); setTelefono(''); setRolNombre('Trabajador'); setTerminosAceptados(false);
                ['foto_cedula', 'selfie', 'foto_perfil'].forEach(id => {
                    const el = document.getElementById(id);
                    if (el) el.value = '';
                });
                ['preview_cedula', 'preview_selfie', 'preview_perfil'].forEach(id => {
                    document.getElementById(id)?.classList.add('hidden');
                });
                setTimeout(() => handleToggleView("login"), 3000);
            } else {
                showMessage('error', data.message || 'Error desconocido');
            }
        } catch {
            showMessage('error', "Error de conexión con el servidor.");
        }
    };

    /* ── Message ── */
    const msgConfig = {
        error: { bg: '#fef2f2', border: '#fecaca', color: '#b91c1c', Icon: XCircle },
        info: { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8', Icon: Info },
        success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#15803d', Icon: CheckCircle },
    };
    const mc = msgConfig[messageType] || {};

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(160deg, #fff7ed 0%, #fff 50%, #fdf4ff 100%)',
        }}>
            {/* Decorative orbs */}
            <div style={{ position: 'absolute', top: '-100px', right: '-80px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-80px', left: '-60px', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

            <div className="animate-scale-in" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                    <div style={{
                        width: '72px', height: '72px', background: '#fff',
                        borderRadius: '20px', margin: '0 auto 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 24px -4px rgba(249,115,22,0.25), 0 2px 8px rgba(0,0,0,0.06)',
                        border: '1px solid #fed7aa',
                    }}>
                        <img src={logoGxnova} alt="GXNOVA" style={{ width: '52px', height: 'auto' }} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '4px' }}>GXNOVA</h1>
                    <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Conectamos talento con oportunidades</p>
                </div>

                {/* Card */}
                <div style={{
                    background: '#fff', borderRadius: '24px',
                    boxShadow: '0 24px 60px -12px rgba(0,0,0,0.12), 0 8px 24px -4px rgba(0,0,0,0.06)',
                    border: '1.5px solid #f1f5f9',
                    overflow: 'hidden',
                }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', borderBottom: '1.5px solid #f1f5f9', position: 'relative', padding: '6px 6px 0' }}>
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
                                    color: view === v ? '#ea580c' : '#9ca3af',
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
                        ) : (
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
                        )}
                    </div>
                </div>

                <p style={{ textAlign: 'center', color: '#d1d5db', fontSize: '0.78rem', marginTop: '1.5rem' }}>
                    © {new Date().getFullYear()} GXNOVA · Todos los derechos reservados
                </p>
            </div>
        </div>
    );
}

export default Auth;