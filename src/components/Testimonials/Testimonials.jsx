import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Testimonials.css";

const testimonials = [
  {
    name: "María G.",
    feedback:
      "AlquiLALO facilitó mi evento sin complicaciones. ¡Volveré a usarlo!",
  },
  {
    name: "Luis P.",
    feedback:
      "Reservar un espacio nunca fue tan rápido y seguro. Excelente plataforma.",
  },
  {
    name: "Ana R.",
    feedback: "Me encantó la interfaz. Muy intuitiva y práctica.",
  },
  {
    name: "Carlos M.",
    feedback: "Logré alquilar en minutos. Todo perfecto.",
  },
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
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
    <section className="testimonials-section" data-aos="fade-up">
      <h2 className="section-title">Testimonios</h2>
      <Slider {...settings}>
        {testimonials.map((t, index) => (
          <div key={index} className="testimonial-card">
            <p className="testimonial-text">“{t.feedback}”</p>
            <p className="testimonial-author">— {t.name}</p>
          </div>
        ))}
      </Slider>
    </section>
  );
};

export default Testimonials;
