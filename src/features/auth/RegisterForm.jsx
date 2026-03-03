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
    HOVER_COLOR
}) {
    return (
        <form className="space-y-4" onSubmit={handleRegister}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Crear cuenta</h2>
                <p className="text-sm text-gray-500">
                    Únete a GXNOVA y comienza tu experiencia
                </p>
            </div>

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

            {/* Input Contraseña */}
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

            {/* Input Confirmar Contraseña */}
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

            {/* Sección de Verificación de Identidad */}
            <div className="space-y-3 pt-3 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700">Verificación de Identidad</h3>
                <p className="text-xs text-gray-500">
                    Para garantizar la seguridad, necesitamos verificar tu identidad
                </p>

                {/* Foto de Cédula */}
                <div className="space-y-1">
                    <label htmlFor="foto_cedula" className="text-sm font-medium text-gray-700">
                        Foto de Cédula <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        id="foto_cedula"
                        name="foto_cedula"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                // Crear preview
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    document.getElementById('preview_cedula').src = reader.result;
                                    document.getElementById('preview_cedula').classList.remove('hidden');
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-600 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        required
                    />
                    <img id="preview_cedula" className="hidden mt-2 w-32 h-32 object-cover rounded-md border border-gray-300" alt="Preview cédula" />
                </div>

                {/* Selfie */}
                <div className="space-y-1">
                    <label htmlFor="selfie" className="text-sm font-medium text-gray-700">
                        Selfie (Foto de tu rostro) <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="file"
                        id="selfie"
                        name="selfie"
                        accept="image/*"
                        capture="user"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                // Crear preview
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    document.getElementById('preview_selfie').src = reader.result;
                                    document.getElementById('preview_selfie').classList.remove('hidden');
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-600 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                        required
                    />
                    <img id="preview_selfie" className="hidden mt-2 w-32 h-32 object-cover rounded-md border border-gray-300" alt="Preview selfie" />
                    <p className="text-xs text-gray-500">
                        📸 Asegúrate de que tu rostro sea visible y esté bien iluminado
                    </p>
                </div>

                {/* Foto de Perfil (Opcional) */}
                <div className="space-y-1">
                    <label htmlFor="foto_perfil" className="text-sm font-medium text-gray-700">
                        Foto de Perfil (Opcional)
                    </label>
                    <input
                        type="file"
                        id="foto_perfil"
                        name="foto_perfil"
                        accept="image/*"
                        onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                                // Crear preview
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    document.getElementById('preview_perfil').src = reader.result;
                                    document.getElementById('preview_perfil').classList.remove('hidden');
                                };
                                reader.readAsDataURL(file);
                            }
                        }}
                        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-600 file:mr-4 file:py-2 file:px-4 file:rounded-l-md file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                    />
                    <img id="preview_perfil" className="hidden mt-2 w-32 h-32 object-cover rounded-md border border-gray-300" alt="Preview perfil" />
                </div>
            </div>

            {/* Checkbox de Términos y Condiciones */}
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

            <button
                type="submit"
                className={`group relative flex w-full justify-center rounded-md bg-${PRIMARY_COLOR} px-4 py-2 text-sm font-medium text-white hover:bg-${HOVER_COLOR} focus:outline-none focus:ring-2 focus:ring-${PRIMARY_COLOR}/50 transition duration-150`}
            >
                Crear cuenta
            </button>
        </form>
    );
}

export default RegisterForm;
