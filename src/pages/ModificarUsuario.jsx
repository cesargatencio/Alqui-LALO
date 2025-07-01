import React, { useState, useRef } from "react";
import "./ModificarUsuario.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { updatePassword, EmailAuthProvider, linkWithCredential } from "firebase/auth";

const ModificarUsuario = () => {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: usuarioGuardado?.nombre || usuarioGuardado?.displayName || "",
    apellido: usuarioGuardado?.apellido || "",
    correo: usuarioGuardado?.correo || usuarioGuardado?.email || "",
    telefono: usuarioGuardado?.telefono || usuarioGuardado?.phoneNumber || "",
    fechaNacimiento: usuarioGuardado?.fechaNacimiento || "",
    password: "",
    confirmarPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Validación de contraseñas
    if (formData.password || formData.confirmarPassword) {
      if (formData.password !== formData.confirmarPassword) {
        setPasswordError("Las contraseñas no coinciden.");
        return;
      }
      if (formData.password.length < 6) {
        setPasswordError("La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }

    const stored = JSON.parse(localStorage.getItem("usuario"));
    if (!stored || !stored.uid) {
      alert("No hay un usuario válido en localStorage. Por favor, ingresa de nuevo.");
      return;
    }
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("Sesión expirada. Por favor, inicia sesión de nuevo.");
      return;
    }

    try {
      const uid = currentUser.uid;
      const docRef = doc(db, "usuarios", uid);

      const nuevosDatos = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
      };

      // Intenta actualizar
      try {
        await updateDoc(docRef, nuevosDatos);
      } catch (error) {
        if (error.message.includes("No document to update")) {
          // Si no existe, lo crea
          await setDoc(docRef, { uid, ...nuevosDatos });
        } else {
          throw error;
        }
      }

      // Si cambió la contraseña, actualízala y linkea solo si no está ya vinculado
      if (formData.password && formData.password === formData.confirmarPassword) {
        // a) Actualiza la pass en Auth
        await updatePassword(currentUser, formData.password);

        // b) Solo linkea si no existe ya el proveedor password
        const alreadyLinked = currentUser.providerData.some(
          (p) => p.providerId === "password"
        );
        if (!alreadyLinked) {
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            formData.password
          );
          await linkWithCredential(currentUser, credential);
        }
      }

      // Actualiza en localStorage
      localStorage.setItem(
        "usuario",
        JSON.stringify({ uid, ...nuevosDatos })
      );

      // Mensaje de éxito (ya no redirecciona)
      setSuccessMessage("Datos guardados correctamente.");
    } catch (error) {
      alert("Error al actualizar los datos: " + error.message);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="modificar-usuario-container">
      <form className="modificar-usuario-form" onSubmit={handleSubmit}>
        <h2>Modificar Usuario</h2>
        {/* Círculo avatar */}
        <div
          className="circle-landing"
          style={{ margin: "0 auto 0.2rem auto", cursor: "pointer", overflow: "hidden" }}
          onClick={handleAvatarClick}
          title="Haz clic para cambiar tu foto"
        >
          {avatar ? (
            <img
              src={avatar}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            formData.nombre ? formData.nombre[0].toUpperCase() : ""
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleAvatarChange}
          />
        </div>
        {/* Texto debajo del círculo */}
        <div style={{ textAlign: "center", marginBottom: "0.5rem", color: "#001F3F", fontWeight: "500" }}>
          Foto de perfil
        </div>
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
            Fecha de nacimiento:
            <input
              type="date"
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required
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
          {passwordError && (
            <div style={{ color: "red", gridColumn: "1 / -1" }}>{passwordError}</div>
          )}
        </div>
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <button type="submit" className="guardar-btn">Guardar cambios</button>
      </form>
    </div>
  );
};

export default ModificarUsuario;