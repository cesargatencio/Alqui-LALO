import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthSingleton";
import { getUserImageUrl } from "../../services/SupabaseService";
import "./Header.css";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    const unsubscribe = AuthService.getInstance().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Este efecto se dispara cada vez que cambias de ruta
  useEffect(() => {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
    if (usuarioLocal?.fotoPerfilPath) {
      setAvatarUrl(getUserImageUrl(usuarioLocal.fotoPerfilPath));
    } else if (usuarioLocal?.fotoPerfil) {
      setAvatarUrl(usuarioLocal.fotoPerfil);
    } else {
      setAvatarUrl(null);
    }
  }, [location]);

  const handleLogout = async () => {
    await AuthService.getInstance().logout();
    navigate("/");
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/" || location.pathname === "/index.html") {
      const contactSection = document.getElementById("contact-section");
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/?scrollToContact=true");
    }
  };

  const isAdmin = user && AuthService.isAdmin(user);

  return (
    <header className="header">
      <div className="logo" style={{cursor: "pointer"}} onClick={() => navigate("/")}>AlquiLALO</div>
      <nav className="nav">
        <Link to="/">Inicio</Link>
        <Link to="/catalogo">Catálogo</Link>
        <a href="/#contact-section" onClick={handleContactClick}>Contacto</a>
        {user && (
          <Link to="/mis-reservas">
            Reservas
          </Link>
        )}
        {isAdmin && (
          <Link to="/reportes">Reportes</Link>
        )}
      </nav>
      <div className="auth-buttons">
        {!isAuthPage && (user ? (
          <>
            <Link
              to="/modificarusuario"
              className="user-circle-btn"
              title="Modificar usuario"
              style={{ padding: 0, border: "none", background: "white" }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    display: "block"
                  }}
                />
              ) : (
                user.displayName
                  ? user.displayName.charAt(0).toUpperCase()
                  : (user.email ? user.email.charAt(0).toUpperCase() : "U")
              )}
            </Link>
            <button className="login-btn" onClick={handleLogout}>
              Cerrar Sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Iniciar Sesión
          </Link>
        ))}
      </div>
    </header>
  );
};

export default Header;