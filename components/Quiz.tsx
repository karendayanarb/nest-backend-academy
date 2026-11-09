'use client';

import { useMemo, useState } from 'react';
import {
  LuTrophy, LuStar, LuRotateCcw, LuCircleCheck, LuLightbulb,
  LuPartyPopper, LuArrowRight, LuSprout,
} from 'react-icons/lu';

const questions = [
  {
    q: '¿Dónde deberían vivir las reglas de negocio en NestJS?',
    options: ['En el Controller', 'En el Service / capa de dominio', 'En el DTO', 'En main.ts'],
    answer: 1,
    why: 'El controller solo recibe y delega. La lógica de negocio vive en el service (o en funciones de dominio) para poder reutilizarla y testearla.',
  },
  {
    q: '¿Qué hace un DTO con class-validator?',
    options: [
      'Conecta con la base de datos',
      'Define y valida los datos que entran a la API',
      'Genera el frontend',
      'Encripta contraseñas',
    ],
    answer: 1,
    why: 'El DTO es el contrato de entrada. Con ValidationPipe, Nest rechaza automáticamente los datos inválidos con un 400.',
  },
  {
    q: 'Creaste un recurso nuevo con POST. ¿Qué status code devuelves?',
    options: ['200 OK', '204 No Content', '201 Created', '302 Found'],
    answer: 2,
    why: '201 Created indica que se creó un recurso. NestJS lo devuelve por defecto en los @Post().',
  },
  {
    q: '¿Qué pieza decide si un usuario tiene permiso para entrar a una ruta?',
    options: ['Un Pipe', 'Un Guard', 'Un Interceptor', 'Un Module'],
    answer: 1,
    why: 'Los Guards implementan CanActivate y deciden si la petición continúa: perfectos para JWT y roles.',
  },
  {
    q: '¿Por qué usar una transacción al crear un pedido y descontar stock?',
    options: [
      'Para que sea más rápido',
      'Para que ambas operaciones ocurran juntas o ninguna',
      'Porque TypeORM lo exige',
      'Para no usar DTOs',
    ],
    answer: 1,
    why: 'Atomicidad: si guardar el pedido falla, el stock no se descuenta. Así tus datos siempre son consistentes.',
  },
  {
    q: '¿Qué hace la opción whitelist: true del ValidationPipe?',
    options: [
      'Permite cualquier IP',
      'Elimina propiedades que no están en el DTO',
      'Desactiva la validación',
      'Activa CORS',
    ],
    answer: 1,
    why: 'Así nadie puede colar campos como "role": "admin" en tu body. ¡Seguridad gratis!',
  },
];

const colors = ['#ec4899', '#a855f7', '#f9a8d4', '#fbbf24', '#34d399', '#c084fc'];

export default function Quiz() {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        color: colors[i % colors.length],
      })),
    // regenerar cada vez que termina el quiz
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [done]
  );

  const q = questions[idx];

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
  };

  const next = () => {
    if (idx === questions.length - 1) setDone(true);
    else {
      setIdx((n) => n + 1);
      setPicked(null);
    }
  };

  const restart = () => {
    setIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  if (done) {
    const perfect = score === questions.length;
    const msg = perfect
      ? '¡PERFECTO! Eres una crack del backend'
      : score >= 4
        ? '¡Muy bien! Ya piensas como backend developer'
        : '¡Vas por buen camino! Repasa y vuelve a intentarlo';
    const Trophy = perfect ? LuTrophy : score >= 4 ? LuStar : LuSprout;
    return (
      <div className="quiz quiz-result">
        {score >= 4 &&
          confetti.map((c, i) => (
            <span
              key={i}
              className="confetti"
              style={{ left: `${c.left}%`, background: c.color, animationDelay: `${c.delay}s` }}
            />
          ))}
        <span className="trophy">
          <Trophy />
        </span>
        <h3>
          {score} / {questions.length}
        </h3>
        <p style={{ color: 'var(--muted)', fontSize: '1.15rem', marginBottom: 22 }}>{msg}</p>
        <button className="btn btn-primary" onClick={restart}>
          <LuRotateCcw /> Intentar de nuevo
        </button>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-progress">
        <div style={{ width: `${((idx + (picked !== null ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>
      <h3 key={idx} className="fade-key">
        {q.q}
      </h3>
      <div className="quiz-options">
        {q.options.map((opt, i) => {
          let cls = 'quiz-opt';
          if (picked !== null) {
            if (i === q.answer) cls += ' correct';
            else if (i === picked) cls += ' wrong';
          }
          return (
            <button key={opt} className={cls} disabled={picked !== null} onClick={() => choose(i)}>
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className="quiz-feedback">
          {picked === q.answer ? <LuCircleCheck className="fb-icon ok" /> : <LuLightbulb className="fb-icon" />}
          <span>
            <strong>{picked === q.answer ? '¡Correcto! ' : 'Casi… '}</strong>
            {q.why}
          </span>
        </div>
      )}
      <div className="quiz-footer">
        <span className="inline-icon">
          Pregunta {idx + 1} de {questions.length} · <LuStar /> {score}
        </span>
        {picked !== null && (
          <button className="btn btn-primary" style={{ padding: '10px 20px' }} onClick={next}>
            {idx === questions.length - 1 ? (
              <>
                Ver resultado <LuPartyPopper />
              </>
            ) : (
              <>
                Siguiente <LuArrowRight />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
