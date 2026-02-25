import React, { useEffect, useState } from "react";
import API_URL from '../../config/api';
import Estrellas from "../common/Estrellas";
import { Mail, Phone, CheckCircle, Users, Calendar, Briefcase, Wrench, Rocket, Edit } from 'lucide-react';

function DatosPersonales({ usuario, onEdit, onRefresh }) {
    const [promedio, setPromedio] = useState({ promedio: 0, cantidad: 0 });

    useEffect(() => {
        if (usuario?.id_usuario) {
            cargarPromedio();
        }
    }, [usuario]);

    const cargarPromedio = async () => {
        try {
            const res = await fetch(`${API_URL}/api/calificaciones/usuario/${usuario.id_usuario}/promedio`);
            const data = await res.json();
            if (res.ok) {
                setPromedio(data);
            }
        } catch (error) {
            console.error("Error al cargar promedio:", error);
        }
    };

    const handleActivarRol = async (nuevoRol) => {
        if (!window.confirm(`¿Quieres activar el perfil de ${nuevoRol}?`)) return;

        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${API_URL}/api/usuarios/agregar-rol`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ rol: nuevoRol })
            });

            if (res.ok) {
                alert(`Ahora tienes el perfil de ${nuevoRol}`);
                onRefresh();
            } else {
                const data = await res.json();
                alert(`Error: ${data.error || data.message}`);
            }
        } catch (error) {
            console.error("Error activando rol:", error);
            alert("Error de conexión");
        }
    };

    return (
        <div>
            {/* Header del perfil con foto y datos principales */}
            <div className="relative mb-8">
                {/* Banner decorativo */}
                <div className="h-32 bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 rounded-2xl mb-6"></div>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end -mt-20 px-4">
                    <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-4 md:mb-0">
                        {/* Avatar con borde y sombra */}
                        <div className="relative">
                            <img
                                src={usuario.foto_perfil || `https://ui-avatars.com/api/?name=${encodeURIComponent(usuario.nombre)}+${encodeURIComponent(usuario.apellido)}&background=random`}
                                alt="Foto de perfil"
                                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-2xl"
                            />
                            <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>

                        <div className="text-center md:text-left mb-4 md:mb-2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                {usuario.nombre} {usuario.apellido}
                            </h2>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <Estrellas puntuacion={promedio.promedio} />
                                <span className="text-sm font-semibold text-gray-700">
                                    {promedio.promedio.toFixed(1)}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ({promedio.cantidad} {promedio.cantidad === 1 ? 'reseña' : 'reseñas'})
                                </span>
                            </div>
                            <p className="text-gray-600 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" /> {usuario.correo}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onEdit}
                        className="px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <Edit className="w-5 h-5" /> Editar Perfil
                    </button>
                </div>
            </div>

            {/* Grid de información */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Tarjeta de Teléfono */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                            <Phone className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold text-blue-900">Teléfono</p>
                    </div>
                    <p className="text-gray-900 font-medium ml-13">
                        {usuario.telefono || "No especificado"}
                    </p>
                </div>

                {/* Tarjeta de Estado */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                            <CheckCircle className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold text-green-900">Estado de la cuenta</p>
                    </div>
                    <span
                        className={`inline-block px-4 py-2 text-sm font-bold rounded-full capitalize ml-13 ${usuario.estado === "activo"
                            ? "bg-green-200 text-green-900"
                            : "bg-red-200 text-red-900"
                            }`}
                    >
                        {usuario.estado === "activo" ? "✅ Activo" : "❌ Inactivo"}
                    </span>
                </div>

                {/* Tarjeta de Roles */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                            <Users className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold text-purple-900">Roles activos</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {usuario.rolesAsignados?.map((rolAsignado) => (
                            <span
                                key={rolAsignado.rol.id_rol}
                                className="px-4 py-2 bg-gradient-to-r from-purple-200 to-pink-200 text-purple-900 text-sm font-bold rounded-full border border-purple-300 flex items-center gap-1"
                            >
                                {rolAsignado.rol.nombre === "Empleador" ? <Briefcase className="w-4 h-4" /> : <Wrench className="w-4 h-4" />} {rolAsignado.rol.nombre}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Tarjeta de Fecha de registro */}
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-5 border border-orange-100 hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                            <Calendar className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-semibold text-orange-900">Miembro desde</p>
                    </div>
                    <p className="text-gray-900 font-medium ml-13">
                        {new Date(usuario.fecha_registro).toLocaleDateString("es-CO", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* Sección de activar roles */}
            {(!usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") ||
                !usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador")) && (
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Rocket className="w-6 h-6 text-orange-600" /> Expande tus posibilidades
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Empleador") && (
                                <button
                                    onClick={() => handleActivarRol("Empleador")}
                                    className="p-5 bg-white border-2 border-orange-300 rounded-xl hover:border-orange-500 hover:shadow-lg transition-all group"
                                >
                                    <Briefcase className="w-10 h-10 mb-2 text-orange-600 group-hover:scale-110 transition-transform mx-auto" />
                                    <h4 className="font-bold text-gray-900 mb-1">Modo Empleador</h4>
                                    <p className="text-sm text-gray-600">Publica trabajos y contrata profesionales</p>
                                </button>
                            )}
                            {!usuario.rolesAsignados?.some(r => r.rol.nombre === "Trabajador") && (
                                <button
                                    onClick={() => handleActivarRol("Trabajador")}
                                    className="p-5 bg-white border-2 border-green-300 rounded-xl hover:border-green-500 hover:shadow-lg transition-all group"
                                >
                                    <Wrench className="w-10 h-10 mb-2 text-green-600 group-hover:scale-110 transition-transform mx-auto" />
                                    <h4 className="font-bold text-gray-900 mb-1">Modo Trabajador</h4>
                                    <p className="text-sm text-gray-600">Postúlate a trabajos y ofrece tus servicios</p>
                                </button>
                            )}
                        </div>
                    </div>
                )}
        </div>
    );
}

export default DatosPersonales;
