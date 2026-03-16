import React, { useState } from "react";
import { ArrowLeft, Mail, Loader2 } from "lucide-react";

function ForgotPassword({ handleToggleView, onCodeSent, PRIMARY_COLOR, HOVER_COLOR }) {
    const [correo, setCorreo] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        onCodeSent(correo);
    };

    return (
        <div className="animate-fade-in space-y-5">
            <div className="text-center">
                <h2 className="text-xl font-bold text-slate-800 mb-2">Recuperar Contraseña</h2>
                <p className="text-sm text-slate-500">
                    Ingresa tu correo electrónico registrado y te enviaremos un código de seguridad de 6 dígitos.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="recovery-email" className="text-sm font-medium text-slate-700">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="h-4 w-4" />
                        </div>
                        <input
                            type="email"
                            id="recovery-email"
                            required
                            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                            placeholder="tu@correo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || !correo}
                        className={`w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-${PRIMARY_COLOR} hover:bg-${HOVER_COLOR} shadow-lg shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Enviar código de recuperación"}
                    </button>
                </div>
            </form>

            <div className="text-center mt-4">
                <button
                    onClick={() => handleToggleView('login')}
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Volver al login
                </button>
            </div>
        </div>
    );
}

export default ForgotPassword;
