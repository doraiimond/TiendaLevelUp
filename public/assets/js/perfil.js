// ===============================
// VERIFICAR SESIÓN
// ===============================
firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    cargarPerfil(user.uid);
});

// ===============================
// CARGAR PERFIL DESDE FIRESTORE
// ===============================
async function cargarPerfil(uid) {
    try {
        const db = firebase.firestore();
        const doc = await db.collection("usuarios").doc(uid).get();

        if (!doc.exists) {
            console.error("Usuario no encontrado en Firestore");
            return;
        }

        const data = doc.data();

        setText("nombreUsuario", data.nombre);
        setText("correoUsuario", data.correo);
        setText("runUsuario", data.run);
        setText("fechaUsuario", data.fecha || data.createdAt);
        setText("uidUsuario", uid);

    } catch (error) {
        console.error("ERROR al cargar perfil:", error);
    }
}

// ===============================
// CERRAR SESIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const btnCerrar = document.getElementById("btnCerrarSesion");

    if (btnCerrar) {
        btnCerrar.addEventListener("click", async () => {
            try {
                await firebase.auth().signOut();
                localStorage.clear();
                alert("Sesión cerrada correctamente");
                window.location.href = "login.html";
            } catch (error) {
                console.error("Error al cerrar sesión:", error);
            }
        });
    }
});

// ===============================
// UTILIDAD
// ===============================
function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value || "No registrado";
}
