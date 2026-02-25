import React, { useEffect, useState } from 'react';
import { Save, RefreshCw, Settings, Smartphone, Mail, Bell, Shield, DollarSign } from 'lucide-react';
import API_URL from '../../config/api';

const AdminConfig = () => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        cargarConfig();
    }, []);

    const cargarConfig = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/config`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
            }
        } catch (error) {
            console.error("Error cargando config", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${API_URL}/api/admin/config`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            if (res.ok) {
                alert("Configuración guardada correctamente");
            } else {
                alert("Error al guardar");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-gray-500">Cargando configuración...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Configuración del Sistema</h1>
                    <p className="text-gray-500 text-sm mt-1">Ajustes globales de la plataforma</p>
                </div>
                <button
                    onClick={cargarConfig}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                    title="Recargar"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            <form onSubmit={handleGuardar} className="space-y-6">

                {/* Sección Financiera */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
                        <DollarSign size={20} className="text-green-600" />
                        <h2 className="text-lg font-semibold">Finanzas y Pagos</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comisión por Trabajo (%)</label>
                            <input
                                type="number"
                                name="comisionPorcentaje"
                                value={config.comisionPorcentaje}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-green-500 bg-gray-50"
                            />
                            <p className="text-xs text-gray-500 mt-1">Porcentaje retenido por la plataforma.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Moneda Principal</label>
                            <select
                                name="moneda"
                                value={config.moneda}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-green-500"
                            >
                                <option value="COP">Peso Colombiano (COP)</option>
                                <option value="USD">Dólar (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Sección Móvil */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
                        <Smartphone size={20} className="text-indigo-600" />
                        <h2 className="text-lg font-semibold">Aplicaciones Móviles</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link Android (Play Store)</label>
                            <input
                                type="url"
                                name="linkAndroid"
                                value={config.linkAndroid}
                                onChange={handleChange}
                                placeholder="https://play.google.com/..."
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link iOS (App Store)</label>
                            <input
                                type="url"
                                name="linkIOS"
                                value={config.linkIOS}
                                onChange={handleChange}
                                placeholder="https://apps.apple.com/..."
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Sección Comunicación */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                    <div className="flex items-center gap-2 mb-4 text-gray-800 border-b pb-2">
                        <Mail size={20} className="text-orange-600" />
                        <h2 className="text-lg font-semibold">Comunicación y Soporte</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email de Soporte</label>
                            <input
                                type="email"
                                name="emailSoporte"
                                value={config.emailSoporte}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de Bienvenida</label>
                            <textarea
                                name="mensajeBienvenida"
                                rows="3"
                                value={config.mensajeBienvenida}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="notificacionesPush"
                                name="notificacionesPush"
                                checked={config.notificacionesPush}
                                onChange={handleChange}
                                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="notificacionesPush" className="text-sm text-gray-700">Habilitar notificaciones Push globales</label>
                        </div>
                    </div>
                </div>

                {/* Sección Sistema */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-red-100 bg-red-50">
                    <div className="flex items-center gap-2 mb-4 text-red-800 border-b border-red-200 pb-2">
                        <Shield size={20} />
                        <h2 className="text-lg font-semibold">Zona de Peligro</h2>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-red-900">Modo Mantenimiento</h3>
                            <p className="text-sm text-red-700">Si se activa, solo los administradores podrán acceder a la plataforma.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                name="modoMantenimiento"
                                checked={config.modoMantenimiento}
                                onChange={handleChange}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                        </label>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className={`flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium shadow-sm transition-all
                            ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        <Save size={20} />
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default AdminConfig;
