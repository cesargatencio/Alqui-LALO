import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs
} from "firebase/firestore";

const espaciosCol = collection(db, "espacios");

/**
 * Busca espacios según filtros básicos (capacidad, tipo, ubicación)
 * @param {Object} filtros - { capacidad, tipo, ubicacion }
 */
export async function buscarEspacios(filtros = {}) {
  // Si no hay filtros, trae todo sin ordenar
  if (!filtros || Object.values(filtros).every(v => !v)) {
    const snap = await getDocs(espaciosCol);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  }

  let q = query(espaciosCol);

  if (filtros.capacidad) {
    q = query(q, where("capacidad", ">=", Number(filtros.capacidad)));
  }
  if (filtros.tipo) {
    q = query(q, where("tipo", "==", filtros.tipo));
  }
  if (filtros.ubicacion) {
    q = query(q, where("ubicacion", "==", filtros.ubicacion));
  }
  // Ordena solo si el campo existe en todos los docs, si no, comenta esta línea:
  // q = query(q, orderBy("precioHora", "asc"));

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Obtiene espacios disponibles en un rango de tiempo y según filtros
 * @param {Object} filtros - { desde, hasta, capacidad, tipo, ubicacion }
 */
export async function espaciosDisponibles(filtros) {
  const { desde, hasta, ...rest } = filtros;
  const todos = await buscarEspacios(rest);
  const disponibles = [];

  for (let espacio of todos) {
    const reservasQ = query(
      collection(db, "reservas"),
      where("espacioId", "==", espacio.id),
      where("desde", "<", filtros.hasta),
      where("hasta", ">", filtros.desde)
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
 * @param {Object} espacio - { nombre, descripcion, capacidad, precio, imagen, imagenPath }
 */
export async function addEspacio(espacio) {
  const espaciosCol = collection(db, "espacios");
  const docRef = await addDoc(espaciosCol, espacio);
  return docRef.id;
}
