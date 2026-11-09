# Nest Backend Academy

Página web educativa (hecha con **Next.js + React + TypeScript**) que enseña backend con **NestJS**:
qué es un backend, la arquitectura de NestJS, cómo construir una API REST paso a paso,
cómo aplicar **reglas de negocio**, el ciclo de vida de una petición, seguridad y testing.

Rosita, animada, con **modo claro / oscuro** e iconos de **react-icons** (Lucide), sin emojis.

## Qué incluye

- Hero animado con efecto de máquina de escribir
- Explicación del backend con la analogía del restaurante
- Bloques de NestJS: Modules, Controllers, Services, DI, Pipes, Guards, Interceptors, Filters
- Instalación paso a paso + estructura de carpetas recomendada
- Constructor de API interactivo (Entidad → DTO → Service → Controller → Module → main.ts)
- Buenas prácticas REST: verbos HTTP y status codes
- Reglas de negocio interactivas: stock, descuentos, máquina de estados y transacciones
- Animación del viaje de una petición por NestJS
- Seguridad, configuración con `.env` y testing con Jest
- Quiz con confeti y checklist que guarda tu progreso
- Modo oscuro/claro que recuerda tu preferencia

## Cómo correrlo

Necesitas Node.js 18.18 o superior.

```bash
npm install
npm run dev
```

Abre http://localhost:3000

### Producción

```bash
npm run build
npm start
```

### Versión estática (GitHub Pages, Netlify, Vercel…)

```bash
npm run export   # genera la carpeta /out
```

## Estructura

```
app/
  layout.tsx       # layout, fuentes y script de tema
  page.tsx         # todas las lecciones
  globals.css      # estilos rosados + modo dark/light + animaciones
components/
  ThemeToggle.tsx  # botón sol/luna
  ApiBuilder.tsx   # API paso a paso
  BusinessRules.tsx
  Lifecycle.tsx
  Quiz.tsx
  Checklist.tsx
  ...
lib/highlight.ts   # resaltador de código sin dependencias
```

---

Construido con por **Karen Rojas** · [github.com/karendayanarb](https://github.com/karendayanarb)
