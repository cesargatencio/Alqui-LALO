import React from "react";
import "./FilterBar.css";

export default function FilterBar({ filtros, onChange }) {
  return (
    <div className="filter-bar">
      <label>
        Capacidad mínima:
        <input
          type="number"
          name="capacidad"
          value={filtros.capacidad}
          onChange={onChange}
          placeholder="Ej. 10"
        />
      </label>

      <label>
        Tipo:
        <select name="tipo" value={filtros.tipo} onChange={onChange}>
          <option value="">— Todos —</option>
          <option value="aula">Aula</option>
          <option value="oficina">Oficina</option>
          <option value="salon">Salón</option>
          {/* añade más tipos según tu modelo */}
        </select>
      </label>

      <label>
        Ubicación:
        <input
          type="text"
          name="ubicacion"
          value={filtros.ubicacion}
          onChange={onChange}
          placeholder="Ciudad o dirección"
        />
      </label>

      <label>
        Desde:
        <input
          type="datetime-local"
          name="desde"
          value={filtros.desde}
          onChange={onChange}
        />
      </label>

      <label>
        Hasta:
        <input
          type="datetime-local"
          name="hasta"
          value={filtros.hasta}
          onChange={onChange}
        />
      </label>
    </div>
);
}
