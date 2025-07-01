import React from "react";
import PaypalButton from "../components/PaypalButton/PaypalButton";


const ConfirmarReserva = () => {
  const montoReserva = "15.00"; // Puedes hacerlo dinámico más adelante
  const espacio = "Sala de Conferencias A";
  const fecha = "2025-07-01";
  const hora = "10:00 AM";

  const handlePagoExitoso = (detalles) => {
    alert(`Pago completado por ${detalles.payer.name.given_name}`);
    console.log("Detalles del pago:", detalles);
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Confirmar Reserva</h2>
      <p><strong>Espacio:</strong> {espacio}</p>
      <p><strong>Fecha:</strong> {fecha}</p>
      <p><strong>Hora:</strong> {hora}</p>
      <p><strong>Monto a pagar:</strong> ${montoReserva}</p>

      <PaypalButton monto={montoReserva} onPagoExitoso={handlePagoExitoso} />
    </div>
  );
};

export default ConfirmarReserva;
