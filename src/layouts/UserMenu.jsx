import React from "react";
import { User, Bell, Plus, LogOut, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

function UserMenu({
    usuario,
    cantidadNotificaciones,
    mostrarMenuUsuario,
    setMostrarMenuUsuario,
    handleLogout,
    esEmpleador,
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-50 animate-scale-in">
                    <button
                        onClick={() => {
                            navigate("/perfil");
                            setMostrarMenuUsuario(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 flex items-center gap-2 transition-colors"
                    >
                        <User className="w-4 h-4" />
                        Mi Perfil
                    </button>
                    <button
                        onClick={() => {
                            navigate("/notificaciones");
                            setMostrarMenuUsuario(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 flex items-center gap-2 transition-colors"
                    >
                        <Bell className="w-4 h-4" />
                        Notificaciones
                        {cantidadNotificaciones > 0 && (
                            <span className="ml-auto bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                {cantidadNotificaciones}
                            </span>
                        )}
                    </button>
                    {esEmpleador && (
                        <>
                            <button
                                onClick={() => {
                                    navigate("/dashboard");
                                    setMostrarMenuUsuario(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 flex items-center gap-2 transition-colors"
                            >
                                <LayoutDashboard className="w-4 h-4 text-orange-500" />
                                Mi Dashboard
                            </button>
                            <button
                                onClick={() => {
                                    navigate("/crear-trabajo");
                                    setMostrarMenuUsuario(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-orange-600 flex items-center gap-2 transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Publicar Trabajo
                            </button>
                        </>
                    )}
                    <hr className="my-1 border-slate-100" />
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
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
