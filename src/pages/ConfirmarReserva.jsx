import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PaypalButton from "../components/PaypalButton/PaypalButton";
import ReservaService from "../services/ReservaFacade";
import "./ConfirmarReserva.css";

const reservaService = ReservaService.getInstance();

const ConfirmarReserva = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [mensajeExito, setMensajeExito] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const {
    reservaId,
    espacio,
    fecha,
    hora,
    duracion,
    usuario
  } = state || {};

  // Helper: convierte la cadena de duración a número de horas
  const parseDuracionAHoras = (str) => {
    switch (str) {
      case "45 minutos":      return 0.75;
      case "1 hora 30 min":   return 1.5;
      case "2 horas":         return 2;
      case "3 horas":         return 3;
      case "6 horas":         return 6;
      default:                return 1;  // fallback a 1 hora
    }
  };

  if (!espacio || !fecha || !hora || !duracion) {
    return <p className="conf-reserva-error">Faltan datos de reserva. Vuelve a Mis Reservas.</p>;
  }

    // Tarifa base por hora (número)
  const tarifaHora = espacio.precio
    ? parseFloat(String(espacio.precio).replace(/[^0-9.]/g, ""))
    : 15.0;

  // Factor de horas según la duración seleccionada
  const horas = parseDuracionAHoras(duracion);

  // Monto total = tarifa * horas
  const montoReserva = +(tarifaHora * horas).toFixed(2);

  // 👉 Para reservas ya creadas (desde MisReservas)
  const handlePagoExitoso = async (detalles) => {
    try {
      if (!reservaId) throw new Error("No se encontró el ID de la reserva");
      await reservaService.confirmarPago(reservaId, detalles);
      setMensajeExito("Reserva pagada con éxito");
      setTimeout(() => {
        navigate("/mis-reservas");
      }, 3000);
    } catch (error) {
      setMensajeExito("Error al confirmar el pago: " + error.message);
    }
  };

  const handlePagarManual = async () => {
    try {
      if (!reservaId) throw new Error("No se encontró el ID de la reserva");
      await reservaService.confirmarPago(reservaId, { metodo: "manual" });
      setMensajeExito("Reserva marcada como pagada manualmente.");
      setTimeout(() => {
        navigate("/mis-reservas");
      }, 1500);
    } catch (error) {
      setMensajeExito("Error al pagar manualmente: " + error.message);
    }
  };

  // 👉 Para crear una nueva reserva (cuando no hay reservaId)
  const handleConfirmar = async () => {
    try {
      await reservaService.crearReserva({
        espacioId: espacio.id,
        usuarioId: usuario.uid,
        fecha,
        hora,
        monto: montoReserva,
        descripcion,
        detalles: {
          duracion,
          nombreEspacio: espacio.nombre,
          imagenEspacio: espacio.imagenURL
        }
      });
      setMensajeExito("Reserva creada correctamente.");
      setTimeout(() => {
        navigate("/mis-reservas");
      }, 1500);
    } catch (error) {
      setMensajeExito("");
    }
  };

  return (
    <div className="conf-reserva-container">
      <div className="conf-reserva-card">
        <h2>Confirmar Reserva</h2>
        <div className="conf-reserva-info">
          <p><strong>Espacio:</strong> {espacio.nombre}</p>
          <p><strong>Fecha:</strong> {new Date(fecha).toLocaleDateString()}</p>
          <p><strong>Hora:</strong> {hora}</p>
          <p><strong>Duración:</strong> {duracion}</p>
          <p><strong>Monto a pagar:</strong> ${montoReserva}</p>
          {/* Descripción solo cuando sea una reserva nueva (no existe reservaId) */}
  {!reservaId && (
    <label style={{ display: "block", marginTop: "1rem" }}>
      <strong>Descripción:</strong><br/>
      <textarea
        value={descripcion}
        onChange={e => setDescripcion(e.target.value)}
        placeholder="Escribe aquí una descripción para tu reserva..."
        rows={3}
        style={{
          width: "100%",
          padding: "0.5rem",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      />
    </label>
  )}
        </div>

        {reservaId ? (
          <>
            <div className="conf-reserva-paypal">
              <PaypalButton monto={montoReserva} onPagoExitoso={handlePagoExitoso} />
            </div>
            <button
              className="conf-reserva-btn-rojo"
              style={{ marginTop: "0.7rem" }}
              onClick={handlePagarManual}
            >
              Pagar
            </button>
          </>
        ) : (
          <button className="conf-reserva-btn" onClick={handleConfirmar}>
            Confirmar Reserva
          </button>
        )}

        {mensajeExito && (
          <div className="mensaje-exito">{mensajeExito}</div>
        )}
      </div>
    </div>
  );
};

export default ConfirmarReserva;


