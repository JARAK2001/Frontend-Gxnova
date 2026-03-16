import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Star, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Swal from 'sweetalert2';
import API_URL from '../config/api';

const PricingPage = () => {
  const { user, login } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);
  const [loading, setLoading] = useState(false);

  // Definir planes según el rol del usuario autenticado o mostrar opciones genéricas si no hay usuario
  const isWorker = user?.roles?.includes('TRABAJADOR');
  const isEmployer = user?.roles?.includes('EMPLEADOR');

  const workerPlans = [
    {
      name: 'Plan Básico',
      description: 'Perfecto para empezar a ofrecer tus servicios.',
      monthlyPrice: '0',
      annualPrice: '0',
      features: [
        'Postulación a 3 trabajos por mes',
        'Perfil estándar en el directorio',
        'Soporte comunitario'
      ],
      buttonText: user?.nivel_suscripcion === 'free' ? 'Plan Actual' : 'Empezar Gratis',
      isPremium: false
    },
    {
      name: 'Profesional Premium',
      description: 'Lleva tu carrera al siguiente nivel y consigue más clientes.',
      monthlyPrice: '9.99',
      annualPrice: '99',
      features: [
        'Postulaciones ilimitadas',
        'Visibilidad prioritaria en búsquedas',
        'Insignia de Profesional Premium',
        'Verificación por IA prioritaria',
        'Analíticas de perfil',
        'Soporte prioritario 24/7'
      ],
      buttonText: user?.nivel_suscripcion === 'premium' ? 'Plan Actual' : 'Mejorar a Premium',
      isPremium: true
    }
  ];

  const employerPlans = [
    {
      name: 'Plan Básico',
      description: 'Encuentra talento para proyectos puntuales.',
      monthlyPrice: '0',
      annualPrice: '0',
      features: [
        'Publicar hasta 2 ofertas por mes',
        'Acceso al directorio de trabajadores',
        'Soporte estándar'
      ],
      buttonText: user?.nivel_suscripcion === 'free' ? 'Plan Actual' : 'Empezar Gratis',
      isPremium: false
    },
    {
      name: 'Empresa Premium',
      description: 'Para empresas que contratan talento frecuentemente.',
      monthlyPrice: '19.99',
      annualPrice: '199',
      features: [
        'Publicación de ofertas ilimitadas',
        'Acceso anticipado a nuevos talentos',
        'Filtro exclusivo para perfiles "Verificados por IA"',
        'Descuento en tarifas de comisión',
        'Soporte prioritario y asistencia'
      ],
      buttonText: user?.nivel_suscripcion === 'premium' ? 'Plan Actual' : 'Mejorar a Premium',
      isPremium: true
    }
  ];

  // Si no hay sesión, mostrar planes de trabajadores por defecto
  const plansToDisplay = isEmployer ? employerPlans : workerPlans;

  const handleUpgrade = async () => {
    if (!user) {
        Swal.fire({
            icon: 'info',
            title: 'Inicia Sesión',
            text: 'Debes iniciar sesión para mejorar tu plan.',
            background: 'rgba(255, 255, 255, 0.9)',
            confirmButtonColor: '#f97316'
        });
        return;
    }

    setLoading(true);
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/subscriptions/upgrade`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            // Actualizar contexto/localstorage (Simulación básica asumiendo la estructura del user context)
            const updatedUser = { ...user, nivel_suscripcion: 'premium', suscripcion_fin: data.subscription.suscripcion_fin };
            login(updatedUser, token);

            Swal.fire({
                icon: 'success',
                title: '¡Suscripción Activada!',
                text: 'Ahora eres Premium. Disfruta de todos tus nuevos beneficios.',
                background: 'rgba(255, 255, 255, 0.9)',
                confirmButtonColor: '#f97316'
            });
        } else {
            throw new Error('Error al actualizar la suscripción');
        }
    } catch (error) {
        console.error('Upgrade error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al procesar tu solicitud. Inténtalo de nuevo.',
            background: 'rgba(255, 255, 255, 0.9)',
            confirmButtonColor: '#f97316'
        });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-16">
      
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="absolute inset-x-0 top-0 h-1/2 bg-orange-100 opacity-50 pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
          <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Planes y Precios Simples
            </h1>
            <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
              {isEmployer 
                ? 'Encuentra el mejor talento verificado con las herramientas premium para empresas.'
                : 'Destaca tu perfil, consigue más clientes y aumenta tus ingresos con nuestros planes para profesionales.'}
            </p>
          </motion.div>

          <div className="mt-8 flex justify-center">
            <div className="relative flex items-center p-1 bg-white border rounded-full shadow-sm">
              <button
                onClick={() => setIsAnnual(false)}
                className={`relative w-1/2 rounded-full py-2 px-6 text-sm font-semibold transition-colors ${
                  !isAnnual ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {!isAnnual && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-orange-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
                <span className="relative z-10">Mensual</span>
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`relative w-1/2 rounded-full py-2 px-6 text-sm font-semibold transition-colors ${
                  isAnnual ? 'text-white' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {isAnnual && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-orange-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  />
                )}
                <span className="relative z-10">Anual <span className="ml-1 text-xs text-orange-200">-15%</span></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 -mt-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plansToDisplay.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`
                relative bg-white/80 backdrop-blur-md rounded-2xl shadow-xl overflow-hidden flex flex-col
                ${plan.isPremium ? 'border-2 border-orange-500' : 'border border-gray-100'}
              `}
            >
              {plan.isPremium && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-orange-400 to-orange-600" />
              )}
              
              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  {plan.isPremium && <Star className="h-6 w-6 text-orange-500 fill-orange-500" />}
                </div>
                <p className="text-gray-500 mb-6 min-h-[48px]">{plan.description}</p>
                
                <div className="flex items-baseline mb-8">
                  <span className="text-5xl font-extrabold text-gray-900">
                    ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                  </span>
                  <span className="text-xl text-gray-500 ml-2">/{isAnnual ? 'año' : 'mes'}</span>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center rounded-full bg-orange-100 mr-3">
                        <Check className="h-4 w-4 text-orange-600" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 bg-gray-50/50 mt-auto">
                <button
                  onClick={plan.isPremium && user?.nivel_suscripcion !== 'premium' ? handleUpgrade : null}
                  disabled={loading || (plan.isPremium && user?.nivel_suscripcion === 'premium') || (!plan.isPremium)}
                  className={`
                    w-full flex items-center justify-center py-3 px-4 rounded-xl text-base font-medium transition-all duration-200
                    ${plan.isPremium 
                      ? user?.nivel_suscripcion === 'premium'
                        ? 'bg-green-100 text-green-800 cursor-default'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-lg hover:-translate-y-0.5' 
                      : 'bg-gray-100 text-gray-900 cursor-default'}
                  `}
                >
                  {loading && plan.isPremium ? (
                    <span className="animate-spin mr-2 border-2 border-white border-t-transparent rounded-full h-4 w-4" />
                  ) : null}
                  {plan.buttonText}
                  {plan.isPremium && user?.nivel_suscripcion !== 'premium' && <ArrowRight className="ml-2 h-5 w-5" />}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust/Security Section */}
        <div className="mt-16 text-center max-w-2xl mx-auto bg-white/60 p-6 rounded-2xl backdrop-blur-sm border border-gray-100">
            <div className="flex justify-center items-center mb-4">
                <div className="bg-orange-100 p-3 rounded-full">
                   <Shield className="h-8 w-8 text-orange-600" />
                </div>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Seguridad y Confianza Garantizadas</h4>
            <p className="text-gray-600 text-sm">
                Nuestros planes premium incluyen verificación de identidad prioritaria impulsada por Inteligencia Artificial. Esto asegura una red de profesionales y empresas de la más alta calidad y confianza en toda la plataforma.
            </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
