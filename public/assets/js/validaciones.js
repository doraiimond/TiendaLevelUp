// -------- SONIDOS --------
const clickSound = document.getElementById("click-sound");
function playSounds() {
    if (clickSound) {
        clickSound.currentTime = 0;
        clickSound.play();
    }
}

// -------- VALIDACIONES --------

// Correos permitidos
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

// RUN: 8 dígitos + verificador (número o K)
function validarRun(run) {
    const regex = /^[0-9]{8}[0-9K]$/i;
    return regex.test(run);
}

// Mayor de 18 años
function validarMayoriaEdad(fecha) {
    const hoy = new Date();
    const nacimiento = new Date(fecha);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
    }
    return edad >= 18;
}

// -------- MAIN --------
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formUsuario");

    const runInput = document.getElementById("run");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const claveInput = document.getElementById("clave");
    const fechaInput = document.getElementById("fecha");
    const mensaje = document.getElementById("mensaje");

    // Limpiar mensajes al escribir
    [runInput, nombreInput, correoInput, claveInput, fechaInput].forEach(input => {
        input.addEventListener("input", () => {
            input.setCustomValidity("");
            mensaje.innerText = "";
        });
    });

    // VALIDACIÓN Y ENVÍO
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        mensaje.innerText = "";

        const run = runInput.value.trim().toUpperCase();
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim().toLowerCase();
        const clave = claveInput.value.trim();
        const fecha = fechaInput.value;

        // Validaciones
        if (!validarRun(run)) {
            runInput.setCustomValidity("El RUN es incorrecto. Ejemplo: 12345678K");
            runInput.reportValidity();
            return;
        }
        if (nombre === "") {
            nombreInput.setCustomValidity("El nombre no debe quedar vacío");
            nombreInput.reportValidity();
            return;
        }
        if (!validarCorreo(correo)) {
            correoInput.setCustomValidity("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com");
            correoInput.reportValidity();
            return;
        }
        if (!validarMayoriaEdad(fecha)) {
            fechaInput.setCustomValidity("Debe ser mayor de 18 años");
            fechaInput.reportValidity();
            return;
        }

        // Guardar en localStorage
        localStorage.setItem("run", run);
        localStorage.setItem("nombre", nombre);
        localStorage.setItem("correo", correo);
        localStorage.setItem("clave", clave);
        localStorage.setItem("fecha", fecha);
        localStorage.setItem("puntos", 0);

        mensaje.innerText = "Formulario enviado correctamente ✅";

        // -------- DETECCIÓN DE ADMIN --------
        let destino = "";

        if (
            correo.endsWith("admin@duoc.cl")            // admin duro
        ) {
            destino = "perfilAdmin.html";
        } else {
            destino = "perfilCliente.html";
        }

        // -------- REDIRECCIÓN --------
        setTimeout(() => {
            window.location.href = destino;
        }, 1000);
    });
});
