import React, { useState, useRef } from "react";
import { Camera, Mail, Loader2, ArrowLeft } from "lucide-react";

function FacialLogin({ handleFacialLogin, handleToggleView, PRIMARY_COLOR, HOVER_COLOR }) {
    const [correo, setCorreo] = useState("");
    const [selfieFile, setSelfieFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelfieFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!correo || !selfieFile) return;
        setIsLoading(true);
        await handleFacialLogin(correo, selfieFile);
        setIsLoading(false);
    };

    return (
        <div className="animate-fade-in space-y-5">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-orange-100 text-orange-600 mb-3 border-4 border-white shadow-sm">
                    <Camera size={26} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1">Acceso con Rostro</h2>
                <p className="text-sm text-slate-500">
                    Ingresa tu correo y tómate una selfie para ingresar rápidamente.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label htmlFor="facial-email" className="text-sm font-medium text-slate-700">
                        Correo Electrónico
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            <Mail className="h-4 w-4" />
                        </div>
                        <input
                            type="email"
                            id="facial-email"
                            required
                            className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-slate-700"
                            placeholder="tu@correo.com"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-slate-700 block">Tu Rostro</label>
                    <input
                        type="file"
                        accept="image/*"
                        capture="user"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {previewUrl ? (
                        <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-orange-500 shadow-inner group">
                            <img src={previewUrl} alt="Selfie" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    type="button"
                                    onClick={triggerFileSelect}
                                    className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg font-medium hover:bg-white/30 transition-colors"
                                >
                                    Tomar otra foto
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={triggerFileSelect}
                            className="w-full h-32 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 hover:border-orange-400 hover:text-orange-500 transition-all text-slate-400 group"
                        >
                            <Camera size={28} className="mb-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Tocar para abrir cámara</span>
                        </div>
                    )}
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={isLoading || !correo || !selfieFile}
                        className={`w-full flex justify-center py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-${PRIMARY_COLOR} hover:bg-${HOVER_COLOR} shadow-lg shadow-orange-500/25 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Verificar e Ingresar"}
                    </button>
                </div>
            </form>

            <div className="text-center mt-4 border-t border-slate-100 pt-4">
                <button
                    onClick={() => handleToggleView('login')}
                    className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Volver al login tradicional
                </button>
            </div>
        </div>
    );
}

export default FacialLogin;
