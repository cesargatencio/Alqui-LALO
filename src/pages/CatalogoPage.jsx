import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import AuthService from "../services/AuthSingleton";
import FilterBar from "../components/FilterBar/FilterBar";
import EspacioCard from "../components/EspacioCard/EspacioCard";
import {buscarEspacios} from "../services/EspacioService";
import "./CatalogoPage.css";

export default function CatalogoPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Estado de los inputs
  const [formFiltros, setFormFiltros] = useState({
      categoria:    searchParams.get("categoria") || "",
    capacidadMin: searchParams.get("capacidadMin") || "",
    capacidadMax: searchParams.get("capacidadMax") || "",
    precioMax: searchParams.get("precioMax") || "",
  });

  // Mantén sincronizados los inputs con la URL al navegar o llegar desde landing
  useEffect(() => {
    setFormFiltros({
      
       categoria:    searchParams.get("categoria") || "",
      capacidadMin: searchParams.get("capacidadMin") || "",
      capacidadMax: searchParams.get("capacidadMax") || "",
      precioMax: searchParams.get("precioMax") || "",
    });
  }, [searchParams]);

  // Estado de los filtros aplicados (solo cambia al hacer submit)
  const [filtros, setFiltros] = useState({
    categoria:    searchParams.get("categoria") || "",
    capacidadMin: searchParams.get("capacidadMin") || "",
    capacidadMax: searchParams.get("capacidadMax") || "",
    precioMax: searchParams.get("precioMax") || "",
  });

  const [espacios, setEspacios] = useState([]);
  const [loading, setLoading] = useState(false);

  // Consulta los espacios cuando los filtros aplicados cambian
  useEffect(() => {
  setLoading(true);

 buscarEspacios(filtros)
    .then((data) => setEspacios(data))
    .catch((err) => {
      console.error("Error fetching espacios:", err);
      setEspacios([]);
    })
    .finally(() => setLoading(false));
}, [filtros]);

  // Maneja cambios en los inputs del filtro
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormFiltros((prev) => ({ ...prev, [name]: value }));
  };

  // Aplica el filtro solo al hacer submit (botón Buscar)
  const handleBuscar = (e) => {
    e.preventDefault();
    setFiltros(formFiltros);

    // Actualiza la URL
    const params = new URLSearchParams();
    
    if (formFiltros.categoria)  params.set("categoria", formFiltros.categoria);
    if (formFiltros.capacidadMin)
      params.set("capacidadMin", formFiltros.capacidadMin);
    if (formFiltros.capacidadMax)
      params.set("capacidadMax", formFiltros.capacidadMax);
    if (formFiltros.precioMax) params.set("precioMax", formFiltros.precioMax);
    setSearchParams(params);
  };

  const user = AuthService.getInstance().getCurrentUser();
  const isAdmin = AuthService.isAdmin(user);

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Espacios</h1>
      <FilterBar
        filtros={formFiltros}
        onChange={handleChange}
        onSearch={handleBuscar}
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
      {isAdmin && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Link to="/agregar-espacio" className="btn-agregar-espacio">
            Agregar Espacio
          </Link>
        </div>
      )}
    </div>
  );
}


