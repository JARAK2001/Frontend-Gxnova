import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Users, Briefcase, LogOut, Home, AlertTriangle, Tag, BarChart2, Shield, Settings, Menu, X, FileCheck } from 'lucide-react';
import logoGxnova from '../../assets/gxnova-logo.png';

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { logout, user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/auth');
    };

    const menuItems = [
        { path: '/admin', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
        { path: '/admin/usuarios', icon: <Users size={18} />, label: 'Usuarios' },
        { path: '/admin/trabajos', icon: <Briefcase size={18} />, label: 'Trabajos' },
        { path: '/admin/categorias', icon: <Tag size={18} />, label: 'Categorías' },
        { path: '/admin/reportes', icon: <AlertTriangle size={18} />, label: 'Reportes' },
        { path: '/admin/analytics', icon: <BarChart2 size={18} />, label: 'Analíticas' },
        { path: '/admin/roles', icon: <Shield size={18} />, label: 'Roles' },
        { path: '/admin/habilidades', icon: <FileCheck size={18} />, label: 'Habilidades' },
    ];

    const isActive = (path) =>
        path === '/admin'
            ? location.pathname === '/admin'
            : location.pathname.startsWith(path);

    const initials = user?.nombre
        ? user.nombre.charAt(0).toUpperCase()
        : 'A';

    return (
        <div className="flex h-screen" style={{ background: 'var(--admin-bg)' }}>

            {/* ── Overlay móvil ── */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* ── Sidebar ── */}
            <aside
                className={`
                    fixed md:relative z-30 h-full flex flex-col
                    transition-transform duration-300
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                `}
                style={{
                    width: 256,
                    background: 'var(--admin-sidebar)',
                    borderRight: '1px solid rgba(249,115,22,0.12)',
                    boxShadow: '4px 0 24px -4px rgba(0,0,0,0.35)',
                }}
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-3 px-5 py-5"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <img src={logoGxnova} alt="GXNOVA" className="h-8 w-auto object-contain" />
                    <div>
                        <span
                            className="text-lg font-black tracking-tight"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #fbbf24)',
                                WebkitBackgroundClip: 'text',
                                color: 'transparent',
                            }}
                        >
                            GXNOVA
                        </span>
                        <span
                            className="block text-[10px] font-semibold uppercase tracking-widest"
                            style={{ color: 'rgba(249,115,22,0.55)' }}
                        >
                            Admin Panel
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 custom-scrollbar space-y-0.5">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                            style={
                                isActive(item.path)
                                    ? {
                                        background: 'linear-gradient(135deg, rgba(249,115,22,0.20), rgba(234,88,12,0.12))',
                                        color: '#fb923c',
                                        borderLeft: '3px solid #f97316',
                                        paddingLeft: '10px',
                                    }
                                    : {
                                        color: 'rgba(203,213,225,0.8)',
                                        borderLeft: '3px solid transparent',
                                        paddingLeft: '10px',
                                    }
                            }
                        >
                            <span
                                className="flex-shrink-0"
                                style={isActive(item.path) ? { color: '#f97316' } : {}}
                            >
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div
                    className="p-3 space-y-1"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all duration-200"
                        style={{ color: 'rgba(203,213,225,0.7)' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <Home size={18} />
                        <span>Volver al Inicio</span>
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium transition-all duration-200"
                        style={{ color: '#fca5a5' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.10)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* ── Main content ── */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">

                {/* Top bar */}
                <header
                    className="flex items-center justify-between px-5 h-14 flex-shrink-0"
                    style={{
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(14px)',
                        WebkitBackdropFilter: 'blur(14px)',
                        borderBottom: '1px solid rgba(249, 115, 22, 0.10)',
                        boxShadow: '0 2px 12px -2px rgba(0,0,0,0.06)',
                    }}
                >
                    {/* Hamburger */}
                    <button
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Abrir menú"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Breadcrumb page title */}
                    <span className="hidden md:block text-sm font-semibold text-slate-500 tracking-wide">
                        Panel de Administración
                    </span>

                    {/* Admin badge */}
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-semibold text-gray-800 leading-none">
                                {user?.nombre || 'Administrador'}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">Admin</p>
                        </div>
                        <div
                            className="h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                                color: '#fff',
                                boxShadow: '0 4px 12px -2px rgba(249,115,22,0.45)',
                            }}
                        >
                            {initials}
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main
                    className="flex-1 overflow-x-hidden overflow-y-auto p-5 md:p-6"
                    style={{ background: 'var(--admin-bg)' }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
