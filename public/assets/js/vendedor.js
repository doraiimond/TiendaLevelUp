// ================== FIREBASE ==================
import { 
  initializeApp 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

import {
  getFirestore, doc, getDoc, updateDoc, collection, query, where, getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
  getAuth, onAuthStateChanged, signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// --- TU CONFIGURACIÓN FIREBASE ---
const firebaseConfig = {
                apiKey: "AIzaSyA-8bvs0ogm0HAqr-ngrC-K21Lxg4WRavI",
                authDomain: "levelup-7269f.firebaseapp.com",
                projectId: "levelup-7269f",
                storageBucket: "levelup-7269f.appspot.com", //actualizar
                messagingSenderId: "500431750193",
                appId: "1:500431750193:web:b4542d0c40934a02034110",
              };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ================== ELEMENTOS ==================
const sections = {
  dashboard: document.getElementById("seccion-dashboard"),
  productos: document.getElementById("seccion-productos"),
  ventas: document.getElementById("seccion-ventas"),
  perfil: document.getElementById("seccion-perfil")
};

const nombreDashboard = document.getElementById("nombreVendedorDashboard");
const vendedorID = document.getElementById("vendedorID");

const tablaProductos = document.getElementById("tablaProductos");
const tablaVentas = document.getElementById("tablaVentas");

// ================== CAMBIO DE SECCIONES ==================
document.querySelectorAll(".menu a").forEach(a => {
  a.addEventListener("click", () => {
    const id = a.id.replace("btn-", "");
    for (let s in sections) sections[s].classList.add("hidden");
    sections[id].classList.remove("hidden");
  });
});

// ================== CARGAR DATOS DEL VENDEDOR ==================
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "/login.html";
    return;
  }

  const docRef = doc(db, "vendedores", user.uid);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    const data = snap.data();
    nombreDashboard.textContent = data.nombre;
    vendedorID.textContent = user.uid;

    cargarProductos(user.uid);
    cargarVentas(user.uid);
  }
});

// ================== EDITAR NOMBRE ==================
document.getElementById("btnGuardarNombre").addEventListener("click", async () => {
  const nuevoNombre = document.getElementById("inputNombre").value.trim();
  const user = auth.currentUser;

  if (nuevoNombre.length < 3) return alert("Nombre muy corto");

  const ref = doc(db, "vendedores", user.uid);
  await updateDoc(ref, { nombre: nuevoNombre });

  nombreDashboard.textContent = nuevoNombre;
  alert("Nombre actualizado ✔");
});

// ================== CARGAR PRODUCTOS ==================
async function cargarProductos(uid) {
  tablaProductos.innerHTML = "";

  const q = query(collection(db, "productos"), where("vendedorID", "==", uid));
  const productos = await getDocs(q);

  productos.forEach(doc => {
    const p = doc.data();

    tablaProductos.innerHTML += `
      <tr>
        <td>${p.nombre}</td>
        <td>$${p.precio}</td>
        <td>${p.stock}</td>
        <td><button class="btn">Ver</button></td>
      </tr>
    `;
  });
}

// ================== CARGAR VENTAS ==================
async function cargarVentas(uid) {
  tablaVentas.innerHTML = "";

  const q = query(collection(db, "ventas"), where("vendedorID", "==", uid));
  const ventas = await getDocs(q);

  ventas.forEach(doc => {
    const v = doc.data();

    tablaVentas.innerHTML += `
      <tr>
        <td>${v.producto}</td>
        <td>${v.fecha}</td>
        <td>$${v.monto}</td>
        <td>${v.cliente}</td>
      </tr>
    `;
  });
}

// ================== LOGOUT ==================
document.getElementById("logout").addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "/login.html";
  });
});
