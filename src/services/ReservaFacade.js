import { db } from "../firebase";
import { doc, setDoc, collection, query, where, getDocs, deleteDoc } from "firebase/firestore";

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
        imagenEspacio: detalles.imagenEspacio // ⚠️ NO CAMBIES EL NOMBRE
      },
      estado: "pendiente_pago",
      creadaEn: new Date()
    });
  }

  async confirmarPago(reservaId, detallesPago) {
    const reservaRef = doc(db, "reservas", reservaId);
    await setDoc(reservaRef, { estado: "pagada", detallesPago }, { merge: true });
  }

  async obtenerReservasPorUsuario(usuarioId) {
    const reservasRef = collection(db, "reservas");
    const q = query(reservasRef, where("usuarioId", "==", usuarioId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => doc.data());
  }

  async cancelarReserva(reservaId) {
    const reservaRef = doc(db, "reservas", reservaId);
    await deleteDoc(reservaRef);
  }

  /**
   * Retorna todas las reservas (pendiente_pago o pagada)
   * para un espacio dado.
   */
  async obtenerReservasPorEspacio(espacioId) {
    const reservasRef = collection(db, "reservas");
    // Solo pendientes o ya pagadas
    const q = query(
      reservasRef,
      where("espacioId", "==", espacioId),
      where("estado", "in", ["pendiente_pago", "pagada"])
    );
    const snap = await getDocs(q);
    // Devuelve array de datos
    return snap.docs.map((d) => d.data());
  }
}

export default ReservaService;
