import React from 'react';
import { Smartphone, Star } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative pt-20 pb-32 overflow-hidden bg-gradient-to-b from-orange-50 to-white">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="lg:w-1/2 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 text-orange-700 font-semibold text-sm mb-6">
                            <Star className="w-4 h-4 fill-orange-700" />
                            <span>La app #1 de servicios</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-tight mb-6">
                            Tu talento, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-500">
                                tu oportunidad.
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                            Encuentra expertos confiables o ofrece tus servicios. Todo desde tu celular con seguridad verificada.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button className="px-8 py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2">
                                <Smartphone className="w-5 h-5" />
                                Descargar App
                            </button>
                            <button className="px-8 py-4 rounded-xl bg-white text-slate-700 border-2 border-slate-200 font-bold text-lg hover:border-orange-500 hover:text-orange-600 transition-all">
                                Saber más
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/2 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-3xl"></div>
                        <div className="relative z-10 bg-white p-4 rounded-[2.5rem] shadow-2xl border-8 border-slate-900 max-w-xs mx-auto rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
                            {/* MOCKUP CONTENT */}
                            <div className="bg-gray-100 h-[600px] rounded-[2rem] overflow-hidden flex flex-col items-center pt-10">
                                <div className="w-32 h-6 bg-slate-200 rounded-full mb-8"></div>
                                <div className="w-full h-full bg-white rounded-t-3xl shadow-inner p-6">
                                    <div className="flex gap-4 mb-6 text-2xl font-bold text-slate-800">Hola, Juan! <Hand className="w-6 h-6 inline" /></div>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-orange-100 p-4 rounded-xl h-24"></div>
                                        <div className="bg-blue-100 p-4 rounded-xl h-24"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-16 bg-gray-50 rounded-xl border border-gray-100"></div>
                                        <div className="h-16 bg-gray-50 rounded-xl border border-gray-100"></div>
                                        <div className="h-16 bg-gray-50 rounded-xl border border-gray-100"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
