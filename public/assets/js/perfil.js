window.onload = function() {
// Leer datos desde localStorage
const nombre = localStorage.getItem("nombre") || "No registrado";
const correo = localStorage.getItem("correo") || "No registrado";
const run = localStorage.getItem("run") || "No registrado";
const telefono = localStorage.getItem("telefono") || "No registrado";
const direccion = localStorage.getItem("direccion") || "No registrado";
const uid = localStorage.getItem("uid") || "No registrado";

// Mostrar datos en el HTML
document.getElementById("nombreUsuario").textContent = nombre;
document.getElementById("correoUsuario").textContent = correo;
document.getElementById("telefonoUsuario").textContent = telefono;
document.getElementById("direccionUsuario").textContent = direccion;
document.getElementById("uidUsuario").textContent = uid;

// Botón de cerrar sesión
const btnCerrar = document.getElementById("btnCerrarSesion");
btnCerrar.addEventListener("click", () => {
    localStorage.clear(); // Opcional: borra todos los datos de sesión
    alert("Sesión cerrada");
    window.location.href = "index.html"; // Redirige al inicio
});

const fotoPerfil = localStorage.getItem("foto") || "../image/user.png";
document.getElementById("fotoPerfil").src = fotoPerfil;

};
