import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Calendar from "react-calendar";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import AuthService from "../services/AuthSingleton";
import "./EspacioDetalle.css";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

// --- Helpers y constantes fuera del componente ---
const fechasOcupadas = [
  new Date(2025, 6, 2),
  new Date(2025, 6, 3),
  new Date(2025, 6, 4),
].map((d) => {
  const d2 = new Date(d);
  d2.setHours(0, 0, 0, 0);
  return d2;
});
const isFechaOcupada = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return fechasOcupadas.some((f) => f.getTime() === d.getTime());
};
function renderEstrellasPromedio(promedio) {
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
}
function ImagenEspacio({ src, alt }) {
  if (!src) {
    return (
      <div
        className="imagen-placeholder"
        style={{
          width: 220,
          height: 220,
          borderRadius: "1rem",
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#888",
          fontSize: "1.2rem",
        }}
      >
        Sin imagen
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: 220, height: 220, objectFit: "cover", borderRadius: "1rem" }}
    />
  );
}
function EditarEspacio({ espacio, onSave, onCancel }) {
  const [data, setData] = useState({
    nombre: espacio.nombre || "",
    descripcion: espacio.descripcion || "",
    capacidad: espacio.capacidad || "",
    precio: espacio.precio || "",
    imagen: espacio.imagen || "",
    id: espacio.id,
  });
  return (
    <form onSubmit={e => { e.preventDefault(); onSave(data); }} style={{ display: "flex", gap: "1rem" }}>
      <input
        type="text"
        value={data.nombre}
        onChange={e => setData({ ...data, nombre: e.target.value })}
        placeholder="Nombre"
      />
      <input
        type="text"
        value={data.descripcion}
        onChange={e => setData({ ...data, descripcion: e.target.value })}
        placeholder="Descripción"
      />
      <input
        type="number"
        value={data.capacidad}
        onChange={e => setData({ ...data, capacidad: e.target.value })}
        placeholder="Capacidad"
      />
      <input
        type="number"
        value={data.precio}
        onChange={e => setData({ ...data, precio: e.target.value })}
        placeholder="Precio"
      />
      <button type="submit">Guardar Cambios</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}

const EspacioDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estado principal
  const [espacio, setEspacio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [editando, setEditando] = useState(false);

  // Reseñas
  const [cargandoReseñas, setCargandoReseñas] = useState(true);
  const [reseñas, setReseñas] = useState([]);
  const [verTodas, setVerTodas] = useState(false);

  // Reserva y rating
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState("");
  const [duracionSeleccionada, setDuracionSeleccionada] = useState("");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comentario, setComentario] = useState("");

  const usuario = AuthService.getInstance().getCurrentUser();
  const isAdmin = AuthService.isAdmin(usuario);

  // Carga espacio desde Firestore
  useEffect(() => {
    setCargando(true);
    (async () => {
      try {
        const ref = doc(db, "espacios", id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setEspacio({ id, ...snap.data() });
        } else {
          setEspacio(null);
        }
      } catch (err) {
        setEspacio(null);
      } finally {
        setCargando(false);
      }
    })();
  }, [id]);

  // Carga reseñas desde Firestore
  const storageKey = useMemo(() => `reseñas_espacio_${espacio?.id}`, [espacio?.id]);
  useEffect(() => {
    if (!espacio) return;
    setCargandoReseñas(true);
    (async () => {
      try {
        const docRef = doc(db, "reseñas", String(espacio.id));
        const docSnap = await getDoc(docRef);
        const data = docSnap.exists() ? docSnap.data().reseñas || [] : [];
        setReseñas(data);
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        const fallback = JSON.parse(localStorage.getItem(storageKey) || "[]");
        setReseñas(fallback);
      } finally {
        setCargandoReseñas(false);
      }
    })();
  }, [espacio, storageKey]);

  // Memoiza promedio y estrellas
  const promedio = useMemo(() => {
    if (!reseñas.length) return 0;
    const total = reseñas.reduce((sum, r) => sum + r.estrellas, 0);
    return (total / reseñas.length).toFixed(1);
  }, [reseñas]);
  const estrellasJSX = useMemo(() => renderEstrellasPromedio(parseFloat(promedio)), [promedio]);

  // Enviar reseña
  const enviarReseña = useCallback(async () => {
    if (!espacio) return;
    if (rating === 0 || comentario.trim() === "") {
      alert("Por favor selecciona una calificación y escribe tu reseña.");
      return;
    }
    const nueva = { id: Date.now(), estrellas: rating, texto: comentario };
    const nuevasReseñas = [nueva, ...reseñas];
    setReseñas(nuevasReseñas);
    localStorage.setItem(storageKey, JSON.stringify(nuevasReseñas));
    try {
      const docRef = doc(db, "reseñas", String(espacio.id));
      const docSnap = await getDoc(docRef);
      let firestoreReseñas = [];
      if (docSnap.exists()) {
        firestoreReseñas = docSnap.data().reseñas || [];
      }
      const actualizadas = [nueva, ...firestoreReseñas];
      await setDoc(docRef, { reseñas: actualizadas });
    } catch (error) {
      alert("Error al guardar la reseña en Firestore: " + error.message);
    }
    setRating(0);
    setHover(0);
    setComentario("");
  }, [espacio, rating, comentario, reseñas, storageKey]);

  // Guardar cambios de edición
  const handleGuardarCambios = async (data) => {
    try {
      const ref = doc(db, "espacios", id);
      await updateDoc(ref, data);
      alert("Espacio actualizado correctamente");
      setEditando(false);
      setEspacio({ ...espacio, ...data });
    } catch (error) {
      alert("Error al actualizar el espacio: " + error.message);
    }
  };

  // Early returns
  if (cargando) return <p>Cargando espacio...</p>;
  if (!espacio) return <p>Espacio no encontrado</p>;

  return (
    <div className="espacio-detalle">
      <div className="espacio-header">
        <div className="espacio-imagen">
          <ImagenEspacio src={espacio.imagen} alt={espacio.nombre} />
        </div>
        <div className="espacio-detalles">
          <h2>{espacio.nombre}</h2>
          <p><strong>Capacidad:</strong> {espacio.capacidad}</p>
          <p><strong>Descripción:</strong> {espacio.descripcion}</p>
          <p className="precio"><strong>Precio:</strong> {espacio.precio}</p>
        </div>
      </div>

      <div className="espacio-extra">
        <div className="extra-box">
          <h3>Calendario de disponibilidad</h3>
          <Calendar
            tileDisabled={({ date, view }) => view === "month" && isFechaOcupada(date)}
            tileClassName={({ date }) => isFechaOcupada(date) ? "fecha-ocupada" : null}
            minDate={new Date()}
            className="calendario-reserva"
            onClickDay={setFechaSeleccionada}
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
            <span className="promedio-text">{promedio}</span>
            <span className="promedio-stars">{estrellasJSX}</span>
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
          {!cargandoReseñas && reseñas.length === 0 && <p>No hay reseñas aún.</p>}
          {!cargandoReseñas && reseñas.length > 0 && (
            <div className="historial-reseñas">
              <h4 style={{ marginTop: "1rem" }}>Reseñas:</h4>
              <ul>
                {(verTodas ? reseñas : reseñas.slice(0, 3)).map((r) => (
                  <li key={r.id} style={{ margin: "0.5rem 0" }}>
                    <span style={{ color: "#ffbb00" }}>
                      {"★".repeat(r.estrellas) + "☆".repeat(5 - r.estrellas)}
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
                imagenURL: espacio.imagen // <- añade la URL pública aquí
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

      {/* Edición admin */}
      {isAdmin && !editando && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "2rem" }}>
          <button className="btn-editar-espacio" onClick={() => setEditando(true)}>
            Editar Espacio
          </button>
        </div>
      )}
      {isAdmin && editando && (
        <EditarEspacio
          espacio={espacio}
          onSave={handleGuardarCambios}
          onCancel={() => setEditando(false)}
        />
      )}
    </div>
  );
};

export default EspacioDetalle;
