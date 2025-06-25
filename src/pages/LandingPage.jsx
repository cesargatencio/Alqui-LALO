import React, { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";import "../pages/LandingPage.css";

const LandingPage = () => {
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [duracion, setDuracion] = useState("");
  const [capacidad, setCapacidad] = useState("");
  const [espacios, setEspacios] = useState([]);

  const handleBuscar = async () => {
    try {
      const params = new URLSearchParams({ fecha, hora, duracion, capacidad });
      const res = await fetch(`http://localhost:5000/api/espacios/filtrar?${params}`);
      const data = await res.json();
      setEspacios(data.resultados);
    } catch (error) {
      console.error("Error al buscar espacios:", error);
    }
  };

  return (
    <section className="fold">
      <div className="background-carousel">
      <Slider autoplay={true} autoplaySpeed={4000} speed={700} infinite={true} arrows={true} dots={true} pauseOnHover={false}>
        <div><img src="/img/img3.jpg" alt="IMG 1" /></div>
        <div><img src="/img/img2.jpg" alt="IMG 2" /></div>
        <div><img src="/img/img4.jpg" alt="IMG 4" /></div>
        <div><img src="/img/img5.jpg" alt="IMG 5" /></div>
        <div><img src="/img/img6.jpg" alt="IMG 6" /></div>
    </Slider>
      </div>
      <h1>Organiza. Selecciona. Alquilalo.</h1>
      <p className="bold-text">Gestiona espacios para eventos, clases o reuniones desde cualquier dispositivo con AlquiLALO.</p>

      <div className="search-bar">
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
        <input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
        <select value={duracion} onChange={(e) => setDuracion(e.target.value)}>
          <option disabled value="">Duración del evento</option>
          <option>45 minutos</option>
          <option>1 hora 30 min</option>
          <option>2 horas</option>
          <option>3 horas</option>
          <option>6 horas</option>
          <option>12 horas</option>
          <option>24 horas</option>
        </select>
        <select value={capacidad} onChange={(e) => setCapacidad(e.target.value)}>
          <option disabled value="">Visitantes</option>
          <option>0 - 50</option>
          <option>51 - 100</option>
          <option>101 - 200</option>
          <option>201 - 300</option>
          <option>301 - 500</option>
        </select>
      </div>

      <button className="cta-button" onClick={handleBuscar}>Buscar</button>

      <div className="resultados">
        {espacios.length > 0 ? (
          <div className="features-list">
            {espacios.map((espacio) => (
              <div key={espacio.id} className="feature">
                <h3>{espacio.nombre}</h3>
                <p>Capacidad: {espacio.capacidad}</p>
                <p>{espacio.disponible ? "Disponible ✅" : "No disponible ❌"}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ marginTop: "20px" }}>No hay resultados aún.</p>  //este mensaje se desactiva cuando se realiza una búsqueda filtrada (opcion mas adelante implementada)
        )}
      </div>
    </section>
  );
};

export default LandingPage;


