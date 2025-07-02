import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./LandingPage.css";

const LandingPage = () => {
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [duracion, setDuracion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("scrollToContact") === "true") {
      const section = document.getElementById("contact-section");
      section?.scrollIntoView({ behavior: "smooth" });
      window.history.replaceState(null, "", window.location.pathname);
    }
  }, []);

  const handleBuscar = e => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (fechaInicio) params.set("fechaInicio", fechaInicio);
    if (fechaFin)    params.set("fechaFin", fechaFin);
    if (duracion)    params.set("duracion", duracion);
    if (capacidad)   params.set("capacidad", capacidad);
    navigate(`/catalogo?${params.toString()}`);
  };

  return (
    <section className="fold">
      {/* Carousel de fondo */}
      <div className="background-carousel">
        <Slider autoplay autoplaySpeed={4000} speed={700} infinite arrows dots pauseOnHover={false}>
          <div><img src="/img/img3.jpg" alt="Slide 1" /></div>
          <div><img src="/img/img2.jpg" alt="Slide 2" /></div>
          <div><img src="/img/img4.jpg" alt="Slide 3" /></div>
          <div><img src="/img/img5.jpg" alt="Slide 4" /></div>
          <div><img src="/img/img6.jpg" alt="Slide 5" /></div>
        </Slider>
      </div>

      <h1>Organiza. Selecciona. Alquilalo.</h1>
      <p className="bold-text">
        Gestiona espacios para eventos, clases o reuniones desde cualquier dispositivo con AlquiLALO.
      </p>

      <form className="search-bar" onSubmit={handleBuscar}>
        <label>
          Fecha inicio:
          <input
            type="date"
            value={fechaInicio}
            onChange={e => setFechaInicio(e.target.value)}
            required
          />
        </label>
        <label>
          Fecha fin:
          <input
            type="date"
            value={fechaFin}
            onChange={e => setFechaFin(e.target.value)}
            required
          />
        </label>
        <label>
          Duración:
          <select
            value={duracion}
            onChange={e => setDuracion(e.target.value)}
            required
          >
            <option disabled value="">Selecciona duración</option>
            <option value="60">1 hora</option>
            <option value="90">1.5 horas</option>
            <option value="120">2 horas</option>
            <option value="180">3 horas</option>
            <option value="240">4 horas</option>
            <option value="300">5 horas</option>
            <option value="360">6 horas</option>
            <option value="480">8 horas</option>
            <option value="720">12 horas</option>
            <option value="1440">1 día</option>
            <option value="2880">2 días</option>
            <option value="4320">3 días</option>
            <option value="5760">4 días</option>
            <option value="7200">5 días</option>
            <option value="8640">6 días</option>
            <option value="10080">7 días</option>
          </select>
        </label>
        <label>
          Capacidad máxima:
          <select
            value={capacidad}
            onChange={e => setCapacidad(e.target.value)}
            required
          >
            <option disabled value="">Selecciona rango</option>
            <option value="10-30">10 - 30</option>
            <option value="31-50">31 - 50</option>
            <option value="51-100">51 - 100</option>
            <option value="101-200">101 - 200</option>
            <option value="201-500">201 - 500</option>
          </select>
        </label>
        <button className="cta-button" type="submit">Buscar</button>
      </form>
    </section>
  );
};

export default LandingPage;

