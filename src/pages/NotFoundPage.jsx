import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";

const NotFoundPage = () => (
  <div className="notfound-container">
    <h1>404</h1>
    <p>Página no encontrada</p>
    <Link to="/">Volver al inicio</Link>
  </div>
);

export default NotFoundPage;
