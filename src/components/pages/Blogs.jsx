import React, { useState } from 'react';
import './Blog.css';

const Blog = () => {
  const posts = [
    {
      id: 1,
      titulo: '⚔️ Hollow Knight Silksong provoca una avalancha global',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTs3KH6j382c3KxuokaS3JLZmelvrZUmD_ogg&s',
      descripcion: 'A las 16:00 de este 4 de septiembre ocurrió lo inevitable. Hollow Knight Silksong se ha publicado finalmente, pero nadie puede comprarlo. La avalancha de jugadores provocó la caída simultánea de Steam, eShop, PlayStation Store y Xbox Live. 🌀'
    },
    {
      id: 2,
      titulo: '🚗 GTA VI redefine el concepto de videojuego AAAAA',
      imagen: 'https://alfabetajuega.com/hero/2025/05/gta6.1747223093.7085.jpg?width=768&aspect_ratio=16:9&format=nowebp',
      descripcion: 'Rockstar Games promete que GTA VI será el título más ambicioso de la historia. Con una inversión récord y un mapa vivo, el juego aspira a cambiar la industria para siempre. Muchos ya lo llaman el primer juego “AAAAA” de la historia. 💥'
    },
    {
      id: 3,
      titulo: '🔥 God of War live-action: la filmación está por comenzar',
      imagen: 'https://i.blogs.es/fbb969/god-of-war-ragnarok-lowest-price-1/500_333.jpeg',
      descripcion: 'Tras años de desarrollo, la adaptación de God of War por Amazon Prime iniciará su rodaje este invierno. Cory Barlog supervisará la producción, prometiendo una experiencia épica que honrará la mitología del juego. ⚡'
    }
  ];

  // Estado para almacenar la puntuación de cada post
  const [ratings, setRatings] = useState({});

  const handleStarClick = (postId, value) => {
    setRatings(prev => ({ ...prev, [postId]: value }));
  };

  return (
    <div className="blog-container">
      <header>
        <h1>📰 BLOG LEVEL UP</h1>
        <a href="../../index.html" className="btn-volver">⬅ Volver a la Tienda</a>
      </header>

      <main className="container">
        {posts.map(post => (
          <div key={post.id} className="blog-card">
            <h3>{post.titulo}</h3>
            <img src={post.imagen} alt={post.titulo} />
            <p>{post.descripcion}</p>
            <div className="stars">
              {[1,2,3,4,5].map(value => (
                <span
                  key={value}
                  className={`star ${ratings[post.id] >= value ? 'active' : ''}`}
                  onClick={() => handleStarClick(post.id, value)}
                >
                  ★
                </span>
              ))}
            </div>
          </div>
        ))}
      </main>

      <footer>
        © 2025 <span>LEVEL UP</span> | Tu mundo gamer en evolución constante 🎮
      </footer>
    </div>
  );
};

export default Blog;
