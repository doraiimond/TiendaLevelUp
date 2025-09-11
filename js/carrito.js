// ============================
// CARRITO LEVEL-UP GAMER 🎮
// ============================

// Recuperar carrito del localStorage o iniciar vacío
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Renderizar los productos en el carrito
function renderCarrito() {
  const listaCarrito = document.getElementById("lista-carrito");
  const totalElement = document.getElementById("total");

  listaCarrito.innerHTML = "";

  let total = 0;

  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
  } else {
    carrito.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("carditem", "mb-2", "p-2");

      div.innerHTML = `
        <h5>${item.nombre}</h5>
        <p>Precio: $${item.precio}</p>
        <p>Cantidad: ${item.cantidad}</p>
        <button class="btn btn-danger btn-sm" onclick="eliminarDelCarrito(${index})">Eliminar</button>
      `;

      listaCarrito.appendChild(div);
      total += item.precio * item.cantidad;
    });
  }

  totalElement.textContent = "Total: $" + total;
}

// Agregar producto al carrito
function agregarAlCarrito(nombre, precio) {
  const productoExistente = carrito.find(item => item.nombre === nombre);

  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  actualizarCarritoIcono();
}

// Eliminar producto del carrito
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  actualizarCarritoIcono();
}

// Finalizar compra
function finalizarCompra() {
  if (carrito.length === 0) {
    alert("Tu carrito está vacío.");
    return;
  }

  alert("🎉 ¡Gracias por tu compra! Se han sumado puntos LevelUp a tu cuenta.");
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
  actualizarCarritoIcono();
}

// Actualizar contador en el icono del carrito
function actualizarCarritoIcono() {
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const carritoLink = document.querySelector("a[href='../page/carrito.html']");
  if (carritoLink) {
    carritoLink.innerHTML = `<i class="bi bi-cart3"></i> Carrito(${totalItems})`;
  }
}

// ============================
// Eventos iniciales
// ============================

document.addEventListener("DOMContentLoaded", () => {
  renderCarrito();
  actualizarCarritoIcono();

  const btnFinalizar = document.getElementById("finalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", finalizarCompra);
  }
});

// Agregar productos desde tienda
document.addEventListener("DOMContentLoaded", () => {
  const botones = document.querySelectorAll(".shadow__btn");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      const nombre = btn.dataset.product;
      const precio = parseInt(btn.dataset.price);
      agregarAlCarrito(nombre, precio);
      alert(`${nombre} agregado al carrito`);
    });
  });
});
