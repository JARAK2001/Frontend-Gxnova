import React from "react";
import { useNavigate } from "react-router-dom";

function CallToAction() {
    const navigate = useNavigate();

    return (
        <section className="py-16 bg-gradient-to-r from-orange-500 to-rose-500 text-white">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-3xl font-bold mb-4">
                    ¿Listo para comenzar?
                </h2>
                <p className="text-lg mb-8 text-orange-100">
                    Únete a nuestra plataforma y conecta con profesionales de toda Colombia
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        className="px-6 py-3 bg-white text-orange-500 font-semibold rounded-xl hover:bg-gray-50 transition-all shadow-lg"
                        onClick={() => navigate("/auth")}
                    >
                        Crear Cuenta Gratis
                    </button>
                    <button
                        className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
                        onClick={() => navigate("/servicios")}
                    >
                        Explorar Servicios
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CallToAction;
