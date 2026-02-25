import React from "react";
import { useNavigate } from "react-router-dom";

function CategoriasSection({ categorias }) {
    const navigate = useNavigate();

    if (!categorias || categorias.length === 0) return null;

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Explora por Categorías
                    </h2>
                    <p className="text-gray-600">
                        Encuentra trabajos en las categorías que más te interesan
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {categorias.map((categoria) => (
                        <button
                            key={categoria.id_categoria}
                            onClick={() => navigate(`/servicios?id_categoria=${categoria.id_categoria}`)}
                            className="bg-gray-50 hover:bg-orange-50 border border-gray-200 hover:border-orange-300 rounded-lg p-6 text-center transition-all hover:shadow-md group"
                        >
                            <div className="w-12 h-12 bg-orange-100 group-hover:bg-orange-200 rounded-full flex items-center justify-center mx-auto mb-3 transition-colors">
                                <span className="text-2xl font-bold text-orange-600">
                                    {categoria.nombre.charAt(0)}
                                </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm">
                                {categoria.nombre}
                            </h3>
                            {categoria.descripcion && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {categoria.descripcion}
                                </p>
                            )}
                        </button>
                    ))}
                </div>

                <div className="text-center mt-8">
                    <button
                        onClick={() => navigate("/servicios")}
                        className="px-6 py-2 text-orange-600 hover:text-orange-700 font-semibold"
                    >
                        Ver todas las categorías →
                    </button>
                </div>
            </div>
        </section>
    );
}

export default CategoriasSection;
