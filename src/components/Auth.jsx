import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logoGxnova from "../assets/gxnova-logo.png";
import LoginForm from "./auth/LoginForm";
import RegisterForm from "./auth/RegisterForm";
import API_URL from "../config/api";

const PRIMARY_COLOR = "orange-600";
const HOVER_COLOR = "orange-700";

function Auth() {
    const { login, register } = useAuth();
    const navigate = useNavigate();

    const [view, setView] = useState('login'); // 'login' o 'register'
    const [message, setMessage] = useState(null); // Mensaje de feedback/error
    const [messageType, setMessageType] = useState(null); // 'success' o 'error'

    // === ESTADOS DE LOGIN ===
    const [emailLogin, setEmailLogin] = useState("");
    const [passwordLogin, setPasswordLogin] = useState("");
    const [showLoginPassword, setShowLoginPassword] = useState(false);

    // === ESTADOS DE REGISTRO ===
    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [emailRegister, setEmailRegister] = useState("");
    const [passwordRegister, setPasswordRegister] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [telefono, setTelefono] = useState("");
    const [rolNombre, setRolNombre] = useState("Trabajador");
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
            const respuesta = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    correo: emailLogin,
                    password: passwordLogin
                }),
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.message || 'Credenciales incorrectas.');
            }

            const data = await respuesta.json();

            if (data.token) {
                // Usamos la función login del contexto
                login(data.token, data.usuario);
                showMessage('success', "Inicio de sesión exitoso. Redirigiendo...");

                // Verificar si es administrador
                const esAdmin = data.usuario.rolesAsignados && data.usuario.rolesAsignados.some(r => r.rol.nombre === 'Administrador');

                setTimeout(() => {
                    if (esAdmin) {
                        navigate("/admin");
                    } else {
                        navigate("/");
                    }
                }, 1500);
            } else {
                showMessage('error', "Fallo en la respuesta del servidor (Token no recibido).");
            }
        } catch (error) {
            console.error("Error de Login:", error.message);
            showMessage('error', ` ${error.message}`);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        showMessage(null, null);

        if (!nombre || !apellido || !emailRegister || !passwordRegister || !confirmPassword) {
            showMessage('error', "Todos los campos son obligatorios para el registro.");
            return;
        }

        if (passwordRegister !== confirmPassword) {
            showMessage('error', "Las contraseñas no coinciden. Por favor, verifícalas.");
            return;
        }

        // Validar que se hayan seleccionado las imágenes obligatorias
        const fotoCedula = document.getElementById('foto_cedula').files[0];
        const selfie = document.getElementById('selfie').files[0];

        if (!fotoCedula || !selfie) {
            showMessage('error', "La foto de cédula y la selfie son obligatorias para verificar tu identidad.");
            return;
        }

        try {
            // Crear FormData para enviar archivos
            const formData = new FormData();
            formData.append('nombre', nombre);
            formData.append('apellido', apellido);
            formData.append('correo', emailRegister);
            formData.append('password', passwordRegister);
            formData.append('telefono', telefono);
            formData.append('rolNombre', rolNombre);

            // Agregar imágenes obligatorias
            formData.append('foto_cedula', fotoCedula);
            formData.append('selfie', selfie);

            // Agregar foto de perfil si existe (opcional)
            const fotoPerfil = document.getElementById('foto_perfil').files[0];
            if (fotoPerfil) {
                formData.append('foto_perfil', fotoPerfil);
            }

            showMessage('info', "Verificando tu identidad... Esto puede tardar unos segundos.");

            const respuesta = await fetch(`${API_URL}/api/auth/register`, {
                method: "POST",
                // NO incluir Content-Type, el navegador lo establece automáticamente con boundary
                body: formData,
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                showMessage('success', "✅ Registro exitoso. Tu identidad ha sido verificada. Ahora puedes iniciar sesión.");
                setNombre('');
                setApellido('');
                setEmailRegister('');
                setPasswordRegister('');
                setConfirmPassword('');
                setTelefono('');
                setRolNombre('Trabajador');

                // Limpiar inputs de archivos
                document.getElementById('foto_cedula').value = '';
                document.getElementById('selfie').value = '';
                document.getElementById('foto_perfil').value = '';
                document.getElementById('preview_cedula').classList.add('hidden');
                document.getElementById('preview_selfie').classList.add('hidden');
                document.getElementById('preview_perfil').classList.add('hidden');

                setTimeout(() => handleToggleView("login"), 3000);

            } else {
                showMessage('error', `❌ ${data.message || 'Error desconocido'}`);
            }
        } catch (error) {
            console.error("Error de Registro:", error);
            showMessage('error', "❌ Error de conexión con el servidor.");
        }
    };

    const messageClasses = messageType === 'error'
        ? "bg-red-50 border-red-300 text-red-700"
        : messageType === 'info'
            ? "bg-blue-50 border-blue-300 text-blue-700"
            : "bg-green-50 border-green-300 text-green-700";

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-inter">

            <div className="w-full max-w-md space-y-6">
                <div className="text-center space-y-3">
                    <div className={`w-16 h-16 mx-auto rounded-full bg-${PRIMARY_COLOR} flex items-center justify-center text-white text-2xl font-bold`}>
                        <img
                            src={logoGxnova}
                            alt="GXNOVA Logo"
                            className="w-20 h-auto mx-auto"
                        />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">GXNOVA</h1>
                    <p className="text-sm text-gray-600">
                        Conectamos talento con oportunidades
                    </p>
                </div>

                <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl border border-gray-200">
                    <div className="flex justify-around border-b border-gray-200 mb-6">
                        <button
                            onClick={() => handleToggleView("login")}
                            className={`text-center pb-2 w-1/2 font-semibold transition duration-200 ${view === "login"
                                ? `text-${PRIMARY_COLOR} border-b-2 border-${PRIMARY_COLOR}`
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Iniciar Sesión
                        </button>
                        <button
                            onClick={() => handleToggleView("register")}
                            className={`text-center pb-2 w-1/2 font-semibold transition duration-200 ${view === "register"
                                ? `text-${PRIMARY_COLOR} border-b-2 border-${PRIMARY_COLOR}`
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Registrarse
                        </button>
                    </div>

                    {message && (
                        <div className={`mb-4 rounded-lg px-4 py-3 text-sm border ${messageClasses}`}>
                            {message}
                        </div>
                    )}

                    {view === "login" ? (
                        <LoginForm
                            handleLogin={handleLogin}
                            emailLogin={emailLogin}
                            setEmailLogin={setEmailLogin}
                            passwordLogin={passwordLogin}
                            setPasswordLogin={setPasswordLogin}
                            showLoginPassword={showLoginPassword}
                            setShowLoginPassword={setShowLoginPassword}
                            handleToggleView={handleToggleView}
                            PRIMARY_COLOR={PRIMARY_COLOR}
                            HOVER_COLOR={HOVER_COLOR}
                        />
                    ) : (
                        <RegisterForm
                            handleRegister={handleRegister}
                            nombre={nombre}
                            setNombre={setNombre}
                            apellido={apellido}
                            setApellido={setApellido}
                            emailRegister={emailRegister}
                            setEmailRegister={setEmailRegister}
                            passwordRegister={passwordRegister}
                            setPasswordRegister={setPasswordRegister}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            telefono={telefono}
                            setTelefono={setTelefono}
                            rolNombre={rolNombre}
                            setRolNombre={setRolNombre}
                            showRegisterPassword={showRegisterPassword}
                            setShowRegisterPassword={setShowRegisterPassword}
                            PRIMARY_COLOR={PRIMARY_COLOR}
                            HOVER_COLOR={HOVER_COLOR}
                        />
                    )}
                </div>

                <div className="text-center pt-4">
                    <p className="text-xs text-gray-500">
                        © 2025 GXNOVA - Todos los derechos reservados
                    </p>
                </div>
            </div>
        </div >
    )
}

export default Auth;