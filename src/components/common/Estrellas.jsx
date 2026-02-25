import React from 'react';
import { Star } from 'lucide-react';

const Estrellas = ({ puntuacion, onCalificar, size = 20, interactivo = false }) => {
    const estrellas = [1, 2, 3, 4, 5];
    const puntuacionRedondeada = Math.round(puntuacion);

    return (
        <div className="flex items-center gap-1">
            {estrellas.map((estrella) => (
                <button
                    key={estrella}
                    type="button"
                    disabled={!interactivo}
                    onClick={() => interactivo && onCalificar(estrella)}
                    className={`focus:outline-none transition-transform ${interactivo ? 'hover:scale-110 cursor-pointer' : 'cursor-default'}`}
                >
                    <Star
                        size={size}
                        className={`${estrella <= puntuacionRedondeada
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                    />
                </button>
            ))}
            {!interactivo && puntuacion > 0 && (
                <span className="ml-1 text-sm font-medium text-gray-700">
                    {Number(puntuacion).toFixed(1)}
                </span>
            )}
        </div>
    );
};

export default Estrellas;
