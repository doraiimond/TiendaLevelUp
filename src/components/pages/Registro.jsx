import React, { useState } from 'react';
import './Registro.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    correo: '',
    clave: '',
    fecha: ''
  });
  const [mensaje, setMensaje] = useState('');

  /**
   * Maneja cambios en los inputs
   */
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación simple
    if (!formData.run || !formData.nombre || !formData.correo || !formData.clave || !formData.fecha) {
      setMensaje('Todos los campos son obligatorios');
      return;
    }

    // Aquí podrías enviar los datos a Firebase o tu backend
    console.log('Datos del usuario:', formData);
    setMensaje('Registro enviado correctamente');

    // Limpiar formulario
    setFormData({
      run: '',
      nombre: '',
      correo: '',
      clave: '',
      fecha: ''
    });
  };

  return (
    <div className="registro-container">
      <header>
        <nav className="barra-arriba">
          <ul>
            <li><span className="logo">🎮 LEVEL UP</span></li>
            <li><a href="../../index.html" className="marco">Tienda</a></li>
            <li><a href="nosotros.html" className="marco">Nosotros</a></li>
            <li><a href="contacto.html" className="marco">Contacto</a></li>
            <li><a href="login.html" className="marco">Login</a></li>
            <li><a href="catalogo.html" className="marco">Catálogo</a></li>
            <li><a href="carrito.html" className="marco">🛒 Carrito</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="form-section">
          <form className="formulario" onSubmit={handleSubmit}>
            <h2>Registro de Usuario</h2>

            <label htmlFor="run">RUN</label>
            <input
              type="text"
              id="run"
              minLength={7}
              maxLength={9}
              required
              value={formData.run}
              onChange={handleChange}
            />

            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              maxLength={100}
              required
              value={formData.nombre}
              onChange={handleChange}
            />

            <label htmlFor="correo">Correo</label>
            <input
              type="email"
              id="correo"
              maxLength={100}
              required
              value={formData.correo}
              onChange={handleChange}
            />

            <label htmlFor="clave">Clave</label>
            <input
              type="password"
              id="clave"
              minLength={4}
              maxLength={10}
              required
              value={formData.clave}
              onChange={handleChange}
            />

            <label htmlFor="fecha">Fecha de Nacimiento</label>
            <input
              type="date"
              id="fecha"
              required
              value={formData.fecha}
              onChange={handleChange}
            />

            <button type="submit" className="btn-enviar">Enviar</button>
            {mensaje && <p id="mensaje">{mensaje}</p>}
          </form>
        </section>
      </main>

      <footer>
        <a href="https://www.instagram.com/duocuc_cl/" target="_blank" rel="noreferrer">Instagram</a>
        <p>&copy; 2025 LEVEL UP | Tienda Online</p>
      </footer>
    </div>
  );
};

export default Registro;
