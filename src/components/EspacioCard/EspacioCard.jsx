import React from "react";
import { Link } from "react-router-dom";

const EspacioCard = ({ espacio }) => (
  <div className="espacio-card">
    <img
      src={espacio.imagen}
      alt={espacio.nombre}
      style={{
        width: "180px",
        height: "180px",
        objectFit: "cover",
        borderRadius: "1rem",
        margin: "0 auto",
        display: "block"
      }}
    />
    <h3>{espacio.nombre}</h3>
    <p>{espacio.descripcion}</p>
    <p><strong>Capacidad:</strong> {espacio.capacidad}</p>
    <p><strong>Precio:</strong> {espacio.precio} $/H</p>
    <Link to={`/espacios/${espacio.id}`} className="btn-ver-detalles">
      <button className="btn-ver-detalles">Ver Detalles</button>
    </Link>
  </div>
);

export default EspacioCard;
