import React from "react";
import Home from "./components/Home";
import Auth from "./components/Auth";
import Servicios from "./components/Servicios";
import Detalles from "./components/Detalles";
import Perfil from "./components/Perfil";
import CrearTrabajo from "./components/CrearTrabajo";
import Notificaciones from "./components/Notificaciones";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminUsuarios from "./components/admin/AdminUsuarios";
import AdminTrabajos from "./components/admin/AdminTrabajos";
import AdminCategorias from "./components/admin/AdminCategorias";
import AdminReportes from "./components/admin/AdminReportes";
import AdminAnalytics from "./components/admin/AdminAnalytics";
import AdminRoles from "./components/admin/AdminRoles";
import AdminVerificacion from "./components/admin/AdminVerificacion";
import AdminRoute from "./components/admin/AdminRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LandingPage from "./components/LandingPage";

import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/servicios" element={<Servicios />} />
            <Route path="/detalles/:id" element={<Detalles />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/crear-trabajo" element={<CrearTrabajo />} />
            <Route path="/notificaciones" element={<Notificaciones />} />

            {/* Admin Routes Protected */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="usuarios" element={<AdminUsuarios />} />
                <Route path="verificaciones" element={<AdminVerificacion />} />
                <Route path="trabajos" element={<AdminTrabajos />} />
                <Route path="categorias" element={<AdminCategorias />} />
                <Route path="reportes" element={<AdminReportes />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="roles" element={<AdminRoles />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;