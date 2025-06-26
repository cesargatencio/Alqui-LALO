import React from "react";
import { FaUsers, FaBuilding, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import "./Features.css";

const Features = () => {
  const features = [
    {
      icon: <FaUsers size={40} />,
      value: "30,000+",
      label: "miembros de la comunidad unimetaria"
    },
    {
      icon: <FaBuilding size={40} />,
      value: "365",
      label: "Instalaciones disponibles todo el año"
    },
    {
      icon: <FaCalendarAlt size={40} />,
      value: "40+",
      label: "Anexos para todo tipo de evento"
    },
    {
      icon: <FaChartLine size={40} />,
      value: "77%",
      label: "Capacidad de Salón"
    }
  ];

  return (
    <section className="features-section" data-aos="fade-up">
      <div className="features-container">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-content">
              <h3 className="feature-value">{feature.value}</h3>
              <p className="feature-label">{feature.label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;