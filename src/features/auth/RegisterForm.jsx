import React from "react";
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

function RegisterForm({
    handleRegister,
    nombre,
    setNombre,
    apellido,
    setApellido,
    emailRegister,
    setEmailRegister,
    passwordRegister,
    setPasswordRegister,
    confirmPassword,
    setConfirmPassword,
    telefono,
    setTelefono,
    rolNombre,
    setRolNombre,
    terminosAceptados,
    setTerminosAceptados,
    showRegisterPassword,
    setShowRegisterPassword,
    PRIMARY_COLOR,
    HOVER_COLOR,
    isLoading
}) {
    return (
        <form className="space-y-4" onSubmit={handleRegister}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Crear cuenta</h2>
                <p className="text-sm text-gray-500">
                    Únete a GXNOVA y comienza tu experiencia
                </p>
            </div>

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="nombre" className="text-sm font-medium text-gray-700">Nombre</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Nombre"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="apellido" className="text-sm font-medium text-gray-700">Apellido</label>
                    <input
                        type="text"
                        id="apellido"
                        name="apellido"
                        value={apellido}
                        onChange={(e) => setApellido(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Pérez"
                        required
                    />
                </div>
            </div>

            {/* Teléfono y Rol */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="telefono" className="text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={telefono}
                        onChange={(e) => setTelefono(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Ej: 300 123 4567"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="rol" className="text-sm font-medium text-gray-700">¿Qué buscas?</label>
                    <select
                        id="rol"
                        name="rol"
                        value={rolNombre}
                        onChange={(e) => setRolNombre(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                    >
                        <option value="Trabajador">Quiero Trabajar</option>
                        <option value="Empleador">Quiero Contratar</option>
                    </select>
                </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
                <label htmlFor="correo" className="text-sm font-medium text-gray-700">Email</label>
                <input
                    type="email"
                    id="correo"
                    name="correo"
                    value={emailRegister}
                    onChange={(e) => setEmailRegister(e.target.value)}
                    className="block w-full rounded-md border border-gray-300 py-2 px-3 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                    placeholder="tu@email.com"
                    required
                />
            </div>

            {/* Contraseña */}
            <div className="space-y-1 pt-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
                <div className="relative">
                    <input
                        type={showRegisterPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={passwordRegister}
                        onChange={(e) => setPasswordRegister(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Mínimo 6 caracteres"
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowRegisterPassword((prev) => !prev)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        {showRegisterPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-1">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmar contraseña
                </label>
                <div className="relative">
                    <input
                        type={showRegisterPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 px-3 pr-10 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm"
                        placeholder="Repite la contraseña"
                        required
                    />
                </div>
            </div>

            {/* Términos y Condiciones */}
            <div className="flex items-start pt-3 border-t border-gray-200">
                <div className="flex h-5 items-center">
                    <input
                        id="terminos"
                        name="terminos"
                        type="checkbox"
                        checked={terminosAceptados}
                        onChange={(e) => setTerminosAceptados(e.target.checked)}
                        className={`h-4 w-4 rounded border-gray-300 text-${PRIMARY_COLOR} focus:ring-${PRIMARY_COLOR}`}
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terminos" className="font-medium text-gray-700">
                        Acepto los términos y condiciones
                    </label>
                    <p className="text-gray-500">
                        He leído y acepto los <Link to="/terminos-y-condiciones" target="_blank" className={`text-${PRIMARY_COLOR} hover:underline`}>Términos y Condiciones</Link> y la <Link to="/politica-de-privacidad" target="_blank" className={`text-${PRIMARY_COLOR} hover:underline`}>Política de Privacidad</Link>.
                    </p>
                </div>
            </div>

            {/* Indicador de pasos */}
            <div style={{ background: '#fff7ed', borderRadius: '10px', padding: '12px 16px', border: '1px solid #fed7aa', marginTop: '4px' }}>
                <p style={{ fontSize: '0.8rem', color: '#9a3412', margin: 0, fontWeight: 600 }}>
                    📋 Paso 1 de 3: Datos básicos
                </p>
                <p style={{ fontSize: '0.75rem', color: '#c2410c', margin: '4px 0 0 0' }}>
                    Después verificarás tu correo y subirás tu foto de identidad.
                </p>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className={`group relative flex w-full justify-center rounded-md bg-${PRIMARY_COLOR} px-4 py-2 text-sm font-medium text-white hover:bg-${HOVER_COLOR} focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR}/50 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {isLoading ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creando cuenta...
                    </span>
                ) : (
                    "Continuar →"
                )}
            </button>
        </form>
    );
}

export default RegisterForm;
