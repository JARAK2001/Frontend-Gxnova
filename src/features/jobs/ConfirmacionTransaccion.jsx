import React, { useState, useEffect } from "react";
import API_URL from "../../config/api";
import {
    CheckCircle, Clock, AlertCircle, Upload, Image, ArrowRight,
    DollarSign, RefreshCw, Loader
} from "lucide-react";

/**
 * ConfirmacionTransaccion
 * Props:
 *  - transaccion: objeto transaccion (con acuerdo incluido)
 *  - idUsuario: id del usuario actual
 *  - idEmpleador: id del empleador del trabajo
 *  - idTrabajador: id del trabajador aceptado
 *  - onActualizado: callback () => void para recargar datos del padre
 */
function ConfirmacionTransaccion({ transaccion, idUsuario, idEmpleador, idTrabajador, onActualizado }) {
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [evidenciaUrl, setEvidenciaUrl] = useState(transaccion?.evidencia_url || "");
    const [mostrarEvidencia, setMostrarEvidencia] = useState(false);

    const token = localStorage.getItem("token");
    const esEmpleador = idUsuario === idEmpleador;
    const esTrabajador = idUsuario === idTrabajador;

    if (!transaccion) return null;

    const { estado, tipo_pago, confirmado_empleador, confirmado_trabajador, evidencia_url } = transaccion;

    const patchTransaccion = async (endpoint) => {
        setCargando(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/transacciones/${transaccion.id_transaccion}/${endpoint}`, {
                method: "PATCH",
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error en la operación");
            onActualizado();
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    // Subir evidencia 
    const handleSubirEvidencia = async () => {
        if (!evidenciaUrl.trim()) {
            setError("Por favor ingresa una URL de evidencia válida.");
            return;
        }
        setCargando(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/transacciones/${transaccion.id_transaccion}/subir-evidencia`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ evidencia_url: evidenciaUrl.trim() })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Error al subir evidencia");
            alert("✅ Evidencia guardada correctamente.");
            onActualizado();
        } catch (e) {
            setError(e.message);
        } finally {
            setCargando(false);
        }
    };

    // Indicador de progreso 
    const renderProgreso = () => {
        if (tipo_pago === "dinero") {
            return (
                <div className="flex items-center gap-2 mb-5">
                    {/* Empleador paga */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${confirmado_empleador
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                        {confirmado_empleador ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        Empleador pagó
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    {/* Trabajador confirma */}
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${confirmado_trabajador
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                        {confirmado_trabajador ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                        Trabajador recibió
                    </div>
                </div>
            );
        }

        // Trueque: ambos confirman en cualquier orden
        return (
            <div className="flex items-center gap-2 mb-5">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${confirmado_empleador
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    {confirmado_empleador ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    Empleador confirmó
                </div>
                <span className="text-gray-400 text-xs font-bold">+</span>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${confirmado_trabajador
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-gray-100 text-gray-500 border-gray-200"}`}>
                    {confirmado_trabajador ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                    Trabajador confirmó
                </div>
            </div>
        );
    };

    // ── Botón de acción principal ───────────────────────────────────────────
    const renderBotonAccion = () => {
        if (estado === "completado") return null;

        // ── FLUJO DINERO ──
        if (tipo_pago === "dinero") {
            if (esEmpleador && !confirmado_empleador) {
                return (
                    <button
                        id="btn-pago-empleador"
                        onClick={() => patchTransaccion("confirmar-pago")}
                        disabled={cargando}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cargando ? <Loader className="w-5 h-5 animate-spin" /> : <DollarSign className="w-5 h-5" />}
                        {cargando ? "Procesando..." : "✅ Marcar Pago Como Realizado"}
                    </button>
                );
            }
            if (esEmpleador && confirmado_empleador && !confirmado_trabajador) {
                return (
                    <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-medium">
                        <Clock className="w-5 h-5 flex-shrink-0" />
                        Esperando que el trabajador confirme la recepción del pago...
                    </div>
                );
            }
            if (esTrabajador && confirmado_empleador && !confirmado_trabajador) {
                return (
                    <button
                        id="btn-recibo-trabajador"
                        onClick={() => patchTransaccion("confirmar-pago")}
                        disabled={cargando}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cargando ? <Loader className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        {cargando ? "Procesando..." : "💰 Confirmar Pago Recibido"}
                    </button>
                );
            }
            if (esTrabajador && !confirmado_empleador) {
                return (
                    <div className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-600 text-sm">
                        <Clock className="w-5 h-5 flex-shrink-0 text-gray-400" />
                        El empleador aún no ha marcado el pago. Recibirás una notificación cuando lo haga.
                    </div>
                );
            }
        }

        // ── FLUJO TRUEQUE ──
        if (tipo_pago === "trueque") {
            const yoConfirme = esEmpleador ? confirmado_empleador : confirmado_trabajador;
            const otroConfirmo = esEmpleador ? confirmado_trabajador : confirmado_empleador;

            if (!yoConfirme) {
                return (
                    <button
                        id="btn-intercambio"
                        onClick={() => patchTransaccion("confirmar-intercambio")}
                        disabled={cargando}
                        className="w-full flex items-center justify-center gap-2 px-5 py-3.5 bg-gradient-to-r from-purple-600 to-violet-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-violet-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {cargando ? <Loader className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
                        {cargando ? "Procesando..." : "🔄 Confirmar Intercambio Realizado"}
                    </button>
                );
            }

            return (
                <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm font-medium">
                    <Clock className="w-5 h-5 flex-shrink-0" />
                    Tu confirmación fue registrada. {otroConfirmo ? "" : "Esperando que la otra parte confirme..."}
                </div>
            );
        }

        return null;
    };

    // ── Estado: Completado ──────────────────────────────────────────────────
    if (estado === "completado") {
        return (
            <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow">
                        <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-green-900">¡Transacción completada!</h3>
                        <p className="text-sm text-green-700">Ambas partes confirmaron. El trabajo ha sido cerrado.</p>
                    </div>
                </div>
                {evidencia_url && (
                    <a href={evidencia_url} target="_blank" rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 text-sm text-green-700 underline font-medium">
                        <Image className="w-4 h-4" /> Ver evidencia del pago
                    </a>
                )}
            </div>
        );
    }

    // ── Vista principal ────────────────────────────────────────────────────
    return (
        <div className="mt-6 p-6 bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl space-y-5">
            {/* Encabezado */}
            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow ${tipo_pago === "dinero" ? "bg-green-500" : "bg-purple-500"}`}>
                    {tipo_pago === "dinero"
                        ? <DollarSign className="w-5 h-5 text-white" />
                        : <RefreshCw className="w-5 h-5 text-white" />}
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900">
                        {tipo_pago === "dinero" ? "Confirmación de Pago" : "Confirmación de Intercambio"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {tipo_pago === "dinero"
                            ? "Ambas partes deben confirmar para cerrar el trabajo"
                            : "Ambos deben confirmar que recibieron lo pactado"}
                    </p>
                </div>
            </div>

            {/* Barra de progreso */}
            {renderProgreso()}

            {/* Botón de acción */}
            {renderBotonAccion()}

            {/* Error */}
            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    {error}
                </div>
            )}

            {/* Sección de evidencia */}
            <div className="border-t border-slate-200 pt-4">
                <button
                    onClick={() => setMostrarEvidencia(!mostrarEvidencia)}
                    className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1.5 font-medium transition-colors"
                >
                    <Upload className="w-4 h-4" />
                    {evidencia_url ? "Ver / Actualizar evidencia" : "Subir comprobante / evidencia (opcional)"}
                </button>

                {mostrarEvidencia && (
                    <div className="mt-3 space-y-3">
                        {evidencia_url && (
                            <a href={evidencia_url} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-blue-600 underline">
                                <Image className="w-4 h-4" /> Evidencia actual
                            </a>
                        )}
                        <div className="flex gap-2">
                            <input
                                type="url"
                                value={evidenciaUrl}
                                onChange={(e) => setEvidenciaUrl(e.target.value)}
                                placeholder="https://... (URL de foto del recibo o artículo)"
                                className="flex-1 text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                            />
                            <button
                                onClick={handleSubirEvidencia}
                                disabled={cargando}
                                className="px-4 py-2 bg-slate-700 text-white text-sm font-semibold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ConfirmacionTransaccion;
