import React from "react";
import { Search } from "lucide-react";

function SearchBar({ busqueda, setBusqueda, handleBuscar, inputClasses }) {
    return (
        <div className="flex-1 max-w-lg mx-4 hidden md:block">
            <form onSubmit={handleBuscar}>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Buscar proyectos, freelancers o servicios..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        className={`pl-10 pr-4 bg-gray-100 border-gray-300 focus:bg-white focus:border-primary/30 transition-all duration-200 ${inputClasses}`}
                        id="busqueda-principal"
                    />
                </div>
            </form>
        </div>
    );
}

export default SearchBar;
