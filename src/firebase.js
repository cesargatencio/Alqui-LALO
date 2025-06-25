// client/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (usa tus claves reales aquí)
const firebaseConfig = {
  apiKey: "AIzaSyDP6COrjlIAvHpVZ85vXEYa-68MUzJIYZE",
  authDomain: "alquilalo-2d7b6.firebaseapp.com",
  projectId: "alquilalo-2d7b6",
  storageBucket: "alquilalo-2d7b6.appspot.com", // ojo, aquí era .app, cámbialo a .app**spot**.com
  messagingSenderId: "237979090594",
  appId: "1:237979090594:web:2ceeafd5dc8fa6378321fb"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { auth, db, googleProvider };
