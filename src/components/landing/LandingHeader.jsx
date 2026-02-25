import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoGxnova from "../../assets/gxnova-logo.png";

const LandingHeader = () => {
    const navigate = useNavigate();
    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logoGxnova} alt="GXNOVA" className="h-12 w-auto" />
                    <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent">
                        GXNOVA
                    </span>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Características</a>
                    <a href="#how-it-works" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Cómo Funciona</a>
                    <a href="#download" className="text-gray-600 hover:text-orange-600 font-medium transition-colors">Descargar App</a>
                    <button
                        onClick={() => navigate('/auth')}
                        className="px-5 py-2.5 rounded-full bg-slate-900 text-white font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
                    >
                        Acceso Admin
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default LandingHeader;
