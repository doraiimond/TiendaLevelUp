// carrito.js

// Recuperar carrito del localStorage o inicializar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio) {
    // Convertir precio a número por si viene como string
    precio = Number(precio);

    // Crear objeto del producto
    const producto = { nombre, precio };

    // Agregar al carrito
    carrito.push(producto);

    // Guardar en localStorage
    localStorage.setItem("carrito", JSON.stringify(carrito));

    // Actualizar la vista del carrito si estamos en carrito.html
    if(document.getElementById("lista-carrito")){
        mostrarCarrito();
    }

    // Calcular y mostrar puntos LevelUp
    const puntos = Math.floor(calcularTotal() * 0.05);
    console.log(`Ganaste ${puntos} puntos LevelUp`);
}

// Función para calcular total
function calcularTotal() {
    return carrito.reduce((acc, item) => acc + item.precio, 0);
}

// Función para mostrar carrito en carrito.html
function mostrarCarrito() {
    const lista = document.getElementById("lista-carrito");
    lista.innerHTML = "";

    carrito.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "carrito-item mb-2 p-2 bg-secondary rounded";
        div.innerHTML = `
            <span>${item.nombre} - $${item.precio}</span>
            <button class="btn btn-danger btn-sm float-end" onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        lista.appendChild(div);
    });

    // Actualizar total
    const totalElem = document.getElementById("total");
    if(totalElem){
        totalElem.textContent = `Total: $${calcularTotal()}`;
    }
}

// Función para eliminar producto
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    mostrarCarrito();
}

// Función para finalizar compra
function finalizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }
    const total = calcularTotal();
    const puntos = Math.floor(total * 0.05);
    agregarPuntos(puntos);
    alert(`Compra realizada con éxito!\nTotal: $${total}\nPuntos LevelUp ganados: ${puntos}`);
    carrito = [];
    localStorage.removeItem("carrito");
    mostrarCarrito();
}


// Ejecutar mostrarCarrito al cargar carrito.html
document.addEventListener("DOMContentLoaded", () => {
    if(document.getElementById("lista-carrito")){
        mostrarCarrito();
    }

    const finalizarBtn = document.getElementById("finalizar");
    if(finalizarBtn){
        finalizarBtn.addEventListener("click", finalizarCompra);
    }
});

// Inicializar puntos si no existen
if (!localStorage.getItem("puntos")) {
    localStorage.setItem("puntos", 0);
}

// Mostrar puntos si existe el span en perfilCliente.html
document.addEventListener("DOMContentLoaded", () => {
    const puntosDisplay = document.getElementById("puntosDisplay");
    if (puntosDisplay) {
        puntosDisplay.textContent = localStorage.getItem("puntos");
    }
});

// Función para sumar puntos
function agregarPuntos(cantidad) {
    let puntos = parseInt(localStorage.getItem("puntos")) || 0;
    puntos += cantidad;
    localStorage.setItem("puntos", puntos);

    // Si estamos en perfilCliente.html, actualizar visualmente
    const puntosDisplay = document.getElementById("puntosDisplay");
    if (puntosDisplay) {
        puntosDisplay.textContent = puntos;
    }
}
    
