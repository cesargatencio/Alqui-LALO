import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPage.css";

const LandingPage = () => {
  const [formFiltros, setFormFiltros] = useState({
    fecha: "",
    capacidadMin: "",
    capacidadMax: "",
    precioMax: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollToContact") === "true") {
      const section = document.getElementById("contact-section");
      section?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleBuscar = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (formFiltros.fecha) params.set("fecha", formFiltros.fecha);
    if (formFiltros.capacidadMin)
      params.set("capacidadMin", formFiltros.capacidadMin);
    if (formFiltros.capacidadMax)
      params.set("capacidadMax", formFiltros.capacidadMax);
    if (formFiltros.precioMax) params.set("precioMax", formFiltros.precioMax);
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
          <div>
            <img src="/img/img3.jpg" alt="Slide 1" />
          </div>
          <div>
            <img src="/img/img2.jpg" alt="Slide 2" />
          </div>
          <div>
            <img src="/img/img4.jpg" alt="Slide 3" />
          </div>
          <div>
            <img src="/img/img5.jpg" alt="Slide 4" />
          </div>
          <div>
            <img src="/img/img6.jpg" alt="Slide 5" />
          </div>
        </Slider>
      </div>

      {/* Encabezado */}
      <h1>Organiza. Selecciona. Alquilalo.</h1>
      <p>
        Gestiona espacios para eventos, clases o reuniones desde cualquier
        dispositivo con AlquiLALO.
      </p>

      {/* Formulario de búsqueda */}
      <form className="search-bar" onSubmit={handleBuscar}>
        <div className="search-fields">
          <label>
            Fecha de reserva
            <input
              type="date"
              name="fecha"
              value={formFiltros.fecha}
              onChange={handleChange}
            />
          </label>
          <label>
            Capacidad mínima
            <input
              type="number"
              name="capacidadMin"
              value={formFiltros.capacidadMin}
              onChange={handleChange}
              min="1"
              placeholder="Ej. 10"
            />
          </label>
          <label>
            Capacidad máxima
            <input
              type="number"
              name="capacidadMax"
              value={formFiltros.capacidadMax}
              onChange={handleChange}
              min="1"
              placeholder="Ej. 100"
            />
          </label>
          <label>
            Precio por hora (máx USD)
            <input
              type="number"
              name="precioMax"
              value={formFiltros.precioMax}
              onChange={handleChange}
              min="1"
              placeholder="Ej. 18"
            />
          </label>
        </div>
        <button className="cta-button" type="submit">
          Buscar
        </button>
      </form>
    </section>
  );
};

export default LandingPage;
