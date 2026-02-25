import React from 'react';
import { Star } from 'lucide-react';

const TestimonialsSection = () => {
    const reviews = [
        {
            name: "María González",
            role: "Usuaria",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
            text: "¡Increíble! Encontré un plomero en menos de 10 minutos. Llegó súper rápido y el precio fue justo.",
            stars: 5
        },
        {
            name: "Carlos Rodriguez",
            role: "Electricista",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos",
            text: "GXNOVA me ha ayudado a conseguir clientes constantes. La App es muy fácil de usar y segura.",
            stars: 5
        },
        {
            name: "Ana Martínez",
            role: "Usuaria",
            img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ana",
            text: "Me siento segura sabiendo que verifican la identidad de todos. Recomendadísima.",
            stars: 4
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Lo que dicen de nosotros</h2>
                    <p className="text-gray-600 text-lg">
                        Personas reales resolviendo problemas reales.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <div key={index} className="bg-orange-50 p-8 rounded-2xl relative">
                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-5 h-5 ${i < review.stars ? "fill-orange-500 text-orange-500" : "text-gray-300"}`} />
                                ))}
                            </div>
                            <p className="text-slate-700 italic mb-6">"{review.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden">
                                    <img src={review.img} alt={review.name} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">{review.name}</h4>
                                    <p className="text-sm text-gray-500">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;
