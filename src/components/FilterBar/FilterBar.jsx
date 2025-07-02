import React from "react";
import "./FilterBar.css";

export default function FilterBar({ filtros, onChange }) {
  return (
    <div className="filter-bar">
      <label>
        Fecha:
        <input
          type="date"
          name="fecha"
          value={filtros.fecha}
          onChange={onChange}
        />
      </label>

      <label>
        Hora inicio:
        <input
          type="time"
          name="desde"
          value={filtros.desde}
          onChange={onChange}
        />
      </label>

      <label>
        Hora fin:
        <input
          type="time"
          name="hasta"
          value={filtros.hasta}
          onChange={onChange}
        />
      </label>

      <label>
        Capacidad máxima:
        <input
          type="number"
          name="capacidad"
          value={filtros.capacidad}
          onChange={onChange}
          placeholder="Ej. 50"
        />
      </label>
    </div>
  );
}
