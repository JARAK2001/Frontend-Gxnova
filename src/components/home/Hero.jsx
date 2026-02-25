import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {
    const [busqueda, setBusqueda] = React.useState("");

    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (busqueda.trim()) {
            navigate(`/servicios?busqueda=${encodeURIComponent(busqueda)}`);
        } else {
            navigate("/servicios");
        }
    };

    return (
        <section className="bg-gradient-to-r from-orange-50 to-amber-50 py-20 lg:py-24 relative overflow-hidden">
            {/* Elementos decorativos de fondo */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2 animate-blob animation-delay-2000"></div>

            <div className="container mx-auto px-4 max-w-5xl text-center space-y-8 relative z-10">
                <div className="animate-fade-in-up">
                    <p className="text-sm uppercase tracking-[0.3em] text-orange-600 font-bold mb-4">
                        Plataforma freelance colombiana
                    </p>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        Encuentra talento <span className="text-orange-600">experto</span> <br className="hidden md:block" />
                        para proyectos reales
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
                        Conecta con profesionales verificados. Gestiona pagos seguros en dinero o trueque.
                        Únete a la comunidad #1 de servicios en Colombia.
                    </p>
                </div>

                {/* Barra de Búsqueda Principal */}
                <div className="max-w-3xl mx-auto bg-white p-3 rounded-2xl shadow-xl flex flex-col md:flex-row gap-3 transform hover:scale-[1.01] transition-transform duration-300 border border-gray-100">
                    <div className="relative flex-grow">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="w-full pl-11 pr-4 py-4 text-gray-900 placeholder-gray-500 bg-transparent outline-none text-lg"
                            placeholder="¿Qué servicio necesitas hoy? (Ej: Plomero, Contador...)"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        />
                    </div>
                    <button
                        onClick={handleSearch}
                        className="px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-orange-200 text-lg md:w-auto w-full"
                    >
                        Buscar
                    </button>
                </div>

                {/* Etiquetas de búsqueda rápida (opcional pero útil) */}
                <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 pt-4">
                    <span>Tendencias:</span>
                    {['Limpieza', 'Desarrollo Web', 'Mecánica', 'Diseño', 'Clases'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => navigate(`/servicios?busqueda=${encodeURIComponent(tag)}`)}
                            className="hover:text-orange-600 underline decoration-dotted transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Hero;
