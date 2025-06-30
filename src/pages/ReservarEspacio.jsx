import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const ReservarEspacio = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    espacio: "",
    fecha: "",
    hora: "",
    duracion: "",
  });

  const [estado, setEstado] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación simple
    if (!form.nombre || !form.espacio || !form.fecha || !form.hora) {
      setEstado({ tipo: "error", mensaje: "Por favor, completa todos los campos obligatorios." });
      return;
    }

    try {
      await addDoc(collection(db, "reservas"), {
        ...form,
        timestamp: serverTimestamp(),
      });

      setEstado({ tipo: "exito", mensaje: "¡Reserva realizada con éxito!" });
      setForm({ nombre: "", email: "", espacio: "", fecha: "", hora: "", duracion: "" });
    } catch (error) {
      console.error("Error al guardar reserva:", error);
      setEstado({ tipo: "error", mensaje: "Ocurrió un error al guardar la reserva." });
    }
  };

  return (
    <div className="reserva-container">
      <h2>Reservar un espacio</h2>

      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Tu nombre" value={form.nombre} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Correo electrónico" value={form.email} onChange={handleChange} required />
        <input type="text" name="espacio" placeholder="Nombre del espacio" value={form.espacio} onChange={handleChange} required />
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
        <select name="duracion" value={form.duracion} onChange={handleChange}>
          <option value="">Duración</option>
          <option value="45 minutos">45 minutos</option>
          <option value="1 hora">1 hora</option>
          <option value="2 horas">2 horas</option>
        </select>

        <button type="submit">Confirmar Reserva</button>
      </form>

      {estado && (
        <p style={{ color: estado.tipo === "exito" ? "green" : "red", marginTop: "10px" }}>
          {estado.mensaje}
        </p>
      )}
    </div>
  );
};

export default ReservarEspacio;
