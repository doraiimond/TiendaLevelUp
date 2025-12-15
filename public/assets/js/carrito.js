// ================== FIREBASE ==================
const firebaseConfig = {
  apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
  authDomain: "levelup-7269f.firebaseapp.com",
  projectId: "levelup-7269f",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ================== VARIABLES ==================
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productosOferta = [];

// ================== INIT ==================
document.addEventListener("DOMContentLoaded", () => {
  inicializarCarrito();
  cargarProductosOferta();
  configurarEventos();
});

// ================== INICIALIZAR ==================
function inicializarCarrito() {
  renderizarCarrito();
  calcularTotal();
  actualizarCarritoHeader();
}

// ================== CARGAR PRODUCTOS ==================
async function cargarProductosOferta() {
  try {
    const snapshot = await db.collection("producto").get();

    productosOferta = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // 🔥 SOLO productos con newprecio válido
    const productosEnOferta = productosOferta.filter(p =>
      p.newprecio !== undefined &&
      p.newprecio !== null &&
      Number(p.newprecio) < Number(p.precio)
    );

    renderizarProductosOferta(productosEnOferta);

  } catch (error) {
    console.error("❌ Error cargando productos en oferta:", error);
  }
}


// ================== PRODUCTOS OFERTA ==================
function renderizarProductosOferta(productos) {
  const contenedor = document.getElementById("productosOferta");

  if (!productos.length) {
    contenedor.innerHTML = "<p>No hay ofertas activas 🔕</p>";
    return;
  }

  contenedor.innerHTML = productos.map(p => `
    <div class="producto-card">
      <img src="${p.imagen}" alt="${p.nombre}">
      
      <h3>${p.nombre}</h3>

      <p>
        <span style="text-decoration:line-through;color:#aaa;">
          $${Number(p.precio).toLocaleString("es-CL")}
        </span><br>
        <strong style="color:#ff004f;">
          $${Number(p.newprecio).toLocaleString("es-CL")}
        </strong>
      </p>

      <button class="btn-agregar-oferta" data-id="${p.id}">
        Añadir
      </button>
    </div>
  `).join("");

  document.querySelectorAll(".btn-agregar-oferta").forEach(btn => {
    btn.addEventListener("click", () => {
      agregarProductoAlCarrito(btn.dataset.id);
    });
  });
}


// ================== AGREGAR AL CARRITO ==================
function agregarProductoAlCarrito(productId) {
  const producto = productosOferta.find(p => p.id === productId);
  if (!producto) return;

  const enOferta =
    producto.newprecio &&
    Number(producto.newprecio) < Number(producto.precio);

  const precioFinal = enOferta
    ? Number(producto.newprecio)
    : Number(producto.precio);

  const existente = carrito.find(p => p.id === productId);

  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      imagen: producto.imagen,
      precio: Number(producto.precio),
      precioFinal: precioFinal,
      enOferta: enOferta,
      cantidad: 1,
      stock: producto.stock ?? 0,
    });
  }

  guardarCarrito();
  renderizarCarrito();
  calcularTotal();
  actualizarStockFirebase(productId, 1);

  mostrarNotificacion(
    enOferta
      ? `🔥 Oferta aplicada: ${producto.nombre}`
      : `"${producto.nombre}" agregado`
  );
}

// ================== RENDERIZAR CARRITO ==================
function renderizarCarrito() {
  const tbody = document.getElementById("tablaCarritoBody");
  if (!tbody) return;

  if (carrito.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align:center;">🛒 Carrito vacío</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = carrito.map((p, i) => {

    // 🔐 PROTECCIÓN TOTAL
    const precio = Number(p.precio ?? 0);
    const precioFinal = Number(p.precioFinal ?? precio);
    const cantidad = Number(p.cantidad ?? 1);
    const subtotal = precioFinal * cantidad;

    return `
      <tr>
        <td>
          <img src="${p.imagen || ''}" width="60">
        </td>

        <td>${p.nombre || 'Producto'}</td>

        <td>
          ${
            p.enOferta
              ? `
                <span style="text-decoration:line-through;color:#aaa;">
                  $${precio.toLocaleString("es-CL")}
                </span><br>
                <strong style="color:#00ffcc;">
                  $${precioFinal.toLocaleString("es-CL")}
                </strong>
              `
              : `$${precioFinal.toLocaleString("es-CL")}`
          }
        </td>

        <td>
          <button onclick="disminuirCantidad(${i})">-</button>
          ${cantidad}
          <button onclick="aumentarCantidad(${i})">+</button>
        </td>

        <td>
          $${subtotal.toLocaleString("es-CL")}
        </td>

        <td>
          <button onclick="eliminarDelCarrito(${i})">Eliminar</button>
        </td>
      </tr>
    `;
  }).join("");
}


// ================== CANTIDADES ==================
function aumentarCantidad(i) {
  carrito[i].cantidad++;
  guardarCarrito();
  renderizarCarrito();
  calcularTotal();
  actualizarStockFirebase(carrito[i].id, 1);
}

function disminuirCantidad(i) {
  if (carrito[i].cantidad > 1) {
    carrito[i].cantidad--;
    guardarCarrito();
    renderizarCarrito();
    calcularTotal();
    restaurarStockFirebase(carrito[i].id, 1);
  }
}

function eliminarDelCarrito(i) {
  restaurarStockFirebase(carrito[i].id, carrito[i].cantidad);
  carrito.splice(i, 1);
  guardarCarrito();
  renderizarCarrito();
  calcularTotal();
}

// ================== TOTALES ==================
function calcularTotal() {
  const total = carrito.reduce(
    (sum, p) => sum + p.precioFinal * p.cantidad,
    0
  );
  document.getElementById("totalCarrito").textContent =
    total.toLocaleString("es-CL");
  actualizarCarritoHeader();
}

function actualizarCarritoHeader() {
  const total = carrito.reduce(
    (sum, p) => sum + p.precioFinal * p.cantidad,
    0
  );
  const el = document.querySelector(".carrito-total");
  if (el) el.textContent = total.toLocaleString("es-CL");
}

// ================== FIREBASE STOCK ==================
async function actualizarStockFirebase(id, cant) {
  const ref = db.collection("producto").doc(id);
  const doc = await ref.get();
  if (doc.exists) {
    await ref.update({ stock: (doc.data().stock || 0) - cant });
  }
}

async function restaurarStockFirebase(id, cant) {
  const ref = db.collection("producto").doc(id);
  const doc = await ref.get();
  if (doc.exists) {
    await ref.update({ stock: (doc.data().stock || 0) + cant });
  }
}

// ================== UTIL ==================
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function mostrarNotificacion(msg) {
  const n = document.createElement("div");
  n.textContent = msg;
  n.style.cssText =
    "position:fixed;top:80px;right:20px;background:#00ffcc;color:#000;padding:12px;border-radius:6px;";
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 3000);
}

function configurarEventos() {
  document
    .getElementById("btnComprarAhora")
    ?.addEventListener("click", () => {
      if (carrito.length === 0) {
        alert("Agrega productos primero");
        return;
      }
      window.location.href = "checkout.html";
    });
}

// ================== GLOBAL ==================
window.aumentarCantidad = aumentarCantidad;
window.disminuirCantidad = disminuirCantidad;
window.eliminarDelCarrito = eliminarDelCarrito;
