import { db } from "../firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

const espaciosCol = collection(db, "espacios");

/**
 * Busca espacios según filtros básicos (capacidadMin, capacidadMax, precioMax)
 * @param {Object} filtros - { capacidadMin, capacidadMax, precioMax }
 */
export async function buscarEspacios(filtros = {}) {
  if (!filtros || Object.values(filtros).every((v) => !v)) {
    const snap = await getDocs(espaciosCol);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }

  let q = espaciosCol;
  const constraints = [];

  if (filtros.capacidadMin) {
    constraints.push(where("capacidad", ">=", Number(filtros.capacidadMin)));
  }
  if (filtros.capacidadMax) {
    constraints.push(where("capacidad", "<=", Number(filtros.capacidadMax)));
  }
  if (filtros.precioMax) {
    constraints.push(where("precioHora", "<=", Number(filtros.precioMax))); // ← Usa un campo número
  }

  q = query(espaciosCol, ...constraints);

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
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
  const docRef = await addDoc(espaciosCol, espacio);
  return docRef.id;
}


