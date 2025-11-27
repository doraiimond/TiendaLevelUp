document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const dropdownCategorias = document.getElementById("dropdownCategorias");
  const cardsCategorias = document.getElementById("cardsCategorias");
  const productosGrid = document.getElementById("productosGrid");
  const tituloProductos = document.getElementById("tituloProductos");
  const buscador = document.getElementById("buscador");
  const btnBuscar = document.getElementById("btnBuscar");
  const carritoTotal = document.querySelector('.carrito-total');
  const btnVerTodos = document.getElementById("btnVerTodos");

  let productosGlobal = [];
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  let categoriaActiva = 'todos';

  // Configuración de Firebase
  const firebaseConfig = {
      apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
      authDomain: "levelup-7269f.firebaseapp.com",
      projectId: "levelup-7269f",
  };

  // Inicializar Firebase
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();

  // Inicializar la aplicación
  actualizarCarritoTotal();
  cargarProductos();

  async function cargarProductos() {
      try {
          tituloProductos.textContent = "Cargando productos...";
          
          const snapshot = await db.collection("producto").get();
          productosGlobal = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
          }));

          console.log("Productos cargados:", productosGlobal);
          inicializarInterfaz(productosGlobal);
      } catch (error) {
          console.error("Error cargando productos:", error);
          tituloProductos.textContent = "Error al cargar productos";
          productosGrid.innerHTML = "<p class='error'>No se pudieron cargar los productos. Intenta recargar la página.</p>";
      }
  }

  function inicializarInterfaz(productos) {
      const categorias = obtenerCategoriasUnicas(productos);

      // Inicializar dropdown y cards
      mostrarDropdownCategorias(categorias);
      mostrarCardsCategorias(categorias);

      // Mostrar todos los productos sin oferta
      mostrarTodosLosProductosSinOferta();

      // Configurar eventos
      configurarEventos();
  }

  // Obtener solo productos que NO estén en oferta
  function obtenerProductosSinOferta() {
      return productosGlobal.filter(producto => !producto.precioAnterior && !producto.newprecio);
  }

  // Mostrar todos los productos sin oferta
  function mostrarTodosLosProductosSinOferta() {
      const productosSinOferta = obtenerProductosSinOferta();
      tituloProductos.textContent = `Todos los productos (${productosSinOferta.length})`;
      categoriaActiva = 'todos';
      mostrarProductos(productosSinOferta);
      buscador.value = '';
  }

  function obtenerCategoriasUnicas(productos) {
      const categoriasSet = new Set();
      productos.forEach(producto => {
          if (producto.categoria) categoriasSet.add(producto.categoria);
      });
      return Array.from(categoriasSet);
  }

  function mostrarDropdownCategorias(categorias) {
      dropdownCategorias.innerHTML = categorias.map(categoria => `
          <a href="#" class="dropdown-item" data-categoria="${categoria}">
              ${categoria}
          </a>
      `).join("");

      dropdownCategorias.addEventListener('click', (e) => {
          e.preventDefault();
          if (e.target.classList.contains('dropdown-item')) {
              const categoria = e.target.dataset.categoria;
              filtrarPorCategoriaSinOferta(categoria);
          }
      });
  }

  function mostrarCardsCategorias(categorias) {
      cardsCategorias.innerHTML = categorias.map(categoria => `
          <div class="categoria-card" data-categoria="${categoria}">
              <div class="categoria-img">
                  ${obtenerIconoCategoria(categoria)}
              </div>
              <div class="categoria-nombre">${categoria}</div>
          </div>
      `).join("");

      cardsCategorias.addEventListener('click', (e) => {
          const card = e.target.closest('.categoria-card');
          if (card) {
              const categoria = card.dataset.categoria;
              filtrarPorCategoriaSinOferta(categoria);
          }
      });
  }

  function obtenerIconoCategoria(categoria) {
      const iconos = {
          'Ropa': '👕',
          'Tecnología': '💻',
          'Electrónica': '📱',
          'Hogar': '🏠',
          'Deportes': '⚽',
          'Zapatos': '👟',
          'Accesorios': '🕶️',
          'Libros': '📚',
          'Juguetes': '🧸',
          'Belleza': '💄'
      };
      return iconos[categoria] || '📦';
  }

  // Filtrar productos por categoría, solo sin oferta
  function filtrarPorCategoriaSinOferta(categoria) {
      const productosFiltrados = obtenerProductosSinOferta().filter(p => p.categoria === categoria);
      tituloProductos.textContent = `${categoria} (${productosFiltrados.length} productos)`;
      categoriaActiva = categoria;
      mostrarProductos(productosFiltrados);
  }

  function mostrarProductos(productos) {
      if (productos.length === 0) {
          productosGrid.innerHTML = `
              <div class="no-productos" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
                  <p style="font-size: 18px; color: #666; margin-bottom: 15px;">No se encontraron productos</p>
                  <button onclick="mostrarTodosLosProductosSinOferta()" class="btn-signup">Ver todos los productos</button>
              </div>
          `;
          return;
      }

      productosGrid.innerHTML = productos.map(producto => `
          <div class="producto-card">
              <img src="${producto.imagen}" 
                   alt="${producto.nombre}" 
                   class="producto-imagen"
                   onerror="this.src='https://via.placeholder.com/400x300/cccccc/969696?text=Imagen+No+Disponible'">
              <div class="producto-info">
                  <h3 class="producto-nombre">${producto.nombre || 'Sin nombre'}</h3>
                  <p class="producto-precio">$${(producto.precio || 0).toLocaleString('es-CL')}</p>
                  <button class="btn-agregar" data-id="${producto.id}">
                      🛒 Agregar al carrito
                  </button>
              </div>
          </div>
      `).join("");

      document.querySelectorAll('.btn-agregar').forEach(btn => {
          btn.addEventListener('click', function() {
              const productId = this.dataset.id;
              agregarAlCarrito(productId);
          });
      });
  }

  function agregarAlCarrito(productId) {
      const producto = productosGlobal.find(p => p.id === productId);
      if (producto) {
          carrito.push(producto);
          localStorage.setItem('carrito', JSON.stringify(carrito));
          actualizarCarritoTotal();
          mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
          console.log('Producto agregado al carrito:', producto);
      }
  }

  function actualizarCarritoTotal() {
      const total = carrito.reduce((sum, producto) => sum + (producto.precio || 0), 0);
      carritoTotal.textContent = total.toLocaleString('es-CL');
  }

  function mostrarNotificacion(mensaje) {
      const notificacion = document.createElement('div');
      notificacion.style.cssText = `
          position: fixed;
          top: 100px;
          right: 20px;
          background: #28a745;
          color: white;
          padding: 15px 20px;
          border-radius: 5px;
          z-index: 10000;
          box-shadow: 0 3px 10px rgba(0,0,0,0.2);
          font-weight: 600;
      `;
      notificacion.textContent = mensaje;
      document.body.appendChild(notificacion);

      setTimeout(() => notificacion.remove(), 3000);
  }

  function configurarEventos() {
      btnVerTodos.addEventListener('click', mostrarTodosLosProductosSinOferta);

      btnBuscar.addEventListener('click', buscarProductos);
      buscador.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') buscarProductos();
      });

      document.querySelector('.btn-carrito').addEventListener('click', () => {
          if (carrito.length === 0) {
              alert('El carrito está vacío');
          } else {
              const total = carrito.reduce((sum, producto) => sum + (producto.precio || 0), 0);
              const productosLista = carrito.map(p => `• ${p.nombre} - $${p.precio?.toLocaleString('es-CL')}`).join('\n');
              alert(`CARRITO (${carrito.length} productos)\n\n${productosLista}\n\nTOTAL: $${total.toLocaleString('es-CL')}`);
          }
      });
  }

  function buscarProductos() {
      const termino = buscador.value.toLowerCase().trim();
      if (!termino) {
          if (categoriaActiva === 'todos') {
              mostrarTodosLosProductosSinOferta();
          } else {
              filtrarPorCategoriaSinOferta(categoriaActiva);
          }
          return;
      }

      const productosFiltrados = obtenerProductosSinOferta().filter(p => 
          p.nombre?.toLowerCase().includes(termino) ||
          p.categoria?.toLowerCase().includes(termino) ||
          p.descripcion?.toLowerCase().includes(termino)
      );

      tituloProductos.textContent = `Resultados para "${termino}" (${productosFiltrados.length})`;
      mostrarProductos(productosFiltrados);
  }

  // Funciones globales
  window.mostrarTodosLosProductosSinOferta = mostrarTodosLosProductosSinOferta;
  window.getProductosGlobal = () => productosGlobal;
  window.getCarrito = () => carrito;

  console.log("Catálogo inicializado correctamente");
});
