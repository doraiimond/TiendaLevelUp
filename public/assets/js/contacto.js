// contacto.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

// --- CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
    apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
    authDomain: "levelup-7269f.firebaseapp.com",
    projectId: "levelup-7269f",
    storageBucket: "levelup-7269f.appspot.com",
    messagingSenderId: "848936923886",
    appId: "1:848936923886:web:5d0ce18b515c62a4cbfe3a"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Obtener el formulario
const form = document.getElementById("formContacto");

// Registrar evento
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombres = document.getElementById("nombres").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const sujeto = document.getElementById("sujeto").value.trim();
    const mensaje = document.getElementById("mensaje").value.trim();
    const esHumano = document.getElementById("es-humano").checked;

    // Validación básica extra
    if (!esHumano) {
        alert("Debes confirmar que no eres un robot.");
        return;
    }

    try {
        await addDoc(collection(db, "contactos"), {
            nombres,
            correo,
            sujeto,
            mensaje,
            fecha: serverTimestamp()
        });

        alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");

        form.reset(); // limpiar el formulario

    } catch (error) {
        console.error("Error guardando el mensaje:", error);
        alert("Hubo un error al enviar el mensaje. Intenta nuevamente.");
    }
});
