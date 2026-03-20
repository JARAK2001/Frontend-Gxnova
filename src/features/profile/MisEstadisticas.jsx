import React, { useState, useEffect } from 'react';
import API_URL from '../../config/api';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Map as MapIcon, BarChart3, TrendingUp } from 'lucide-react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet.heat';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const HeatmapLayer = ({ data }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !data || data.length === 0) return;

        // Convertir data a formato de leaflet.heat: [lat, lng, intensity]
        const points = data.map(p => [p.latitud, p.longitud, 1]);

        const heatLayer = L.heatLayer(points, {
            radius: 25,
            blur: 15,
            maxZoom: 14,
            gradient: {
                0.4: '#3b82f6', // azul
                0.6: '#10b981', // verde
                0.8: '#f59e0b', // amarillo
                1.0: '#ef4444'  // rojo
            }
        }).addTo(map);

        return () => {
            map.removeLayer(heatLayer);
        };
    }, [map, data]);

    return null;
};

const MapCenterUpdater = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom(), { animate: true });
        }
    }, [center, map]);
    return null;
};

const MisEstadisticas = () => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [heatmapData, setHeatmapData] = useState([]);
    const [earningsData, setEarningsData] = useState([]);
    const [mapCenter, setMapCenter] = useState([4.6097, -74.0817]); // Default Bogotá

    useEffect(() => {
        cargarDatos();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => setMapCenter([position.coords.latitude, position.coords.longitude]),
                (error) => console.error("Error obteniendo la ubicación:", error)
            );
        }
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            // 1. Cargar datos del Heatmap (Zonas de demanda)
            const resHeatmap = await fetch(`${API_URL}/api/stats/heatmap`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const dataHeatmap = await resHeatmap.json();
            if (dataHeatmap.success) {
                setHeatmapData(dataHeatmap.trabajos);
            }

            // 2. Cargar datos de Ganancias por Barrio
            const resEarnings = await fetch(`${API_URL}/api/stats/earnings`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const dataEarnings = await resEarnings.json();
            if (dataEarnings.success) {
                setEarningsData(dataEarnings.data);
            }
        } catch (error) {
            console.error('Error al cargar estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 size={30} style={{ animation: 'spin 1s linear infinite', color: '#f97316' }} />
            </div>
        );
    }

    const totalIngresos = earningsData.reduce((sum, item) => sum + Number(item.ingresos), 0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Header / Resumen */}
            <div style={{
                background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
            }}>
                <div>
                    <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <TrendingUp size={24} color="#f97316" />
                        Tus Ingresos Totales
                    </h3>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>Basado en trabajos pagados con dinero</p>
                </div>
                <div style={{
                    background: '#fff', padding: '1rem 2rem', borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                    border: '1px solid #e2e8f0'
                }}>
                    <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#10b981' }}>
                        ${totalIngresos.toLocaleString('es-CO')}
                    </span>
                </div>
            </div>

            {/* Gráfica de Ganancias por Barrio */}
            <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '1rem' }}>
                    <BarChart3 size={20} color="#f97316" />
                    Ganancias por Barrio
                </h4>
                <div style={{ height: '350px', background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    {earningsData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                            <BarChart data={earningsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `$${val}`} />
                                <Tooltip
                                    cursor={{fill: '#f1f5f9'}}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    formatter={(value) => [`$${value.toLocaleString('es-CO')}`, 'Ingresos']}
                                />
                                <Bar dataKey="ingresos" radius={[6, 6, 0, 0]}>
                                    {earningsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={'#f97316'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                            Aún no tienes ingresos registrados para graficar.
                        </div>
                    )}
                </div>
            </div>

            {/* Mapa de Calor de Demanda */}
            <div>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', marginBottom: '1rem' }}>
                    <MapIcon size={20} color="#f97316" />
                    Zonas de Alta Demanda (Servicios Solicitados)
                </h4>
                <div style={{
                    height: '450px', borderRadius: '16px', overflow: 'hidden',
                    border: '1px solid #e2e8f0', position: 'relative', zIndex: 1
                }}>
                    <MapContainer
                        center={mapCenter}
                        zoom={12}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <MapCenterUpdater center={mapCenter} />
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        />
                        <HeatmapLayer data={heatmapData} />
                    </MapContainer>
                </div>
                <p style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b', textAlign: 'center' }}>
                    Las zonas más rojas indican lugares donde más clientes están pidiendo servicios en este momento.
                </p>
            </div>

        </div>
    );
};

export default MisEstadisticas;
