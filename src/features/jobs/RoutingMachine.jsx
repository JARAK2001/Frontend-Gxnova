import React, { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-routing-machine';

const RoutingMachine = ({ stops }) => {
    const map = useMap();
    const controlRef = useRef(null);

    useEffect(() => {
        if (!map || !stops || stops.length < 2) return;

        const waypoints = stops.map(stop => L.latLng(stop.latitud, stop.longitud));

        // Silenciar temporalmente el aviso del servidor demo de OSRM (comportamiento esperado)
        const originalWarn = console.warn;
        console.warn = (...args) => {
            if (typeof args[0] === 'string' && args[0].includes('demo server')) return;
            originalWarn.apply(console, args);
        };

        const routingControl = L.Routing.control({
            waypoints,
            lineOptions: {
                styles: [{ color: '#f97316', weight: 5, opacity: 0.8 }]
            },
            show: false,
            addWaypoints: false,
            routeWhileDragging: false,
            draggableWaypoints: false,
            fitSelectedRoutes: true,
            createMarker: (i, waypoint, n) => {
                let bgColor = '#3b82f6';
                if (i === 0) bgColor = '#10b981';
                else if (i === n - 1) bgColor = '#ef4444';

                const markerHtml = `
                    <div style="background-color: ${bgColor}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; font-size: 12px;">
                        ${i + 1}
                    </div>
                `;
                const customIcon = L.divIcon({
                    html: markerHtml,
                    className: 'custom-routing-marker',
                    iconSize: [24, 24],
                    iconAnchor: [12, 12]
                });
                return L.marker(waypoint.latLng, { icon: customIcon });
            }
        });

        // Restaurar console.warn original
        console.warn = originalWarn;

        controlRef.current = routingControl;

        try {
            routingControl.addTo(map);
        } catch (e) {
            // ignorado silenciosamente
        }

        return () => {
            // Desconectar todos los listeners ANTES de remover del mapa,
            // así los callbacks por XHR no encuentran ya un mapa nulo.
            try {
                if (controlRef.current) {
                    controlRef.current.off();
                    if (map && map.hasLayer) {
                        map.removeControl(controlRef.current);
                    }
                    controlRef.current = null;
                }
            } catch (e) {
                // Silenciar error interno de leaflet-routing-machine
            }
        };
    }, [map]);  // Nota: stops no está en deps para evitar re-mount innecesario

    return null;
};

export default RoutingMachine;
