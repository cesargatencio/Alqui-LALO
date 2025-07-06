import React from "react";

/**
 * Barra de filtros reutilizable para el catálogo de espacios.
 * Permite buscar solo al presionar el botón.
 * Props:
 *   - filtros: objeto con valores actuales de los filtros.
 *   - onChange: función para actualizar los filtros.
 *   - onSearch: función que realiza la búsqueda al submit.
 */
const FilterBar = ({ filtros = {}, onChange, onSearch }) => {
  return (
    <form className="search-bar" onSubmit={onSearch}>
      <div className="search-fields">
        <label>
          Categoría
          <select
            name="categoria"
            value={filtros.categoria || ""}
            onChange={onChange}
            
          >

   
            <option value="" disabled>— Selecciona categoría —</option>
            <option value="Salon">Salón</option>
            <option value="Auditorio">Auditorio</option>
            <option value="Laboratorio">Laboratorio</option>
            <option value="Aire Libre">Aire Libre</option>
          </select>
        </label>
        <label>
          Capacidad mínima
          <input
            type="number"
            name="capacidadMin"
            value={filtros.capacidadMin || ""}
            min="1"
            onChange={onChange}
            placeholder="Ej. 10"
          />
        </label>
        <label>
          Capacidad máxima
          <input
            type="number"
            name="capacidadMax"
            value={filtros.capacidadMax || ""}
            min="1"
            onChange={onChange}
            placeholder="Ej. 100"
          />
        </label>
        <label>
          Precio por hora (máx USD)
          <input
            type="number"
            name="precioMax"
            value={filtros.precioMax || ""}
            min="1"
            onChange={onChange}
            placeholder="Ej. 18"
          />
        </label>
      </div>
      <button className="cta-button" type="submit">
        Buscar
      </button>
    </form>
  );
};

export default FilterBar;
