// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../firebase";  // asume que exportas tu instancia de auth ahí

const ProtectedRoute = ({ children }) => {
  // Si no hay usuario logueado, redirige a /login
  if (!auth.currentUser) {
    return <Navigate to="/login" replace />;
  }
  // Si está autenticado, renderiza los hijos
  return children;
};

export default ProtectedRoute;
