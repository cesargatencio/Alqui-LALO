import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaGlobe,
  FaDollarSign,
  FaLink,
} from "react-icons/fa";
import './FAQAndCTA.css';

const FAQAndCTA = () => {
  return (
    <footer>
      <div className="footer-top">
        <div className="footer-logo">
          <img src="/img/img7.jpg" alt="Logo AlquiLALO" />
        </div>

        <div className="footer-contact">
          <h1>Contactos:</h1>
          <div className="contact-info">
            <p>Teléfono: +58 414-7391967</p>
            <p>Correo Electrónico: unimet@unimet.edu.ve</p>
          </div>
        </div>

        <div className="footer-location">
          <h2>Ubicación:</h2>
          <p>
            Distribuidor metropolitano, Blvr. de Sabana Grande, Caracas 1060,
            Miranda
          </p>
          <iframe
            title="Ubicación AlquilALO"
            src="https://www.google.com/maps?q=Distribuidor+metropolitano,+Blvr.+de+Sabana+Grande,+Caracas+1060,+Miranda,+Venezuela&output=embed"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>

      {/* Parte inferior (blanca) */}
      <div className="footer-bottom">
        <p>© 2025 Alquilalo, Inc.</p>

        <div className="footer-links">
          <a href="#">Privacidad</a>・
          <a href="#">Términos</a>・
          <a href="#">Sitemap</a>
        </div>

        <div className="footer-extras">
          <span><FaGlobe /> ESP</span>
          <span><FaDollarSign /> USD</span>
          <span><FaFacebookF /></span>
          <span><FaTwitter /></span>
          <span><FaInstagram /></span>
        </div>
      </div>
    </footer>
  );
};

export default FAQAndCTA;