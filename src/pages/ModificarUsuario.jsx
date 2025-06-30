import React, { useState } from "react";
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
    password: "",
    confirmarPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

// 2) Si cambió la contraseña, actualízala y linkea solo si no está ya vinculado
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
        JSON.stringify({uid,...nuevosDatos
      }));
      // 3) Redirige al home tras éxito
      navigate("/");
      
    } catch (error) {
      alert("Error al actualizar los datos: " + error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.correo,
        formData.password
      );
      const user = userCredential.user;

      // Obtener datos completos de Firestore
      const docRef = doc(db, "usuarios", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Guardar todos los datos en localStorage
        localStorage.setItem("usuario", JSON.stringify(docSnap.data()));
      } else {
        // Si no existe, guarda solo los datos básicos
        localStorage.setItem("usuario", JSON.stringify({
          displayName: user.displayName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          uid: user.uid
        }));
      }

      alert("Sesión iniciada correctamente");
      navigate("/");
    } catch (error) {
      alert("Error al iniciar sesión: " + error.message);
    }
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