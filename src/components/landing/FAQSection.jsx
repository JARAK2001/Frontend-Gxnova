import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
    const faqs = [
        { q: "¿Es gratis usar GXNOVA?", a: "Sí, descargar la app y registrarse es totalmente gratuito. Solo cobramos una pequeña comisión al profesional cuando se completa un trabajo." },
        { q: "¿Cómo verifican a los usuarios?", a: "Utilizamos tecnología de reconocimiento facial para cotejar la selfie del usuario con su documento de identidad oficial." },
        { q: "¿Es seguro pagar por la aplicación?", a: "Absolutamente. Usamos pasarelas de pago seguras y retenemos el dinero hasta que confirmas que el trabajo se realizó." },
        { q: "¿Qué hago si tengo un problema?", a: "Contamos con soporte 24/7 desde la aplicación para mediar en cualquier inconveniente." }
    ];

    const [openIndex, setOpenIndex] = useState(null);

    return (
        <section className="py-24 bg-slate-50">
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">Preguntas Frecuentes</h2>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <button
                                className="w-full text-left px-6 py-4 flex items-center justify-between font-bold text-slate-800 hover:bg-gray-50 transition-colors"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                {faq.q}
                                {openIndex === index ? <ChevronUp className="text-orange-600" /> : <ChevronDown className="text-gray-400" />}
                            </button>
                            {openIndex === index && (
                                <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
