import React, { useState, useEffect } from 'react';
import { useMap, GeoJSON, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import Swal from 'sweetalert2';

// -------------------------
// Componente de React-Leaflet
// -------------------------
const RutaOptimizada = ({ origen, destino, routeData }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !routeData || !routeData.geojson) return;

        // Limpiar capas previas de geojson si las hay (opcional si el key cambia)
        // En este caso, ReactLeaflet manejará el ciclo de vida del GeoJSON vía props, 
        // pero podemos auto-ajustar la vista de la cámara:
        if (routeData.geojson.coordinates && routeData.geojson.coordinates.length > 0) {
            const bounds = L.geoJSON(routeData.geojson).getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        }
    }, [map, routeData]);

    if (!routeData || !routeData.geojson) return null;

    // Crear íconos personalizados para el Origen y Destino
    const createMarkerIcon = (color, text) => L.divIcon({
        html: `
            <div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.4); display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 14px;">
                ${text}
            </div>
        `,
        className: 'custom-routing-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
    });

    const iconInicio = createMarkerIcon('#10b981', 'A'); // Verde
    const iconFin = createMarkerIcon('#ef4444', 'B'); // Rojo

    return (
        <>
            {/* 1. Línea pintada en la calle a partir de GeoJSON */}
            <GeoJSON 
                key={routeData.id} // Forza re-render cada vez que cambie la ruta preferida
                data={routeData.geojson} 
                style={{
                    color: '#f97316', 
                    weight: 6, 
                    opacity: 0.85,
                    lineJoin: 'round'
                }} 
            />

            {/* 2. Marcador Origen */}
            {origen && (
                <Marker position={[origen.latitud, origen.longitud]} icon={iconInicio}>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                        <span style={{fontWeight: 800}}>Inicio</span><br/>
                        <span style={{fontSize: '0.8rem', color: '#64748b'}}>{origen.titulo}</span>
                    </Tooltip>
                </Marker>
            )}

            {/* 3. Marcador Destino */}
            {destino && (
                <Marker position={[destino.latitud, destino.longitud]} icon={iconFin}>
                    <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
                        <span style={{fontWeight: 800}}>Destino</span><br/>
                        <span style={{fontSize: '0.8rem', color: '#64748b'}}>{destino.titulo}</span>
                    </Tooltip>
                </Marker>
            )}
        </>
    );
};

export default RutaOptimizada;
