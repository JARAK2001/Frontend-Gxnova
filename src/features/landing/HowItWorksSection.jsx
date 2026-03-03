import React from 'react';

const HowItWorksSection = () => {
    const steps = [
        {
            number: "01",
            title: "Publica o Busca",
            desc: "Cuéntanos qué necesitas o explora servicios disponibles en tu área.",
            color: "bg-blue-100 text-blue-700"
        },
        {
            number: "02",
            title: "Conecta",
            desc: "Recibe ofertas de profesionales verificados o contacta directamente.",
            color: "bg-orange-100 text-orange-700"
        },
        {
            number: "03",
            title: "Resuelve",
            desc: "Contrata, realiza el trabajo y califica la experiencia al finalizar.",
            color: "bg-green-100 text-green-700"
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-slate-50">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-4xl font-bold text-slate-900 mb-4">¿Cómo funciona?</h2>
                    <p className="text-gray-600 text-lg">
                        Es tan fácil como pedir un taxi. Resuelve tus pendientes en tres pasos.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 relative">
                    {/* Connector Line for Desktop */}
                    <div className="hidden md:block absolute top-12 left-0 w-full h-1 bg-gray-200 -z-10"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="relative flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl mb-6 ${step.color} border-4 border-white shadow-sm`}>
                                {step.number}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{step.title}</h3>
                            <p className="text-gray-600">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
