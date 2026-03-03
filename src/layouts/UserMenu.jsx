import React from "react";
import { User, Bell, Plus, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserMenu({
    usuario,
    cantidadNotificaciones,
    mostrarMenuUsuario,
    setMostrarMenuUsuario,
    handleLogout,
    ghostButtonClasses
}) {
    const navigate = useNavigate();

    return (
        <div className="relative">
            <button
                className={`${ghostButtonClasses} flex items-center gap-2`}
                onClick={() => setMostrarMenuUsuario(!mostrarMenuUsuario)}
            >
                <User className="w-5 h-5" />
                <span className="hidden md:inline text-sm font-medium">
                    {usuario ? `${usuario.nombre}` : "Usuario"}
                </span>
            </button>

            {mostrarMenuUsuario && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                    <button
                        onClick={() => {
                            navigate("/perfil");
                            setMostrarMenuUsuario(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <User className="w-4 h-4" />
                        Mi Perfil
                    </button>
                    <button
                        onClick={() => {
                            navigate("/notificaciones");
                            setMostrarMenuUsuario(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <Bell className="w-4 h-4" />
                        Notificaciones
                        {cantidadNotificaciones > 0 && (
                            <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {cantidadNotificaciones}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            navigate("/crear-trabajo");
                            setMostrarMenuUsuario(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Publicar Trabajo
                    </button>
                    <hr className="my-1" />
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;
