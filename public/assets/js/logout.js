if (!firebase.apps.length) {
    const firebaseConfig = {
    apiKey: "AIzaSyDSUIyg4O-6OGemNJYVgtFiNRWTb4tmsRY",
    authDomain: "levelup-7269f.firebaseapp.com",
    projectId: "levelup-7269f",
    storageBucket: "levelup-7269f.appspot.com", // ✅ corregido
    messagingSenderId: "420067821053",
    appId: "1:420067821053:web:ee83cc9a8ba7e86f88c594",
    measurementId: "G-JRZ3GS13XN"
  };

    firebase.initializeApp(firebaseConfig);
}


function cerrarSesion() {
    firebase.auth().signOut()
        .then(() => {
            console.log("Sesión cerrada correctamente.");

            window.location.href = "../../assets/page/login.html"; 
        })
        .catch(error => {
            console.error("Error al cerrar sesión:", error);
            alert("No se pudo cerrar sesión. Revisa la consola.");
        });
}
function irATienda() {
    window.location.href = "../../index.html"; 
}
