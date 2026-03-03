import React from 'react';
import { Shield, Zap, Search } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            icon: <Shield className="w-8 h-8 text-orange-600" />,
            title: "Identidad Verificada",
            desc: "Todos los usuarios pasan por un proceso de verificación facial con IA para tu seguridad."
        },
        {
            icon: <Zap className="w-8 h-8 text-orange-600" />,
            title: "Rápido y Fácil",
            desc: "Publica un trabajo o postúlate en segundos. Sin papeleos ni complicaciones."
        },
        {
            icon: <Search className="w-8 h-8 text-orange-600" />,
            title: "Encuentra de Todo",
            desc: "Desde plomería hasta programación. Cientos de categorías a tu disposición."
        }
    ];

    return (
        <section id="features" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">La seguridad es nuestra prioridad</h2>
                    <p className="text-gray-600 text-lg">
                        Diseñamos GXNOVA pensando en la confianza. Conoce por qué somos la plataforma más segura.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {features.map((f, i) => (
                        <div key={i} className="bg-gray-50 p-8 rounded-2xl hover:bg-orange-50 transition-colors group">
                            <div className="w-16 h-16 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{f.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
