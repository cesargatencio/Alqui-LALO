import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage      from "./pages/LandingPage";
import LoginPage        from "./pages/LoginPage";
import ModificarUsuario from "./pages/ModificarUsuario";
import ReservasPage     from "./pages/ReservasPage";
import CatalogoPage     from "./pages/CatalogoPage";
import ReservarEspacio  from "./pages/ReservarEspacio";

import ProtectedRoute   from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Catálogo no requiere login */}
        <Route path="/catalogo" element={<CatalogoPage />} />

        {/* Reservar puede requerir usuario autenticado */}
        <Route
          path="/reservar"
          element={
            <ProtectedRoute>
              <ReservarEspacio />
            </ProtectedRoute>
          }
        />

        {/* Rutas Protegidas */}
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
    </BrowserRouter>
  );
}
