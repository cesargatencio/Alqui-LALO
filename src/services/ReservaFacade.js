import { db } from "../firebase";
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

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
        imagenEspacio: detalles.imagenEspacio // asegúrate de que este valor esté pasando
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
    await setDoc(reservaRef, { estado: "cancelada" }, { merge: true });
  }
}

export default ReservaService;
