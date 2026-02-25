import React from "react";
import { useNavigate } from "react-router-dom";

function Footer() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t-4 border-orange-600 text-white mt-16">
            <div className="container mx-auto px-6 py-12 max-w-7xl">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    <div>
                        <h3 className="text-2xl font-extrabold mb-4 flex items-center gap-2">
                            <span className="text-orange-500">GX</span>Nova
                        </h3>
                        <p className="text-slate-400 text-sm leading-relaxed mb-6">
                            La plataforma líder en Colombia para conectar talento experto con oportunidades reales. Seguridad, confianza y flexibilidad en cada acuerdo.
                        </p>
                        <div className="flex gap-4">
                            {['facebook', 'twitter', 'instagram', 'linkedin'].map(red => (
                                <button key={red} className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center hover:bg-orange-600 transition-colors text-slate-400 hover:text-white">
                                    <span className="sr-only">{red}</span>
                                    <div className="w-4 h-4 bg-current rounded-sm"></div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white border-b border-slate-800 pb-2 inline-block">Compañía</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><button onClick={() => navigate("/")} className="hover:text-orange-500 transition-colors">Inicio</button></li>
                            <li><button onClick={() => navigate("/servicios")} className="hover:text-orange-500 transition-colors">Explorar Servicios</button></li>
                            <li><button className="hover:text-orange-500 transition-colors cursor-not-allowed opacity-70">Sobre Nosotros (Pronto)</button></li>
                            <li><button className="hover:text-orange-500 transition-colors cursor-not-allowed opacity-70">Carreras</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white border-b border-slate-800 pb-2 inline-block">Soporte</h4>
                        <ul className="space-y-3 text-sm text-slate-400">
                            <li><button className="hover:text-orange-500 transition-colors cursor-not-allowed opacity-70">Centro de Ayuda</button></li>
                            <li><button className="hover:text-orange-500 transition-colors cursor-not-allowed opacity-70">Normas de la Comunidad</button></li>
                            <li><button className="hover:text-orange-500 transition-colors cursor-not-allowed opacity-70">Política de Privacidad</button></li>
                            <li><button className="hover:text-orange-500 transition-colors cursor-not-allowed opacity-70">Términos y Condiciones</button></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6 text-white border-b border-slate-800 pb-2 inline-block">Contacto</h4>
                        <ul className="space-y-4 text-sm text-slate-400">
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-orange-500">📧</span>
                                <div>
                                    <p className="font-semibold text-white">Email</p>
                                    <a href="mailto:soporte@gxnova.com" className="hover:text-orange-500 transition-colors">soporte@gxnova.com</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-orange-500">📱</span>
                                <div>
                                    <p className="font-semibold text-white">WhatsApp</p>
                                    <a href="https://wa.me/573000000000" target="_blank" rel="noopener noreferrer" className="hover:text-orange-500 transition-colors">+57 300 598 1738</a>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="mt-1 text-orange-500">📍</span>
                                <div>
                                    <p className="font-semibold text-white">Ubicación</p>
                                    <p>Popayan, Cauca, Colombia</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
                    <p>© {currentYear} GXNova. Hecho con ❤️ en Colombia. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;

