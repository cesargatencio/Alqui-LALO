import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Testimonials.css";

// Importa imágenes de perfil (debes añadirlas a tu carpeta assets)
import profile1 from "../../assets/profile1.jpg";
import profile2 from "../../assets/profile2.jpg";
import profile3 from "../../assets/profile3.jpg";
import profile4 from "../../assets/profile4.jpg";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Ana R.",
      role: "Profesora UNIMET",
      feedback: "Me encantó la interfaz. Muy mínima y práctica.",
      photo: profile4,
    },
    {
      name: "Carlos M.",
      role: "Organizador de Eventos",
      feedback: "Logré alquilar en minutos. Todo perfecto.",
      photo: profile2,
    },
    {
      name: "María G.",
      role: "Estudiante",
      feedback: "La plataforma es intuitiva y ahorra mucho tiempo.",
      photo: profile3,
    },
    {
      name: "Luis P.",
      role: "Administrador",
      feedback: "Excelente servicio de atención al cliente.",
      photo: profile1,
    },
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 1200,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="testimonials-section">
      <div className="testimonials-container">
        <h2>Testimonios</h2>

        <Slider {...settings} className="testimonials-slider">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <p className="testimonial-text">"{testimonial.feedback}"</p>
                <div className="testimonial-author">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="author-photo"
                  />
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p className="author-role">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
