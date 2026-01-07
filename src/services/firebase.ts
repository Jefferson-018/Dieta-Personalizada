// src/services/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Suas chaves reais do projeto dieta-personalizada-app
const firebaseConfig = {
  apiKey: "AIzaSyCeVqsizLAMKR2MRXVZKmsYAwXhe8gQyWE",
  authDomain: "dieta-personalizada-app.firebaseapp.com",
  projectId: "dieta-personalizada-app",
  storageBucket: "dieta-personalizada-app.firebasestorage.app",
  messagingSenderId: "86885463298",
  appId: "1:86885463298:web:5aa2f56734fecb5fab7e1b"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta as ferramentas para usar no app
export const auth = getAuth(app); // Sistema de Login
export const db = getFirestore(app); // Banco de Dados