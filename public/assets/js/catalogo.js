// =============================
//      CATÁLOGO LEVEL UP
// =============================

document.addEventListener("DOMContentLoaded", () => {

    // =============================
    //     CONFIG FIREBASE
    // =============================
    const firebaseConfig = {
        apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
        authDomain: "levelup-7269f.firebaseapp.com",
        projectId: "levelup-7269f"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // DOM Elements
    const grid = document.getElementById("productosGrid");
    const buscador = document.getElementById("buscador");
    const btnBuscar = document.getElementById("btnBuscar");
    const btnVerTodos = document.getElementById("btnVerTodos");
    const cardsCategorias = document.getElementById("cardsCategorias");
    const dropdownCategorias = document.getElementById("dropdownCategorias");

    let productosGlobal = [];

    // Init
    cargarProductos();
    actualizarTotalCarrito();

    // =============================
    //     CARGAR PRODUCTOS
    // =============================
    async function cargarProductos() {
        try {
            const snapshot = await db.collection("producto").get();
            productosGlobal = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            mostrarProductos(productosGlobal);
            cargarCategorias();

        } catch (e) {
            console.error("Error cargando productos:", e);
            grid.innerHTML = "<p class='error'>No se pudieron cargar los productos.</p>";
        }
    }

    // =============================
    //     MOSTRAR PRODUCTOS
    // =============================
    function mostrarProductos(lista) {
        if (lista.length === 0) {
            grid.innerHTML = `<p class="no-productos">No se encontraron productos.</p>`;
            return;
        }
    
        grid.innerHTML = lista.map(p => {
            const esOferta = p.newprecio !== undefined && p.newprecio !== null;
    
            return `
            <div class="producto-card">
                <img src="${p.imagen}" alt="${p.nombre}" class="producto-imagen">
    
                <div class="producto-info">
                    <h3 class="producto-nombre">${p.nombre}</h3>
    
                    ${
                        esOferta 
                        ? `
                        <p class="producto-precio-oferta">$${p.newprecio.toLocaleString("es-CL")}</p>
                        <p class="producto-precio-original">$${p.precio.toLocaleString("es-CL")}</p>
                        `
                        : `
                        <p class="producto-precio-normal">$${p.precio.toLocaleString("es-CL")}</p>
                        `
                    }
    
                    <p class="producto-stock">Stock: ${p.stock}</p>  <!-- <-- Agregado -->
    
                    <button class="btn-agregar"
                        onclick='agregarAlCarrito("${p.id}", "${p.nombre}", "${p.imagen}", ${esOferta ? p.newprecio : p.precio})'>
                        🛒 Agregar al carrito
                    </button>
                </div>
            </div>`;
        }).join("");
    }
    


    // =============================
    //     CARGAR CATEGORÍAS
    // =============================
    function cargarCategorias() {
        const categorias = [...new Set(productosGlobal.map(p => p.categoria))];

        // Cards grandes
        cardsCategorias.innerHTML = categorias.map(cat => `
            <div class="categoria-card" onclick='filtrarCategoria("${cat}")'>
                <p>${cat}</p>
            </div>
        `).join("");

        // Dropdown
        dropdownCategorias.innerHTML = categorias.map(cat => `
            <a class="dropdown-item" onclick='filtrarCategoria("${cat}")'>${cat}</a>
        `).join("");
    }

    // =============================
    //     FILTRAR POR CATEGORÍA
    // =============================
    window.filtrarCategoria = function (cat) {
        const filtrados = productosGlobal.filter(p => p.categoria === cat);
        document.getElementById("tituloProductos").textContent = `Categoría: ${cat}`;
        mostrarProductos(filtrados);
    };

    // =============================
    //     BUSCADOR
    // =============================
    btnBuscar.addEventListener("click", () => {
        const texto = buscador.value.trim().toLowerCase();

        const filtrados = productosGlobal.filter(p =>
            p.nombre.toLowerCase().includes(texto) ||
            p.categoria.toLowerCase().includes(texto)
        );

        document.getElementById("tituloProductos").textContent = `Resultados para: "${texto}"`;
        mostrarProductos(filtrados);
    });
    btnVerTodos.addEventListener("click", () => {
        document.getElementById("tituloProductos").textContent = "🕹️ Todos los Productos";
        mostrarProductos(productosGlobal);
    });

});

function agregarAlCarrito(id, nombre, imagen, precio) {

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const existente = carrito.find(p => p.id === id);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({
            id,
            nombre,
            imagen,
            precio,
            cantidad: 1
        });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarTotalCarrito();
}

function actualizarTotalCarrito() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    const totalDOM = document.querySelector(".carrito-total");
    if (totalDOM) totalDOM.textContent = total.toLocaleString("es-CL");
}
