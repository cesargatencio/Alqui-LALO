import React from "react";
import { Link } from "react-router-dom";
import "./LandingCTA.css";

const LandingCTA = () => {
  return (
    <section className="landing-cta" data-aos="fade-up">
      <h2>Encuentra el espacio perfecto en minutos</h2>
      <p>
        Alquila salones, estudios o áreas para cualquier ocasión de forma
        rápida, segura y sin complicaciones.
      </p>
      <Link to="/catalogo" className="cta-button">Explorar espacios</Link>
    </section>
  );
};

export default LandingCTA;
