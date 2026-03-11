import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import RoutingMachine from './RoutingMachine';
import RutaOptimizada from './RutaOptimizada';
import { X, Rocket, Fuel, Search, Navigation } from 'lucide-react';

const MapaRuta = ({ stops, onClose, titulo }) => {
    if (!stops || stops.length < 2) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', background: '#fff', borderRadius: '16px' }}>
                <p>No hay suficientes coordenadas para trazar una ruta.</p>
                <button onClick={onClose} style={{ marginTop: '1rem', padding: '10px 20px', background: '#f97316', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                    Cerrar
                </button>
            </div>
        );
    }

    const [preferencia, setPreferencia] = useState('FASTEST');
    const [opcionesRuta, setOpcionesRuta] = useState([]);
    const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);
    const [cargandoApi, setCargandoApi] = useState(false);
    const [errorApi, setErrorApi] = useState(false);

    const origen = stops[0];
    const destino = stops[stops.length - 1];
    const esRutaSencilla = stops.length === 2;

    useEffect(() => {
        // Solo llamamos a la API de Python si es ruta sencilla (1 origen, 1 destino)
        if (esRutaSencilla) {
            obtenerRutaOptimizada(preferencia);
        }
    }, [preferencia, esRutaSencilla]);

    const obtenerRutaOptimizada = async (pref) => {
        setCargandoApi(true);
        setErrorApi(false);
        try {
            const body = {
                origin: { lat: origen.latitud, lng: origen.longitud },
                destination: { lat: destino.latitud, lng: destino.longitud },
                preference: pref,
                k: 1
            };
            
            const res = await fetch("http://localhost:8000/route-options", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            if (!res.ok) throw new Error("Error en la API de Python");
            
            const data = await res.json();
            setOpcionesRuta(data.routes || []);
            setIndiceSeleccionado(0);
        } catch (err) {
            // 404 es comportamiento esperado cuando estamos fuera de la zona de cobertura OSRM
            setErrorApi(true); // Fallback a leaflet-routing-machine
        } finally {
            setCargandoApi(false);
        }
    };

    const rutaActiva = opcionesRuta[indiceSeleccionado];

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(15,23,42,0.85)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '1rem'
        }}>
            <div style={{
                background: '#fff', width: '100%', maxWidth: '900px', height: '85vh',
                borderRadius: '24px', overflow: 'hidden', display: 'flex', flexDirection: 'column',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
                <div style={{
                    padding: '1.25rem 1.5rem',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                    <div>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1.15rem', fontWeight: 800, display: 'flex', alignItems:'center', gap: '8px' }}>
                            <Navigation size={20} /> {titulo || 'Ruta al trabajo'}
                        </h3>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', marginTop: '4px' }}>
                            {origen.titulo} &rarr; {destino.titulo}
                        </p>
                    </div>
                </div>

                {/* Panel de Preferencias (solo para ruta sencilla cuando la API Python funciona) */}
                {esRutaSencilla && !errorApi && (
                    <div style={{ 
                        padding: '1rem 1.5rem', background: '#f8fafc', borderBottom: '1px solid #e2e8f0',
                        display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', gap: '0.5rem', background: '#e2e8f0', padding: '4px', borderRadius: '12px' }}>
                            <button
                                onClick={() => setPreferencia('FASTEST')}
                                style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, border: 'none', cursor: 'pointer', transition: '0.2s', background: preferencia === 'FASTEST' ? '#fff' : 'transparent', color: preferencia === 'FASTEST' ? '#ea580c' : '#64748b', boxShadow: preferencia === 'FASTEST' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Rocket size={16} /> Más Rápida
                            </button>
                            <button
                                onClick={() => setPreferencia('CHEAPEST')}
                                style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, border: 'none', cursor: 'pointer', transition: '0.2s', background: preferencia === 'CHEAPEST' ? '#fff' : 'transparent', color: preferencia === 'CHEAPEST' ? '#10b981' : '#64748b', boxShadow: preferencia === 'CHEAPEST' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Fuel size={16} /> Eco / Barata
                            </button>
                            <button
                                onClick={() => setPreferencia('SHORT_DISTANCE')}
                                style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, border: 'none', cursor: 'pointer', transition: '0.2s', background: preferencia === 'SHORT_DISTANCE' ? '#fff' : 'transparent', color: preferencia === 'SHORT_DISTANCE' ? '#3b82f6' : '#64748b', boxShadow: preferencia === 'SHORT_DISTANCE' ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                            >
                                <Search size={16} /> Más Corta
                            </button>
                        </div>
                        
                        {/* Status Stats */}
                        {cargandoApi ? (
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>Optimizando ruta...</span>
                        ) : rutaActiva ? (
                            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', fontWeight: 800 }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Tiempo Ext.</span>
                                    <span style={{ color: '#0f172a' }}>{Math.round(rutaActiva.duration_min)} min</span>
                                </div>
                                <div style={{ width: '1px', background: '#cbd5e1' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Distancia</span>
                                    <span style={{ color: '#0f172a' }}>{rutaActiva.distance_km.toFixed(1)} km</span>
                                </div>
                                <div style={{ width: '1px', background: '#cbd5e1' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                    <span style={{ color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>Gasto Estimado</span>
                                    <span style={{ color: '#ea580c' }}>${rutaActiva.fuel_cost_cop.toLocaleString('es-CO')}</span>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}
                
                {/* Botón flotante cerrar integrado sobre el mapa */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '15px', right: '15px', zIndex: 9999,
                    width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: '#475569', transition: '0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <X size={20} />
                </button>

                <div style={{ flex: 1, position: 'relative' }}>
                    <MapContainer
                        center={[stops[0].latitud, stops[0].longitud]}
                        zoom={13}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                        />
                        {/* Fallback a LeafletRoutingMachine si hay Error API o son múltiples paradas */}
                        {(!esRutaSencilla || errorApi) ? (
                            <RoutingMachine stops={stops} />
                        ) : (
                            <RutaOptimizada origen={origen} destino={destino} routeData={rutaActiva} />
                        )}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

export default MapaRuta;
