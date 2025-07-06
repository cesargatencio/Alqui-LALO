// src/pages/MisReservas.jsx
import React, { useEffect, useState } from "react";
import ReservaService from "../services/ReservaFacade";
import AuthService from "../services/AuthSingleton";
import { useNavigate } from "react-router-dom";
import ReservaCard from "../components/ReservaCard/ReservaCard";
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

  const handleEliminarReserva = async (reservaId) => {
    const reserva = reservas.find(r => r.id === reservaId);
    if (!reserva) return;
    try {
      await reservaService.cancelarReserva(reservaId);
      setReservas(prev => prev.filter(r => r.id !== reservaId));
    } catch (err) {
      alert("No se pudo eliminar la reserva: " + err.message);
    }
  };

  if (loading) return <p className="cargando">Cargando reservas...</p>;

  return (
    <div className="mis-reservas-container">
      <h2>Mis Reservas</h2>
      {reservas.length === 0 ? (
        <p className="sin-reservas">No tienes reservas registradas.</p>
      ) : (
        <div className="reserva-grid">
          {reservas.map((reserva) => (
            <ReservaCard
              key={reserva.id}
              reserva={reserva}
              onEliminar={handleEliminarReserva}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisReservas;

