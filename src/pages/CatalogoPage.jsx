import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";

import AuthService from "../services/AuthSingleton";
import FilterBar from "../components/FilterBar/FilterBar";
import EspacioCard from "../components/EspacioCard/EspacioCard";
import {
  buscarEspacios,
  espaciosDisponibles,
} from "../services/EspacioService";

import "./CatalogoPage.css";

export default function CatalogoPage() {
  const [searchParams] = useSearchParams();

  // Leer filtros de la URL
  const fechaInicio = searchParams.get("fechaInicio") || "";
  const fechaFin = searchParams.get("fechaFin") || "";
  const duracion = searchParams.get("duracion") || "";
  const capacidad = searchParams.get("capacidad") || "";

  // Construir estado de filtros
  const initialFiltros = { fechaInicio, fechaFin, duracion, capacidad };
  const [filtros, setFiltros] = useState(initialFiltros);

  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Actualiza filtros si cambian los params
  useEffect(() => {
    setFiltros({ fechaInicio, fechaFin, duracion, capacidad });
  }, [fechaInicio, fechaFin, duracion, capacidad]);

  // Dispara la consulta en Firestore cuando filtros cambian
  useEffect(() => {
    setLoading(true);
    const fn =
      filtros.fechaInicio && filtros.fechaFin
        ? espaciosDisponibles
        : buscarEspacios;

    fn(filtros)
      .then((data) => setEspacios(data))
      .catch((err) => {
        console.error("Error fetching espacios:", err);
        setEspacios([]);
      })
      .finally(() => setLoading(false));
  }, [filtros]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const user = AuthService.getInstance().getCurrentUser();
  const isAdmin = AuthService.isAdmin(user);

  return (
    <div className="catalogo-container">
      {isAdmin && (
        <Link to="/agregar-espacio" className="btn-agregar-espacio">
          Agregar Espacio
        </Link>
      )}
      <h1>Catálogo de Espacios</h1>

      {/* Filtros dinámicos */}
      <FilterBar
        filtros={filtros}
        onChange={handleChange}
        onSearch={() => {
          /* opcional: navegar con nuevos filtros */
        }}
      />

      {loading ? (
        <p className="loading">Cargando espacios…</p>
      ) : (
        <>
          {espacios.length > 0 ? (
            <div className="catalogo-grid">
              {espacios.map((e) => (
                <EspacioCard key={e.id} espacio={e} />
              ))}
            </div>
          ) : (
            <p className="no-results">No se encontraron espacios.</p>
          )}
        </>
      )}
    </div>
  );
}
