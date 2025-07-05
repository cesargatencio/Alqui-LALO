import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ReservaService from "../services/ReservaFacade";
import espaciosData from "../data/espacios.json"; 
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
  const [espaciosDict, setEspaciosDict] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Crear diccionario de espacios al cargar
  useEffect(() => {
    try {
      console.log("Cargando espacios...");
      const dict = {};
      
      // Verificar si espaciosData existe y es un array
      if (Array.isArray(espaciosData)) {
        espaciosData.forEach(espacio => {
          if (espacio && espacio.id && espacio.nombre) {
            dict[espacio.id.toString()] = espacio.nombre;
          }
        });
        console.log("Diccionario de espacios creado:", dict);
        setEspaciosDict(dict);
      } else {
        console.warn("espaciosData no es un array válido:", espaciosData);
        // Diccionario por defecto si no se puede cargar
        setEspaciosDict({
          "1": "Auditorio Polar",
          "2": "Salón Eugenio Mendoza",
          "3": "Área de Videojuegos",
          "4": "Samán",
          "5": "Salón metaverso",
          "6": "Salón de computación"
        });
      }
    } catch (error) {
      console.error("Error al cargar espacios:", error);
      setError("Error al cargar el catálogo de espacios");
    }
  }, []);

  // Cargar reservas usando ReservaFacade
  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log("Iniciando carga de reservas...");
        const reservaService = ReservaService.getInstance();
        
        // Verificar si el método existe
        if (typeof reservaService.obtenerTodasLasReservas !== 'function') {
          throw new Error("El método obtenerTodasLasReservas no existe en ReservaService");
        }
        
        const data = await reservaService.obtenerTodasLasReservas();
        console.log("Reservas cargadas:", data);
        
        if (Array.isArray(data)) {
          setReservas(data);
        } else {
          console.warn("Los datos de reservas no son un array:", data);
          setReservas([]);
        }
      } catch (error) {
        console.error("Error al obtener reservas:", error);
        setError(`Error al cargar reservas: ${error.message}`);
        setReservas([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  // Obtener nombre del espacio usando el diccionario
  const getNombreEspacio = (reserva) => {
    try {
      // Prioridad: espacioId -> detalles.nombreEspacio -> espacio -> "Desconocido"
      if (reserva.espacioId && espaciosDict[reserva.espacioId.toString()]) {
        return espaciosDict[reserva.espacioId.toString()];
      }
      if (reserva.detalles && reserva.detalles.nombreEspacio) {
        return reserva.detalles.nombreEspacio;
      }
      if (reserva.espacio) {
        return reserva.espacio;
      }
      return "Desconocido";
    } catch (error) {
      console.error("Error al obtener nombre del espacio:", error);
      return "Error";
    }
  };

  // Obtener nombre del usuario
  const getNombreUsuario = (reserva) => {
    try {
      return reserva.nombreUsuario || 
             reserva.usuario || 
             (reserva.detalles && reserva.detalles.nombreUsuario) || 
             "Usuario";
    } catch (error) {
      console.error("Error al obtener nombre del usuario:", error);
      return "Error";
    }
  };

  // Obtener fecha de la reserva
  const getFechaReserva = (reserva) => {
    try {
      let fecha = null;
      
      if (reserva.fechaReserva) {
        if (typeof reserva.fechaReserva.toDate === 'function') {
          fecha = reserva.fechaReserva.toDate();
        } else if (reserva.fechaReserva instanceof Date) {
          fecha = reserva.fechaReserva;
        } else {
          fecha = new Date(reserva.fechaReserva);
        }
      } else if (reserva.creadaEn) {
        if (typeof reserva.creadaEn.toDate === 'function') {
          fecha = reserva.creadaEn.toDate();
        } else {
          fecha = new Date(reserva.creadaEn);
        }
      } else if (reserva.fecha) {
        fecha = new Date(reserva.fecha);
      }

      return fecha && !isNaN(fecha.getTime()) ? fecha : null;
    } catch (error) {
      console.error("Error al obtener fecha de reserva:", error);
      return null;
    }
  };

  // Filtrar reservas por rango de tiempo y estado
  const getFilteredReservas = (estado = null) => {
    try {
      const now = new Date();
      const fromDate = new Date();
      fromDate.setDate(now.getDate() - selectedRange);

      return reservas.filter((reserva) => {
        try {
          const fecha = getFechaReserva(reserva);
          if (!fecha) return false;

          const inRange = fecha >= fromDate && fecha <= now;
          const matchesEstado = estado ? reserva.estado === estado : true;
          
          return inRange && matchesEstado;
        } catch (error) {
          console.error("Error al filtrar reserva:", error);
          return false;
        }
      });
    } catch (error) {
      console.error("Error al filtrar reservas:", error);
      return [];
    }
  };

  // Agrupar reservas por fecha para las gráficas
  const groupByDate = (data) => {
    try {
      const counts = {};
      
      data.forEach((reserva) => {
        try {
          const fecha = getFechaReserva(reserva);
          if (!fecha) return;

          const key = fecha.toLocaleDateString();
          counts[key] = (counts[key] || 0) + 1;
        } catch (error) {
          console.error("Error al agrupar reserva por fecha:", error);
        }
      });

      // Ordenar fechas
      return Object.keys(counts)
        .sort((a, b) => new Date(a) - new Date(b))
        .reduce((obj, key) => {
          obj[key] = counts[key];
          return obj;
        }, {});
    } catch (error) {
      console.error("Error al agrupar por fecha:", error);
      return {};
    }
  };

  // Ranking de salones (corregido)
  const getRankingSalones = () => {
    try {
      const counts = {};
      
      reservas.forEach((reserva) => {
        try {
          // Excluir canceladas del ranking
          if (reserva.estado === "cancelada") return;
          
          const nombre = getNombreEspacio(reserva);
          counts[nombre] = (counts[nombre] || 0) + 1;
        } catch (error) {
          console.error("Error al procesar reserva para ranking:", error);
        }
      });

      return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .map(([nombre, cantidad]) => ({ nombre, cantidad }));
    } catch (error) {
      console.error("Error al generar ranking:", error);
      return [];
    }
  };

  // Gráfica de solicitudes de alquiler
  const renderAlquileresChart = () => {
    try {
      const filtered = getFilteredReservas();
      const grouped = groupByDate(filtered);
      const labels = Object.keys(grouped);
      const data = Object.values(grouped);

      if (labels.length === 0) {
        return <div className="no-data">No hay datos para mostrar en este rango</div>;
      }

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
    } catch (error) {
      console.error("Error al renderizar gráfica de alquileres:", error);
      return <div className="error">Error al cargar gráfica</div>;
    }
  };

  // Gráfica de canceladas
  const renderCanceladasChart = () => {
    try {
      const filtered = getFilteredReservas("cancelada");
      const grouped = groupByDate(filtered);
      const labels = Object.keys(grouped);
      const data = Object.values(grouped);

      if (labels.length === 0) {
        return <div className="no-data">No hay reservas canceladas en este rango</div>;
      }

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
    } catch (error) {
      console.error("Error al renderizar gráfica de canceladas:", error);
      return <div className="error">Error al cargar gráfica</div>;
    }
  };

  // Gráfica de ranking de salones
  const renderRankingChart = () => {
    try {
      const ranking = getRankingSalones();
      const labels = ranking.map((r) => r.nombre);
      const data = ranking.map((r) => r.cantidad);

      if (labels.length === 0) {
        return <div className="no-data">No hay datos de ranking disponibles</div>;
      }

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
    } catch (error) {
      console.error("Error al renderizar gráfica de ranking:", error);
      return <div className="error">Error al cargar gráfica</div>;
    }
  };

  // Renderizado de cada reporte
  const renderReportContent = () => {
    if (loading) return <div className="loader">Cargando reportes...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    try {
      if (selectedReport === "alquileres") {
        const filtered = getFilteredReservas();
        return (
          <div>
            <h3>Solicitudes de alquiler ({filtered.length})</h3>
            {filtered.length === 0 ? (
              <p className="no-data">No hay solicitudes en el rango seleccionado</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Espacio</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, index) => {
                    const fecha = getFechaReserva(r);
                    return (
                      <tr key={r.id || index}>
                        <td>{getNombreEspacio(r)}</td>
                        <td>{getNombreUsuario(r)}</td>
                        <td>{fecha ? fecha.toLocaleDateString() : r.fecha || "N/A"}</td>
                        <td>{r.hora || "N/A"}</td>
                        <td>{r.estado || "pendiente"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      }

      if (selectedReport === "canceladas") {
        const filtered = getFilteredReservas("cancelada");
        return (
          <div>
            <h3>Solicitudes canceladas ({filtered.length})</h3>
            {filtered.length === 0 ? (
              <p className="no-data">No hay solicitudes canceladas en el rango seleccionado</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Espacio</th>
                    <th>Usuario</th>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Motivo</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, index) => {
                    const fecha = getFechaReserva(r);
                    return (
                      <tr key={r.id || index}>
                        <td>{getNombreEspacio(r)}</td>
                        <td>{getNombreUsuario(r)}</td>
                        <td>{fecha ? fecha.toLocaleDateString() : r.fecha || "N/A"}</td>
                        <td>{r.hora || "N/A"}</td>
                        <td>{r.motivoCancelacion || "No especificado"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        );
      }

      if (selectedReport === "ranking") {
        const ranking = getRankingSalones();
        return (
          <div>
            <h3>Ranking de Espacios más solicitados</h3>
            {ranking.length === 0 ? (
              <p className="no-data">No hay datos de ranking disponibles</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Posición</th>
                    <th>Espacio</th>
                    <th>Solicitudes</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((item, idx) => (
                    <tr key={item.nombre || idx}>
                      <td>{idx + 1}</td>
                      <td>{item.nombre}</td>
                      <td>{item.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        );
      }

      return <div>Selecciona un reporte</div>;
    } catch (error) {
      console.error("Error al renderizar contenido del reporte:", error);
      return <div className="error">Error al mostrar el reporte</div>;
    }
  };

  // Debug: Mostrar información en consola
  useEffect(() => {
    console.log("=== ESTADO ACTUAL ===");
    console.log("- Reservas:", reservas.length);
    console.log("- Espacios dict:", Object.keys(espaciosDict).length);
    console.log("- Loading:", loading);
    console.log("- Error:", error);
    console.log("- Selected report:", selectedReport);
  }, [reservas, espaciosDict, loading, error, selectedReport]);

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
              <span role="img" aria-label="alquiler">📅</span>{" "}
              Reporte de solicitudes de alquiler
            </button>
            <button
              className={selectedReport === "canceladas" ? "active" : ""}
              onClick={() => setSelectedReport("canceladas")}
            >
              <span role="img" aria-label="canceladas">❌</span>{" "}
              Reporte de solicitudes canceladas
            </button>
            <button
              className={selectedReport === "ranking" ? "active" : ""}
              onClick={() => setSelectedReport("ranking")}
            >
              <span role="img" aria-label="ranking">🏆</span>{" "}
              Ranking de Espacios más solicitados
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