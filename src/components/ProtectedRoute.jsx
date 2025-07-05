// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/AuthSingleton";

const adminEmails = [
  "cesar.atencio@unimet.edu.ve",
  "salvador@unimet.edu.ve",
  "jesusdelgado@unimet.edu.ve"
  // agrega aquí más si lo necesitas
];

/**
 * @param {boolean} adminOnly — si true, restringe solo a admins
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = AuthService.getInstance().getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !AuthService.isAdmin(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

export { adminEmails };
export function isAdmin(user) {
  return user?.email && adminEmails.includes(user.email);
}
