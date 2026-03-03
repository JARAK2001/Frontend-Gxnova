import { useState, useEffect } from "react";
import { Check, X, Eye } from "lucide-react";
import API_URL from '../../config/api';

const AdminVerificacion = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalImagen, setModalImagen] = useState(null);

    // Obtener usuarios pendientes
    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/verificaciones`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error("Error al cargar verificaciones");

            const data = await response.json();
            setUsuarios(data.usuarios || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerificacion = async (id, aprobado) => {
        if (!confirm(aprobado ? "¿Aprobar usuario?" : "¿Rechazar verificación?")) return;

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/api/admin/verificaciones/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ aprobado }),
            });

            if (!response.ok) throw new Error("Error al procesar la solicitud");

            // Actualizar lista
            setUsuarios(usuarios.filter((u) => u.id_usuario !== id));
            alert(aprobado ? "Usuario verificado" : "Verificación rechazada");
        } catch (err) {
            alert(err.message);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Verificación de Identidad</h1>

            {usuarios.length === 0 ? (
                <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                    No hay usuarios pendientes de verificación.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {usuarios.map((usuario) => (
                        <div key={usuario.id_usuario} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            <div className="p-4 border-b border-gray-100 bg-gray-50">
                                <h3 className="font-bold text-lg text-gray-800">
                                    {usuario.nombre} {usuario.apellido}
                                </h3>
                                <p className="text-sm text-gray-500">{usuario.correo}</p>
                                <p className="text-xs text-gray-400 mt-1">Registrado: {new Date(usuario.fecha_registro).toLocaleDateString()}</p>
                            </div>

                            <div className="p-4 space-y-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="group relative cursor-pointer" onClick={() => setModalImagen(usuario.foto_cedula)}>
                                        <p className="text-xs font-semibold mb-1 text-gray-600">Cédula</p>
                                        <div className="aspect-video bg-gray-100 rounded-md overflow-hidden relative">
                                            <img src={usuario.foto_cedula} alt="Cédula" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                                <Eye className="text-white opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group relative cursor-pointer" onClick={() => setModalImagen(usuario.foto_perfil)}>
                                        <p className="text-xs font-semibold mb-1 text-gray-600">Selfie</p>
                                        <div className="aspect-square bg-gray-100 rounded-md overflow-hidden relative">
                                            <img src={usuario.foto_perfil} alt="Selfie" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                                                <Eye className="text-white opacity-0 group-hover:opacity-100" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-4">
                                    <button
                                        onClick={() => handleVerificacion(usuario.id_usuario, false)}
                                        className="flex-1 bg-red-100 text-red-700 py-2 rounded-md hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X size={18} /> Rechazar
                                    </button>
                                    <button
                                        onClick={() => handleVerificacion(usuario.id_usuario, true)}
                                        className="flex-1 bg-green-100 text-green-700 py-2 rounded-md hover:bg-green-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Check size={18} /> Aprobar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal para ver imagen en grande */}
            {modalImagen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4" onClick={() => setModalImagen(null)}>
                    <div className="relative max-w-4xl max-h-screen">
                        <img src={modalImagen} alt="Documento" className="max-w-full max-h-[90vh] rounded-lg shadow-2xl" />
                        <button
                            className="absolute top-4 right-4 bg-white rounded-full p-2 text-black hover:bg-gray-200"
                            onClick={() => setModalImagen(null)}
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminVerificacion;
