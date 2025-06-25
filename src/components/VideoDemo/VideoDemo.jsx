import React from "react";
import "./VideoDemo.css";

const VideoDemo = () => {
  return (
    <section className="video-preview" data-aos="fade-up">
      <h2 className="section-title">Mira cómo funciona AlquiLALO</h2>
      <div className="video-container">
        <iframe
          src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
          title="Demo de AlquiLALO"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
};

export default VideoDemo;
