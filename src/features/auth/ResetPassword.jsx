import React, { useState } from "react";
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react";

function ResetPassword({ correo, onResetSuccess, handleToggleView, PRIMARY_COLOR, HOVER_COLOR }) {
    const [codigo, setCodigo] = useState("");
    const [nuevaPassword, setNuevaPassword] = useState("");
    const [confirmarPassword, setConfirmarPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        onResetSuccess(correo, codigo, nuevaPassword, confirmarPassword);
    };

    return (
        <div className="animate-fade-in space-y-5">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Crear nueva contraseña</h2>
                <p className="text-sm text-slate-500">
                    Ingresa el código de 6 dígitos enviado a <strong className="text-slate-700">{correo}</strong> y tu nueva contraseña.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="reset-code" className="text-sm font-medium text-slate-700">
                        Código de seguridad
                    </label>
                    <input
                        type="text"
                        id="reset-code"
                        required
                        maxLength={6}
                        className="block w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-2xl tracking-widest focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold text-slate-800 uppercase"
                        placeholder="000000"
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                    />
                </div>

                <div className="space-y-1 relative">
                    <label htmlFor="reset-new-password" className="text-sm font-medium text-slate-700">
                        Nueva Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="reset-new-password"
                            required
                            className="block w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                            placeholder="••••••••"
                            value={nuevaPassword}
                            onChange={(e) => setNuevaPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-1 relative">
                    <label htmlFor="reset-confirm-password" className="text-sm font-medium text-slate-700">
                        Confirmar Contraseña
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Lock className="h-4 w-4" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="reset-confirm-password"
                            required
                            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                            placeholder="••••••••"
                            value={confirmarPassword}
                            onChange={(e) => setConfirmarPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || !codigo || !nuevaPassword || !confirmarPassword}
                        className={`w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-${PRIMARY_COLOR} hover:bg-${HOVER_COLOR} shadow-lg shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Establecer Contraseña"}
                    </button>
                </div>
            </form>

            <div className="text-center mt-4">
                <button
                    onClick={() => handleToggleView('login')}
                    className="text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    );
}

export default ResetPassword;
