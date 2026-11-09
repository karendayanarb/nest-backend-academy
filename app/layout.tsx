import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Nest Backend Academy | Aprende NestJS, APIs y reglas de negocio',
  description:
    'Aprende backend con NestJS: arquitectura, APIs REST, DTOs, validación, reglas de negocio, seguridad y testing. Construido por Karen Rojas.',
  authors: [{ name: 'Karen Rojas', url: 'https://github.com/karendayanarb' }],
};

// Script que corre antes de pintar para evitar el "flash" de tema incorrecto
const themeScript = `
(function () {
  try {
    var saved = localStorage.getItem('theme');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='24' fill='%23ec4899'/><path d='M50 78 22 50a15 15 0 0 1 28-20 15 15 0 0 1 28 20Z' fill='white'/></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
