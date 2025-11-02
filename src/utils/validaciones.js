//Validación del correo
export function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;
    return regex.test(correo);
}

//Validación del run
export function validarRun(run) {
    const regex = /^[0-9]{8}[0-9K]$/;
    return regex.test(run);
}

//Validación de edad minima 18 años
export function esMayorEdad(fecha) {
    const hoy = new Date();
    const fechaNacimiento = new Date(fecha);
    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
    const mes  = hoy.getMonth() - fechaNacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
        edad --;
    }
    return edad >= 18;
}

document.addEventListener("DOMContentLoaded", () => {
    const runInput = document.getElementById("run");
    const nombreInput = document.getElementById("nombre");
    const correoInput = document.getElementById("correo");
    const fechaInput = document.getElementById("fecha");
    const mensaje = document.getElementById("mensaje");

    //limpiar los input y mensajes flotante automaticamente
    [runInput, nombreInput, correoInput, fechaInput].forEach(input => {
        input.addEventListener("input", () => {
            input.setCustomValidity("");
            mensaje.innerText = "";
        });
    });

    document.getElementById("formUsuario").addEventListener("submit", function(e) {
        e.preventDefault();
    
        //limpiar los mensajes
        mensaje.innerText = "";
    
        //La validación correcta del run
        runInput.value = runInput.value.trim().toUpperCase();
    
        //Guardar los valores de los otros input
        const run = runInput.value;
        const nombre = nombreInput.value.trim();
        const correo = correoInput.value.trim();
        const fecha = fechaInput.value;
    
        //Validación Run
        if(!validarRun(run)) {
            runInput.setCustomValidity("El RUN es incorrecto. Debe tener 8 dígitos + número o K verificador");
            runInput.reportValidity();
            return;
        }
    
        //Validación Nombre
        if (nombre === "") {
            nombreInput.setCustomValidity("El nombres es obligatorio")
            nombreInput.reportValidity();
            return;
        }
    
        //Validación correo
        if (!validarCorreo(correo)) {
            correoInput.setCustomValidity("El correo debe ser '@duoc.cl', '@profesor.duoc.cl' o '@gmail.com'");
            correoInput.reportValidity();
            return;
        }
    
        //Validación de Edad
        if (!esMayorEdad(fecha)) {
            fechaInput.setCustomValidity("Debe seer mayor a 18 años para registrarse");
            fechaInput.reportValidity();
            return;
        }
    
        //Todos los datos sean correctos
        let nombreUsuario = nombre;
        mensaje.innerText = `Formulario enviado correctamente` //alt gr + tecla }]`
    
        //Redirección a las paginas del perfil para el Admin o Cliente
        //const destino = correo.toLowerCase() === "admin@duoc.cl" ?
        //    `assets/page/perfilAdmin.html?nombre=${encodeURIComponent(nombreUsuario)}` :
        //    `assets/page/perfilCliente.html?nombre=${encodeURIComponent(nombreUsuario)}`;
    
        //Tiempo de reacción al redirigir
        //setTimeout(() => {
        //    window.location.href = destino;
        //}, 1000);
        
    
    });
});