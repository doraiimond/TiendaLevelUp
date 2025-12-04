document.addEventListener("DOMContentLoaded", () => {

    // CONFIGURACIÓN FIREBASE
    const firebaseConfig = {
        apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
        authDomain: "levelup-7269f.firebaseapp.com",
        projectId: "levelup-7269f"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    const ofertasGrid = document.getElementById("ofertasGrid");

    cargarOfertas();
    actualizarTotalCarrito();
    async function cargarOfertas() {
        try {
            const snapshot = await db.collection("producto").get();
            const productos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            const ofertas = productos.filter(p =>
                p.newprecio !== undefined &&
                p.newprecio !== null &&
                p.newprecio < p.precio
            );

            mostrarOfertas(ofertas);

        } catch (error) {
            console.error("Error cargando ofertas:", error);
            ofertasGrid.innerHTML = "<p class='no-ofertas'>Error al cargar ofertas.</p>";
        }
    }

    function mostrarOfertas(lista) {
        if (lista.length === 0) {
            ofertasGrid.innerHTML = `
                <p class="no-ofertas">No hay ofertas disponibles.</p>
            `;
            return;
        }

        ofertasGrid.innerHTML = lista.map(p => `
            <div class="producto-card">
                <img src="${p.imagen}" class="producto-imagen" alt="${p.nombre}">

                <div class="producto-info">
                    <h3 class="producto-nombre">${p.nombre}</h3>

                    <p class="producto-precio-oferta">$${p.newprecio.toLocaleString("es-CL")}</p>
                    <p class="producto-precio-original">$${p.precio.toLocaleString("es-CL")}</p>

                    <button class="btn-agregar"
                        onclick='agregarAlCarrito("${p.id}", "${p.nombre}", "${p.imagen}", ${p.newprecio})'>
                        🛒 Agregar al carrito
                    </button>
                </div>

            </div>
        `).join("");
    }

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
