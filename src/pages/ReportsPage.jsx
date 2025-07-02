import React from "react";

const ReportsPage = () => {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>Reportes Administrativos</h2>
      <p>
        Esta sección es exclusiva para administradores. Aquí podrás generar y visualizar reportes sobre reservas, cancelaciones y uso de espacios.
      </p>
      <ul>
        <li>Reporte de solicitudes de alquiler en rango de fechas</li>
        <li>Reporte de solicitudes de alquiler canceladas</li>
        <li>Ranking de espacios más solicitados</li>
      </ul>
      {/* Aquí irán los formularios y tablas de reportes */}
    </div>
  );
};

export default ReportsPage;