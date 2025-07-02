import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPage.css";

const LandingPage = () => {
  const [fecha, setFecha] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const navigate = useNavigate();

  // Scroll suave a sección Contacto si aplica
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollToContact") === "true") {
      const section = document.getElementById("contact-section");
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  const handleBuscar = e => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fecha)     params.set("fecha", fecha);
    if (desde)     params.set("desde", desde);
    if (hasta)     params.set("hasta", hasta);
    if (capacidad) params.set("capacidad", capacidad);
    navigate(`/catalogo?${params.toString()}`);
  };

  return (
    <section className="fold">
      {/* Carousel de fondo */}
      <div className="background-carousel">
        <Slider
          autoplay
          autoplaySpeed={4000}
          speed={700}
          infinite
          arrows
          dots
          pauseOnHover={false}
        >
          <div><img src="/img/img3.jpg" alt="Slide 1" /></div>
          <div><img src="/img/img2.jpg" alt="Slide 2" /></div>
          <div><img src="/img/img4.jpg" alt="Slide 3" /></div>
          <div><img src="/img/img5.jpg" alt="Slide 4" /></div>
          <div><img src="/img/img6.jpg" alt="Slide 5" /></div>
        </Slider>
      </div>

      {/* Encabezado */}
      <h1>Organiza. Selecciona. Alquilalo.</h1>
      <p className="bold-text">
        Gestiona espacios para eventos, clases o reuniones desde cualquier dispositivo con AlquiLALO.
      </p>

      {/* Formulario de búsqueda */}
      <form className="search-bar" onSubmit={handleBuscar}>
        <input
          type="date"
          value={fecha}
          onChange={e => setFecha(e.target.value)}
          required
        />
        <input
          type="time"
          value={desde}
          onChange={e => setDesde(e.target.value)}
          required
        />
        <input
          type="time"
          value={hasta}
          onChange={e => setHasta(e.target.value)}
          required
        />
        <select
          value={capacidad}
          onChange={e => setCapacidad(e.target.value)}
          required
        >
          <option disabled value="">Visitantes</option>
          <option value="50">0 - 50</option>
          <option value="100">51 - 100</option>
          <option value="200">101 - 200</option>
          <option value="300">201 - 300</option>
          <option value="500">301 - 500</option>
        </select>
        <button className="cta-button" type="submit">
          Buscar
        </button>
      </form>
    </section>
  );
};

export default LandingPage;
