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
      apiKey: "AIzaSyA-8bvs0ogm0HAqr-ngrC-K21Lxg4WRavI",
      authDomain: "tiendalevelup-66aa8.firebaseapp.com",
      projectId: "tiendalevelup-66aa8",
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
      
      // Inicializar dropdown de categorías
      mostrarDropdownCategorias(categorias);
      
      // Inicializar cards de categorías
      mostrarCardsCategorias(categorias);
      
      // Mostrar todos los productos inicialmente
      mostrarTodosLosProductos();
      
      // Configurar eventos
      configurarEventos();
    }
    // Obtener categorías únicas de los productos desde Firestore Database collection "producto"
    function obtenerCategoriasUnicas(productos) {
      const categoriasSet = new Set(); // Usar Set para evitar duplicados
      productos.forEach(producto => { // Asegurarse de que la categoría exista
        if (producto.categoria) { // Validar que la categoría no sea nula o indefinida
          categoriasSet.add(producto.categoria); // Agregar categoría al Set
        }
      });
      return Array.from(categoriasSet);// Convertir Set a Array
    }
    // Mostrar categorías en el dropdown y en las cards
    function mostrarDropdownCategorias(categorias) { // Incluye opción "Todos"
      //dropdownCategorias para el dropdown de categorías en el HTML
      dropdownCategorias.innerHTML = categorias.map(categoria => `
        <a href="#" class="dropdown-item" data-categoria="${categoria}">
          ${categoria}
        </a>
      `).join("");// Unir sin comas
  
      // Evento para items del dropdown
      dropdownCategorias.addEventListener('click', (e) => { // Delegación de eventos
        e.preventDefault(); // Prevenir comportamiento por defecto
        if (e.target.classList.contains('dropdown-item')) { // Verificar que el clic fue en un item
          const categoria = e.target.dataset.categoria;// Obtener categoría del data-attribute
          filtrarPorCategoria(categoria); // Filtrar productos por categoría
        }
      });
    }
    // Mostrar categorías como cards
    function mostrarCardsCategorias(categorias) {
      //cardsCategorias para el contenedor de las cards de categorías en el HTML
      cardsCategorias.innerHTML = categorias.map(categoria => `
        <div class="categoria-card" data-categoria="${categoria}">
          <div class="categoria-img">
            ${obtenerIconoCategoria(categoria)}
          </div>
          <div class="categoria-nombre">${categoria}</div>
        </div>
      `).join("");
  
      // Evento para cards de categorías
      cardsCategorias.addEventListener('click', (e) => { // Delegación de eventos
        const card = e.target.closest('.categoria-card'); // Buscar el elemento padre con la clase .categoria-card
        if (card) {
          const categoria = card.dataset.categoria; // Obtener categoría del data-attribute
          filtrarPorCategoria(categoria); // Filtrar productos por categoría
        }
      });
    }
    // Obtener un icono representativo para cada categoría
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
    // Filtrar productos por categoría
    function filtrarPorCategoria(categoria) {
      const productosFiltrados = productosGlobal.filter(p => p.categoria === categoria); // Filtrar productos
      tituloProductos.textContent = `${categoria} (${productosFiltrados.length} productos)`; // Actualizar título
      categoriaActiva = categoria; // Actualizar categoría activa
      mostrarProductos(productosFiltrados); // Mostrar productos filtrados
    }
    // Mostrar todos los productos
    function mostrarTodosLosProductos() {
      tituloProductos.textContent = `Todos los productos (${productosGlobal.length})`; // Actualizar título
      categoriaActiva = 'todos'; // Actualizar categoría activa
      mostrarProductos(productosGlobal); // Mostrar todos los productos
      buscador.value = ''; // Limpiar buscador
    }
    // Renderizar productos en el grid
    function mostrarProductos(productos) {
      if (productos.length === 0) {
        productosGrid.innerHTML = `
          <div class="no-productos" style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <p style="font-size: 18px; color: #666; margin-bottom: 15px;">No se encontraron productos</p>
            <button onclick="mostrarTodosLosProductos()" class="btn-signup">Ver todos los productos</button>
          </div>
        `;
        // Agregar evento al botón de "Ver Todos" en el mensaje de no productos
        document.querySelector('.no-productos .btn-ver-todos').addEventListener('click', mostrarTodosLosProductos);
        return;
      }
      // Limpiar grid antes de renderizar
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
  
      // Agregar eventos a los botones de comprar
      document.querySelectorAll('.btn-agregar').forEach(btn => { // Seleccionar todos los botones
        btn.addEventListener('click', function() { // Usar función normal para mantener el contexto de 'this'
          const productId = this.dataset.id; // Obtener ID del producto desde data-attribute
          agregarAlCarrito(productId); // Agregar producto al carrito
        });
      });
    }
    // Agregar producto al carrito
    function agregarAlCarrito(productId) { // productId es el ID del producto a agregar
      const producto = productosGlobal.find(p => p.id === productId); // Buscar producto por ID
      if (producto) { // Validar que el producto exista
        carrito.push(producto); // Agregar producto al carrito
        localStorage.setItem('carrito', JSON.stringify(carrito)); // Guardar carrito en localStorage
        actualizarCarritoTotal(); // Actualizar total del carrito
        
        // Mostrar feedback con notificación flotante
        mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);// Mostrar notificación
        console.log('Producto agregado al carrito:', producto); // Log para debugging
      }
    }
   // Actualizar el total del carrito en el DOM
    function actualizarCarritoTotal() {
      const total = carrito.reduce((sum, producto) => sum + (producto.precio || 0), 0); // Sumar precios
      carritoTotal.textContent = total.toLocaleString('es-CL'); // Actualizar texto en el DOM con formato peso chileno
    }
    // Mostrar una notificación flotante al agregar al carrito
    function mostrarNotificacion(mensaje) { // mensaje es el texto a mostrar
      const notificacion = document.createElement('div'); // Crear un nuevo div
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
      notificacion.textContent = mensaje; // Establecer el mensaje
      document.body.appendChild(notificacion); // Agregar al body
      
      setTimeout(() => { // Desaparecer después de 3 segundos
        notificacion.remove(); // Remover del DOM
      }, 3000);
    }
    // Configurar eventos de botones y buscador
    function configurarEventos() {
      // Botón Ver Todos
      btnVerTodos.addEventListener('click', mostrarTodosLosProductos);
  
      // Buscador
      btnBuscar.addEventListener('click', buscarProductos);
      buscador.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscarProductos();
      });
  
      // Carrito - mostrar resumen al hacer clic
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
    // Buscar productos por nombre, categoría o descripción
    function buscarProductos() {
      const termino = buscador.value.toLowerCase().trim();
      if (!termino) {
        // Si no hay término, volver a mostrar según categoría activa
        if (categoriaActiva === 'todos') {
          mostrarTodosLosProductos();
        } else {
          filtrarPorCategoria(categoriaActiva);
        }
        return;
      }
      // Filtrar productos que coincidan con el término
      const productosFiltrados = productosGlobal.filter(p => 
        p.nombre?.toLowerCase().includes(termino) ||
        p.categoria?.toLowerCase().includes(termino) ||
        p.descripcion?.toLowerCase().includes(termino)
      );
      // Actualizar título y mostrar resultados
      tituloProductos.textContent = `Resultados para "${termino}" (${productosFiltrados.length})`;
      mostrarProductos(productosFiltrados);
    }
  
    // Funciones globales para debugging
    window.mostrarTodosLosProductos = mostrarTodosLosProductos;
    window.getProductosGlobal = () => productosGlobal;
    window.getCarrito = () => carrito;
  
    console.log("Catálogo inicializado correctamente");
  });