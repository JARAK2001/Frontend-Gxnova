import React from 'react';
import { Search, MessageSquare, Star, ArrowRight } from 'lucide-react';

const ComoFunciona = () => {
    const pasos = [
        {
            icono: <Search className="w-8 h-8 text-orange-600" />,
            titulo: "1. Publica o Busca",
            descripcion: "Describe el servicio que necesitas o explora las ofertas de trabajo disponibles en tu zona."
        },
        {
            icono: <MessageSquare className="w-8 h-8 text-orange-600" />,
            titulo: "2. Conecta y Acuerda",
            descripcion: "Chat directo. Negocia el precio o propón un trueque justo sin intermediarios."
        },
        {
            icono: <Star className="w-8 h-8 text-orange-600" />,
            titulo: "3. Realiza y Califica",
            descripcion: "Completa el trabajo con seguridad y califica la experiencia para ayudar a la comunidad."
        }
    ];

    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <span className="text-orange-600 font-bold text-sm tracking-wider uppercase mb-2 block">
                        Proceso Simple
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                        ¿Cómo funciona Gxnova?
                    </h2>
                    <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
                        Conectamos necesidades con talentos de forma rápida, segura y flexible.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Línea conectora (solo visible en desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-orange-100 -z-10"></div>

                    {pasos.map((paso, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300 relative z-10">
                                {paso.icono}
                                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold border-2 border-white">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {paso.titulo}
                            </h3>
                            <p className="text-gray-600 leading-relaxed max-w-xs">
                                {paso.descripcion}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <a href="/register" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:text-orange-700 transition-colors">
                        Comenzar ahora <ArrowRight className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default ComoFunciona;
