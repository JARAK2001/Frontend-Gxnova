import { useState, useEffect } from "react";
import { Check, X, Eye, Clock, Award, FileCheck } from "lucide-react";
import API_URL from "../../config/api";
import Swal from 'sweetalert2';

const EstadoBadge = ({ estado }) => {
    const estilos = {
        pendiente_revision: { bg: "rgba(251,191,36,0.12)", color: "#d97706", text: "Pendiente" },
        aprobada: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", text: "Aprobada" },
        rechazada: { bg: "rgba(239,68,68,0.12)", color: "#dc2626", text: "Rechazada" },
    };
    const s = estilos[estado] || estilos.pendiente_revision;
    return (
        <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: s.bg, color: s.color }}
        >
            {s.text}
        </span>
    );
};

const AdminHabilidades = () => {
    const [habilidades, setHabilidades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalCert, setModalCert] = useState(null);
    const [procesando, setProcesando] = useState(null);

    useEffect(() => {
        fetchHabilidades();
    }, []);

    const fetchHabilidades = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/admin/habilidades-pendientes`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error("Error al cargar habilidades pendientes");
            const data = await res.json();
            setHabilidades(data.habilidades || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleValidar = async (id, aprobado) => {
        const accion = aprobado ? "aprobar" : "rechazar";
        const result = await Swal.fire({
            title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} habilidad?`,
            text: `¿Deseas ${accion} esta habilidad?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: aprobado ? '#16a34a' : '#dc2626',
            cancelButtonColor: '#64748b',
            confirmButtonText: `Sí, ${accion}`,
            cancelButtonText: 'Cancelar'
        });

        if (!result.isConfirmed) return;

        setProcesando(id);
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${API_URL}/api/admin/habilidades/${id}/validar`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ aprobado }),
            });

            if (!res.ok) throw new Error("Error al procesar la solicitud");
            // Remover de la lista
            setHabilidades((prev) => prev.filter((h) => h.id_habilidad !== id));
            Swal.fire('¡Éxito!', `Habilidad ${aprobado ? 'aprobada' : 'rechazada'} correctamente`, 'success');
        } catch (err) {
            Swal.fire('Error', err.message, 'error');
        } finally {
            setProcesando(null);
        }
    };

    if (loading)
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div
                        className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin mx-auto mb-3"
                        style={{ borderColor: "rgba(249,115,22,0.3)", borderTopColor: "#f97316" }}
                    />
                    <p className="text-sm text-gray-500">Cargando habilidades...</p>
                </div>
            </div>
        );

    if (error)
        return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-7">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 4px 14px -2px rgba(249,115,22,0.45)" }}
                >
                    <FileCheck size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Validación de Habilidades</h1>
                    <p className="text-sm text-gray-500">
                        {habilidades.length > 0
                            ? `${habilidades.length} habilidad${habilidades.length !== 1 ? "es" : ""} pendiente${habilidades.length !== 1 ? "s" : ""} de revisión`
                            : "Sin habilidades pendientes"}
                    </p>
                </div>
            </div>

            {/* Empty state */}
            {habilidades.length === 0 ? (
                <div
                    className="rounded-2xl p-12 text-center"
                    style={{ background: "rgba(255,255,255,0.88)", border: "1px solid rgba(249,115,22,0.12)" }}
                >
                    <Award size={48} className="mx-auto mb-4" style={{ color: "rgba(249,115,22,0.4)" }} />
                    <p className="text-lg font-semibold text-gray-700 mb-1">Todo al día</p>
                    <p className="text-sm text-gray-500">No hay habilidades pendientes de validación manual.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {habilidades.map((h) => (
                        <div
                            key={h.id_habilidad}
                            className="rounded-2xl overflow-hidden"
                            style={{
                                background: "rgba(255,255,255,0.92)",
                                border: "1px solid rgba(249,115,22,0.14)",
                                boxShadow: "0 2px 16px -4px rgba(0,0,0,0.08)",
                            }}
                        >
                            {/* Card header */}
                            <div className="p-4 border-b" style={{ borderColor: "rgba(249,115,22,0.08)", background: "rgba(249,115,22,0.03)" }}>
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                        {h.usuario?.foto_perfil ? (
                                            <img
                                                src={h.usuario.foto_perfil}
                                                alt={h.usuario.nombre}
                                                className="w-9 h-9 rounded-full object-cover border-2 flex-shrink-0"
                                                style={{ borderColor: "rgba(249,115,22,0.3)" }}
                                            />
                                        ) : (
                                            <div
                                                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                                style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff" }}
                                            >
                                                {h.usuario?.nombre?.charAt(0) || "?"}
                                            </div>
                                        )}
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-800 text-sm truncate">
                                                {h.usuario?.nombre} {h.usuario?.apellido}
                                            </p>
                                            <p className="text-xs text-gray-400 truncate">{h.usuario?.correo}</p>
                                        </div>
                                    </div>
                                    <EstadoBadge estado={h.estado} />
                                </div>
                            </div>

                            {/* Card body */}
                            <div className="p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                                        style={{ background: "rgba(249,115,22,0.10)", color: "#ea580c" }}
                                    >
                                        {h.categoria?.nombre || "Sin categoría"}
                                    </span>
                                    {h.tarifa_hora && (
                                        <span className="text-xs text-gray-500">${parseFloat(h.tarifa_hora).toFixed(2)}/h</span>
                                    )}
                                </div>

                                {h.descripcion && (
                                    <p className="text-sm text-gray-600 line-clamp-2">{h.descripcion}</p>
                                )}

                                {/* Certificado */}
                                {h.certificado_url ? (
                                    <button
                                        onClick={() => setModalCert(h.certificado_url)}
                                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
                                        style={{ background: "rgba(249,115,22,0.07)", color: "#ea580c" }}
                                    >
                                        <Eye size={15} />
                                        Ver certificado adjunto
                                    </button>
                                ) : (
                                    <div
                                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-gray-400"
                                        style={{ background: "rgba(0,0,0,0.03)" }}
                                    >
                                        <Clock size={13} />
                                        Sin certificado adjunto
                                    </div>
                                )}

                                {/* Acciones */}
                                <div className="flex gap-2 pt-1">
                                    <button
                                        onClick={() => handleValidar(h.id_habilidad, false)}
                                        disabled={procesando === h.id_habilidad}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
                                        style={{ background: "rgba(239,68,68,0.10)", color: "#dc2626" }}
                                    >
                                        <X size={15} />
                                        Rechazar
                                    </button>
                                    <button
                                        onClick={() => handleValidar(h.id_habilidad, true)}
                                        disabled={procesando === h.id_habilidad}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02] disabled:opacity-60"
                                        style={{ background: "rgba(34,197,94,0.10)", color: "#16a34a" }}
                                    >
                                        <Check size={15} />
                                        Aprobar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal certificado */}
            {modalCert && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setModalCert(null)}
                >
                    <div className="relative max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                        <button
                            className="absolute top-3 right-3 bg-white rounded-full p-2 text-gray-700 shadow-lg hover:bg-gray-100 transition z-10"
                            onClick={() => setModalCert(null)}
                        >
                            <X size={20} />
                        </button>
                        {/* Try rendering as image; if PDF use iframe */}
                        {modalCert.endsWith(".pdf") ? (
                            <iframe
                                src={modalCert}
                                title="Certificado"
                                className="w-full rounded-2xl shadow-2xl"
                                style={{ height: "80vh" }}
                            />
                        ) : (
                            <img
                                src={modalCert}
                                alt="Certificado"
                                className="max-w-full max-h-[85vh] rounded-2xl shadow-2xl mx-auto block"
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHabilidades;
