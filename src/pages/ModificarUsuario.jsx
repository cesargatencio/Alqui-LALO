import React, { useState, useRef, useEffect } from "react";
import "./ModificarUsuario.css";
import { useNavigate } from "react-router-dom";
import { updatePassword, EmailAuthProvider, linkWithCredential } from "firebase/auth";
import AuthService from "../services/AuthSingleton";
import { uploadUserImage, getUserImageUrl } from "../services/SupabaseService";

const ModificarUsuario = () => {
  const usuarioGuardado = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();
  const authService = AuthService.getInstance();

  const [formData, setFormData] = useState({
    nombre: usuarioGuardado?.nombre || usuarioGuardado?.displayName || "",
    apellido: usuarioGuardado?.apellido || "",
    correo: usuarioGuardado?.correo || usuarioGuardado?.email || "",
    telefono: usuarioGuardado?.telefono || usuarioGuardado?.phoneNumber || "",
    fechaNacimiento: usuarioGuardado?.fechaNacimiento || "",
    password: "",
    confirmarPassword: "",
    fotoPerfil: usuarioGuardado?.fotoPerfil || "", // URL (opcional)
    fotoPerfilPath: usuarioGuardado?.fotoPerfilPath || "", // PATH (importante)
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const fileInputRef = useRef();

  // Al cargar, si hay fotoPerfilPath, obtener el URL público
  useEffect(() => {
    if (formData.fotoPerfilPath) {
      const publicUrl = getUserImageUrl(formData.fotoPerfilPath);
      setAvatar(publicUrl);
    } else if (formData.fotoPerfil) {
      setAvatar(formData.fotoPerfil);
    } else {
      setAvatar(null);
    }
  }, [formData.fotoPerfilPath, formData.fotoPerfil]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Maneja la selección de imagen y sube a Supabase
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview local
      const reader = new FileReader();
      reader.onload = (ev) => setAvatar(ev.target.result);
      reader.readAsDataURL(file);

      // Usa extensión correcta
      const extension = file.name.split('.').pop();
      const path = `perfil/${usuarioGuardado.uid || usuarioGuardado.id || usuarioGuardado.correo}_${Date.now()}.${extension}`;
      const { publicUrl, path: savedPath } = await uploadUserImage(path, file);
      setFormData((prev) => ({
        ...prev,
        fotoPerfilPath: savedPath,
        fotoPerfil: publicUrl,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setSuccessMessage("");

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

    // Obtén el usuario actual desde el singleton
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      setPasswordError("Sesión expirada. Por favor, inicia sesión de nuevo.");
      return;
    }

    try {
      const uid = currentUser.uid;
      const nuevosDatos = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        correo: formData.correo,
        telefono: formData.telefono,
        fechaNacimiento: formData.fechaNacimiento,
        fotoPerfilPath: formData.fotoPerfilPath || usuarioGuardado.fotoPerfilPath || "",
        fotoPerfil: formData.fotoPerfil || usuarioGuardado.fotoPerfil || "",
      };

      // Usa el singleton para guardar los datos en Firestore
      await authService.saveUserData(uid, nuevosDatos);

      // Actualiza localStorage con los nuevos datos
      const usuarioActualizado = { ...usuarioGuardado, ...nuevosDatos };
      localStorage.setItem("usuario", JSON.stringify(usuarioActualizado));

      // Si cambió la contraseña, actualízala y linkea solo si no está ya vinculado
      if (formData.password && formData.password === formData.confirmarPassword) {
        await updatePassword(currentUser, formData.password);

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

      setSuccessMessage("Datos guardados correctamente.");
    } catch (error) {
      setPasswordError("Error al actualizar los datos: " + error.message);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
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
            formData.correo ? formData.correo[0].toUpperCase() : ""
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