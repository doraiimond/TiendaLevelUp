import React from "react";
import { Link } from "react-router-dom";
import "./Nosotros.css";

const Nosotros = () => {
  return (
    <div className="nosotros-container">
      {/* ------------------ NAVBAR ------------------ */}
      <header>
        <nav className="Barra-Arriba">
          <ul>
            <Link className="logo">🎮 LEVEL UP</Link>
            <Link to="/" className="marco">Tienda</Link>
            <Link to="/contacto" className="marco">Contacto</Link>
            <Link to="/perfil" className="marco">Perfil</Link>
          </ul>
        </nav>
      </header>

      {/* ------------------ CONTENIDO ------------------ */}
      <main>
        <section className="nosotros">

          {/* ⭐ Imagen centrada */}
          <div className="imagen-fondo">
            <img 
              src="/image/fondo.png" 
              alt="Fondo Nosotros" 
            />
          </div>

          <h1 className="titulo-nosotros">Sobre Nosotros</h1>
          <p className="subtitulo-nosotros">LevelUp-Gamer</p>

          <div className="contenido-nosotros">

            <p>
              <strong>¿Quiénes Somos?</strong><br />
              En <span className="resaltado">Tienda Gamer LevelUp</span> nos 
              apasionan los videojuegos y la tecnología. Ofrecemos consolas, PC, 
              accesorios y sillas gamers de alta calidad, seleccionados para que 
              disfrutes tus partidas al máximo.
            </p>

            <p>
              Nuestro equipo de gamers está comprometido con tu experiencia,
              brindando asesoría, soporte y las últimas novedades del mundo gamer.
            </p>

            <p>
              <strong>Pasión, calidad e innovación</strong> son los valores que 
              nos definen.
            </p>
          </div>
        </section>
      </main>

      {/* ------------------ FOOTER ------------------ */}
      <footer className="footer-nosotros">
        <a href="https://www.instagram.com/duocuc_cl/" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <p>&copy; 2025 Level Up - Tienda Online</p>
      </footer>
    </div>
  );
};

export default Nosotros;
