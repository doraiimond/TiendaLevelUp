import React from "react";
import { Link } from "react-router-dom";
import "./contacto.css";

const Contacto = () => {
  return (
    <div className="contacto-container">
      {/* HEADER */}
      <header>
        <nav className="Barra-Arriba">
          <ul>
            <a className="control">🎮 LEVEL UP</a>
            <Link to="/" className="marco">Tienda</Link>
            <Link to="/nosotros" className="marco">Nosotros</Link>
          </ul>
        </nav>
      </header>

      {/* MAIN */}
      <main className="contacto-main">
        <div className="titulo-contacto">
          <h1>Contacto</h1>
          <p>¿Tienes alguna duda o sugerencia? ¡Queremos escucharte!</p>
        </div>

        <form id="formContacto" className="form-contacto">
          <div className="campo">
            <label htmlFor="nombres">Nombres*</label>
            <input
              type="text"
              id="nombres"
              placeholder="Tu nombre completo"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="correo">Correo Electrónico*</label>
            <input
              type="email"
              id="correo"
              placeholder="tunombre@email.com"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="sujeto">Asunto*</label>
            <input
              type="text"
              id="sujeto"
              placeholder="Motivo del mensaje"
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="mensaje">Mensaje*</label>
            <textarea
              id="mensaje"
              rows="5"
              placeholder="Escribe tu mensaje aquí..."
              required
            ></textarea>
          </div>

          <div className="campo-check">
            <input type="checkbox" id="es-humano" required />
            <label htmlFor="es-humano">
              Juro que soy humano y no un robot 🤖*
            </label>
          </div>

          <button type="submit" className="btn-enviar">
            Enviar
          </button>
        </form>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-redes">
          <a href="https://www.instagram.com/duocuc_cl/" target="_blank" rel="noreferrer">
            <i className="bi bi-instagram"></i> Instagram
          </a>
        </div>
        <p>&copy; 2025 Level Up - Tienda Online</p>
      </footer>
    </div>
  );
};

export default Contacto;
