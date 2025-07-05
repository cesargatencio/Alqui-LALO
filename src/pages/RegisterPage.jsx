import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";
import React, { useState } from "react";
import { db, auth } from "../firebase";
import { setDoc, doc } from "firebase/firestore";
import AuthService from "../services/AuthSingleton";

const RegisterPage = () => {
  const navigate = useNavigate();
  const emailInputRef = React.useRef(null);
  const formRef = React.useRef(null); // Agrega esta referencia

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    correo: "",
    password: "",
    confirmPassword: "",
    telefono: "" // <-- agrega esto
  });

  const [emailError, setEmailError] = useState(""); // Nuevo estado para error de email
  const [successMessage, setSuccessMessage] = useState(""); // Nuevo estado para éxito

  const authService = AuthService.getInstance();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setSuccessMessage("");

    // 1. Validar campos vacíos
    const camposObligatorios = [
      "nombre",
      "apellido",
      "fechaNacimiento",
      "correo",
      "password",
      "confirmPassword",
      "telefono"
    ];
    const hayVacios = camposObligatorios.some(campo => !formData[campo]);
    if (hayVacios) {
      if (formRef.current) {
        Array.from(formRef.current.elements).forEach(el => {
          if (el.tagName === "INPUT" && !el.value) {
            el.classList.add("input-error");
            el.reportValidity();
          }
        });
      }
      return;
    }

    // 1.1 Validar longitud mínima de la contraseña
    if (formData.password.length < 6) {
      setEmailError("La contraseña debe tener al menos 6 caracteres.");
      if (formRef.current) {
        const passInput = Array.from(formRef.current.elements).find(el => el.name === "password");
        if (passInput) {
          passInput.classList.add("input-error");
          passInput.setCustomValidity("La contraseña debe tener al menos 6 caracteres.");
          passInput.reportValidity();
        }
      }
      return;
    }

    // 2. Validar dominio de correo solo si hay texto
    if (
      formData.correo &&
      !formData.correo.endsWith("@correo.unimet.edu.ve")
    ) {
      setEmailError("Solo se permiten correos @correo.unimet.edu.ve");
      if (emailInputRef.current) {
        emailInputRef.current.setCustomValidity("Solo se permiten correos @correo.unimet.edu.ve");
        emailInputRef.current.reportValidity();
      }
      return;
    } else {
      if (emailInputRef.current) {
        emailInputRef.current.setCustomValidity("");
      }
    }

    // 3. Validar contraseñas
    if (formData.password !== formData.confirmPassword) {
      setEmailError("Las contraseñas no coinciden");
      return;
    }

    try {
      // 1. Registrar usuario en Firebase Auth usando el singleton
      const user = await authService.registerWithEmail(
        formData.correo,
        formData.password
      );

      // 2. Guardar datos adicionales en Firestore usando el singleton
      const usuarioCompleto = {
        uid: user.uid,
        nombre: formData.nombre,
        apellido: formData.apellido,
        fechaNacimiento: formData.fechaNacimiento,
        correo: formData.correo,
        telefono: formData.telefono,
      };
      await authService.saveUserData(user.uid, usuarioCompleto);

      setSuccessMessage("Registro exitoso, redireccionando a pantalla de inicio...");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      setEmailError("Error en el registro: " + error.message);
    }
  };

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario) {
    console.log(usuario.fechaNacimiento); // Fecha de nacimiento
    console.log(usuario.telefono);        // Teléfono
  }

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>Regístrate</h1>
        
        <div className="social-register">
          <p>Regístrate usando Google:</p>
          {/* Botón de Google (opcional) */}
          <button className="google-button">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" />
            Continuar con Google
          </button>
        </div>

        <div className="divider">
          <span>o</span>
        </div>

        <form
          className="register-form"
          onSubmit={handleSubmit}
          noValidate
          ref={formRef}
        >
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Juan"
              required
              onInvalid={e => e.target.classList.add("input-error")}
              onInput={e => e.target.classList.remove("input-error")}
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input 
              type="text" 
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Ej: Pérez" 
              required 
              onInvalid={e => e.target.classList.add("input-error")}
              onInput={e => e.target.classList.remove("input-error")}
            />
          </div>

          <div className="form-group">
            <label>Fecha de nacimiento</label>
            <input 
              type="date" 
              name="fechaNacimiento"
              value={formData.fechaNacimiento}
              onChange={handleChange}
              required 
              onInvalid={e => e.target.classList.add("input-error")}
              onInput={e => e.target.classList.remove("input-error")}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={e => {
                handleChange(e);
                setEmailError("");
              }}
              placeholder="ejemplo@correo.unimet.edu.ve"
              required
              ref={emailInputRef}
              onInvalid={e => {
                // Si el campo está vacío, muestra el mensaje nativo
                if (!e.target.value) {
                  e.target.setCustomValidity(""); // mensaje nativo
                } else if (!e.target.value.endsWith("@correo.unimet.edu.ve")) {
                  e.target.setCustomValidity("Solo se permiten correos @correo.unimet.edu.ve");
                }
                e.target.classList.add("input-error");
              }}
              onInput={e => {
                e.target.setCustomValidity(""); // LIMPIA SIEMPRE PRIMERO
                e.target.classList.remove("input-error");
              }}
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

          <div className="form-group">
            <label>Confirmar contraseña</label>
            <input 
              type="password" 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••" 
              required 
              onInvalid={e => e.target.classList.add("input-error")}
              onInput={e => e.target.classList.remove("input-error")}
            />
          </div>

          <div className="form-group">
            <label>Teléfono</label>
            <input 
              type="tel" 
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej: 0414-1234567" 
              required 
              onInvalid={e => e.target.classList.add("input-error")}
              onInput={e => e.target.classList.remove("input-error")}
            />
          </div>

          <button type="submit" className="register-button">
            Registrarse
          </button>

          {successMessage && (
            <div className="success-message">{successMessage}</div>
          )}
        </form>

        <div className="login-prompt">
          <p>¿Ya tienes cuenta? Dale al siguiente botón.</p>
          <Link to="/login" className="login-link">
            Inicio de sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
