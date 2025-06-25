import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

import "./styles/index.css";
import "./styles/App.css";

// Componentes comunes
import Header from "./components/Header/Header";

// Páginas
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Secciones de Landing
import LandingCTA from "./components/LandingCTA/LandingCTA";
import Features from "./components/Features/Features";
import Testimonials from "./components/Testimonials/Testimonials";
import FAQAndCTA from "./components/FAQAndCTA/FAQAndCTA";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Subcomponente para mostrar toda la landing
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
