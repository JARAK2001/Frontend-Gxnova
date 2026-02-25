import React from 'react';
import { Smartphone, Shield, Star, Briefcase } from 'lucide-react';

const StatsSection = () => {
    const stats = [
        { number: "+10k", label: "Descargas Totales", icon: <Smartphone className="w-6 h-6 text-orange-600" /> },
        { number: "+5k", label: "Expertos Verificados", icon: <Shield className="w-6 h-6 text-orange-600" /> },
        { number: "4.8", label: "Calificación Promedio", icon: <Star className="w-6 h-6 text-orange-600" /> },
        { number: "+20", label: "Categorías de Servicio", icon: <Briefcase className="w-6 h-6 text-orange-600" /> },
    ];

    return (
        <section className="py-10 bg-white border-b border-gray-100">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-4 hover:bg-orange-50 rounded-xl transition-colors">
                            <div className="mb-2 p-2 bg-orange-100 rounded-lg">{stat.icon}</div>
                            <h3 className="text-3xl font-bold text-slate-900">{stat.number}</h3>
                            <p className="text-gray-600 font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
