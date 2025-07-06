import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReservaService from "../../services/ReservaFacade";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // Ajusta la ruta según tu proyecto
import "./ReservaCard.css";

const ReservaCard = ({ reserva, onEliminar, onModificar }) => {
  const navigate = useNavigate();
  const reservaService = ReservaService.getInstance();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [mostrarModalModificar, setMostrarModalModificar] = useState(false);
  const [nuevaFecha, setNuevaFecha] = useState(reserva.fecha);
  const [nuevaHora, setNuevaHora] = useState(reserva.hora);
  const [nuevaDuracion, setNuevaDuracion] = useState(reserva.detalles.duracion);
  const [mensajeMod, setMensajeMod] = useState("");

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

  const verificarDisponibilidad = async () => {
    const reservasRef = collection(db, "reservas");
    const q = query(
      reservasRef,
      where("espacioId", "==", reserva.espacioId),
      where("fecha", "==", nuevaFecha),
      where("hora", "==", nuevaHora)
    );
    const querySnapshot = await getDocs(q);
    // Solo está disponible si no hay otra reserva activa en ese horario
    return querySnapshot.docs.every(doc => doc.id === reserva.id || doc.data().estado === "cancelada");
  };

  const handleModificarReserva = async () => {
    try {
      const disponible = await verificarDisponibilidad();
      if (!disponible) {
        setMensajeMod("El espacio no está disponible en la nueva fecha y hora.");
        return;
      }
      await ReservaService.getInstance().modificarReserva(reserva.id, {
        fecha: nuevaFecha,
        hora: nuevaHora,
        detalles: {
          ...reserva.detalles,
          duracion: nuevaDuracion,
        },
      });
      setMensajeMod("Reserva modificada correctamente.");
      setTimeout(() => {
        setMostrarModalModificar(false);
        setMensajeMod("");
        if (typeof onModificar === "function") onModificar(); // Si tienes un callback para recargar reservas
      }, 1200);
    } catch (e) {
      setMensajeMod("Error al modificar la reserva.");
    }
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
          <div className="botones-acciones">
            <button className="cancelar-btn" onClick={handleCancelar}>
              Cancelar
            </button>
            {reserva.estado === "pendiente_pago" && (
              <button className="pagar-btn" onClick={handlePagar}>
                Pagar
              </button>
            )}
            {/* Solo mostrar el botón Modificar si la reserva NO está pagada */}
            {reserva.estado !== "pagada" && (
              <button className="modificar-btn" onClick={() => setMostrarModalModificar(true)}>
                Modificar
              </button>
            )}
          </div>
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
      {/* Modal de modificación */}
      {mostrarModalModificar && (
        <div className="modal-overlay">
          <div className="modal">
            <h3 style={{ textAlign: "center", fontSize: "1.5rem", marginBottom: "1.2rem" }}>
              Modificar Reserva
            </h3>
            <form
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.8rem",
                width: "100%",
              }}
              onSubmit={e => {
                e.preventDefault();
                handleModificarReserva();
              }}
            >
              <div style={{ width: "100%", maxWidth: "260px", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontWeight: "bold", color: "#333" }}>
                  Fecha
                  <input
                    type="date"
                    value={nuevaFecha}
                    onChange={e => setNuevaFecha(e.target.value)}
                    style={{
                      fontSize: "1rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #bbb",
                      width: "100%",
                      marginTop: "0.2rem"
                    }}
                    required
                  />
                </label>
                <label style={{ fontWeight: "bold", color: "#333" }}>
                  Hora
                  <input
                    type="time"
                    value={nuevaHora}
                    onChange={e => setNuevaHora(e.target.value)}
                    style={{
                      fontSize: "1rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #bbb",
                      width: "100%",
                      marginTop: "0.2rem"
                    }}
                    required
                  />
                </label>
                <label style={{ fontWeight: "bold", color: "#333" }}>
                  Duración
                  <select
                    value={nuevaDuracion}
                    onChange={e => setNuevaDuracion(e.target.value)}
                    style={{
                      fontSize: "1rem",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "6px",
                      border: "1px solid #bbb",
                      width: "100%",
                      marginTop: "0.2rem"
                    }}
                    required
                  >
                    <option value="45 minutos">45 minutos</option>
                    <option value="1 hora 30 min">1 hora 30 min</option>
                    <option value="2 horas">2 horas</option>
                    <option value="3 horas">3 horas</option>
                    <option value="6 horas">6 horas</option>
                  </select>
                </label>
              </div>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  className="btn-guardar"
                  style={{
                    background: "#219a00",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    minWidth: "120px"
                  }}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="btn-cancelar"
                  style={{
                    background: "#e53935",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1rem",
                    padding: "0.5rem 1.5rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    minWidth: "120px"
                  }}
                  onClick={() => setMostrarModalModificar(false)}
                >
                  Cancelar
                </button>
              </div>
              {mensajeMod && (
                <div className="mensaje-exito" style={{ marginTop: "1rem" }}>
                  {mensajeMod}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservaCard;
