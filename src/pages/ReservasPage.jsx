// src/pages/MisReservas.jsx
import React, { useEffect, useState } from "react";
import ReservaService from "../services/ReservaFacade";
import AuthService from "../services/AuthSingleton";
import "./ReservasPage.css";

const reservaService = ReservaService.getInstance();
const authService = AuthService.getInstance();

const MisReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

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
