window.onload = function() {
    const run = localStorage.getItem("run") || "No registrado";
    const nombre = localStorage.getItem("nombre") || "No registrado";
    const correo = localStorage.getItem("correo") || "No registrado";
    const clave = localStorage.getItem("clave") || "";
    const fecha = localStorage.getItem("fecha") || "No registrado";
    const puntos = localStorage.getItem("puntos") || 0;

    
    document.getElementById("nombreTitulo").textContent = nombre;
    document.getElementById("runDisplay").textContent = run;
    document.getElementById("nombreDisplay").textContent = nombre;
    document.getElementById("correoDisplay").textContent = correo;
    document.getElementById("claveDisplay").textContent = "*".repeat(clave.length); // 🔒 con asteriscos
    document.getElementById("fechaDisplay").textContent = fecha;
    document.getElementById("puntosDisplay").textContent = puntos;
};
