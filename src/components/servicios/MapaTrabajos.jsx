import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';

// ----------------------------------------------------------------------
// CONFIGURACIÓN DE ÍCONOS DE LEAFLET
// Leaflet tiene un problema conocido mostrando los íconos por defecto en React.
// Este código arregla ese problema para que se vean los marcadores azules.
// ----------------------------------------------------------------------
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;
// ----------------------------------------------------------------------

const MapaTrabajos = ({ trabajos }) => {
    const navigate = useNavigate();

    // Filtramos solo los trabajos que tengan coordenadas válidas
    const trabajosConUbicacion = trabajos.filter(t => t.latitud && t.longitud);

    // Coordenadas por defecto (Centro de una ciudad ejemplo, o promedio)
    // Usaremos una coordenada neutra si no hay trabajos.
    const centroPorDefecto = [4.6097, -74.0817]; // Bogotá, Colombia (Ejemplo)

    if (trabajosConUbicacion.length === 0) {
        return (
            <div className="h-96 flex items-center justify-center bg-gray-100 rounded-xl">
                <p className="text-gray-500">No hay trabajos con ubicación en este momento.</p>
            </div>
        );
    }

    return (
        <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0">
            {/* 
              MapContainer: El contenedor principal del mapa.
              center: Dónde empieza mirando el mapa.
              zoom: Nivel de acercamiento (13 es nivel ciudad/barrio).
            */}
            <MapContainer
                center={[trabajosConUbicacion[0].latitud, trabajosConUbicacion[0].longitud]}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
            >
                {/* TileLayer: Es la "piel" del mapa. Usamos OpenStreetMap que es gratis. */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Renderizamos un Marcador por cada trabajo */}
                {trabajosConUbicacion.map((trabajo) => (
                    <Marker
                        key={trabajo.id_trabajo}
                        position={[trabajo.latitud, trabajo.longitud]}
                    >
                        {/* Popup: Lo que sale al hacer click en el marcador */}
                        <Popup>
                            <div className="min-w-[150px]">
                                <h3 className="font-bold text-gray-800">{trabajo.titulo}</h3>
                                <p className="text-sm text-gray-600 mb-2 truncate">
                                    {trabajo.categoria?.nombre || 'General'}
                                </p>
                                <button
                                    onClick={() => navigate(`/detalles/${trabajo.id_trabajo}`)}
                                    className="text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 w-full"
                                >
                                    Ver Detalles
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapaTrabajos;
