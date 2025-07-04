// src/pages/MisReservas.jsx
import React, { useEffect, useState } from "react";
import ReservaService from "../services/ReservaFacade";
import AuthService from "../services/AuthSingleton";
import { useNavigate } from "react-router-dom";
import "./ReservasPage.css";

const reservaService = ReservaService.getInstance();
const authService = AuthService.getInstance();

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarReservas = async () => {
      const usuario = authService.getCurrentUser();
      if (usuario) {
        const reservasUsuario = await reservaService.obtenerReservasPorUsuario(usuario.uid);
        setReservas(reservasUsuario);
      }
      setLoading(false);
    };
    cargarReservas();
  }, []);

  if (loading) return <p className="cargando">Cargando reservas...</p>;

  return (
    <div className="mis-reservas-container">
      <h2>Mis Reservas</h2>
      {reservas.length === 0 ? (
        <p className="sin-reservas">No tienes reservas registradas.</p>
      ) : (
        <div className="reserva-grid">
          {reservas.map((reserva) => (
            <div className="reserva-card" key={reserva.id}>
              <img
                className="reserva-img"
                src={reserva.detalles?.imagenEspacio || "/imagenes/espacio-default.jpg"}
                alt={reserva.detalles?.nombreEspacio || "Espacio reservado"}
              />
              <div className="reserva-contenido">
                <h3>{reserva.detalles?.nombreEspacio || reserva.espacioId}</h3>
                <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {reserva.hora}</p>
                <p><strong>Estado:</strong> <span className={`estado ${reserva.estado}`}>{reserva.estado}</span></p>
                {reserva.estado !== "cancelada" && (
                  <>
                    <button
                      className="cancelar-btn"
                      onClick={async () => {
                        const confirmar = window.confirm("¿Estás seguro de que quieres cancelar esta reserva?");
                        if (!confirmar) return;

                        try {
                          await reservaService.cancelarReserva(reserva.id);
                          setReservas((prev) =>
                            prev.map((r) =>
                              r.id === reserva.id ? { ...r, estado: "cancelada" } : r
                            )
                          );
                        } catch (error) {
                          alert("No se pudo cancelar la reserva.");
                          console.error(error);
                        }
                      }}
                    >
                      Cancelar Reserva
                    </button>
                    {reserva.estado === "pendiente_pago" && (
                      <button
                        className="pagar-btn"
                        style={{
                          background: "#e67c00",
                          color: "#fff",
                          border: "none",
                          borderRadius: "0.5rem",
                          padding: "0.6rem 1.5rem",
                          fontWeight: "bold",
                          marginTop: "0.7rem",
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          navigate("/confirmar-reserva", {
                            state: {
                              reservaId: reserva.id,
                              espacio: {
                                id: reserva.espacioId,
                                nombre: reserva.detalles?.nombreEspacio,
                                imagenURL: reserva.detalles?.imagenEspacio,
                                precio: reserva.detalles?.monto || reserva.monto
                              },
                              fecha: reserva.fecha,
                              hora: reserva.hora,
                              duracion: reserva.detalles?.duracion,
                              usuario: {
                                uid: reserva.usuarioId
                              }
                            }
                          });
                        }}
                      >
                        Pagar Reserva
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisReservas;
