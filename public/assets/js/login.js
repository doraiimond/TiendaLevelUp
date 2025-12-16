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
        const correoLower = correo.toLowerCase();
        let rol = "cliente";
        let redirect = "perfilCliente.html";

        // detectar rol por correo
        if (correoLower.endsWith("@duoc.cl")) {
            rol = "admin";
            redirect = "perfilAdmin.html";
        } 
        else if (correoLower.endsWith("@vduoc.cl")) {
            rol = "vendedor";
            redirect = "perfilVendedor.html";
        }

        try {
            const query = await db.collection("usuario")
                .where("correo", "==", correo)
                .where("clave", "==", clave)
                .get();

            if (query.empty) {
                mensaje.style.color = "red";
                mensaje.innerText = "Correo o clave incorrectos";
                return;
            }

            const userData = query.docs[0].data();

            const usuario = {
                nombre: userData.nombre || rol,
                correo,
                rol
            };

            localStorage.setItem("usuario", JSON.stringify(usuario));

            mensaje.style.color = "green";
            mensaje.innerText = `Bienvenido ${rol}, redirigiendo...`;

            // REDIRECCIÓN LIMPIA
            window.location.href = redirect;

        } catch (error) {
            console.error("Error login:", error);
            mensaje.style.color = "red";
            mensaje.innerText = "Error al verificar usuario";
        }
    });
});
