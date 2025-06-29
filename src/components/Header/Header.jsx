import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("usuario");
    navigate("/");
  };

const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/" || location.pathname === "/index.html") {
      // Si ya estamos en la página de inicio, hacemos scroll directo
      const contactSection = document.getElementById("contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Si estamos en otra página, navegamos con parámetro para que LandingPage haga scroll
      navigate("/?scrollToContact=true");
    }
  };

  return (
    <header className="header">
      <div className="logo">AlquiLALO</div>
      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <a href="/#contact-section" onClick={handleContactClick}>Contacto</a>
      </nav>
      <div className="auth-buttons">
        {!isAuthPage && (
          user ? (
            <button className="login-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          ) : (
            <Link to="/login" className="login-btn">
              Iniciar Sesión
            </Link>
          )
        )}
      </div>
    </header>
  );
};

export default Header;