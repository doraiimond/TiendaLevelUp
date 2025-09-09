let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarContador() {
  const contador = document.getElementById("contador");
  if (contador) contador.textContent = carrito.length;
}

function agregarAlCarrito(nombre, precio) {
  carrito.push({ nombre, precio });
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContador();
  alert(`${nombre} agregado al carrito`);
}

function mostrarCarrito() {
  const lista = document.getElementById("listaCarrito");
  const total = document.getElementById("total");
  if (!lista) return;

  lista.innerHTML = "";
  let suma = 0;

  carrito.forEach((item, index) => {
    const card = document.createElement("div");
    card.className = "card p-2";
    card.innerHTML = `
      <div class="d-flex justify-content-between">
        <span>${item.nombre} - $${item.precio}</span>
        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">X</button>
      </div>`;
    lista.appendChild(card);
    suma += item.precio;
  });

  total.textContent = suma;
  actualizarContador();
}

function eliminarDelCarrito(indice) {
  carrito.splice(indice, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

function finalizarCompra() {
  if (carrito.length === 0) {
    alert("El carrito está vacío");
    return;
  }
  alert("¡Compra realizada con éxito!");
  carrito = [];
  localStorage.removeItem("carrito");
  mostrarCarrito();
}

// Inicializar en cada página
document.addEventListener("DOMContentLoaded", () => {
  actualizarContador();
  mostrarCarrito();
});
