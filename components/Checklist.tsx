'use client';

import { useEffect, useState } from 'react';
import { LuCheck, LuRocket, LuDumbbell, LuSprout } from 'react-icons/lu';

const items = [
  'Cada funcionalidad tiene su propio módulo (products, orders, auth…)',
  'Todos los endpoints validan la entrada con DTOs + ValidationPipe',
  'Los controllers son delgados: reciben, delegan y responden',
  'Las reglas de negocio están en services o funciones de dominio',
  'Uso los status codes correctos (201, 400, 401, 404, 409…)',
  'Las operaciones múltiples usan transacciones',
  'Las rutas privadas están protegidas con Guards (JWT + roles)',
  'Los secretos viven en variables de entorno (.env + ConfigModule)',
  'Tengo tests unitarios para las reglas de negocio',
  'Mi API está documentada con Swagger (@nestjs/swagger)',
];

const KEY = 'nest-academy-checklist';

export default function Checklist() {
  const [done, setDone] = useState<boolean[]>(() => items.map(() => false));

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === items.length) setDone(parsed);
      }
    } catch {
      /* ignorar */
    }
  }, []);

  const toggle = (i: number) => {
    setDone((prev) => {
      const next = prev.map((v, j) => (j === i ? !v : v));
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* ignorar */
      }
      return next;
    });
  };

  const count = done.filter(Boolean).length;
  const pct = Math.round((count / items.length) * 100);
  const label =
    pct === 100 ? (
      <><LuRocket /> ¡API lista para producción!</>
    ) : pct >= 60 ? (
      <><LuDumbbell /> ¡Ya casi!</>
    ) : (
      <><LuSprout /> Vamos paso a paso</>
    );

  return (
    <div className="checklist">
      <div className="check-meter">
        <span>{pct}%</span>
        <div className="bar">
          <div style={{ width: `${pct}%` }} />
        </div>
        <span className="meter-label">{label}</span>
      </div>
      {items.map((item, i) => (
        <button key={item} className={`check-item ${done[i] ? 'done' : ''}`} onClick={() => toggle(i)}>
          <span className="check-box">{done[i] ? <LuCheck /> : null}</span>
          <span className="label">{item}</span>
        </button>
      ))}
    </div>
  );
}
