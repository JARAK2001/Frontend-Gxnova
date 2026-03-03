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
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Analíticas Avanzadas</h1>
                    <p className="text-gray-500 text-sm mt-1">Métricas detalladas de rendimiento y crecimiento</p>
                </div>
            </div>

            {/* Crecimiento de Usuarios */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-800">Crecimiento de Usuarios</h3>
                </div>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.crecimiento}>
                            <defs>
                                <linearGradient id="colorCrecimiento" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                            <Area type="monotone" dataKey="cantidad" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCrecimiento)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Usuarios */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <Award size={20} className="text-yellow-600" />
                        <h3 className="text-lg font-bold text-gray-800">Usuarios Mejor Calificados</h3>
                    </div>
                    <div className="space-y-4">
                        {data.topUsuarios.map((usuario, index) => (
                            <div key={usuario.id_usuario} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-yellow-50 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                                        ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                                            index === 1 ? 'bg-gray-200 text-gray-700' :
                                                index === 2 ? 'bg-orange-100 text-orange-700' : 'bg-white border border-gray-200 text-gray-500'}`}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{usuario.nombre} {usuario.apellido}</p>
                                        <p className="text-xs text-gray-500">{usuario.total_calificaciones} reseñas</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200">
                                    <span className="text-yellow-500">★</span>
                                    <span className="font-bold text-gray-700">{usuario.promedio}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Distribución de Categorías */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-6">
                        <MapPin size={20} className="text-purple-600" />
                        <h3 className="text-lg font-bold text-gray-800">Popularidad de Categorías</h3>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={distribucionCategorias} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} stroke="#f0f0f0" />
                                <XAxis type="number" tick={{ fontSize: 12 }} />
                                <YAxis dataKey="id" type="category" width={50} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
