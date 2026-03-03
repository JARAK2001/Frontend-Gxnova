import React from 'react';
import { Smartphone } from 'lucide-react';

const DownloadSection = () => {
    return (
        <section id="download" className="py-24 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-800 skew-x-12 translate-x-20"></div>

            <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
                <div className="mb-10 md:mb-0 md:w-1/2">
                    <h2 className="text-4xl font-bold mb-6">Descarga GXNOVA hoy mismo</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-md">
                        Lleva el mercado de servicios en tu bolsillo. Disponible para dispositivos iOS y Android.
                    </p>
                    <div className="flex gap-4">
                        <button className="bg-white text-slate-900 px-6 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors flex items-center gap-3">
                            <Smartphone /> App Store
                        </button>
                        <button className="bg-transparent border border-gray-600 text-white px-6 py-3 rounded-lg font-bold hover:border-white transition-colors flex items-center gap-3">
                            <Smartphone /> Google Play
                        </button>
                    </div>
                </div>
                <div className="md:w-1/2 flex justify-center">
                    <div className="flex gap-4 items-end">
                        <div className="w-32 h-64 bg-slate-700 rounded-2xl border-4 border-slate-600 shadow-2xl skew-y-6 transform translate-y-4"></div>
                        <div className="w-40 h-80 bg-orange-600 rounded-2xl border-4 border-orange-500 shadow-2xl skew-y-6 z-10 relative flex items-center justify-center">
                            <span className="font-bold text-2xl">GX</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DownloadSection;
