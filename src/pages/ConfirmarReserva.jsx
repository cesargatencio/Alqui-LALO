import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaypalButton from "../components/PaypalButton/PaypalButton";
import ReservaService from "../services/ReservaFacade";

const reservaService = ReservaService.getInstance();

const ConfirmarReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { espacio, fecha, hora, duracion, usuario } = location.state || {};

  if (!espacio || !fecha || !hora || !duracion) {
    return <p>No hay datos de reserva. Por favor selecciona un espacio, fecha, hora y duración.</p>;
  }

  const montoReserva = espacio.precio || "15.00";
  const reservaId = `${espacio.id}_${fecha}_${hora}`; // Puedes ajustar el formato según tu lógica

  // Al confirmar el pago:
  const handlePagoExitoso = async (detalles) => {
    await reservaService.confirmarPago(reservaId, detalles);
    navigate("/mis-reservas"); // Redirige a la página de reservas del usuario
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Confirmar Reserva</h2>
      <p><strong>Espacio:</strong> {espacio.nombre}</p>
      <p><strong>Fecha:</strong> {fecha ? new Date(fecha).toLocaleDateString() : ""}</p>
      <p><strong>Hora:</strong> {hora}</p>
      <p><strong>Duración:</strong> {duracion}</p>
      <p><strong>Monto a pagar:</strong> ${montoReserva}</p>

      <PaypalButton monto={montoReserva} onPagoExitoso={handlePagoExitoso} />
    </div>
  );
};

export default ConfirmarReserva;
