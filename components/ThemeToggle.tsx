'use client';

import { useEffect, useState } from 'react';
import { LuSun, LuMoon } from 'react-icons/lu';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'dark' : 'light');
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* almacenamiento no disponible */
    }
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
    >
      <span className="icons">
        <LuSun />
        <LuMoon />
      </span>
      <span className="knob">{theme === 'dark' ? <LuMoon /> : <LuSun />}</span>
    </button>
  );
}
