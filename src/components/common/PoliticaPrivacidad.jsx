import React from "react";
import Encabezado from "../Encabezado";
import Footer from "../Footer";

function PoliticaPrivacidad() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Encabezado />

            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Tratamiento de Datos Personales</h1>
                    <p className="text-gray-500 mb-8 border-b border-gray-200 pb-4">Última actualización: 24 de febrero de 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">1. Identificación del responsable del Tratamiento</h2>
                            <p>GXNova es una plataforma tecnológica digital operada en la República de Colombia, con domicilio en Popayán, Cauca.</p>
                            <p className="mt-2">Para efectos de la Ley 1581 de 2012, GXNova actúa como responsable del Tratamiento de Datos Personales.</p>
                            <p className="mt-2 font-medium">Correo de contacto para asuntos de datos personales: soporte@gxnova.com.co</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">2. Marco Normativo Aplicable</h2>
                            <p>La presente Política se rige por:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Constitución Política de Colombia (Artículo 15).</li>
                                <li>Ley 1581 de 2012.</li>
                                <li>Decreto 1377 de 2013.</li>
                                <li>Decreto 1074 de 2015.</li>
                                <li>Demás normas concordantes y reglamentarias.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">3. Definiciones</h2>
                            <p>Para efectos de esta Política, se adoptan las definiciones establecidas en la Ley 1581 de 2012, incluyendo:</p>
                            <ul className="list-disc pl-5 mt-4 space-y-3">
                                <li><strong>Dato Personal:</strong> Cualquier información vinculada o que pueda asociarse a una persona natural determinada o determinable.</li>
                                <li><strong>Dato Sensible:</strong> Información que afecta la intimidad del Titular o cuyo uso indebido puede generar discriminación.</li>
                                <li><strong>Titular:</strong> Persona natural cuyos datos son objeto de tratamiento.</li>
                                <li><strong>Tratamiento:</strong> Cualquier operación sobre datos personales como recolección, almacenamiento, uso, circulación o supresión.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">4. Datos Personales Recolectados</h2>
                            <p>GXNova podrá recolectar, almacenar y tratar los siguientes datos:</p>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">4.1 Datos de Identificación</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Nombre completo</li>
                                <li>Número de documento de identidad</li>
                                <li>Fecha de nacimiento</li>
                                <li>Fotografía (si aplica)</li>
                                <li>Datos de contacto (correo electrónico, teléfono)</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">4.2 Datos de Perfil</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Información profesional u ocupacional</li>
                                <li>Experiencia laboral</li>
                                <li>Habilidades y servicios ofrecidos</li>
                                <li>Calificaciones o reseñas dentro de la plataforma</li>
                            </ul>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">4.3 Datos Técnicos</h3>
                            <ul className="list-disc pl-5 space-y-1">
                                <li>Dirección IP</li>
                                <li>Tipo de dispositivo</li>
                                <li>Información del navegador</li>
                                <li>Datos de navegación</li>
                            </ul>

                            <p className="mt-4 font-medium text-orange-800 bg-orange-50 p-3 rounded-lg">GXNova no solicita datos sensibles salvo que sea estrictamente necesario y con autorización expresa.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">5. Finalidades del Tratamiento</h2>
                            <p>Los datos personales serán utilizados para:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-1">
                                <li>Permitir el registro y uso de la plataforma.</li>
                                <li>Verificar identidad de los usuarios.</li>
                                <li>Facilitar la conexión entre Empleadores y Trabajadores.</li>
                                <li>Mejorar la experiencia del usuario.</li>
                                <li>Prevenir fraude o suplantación.</li>
                                <li>Cumplir obligaciones legales.</li>
                                <li>Atender peticiones, quejas y reclamos.</li>
                                <li>Enviar comunicaciones relacionadas con el funcionamiento de la plataforma.</li>
                            </ol>
                            <p className="mt-4 font-bold">GXNova no comercializa datos personales.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">6. Autorización del Titular</h2>
                            <p>El tratamiento de datos se realizará únicamente con la autorización previa, expresa e informada del Titular, la cual podrá obtenerse mediante:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Aceptación digital durante el registro.</li>
                                <li>Marcación de casilla de aceptación.</li>
                                <li>Cualquier otro mecanismo válido conforme a la ley.</li>
                            </ul>
                            <p className="mt-2 text-gray-900 font-medium">El Titular podrá revocar la autorización en cualquier momento, salvo cuando exista un deber legal o contractual que impida su eliminación inmediata.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">7. Derechos del Titular</h2>
                            <p>El Titular tiene derecho a:</p>
                            <ol className="list-decimal pl-5 mt-2 space-y-1">
                                <li>Conocer, actualizar y rectificar sus datos.</li>
                                <li>Solicitar prueba de la autorización otorgada.</li>
                                <li>Ser informado sobre el uso de sus datos.</li>
                                <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
                                <li>Revocar la autorización y solicitar la supresión del dato.</li>
                                <li>Acceder gratuitamente a sus datos personales.</li>
                            </ol>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">8. Procedimiento para Consultas y Reclamos</h2>
                            <p>Las consultas y reclamos deberán enviarse a nuestro correo oficial.</p>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">8.1 Consultas</h3>
                            <p>Serán atendidas en un término máximo de diez (10) días hábiles.</p>

                            <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-800">8.2 Reclamos</h3>
                            <p>Serán atendidos en un término máximo de quince (15) días hábiles.</p>
                            <p className="mt-1">Si no es posible atender dentro del término, se informará al interesado los motivos de la demora.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">9. Medidas de Seguridad</h2>
                            <p>GXNova implementa medidas técnicas, humanas y administrativas razonables para:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Evitar acceso no autorizado.</li>
                                <li>Prevenir adulteración, pérdida o uso indebido.</li>
                                <li>Proteger la confidencialidad e integridad de la información.</li>
                            </ul>
                            <p className="mt-2 text-gray-500 italic">Sin embargo, el usuario reconoce que ningún sistema es completamente invulnerable.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">10. Transferencia y Transmisión de Datos</h2>
                            <p>GXNova podrá transmitir datos a:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Proveedores tecnológicos.</li>
                                <li>Servicios de hosting o almacenamiento en la nube.</li>
                            </ul>
                            <p className="mt-2">En caso de transferencia internacional de datos, se garantizará el cumplimiento de estándares adecuados de protección conforme a la normativa colombiana.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">11. Conservación de la Información</h2>
                            <p>Los datos serán conservados mientras:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Exista relación activa con el usuario.</li>
                                <li>Sea necesario para cumplir obligaciones legales.</li>
                                <li>Exista finalidad legítima del tratamiento.</li>
                            </ul>
                            <p className="mt-2 font-medium">Posteriormente serán eliminados o anonimizados.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">12. Menores de Edad</h2>
                            <p>GXNova está dirigida exclusivamente a mayores de edad. No se realiza tratamiento intencional de datos de menores.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">13. Cláusula de Indemnidad</h2>
                            <p>El usuario declara que la información suministrada es veraz y autoriza a GXNova a tratarla conforme a esta Política.</p>
                            <p className="mt-2 font-medium text-red-600">GXNova no será responsable por información falsa suministrada por los usuarios.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">14. Modificaciones</h2>
                            <p>GXNova podrá modificar esta Política en cualquier momento. Las actualizaciones serán publicadas en la plataforma.</p>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default PoliticaPrivacidad;
