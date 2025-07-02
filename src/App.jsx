import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import ProtectedRoute from "./components/ProtectedRoute";

import "./styles/index.css";
import "./styles/App.css";

// Componentes comunes
import Header from "./components/Header/Header";

// Páginas
import NotFoundPage from "./pages/NotFoundPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CatalogoPage from "./pages/CatalogoPage";
import ModificarUsuario from "./pages/ModificarUsuario";
import ReservasPage from "./pages/ReservasPage";
import EspacioDetalle from "./pages/EspacioDetalle";
import ConfirmarReserva from "./pages/ConfirmarReserva"; // ✅
import ReportsPage from "./pages/ReportsPage"; // Agrega esta línea

import LandingCTA from "./components/LandingCTA/LandingCTA";
import Features from "./components/Features/Features";
import Testimonials from "./components/Testimonials/Testimonials";
import FAQAndCTA from "./components/FAQAndCTA/FAQAndCTA";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const FullLanding = () => (
    <>
      <LandingPage />
      <LandingCTA />
      <Features />
      <Testimonials />
      <FAQAndCTA />
    </>
  );

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<FullLanding />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/espacios/:id" element={<EspacioDetalle />} />
          <Route path="/confirmar-reserva" element={<ConfirmarReserva />} /> {/* ✅ PayPal */}
          <Route path="*" element={<NotFoundPage />} />

          {/* Rutas protegidas */}
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
          <Route
            path="/reportes"
            element={
              <ProtectedRoute adminOnly>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;

