import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, loading, isAdmin } = useAuth();

    if (loading) {
        return <div>Cargando...</div>; // O un componente de Spinner
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    if (!isAdmin()) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
