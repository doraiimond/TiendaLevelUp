// ../js/registro.js

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

    // Datos del formulario
    const run = document.getElementById("run").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const clave = document.getElementById("clave").value.trim();
    const fecha = document.getElementById("fecha").value;

    try {
        await addDoc(collection(db, "usuario"), {
            run,
            nombre,
            correo,
            clave,
            fecha,
            createdAt: new Date().toISOString()
        });
    
        mensaje.textContent = "Usuario registrado correctamente 🎉";
        mensaje.style.color = "green";
    
        // Guardar usuario en localStorage con rol
        let rolUsuario = "cliente"; // por defecto
        if (correo.toLowerCase() === "vendedor@duoc.cl") {
            rolUsuario = "vendedor";
        }
    
        const usuario = { nombre, correo, rol: rolUsuario };
        localStorage.setItem("usuario", JSON.stringify(usuario));
    
        form.reset();
    
        // Redirigir según rol
        if (rolUsuario === "vendedor") {
            setTimeout(() => {
                window.location.href = "perfilVendedor.html";
            }, 1000);
        } else {
            setTimeout(() => {
                window.location.href = "perfilCliente.html";
            }, 1000);
        }
    
    } catch (error) {
        console.error("Error al guardar:", error);
        mensaje.textContent = "Error al registrar ❌";
        mensaje.style.color = "red";
    }
});    