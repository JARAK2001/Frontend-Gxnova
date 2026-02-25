import React, { useEffect, useState } from 'react';
import { Users, Briefcase, Star, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import API_URL from '../../config/api';

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

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando dashboard...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Error al cargar datos.</div>;

    // Preparar datos para gráficas
    const trabajosData = stats.trabajosPorEstado.map(item => ({
        name: item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
        cantidad: item._count.estado
    }));

    const usuariosData = stats.usuariosPorEstado.map(item => ({
        name: item.estado.charAt(0).toUpperCase() + item.estado.slice(1),
        cantidad: item._count.estado
    }));

    // Colores para las gráficas
    const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Cards de estadísticas principales
    const cards = [
        {
            title: "Total Usuarios",
            value: stats.totalUsuarios,
            icon: <Users size={24} />,
            color: "bg-blue-500",
            trend: "+12%",
            trendUp: true
        },
        {
            title: "Total Trabajos",
            value: stats.totalTrabajos,
            icon: <Briefcase size={24} />,
            color: "bg-green-500",
            trend: "+8%",
            trendUp: true
        },
        {
            title: "Calificaciones",
            value: stats.totalCalificaciones,
            icon: <Star size={24} />,
            color: "bg-yellow-500",
            trend: "+15%",
            trendUp: true
        },
        {
            title: "Tasa de Éxito",
            value: stats.totalTrabajos > 0
                ? `${Math.round((trabajosData.find(t => t.name === 'Completado')?.cantidad || 0) / stats.totalTrabajos * 100)}%`
                : "0%",
            icon: <TrendingUp size={24} />,
            color: "bg-purple-500",
            trend: "+5%",
            trendUp: true
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Administrativo</h1>
                    <p className="text-gray-500 mt-1">Resumen general de la plataforma</p>
                </div>
            </div>

            {/* Cards de Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-lg ${card.color} text-white`}>
                                {card.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-medium ${card.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                                <TrendingUp size={16} className={card.trendUp ? '' : 'rotate-180'} />
                                {card.trend}
                            </div>
                        </div>
                        <p className="text-sm text-gray-500 font-medium mb-1">{card.title}</p>
                        <h3 className="text-3xl font-bold text-gray-800">{card.value}</h3>
                    </div>
                ))}
            </div>

            {/* Gráficas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfica de Trabajos */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Briefcase size={20} className="text-green-600" />
                        Distribución de Trabajos
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={trabajosData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            />
                            <Bar dataKey="cantidad" fill="#10b981" radius={[8, 8, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfica de Usuarios */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Users size={20} className="text-blue-600" />
                        Estado de Usuarios
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={usuariosData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="cantidad"
                            >
                                {usuariosData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Alertas y Acciones Rápidas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <AlertCircle size={20} className="text-orange-600" />
                        Alertas del Sistema
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <AlertCircle size={18} className="text-yellow-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-yellow-800">Reportes Pendientes</p>
                                <p className="text-xs text-yellow-600">0 reportes requieren atención</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <CheckCircle size={18} className="text-green-600 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-green-800">Sistema Operativo</p>
                                <p className="text-xs text-green-600">Todos los servicios funcionando correctamente</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Acciones Rápidas</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-left transition-colors">
                            <Users size={20} className="text-blue-600 mb-2" />
                            <p className="text-sm font-medium text-blue-900">Gestionar Usuarios</p>
                        </button>
                        <button className="p-4 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg text-left transition-colors">
                            <Briefcase size={20} className="text-green-600 mb-2" />
                            <p className="text-sm font-medium text-green-900">Ver Trabajos</p>
                        </button>
                        <button className="p-4 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg text-left transition-colors">
                            <Star size={20} className="text-purple-600 mb-2" />
                            <p className="text-sm font-medium text-purple-900">Categorías</p>
                        </button>
                        <button className="p-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg text-left transition-colors">
                            <AlertCircle size={20} className="text-orange-600 mb-2" />
                            <p className="text-sm font-medium text-orange-900">Reportes</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
