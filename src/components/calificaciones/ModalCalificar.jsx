import React, { useState } from 'react';
import Estrellas from '../common/Estrellas';

function ModalCalificar({ isOpen, onClose, onSubmit, usuarioReceptor }) {
    const [puntuacion, setPuntuacion] = useState(0);
    const [comentario, setComentario] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (puntuacion === 0) {
            setError('Por favor selecciona una puntuación.');
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit({ puntuacion, comentario });
            onClose();
        } catch (err) {
            console.error(err);
            setError('Error al enviar la calificación.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all">
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Calificar Servicio
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        ¿Cómo fue tu experiencia trabajando con <strong>{usuarioReceptor?.nombre} {usuarioReceptor?.apellido}</strong>?
                    </p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6 flex justify-center">
                            <Estrellas
                                puntuacion={puntuacion}
                                onCalificar={setPuntuacion}
                                size={40}
                                interactivo={true}
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
                                Comentario (Opcional)
                            </label>
                            <textarea
                                id="comentario"
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                                placeholder="Escribe aquí tu opinión..."
                                value={comentario}
                                onChange={(e) => setComentario(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="mb-4 p-2 bg-red-50 text-red-700 text-sm rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                disabled={submitting}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={submitting || puntuacion === 0}
                                className="px-4 py-2 text-sm font-medium text-white bg-orange-600 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Enviando...' : 'Enviar Calificación'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default ModalCalificar;
