import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, LogOut, Home, AlertTriangle, Tag, BarChart2, Shield, Settings } from 'lucide-react';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const menuItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/usuarios', icon: <Users size={20} />, label: 'Usuarios' },
        { path: '/admin/trabajos', icon: <Briefcase size={20} />, label: 'Trabajos' },
        { path: '/admin/categorias', icon: <Tag size={20} />, label: 'Categorías' },
        { path: '/admin/reportes', icon: <AlertTriangle size={20} />, label: 'Reportes' },
        { path: '/admin/analytics', icon: <BarChart2 size={20} />, label: 'Analíticas' },
        { path: '/admin/roles', icon: <Shield size={20} />, label: 'Roles' },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`bg-slate-900 text-white w-64 flex-shrink-0 transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} fixed md:relative md:translate-x-0 z-30 h-full flex flex-col`}>
                <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-red-400">
                        Admin GXNova
                    </h1>
                </div>

                {/* Scrollable Navigation Area */}
                <div className="flex-1 overflow-y-auto py-6 custom-scrollbar">
                    <nav className="px-4 space-y-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                                    ? 'bg-orange-600 text-white'
                                    : 'text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Footer Actions (Fixed at bottom) */}
                <div className="p-4 border-t border-slate-700 bg-slate-900">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-800 rounded-lg w-full mb-2"
                    >
                        <Home size={20} />
                        <span>Volver al Inicio</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-lg w-full"
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-white shadow-sm h-16 flex items-center px-6 justify-between md:justify-end">
                    <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">Administrador</span>
                        <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-700 font-bold">
                            A
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
