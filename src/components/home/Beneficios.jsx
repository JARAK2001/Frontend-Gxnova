import React from 'react';
import { ShieldCheck, RefreshCw, MapPin, Award } from 'lucide-react';

const Beneficios = () => {
    const beneficios = [
        {
            icono: <ShieldCheck className="w-10 h-10 text-emerald-600" />,
            titulo: "Seguridad Verificada",
            descripcion: "Todos los usuarios pasan por un proceso de verificación de identidad. Tu seguridad es nuestra prioridad.",
            color: "bg-emerald-50 border-emerald-100"
        },
        {
            icono: <RefreshCw className="w-10 h-10 text-blue-600" />,
            titulo: "Pagos Flexibles",
            descripcion: "Única plataforma que te permite acordar pagos en dinero o trueque de servicios. Tú decides cómo pagar.",
            color: "bg-blue-50 border-blue-100"
        },
        {
            icono: <MapPin className="w-10 h-10 text-purple-600" />,
            titulo: "Talento Local",
            descripcion: "Encuentra expertos cerca de ti. Fomentamos la economía local y reducimos tiempos de espera.",
            color: "bg-purple-50 border-purple-100"
        },
        {
            icono: <Award className="w-10 h-10 text-orange-600" />,
            titulo: "Sin Comisiones Ocultas",
            descripcion: "Trato directo entre cliente y profesional. Sin intermediarios que encarezcan el servicio.",
            color: "bg-orange-50 border-orange-100"
        }
    ];

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                    <div className="md:w-1/2">
                        <span className="text-orange-600 font-bold text-sm tracking-wider uppercase mb-2 block">
                            Ventajas Exclusivas
                        </span>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                            ¿Por qué elegir <span className="text-orange-600">Gxnova</span>?
                        </h2>
                        <p className="mt-4 text-gray-600 text-lg">
                            Más que una app de servicios, somos una comunidad diseñada para conectar talento con oportunidades reales.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {beneficios.map((beneficio, index) => (
                        <div key={index} className={`p-8 rounded-2xl border ${beneficio.color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                            <div className="mb-6">{beneficio.icono}</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">
                                {beneficio.titulo}
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                {beneficio.descripcion}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Beneficios;
