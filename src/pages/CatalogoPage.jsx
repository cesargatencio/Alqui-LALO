import React from "react";
import EspacioCard from "../components/EspacioCard/EspacioCard";
import espaciosData from "../data/espacios.json";  // Importa el JSON
import "./CatalogoPage.css";


const CatalogoPage = () => {
  const espaciosPequenos = espaciosData.filter(e => e.capacidadNum <= 30);
  const espaciosMedianos = espaciosData.filter(e => e.capacidadNum > 30 && e.capacidadNum <= 100);

  return (
    <div className="catalogo-container">
      <h1>Los mejores espacios para ti</h1>
      
      {/* Sección Salones (30-50) */}
      <h2 className="categoria-title">Salones (30-50 personas)</h2>
      <div className="catalogo-grid">
        {espaciosMedianos
          .filter(e => e.capacidadNum <= 50)
          .map((espacio) => (
            <EspacioCard key={espacio.id} espacio={espacio} />
          ))}
      </div>

      {/* Sección Auditorios (50-80) */}
      <h2 className="categoria-title">Auditorios (50-80 personas)</h2>
      <div className="catalogo-grid">
        {espaciosMedianos
          .filter(e => e.capacidadNum > 50)
          .map((espacio) => (
            <EspacioCard key={espacio.id} espacio={espacio} />
          ))}
      </div>

      {/* Sección Espacios Recreativos */}
      <h2 className="categoria-title">Espacios recreativos</h2>
      <div className="catalogo-grid">
        {espaciosPequenos.map((espacio) => (
          <EspacioCard key={espacio.id} espacio={espacio} />
        ))}
      </div>
    </div>
  );
};

export default CatalogoPage;