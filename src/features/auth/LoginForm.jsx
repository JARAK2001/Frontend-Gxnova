import React from "react";
import { Eye, EyeOff } from 'lucide-react';

function LoginForm({
    handleLogin,
    emailLogin,
    setEmailLogin,
    passwordLogin,
    setPasswordLogin,
    showLoginPassword,
    setShowLoginPassword,
    handleToggleView,
    PRIMARY_COLOR,
    HOVER_COLOR
}) {
    return (
        <form onSubmit={handleLogin} className="space-y-4">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Bienvenido a GXNOVA
                </h2>
                <p className="text-sm text-gray-500">
                    Ingresa tus credenciales para continuar
                </p>
            </div>

            <div className="space-y-1">
                <label htmlFor="login-correo" className="text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="login-correo"
                    name="correo"
                    value={emailLogin}
                    onChange={(e) => setEmailLogin(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                    placeholder="tu@email.com"
                    required
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="login-password" className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                    <input
                        type={showLoginPassword ? "text" : "password"}
                        id="login-password"
                        name="password"
                        value={passwordLogin}
                        onChange={(e) => setPasswordLogin(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="********"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowLoginPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                className={`group relative flex w-full justify-center rounded-md bg-${PRIMARY_COLOR} px-4 py-2 text-sm font-medium text-white hover:bg-${HOVER_COLOR} focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR}/50 transition duration-150`}
            >
                Iniciar Sesión
            </button>

            <div className="text-center pt-2">
                <button
                    type="button"
                    onClick={() => handleToggleView("register")}
                    className={`text-sm font-medium text-gray-500 hover:text-${HOVER_COLOR} transition-colors block w-full mb-4`}
                >
                    ¿No tienes cuenta? Regístrate aquí
                </button>

                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={() => handleToggleView("forgot-password")}
                        className={`text-sm font-semibold text-${PRIMARY_COLOR} hover:text-${HOVER_COLOR} transition-colors text-center w-full`}
                    >
                        ¿Olvidaste tu contraseña?
                    </button>

                    <button
                        type="button"
                        onClick={() => handleToggleView("facial-login")}
                        className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all shadow-sm"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                        Acceso con Rostro
                    </button>
                </div>
            </div>
        </form>
    );
}

export default LoginForm;
