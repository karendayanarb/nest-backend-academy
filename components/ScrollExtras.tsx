'use client';

import { useEffect, useState } from 'react';
import { LuArrowUp } from 'react-icons/lu';

// Barra de progreso de lectura + botón "volver arriba"
export default function ScrollExtras() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? (h.scrollTop / max) * 100 : 0);
      setShowTop(h.scrollTop > 600);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />
      <button
        className={`back-top ${showTop ? '' : 'hidden'}`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Volver arriba"
      >
        <LuArrowUp />
      </button>
    </>
  );
}
