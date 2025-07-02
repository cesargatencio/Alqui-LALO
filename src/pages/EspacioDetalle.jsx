import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import data from "../data/espacios.json";
import "./EspacioDetalle.css";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import AuthService from "../services/AuthSingleton";

const EspacioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const espacio = data.find((e) => e.id === parseInt(id));

  // Dado un número promedio (puede tener decimal), retorna un array de iconos
  const renderEstrellasPromedio = (promedio) => {
    const fullStars = Math.floor(promedio);
    const hasHalfStar = promedio - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return [
        ...Array(fullStars).fill("full"),
        ...(hasHalfStar ? ["half"] : []),
        ...Array(emptyStars).fill("empty"),
    ].map((type, i) => {
        if (type === "full") return <FaStar key={i} className="star prom-full" />;
        if (type === "half") return <FaStarHalfAlt key={i} className="star prom-half" />;
        return <FaRegStar key={i} className="star prom-empty" />;
    });
  };


  const fechasOcupadas = [
    new Date(2025, 6, 2),
    new Date(2025, 6, 3),
    new Date(2025, 6, 4),
  ].map((date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  });

  const isFechaOcupada = (date) => {
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0);
    return fechasOcupadas.some(
      (fecha) => fecha.getTime() === dateToCheck.getTime()
    );
  };

  const storageKey = `reseñas_espacio_${espacio?.id}`;
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");
  const [reseñas, setReseñas] = useState(() => {
    const guardadas = localStorage.getItem(storageKey);
    return guardadas ? JSON.parse(guardadas) : [];
  });
  const [verTodas, setVerTodas] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [duracionSeleccionada, setDuracionSeleccionada] = useState("");
  const [editando, setEditando] = useState(false);
  const [espacioEditado, setEspacioEditado] = useState({ ...espacio });
  const usuario = AuthService.getInstance().getCurrentUser();
  const isAdmin = AuthService.isAdmin(usuario);

  const enviarReseña = async () => {
    if (rating === 0 || comentario.trim() === "") {
      alert("Por favor selecciona una calificación y escribe tu reseña.");
      return;
    }

    const nueva = {
      id: Date.now(),
      estrellas: rating,
      texto: comentario,
    };

    const nuevasReseñas = [nueva, ...reseñas];
    setReseñas(nuevasReseñas);
    localStorage.setItem(storageKey, JSON.stringify(nuevasReseñas));

    // --- Guardar en Firestore ---
    try {
      const docRef = doc(db, "reseñas", String(espacio.id));
      // Intenta obtener las reseñas actuales
      const docSnap = await getDoc(docRef);
      let firestoreReseñas = [];
      if (docSnap.exists()) {
        firestoreReseñas = docSnap.data().reseñas || [];
      }
      // Agrega la nueva reseña al principio
      const actualizadas = [nueva, ...firestoreReseñas];
      await setDoc(docRef, { reseñas: actualizadas });
    } catch (error) {
      alert("Error al guardar la reseña en Firestore: " + error.message);
    }

    setRating(0);
    setHover(0);
    setComentario("");
  };

  const obtenerPromedio = () => {
    if (reseñas.length === 0) return 0;
    const total = reseñas.reduce((sum, r) => sum + r.estrellas, 0);
    return (total / reseñas.length).toFixed(1);
  };

  const mostrarEstrellas = (valor) => {
    const llenas = "★".repeat(Math.floor(valor));
    const vacías = "☆".repeat(5 - Math.floor(valor));
    return llenas + vacías;
  };

  const handleGuardarCambios = async (e) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "espacios", String(espacio.id));
      await updateDoc(docRef, espacioEditado);
      alert("Espacio actualizado correctamente");
      setEditando(false);
      // Opcional: recarga los datos o navega
    } catch (error) {
      alert("Error al actualizar el espacio: " + error.message);
    }
  };
  
  useEffect(() => {
    const cargarReseñas = async () => {
      try {
        const docRef = doc(db, "reseñas", String(espacio.id));
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const firestoreReseñas = docSnap.data().reseñas || [];
          setReseñas(firestoreReseñas);
          localStorage.setItem(storageKey, JSON.stringify(firestoreReseñas));
        }
      } catch (error) {
        // Si falla, sigue usando localStorage
      }
    };
    if (espacio?.id) {
      cargarReseñas();
    }
    // eslint-disable-next-line
  }, [espacio?.id]);

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
        </div>
      </div>
    
      <div className="espacio-extra">
        <div className="extra-box">
          <h3>Calendario de disponibilidad</h3>
          <Calendar
            tileDisabled={({ date, view }) => {
              if (view !== "month") return false;
              return isFechaOcupada(date);
            }}
            tileClassName={({ date }) => {
              return isFechaOcupada(date) ? "fecha-ocupada" : null;
            }}
            minDate={new Date()}
            className="calendario-reserva"
            onClickDay={(date) => setFechaSeleccionada(date)}
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

          <div className="promedio-container">
            <span className="promedio-text">{obtenerPromedio()}</span>
            <span className="promedio-stars">
                {renderEstrellasPromedio(parseFloat(obtenerPromedio()))}
            </span>
          </div>


          <div className="estrellas">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                style={{
                  cursor: "pointer",
                  color: (hover || rating) >= star ? "#ffbb00" : "#ccc",
                  fontSize: "1.8rem",
                }}
              >
                ★
              </span>
            ))}
          </div>

          <textarea
            placeholder="Escríbenos acá tu reseña..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
          />

          <button className="btn-alquilar" onClick={enviarReseña}>
            Enviar Reseña
          </button>

          {reseñas.length > 0 && (
            <div className="historial-reseñas">
              <h4 style={{ marginTop: "1rem" }}>Reseñas:</h4>
              <ul>
                {(verTodas ? reseñas : reseñas.slice(0, 3)).map((r) => (
                  <li key={r.id} style={{ margin: "0.5rem 0" }}>
                    <span style={{ color: "#ffbb00" }}>
                      {mostrarEstrellas(r.estrellas)}
                    </span>
                    <br />
                    <span style={{ fontSize: "0.95rem", color: "#333" }}>{r.texto}</span>
                  </li>
                ))}
              </ul>
              {reseñas.length > 3 && (
                <button
                  className="btn-alquilar"
                  onClick={() => setVerTodas(!verTodas)}
                  style={{ marginTop: "0.8rem", padding: "0.4rem 1rem", fontSize: "0.9rem" }}
                >
                  {verTodas ? "Ver menos" : "Ver todas"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="espacio-eventos">
        <h3>Eventos:</h3>
        <ul>
          <li>No hay eventos programados aún.</li>
        </ul>
      </div>

      <div className="reserva-seccion">
        <h3>Realiza tu reserva</h3>

        <div className="reserva-form">
          <select
            value={horaSeleccionada}
            onChange={e => setHoraSeleccionada(e.target.value)}
          >
            <option value="">Selecciona hora</option>
            <option value="08:00">08:00</option>
            <option value="10:00">10:00</option>
            <option value="12:00">12:00</option>
            <option value="14:00">14:00</option>
            <option value="16:00">16:00</option>
          </select>

          <select
            value={duracionSeleccionada}
            onChange={e => setDuracionSeleccionada(e.target.value)}
          >
            <option value="">Duración</option>
            <option value="45 minutos">45 minutos</option>
            <option value="1 hora 30 min">1 hora 30 min</option>
            <option value="2 horas">2 horas</option>
            <option value="3 horas">3 horas</option>
            <option value="6 horas">6 horas</option>
            <option value="12 horas">12 horas</option>
            <option value="24 horas">24 horas</option>
          </select>

          <Link
            to="/confirmar-reserva"
            state={{
              espacio: {
                id: espacio.id,
                nombre: espacio.nombre,
                precio: espacio.precio,
                // agrega solo lo necesario
              },
              fecha: fechaSeleccionada ? fechaSeleccionada.toISOString() : "",
              hora: horaSeleccionada,
              duracion: duracionSeleccionada,
              usuario: usuario ? { email: usuario.email, uid: usuario.uid } : null,
            }}
            className="btn-alquilar"
          >
            ALQUILAR
          </Link>
        </div>
      </div>

      {/* Botón de editar SOLO para admin, al fondo de la página */}
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
          {!editando ? (
            <button
              className="btn-editar-espacio"
              onClick={() => setEditando(true)}
            >
              Editar Espacio
            </button>
          ) : (
            <form onSubmit={handleGuardarCambios} style={{ display: "flex", gap: "1rem" }}>
              <input
                type="text"
                value={espacioEditado.nombre}
                onChange={e => setEspacioEditado({ ...espacioEditado, nombre: e.target.value })}
              />
              {/* Repite para los demás campos */}
              <button type="submit">Guardar Cambios</button>
              <button type="button" onClick={() => setEditando(false)}>Cancelar</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
};

export default EspacioDetalle;
