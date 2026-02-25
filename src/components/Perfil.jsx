import React, { useState, useEffect } from "react";
import API_URL from '../config/api';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Encabezado from "./Encabezado";
import DatosPersonales from "./perfil/DatosPersonales";
import FormularioPerfil from "./perfil/FormularioPerfil";
import SeccionHabilidades from "./perfil/SeccionHabilidades";
import MisPublicaciones from "./perfil/MisPublicaciones";

function Perfil() {
    const navigate = useNavigate();
    const { token, logout } = useAuth();
    const [usuario, setUsuario] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editando, setEditando] = useState(false);

    useEffect(() => {
        cargarPerfil();
    }, []);

    const cargarPerfil = async () => {
        if (!token) {
            navigate("/auth");
            return;
        }

        setLoading(true);
        try {
            const respuesta = await fetch(`${API_URL}/api/usuarios/perfil`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (respuesta.status === 401) {
                logout();
                navigate("/auth");
                return;
            }

            const data = await respuesta.json();
            if (data.usuario) {
                setUsuario(data.usuario);
            }
        } catch (error) {
            console.error("Error al cargar perfil:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">Cargando perfil...</p>
                </div>
            </div>
        );
    }

    if (!usuario) {
        return (
            <div>
                <Encabezado />
                <div className="container mx-auto px-4 py-12 text-center">
                    <p className="text-gray-500">No se pudo cargar el perfil</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-gray-50">
            <Encabezado />

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                {/* Header con gradiente */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-400 bg-clip-text text-transparent mb-2">
                        Mi Perfil
                    </h1>
                    <p className="text-gray-600">Administra tu información personal y configuración</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    {!editando ? (
                        <div>
                            <DatosPersonales
                                usuario={usuario}
                                onEdit={() => setEditando(true)}
                                onRefresh={cargarPerfil}
                            />

                            {/* SECCIÓN DE HABILIDADES (Solo si tiene rol Trabajador) */}
                            {usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador") && (
                                <SeccionHabilidades usuarioId={usuario.id_usuario} />
                            )}

                            {/* SECCIÓN DE MIS PUBLICACIONES (Solo si tiene rol Empleador) */}
                            {usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") && (
                                <MisPublicaciones usuarioId={usuario.id_usuario} />
                            )}
                        </div>

                    ) : (
                        <FormularioPerfil
                            usuario={usuario}
                            onCancel={() => setEditando(false)}
                            onSuccess={() => {
                                setEditando(false);
                                cargarPerfil();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

export default Perfil;
