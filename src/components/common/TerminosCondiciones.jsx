import React from "react";
import Encabezado from "../Encabezado";
import Footer from "../Footer";

function TerminosCondiciones() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Encabezado />

            <main className="flex-grow container mx-auto px-4 py-12 max-w-4xl">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Términos y Condiciones de Uso</h1>
                    <p className="text-gray-500 mb-8 border-b border-gray-200 pb-4">Última actualización: 24 de febrero de 2026</p>

                    <div className="space-y-8 text-gray-700 leading-relaxed">

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">1. Identificación del Operador</h2>
                            <p>GXNova es una plataforma tecnológica digital operada en la República de Colombia, con domicilio en Popayán, Cauca.</p>
                            <p className="mt-2">Para efectos legales, GXNova actúa exclusivamente como proveedor de servicios digitales de intermediación tecnológica.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">2. Aceptación de los Términos</h2>
                            <p>Al registrarse, acceder o utilizar la plataforma, el usuario declara haber leído, entendido y aceptado estos Términos y Condiciones.</p>
                            <p className="mt-2">Si el usuario no está de acuerdo, deberá abstenerse de utilizar la plataforma.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">3. Naturaleza del Servicio</h2>
                            <p>GXNova es una plataforma digital que facilita el contacto entre:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Personas que requieren servicios u oficios específicos ("Contratantes").</li>
                                <li>Personas que ofrecen dichos servicios ("Prestadores").</li>
                            </ul>
                            <p className="mt-4 font-semibold">GXNova:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>No es agencia de empleo.</li>
                                <li>No es empleador.</li>
                                <li>No actúa como contratista.</li>
                                <li>No dirige ni supervisa la ejecución de los servicios.</li>
                            </ul>
                            <p className="mt-2">Su función se limita a facilitar el contacto entre usuarios.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">4. Inexistencia de Relación Laboral</h2>
                            <p>El uso de GXNova no genera relación laboral, subordinación, mandato, sociedad ni representación entre:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>GXNova y los usuarios.</li>
                                <li>Los usuarios entre sí.</li>
                            </ul>
                            <p className="mt-2">Los Prestadores actúan como trabajadores independientes y son responsables de sus obligaciones legales, fiscales y tributarias conforme a la legislación colombiana.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">5. Requisitos de Registro</h2>
                            <p>Para usar la plataforma, el usuario debe:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Ser mayor de edad según la ley colombiana.</li>
                                <li>Proporcionar información veraz y actualizada.</li>
                                <li>Aceptar los presentes Términos y la Política de Tratamiento de Datos.</li>
                            </ul>
                            <p className="mt-4 font-semibold">GXNova podrá suspender o cancelar cuentas cuando:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Exista suplantación de identidad.</li>
                                <li>Se detecte información falsa.</li>
                                <li>Se incumplan estos Términos.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">6. Verificación de Identidad</h2>
                            <p>GXNova podrá implementar mecanismos de validación de identidad. La verificación no implica certificación de antecedentes judiciales ni garantía de idoneidad profesional.</p>
                            <p className="mt-2 text-gray-900 font-medium">La responsabilidad de verificar referencias adicionales corresponde exclusivamente a los usuarios.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">7. Conductas Prohibidas</h2>
                            <p>Está estrictamente prohibido:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Ofrecer servicios ilícitos.</li>
                                <li>Realizar estafas o fraudes.</li>
                                <li>Intercambios ilícitos o engañosos.</li>
                                <li>Suplantar identidad.</li>
                                <li>Publicar información engañosa.</li>
                                <li>Realizar actos discriminatorios.</li>
                                <li>Utilizar la plataforma para actividades relacionadas con lavado de activos.</li>
                                <li>Amenazar, acosar o intimidar a otros usuarios.</li>
                            </ul>
                            <p className="mt-2 text-red-600 font-medium">GXNova podrá suspender cuentas y reportar conductas a las autoridades competentes en Colombia cuando sea necesario.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">8. Pagos y Trueques</h2>
                            <p>Actualmente, GXNova no procesa pagos ni administra dinero dentro de la plataforma.</p>
                            <p className="mt-2">Los acuerdos de pago o trueque son responsabilidad exclusiva de los usuarios.</p>
                            <p className="mt-2 font-semibold">GXNova no garantiza:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Cumplimiento del pago.</li>
                                <li>Solvencia económica.</li>
                                <li>Calidad del servicio prestado.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">9. Exoneración de Responsabilidad</h2>
                            <p>En la máxima medida permitida por la ley colombiana, GXNova no será responsable por:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Lesiones personales.</li>
                                <li>Accidentes durante la prestación del servicio.</li>
                                <li>Daños materiales.</li>
                                <li>Incumplimientos contractuales entre usuarios.</li>
                                <li>Pérdidas económicas derivadas de acuerdos entre usuarios.</li>
                                <li>Fallas técnicas o interrupciones del servicio.</li>
                            </ul>
                            <div className="mt-4 p-4 bg-orange-50 border-l-4 border-orange-500 rounded-r-md">
                                <p className="font-semibold text-orange-900">Los usuarios reconocen que cualquier encuentro presencial se realiza bajo su propia responsabilidad.</p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">10. Cláusula de Indemnidad</h2>
                            <p>El usuario se obliga a mantener indemne a GXNova frente a cualquier reclamación, demanda, proceso judicial o administrativo derivado de:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Actos propios del usuario.</li>
                                <li>Información falsa suministrada.</li>
                                <li>Incumplimiento de acuerdos con otros usuarios.</li>
                                <li>Conductas ilícitas realizadas a través de la plataforma.</li>
                            </ul>
                            <p className="mt-2">En caso de que GXNova sea vinculada a un proceso por causa atribuible al usuario, este asumirá los costos legales correspondientes.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">11. Protección de Datos Personales</h2>
                            <p>El tratamiento de datos personales se realizará conforme a:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Ley 1581 de 2012.</li>
                                <li>Decreto 1377 de 2013.</li>
                                <li>Decreto 1074 de 2015.</li>
                                <li>Demás normas aplicables.</li>
                            </ul>
                            <p className="mt-2">La información será tratada según la Política de Tratamiento de Datos publicada en la plataforma.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">12. Propiedad Intelectual</h2>
                            <p>El nombre GXNova, su logotipo, diseño, estructura, código, base de datos y contenido digital son propiedad exclusiva de la plataforma.</p>
                            <p className="mt-2 font-medium">Está prohibida su reproducción, distribución o uso no autorizado.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">13. Suspensión y Terminación</h2>
                            <p>GXNova podrá suspender o cancelar cuentas de forma unilateral cuando:</p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Se incumplan estos Términos.</li>
                                <li>Exista riesgo para otros usuarios.</li>
                                <li>Se detecte actividad sospechosa o fraudulenta.</li>
                            </ul>
                            <p className="mt-2">La cancelación no genera derecho a indemnización.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">14. Modificaciones</h2>
                            <p>GXNova podrá modificar estos Términos en cualquier momento.</p>
                            <p className="mt-2">Las modificaciones entrarán en vigor desde su publicación en la plataforma.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-gray-900 mb-3 text-orange-600">15. Legislación Aplicable y Jurisdicción</h2>
                            <p>Estos Términos se rigen por las leyes de la República de Colombia.</p>
                            <p className="mt-2">Cualquier controversia será sometida a la jurisdicción de los jueces competentes de Popayán, Cauca.</p>
                        </section>

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default TerminosCondiciones;
