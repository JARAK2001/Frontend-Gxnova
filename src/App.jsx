import React from "react";
import LandingPage from "./features/landing/LandingPage";
import Home from "./features/landing/Home";
import Auth from "./features/auth/Auth";
import Servicios from "./features/jobs/Servicios";
import Trabajadores from "./features/jobs/Trabajadores";
import Detalles from "./features/jobs/Detalles";
import Perfil from "./features/profile/Perfil";
import PerfilPublico from "./features/profile/PerfilPublico";
import CrearTrabajo from "./features/jobs/CrearTrabajo";
import Notificaciones from "./features/dashboard/Notificaciones";
import EmpleadorDashboard from "./features/dashboard/EmpleadorDashboard";
import AdminLayout from "./features/dashboard/AdminLayout";
import AdminDashboard from "./features/dashboard/AdminDashboard";
import AdminUsuarios from "./features/dashboard/AdminUsuarios";
import AdminTrabajos from "./features/dashboard/AdminTrabajos";
import AdminCategorias from "./features/dashboard/AdminCategorias";
import AdminReportes from "./features/dashboard/AdminReportes";
import AdminAnalytics from "./features/dashboard/AdminAnalytics";
import AdminRoles from "./features/dashboard/AdminRoles";
import AdminVerificacion from "./features/dashboard/AdminVerificacion";
import AdminHabilidades from "./features/dashboard/AdminHabilidades";
import AdminRoute from "./features/dashboard/AdminRoute";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import PricingPage from "./pages/PricingPage";

import TerminosCondiciones from "./ui/TerminosCondiciones";
import PoliticaPrivacidad from "./ui/PoliticaPrivacidad";

import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <ChatProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/servicios" element={<Servicios />} />
              <Route path="/trabajadores" element={<Trabajadores />} />
              <Route path="/detalles/:id" element={<Detalles />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/trabajador/:id" element={<PerfilPublico />} />
              <Route path="/crear-trabajo" element={<CrearTrabajo />} />
              <Route path="/notificaciones" element={<Notificaciones />} />
              <Route path="/dashboard" element={<EmpleadorDashboard />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
              <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />

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
                  <Route path="habilidades" element={<AdminHabilidades />} />
                </Route>
              </Route>
            </Routes>
          </Router>
        </ChatProvider>
      </AuthProvider>
    </div>
  );
}

export default App;