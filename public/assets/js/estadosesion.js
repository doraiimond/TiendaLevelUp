document.addEventListener("DOMContentLoaded", () => {
  const estaLogeado = localStorage.getItem("usuarioLogeado");

  const btnLogin = document.querySelector(".btn-login");
  const btnSignup = document.querySelector(".btn-signup");
  const btnLogout = document.querySelector(".btn-logout");

  if (estaLogeado === "true") {
    if (btnLogin) btnLogin.style.display = "none";
    if (btnSignup) btnSignup.style.display = "none";
    if (btnLogout) btnLogout.style.display = "inline-block";
  }

  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      localStorage.removeItem("usuarioLogeado");
      location.reload();
    });
  }
});