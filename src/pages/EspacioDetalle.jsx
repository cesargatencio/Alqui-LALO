import React from "react";
import { useParams } from "react-router-dom";
import data from "../data/espacios.json";
import "./EspacioDetalle.css";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const EspacioDetalle = () => {
    const { id } = useParams();
    const espacio = data.find(e => e.id === parseInt(id));
    
    // Fechas ocupadas (ejemplo)
    const fechasOcupadas = [
        new Date(2025, 6, 2), // Enero empieza en 0
        new Date(2025, 6, 3), 
        new Date(2025, 6, 4)  
    ].map(date => {
        // Normalizamos las fechas (quitamos horas, minutos, segundos)
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0);
        return newDate;
    });

    // Función para verificar si una fecha está ocupada
    const isFechaOcupada = (date) => {
        const dateToCheck = new Date(date);
        dateToCheck.setHours(0, 0, 0, 0);
        
        return fechasOcupadas.some(
            fecha => fecha.getTime() === dateToCheck.getTime()
        );
    };

    if (!espacio) return <p>Espacio no encontrado</p>;


  return (
    <div className="espacio-detalle">
        <div className="espacio-header">
            <div className="espacio-imagen">
                <img src={espacio.imagen} alt={espacio.nombre} />
            </div>
            <div className="espacio-detalles">
                <h2>{espacio.nombre}</h2>
                <p><strong>Espacio:</strong> {espacio.capacidad}</p>
                <p><strong>Descripción:</strong> {espacio.descripcion}</p>
                <p className="precio"><strong>Precio:</strong> {espacio.precio}</p>
                <button className="btn-alquilar">ALQUILAR</button>
            </div>
        </div>

        <div className="espacio-extra">
            <div className="extra-box">
                <h3>Calendario de disponibilidad</h3>
                <Calendar
                    tileDisabled={({ date, view }) => {
                        if (view !== 'month') return false;
                        return isFechaOcupada(date);
                    }}
                    tileClassName={({ date }) => {
                        return isFechaOcupada(date) ? 'fecha-ocupada' : null;
                    }}
                    minDate={new Date()}
                    className="calendario-reserva"
                />
                <div className="leyenda-calendario">
                    <div className="leyenda-item">
                        <span className="leyenda-color fecha-libre"></span>
                        <span>Disponible</span>
                    </div>
                    <div className="leyenda-item">
                        <span className="leyenda-color fecha-ocupada"></span>
                        <span>Ocupado</span>
                    </div>
                </div>
            </div>
            <div className="extra-box">
                <h3>Valóranos</h3>
                <div className="estrellas">⭐⭐⭐⭐☆</div>
                <textarea placeholder="Escríbenos acá tu reseña..." />
            </div>
        </div>

        <div className="espacio-eventos">
            <h3>Eventos:</h3>
            <ul>
            <li>No hay eventos programados aún.</li>
            </ul>
        </div>
    </div>

  );
};

export default EspacioDetalle;
