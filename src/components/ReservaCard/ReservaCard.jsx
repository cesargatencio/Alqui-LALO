import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservaService from "../../services/ReservaFacade";
import "./ReservaCard.css";

const ReservaCard = ({ reserva, onEliminar }) => {
  const navigate = useNavigate();
  const reservaService = ReservaService.getInstance();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleCancelar = () => {
    setMostrarModal(true);
    setMensaje("");
  };

  const confirmarCancelacion = async () => {
    try {
      await reservaService.cancelarReserva(reserva.id);
      setMensaje("Reserva cancelada correctamente");
      setTimeout(() => {
        setMensaje("");
        setMostrarModal(false);
        if (onEliminar) onEliminar(reserva.id);
      }, 2000);
    } catch (e) {
      setMensaje("No se pudo cancelar la reserva: " + e.message);
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
      {mostrarModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>¿Cancelar esta reserva?</h3>
            <p>
              Espacio: <b>{reserva.detalles.nombreEspacio}</b><br />
              Fecha: <b>{new Date(reserva.fecha).toLocaleDateString()}</b> a las <b>{reserva.hora}</b>
            </p>
            <div className="modal-botones">
              <button className="btn-cancelar" onClick={() => setMostrarModal(false)}>
                No, volver
              </button>
              <button className="btn-guardar" onClick={confirmarCancelacion}>
                Sí, cancelar
              </button>
            </div>
            {mensaje && (
              <div className="mensaje-exito">{mensaje}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaCard;
