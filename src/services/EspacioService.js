import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const espaciosCol = collection(db, "espacios");

/**
 * Busca espacios según filtros básicos (capacidadMin, capacidadMax, precioMax)
 * @param {Object} filtros - { capacidadMin, capacidadMax, precioMax }
 */

export async function buscarEspacios(filtros = {}) {
  // Si no hay filtros, devuelve todo
  if (!filtros || Object.values(filtros).every(v => !v)) {
    const snap = await getDocs(collection(db, "espacios"));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  // Construimos sólo los constraints de capacidad (rangos en mismo campo)
  const constraints = [];
  if (filtros.capacidadMin) {
    constraints.push(
      where("capacidad", ">=", Number(filtros.capacidadMin))
    );
  }
  if (filtros.capacidadMax) {
    constraints.push(
      where("capacidad", "<=", Number(filtros.capacidadMax))
    );
  }

  // Disparamos la consulta a Firestore con sólo filtros sobre 'capacidad'
  const q = query(collection(db, "espacios"), ...constraints);
  const snap = await getDocs(q);
  let resultados = snap.docs.map(d => ({ id: d.id, ...d.data() }));

  // Luego, en JS, aplicamos el filtro extra de precioHora
  if (filtros.precioMax) {
    const max = Number(filtros.precioMax);
    resultados = resultados.filter(e => e.precioHora <= max);
  }

  // (Si además tienes categoría:)
  if (filtros.categoria) {
    resultados = resultados.filter(e => e.categoria === filtros.categoria);
  }

  return resultados;
}


/**
 * Obtiene espacios disponibles en una fecha y según filtros
 * @param {Object} filtros - { fecha, capacidadMin, capacidadMax, precioMax }
 */
export async function espaciosDisponibles(filtros) {
  const { fecha, ...rest } = filtros;
  const todos = await buscarEspacios(rest);
  const disponibles = [];

  for (let espacio of todos) {
    const reservasQ = query(
      collection(db, "reservas"),
      where("espacioId", "==", espacio.id),
      where("fecha", "==", fecha)
    );
    const snap = await getDocs(reservasQ);
    if (snap.empty) {
      disponibles.push(espacio);
    }
  }

  return disponibles;
}

/**
 * Agrega un nuevo espacio a la colección "espacios"
 * @param {Object} espacio
 */
export async function addEspacio(espacio) {
  const espacioParaGuardar = {
    nombre:      espacio.nombre,
    descripcion: espacio.descripcion,
    capacidad:   parseInt(espacio.capacidad, 10),
    precio:    espacio.precio, // Aquí tomo espacio.precio en vez de espacio.precioHora
    // Aquí tomo espacio.precio en vez de espacio.precioHora
    precioHora:  parseInt(espacio.precio, 10),
    categoria:   espacio.categoria, // Asegúrate de que este campo exista en el objeto espacio
    imagen:      espacio.imagen,
    imagenPath:  espacio.imagenPath,
  };

  const docRef = await addDoc(espaciosCol, espacioParaGuardar);
  return docRef.id;
}


