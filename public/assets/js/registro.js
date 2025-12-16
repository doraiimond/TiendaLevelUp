
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
    authDomain: "levelup-7269f.firebaseapp.com",
    projectId: "levelup-7269f",
    storageBucket: "levelup-7269f.appspot.com", // ✅ corregido
    messagingSenderId: "420067821053",
    appId: "1:420067821053:web:ee83cc9a8ba7e86f88c594",
    measurementId: "G-JRZ3GS13XN"
  };
  

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// FORMULARIO
const form = document.getElementById("formUsuario");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const run = document.getElementById("run").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value.trim();
    const fecha = document.getElementById("fecha").value;

    console.log("Valores capturados:", run, nombre, correo, clave, fecha);

    try {
        const createdAt = new Date().toISOString();

        
        await addDoc(collection(db, "usuario"), {
            run,
            nombre,
            correo,
            clave,
            fecha,
            createdAt
        });

        mensaje.textContent = "Usuario registrado correctamente 🎉";
        mensaje.style.color = "green";

        // -------- DETECCIÓN DE ROL --------
        const correoLower = correo.toLowerCase();

        let rolUsuario = "cliente";
        let destino = "perfilCliente.html";

        if (correoLower.endsWith("@duoc.cl")) {
            rolUsuario = "admin";
            destino = "perfilAdmin.html";
        } else if (correoLower.endsWith("@vduoc.cl")) {
            rolUsuario = "vendedor";
            destino = "perfilVendedor.html";
        }

        // -------- GUARDAR SESIÓN --------
        const usuario = {
            nombre,
            correo,
            run,
            fecha,
            createdAt,
            rol: rolUsuario
        };

        localStorage.setItem("usuario", JSON.stringify(usuario));

        form.reset();
        window.location.href = destino;
        
    } catch (error) {
        console.error("Error al guardar:", error);
        mensaje.textContent = "Error al registrar ❌";
        mensaje.style.color = "red";
    }
});