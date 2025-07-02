import React, { useState, useEffect } from "react";
import FilterBar from "../components/FilterBar/FilterBar";
import EspacioCard from "../components/EspacioCard/EspacioCard";
import { buscarEspacios, espaciosDisponibles } from "../services/EspacioService";
import "./CatalogoPage.css";

export default function CatalogoPage() {
  const [filtros, setFiltros] = useState({
    capacidad: "",
    tipo: "",
    ubicacion: "",
    desde: "",
    hasta: ""
  });
  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Si hay fechas definidas, usamos disponibilidad
    const fn = filtros.desde && filtros.hasta ? espaciosDisponibles : buscarEspacios;
    fn(filtros)
      .then(data => setEspacios(data))
      .finally(() => setLoading(false));
  }, [filtros]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Espacios</h1>

      <FilterBar filtros={filtros} onChange={handleChange} />

      {loading ? (
        <p>Cargando espacios…</p>
      ) : (
        <div className="catalogo-grid">
          {espacios.length > 0 ? (
            espacios.map(e => <EspacioCard key={e.id} espacio={e} />)
          ) : (
            <p>No se encontraron espacios.</p>
          )}
        </div>
      )}
    </div>
  );
}
