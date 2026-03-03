import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar({ estaLogueado, ghostButtonClasses }) {
    const navigate = useNavigate();

    return (
        <nav className="hidden lg:flex items-center gap-1" role="navigation" aria-label="Navegación principal">
            <button
                className={`py-2 px-3 text-sm font-medium ${ghostButtonClasses}`}
                onClick={() => navigate("/servicios")}
            >
                Buscar Trabajo
            </button>

            <button
                className={`py-2 px-3 text-sm font-medium ${ghostButtonClasses}`}
                onClick={() => navigate("/servicios")}
            >
                Servicios
            </button>

            {estaLogueado && (
                <button
                    className={`py-2 px-3 text-sm font-medium ${ghostButtonClasses}`}
                    onClick={() => navigate("/crear-trabajo")}
                >
                    Publicar
                </button>
            )}
        </nav>
    );
}

export default Navbar;
