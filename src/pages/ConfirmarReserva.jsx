import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaypalButton from "../components/PaypalButton/PaypalButton";
import ReservaService from "../services/ReservaFacade";
import "./ConfirmarReserva.css"; 

const reservaService = ReservaService.getInstance();

const ConfirmarReserva = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { espacio, fecha, hora, duracion, usuario } = location.state || {};

  if (!espacio || !fecha || !hora || !duracion) {
    return <p className="conf-reserva-error">No hay datos de reserva. Por favor selecciona un espacio, fecha, hora y duración.</p>;
  }

  const montoReserva = espacio.precio
    ? parseFloat(String(espacio.precio).replace(/[^0-9.]/g, ""))
    : 15.0;
  const reservaId = `${espacio.id}_${fecha}_${hora}`;

  const handlePagoExitoso = async (detalles) => {
    await reservaService.crearReserva({
      espacioId: espacio.id,
      usuarioId: usuario.uid,
      fecha,
      hora,
      monto: montoReserva,
      detalles: {
        duracion,
        nombreEspacio: espacio.nombre,
        imagenEspacio: espacio.imagenURL // o el nombre correcto del campo
      }
    });

    await reservaService.confirmarPago(`${espacio.id}_${fecha}_${hora}`, detalles);
    navigate("/mis-reservas");
  };



  const handleConfirmar = async () => {
    try {
      await reservaService.crearReserva({
        espacioId: espacio.id,
        usuarioId: usuario.uid,
        fecha,
        hora,
        monto: montoReserva,
        detalles: {
          duracion,
          nombreEspacio: espacio.nombre,
          imagenEspacio: espacio.imagenURL || ""
        }
      });

      alert("Reserva guardada con éxito (simulación sin pago).");
      navigate("/mis-reservas");
    } catch (error) {
      console.error("Error al guardar la reserva:", error);
      alert("Ocurrió un error al guardar la reserva.");
    }
  };


  return (
    <div className="conf-reserva-container">
      <div className="conf-reserva-card">
        <h2>Confirmar Reserva</h2>
        <div className="conf-reserva-info">
          <p><strong>Espacio:</strong> {espacio.nombre}</p>
          <p><strong>Fecha:</strong> {fecha ? new Date(fecha).toLocaleDateString() : ""}</p>
          <p><strong>Hora:</strong> {hora}</p>
          <p><strong>Duración:</strong> {duracion}</p>
          <p><strong>Monto a pagar:</strong> ${montoReserva}</p>
        </div>
        <div className="conf-reserva-paypal">
          <PaypalButton monto={montoReserva} onPagoExitoso={handlePagoExitoso} />
        </div>
        <button className="conf-reserva-btn" onClick={handleConfirmar}>
          CONFIRMAR
        </button>
        <button
          className="conf-reserva-btn-rojo"
          style={{ marginTop: "0.7rem" }}
          onClick={() => alert("Simulación de pago en efectivo o presencial.")}
        >
          PAGAR
        </button>
      </div>
    </div>
  );
};

export default ConfirmarReserva;

