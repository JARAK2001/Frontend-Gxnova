import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Star, TrendingUp, AlertCircle, CheckCircle, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import API_URL from '../../config/api';

const StatCard = ({ title, value, icon, gradient, trend, trendUp }) => (
    <div className="admin-card p-5">
        <div className="flex justify-between items-start mb-4">
            <div
                className="p-3 rounded-xl flex-shrink-0"
                style={{ background: gradient, boxShadow: '0 6px 16px -4px rgba(249,115,22,0.35)' }}
            >
                <span className="text-white">{icon}</span>
            </div>
            <span
                className="flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full"
                style={{
                    background: trendUp ? '#f0fdf4' : '#fef2f2',
                    color: trendUp ? '#16a34a' : '#dc2626',
                }}
            >
                <ArrowUpRight size={12} className={trendUp ? '' : 'rotate-180'} />
                {trend}
            </span>
        </div>
        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">{title}</p>
        <h3 className="text-3xl font-black text-slate-800 mt-1">{value}</h3>
    </div>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error cargando estadísticas", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="text-center">
                <div
                    className="w-10 h-10 rounded-full border-3 mx-auto mb-3 animate-spin"
                    style={{ borderColor: '#f97316', borderTopColor: 'transparent', borderWidth: 3 }}
                />
                <p className="text-sm text-slate-500 font-medium">Cargando dashboard…</p>
            </div>
        </div>
    );
    if (!stats) return (
        <div className="admin-card p-8 text-center text-red-500">Error al cargar datos.</div>
    );

    const trabajosData = stats.trabajosPorEstado.map(item => ({
        name: item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
        cantidad: item._count.estado
    }));

    const usuariosData = stats.usuariosPorEstado.map(item => ({
        name: item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
        cantidad: item._count.estado
    }));

    // Brand-aligned palette
    const CHART_COLORS = ['#f97316', '#ea580c', '#fbbf24', '#94a3b8', '#64748b'];
    const PIE_COLORS = ['#f97316', '#fb923c', '#fdba74', '#94a3b8'];

    const cards = [
        {
            title: 'Total Usuarios',
            value: stats.totalUsuarios,
            icon: <Users size={22} />,
            gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
            trend: '+12%', trendUp: true,
        },
        {
            title: 'Total Trabajos',
            value: stats.totalTrabajos,
            icon: <Briefcase size={22} />,
            gradient: 'linear-gradient(135deg, #fb923c, #f97316)',
            trend: '+8%', trendUp: true,
        },
        {
            title: 'Calificaciones',
            value: stats.totalCalificaciones,
            icon: <Star size={22} />,
            gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
            trend: '+15%', trendUp: true,
        },
        {
            title: 'Tasa de Éxito',
            value: stats.totalTrabajos > 0
                ? `${Math.round((trabajosData.find(t => t.name === 'Completado')?.cantidad || 0) / stats.totalTrabajos * 100)}%`
                : '0%',
            icon: <TrendingUp size={22} />,
            gradient: 'linear-gradient(135deg, #ea580c, #c2410c)',
            trend: '+5%', trendUp: true,
        },
    ];

    const tooltipStyle = {
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        fontSize: '13px',
        boxShadow: '0 4px 16px -2px rgba(0,0,0,0.10)',
    };

    return (
        <div className="space-y-6">
            {/* Page header */}
            <div>
                <h1 className="text-2xl font-black text-slate-800">Dashboard Administrativo</h1>
                <p className="text-sm text-slate-500 mt-0.5">Resumen general de la plataforma GXNova</p>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card, i) => <StatCard key={i} {...card} />)}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Bar chart — Trabajos */}
                <div className="admin-card p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}
                        >
                            <Briefcase size={14} className="text-white" />
                        </span>
                        Distribución de Trabajos
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={trabajosData} barCategoryGap="35%">
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(249,115,22,0.06)' }} />
                            <Bar dataKey="cantidad" radius={[8, 8, 0, 0]}>
                                {trabajosData.map((_, idx) => (
                                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie chart — Usuarios */}
                <div className="admin-card p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#fb923c,#f97316)' }}
                        >
                            <Users size={14} className="text-white" />
                        </span>
                        Estado de Usuarios
                    </h3>
                    <ResponsiveContainer width="100%" height={280}>
                        <PieChart>
                            <Pie
                                data={usuariosData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={4}
                                dataKey="cantidad"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                labelLine={false}
                            >
                                {usuariosData.map((_, idx) => (
                                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={tooltipStyle} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Alerts + Quick actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Alerts */}
                <div className="admin-card p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)' }}
                        >
                            <AlertCircle size={14} className="text-white" />
                        </span>
                        Alertas del Sistema
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 rounded-xl"
                            style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                            <AlertCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-orange-800">Reportes Pendientes</p>
                                <p className="text-xs text-orange-600 mt-0.5">0 reportes requieren atención</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-xl"
                            style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                            <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-green-800">Sistema Operativo</p>
                                <p className="text-xs text-green-600 mt-0.5">Todos los servicios funcionando correctamente</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick actions */}
                <div className="admin-card p-5">
                    <h3 className="text-sm font-bold text-slate-700 mb-4">Acciones Rápidas</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { icon: <Users size={18} />, label: 'Gestionar Usuarios', path: '/admin/usuarios' },
                            { icon: <Briefcase size={18} />, label: 'Ver Trabajos', path: '/admin/trabajos' },
                            { icon: <Star size={18} />, label: 'Categorías', path: '/admin/categorias' },
                            { icon: <AlertCircle size={18} />, label: 'Reportes', path: '/admin/reportes' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                className="p-4 text-left rounded-xl transition-all duration-200 group"
                                style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'linear-gradient(135deg,#f97316,#ea580c)';
                                    e.currentTarget.style.borderColor = 'transparent';
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(249,115,22,0.4)';
                                    e.currentTarget.querySelectorAll('span,p').forEach(el => el.style.color = '#fff');
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = '#fff7ed';
                                    e.currentTarget.style.borderColor = '#fed7aa';
                                    e.currentTarget.style.transform = '';
                                    e.currentTarget.style.boxShadow = '';
                                    e.currentTarget.querySelectorAll('span,p').forEach(el => el.style.color = '');
                                }}
                            >
                                <span className="block mb-2 text-orange-600 transition-colors">{action.icon}</span>
                                <p className="text-sm font-semibold text-orange-900 transition-colors">{action.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
