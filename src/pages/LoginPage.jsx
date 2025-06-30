import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Agrega useNavigate
import "./LoginPage.css";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const LoginPage = () => {
  const [formData, setFormData] = useState({ correo: "", password: "" });
  const [error, setError] = useState(""); // Nuevo estado para el error
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para éxito
  const navigate = useNavigate(); // Inicializa el hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
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
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            uid: user.uid,
            ...docSnap.data()
          })
        );
      } else {
        localStorage.setItem(
          "usuario",
          JSON.stringify({
            uid: user.uid,
            correo: user.email,
          })
        );
      }

      setSuccessMessage("Sesión iniciada correctamente.");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setError("Las credenciales no coinciden. Intenta de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Si el inicio de sesión es exitoso, result contendrá la información del usuario
      // 1) Extrae el usuario Firebase
const user = result.user;

// 2) Intenta leer su doc en Firestore
const docRef = doc(db, "usuarios", user.uid);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  localStorage.setItem(
    "usuario",
    JSON.stringify({
      uid: user.uid,
      ...docSnap.data()
    })
  );
} else {
    localStorage.setItem(
      "usuario",
      JSON.stringify({
        uid: user.uid,
        displayName: user.displayName,
        correo: user.email,
        telefono: user.phoneNumber
      })
    );
  }
        navigate("/"); // Redirige a la página de inicio
      } catch (error) {
        console.error("❌ Error al iniciar con Google:", error.message);
        alert("Error con Google: " + error.message);
      }
    };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>INICIO DE SESIÓN</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              placeholder="ejemplo@unimet.edu.ve"
              required
              onInvalid={e => e.target.classList.add("input-error")}
              onInput={e => e.target.classList.remove("input-error")}
            />
          </div>
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••"
              required
              onInvalid={e => e.target.classList.add("input-error")}
              onInput={e => e.target.classList.remove("input-error")}
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button">
            Iniciar Sesión
          </button>
          <button
            type="button"
            className="google-login-button"
            onClick={handleGoogleLogin}
          >
            Iniciar sesión con Google
          </button>
          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </form>

        <div className="register-prompt">
          <p>¿Aún no tienes cuenta? Regístrate en el botón de abajo</p>
          <Link to="/register" className="register-button">
            Registrarse
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
