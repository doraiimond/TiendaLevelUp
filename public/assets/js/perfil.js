// ===============================
// VERIFICAR SESIÓN (LOCALSTORAGE)
// ===============================
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!usuario) {
    window.location.href = "login.html";
}

// ===============================
// MOSTRAR DATOS DEL PERFIL
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    setText("nombreUsuario", usuario.nombre);
    setText("correoUsuario", usuario.correo);
    setText("runUsuario", usuario.run);
    setText("fechaUsuario", usuario.fecha);
    setText("rolUsuario", usuario.rol);
});

// ===============================
// CERRAR SESIÓN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    const btnCerrar = document.getElementById("btnCerrarSesion");

    if (btnCerrar) {
        btnCerrar.addEventListener("click", () => {
            localStorage.clear();
            alert("Sesión cerrada correctamente");
            window.location.href = "login.html";
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
