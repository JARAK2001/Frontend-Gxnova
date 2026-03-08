import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";
import Encabezado from "../../layouts/Encabezado";
import {
    Briefcase, Users, Loader2, Clock, CheckCircle,
    Eye, ChevronRight, MapPin, DollarSign, LayoutDashboard,
    Plus, RefreshCw, ArrowRight, Zap, Tag
} from "lucide-react";

/* ── Column config ── */
const COLS = [
    {
        key: "publicado_sin_postulantes",
        label: "Publicado",
        sub: "Sin postulantes aún",
        color: "#3b82f6",
        bg: "linear-gradient(135deg,#eff6ff,#dbeafe)",
        border: "#bfdbfe",
        icon: <Zap size={16} />,
        textColor: "#1d4ed8",
    },
    {
        key: "publicado_con_postulantes",
        label: "Con Postulantes",
        sub: "Esperando tu elección",
        color: "#f59e0b",
        bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
        border: "#fde68a",
        icon: <Users size={16} />,
        textColor: "#92400e",
    },
    {
        key: "en_proceso",
        label: "En Progreso",
        sub: "Trabajo en curso",
        color: "#f97316",
        bg: "linear-gradient(135deg,#fff7ed,#ffedd5)",
        border: "#fed7aa",
        icon: <Clock size={16} />,
        textColor: "#c2410c",
    },
    {
        key: "completado",
        label: "Completado",
        sub: "Trabajo finalizado",
        color: "#10b981",
        bg: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
        border: "#bbf7d0",
        icon: <CheckCircle size={16} />,
        textColor: "#065f46",
    },
];

function clasificar(trabajos, postulacionesPorTrabajo) {
    const result = {
        publicado_sin_postulantes: [],
        publicado_con_postulantes: [],
        en_proceso: [],
        completado: [],
    };
    (trabajos || []).forEach((t) => {
        const count = postulacionesPorTrabajo[t.id_trabajo] || 0;
        if (t.estado === "publicado") {
            if (count === 0) result.publicado_sin_postulantes.push({ ...t, _postCount: count });
            else result.publicado_con_postulantes.push({ ...t, _postCount: count });
        } else if (t.estado === "en_proceso") {
            result.en_proceso.push({ ...t, _postCount: count });
        } else if (t.estado === "completado") {
            result.completado.push({ ...t, _postCount: count });
        }
    });
    return result;
}

function formatPrecio(m) {
    if (!m) return null;
    return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(m);
}

