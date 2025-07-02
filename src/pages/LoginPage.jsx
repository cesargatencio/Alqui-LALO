import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Agrega useNavigate
import "./LoginPage.css";
import AuthService from "../services/AuthSingleton";

const authService = AuthService.getInstance();

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
      const user = await authService.loginWithEmail(formData.correo, formData.password);
      const userData = await authService.getUserData(user.uid);

      if (userData) {
        localStorage.setItem("usuario", JSON.stringify({ uid: user.uid, ...userData }));
      } else {
        localStorage.setItem("usuario", JSON.stringify({ uid: user.uid, correo: user.email }));
      }

      setSuccessMessage("Sesión iniciada correctamente.");
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setError("Las credenciales no coinciden. Intenta de nuevo.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await authService.loginWithGoogle();
      const userData = await authService.getUserData(user.uid);

      if (userData) {
        localStorage.setItem("usuario", JSON.stringify({ uid: user.uid, ...userData }));
      } else {
        localStorage.setItem("usuario", JSON.stringify({
          uid: user.uid,
          displayName: user.displayName,
          correo: user.email,
          telefono: user.phoneNumber
        }));
      }
      navigate("/");
    } catch (error) {
      alert("Error con Google: " + error.message);
    }
  };

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario) {
    console.log(usuario.fechaNacimiento); // Fecha de nacimiento
    console.log(usuario.telefono);        // Teléfono
}

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
              placeholder="ejemplo@correo.unimet.edu.ve"
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
