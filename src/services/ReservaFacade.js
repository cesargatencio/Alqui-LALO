import { db } from "../firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

class ReservaService {
  static instance = null;

  static getInstance() {
    if (!ReservaService.instance) {
      ReservaService.instance = new ReservaService();
    }
    return ReservaService.instance;
  }

  async crearReserva({ espacioId, usuarioId, fecha, hora, monto, detalles }) {
    const reservaId = `${espacioId}_${fecha}_${hora}`;
    const reservaRef = doc(db, "reservas", reservaId);

    await setDoc(reservaRef, {
      id: reservaId,
      espacioId,
      usuarioId,
      fecha,
      hora,
      monto,
      detalles: {
        ...detalles,
        imagenEspacio: detalles.imagenEspacio,
      },
      estado: "pendiente_pago",
      creadaEn: new Date(),
      fechaReserva: new Date(), // Para reportes
    });
  }

  async confirmarPago(reservaId, detallesPago) {
    const reservaRef = doc(db, "reservas", reservaId);
    await updateDoc(reservaRef, {
      estado: "pagada",
      detallesPago,
      fechaPago: new Date(),
    });
  }

  async obtenerReservasPorUsuario(usuarioId) {
    const reservasRef = collection(db, "reservas");
    const q = query(reservasRef, where("usuarioId", "==", usuarioId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async cancelarReserva(reservaId, motivoCancelacion = "No especificado") {
    const reservaRef = doc(db, "reservas", reservaId);
    await updateDoc(reservaRef, {
      estado: "cancelada",
      motivoCancelacion,
      fechaCancelacion: new Date(),
    });
  }

  // Método para obtener todas las reservas (para reportes)
  async obtenerTodasLasReservas() {
    try {
      const reservasRef = collection(db, "reservas");
      const querySnapshot = await getDocs(reservasRef);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error al obtener todas las reservas:", error);
      return [];
    }
  }

  // Método para obtener reservas filtradas por estado
  async obtenerReservasPorEstado(estado) {
    try {
      const reservasRef = collection(db, "reservas");
      const q = query(reservasRef, where("estado", "==", estado));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error(`Error al obtener reservas con estado ${estado}:`, error);
      return [];
    }
  }

  // Método para obtener reservas en un rango de fechas
  async obtenerReservasEnRango(fechaInicio, fechaFin) {
    try {
      const reservasRef = collection(db, "reservas");
      const querySnapshot = await getDocs(reservasRef);

      return querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((reserva) => {
          let fechaReserva = null;

          if (reserva.fechaReserva) {
            if (reserva.fechaReserva.toDate) {
              fechaReserva = reserva.fechaReserva.toDate();
            } else if (reserva.fechaReserva instanceof Date) {
              fechaReserva = reserva.fechaReserva;
            } else {
              fechaReserva = new Date(reserva.fechaReserva);
            }
          } else if (reserva.creadaEn) {
            if (reserva.creadaEn.toDate) {
              fechaReserva = reserva.creadaEn.toDate();
            } else {
              fechaReserva = new Date(reserva.creadaEn);
            }
          }

          if (!fechaReserva || isNaN(fechaReserva.getTime())) return false;

          return fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
        });
    } catch (error) {
      console.error("Error al obtener reservas en rango:", error);
      return [];
    }
  }
}

export default ReservaService;
