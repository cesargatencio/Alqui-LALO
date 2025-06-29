import React, { useState, useEffect } from "react";
import "./ModificarUsuario.css";

const ModificarUsuario = () => {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));

  const [formData, setFormData] = useState({
    nombre: usuarioGuardado?.displayName || "",
    apellido: usuarioGuardado?.apellido || "",
    correo: usuarioGuardado?.email || "",
    telefono: usuarioGuardado?.telefono || "",
    password: "",
    confirmarPassword: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      nombre: usuarioGuardado?.displayName || "",
      apellido: usuarioGuardado?.apellido || "",
      correo: usuarioGuardado?.email || "",
      telefono: usuarioGuardado?.telefono || "",
    }));
  }, [usuarioGuardado]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Datos actualizados correctamente");
  };

  return (
    <div className="modificar-usuario-container">
      <form className="modificar-usuario-form" onSubmit={handleSubmit}>
        <h2>Modificar Usuario</h2>
        <div className="form-grid">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
            />
          </label>
          <label>
            Correo electrónico:
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Teléfono:
            <input
              type="tel"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </label>
          <label>
            Nueva contraseña:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </label>
          <label>
            Confirmar contraseña:
            <input
              type="password"
              name="confirmarPassword"
              value={formData.confirmarPassword}
              onChange={handleChange}
            />
          </label>
        </div>
        <button type="submit" className="guardar-btn">Guardar cambios</button>
      </form>
    </div>
  );
};

export default ModificarUsuario;