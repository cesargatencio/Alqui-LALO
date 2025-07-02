import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage      from "./pages/LandingPage";
import LoginPage        from "./pages/LoginPage";
import CatalogoPage     from "./pages/CatalogoPage";
import ReservarEspacio  from "./pages/ReservarEspacio";
import ModificarUsuario from "./pages/ModificarUsuario";
import ReservasPage     from "./pages/ReservasPage";

import ProtectedRoute   from "./components/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/"      element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/catalogo" element={<CatalogoPage />} />

        {/* Reservar (requiere login) */}
        <Route
          path="/reservar"
          element={
            <ProtectedRoute>
              <ReservarEspacio />
            </ProtectedRoute>
          }
        />

        {/* Protegidas */}
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

