document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    const correoInput = document.getElementById("correoLogin");
    const claveInput = document.getElementById("claveLogin");
    const mensaje = document.getElementById("mensajeLogin");

    if (!form) return console.error("No se encontró #formLogin");

    // Configurar Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyA-8bvs0ogm0HAqr-ngrC-K21Lxg4WRavI",
        authDomain: "levelup-7269f.firebaseapp.com",
        projectId: "levelup-7269f",
        storageBucket: "levelup-7269f.appspot.com",
        messagingSenderId: "500431750193",
        appId: "1:500431750193:web:b4542d0c40934a02034110",
        measurementId: "G-87KTP9XR6E"
    };

    if (!firebase.apps?.length) {
        firebase.initializeApp(firebaseConfig);
    }

    const auth = firebase.auth();
    const db = firebase.firestore();

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        mensaje.innerText = "";

        const correo = correoInput.value.trim().toLowerCase();
        const clave = claveInput.value;

        if (!correo || !clave) {
            mensaje.style.color = "red";
            mensaje.innerText = "Debes completar correo y clave";
            return;
        }

        // --- ADMIN ---
        // --- ADMIN ---
        // --- ADMIN ---
        if (correo === "admin@duoc.cl") {
            try {
                const query = await db.collection("usuario")
                    .where("correo", "==", correo)
                    .where("clave", "==", clave)
                    .get();

                if (!query.empty) {
                    const userData = query.docs[0].data();
                    const usuario = { nombre: userData.nombre || "Administrador", correo, rol: "admin" };
                    localStorage.setItem("usuario", JSON.stringify(usuario));

                    mensaje.style.color = "green";
                    mensaje.innerText = "Bienvenido Administrador, redirigiendo...";

                    setTimeout(() => window.location.href = "perfilAdmin.html", 1000);
                } else {
                    mensaje.style.color = "red";
                    mensaje.innerText = "Correo o clave incorrectos para admin";
                }
            } catch (error) {
                console.error("Error login admin:", error);
                mensaje.style.color = "red";
                mensaje.innerText = "Error al verificar admin";
            }
            return;
        }

        // --- VENDEDOR ---
        if (correo === "vendedor@duoc.cl") {
            try {
                const query = await db.collection("usuario")
                    .where("correo", "==", correo)
                    .where("clave", "==", clave)
                    .get();

                if (!query.empty) {
                    const userData = query.docs[0].data();
                    const usuario = { nombre: userData.nombre || "Vendedor", correo, rol: "vendedor" };
                    localStorage.setItem("usuario", JSON.stringify(usuario));

                    mensaje.style.color = "green";
                    mensaje.innerText = "Bienvenido Vendedor, redirigiendo...";

                    setTimeout(() => window.location.href = "perfilVendedor.html", 1000);
                } else {
                    mensaje.style.color = "red";
                    mensaje.innerText = "Correo o clave incorrectos para vendedor";
                }
            } catch (error) {
                console.error("Error login vendedor:", error);
                mensaje.style.color = "red";
                mensaje.innerText = "Error al verificar vendedor";
            }
            return;
        }

        // --- CLIENTE ---
        try {
            const query = await db.collection("usuario")
                .where("correo", "==", correo)
                .where("clave", "==", clave)
                .get();

            if (!query.empty) {
                const userData = query.docs[0].data();
                const nombre = userData.nombre || correo;
                const usuario = { nombre, correo, rol: "cliente" };
                localStorage.setItem("usuario", JSON.stringify(usuario));

                mensaje.style.color = "green";
                mensaje.innerText = "Bienvenido cliente, redirigiendo...";

                setTimeout(() => window.location.href = "perfilCliente.html", 1000);
            } else {
                mensaje.style.color = "red";
                mensaje.innerText = "Correo o clave incorrectos";
            }
        } catch (error) {
            console.error("Error login cliente:", error);
            mensaje.style.color = "red";
            mensaje.innerText = "Error al verificar usuario";
        }
    });
});