function JobCard({ trabajo, col, navigate }) {
    return (
        <div
            onClick={() => navigate(`/detalles/${trabajo.id_trabajo}`)}
            style={{
                background: "#fff",
                borderRadius: "16px",
                padding: "16px",
                border: "1.5px solid #f1f5f9",
                cursor: "pointer",
                transition: "all 0.22s ease",
                boxShadow: "0 2px 8px -2px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = col.color;
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px -4px ${col.color}22`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = "#f1f5f9";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 2px 8px -2px rgba(0,0,0,0.04)";
            }}
        >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <h4 style={{ fontWeight: 800, fontSize: "0.9rem", color: "#0f172a", margin: 0, lineHeight: 1.3, flex: 1, paddingRight: "8px" }}>
                    {trabajo.titulo}
                </h4>
                <ChevronRight size={14} style={{ color: col.color, flexShrink: 0, marginTop: 2 }} />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "8px", color: "#94a3b8", fontSize: "0.78rem" }}>
                <MapPin size={11} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{trabajo.ubicacion}</span>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                {/* Categoría */}
                <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "#f1f5f9", color: "#475569" }}>
                    {trabajo.categoria?.nombre || "Sin categoría"}
                </span>

                {/* Precio */}
                {trabajo.tipo_pago === "dinero" && trabajo.monto_pago && (
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "#fff7ed", color: "#ea580c", border: "1px solid #fed7aa", display: "flex", alignItems: "center", gap: "3px" }}>
                        <Tag size={9} /> {formatPrecio(trabajo.monto_pago)}
                    </span>
                )}
                {trabajo.tipo_pago === "trueque" && (
                    <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px", borderRadius: "999px", background: "#f5f3ff", color: "#7c3aed", border: "1px solid #ddd6fe" }}>
                        Trueque
                    </span>
                )}

                {/* Postulantes */}
                {trabajo._postCount > 0 && (
                    <span style={{ marginLeft: "auto", fontSize: "0.72rem", fontWeight: 800, padding: "2px 8px", borderRadius: "999px", background: col.bg.includes("#fff7ed") ? "#fff7ed" : `${col.color}18`, color: col.textColor, display: "flex", alignItems: "center", gap: "3px" }}>
                        <Users size={9} /> {trabajo._postCount} postulante{trabajo._postCount !== 1 ? "s" : ""}
                    </span>
                )}
            </div>
        </div>
    );
}

function KanbanColumn({ col, trabajos, navigate }) {
    return (
        <div style={{
            flex: "1 1 0",
            minWidth: "220px",
            display: "flex",
            flexDirection: "column",
            gap: "0",
        }}>
            {/* Column Header */}
            <div style={{
                padding: "14px 16px",
                borderRadius: "16px 16px 0 0",
                background: col.bg,
                border: `1.5px solid ${col.border}`,
                borderBottom: "none",
                display: "flex",
                alignItems: "center",
                gap: "8px",
            }}>
                <span style={{ color: col.color }}>{col.icon}</span>
                <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 800, fontSize: "0.88rem", color: col.textColor, margin: 0, lineHeight: 1.2 }}>{col.label}</p>
                    <p style={{ fontSize: "0.7rem", color: col.textColor, opacity: 0.7, margin: 0 }}>{col.sub}</p>
                </div>
                <span style={{
                    minWidth: "24px", height: "24px", borderRadius: "8px",
                    background: col.color, color: "#fff",
                    fontWeight: 800, fontSize: "0.8rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>{trabajos.length}</span>
            </div>

            {/* Column Body */}
            <div style={{
                background: "#f8fafc",
                border: `1.5px solid ${col.border}`,
                borderTop: "none",
                borderRadius: "0 0 16px 16px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                minHeight: "200px",
                flex: 1,
            }}>
                {trabajos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "32px 16px", color: "#cbd5e1" }}>
                        <Briefcase size={28} style={{ margin: "0 auto 8px", opacity: 0.4 }} />
                        <p style={{ fontSize: "0.78rem", fontWeight: 600, margin: 0 }}>Ningún trabajo aquí</p>
                    </div>
                ) : (
                    trabajos.map(t => (
                        <JobCard key={t.id_trabajo} trabajo={t} col={col} navigate={navigate} />
                    ))
                )}
            </div>
        </div>
    );
}

function EmpleadorDashboard() {
    const navigate = useNavigate();
    const [trabajos, setTrabajos] = useState([]);
    const [postulacionesPorTrabajo, setPostulacionesPorTrabajo] = useState({});
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/auth"); return; }
        setRefreshing(true);
        try {
            // Usuario
            const resU = await fetch(`${API_URL}/api/usuarios/perfil`, { headers: { Authorization: `Bearer ${token}` } });
            const dataU = await resU.json();
            if (!resU.ok) { navigate("/auth"); return; }
            const usr = dataU.usuario;
            setUsuario(usr);

            // Trabajos del empleador (publicado, en_proceso, completado)
            const resT = await fetch(`${API_URL}/api/trabajos?id_empleador=${usr.id_usuario}`, { headers: { Authorization: `Bearer ${token}` } });
            const dataT = await resT.json();
            const listaTrab = dataT.trabajos || [];
            const filtrados = listaTrab.filter(t => ["publicado", "en_proceso", "completado"].includes(t.estado));
            setTrabajos(filtrados);

            // Postulaciones por trabajo
            const conteo = {};
            await Promise.all(
                filtrados.map(async (t) => {
                    try {
                        const resP = await fetch(`${API_URL}/api/postulaciones?id_trabajo=${t.id_trabajo}`, { headers: { Authorization: `Bearer ${token}` } });
                        const dataP = await resP.json();
                        conteo[t.id_trabajo] = (dataP.postulaciones || []).length;
                    } catch (_) { conteo[t.id_trabajo] = 0; }
                })
            );
            setPostulacionesPorTrabajo(conteo);
        } catch (err) {
            console.error("Error cargando dashboard:", err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const columnas = clasificar(trabajos, postulacionesPorTrabajo);
    const totalActivos = trabajos.filter(t => t.estado !== "completado").length;

    return (
        <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#fff7ed 0%,#f8fafc 40%,#fff 100%)" }}>
            <Encabezado />

            <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "36px 20px" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <div style={{ width: "52px", height: "52px", borderRadius: "16px", background: "linear-gradient(135deg,#f97316,#ea580c)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px -4px rgba(249,115,22,0.4)" }}>
                            <LayoutDashboard size={26} color="#fff" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: "1.8rem", fontWeight: 900, color: "#0f172a", margin: 0, lineHeight: 1.1 }}>Mi Dashboard</h1>
                            <p style={{ color: "#64748b", fontSize: "0.9rem", margin: 0, marginTop: "4px" }}>
                                {usuario ? `Hola, ${usuario.nombre} 👋 — ` : ""}{totalActivos} trabajo{totalActivos !== 1 ? "s" : ""} activo{totalActivos !== 1 ? "s" : ""}
                            </p>
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={cargarDatos}
                            disabled={refreshing}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "10px 18px", borderRadius: "12px",
                                background: "#f1f5f9", color: "#475569", fontWeight: 700, fontSize: "0.85rem",
                                border: "1px solid #e2e8f0", cursor: "pointer", transition: "all 0.2s"
                            }}
                            onMouseEnter={e => e.currentTarget.style.background = "#e2e8f0"}
                            onMouseLeave={e => e.currentTarget.style.background = "#f1f5f9"}
                        >
                            <RefreshCw size={14} style={{ animation: refreshing ? "spin 1s linear infinite" : "none" }} />
                            Actualizar
                        </button>
                        <button
                            onClick={() => navigate("/crear-trabajo")}
                            style={{
                                display: "flex", alignItems: "center", gap: "6px",
                                padding: "10px 20px", borderRadius: "12px",
                                background: "linear-gradient(135deg,#f97316,#ea580c)",
                                color: "#fff", fontWeight: 800, fontSize: "0.88rem",
                                border: "none", cursor: "pointer",
                                boxShadow: "0 4px 14px -2px rgba(249,115,22,0.45)",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 20px -4px rgba(249,115,22,0.5)"; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 14px -2px rgba(249,115,22,0.45)"; }}
                        >
                            <Plus size={16} /> Nuevo Trabajo
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                {!loading && (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: "14px", marginBottom: "28px" }}>
                        {COLS.map(col => (
                            <div key={col.key} style={{ background: col.bg, border: `1.5px solid ${col.border}`, borderRadius: "16px", padding: "16px 18px", display: "flex", alignItems: "center", gap: "12px" }}>
                                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: col.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                                    {col.icon}
                                </div>
                                <div>
                                    <p style={{ fontSize: "1.6rem", fontWeight: 900, color: col.textColor, margin: 0, lineHeight: 1 }}>{columnas[col.key]?.length || 0}</p>
                                    <p style={{ fontSize: "0.72rem", fontWeight: 700, color: col.textColor, opacity: 0.75, margin: 0 }}>{col.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Kanban Board */}
                {loading ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 0", gap: "16px" }}>
                        <div style={{ width: "48px", height: "48px", borderRadius: "50%", border: "3px solid #fed7aa", borderTopColor: "#f97316", animation: "spin 1s linear infinite" }} />
                        <p style={{ color: "#64748b", fontWeight: 600, margin: 0 }}>Cargando tu dashboard…</p>
                    </div>
                ) : trabajos.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "80px 24px", background: "#fff", borderRadius: "24px", border: "2px dashed #e2e8f0" }}>
                        <div style={{ width: "80px", height: "80px", borderRadius: "24px", background: "linear-gradient(135deg,#fff7ed,#ffedd5)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "#f97316" }}>
                            <Briefcase size={40} />
                        </div>
                        <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 8px" }}>Aún no tienes trabajos publicados</h3>
                        <p style={{ color: "#64748b", marginBottom: "24px" }}>Publica tu primer trabajo y empieza a recibir postulantes.</p>
                        <button
                            onClick={() => navigate("/crear-trabajo")}
                            style={{ padding: "14px 28px", borderRadius: "14px", background: "linear-gradient(135deg,#f97316,#ea580c)", color: "#fff", fontWeight: 800, fontSize: "1rem", border: "none", cursor: "pointer", boxShadow: "0 4px 14px -2px rgba(249,115,22,0.4)" }}
                        >
                            Publicar mi primer Trabajo <ArrowRight size={16} style={{ display: "inline", verticalAlign: "middle", marginLeft: "6px" }} />
                        </button>
                    </div>
                ) : (
                    <div style={{ display: "flex", gap: "16px", overflowX: "auto", paddingBottom: "16px", alignItems: "flex-start" }}>
                        {COLS.map(col => (
                            <KanbanColumn
                                key={col.key}
                                col={col}
                                trabajos={columnas[col.key] || []}
                                navigate={navigate}
                            />
                        ))}
                    </div>
                )}
            </div>

            <style>{`@keyframes spin { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }`}</style>
        </div>
    );
}

export default EmpleadorDashboard;
