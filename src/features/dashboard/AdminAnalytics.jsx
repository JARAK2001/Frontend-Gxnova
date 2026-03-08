import React, { useEffect, useState } from 'react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Award, MapPin } from 'lucide-react';
import API_URL from '../../config/api';

const AdminAnalytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch(`${API_URL}/api/admin/analytics`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.ok) {
                    const jsonData = await res.json();
                    setData(jsonData);
                } else {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.error || `Error ${res.status}: ${res.statusText}`);
                }
            } catch (error) {
                console.error("Error loading analytics:", error);
                setData({ error: error.message });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando analíticas...</div>;
    if (data?.error) return (
        <div className="p-8 text-center">
            <p className="text-red-500 font-bold mb-2">Error al cargar datos</p>
            <p className="text-gray-600 bg-gray-100 p-2 rounded inline-block">{data.error}</p>
            <p className="text-sm text-gray-500 mt-4">Si ves un error 404, asegúrate de reiniciar el backend.</p>
        </div>
    );
    if (!data) return <div className="p-8 text-center text-red-500">No hay datos disponibles.</div>;

    // Procesar datos para gráficas
    const distribucionCategorias = data.distribucion.map(item => ({
        id: item.id_categoria,
        count: item._count.id_categoria
    }));

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-black text-slate-800">Analíticas Avanzadas</h1>
                <p className="text-sm text-slate-500 mt-0.5">Métricas detalladas de rendimiento y crecimiento</p>
            </div>

            {/* Crecimiento de Usuarios */}
            <div className="admin-card p-5">
                <div className="flex items-center gap-2 mb-5">
                    <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                        <TrendingUp size={14} className="text-white" />
                    </span>
                    <h3 className="text-sm font-bold text-slate-700">Crecimiento de Usuarios</h3>
                </div>
                <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.crecimiento}>
                            <defs>
                                <linearGradient id="colorCrecimiento" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px', boxShadow: '0 4px 16px -2px rgba(0,0,0,0.08)' }} />
                            <Area type="monotone" dataKey="cantidad" stroke="#f97316" strokeWidth={2} fillOpacity={1} fill="url(#colorCrecimiento)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Top Usuarios */}
                <div className="admin-card p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#fbbf24,#f59e0b)' }}>
                            <Award size={14} className="text-white" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-700">Usuarios Mejor Calificados</h3>
                    </div>
                    <div className="space-y-2.5">
                        {data.topUsuarios.map((usuario, index) => (
                            <div key={usuario.id_usuario} className="flex items-center justify-between p-3 rounded-xl admin-row-hover transition-colors cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-slate-200 text-slate-600' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{usuario.nombre} {usuario.apellido}</p>
                                        <p className="text-xs text-slate-400">{usuario.total_calificaciones} reseñas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                                    <span className="text-orange-400 text-xs">★</span>
                                    <span className="font-bold text-orange-700 text-xs">{usuario.promedio}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribución de Categorías */}
                <div className="admin-card p-5">
                    <div className="flex items-center gap-2 mb-5">
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#ea580c,#c2410c)' }}>
                            <MapPin size={14} className="text-white" />
                        </span>
                        <h3 className="text-sm font-bold text-slate-700">Popularidad de Categorías</h3>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distribucionCategorias} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f1f5f9" />
                                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} />
                                <YAxis dataKey="id" type="category" width={50} tick={{ fontSize: 11, fill: '#64748b' }} />
                                <Tooltip cursor={{ fill: 'rgba(249,115,22,0.06)' }} contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
                                <Bar dataKey="count" fill="#ea580c" radius={[0, 6, 6, 0]} barSize={18} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
