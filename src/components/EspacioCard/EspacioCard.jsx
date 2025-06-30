import React from "react";

const EspacioCard = ({ espacio }) => (
  <div className="espacio-card">
    <img src={espacio.imagen} alt={espacio.nombre} />
    <h3>{espacio.nombre}</h3>
    <p>{espacio.descripcion}</p>
    <p><strong>Capacidad:</strong> {espacio.capacidad}</p>
    <p><strong>Precio:</strong> {espacio.precio}</p>
    <Link to={`/espacios/${espacio.id}`}>
      <button>Ver Detalles</button>
    </Link>
  </div>
);

export default EspacioCard;
