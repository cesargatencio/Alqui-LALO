// src/Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage      from "./pages/LandingPage";
import LoginPage        from "./pages/LoginPage";
import ModificarUsuario from "./pages/ModificarUsuario";
import ReservasPage     from "./pages/ReservasPage";
import ProtectedRoute   from "./components/ProtectedRoute";
import ReservarEspacio from "./pages/ReservarEspacio";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Públicas */}
      <Route path="/"       element={<LandingPage />} />
      <Route path="/login"  element={<LoginPage />} />

      {/* Protegidas: sólo accesibles si hay auth.currentUser */}
      <Route
        path="/modificarusuario"
        element={
          <ProtectedRoute>
            <ModificarUsuario />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mis-reservas"
        element={
          <ProtectedRoute>
            <ReservasPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
// Nota: Si necesitas más rutas públicas o protegidas, simplemente añádelas aquí siguiendo el mismo patrón.
