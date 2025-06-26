import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Testimonials.css";


//Recomiendo poner las fotos importadas directmente o de la carpeta assets no usando una ruta absoluta como C:/Users/Thony/alquilalo-vite/src/assets/profile1.jpg por ejemplo que era lo que se tenia antes 
const Testimonials = () => {
  const testimonials = [
    {
      name: "Ana R.",
      role: "Profesora UNIMET",
      feedback: "Me encantó la interfaz. Muy mínima y práctica.",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b2ad?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Carlos M.",
      role: "Organizador de Eventos",
      feedback: "Logré alquilar en minutos. Todo perfecto.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "María G.",
      role: "Estudiante",
      feedback: "La plataforma es intuitiva y ahorra mucho tiempo.",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Luis P.",
      role: "Administrador",
      feedback: "Excelente servicio de atención al cliente.",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <h2>Lo que dicen nuestros usuarios</h2>
        <Slider {...settings}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <div className="testimonial-content">
                <img
                  src={testimonial.photo}
                  alt={testimonial.name}
                  className="testimonial-photo"
                />
                <p className="testimonial-feedback">"{testimonial.feedback}"</p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
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