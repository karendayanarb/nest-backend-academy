'use client';

import { useState } from 'react';
import { LuSparkles, LuHeart, LuStar, LuFlower2, LuQuote, LuDumbbell } from 'react-icons/lu';

const quotes = [
  'Cada error en consola es una lección disfrazada.',
  'Tu primer endpoint no tiene que ser perfecto, tiene que existir.',
  'Las grandes APIs empiezan con un simple GET /hello.',
  'Debuggear también es programar. ¡Y lo estás haciendo genial!',
  'Hoy un CRUD, mañana arquitectura de microservicios.',
  'No compares tu capítulo 1 con el capítulo 20 de alguien más.',
];

export default function Motivation() {
  const [i, setI] = useState(0);

  return (
    <div className="motivation">
      <span className="sparkle" style={{ top: '14%', left: '8%' }}>
        <LuSparkles />
      </span>
      <span className="sparkle" style={{ top: '70%', left: '14%', animationDelay: '1s' }}>
        <LuHeart />
      </span>
      <span className="sparkle" style={{ top: '20%', right: '10%', animationDelay: '0.5s' }}>
        <LuFlower2 />
      </span>
      <span className="sparkle" style={{ bottom: '16%', right: '16%', animationDelay: '1.6s' }}>
        <LuStar />
      </span>
      <div className="motivation-icon">
        <LuDumbbell />
      </div>
      <h2>¡Tú puedes con el backend!</h2>
      <p>
        Todas las desarrolladoras que admiras empezaron sin saber qué era un endpoint. La
        constancia vale más que el talento.
      </p>
      <p className="quote" key={i} style={{ animation: 'popIn .4s ease' }}>
        <LuQuote className="quote-mark" /> {quotes[i]}
      </p>
      <button className="btn" onClick={() => setI((n) => (n + 1) % quotes.length)}>
        <LuSparkles /> Dame otra dosis de motivación
      </button>
    </div>
  );
}
