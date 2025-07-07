import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, updatePassword, EmailAuthProvider, linkWithCredential, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

class AuthService {
  static instance = null;

  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  static adminEmails = [
    "c.atencio@correo.unimet.edu.ve",
    "salvador@unimet.edu.ve",
    "jesus.angulo@correo.unimet.edu.ve",
    "an.flamez@correo.unimet.edu.ve",
    "f.martinez@correo.unimet.edu.ve",
    "jesus.delgado@correo.unimet.edu.ve"
  ];

  static isAdmin(user) {
    return user?.email && AuthService.adminEmails.includes(user.email);
  }

  getCurrentUser() {
    return auth.currentUser;
  }

  async loginWithEmail(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async loginWithGoogle() {
  const provider = new GoogleAuthProvider();

  // 1. Inicia el popup
  const result = await signInWithPopup(auth, provider);
  const user   = result.user;

  // 2. Comprueba el dominio
  const dominioOK = user.email?.toLowerCase().endsWith("@correo.unimet.edu.ve");

  if (!dominioOK) {
    // --- Deshace el login inmediatamente ---
    await auth.signOut();        // cierra sesión
    // (opcional) await user.delete();  // si NO quieres que quede en Firebase
    throw new Error(
      "Solo se permiten cuentas @correo.unimet.edu.ve"
    );
  }

  // 3. Todo bien
  return user;
}


  async updateUserData(uid, data) {
    const docRef = doc(db, "usuarios", uid);
    try {
      await updateDoc(docRef, data);
    } catch (error) {
      if (error.message.includes("No document to update")) {
        await setDoc(docRef, { uid, ...data });
      } else {
        throw error;
      }
    }
  }

  async getUserData(uid) {
    const docRef = doc(db, "usuarios", uid);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async updatePassword(user, newPassword) {
    await updatePassword(user, newPassword);
  }

  async linkPasswordProvider(user, password) {
    const alreadyLinked = user.providerData.some(p => p.providerId === "password");
    if (!alreadyLinked) {
      const credential = EmailAuthProvider.credential(user.email, password);
      await linkWithCredential(user, credential);
    }
  }

  async registerWithEmail(email, password) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  async saveUserData(uid, data) {
    await setDoc(doc(db, "usuarios", uid), data, { merge: true });
  }

  onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
  }

  async logout() {
    await auth.signOut();
  }
}

export default AuthService;