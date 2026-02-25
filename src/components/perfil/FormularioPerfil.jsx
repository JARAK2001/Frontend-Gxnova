import React, { useState } from "react";
import API_URL from '../../config/api';
import { Camera, User, Mail, Phone, Save } from 'lucide-react';

function FormularioPerfil({ usuario, onCancel, onSuccess }) {
    const [formData, setFormData] = useState({
        nombre: usuario.nombre || "",
        apellido: usuario.apellido || "",
        correo: usuario.correo || "",
        telefono: usuario.telefono || "",
        foto_perfil: null,
    });
    const [preview, setPreview] = useState(usuario.foto_perfil || "");
    const [uploading, setUploading] = useState(false);

    const handleActualizar = async (e) => {
        e.preventDefault();
        setUploading(true);
        const token = localStorage.getItem("token");

        const data = new FormData();
        data.append('nombre', formData.nombre);
        data.append('apellido', formData.apellido);
        data.append('correo', formData.correo);
        data.append('telefono', formData.telefono);
        if (formData.foto_perfil) {
            data.append('foto_perfil', formData.foto_perfil);
        }

        try {
            const respuesta = await fetch(
                `${API_URL}/api/usuarios/${usuario.id_usuario}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    body: data,
                }
            );

            const result = await respuesta.json();

            if (respuesta.ok) {
                alert("Perfil actualizado exitosamente");
                onSuccess();
            } else {
                alert(`Error: ${result.error || result.message}`);
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("Error de conexión con el servidor");
        } finally {
            setUploading(false);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, foto_perfil: file });
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <form onSubmit={handleActualizar} className="space-y-6">
            {/* Header del formulario */}
            <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
                    <User className="w-7 h-7 text-orange-600" /> Editar Perfil
                </h3>
                <p className="text-gray-600">Actualiza tu información personal</p>
            </div>

            {/* Preview de la foto con diseño mejorado */}
            <div className="flex justify-center mb-6">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 p-1">
                        <img
                            src={preview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.nombre)}+${encodeURIComponent(formData.apellido)}&background=random`}
                            alt="Preview"
                            className="w-full h-full rounded-full object-cover bg-white"
                        />
                    </div>
                    <label
                        htmlFor="file-upload"
                        className="absolute bottom-0 right-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 rounded-full cursor-pointer hover:from-orange-700 hover:to-orange-600 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all"
                    >
                        <Camera className="w-5 h-5" />
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                </div>
            </div>

            {/* Campos del formulario */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Nombre
                    </label>
                    <input
                        type="text"
                        value={formData.nombre}
                        onChange={(e) =>
                            setFormData({ ...formData, nombre: e.target.value })
                        }
                        className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <User className="w-4 h-4" /> Apellido
                    </label>
                    <input
                        type="text"
                        value={formData.apellido}
                        onChange={(e) =>
                            setFormData({ ...formData, apellido: e.target.value })
                        }
                        className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Correo Electrónico
                </label>
                <input
                    type="email"
                    value={formData.correo}
                    onChange={(e) =>
                        setFormData({ ...formData, correo: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Teléfono
                </label>
                <input
                    type="text"
                    value={formData.telefono}
                    onChange={(e) =>
                        setFormData({ ...formData, telefono: e.target.value })
                    }
                    className="w-full rounded-xl border-2 border-gray-200 py-3 px-4 text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                    placeholder="Ej: +57 300 123 4567"
                />
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:from-orange-700 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    <Save className="w-5 h-5" />
                    {uploading ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={uploading}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}

export default FormularioPerfil;
