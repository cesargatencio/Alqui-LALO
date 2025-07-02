import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./ReportsPage.css";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const TIME_RANGES = [
  { label: "Semana", value: 7 },
  { label: "Últimos 15 días", value: 15 },
  { label: "Mes", value: 30 },
  { label: "5 meses", value: 150 },
  { label: "1 año", value: 365 },
];

const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState("alquileres");
  const [selectedRange, setSelectedRange] = useState(7);
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(false);

  // Cargar reservas desde Firebase
  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      try {
        const reservasRef = collection(db, "reservas");
        const snapshot = await getDocs(reservasRef);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReservas(data);
      } catch (error) {
        console.error("Error al obtener reservas:", error);
      }
      setLoading(false);
    };
    fetchReservas();
  }, []);

  // Filtrar reservas por rango de tiempo y estado
  const getFilteredReservas = (estado = null) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - selectedRange);

    return reservas.filter((reserva) => {
      const fecha = reserva.fechaReserva
        ? reserva.fechaReserva.toDate
          ? reserva.fechaReserva.toDate()
          : new Date(reserva.fechaReserva)
        : null;
      if (!fecha) return false;
      const inRange = fecha >= fromDate && fecha <= now;
      const matchesEstado = estado ? reserva.estado === estado : true;
      return inRange && matchesEstado;
    });
  };

  // Agrupar reservas por fecha para las gráficas
  const groupByDate = (data) => {
    const counts = {};
    data.forEach((r) => {
      const fecha = r.fechaReserva
        ? r.fechaReserva.toDate
          ? r.fechaReserva.toDate()
          : new Date(r.fechaReserva)
        : null;
      if (!fecha) return;
      const key = fecha.toLocaleDateString();
      counts[key] = (counts[key] || 0) + 1;
    });
    // Ordenar fechas
    return Object.keys(counts)
      .sort((a, b) => new Date(a) - new Date(b))
      .reduce((obj, key) => {
        obj[key] = counts[key];
        return obj;
      }, {});
  };

  // Ranking de salones
  const getRankingSalones = () => {
    const counts = {};
    reservas.forEach((reserva) => {
      if (reserva.estado === "cancelada") return;
      const nombre = reserva.nombreEspacio || reserva.espacio || "Desconocido";
      counts[nombre] = (counts[nombre] || 0) + 1;
    });
    // Ordenar de mayor a menor
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([nombre, cantidad]) => ({ nombre, cantidad }));
  };


  
  // Gráfica de solicitudes de alquiler
  const renderAlquileresChart = () => {
    const filtered = getFilteredReservas();
    const grouped = groupByDate(filtered);
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    return (
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Solicitudes de alquiler",
              data,
              backgroundColor: "#2563eb",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
        }}
      />
    );
  };

  // Gráfica de canceladas
  const renderCanceladasChart = () => {
    const filtered = getFilteredReservas("cancelada");
    const grouped = groupByDate(filtered);
    const labels = Object.keys(grouped);
    const data = Object.values(grouped);

    return (
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Solicitudes canceladas",
              data,
              backgroundColor: "#f59e42",
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: { legend: { display: false } },
          maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
        }}
      />
    );
  };

  // Gráfica de ranking de salones
  const renderRankingChart = () => {
    const ranking = getRankingSalones();
    const labels = ranking.map((r) => r.nombre);
    const data = ranking.map((r) => r.cantidad);

    return (
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Solicitudes por salón",
              data,
              backgroundColor: "#2563eb",
            },
          ],
        }}
        options={{
          indexAxis: "y",
          responsive: true,
          plugins: { legend: { display: false } },
          maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0
        }
      }
    }
        }}
      />
    );
  };

  


 

  // Renderizado de cada reporte
  const renderReportContent = () => {
    if (loading) return <div className="loader">Cargando...</div>;

    if (selectedReport === "alquileres") {
      const filtered = getFilteredReservas();
      return (
        <div>
          <h3>Solicitudes de alquiler ({filtered.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Espacio</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.nombreEspacio || r.espacio}</td>
                  <td>{r.nombreUsuario || r.usuario}</td>
                  <td>
                    {r.fechaReserva
                      ? r.fechaReserva.toDate
                        ? r.fechaReserva.toDate().toLocaleDateString()
                        : new Date(r.fechaReserva).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{r.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedReport === "canceladas") {
      const filtered = getFilteredReservas("cancelada");
      return (
        <div>
          <h3>Solicitudes canceladas ({filtered.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Espacio</th>
                <th>Usuario</th>
                <th>Fecha</th>
                <th>Motivo</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>{r.nombreEspacio || r.espacio}</td>
                  <td>{r.nombreUsuario || r.usuario}</td>
                  <td>
                    {r.fechaReserva
                      ? r.fechaReserva.toDate
                        ? r.fechaReserva.toDate().toLocaleDateString()
                        : new Date(r.fechaReserva).toLocaleDateString()
                      : ""}
                  </td>
                  <td>{r.motivoCancelacion || "No especificado"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (selectedReport === "ranking") {
      const ranking = getRankingSalones();
      return (
        <div>
          <h3>Ranking de salones más solicitados</h3>
          <table>
            <thead>
              <tr>
                <th>Salón</th>
                <th>Solicitudes</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((item, idx) => (
                <tr key={item.nombre}>
                  <td>
                    {idx + 1}. {item.nombre}
                  </td>
                  <td>{item.cantidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    return null;
  };

  // Renderizado principal
  return (
    <div className="reports-bg">
      <div className="reports-card">
        {/* Lado izquierdo: menú y filtros */}
        <div className="reports-left">
          <h2>Reportes Administrativos</h2>
          <p>
            Esta sección es exclusiva para administradores. Aquí podrás generar y visualizar reportes sobre reservas, cancelaciones y uso de espacios.
          </p>
          <div className="reports-list">
            <button
              className={selectedReport === "alquileres" ? "active" : ""}
              onClick={() => setSelectedReport("alquileres")}
            >
              <span role="img" aria-label="alquiler">
                📅
              </span>{" "}
              Reporte de solicitudes de alquiler
            </button>
            <button
              className={selectedReport === "canceladas" ? "active" : ""}
              onClick={() => setSelectedReport("canceladas")}
            >
              <span role="img" aria-label="canceladas">
                ❌
              </span>{" "}
              Reporte de solicitudes canceladas
            </button>
            <button
              className={selectedReport === "ranking" ? "active" : ""}
              onClick={() => setSelectedReport("ranking")}
            >
              <span role="img" aria-label="ranking">
                🏆
              </span>{" "}
              Ranking de salones más solicitados
            </button>
          </div>
          {(selectedReport === "alquileres" || selectedReport === "canceladas") && (
            <div className="reports-filters">
              <label>Filtrar por rango de tiempo:</label>
              <select
                value={selectedRange}
                onChange={(e) => setSelectedRange(Number(e.target.value))}
              >
                {TIME_RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {/* Lado derecho: tabla y gráfica */}
        <div className="reports-right">
          <div className="reports-table-graph">
            <div className="reports-table">
              {renderReportContent()}
            </div>
            <div className="reports-graph">
              {selectedReport === "alquileres" && renderAlquileresChart()}
              {selectedReport === "canceladas" && renderCanceladasChart()}
              {selectedReport === "ranking" && renderRankingChart()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;