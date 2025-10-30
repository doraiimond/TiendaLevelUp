//Validación del correo
function validarCorreo(correo) {
    const regex = /^[\w.+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i; // Acepta dominios duoc.cl, profesor.duoc.cl y gmail.com
    return regex.test(correo);// Retorna true si el correo es válido, false si no lo es
}
//Validación del run
function validarRun(run) {
    const regex  = /^\d{7,8}[0-9K]$/i; //usamos regex para validar el formato del run
    return regex.test(run);
}

document.getElementById("formUsuario").addEventListener("submit", function(e){
      e.preventDefault(); // Evita que la página se recargue
        let run = document.getElementById("run").value.trim();
        let nombre = document.getElementById("nombre").value.trim();
        let correo = document.getElementById("correo").value.trim();
        let mensaje = "";
    
        // Obtienes el input de correo con getElementById
        const correoInput = document.getElementById("correo");

        // Limpiar mensaje previo
        correoInput.setCustomValidity("");

        if(!validarCorreo(correo)){
            // Mostrar mensaje de error directamente en el input
            correoInput.setCustomValidity("El correo debe ser @duoc.cl, @profesor.duoc.cl o @gmail.com.");
            correoInput.reportValidity(); // fuerza a mostrar el mensaje nativo
            return; // detener envío
        } else if(!validarRun(run)){
            mensaje = "El RUN es inválido.";
        } else if(nombre === ""){
            mensaje = "El nombre es obligatorio.";
        } else {
            mensaje = "Formulario enviado correctamente";
        }

        document.getElementById("mensaje").innerText = mensaje;

        // Todos los datos correctos, redirigir según correo
        let nombreUsuario = nombre; // se puede usar nombre del input
        const destino = correo.toLowerCase() === "admin@duoc.cl" ? 
                        `assets/page/perfilAdmin.html?nombre=${encodeURIComponent(nombreUsuario)}` :
                        `assets/page/perfilCliente.html?nombre=${encodeURIComponent(nombreUsuario)}`;

        mensaje.innerText = `Bienvenido ${nombreUsuario}!`;

        setTimeout(() => {
            window.location.href = destino;
        }, 1500);
});