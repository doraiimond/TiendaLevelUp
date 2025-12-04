// Configuración Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
  authDomain: "levelup-7269f.firebaseapp.com",
  projectId: "levelup-7269f",
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// DOM
const productosContainer = document.getElementById("productosContainer");
const comprasContainer = document.getElementById("comprasContainer");
const formAgregar = document.getElementById("formAgregar");

const formPerfil = document.getElementById("formPerfil");
const mensajePerfil = document.getElementById("mensajePerfil");

// Cargar perfil del vendedor desde Firestore
async function cargarPerfil() {
    const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
    if (!usuarioLocal) return;

    const correo = usuarioLocal.correo;

    try {
        const query = await db.collection("usuario").where("correo", "==", correo).get();
        if (query.empty) return;

        const doc = query.docs[0];
        const data = doc.data();

        formPerfil.dataset.docId = doc.id; // Guardar ID para actualizar
        document.getElementById("perfilNombre").value = data.nombre || "";
        document.getElementById("perfilCorreo").value = data.correo || "";
        document.getElementById("perfilRun").value = data.run || "";
        document.getElementById("perfilFecha").value = data.fecha || "";

    } catch (error) {
        console.error("Error cargando perfil:", error);
    }
}

// Guardar cambios en Firestore
formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();
    const docId = formPerfil.dataset.docId;
    if (!docId) return;

    const actualizado = {
        nombre: document.getElementById("perfilNombre").value,
        run: document.getElementById("perfilRun").value,
        fecha: document.getElementById("perfilFecha").value
    };

    try {
        await db.collection("usuario").doc(docId).update(actualizado);
        mensajePerfil.textContent = "Perfil actualizado correctamente 🎉";
        mensajePerfil.style.color = "green";

        // Actualizar localStorage también
        const usuarioLocal = JSON.parse(localStorage.getItem("usuario"));
        usuarioLocal.nombre = actualizado.nombre;
        localStorage.setItem("usuario", JSON.stringify(usuarioLocal));

    } catch (error) {
        console.error("Error al actualizar perfil:", error);
        mensajePerfil.textContent = "Error al actualizar ❌";
        mensajePerfil.style.color = "red";
    }
});


// Mostrar secciones
function mostrarSeccion(id) {
  document.querySelectorAll(".seccion").forEach(s => s.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "listaProductos") cargarProductos();
  if (id === "listaCompras") cargarCompras();
  if (id === "perfilVendedor") cargarPerfil();
}

// Cargar perfil del vendedor
function cargarPerfil() {
  // Simulación: reemplaza con tu sistema de autenticación
  document.getElementById("perfilNombre").textContent = "Juan Pérez";
  document.getElementById("perfilEmail").textContent = "juan@levelup.com";
  document.getElementById("perfilFecha").textContent = "01-12-2025";
}

// ----------------------------------------------------------------------
// Cargar productos
// ----------------------------------------------------------------------
async function cargarProductos() {
  productosContainer.innerHTML = "<p>Cargando productos...</p>";
  const snapshot = await db.collection("producto").get();

  if (snapshot.empty) {
      productosContainer.innerHTML = "<p>No hay productos.</p>";
      return;
  }

  productosContainer.innerHTML = snapshot.docs.map(doc => {
      const p = doc.data();
      return `
          <div class="producto-card">
              <img src="${p.imagen}" class="producto-img">
              <h3>${p.nombre}</h3>
              <p>Precio: $${p.precio?.toLocaleString('es-CL')}</p>
              ${p.precioAnterior ? `<p class="oferta">Antes: $${p.precioAnterior.toLocaleString('es-CL')}</p>` : ""}
              <p>Stock: ${p.stock}</p>
              <button onclick="editarProducto('${doc.id}')">Modificar</button>
              <button onclick="eliminarProducto('${doc.id}')">Eliminar</button>
          </div>
      `;
  }).join("");
}

// ----------------------------------------------------------------------
// Guardar o actualizar producto
// ----------------------------------------------------------------------
formAgregar.addEventListener("submit", async (e) => {
  e.preventDefault();

  const id = document.getElementById("productoId").value;
  const producto = {
      nombre: nombre.value,
      precio: Number(precio.value),
      precioAnterior: precioAnterior.value ? Number(precioAnterior.value) : null,
      stock: Number(stock.value),
      imagen: imagen.value
  };

  if (id) {
      await db.collection("producto").doc(id).update(producto);
      alert("Producto actualizado");
  } else {
      await db.collection("producto").add(producto);
      alert("Producto agregado");
  }

  formAgregar.reset();
  document.getElementById("productoId").value = "";
  mostrarSeccion("listaProductos");
});

// ----------------------------------------------------------------------
// Editar producto
// ----------------------------------------------------------------------
async function editarProducto(id) {
  const doc = await db.collection("producto").doc(id).get();
  if (!doc.exists) return alert("Producto no encontrado");

  const p = doc.data();
  document.getElementById("productoId").value = id;
  document.getElementById("nombre").value = p.nombre;
  document.getElementById("precio").value = p.precio;
  document.getElementById("precioAnterior").value = p.precioAnterior || "";
  document.getElementById("stock").value = p.stock;
  document.getElementById("imagen").value = p.imagen;

  mostrarSeccion("agregarProducto");
}

// ----------------------------------------------------------------------
// Eliminar producto
// ----------------------------------------------------------------------
async function eliminarProducto(id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  await db.collection("producto").doc(id).delete();
  alert("Producto eliminado");
  cargarProductos();
}

// ----------------------------------------------------------------------
// Cargar compras
// ----------------------------------------------------------------------
async function cargarCompras() {
  comprasContainer.innerHTML = "<p>Cargando compras...</p>";

  try {
      const snapshot = await db.collection("compras").get();

      if (snapshot.empty) {
          comprasContainer.innerHTML = "<p>No hay compras aún.</p>";
          return;
      }

      comprasContainer.innerHTML = snapshot.docs.map(doc => {
          const c = doc.data();
          return `
              <div class="compra-card">
                  <h3>Compra #${doc.id}</h3>
                  <p><strong>Cliente:</strong> ${c.usuario || "Desconocido"}</p>
                  <p><strong>Total:</strong> $${c.total?.toLocaleString("es-CL")}</p>
                  <p><strong>Fecha:</strong> ${c.fecha || "No especificada"}</p>
                  <h4>Productos:</h4>
                  <ul>
                      ${c.productos?.map(p => `<li>${p.nombre} — Cant: ${p.cantidad} — $${p.precio}</li>`).join("")}
                  </ul>
              </div>
          `;
      }).join("");

  } catch (err) {
      comprasContainer.innerHTML = "<p>Error cargando compras.</p>";
      console.error(err);
  }
}
