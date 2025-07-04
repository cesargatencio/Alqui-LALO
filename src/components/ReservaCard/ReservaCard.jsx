import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReservaService from "../../services/ReservaFacade";
import "./ReservaCard.css";

const ReservaCard = ({ reserva }) => {
  const [imageUrl, setImageUrl] = useState("/imagenes/espacio-default.jpg");
  const navigate = useNavigate();

  useEffect(() => {
    // Opción B: usamos directamente la URL pública guardada en Firestore
    const publicUrl = reserva.detalles.imagenEspacio;
    setImageUrl(publicUrl || "/imagenes/espacio-default.jpg");
  }, [reserva]);

  const handleCancelar = async () => {
    if (!window.confirm("¿Seguro quieres cancelar esta reserva?")) return;
    try {
      await ReservaService.cancelarReserva(reserva.id);
      alert("Reserva cancelada correctamente");
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
          imagenURL: imageUrl,
          precio: reserva.monto
        },
        fecha: reserva.fecha,
        hora: reserva.hora,
        duracion: reserva.detalles.duracion,
        usuario: { uid: reserva.usuarioId }
      }
    });
  };

  return (
    <div className="reserva-card">
      <img
        className="reserva-img"
        src={imageUrl}
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