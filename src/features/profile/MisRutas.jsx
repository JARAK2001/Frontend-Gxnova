import React, { useState, useEffect } from "react";
import API_URL from '../../config/api';
import { Clock, Navigation, Map as MapIcon, Calendar, MapPin, Search } from 'lucide-react';
import MapaRuta from '../jobs/MapaRuta';
import { useAuth } from '../../context/AuthContext';
import { io } from "socket.io-client";
import Swal from 'sweetalert2';

function MisRutas({ usuarioId }) {
    const { token } = useAuth();
    const [trabajosAceptados, setTrabajosAceptados] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Map states
    const [trabajoSeleccionado, setTrabajoSeleccionado] = useState(null); // Simple route
    const [multiplesParadas, setMultiplesParadas] = useState([]); // Multiple routes
    const [ubicacionTrabajador, setUbicacionTrabajador] = useState(null); 
    const [cargandoGPS, setCargandoGPS] = useState(false);
    const [trabajoCargando, setTrabajoCargando] = useState(null); // ID del trabajo cuya ruta se está generando
    
    // Socket
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(API_URL);
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (usuarioId) cargarRutas();
    }, [usuarioId]);

    const cargarRutas = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/postulaciones?id_trabajador=${usuarioId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                // Filtrar solo las aceptadas y que el trabajo no esté cancelado ni completado y tenga coords
                const activas = (data.postulaciones || []).filter(p => 
                    p.estado === 'aceptada' && 
                    p.trabajo && 
                    p.trabajo.estado !== 'completado' && 
                    p.trabajo.estado !== 'cancelado' &&
                    p.trabajo.latitud && 
                    p.trabajo.longitud
                ).map(p => p.trabajo); // Nos interesa el Trabajo directamente
                setTrabajosAceptados(activas);
            }
        } catch (error) {
            console.error("Error cargando mis rutas:", error);
        } finally {
            setLoading(false);
        }
    };

    // Funciones GPS y Mapa
    const irAlTrabajo = (trabajo) => {
        if (!('geolocation' in navigator)) {
            Swal.fire({ icon: 'error', title: 'GPS no disponible', text: 'Tu navegador no soporta geolocalización.', confirmButtonColor: '#ea580c' });
            return;
        }

        setCargandoGPS(true);
        setTrabajoCargando(trabajo.id_trabajo);
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                setUbicacionTrabajador({ latitud: posicion.coords.latitude, longitud: posicion.coords.longitude });
                setTrabajoSeleccionado(trabajo);
                setMultiplesParadas([]);
                setCargandoGPS(false);
                setTrabajoCargando(null);
            },
            (error) => {
                setCargandoGPS(false);
                setTrabajoCargando(null);
                Swal.fire({ icon: 'warning', title: 'Permiso denegado', text: 'Activa el GPS para trazar la ruta.', confirmButtonColor: '#ea580c' });
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const verRutaDelDia = (trabajosDelDia) => {
        if (!('geolocation' in navigator)) return;
        setCargandoGPS(true);
        navigator.geolocation.getCurrentPosition(
            (posicion) => {
                setUbicacionTrabajador({ latitud: posicion.coords.latitude, longitud: posicion.coords.longitude });
                setMultiplesParadas(trabajosDelDia);
                setTrabajoSeleccionado(null);
                setCargandoGPS(false);
            },
            () => setCargandoGPS(false),
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const cerrarMapa = () => {
        setTrabajoSeleccionado(null);
        setMultiplesParadas([]);
    };

    const enviarUbicacion = (trabajo) => {
        if (!socket || !trabajo) return;

        const enviar = (lat_trabajador, lng_trabajador) => {
            socket.emit('update_location', {
                id_empleador: trabajo.id_empleador || trabajo.empleador?.id_usuario,
                latitud_trabajador: lat_trabajador,
                longitud_trabajador: lng_trabajador,
                latitud_trabajo: trabajo.latitud,
                longitud_trabajo: trabajo.longitud
            });
            Swal.fire({ icon: 'success', title: 'Ubicación enviada', text: 'Se ha notificado al cliente que estás llegando.', confirmButtonColor: '#ea580c', timer: 2500, showConfirmButton: false });
        };

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => enviar(pos.coords.latitude, pos.coords.longitude),
                () => enviar(trabajo.latitud + 0.001, trabajo.longitud + 0.001), // mock fallback
                { enableHighAccuracy: true, timeout: 5000 }
            );
        } else {
            enviar(trabajo.latitud + 0.001, trabajo.longitud + 0.001);
        }
    };

    // --- Agrupador por fechas ---
    const agrupados = {
        hoy: [],
        manana: [],
        proximamente: [],
        sinFecha: []
    };

    const hoyDate = new Date();
    hoyDate.setHours(0,0,0,0);
    
    const mananaDate = new Date();
    mananaDate.setDate(hoyDate.getDate() + 1);
    mananaDate.setHours(0,0,0,0);

    trabajosAceptados.forEach(t => {
        if (!t.fecha_estimada) {
            agrupados.sinFecha.push(t);
        } else {
            const dateStr = t.fecha_estimada;
            const jobD = typeof dateStr === 'string' && !dateStr.includes('T') ? new Date(dateStr + "T00:00:00") : new Date(dateStr);
            jobD.setHours(0,0,0,0);

            const tsJob = jobD.getTime();
            const tsHoy = hoyDate.getTime();
            const tsManana = mananaDate.getTime();

            if (tsJob === tsHoy) agrupados.hoy.push(t);
            else if (tsJob === tsManana) agrupados.manana.push(t);
            else agrupados.proximamente.push(t);
        }
    });

    const GrupoRutina = ({ titulo, trabajos, iconBg, textColor }) => {
        if (trabajos.length === 0) return null;
        
        return (
            <div style={{ marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: textColor, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: iconBg }}></div>
                        {titulo} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>({trabajos.length})</span>
                    </h3>
                    {trabajos.length > 1 && (
                        <button
                            onClick={() => verRutaDelDia(trabajos)}
                            disabled={cargandoGPS}
                            style={{ padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 800, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: '#fff', boxShadow: '0 4px 10px rgba(249,115,22,0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '6px', opacity: cargandoGPS ? 0.7 : 1 }}
                        >
                            <MapIcon size={16} /> Ruta del Día
                        </button>
                    )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                    {trabajos.map((trabajo) => (
                        <div key={trabajo.id_trabajo} style={{ background: '#fff', borderRadius: '18px', padding: '20px', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', transition: 'all 0.2s' }}>
                            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 10px 0', lineHeight: 1.2 }}>{trabajo.titulo}</h4>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                                    <MapPin size={14} color="#ea580c" />
                                    <span>{trabajo.ubicacion}</span>
                                </div>
                                {trabajo.fecha_estimada && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '0.85rem' }}>
                                        <Calendar size={14} color="#3b82f6" />
                                        <span>{new Date(trabajo.fecha_estimada).toLocaleDateString("es-CO", { day: 'numeric', month: 'long' })}</span>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: 'auto', display: 'flex', gap: '8px', flexDirection: 'column' }}>
                                <button
                                    onClick={() => irAlTrabajo(trabajo)}
                                    disabled={cargandoGPS}
                                    style={{ width: '100%', padding: '10px', borderRadius: '10px', background: trabajoCargando === trabajo.id_trabajo ? 'linear-gradient(135deg,#f97316,#ea580c)' : '#fff', color: trabajoCargando === trabajo.id_trabajo ? '#fff' : '#ea580c', fontWeight: 700, fontSize: '0.85rem', border: '1px solid #fed7aa', cursor: cargandoGPS ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s', opacity: cargandoGPS && trabajoCargando !== trabajo.id_trabajo ? 0.5 : 1 }}
                                >
                                    {trabajoCargando === trabajo.id_trabajo ? (
                                        <>
                                            <div style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', flexShrink: 0 }} />
                                            Generando ruta...
                                        </>
                                    ) : (
                                        <><Navigation size={16} /> Ir al Trabajo</>
                                    )}
                                </button>

                                <button
                                    onClick={() => enviarUbicacion(trabajo)}
                                    style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                >
                                    <Clock size={16} /> Avisar llegada (Socket)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div>
            {/* --- Modales de Mapa --- */}
            {trabajoSeleccionado && ubicacionTrabajador && (
                <MapaRuta
                    titulo={trabajoSeleccionado.titulo}
                    stops={[
                        { latitud: ubicacionTrabajador.latitud, longitud: ubicacionTrabajador.longitud, titulo: 'Mi Ubicación' },
                        { latitud: trabajoSeleccionado.latitud, longitud: trabajoSeleccionado.longitud, titulo: trabajoSeleccionado.titulo }
                    ]}
                    onClose={cerrarMapa}
                />
            )}
            
            {multiplesParadas.length > 0 && ubicacionTrabajador && (
                <MapaRuta
                    titulo={`Ruta de Múltiples Paradas`}
                    stops={[
                        { latitud: ubicacionTrabajador.latitud, longitud: ubicacionTrabajador.longitud, titulo: 'Mi Ubicación Inicial' },
                        ...multiplesParadas.map((t, idx) => ({ latitud: t.latitud, longitud: t.longitud, titulo: `${idx + 1}. ${t.titulo}` }))
                    ]}
                    onClose={cerrarMapa}
                />
            )}

            {/* --- Contenido Principal --- */}
            {loading ? (
                <div style={{ padding: '4rem 0', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '40px', height: '40px', border: '3px solid #f97316', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
            ) : trabajosAceptados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4.5rem 2rem', background: '#f8fafc', borderRadius: '24px', border: '2px dashed #e2e8f0' }}>
                    <div style={{ width: '70px', height: '70px', borderRadius: '22px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <MapIcon size={34} />
                    </div>
                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>Sin rutas asignadas</h4>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '400px', margin: '0 auto' }}>
                        Tus trabajos aceptados aparecerán aquí para que planifiques tus traslados diarios.
                    </p>
                </div>
            ) : (
                <>
                    <GrupoRutina titulo="Para Hoy" trabajos={agrupados.hoy} iconBg="#10b981" textColor="#0f172a" />
                    <GrupoRutina titulo="Para Mañana" trabajos={agrupados.manana} iconBg="#f59e0b" textColor="#0f172a" />
                    <GrupoRutina titulo="Próximamente" trabajos={agrupados.proximamente} iconBg="#3b82f6" textColor="#475569" />
                    <GrupoRutina titulo="Sin fecha definida" trabajos={agrupados.sinFecha} iconBg="#cbd5e1" textColor="#64748b" />
                </>
            )}
        </div>
    );
}

export default MisRutas;
