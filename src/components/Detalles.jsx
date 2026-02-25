import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API_URL from '../config/api';
import Encabezado from "./Encabezado";
import ModalCalificar from "./calificaciones/ModalCalificar";
import ModalPerfilTrabajador from "./perfil/ModalPerfilTrabajador";
import Estrellas from "./common/Estrellas";
import ConfirmacionTransaccion from "./transaccion/ConfirmacionTransaccion";
import { FileText, DollarSign, MapPin, Calendar, User, ClipboardList, MessageSquare, Rocket, Check, X, Clock } from 'lucide-react';


function Detalles() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trabajo, setTrabajo] = useState(null);
    const [postulaciones, setPostulaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [mensaje, setMensaje] = useState("");
    const [mostrarFormPostulacion, setMostrarFormPostulacion] = useState(false);

    // Estados para calificaciones
    const [modalCalificarOpen, setModalCalificarOpen] = useState(false);
    const [modalPerfilOpen, setModalPerfilOpen] = useState(false);
    const [trabajadorSeleccionado, setTrabajadorSeleccionado] = useState(null);
    const [miCalificacion, setMiCalificacion] = useState(null);
    const [usuarioAReceptar, setUsuarioAReceptar] = useState(null);

    // Estado para la transacción del trabajo en curso
    const [transaccion, setTransaccion] = useState(null);


    useEffect(() => {
        cargarUsuario();
        cargarTrabajo();
        cargarPostulaciones();
    }, [id]);


    useEffect(() => {
        if (usuario && trabajo) {
            verificarSiYaCalifico();
            determinarUsuarioAReceptar();
            // Cargar transacción si el trabajo está en curso o completado
            if (trabajo.estado === 'en_proceso' || trabajo.estado === 'completado') {
                cargarTransaccion();
            }
        }
    }, [usuario, trabajo, postulaciones]);


    const cargarUsuario = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/usuarios/perfil`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) setUsuario(data.usuario);
        } catch (error) {
            console.error("Error cargando usuario:", error);
        }
    };

    const cargarTrabajo = async () => {
        setLoading(true);
        try {
            const respuesta = await fetch(`${API_URL}/api/trabajos/${id}`);
            const data = await respuesta.json();
            if (data.trabajo) {
                setTrabajo(data.trabajo);
            }
        } catch (error) {
            console.error("Error al cargar trabajo:", error);
        } finally {
            setLoading(false);
        }
    };

    const cargarTransaccion = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const postulacionAceptada = postulaciones.find(p => p.estado === 'aceptada');
            if (!postulacionAceptada) return;

            // Intentar obtener id_acuerdo desde la postulación (si ya viene vinculado)
            let idAcuerdo = postulacionAceptada?.acuerdo?.id_acuerdo;

            // Fallback: buscar el acuerdo por id_trabajo + id_trabajador
            if (!idAcuerdo) {
                const resAcuerdo = await fetch(
                    `${API_URL}/api/acuerdos?id_trabajo=${id}&id_trabajador=${postulacionAceptada.id_trabajador}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const dataAcuerdo = await resAcuerdo.json();
                if (dataAcuerdo.acuerdos && dataAcuerdo.acuerdos.length > 0) {
                    idAcuerdo = dataAcuerdo.acuerdos[0].id_acuerdo;
                }
            }

            if (!idAcuerdo) return;

            const res = await fetch(
                `${API_URL}/api/transacciones?id_acuerdo=${idAcuerdo}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            if (data.transacciones && data.transacciones.length > 0) {
                setTransaccion(data.transacciones[0]);
            }
        } catch (error) {
            console.error("Error cargando transacción:", error);
        }
    };

    const cargarPostulaciones = async () => {

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const respuesta = await fetch(
                `${API_URL}/api/postulaciones?id_trabajo=${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data = await respuesta.json();
            if (data.postulaciones) {
                setPostulaciones(data.postulaciones);
            }
        } catch (error) {
            console.error("Error al cargar postulaciones:", error);
        }
    };

    const determinarUsuarioAReceptar = () => {
        if (!usuario || !trabajo) return;

        // Si soy el empleador, busco al trabajador aceptado via postulaciones
        if (usuario.id_usuario === trabajo.id_empleador) {
            const postulacionAceptada = postulaciones.find(p => p.estado === 'aceptada');
            if (postulacionAceptada) {
                setUsuarioAReceptar(postulacionAceptada.trabajador);
            }
        }
        // Si soy un trabajador aceptado, el receptor es el empleador
        else {
            const soyTrabajadorAceptado = postulaciones.some(
                p => p.id_trabajador === usuario.id_usuario && p.estado === 'aceptada'
            );
            if (soyTrabajadorAceptado) {
                setUsuarioAReceptar(trabajo.empleador); // Asumiendo que trabajo incluye datos del empleador
            }
        }
    };

    const verificarSiYaCalifico = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/verificar?id_trabajo=${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.yaCalifico) {
                setMiCalificacion(data.calificacion);
            }
        } catch (error) {
            console.error("Error verificando calificación:", error);
        }
    };

    const handleCalificar = async (datos) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/calificaciones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_trabajo: id,
                    id_usuario_receptor: usuarioAReceptar.id_usuario,
                    puntuacion: datos.puntuacion,
                    comentario: datos.comentario
                }),
            });

            if (res.ok) {
                alert("✅ Calificación enviada exitosamente");
                verificarSiYaCalifico();
            } else {
                const data = await res.json();
                alert(`❌ Error: ${data.error}`);
            }
        } catch (error) {
            console.error("Error al calificar:", error);
            alert("Error de conexión");
        }
    };

    const handlePostular = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Debes iniciar sesión para postularte");
            navigate("/auth");
            return;
        }

        try {
            const respuesta = await fetch(`${API_URL}/api/postulaciones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_trabajo: parseInt(id),
                    mensaje: mensaje,
                }),
            });

            const data = await respuesta.json();

            if (respuesta.ok) {
                alert("✅ Postulación enviada exitosamente");
                setMensaje("");
                setMostrarFormPostulacion(false);
                cargarPostulaciones();
            } else {
                alert(`❌ Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error("Error al postular:", error);
            alert("❌ Error de conexión con el servidor");
        }
    };

    const handleGestionarPostulacion = async (idPostulacion, accion) => {
        if (!window.confirm(`¿Estás seguro de ${accion} esta postulación?`)) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/postulaciones/${idPostulacion}/${accion}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.ok) {
                alert(`✅ Postulación ${accion === 'aceptar' ? 'aceptada' : 'rechazada'} correctamente`);
                cargarPostulaciones();
                cargarTrabajo();
            } else {
                const data = await res.json();
                alert(`❌ Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error(`Error al ${accion} postulacion:`, error);
        }
    };

    const formatearPrecio = (monto) => {
        if (!monto) return "A convenir";
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(monto);
    };

    const formatearFecha = (fecha) => {
        if (!fecha) return "No especificada";
        return new Date(fecha).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">Cargando detalles...</p>
                </div>
            </div>
        );
    }

    if (!trabajo) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">Trabajo no encontrado</p>
                    <button
                        onClick={() => navigate("/servicios")}
                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                    >
                        Volver a Servicios
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-6xl">
                <button
                    onClick={() => navigate("/servicios")}
                    className="mb-6 text-orange-600 hover:text-orange-700 flex items-center gap-2 font-medium transition-colors"
                >
                    ← Volver a Servicios
                </button>

                {/* Layout de dos columnas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Columna Principal */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Información Principal */}
                        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex gap-2 flex-wrap">
                                    <span className="px-4 py-1.5 bg-gradient-to-r from-orange-100 to-orange-50 text-orange-800 text-sm font-semibold rounded-full border border-orange-200">
                                        {trabajo.categoria?.nombre || "Sin categoría"}
                                    </span>
                                    <span className={`px-4 py-1.5 text-sm font-semibold rounded-full capitalize border ${trabajo.estado === 'publicado' ? 'bg-green-50 text-green-700 border-green-200' :
                                        trabajo.estado === 'en_proceso' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                            trabajo.estado === 'completado' ? 'bg-gray-50 text-gray-700 border-gray-200' :
                                                'bg-yellow-50 text-yellow-700 border-yellow-200'
                                        }`}>
                                        {trabajo.estado === 'en_proceso' ? 'En Proceso' : trabajo.estado.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">{trabajo.titulo}</h1>

                            {/* Foto del Trabajo */}
                            {trabajo.foto && (
                                <div className="mb-8">
                                    <img
                                        src={trabajo.foto.startsWith('http') ? trabajo.foto : `${API_URL}${trabajo.foto}`}
                                        alt="Foto del trabajo"
                                        className="w-full rounded-xl shadow-lg object-cover max-h-[500px] border border-gray-200"
                                    />
                                </div>
                            )}

                            {/* Descripción */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="text-orange-600">📋</span> Descripción
                                </h2>
                                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{trabajo.descripcion}</p>
                            </div>

                            {/* LÓGICA DE BOTONES DE ACCIÓN (Postular / Calificar) */}

                            {/* Trabajo Completado -> Mostrar Calificación */}
                            {trabajo.estado === 'completado' && usuarioAReceptar && (
                                <div className="mt-6 p-6 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <span>⭐</span> Calificación del Servicio
                                    </h3>
                                    {miCalificacion ? (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-2">Ya calificaste este servicio:</p>
                                            <Estrellas puntuacion={miCalificacion.puntuacion} />
                                            {miCalificacion.comentario && (
                                                <p className="text-gray-700 mt-3 italic bg-white p-4 rounded-lg">"{miCalificacion.comentario}"</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="text-gray-700 mb-4">El trabajo ha finalizado. Por favor califica a <strong>{usuarioAReceptar.nombre}</strong>.</p>
                                            <button
                                                onClick={() => setModalCalificarOpen(true)}
                                                className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold rounded-lg hover:from-yellow-600 hover:to-amber-600 transition-all shadow-md hover:shadow-lg"
                                            >
                                                ★ Calificar Usuario
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}


                            {/* Trabajo Publicado -> Postularse */}
                            {trabajo.estado === 'publicado' && (!usuario || usuario.id_usuario !== trabajo.id_empleador) && (
                                <button
                                    onClick={() => {
                                        const token = localStorage.getItem("token");
                                        if (!token) {
                                            alert("Debes iniciar sesión para postularte");
                                            navigate("/auth");
                                        } else {
                                            setMostrarFormPostulacion(!mostrarFormPostulacion);
                                        }
                                    }}
                                    className="w-full px-8 py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl text-lg"
                                >
                                    {mostrarFormPostulacion ? (
                                        <><X className="w-5 h-5" /> Cancelar Postulación</>
                                    ) : (
                                        <><Rocket className="w-5 h-5" /> Postularme a este Trabajo</>
                                    )}
                                </button>
                            )}

                            {/* Trabajo en_proceso -> Flujo de doble confirmación (empleador y trabajador) */}
                            {trabajo.estado === 'en_proceso' && usuario && transaccion && (
                                (() => {
                                    const postulacionAceptada = postulaciones.find(p => p.estado === 'aceptada');
                                    const idTrabajadorAceptado = postulacionAceptada?.id_trabajador;
                                    return (
                                        <ConfirmacionTransaccion
                                            transaccion={transaccion}
                                            idUsuario={usuario.id_usuario}
                                            idEmpleador={trabajo.id_empleador}
                                            idTrabajador={idTrabajadorAceptado}
                                            onActualizado={() => {
                                                cargarTrabajo();
                                                cargarTransaccion();
                                            }}
                                        />
                                    );
                                })()
                            )}

                            {/* Trabajo en_proceso sin transacción creada (empleador debe crear la transacción) */}
                            {trabajo.estado === 'en_proceso' && usuario && usuario.id_usuario === trabajo.id_empleador && !transaccion && (
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 mt-6">
                                    <h3 className="text-xl font-bold text-orange-900 mb-3 flex items-center gap-2">
                                        <span>⏳</span> Trabajo en Curso
                                    </h3>
                                    <p className="text-orange-800 mb-4 leading-relaxed">
                                        El trabajo está en progreso. Cuando realices el pago, crea la transacción para iniciar el proceso de confirmación.
                                    </p>
                                    <button
                                        id="btn-crear-transaccion"
                                        onClick={async () => {
                                            const token = localStorage.getItem("token");
                                            const postulacionAceptada = postulaciones.find(p => p.estado === 'aceptada');
                                            if (!postulacionAceptada) {
                                                alert("No se encontró una postulación aceptada.");
                                                return;
                                            }

                                            // Buscar id_acuerdo: primero en la postulacion, luego por API
                                            let idAcuerdo = postulacionAceptada?.acuerdo?.id_acuerdo;
                                            if (!idAcuerdo) {
                                                try {
                                                    const resAcuerdo = await fetch(
                                                        `${API_URL}/api/acuerdos?id_trabajo=${trabajo.id_trabajo}&id_trabajador=${postulacionAceptada.id_trabajador}`,
                                                        { headers: { Authorization: `Bearer ${token}` } }
                                                    );
                                                    const dataAcuerdo = await resAcuerdo.json();
                                                    if (dataAcuerdo.acuerdos && dataAcuerdo.acuerdos.length > 0) {
                                                        idAcuerdo = dataAcuerdo.acuerdos[0].id_acuerdo;
                                                    }
                                                } catch (_) { }
                                            }

                                            if (!idAcuerdo) {
                                                // Crear acuerdo automáticamente si no existe
                                                try {
                                                    const postulacionAceptadaLocal = postulaciones.find(p => p.estado === 'aceptada');
                                                    const resCrear = await fetch(`${API_URL}/api/acuerdos`, {
                                                        method: "POST",
                                                        headers: {
                                                            "Content-Type": "application/json",
                                                            Authorization: `Bearer ${token}`
                                                        },
                                                        body: JSON.stringify({
                                                            id_trabajo: trabajo.id_trabajo,
                                                            id_trabajador: postulacionAceptadaLocal?.id_trabajador,
                                                            tipo_pago: trabajo.tipo_pago,
                                                            valor_acordado: trabajo.monto_pago,
                                                            detalle_trueque: trabajo.descripcion_trueque
                                                        })
                                                    });
                                                    const dataCrear = await resCrear.json();
                                                    if (resCrear.ok && dataCrear.acuerdo) {
                                                        idAcuerdo = dataCrear.acuerdo.id_acuerdo;
                                                    } else {
                                                        alert("No se pudo crear el acuerdo. Por favor reintenta.");
                                                        return;
                                                    }
                                                } catch (_) {
                                                    alert("Error de conexión al crear el acuerdo.");
                                                    return;
                                                }
                                            }

                                            try {
                                                const res = await fetch(`${API_URL}/api/transacciones`, {
                                                    method: "POST",
                                                    headers: {
                                                        "Content-Type": "application/json",
                                                        Authorization: `Bearer ${token}`
                                                    },
                                                    body: JSON.stringify({
                                                        id_acuerdo: idAcuerdo,
                                                        tipo_pago: trabajo.tipo_pago
                                                    })
                                                });
                                                if (res.ok) {
                                                    await cargarPostulaciones();
                                                    await cargarTransaccion();
                                                } else {
                                                    const data = await res.json();
                                                    alert(`Error: ${data.error}`);
                                                }
                                            } catch (e) {
                                                console.error(e);
                                                alert("Error de conexión");
                                            }
                                        }}
                                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                                    >
                                        🧾 Iniciar Proceso de Pago
                                    </button>
                                </div>
                            )}

                            {/* Mensaje al trabajador cuando no hay transacción aún */}
                            {trabajo.estado === 'en_proceso' && usuario && usuario.id_usuario !== trabajo.id_empleador && !transaccion && (
                                <div className="mt-6 p-5 bg-blue-50 border-2 border-blue-200 rounded-xl">
                                    <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
                                        <Clock className="w-5 h-5" /> Trabajo en Progreso
                                    </h3>
                                    <p className="text-blue-800 text-sm">
                                        El empleador aún no ha iniciado el proceso de pago. Recibirás una notificación cuando esté listo para confirmar.
                                    </p>
                                </div>
                            )}


                            {mostrarFormPostulacion && (
                                <form onSubmit={handlePostular} className="mt-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-gray-200">
                                    <label className="block text-sm font-bold text-gray-700 mb-3">
                                        Mensaje (opcional)
                                    </label>
                                    <textarea
                                        value={mensaje}
                                        onChange={(e) => setMensaje(e.target.value)}
                                        className="w-full rounded-lg border-2 border-gray-300 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 mb-4 transition-all"
                                        rows="4"
                                        placeholder="Escribe un mensaje para el empleador..."
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-lg hover:from-orange-700 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                                    >
                                        Enviar Postulación
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Columna Lateral - Información */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Card de Pago */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-600" /> Pago
                            </h3>
                            <p className="text-3xl font-bold text-gray-900 mb-2">
                                {trabajo.tipo_pago === "dinero"
                                    ? formatearPrecio(trabajo.monto_pago)
                                    : "Trueque"}
                            </p>
                            {trabajo.tipo_pago === "trueque" && trabajo.descripcion_trueque && (
                                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-2">
                                    {trabajo.descripcion_trueque}
                                </p>
                            )}
                        </div>

                        {/* Card de Ubicación */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-blue-600" /> Ubicación
                            </h3>
                            <p className="text-gray-700 font-medium">{trabajo.ubicacion}</p>
                        </div>

                        {/* Card de Fecha */}
                        {trabajo.fecha_estimada && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-purple-600" /> Fecha Estimada
                                </h3>
                                <p className="text-gray-700 font-medium">
                                    {formatearFecha(trabajo.fecha_estimada)}
                                </p>
                            </div>
                        )}

                        {/* Card de Empleador */}
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl shadow-lg p-6 border-2 border-orange-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                                <User className="w-5 h-5 text-orange-600" /> Publicado por
                            </h3>
                            <p className="text-gray-900 font-bold text-lg">
                                {trabajo.empleador?.nombre} {trabajo.empleador?.apellido}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Postulaciones */}
                {postulaciones.length > 0 && (
                    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg p-6 border border-gray-100">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                <ClipboardList className="w-8 h-8 text-orange-600" />
                                Postulaciones
                                <span className="ml-2 px-3 py-1 bg-orange-100 text-orange-800 text-sm font-semibold rounded-full">
                                    {postulaciones.length}
                                </span>
                            </h2>
                        </div>
                        <div className="space-y-4">
                            {postulaciones.map((post) => (
                                <div
                                    key={post.id_postulacion}
                                    className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:shadow-xl hover:border-orange-200 transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                {/* Avatar inicial */}
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                    {post.trabajador?.nombre?.[0]}{post.trabajador?.apellido?.[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="font-bold text-gray-900 text-lg">
                                                            {post.trabajador?.nombre} {post.trabajador?.apellido}
                                                        </p>
                                                        <button
                                                            onClick={() => {
                                                                setTrabajadorSeleccionado(post.trabajador);
                                                                setModalPerfilOpen(true);
                                                            }}
                                                            className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-xs font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                                                        >
                                                            <User className="w-4 h-4" /> Ver Perfil
                                                        </button>
                                                    </div>
                                                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {new Date(post.fecha_postulacion).toLocaleDateString(
                                                            "es-CO",
                                                            { year: 'numeric', month: 'long', day: 'numeric' }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <span
                                            className={`px-4 py-2 text-xs font-bold rounded-full capitalize shadow-sm ${post.estado === "aceptada"
                                                ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200"
                                                : post.estado === "rechazada"
                                                    ? "bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200"
                                                    : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200"
                                                }`}
                                        >
                                            {post.estado === "aceptada" ? "✅ Aceptada" : post.estado === "rechazada" ? "❌ Rechazada" : "⏳ Pendiente"}
                                        </span>
                                    </div>

                                    {post.mensaje && (
                                        <div className="bg-gray-50 border-l-4 border-orange-400 rounded-lg p-4 mt-3">
                                            <p className="text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2"><MessageSquare className="w-4 h-4" /> Mensaje del trabajador:</p>
                                            <p className="text-gray-700 italic">"{post.mensaje}"</p>
                                        </div>
                                    )}

                                    {/* Botones para el Empleador */}
                                    {usuario && trabajo && usuario.id_usuario === trabajo.id_empleador && post.estado === 'pendiente' && (
                                        <div className="mt-4 pt-4 border-t border-gray-200 flex gap-3">
                                            <button
                                                onClick={() => handleGestionarPostulacion(post.id_postulacion, 'aceptar')}
                                                className="flex-1 px-5 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                <span className="text-lg">✅</span> Aceptar Postulación
                                            </button>
                                            <button
                                                onClick={() => handleGestionarPostulacion(post.id_postulacion, 'rechazar')}
                                                className="flex-1 px-5 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-lg hover:from-red-700 hover:to-rose-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                            >
                                                <span className="text-lg">❌</span> Rechazar Postulación
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <ModalCalificar
                isOpen={modalCalificarOpen}
                onClose={() => setModalCalificarOpen(false)}
                onSubmit={handleCalificar}
                usuarioReceptor={usuarioAReceptar}
            />

            {modalPerfilOpen && trabajadorSeleccionado && (
                <ModalPerfilTrabajador
                    trabajador={trabajadorSeleccionado}
                    onClose={() => {
                        setModalPerfilOpen(false);
                        setTrabajadorSeleccionado(null);
                    }}
                />
            )}
        </div>
    );
}

export default Detalles;
