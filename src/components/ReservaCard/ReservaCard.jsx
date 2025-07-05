import React from "react";
import { useNavigate } from "react-router-dom";
import ReservaService from "../../services/ReservaFacade";
import "./ReservaCard.css";

const ReservaCard = ({ reserva, onEliminar }) => {
  const navigate = useNavigate();
  const reservaService = ReservaService.getInstance();

  const handleCancelar = async () => {
    const confirmar = window.confirm(`¿Estás seguro de que deseas cancelar esta reserva?\n\nEspacio: ${reserva.detalles.nombreEspacio}\nFecha: ${new Date(reserva.fecha).toLocaleDateString()} a las ${reserva.hora}`);
    
    if (!confirmar) return; // ⚠️ Si cancela, no hacer nada

    try {
      await reservaService.cancelarReserva(reserva.id);
      alert("Reserva cancelada correctamente");
      if (onEliminar) onEliminar(reserva.id);
    } catch (e) {
      alert("No se pudo cancelar la reserva: " + e.message);
    }
  };

  const handlePagar = () => {
    navigate("/confirmar-reserva", {
      state: {
        reservaId: reserva.id,
        espacio: {
          id: reserva.espacioId,
          nombre: reserva.detalles.nombreEspacio,
          imagenURL: reserva.detalles.imagenEspacio,
          precio: reserva.monto
        },
        fecha: reserva.fecha,
        hora: reserva.hora,
        duracion: reserva.detalles.duracion,
        usuario: { uid: reserva.usuarioId }
      }
    });
  };

  const imgSrc = reserva.detalles.imagenEspacio || "/imagenes/espacio-default.jpg";

  return (
    <div className="reserva-card">
      <img
        className="reserva-img"
        src={imgSrc}
        alt={reserva.detalles.nombreEspacio}
      />
      <div className="reserva-contenido">
        <h3>{reserva.detalles.nombreEspacio}</h3>
        <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p>
        <p><strong>Hora:</strong> {reserva.hora}</p>
        <p>
          <strong>Estado:</strong>
          <span className={`estado ${reserva.estado}`}>{reserva.estado}</span>
        </p>

        {reserva.estado !== "cancelada" && (
          <>
            <button className="cancelar-btn" onClick={handleCancelar}>
              Cancelar Reserva
            </button>

            {reserva.estado === "pendiente_pago" && (
              <button className="pagar-btn" onClick={handlePagar}>
                Pagar Reserva
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ReservaCard;
