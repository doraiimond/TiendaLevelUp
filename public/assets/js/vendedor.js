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
  const formPerfil = document.getElementById("formPerfil");
  const mensajePerfil = document.getElementById("mensajePerfil");
  
  // ----------------------------------------------------------------------
  // Cargar perfil del vendedor desde Firestore
  // ----------------------------------------------------------------------
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
  
  // ----------------------------------------------------------------------
  // Guardar cambios en Firestore (solo perfil)
  // ----------------------------------------------------------------------
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
  
  // ----------------------------------------------------------------------
  // Mostrar secciones
  // ----------------------------------------------------------------------
  function mostrarSeccion(id) {
    document.querySelectorAll(".seccion").forEach(s => s.style.display = "none");
    document.getElementById(id).style.display = "block";
  
    if (id === "listaProductos") cargarProductos();
    if (id === "listaCompras") cargarCompras();
    if (id === "perfilVendedor") cargarPerfil();
  }
  
  // ----------------------------------------------------------------------
  // Cargar productos (solo vista, sin modificar ni eliminar)
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
        </div>
      `;
    }).join("");
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
  