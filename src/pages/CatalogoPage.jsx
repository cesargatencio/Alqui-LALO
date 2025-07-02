// src/pages/CatalogoPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AuthService from "../services/AuthSingleton";
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

  // Mantener scroll arriba al cargar
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Cada vez que cambien los filtros, recargar datos
  useEffect(() => {
    setLoading(true);
    const fn = filtros.desde && filtros.hasta
      ? espaciosDisponibles
      : buscarEspacios;

    fn(filtros)
      .then(data => setEspacios(data))
      .catch(err => {
        console.error("Error fetching espacios:", err);
        setEspacios([]);
      })
      .finally(() => setLoading(false));
  }, [filtros]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFiltros(prev => ({ ...prev, [name]: value }));
  };

  const user = AuthService.getInstance().getCurrentUser();
  const isAdmin = AuthService.isAdmin(user);

  return (
    <div className="catalogo-container">
      {/* Botón solo para admin */}
      {isAdmin && (
        <Link to="/agregar-espacio" className="btn-agregar-espacio">
          Agregar Espacio
        </Link>
      )}

      <h1>Catálogo de Espacios</h1>

      {/* Barra de filtros dinámica */}
      <FilterBar filtros={filtros} onChange={handleChange} />

      {/* Resultados */}
      {loading ? (
        <p>Cargando espacios…</p>
      ) : (
        <div className="catalogo-grid">
          {espacios.length > 0 ? (
            espacios.map(e => (
              <EspacioCard key={e.id} espacio={e} />
            ))
          ) : (
            <p>No se encontraron espacios.</p>
          )}
        </div>
      )}
    </div>
  );
}
