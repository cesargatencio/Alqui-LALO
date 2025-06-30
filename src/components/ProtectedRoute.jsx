// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";  // asume que exportas tu instancia de auth ahí

const adminEmails = [
  "cesar.atencio@unimet.edu.ve",
  "salvador@unimet.edu.ve",
  // agrega aquí más si lo necesitas
];

/**
 * @param {boolean} adminOnly — si true, restringe solo a admins
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = auth.currentUser;

  // 1) Si no hay sesión activa, redirige a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2) Si es ruta adminOnly y el email no está en la lista, redirige a home
  if (adminOnly && !adminEmails.includes(user.email)) {
    return <Navigate to="/" replace />;
  }

  // 3) En cualquier otro caso, renderiza al hijo
  return children;
};

export default ProtectedRoute;
