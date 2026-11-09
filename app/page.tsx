import ThemeToggle from '@/components/ThemeToggle';
import Reveal from '@/components/Reveal';
import ScrollExtras from '@/components/ScrollExtras';
import Typewriter from '@/components/Typewriter';
import CodeBlock from '@/components/CodeBlock';
import ApiBuilder from '@/components/ApiBuilder';
import BusinessRules from '@/components/BusinessRules';
import Lifecycle from '@/components/Lifecycle';
import Quiz from '@/components/Quiz';
import Checklist from '@/components/Checklist';
import Motivation from '@/components/Motivation';
import type { IconType } from 'react-icons';
import {
  LuServer, LuPlug, LuDatabase, LuBrain, LuPackage, LuTrafficCone, LuSyringe,
  LuFlaskConical, LuShield, LuTimer, LuFireExtinguisher, LuBlocks, LuFileCode,
  LuPuzzle, LuRocket, LuHeart, LuSparkles, LuZap, LuUser, LuChefHat, LuCake,
  LuArrowRight, LuLightbulb, LuUtensils, LuTarget, LuHouse, LuKeyRound, LuSalad,
  LuSprout, LuGauge, LuFolderTree, LuBookOpen, LuGithub, LuCircleCheck, LuCircleX,
  LuThumbsUp, LuThumbsDown, LuCat, LuLaptop, LuSearch, LuBan, LuRuler, LuFlame,
  LuHourglass, LuTriangleAlert, LuFlower2,
} from 'react-icons/lu';

// Tarjeta reutilizable con icono
function IconCard({ icon: Icon, title, text, center = false }: { icon: IconType; title: string; text: string; center?: boolean }) {
  return (
    <div className="card" style={center ? { textAlign: 'center' } : undefined}>
      <div className="icon" style={center ? { margin: '0 auto 16px' } : undefined}>
        <Icon />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
    </div>
  );
}

const GITHUB = 'https://github.com/karendayanarb';

const GithubIcon = () => <LuGithub size={18} aria-hidden="true" />;
const heroCode = `
@Controller('pasteles')
export class PastelesController {
  constructor(private readonly service: PastelesService) {}

  @Get()
  findAll() {
    return this.service.findAll(); // lista de pasteles
  }

  @Post()
  create(@Body() dto: CreatePastelDto) {
    return this.service.create(dto); // 201 Created
  }
}`;

const folderTree = `
src/
├── main.ts                  # arranque de la app
├── app.module.ts            # módulo raíz
├── common/                  # cosas compartidas
│   ├── filters/             #    manejo global de errores
│   ├── guards/              #    autenticación y roles
│   └── interceptors/        #    logs, tiempos, transformaciones
├── config/                  # configuración y variables de entorno
├── products/                # un módulo por funcionalidad
│   ├── dto/
│   ├── entities/
│   ├── products.controller.ts
│   ├── products.service.ts
│   ├── products.service.spec.ts   # tests
│   └── products.module.ts
└── orders/
    ├── domain/              # reglas de negocio puras
    ├── dto/
    ├── entities/
    ├── orders.controller.ts
    ├── orders.service.ts
    └── orders.module.ts`;

const configCode = `
// app.module.ts — configuración segura con variables de entorno
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false, // en producción usa migraciones
      }),
    }),
    ProductsModule,
    OrdersModule,
    AuthModule,
  ],
})
export class AppModule {}`;

const authCode = `
// Proteger una ruta con JWT + roles
@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Patch(':id/ship')
  @Roles('admin') // solo admins pueden marcar como enviado
  ship(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.changeStatus(id, OrderStatus.SHIPPED);
  }
}`;

const testCode = `
// pricing.spec.ts — las reglas de negocio se testean solitas
import { calculateTotal } from './pricing';

describe('calculateTotal', () => {
  it('no aplica descuento con menos de 10 unidades', () => {
    expect(calculateTotal(5, 9)).toBe(45);
  });

  it('aplica 15% de descuento desde 10 unidades', () => {
    expect(calculateTotal(5, 10)).toBe(42.5);
  });

  it('redondea a 2 decimales', () => {
    expect(calculateTotal(3.33, 12)).toBe(33.97);
  });
});`;

export default function Home() {
  return (
    <>
      <ScrollExtras />

      {/* ================= NAV ================= */}
      <nav className="nav">
        <div className="container nav-inner">
          <a href="#inicio" className="brand">
            <span className="brand-logo"><LuCat /></span>
            Nest Academy
          </a>
          <ul className="nav-links">
            <li><a href="#backend">Backend</a></li>
            <li><a href="#nestjs">NestJS</a></li>
            <li><a href="#api">Tu API</a></li>
            <li><a href="#reglas">Reglas de negocio</a></li>
            <li><a href="#ciclo">Ciclo de vida</a></li>
            <li><a href="#quiz">Quiz</a></li>
          </ul>
          <div className="nav-right">
            <ThemeToggle />
            <a className="github-btn" href={GITHUB} target="_blank" rel="noopener noreferrer">
              <GithubIcon />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <header className="hero" id="inicio">
        <div className="blob b1" />
        <div className="blob b2" />
        <div className="blob b3" />
        <div className="container hero-grid">
          <Reveal>
            <span className="pill">
              <span className="dot" /> Guía 100% en español · gratis
            </span>
            <h1>
              Aprende <span className="gradient-text">Backend</span> con NestJS y crea APIs{' '}
              <Typewriter words={['profesionales', 'seguras', 'escalables', 'hermosas']} />
            </h1>
            <p className="lead">
              Desde “¿qué es un servidor?” hasta reglas de negocio, transacciones, seguridad y
              testing. Explicado con cariño, ejemplos reales y mucho rosa.
            </p>
            <div className="hero-ctas">
              <a href="#backend" className="btn btn-primary"><LuSparkles /> Empezar a aprender</a>
              <a href="#api" className="btn btn-ghost"><LuLaptop /> Ir directo al código</a>
            </div>
            <div className="hero-stats">
              <div><strong>10</strong><span>lecciones</span></div>
              <div><strong>25+</strong><span>ejemplos de código</span></div>
              <div><strong>∞</strong><span>motivación</span></div>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div style={{ position: 'relative' }}>
              <span className="floating-emoji" style={{ top: -30, left: -20 }}><LuRocket /></span>
              <span className="floating-emoji" style={{ bottom: -26, right: -10, animationDelay: '1.2s' }}><LuHeart /></span>
              <span className="floating-emoji" style={{ top: '40%', right: -34, animationDelay: '2s' }}><LuZap /></span>
              <div className="hero-card">
                <CodeBlock code={heroCode} file="pasteles.controller.ts" />
              </div>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ================= ¿QUÉ ES BACKEND? ================= */}
      <section className="block" id="backend">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 1</span>
            <h2>¿Qué es el <span className="gradient-text">Backend</span>?</h2>
            <p>
              Es todo lo que pasa “detrás del telón”: el servidor que recibe peticiones, guarda
              datos, aplica las reglas del negocio y responde. El frontend es lo que ves; el
              backend es lo que hace que funcione.
            </p>
          </Reveal>
          <div className="grid grid-4">
            {[
              [LuServer, 'Servidor', 'Un programa que siempre está escuchando peticiones en un puerto (ej. 3000).'],
              [LuPlug, 'API', 'El “menú” de operaciones que tu backend ofrece: rutas + verbos HTTP + JSON.'],
              [LuDatabase, 'Base de datos', 'Donde viven los datos de forma permanente: PostgreSQL, MySQL, MongoDB…'],
              [LuBrain, 'Lógica de negocio', 'Las reglas que hacen único a tu negocio: precios, permisos, estados…'],
            ].map(([icon, title, text], i) => (
              <Reveal key={title as string} delay={i * 100}>
                <IconCard icon={icon as IconType} title={title as string} text={text as string} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="analogy">
              <div className="analogy-item">
                <span className="big"><LuUser /></span>
                <strong>Cliente</strong>
                <small>El frontend pide algo</small>
              </div>
              <div className="analogy-arrow"><LuArrowRight /></div>
              <div className="analogy-item">
                <span className="big" style={{ animationDelay: '.4s' }}><LuChefHat /></span>
                <strong>Backend</strong>
                <small>Cocina con reglas y recetas</small>
              </div>
              <div className="analogy-arrow"><LuArrowRight /></div>
              <div className="analogy-item">
                <span className="big" style={{ animationDelay: '.8s' }}><LuCake /></span>
                <strong>Respuesta</strong>
                <small>El pedido llega en JSON</small>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="tip">
              <span className="e"><LuUtensils /></span>
              <span>
                Piensa en un restaurante: el <strong>menú</strong> es la API, el{' '}
                <strong>mesero</strong> es el controller, la <strong>cocina</strong> es el service
                con sus recetas (reglas de negocio) y la <strong>despensa</strong> es la base de datos.
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= NESTJS ================= */}
      <section className="block alt" id="nestjs">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 2</span>
            <h2>¿Qué es <span className="gradient-text">NestJS</span>?</h2>
            <p>
              Un framework de Node.js con TypeScript para construir backends ordenados, escalables y
              fáciles de mantener. Inspirado en Angular: módulos, decoradores e inyección de
              dependencias. ¡Te da estructura desde el día uno!
            </p>
          </Reveal>
          <div className="grid grid-4">
            {[
              [LuPackage, 'Modules', 'Agrupan funcionalidades relacionadas. Tu app es un árbol de módulos.'],
              [LuTrafficCone, 'Controllers', 'Reciben peticiones HTTP y definen las rutas de tu API.'],
              [LuBrain, 'Providers / Services', 'Contienen la lógica de negocio y el acceso a datos.'],
              [LuSyringe, 'Inyección de dependencias', 'Nest crea y entrega las instancias por ti. Cero “new” manuales.'],
              [LuFlaskConical, 'Pipes', 'Validan y transforman datos de entrada (DTOs, ids…).'],
              [LuShield, 'Guards', 'Deciden si una petición puede pasar: login, roles, permisos.'],
              [LuTimer, 'Interceptors', 'Actúan antes y después del handler: logs, caché, formato.'],
              [LuFireExtinguisher, 'Exception Filters', 'Atrapan errores y responden con un formato consistente.'],
            ].map(([icon, title, text], i) => (
              <Reveal key={title as string} delay={(i % 4) * 100}>
                <IconCard icon={icon as IconType} title={title as string} text={text as string} />
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="grid grid-3" style={{ marginTop: 40 }}>
              {[
                [LuBlocks, 'Estructura clara', 'Todo el equipo sabe dónde va cada cosa.'],
                [LuFileCode, 'TypeScript nativo', 'Errores detectados antes de ejecutar.'],
                [LuPuzzle, 'Ecosistema enorme', 'TypeORM, Prisma, GraphQL, WebSockets, microservicios…'],
              ].map(([icon, title, text]) => (
                <IconCard key={title as string} icon={icon as IconType} title={title as string} text={text as string} center />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= INSTALACIÓN ================= */}
      <section className="block" id="instalar">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 3</span>
            <h2>Manos a la obra: <span className="gradient-text">tu primer proyecto</span></h2>
            <p>Solo necesitas Node.js (versión LTS) y ganas de aprender. ¡En 5 minutos tienes tu API corriendo!</p>
          </Reveal>
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <div className="steps">
              {[
                ['Instala el CLI de Nest', 'La herramienta que crea proyectos y genera código por ti.', 'npm i -g @nestjs/cli'],
                ['Crea tu proyecto', 'Elige npm cuando te pregunte el gestor de paquetes.', 'nest new tienda-api\ncd tienda-api'],
                ['Genera un recurso completo', 'Crea módulo, controller, service, DTOs y entidad en un solo comando', 'nest g resource products'],
                ['Instala validación y base de datos', 'Para DTOs con reglas y conexión a PostgreSQL.', 'npm i class-validator class-transformer @nestjs/mapped-types\nnpm i @nestjs/typeorm typeorm pg @nestjs/config'],
                ['¡Enciende el servidor!', 'Modo watch: se reinicia solo cada vez que guardas.', 'npm run start:dev'],
              ].map(([title, text, cmd], i) => (
                <Reveal key={title} delay={i * 80}>
                  <div className="step">
                    <div className="step-num">{i + 1}</div>
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                      <CodeBlock code={cmd} file="terminal" lang="bash" />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={150}>
              <h3 className="h-icon" style={{ fontSize: '1.4rem', marginBottom: 12 }}><LuFolderTree /> Una estructura de carpetas ordenada</h3>
              <p style={{ color: 'var(--muted)', marginBottom: 16 }}>
                Organiza por <strong>funcionalidad</strong> (products, orders), no por tipo de
                archivo. Así cada módulo es independiente y fácil de encontrar.
              </p>
              <CodeBlock code={folderTree} file="estructura" lang="bash" />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================= API PASO A PASO ================= */}
      <section className="block alt" id="api">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 4</span>
            <h2>Construye una <span className="gradient-text">API REST</span> paso a paso</h2>
            <p>
              Vamos a crear la API de una pastelería: productos con nombre, precio y stock. Recorre
              cada pestaña: cada archivo tiene una responsabilidad muy clara.
            </p>
          </Reveal>
          <Reveal>
            <ApiBuilder />
          </Reveal>
        </div>
      </section>

      {/* ================= REST ================= */}
      <section className="block" id="rest">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 5</span>
            <h2>Diseña tu API <span className="gradient-text">correctamente</span></h2>
            <p>
              Una buena API es predecible: usa sustantivos en plural para las rutas, el verbo HTTP
              indica la acción y el status code cuenta qué pasó.
            </p>
          </Reveal>
          <Reveal>
            <table className="http-table">
              <thead>
                <tr><th>Verbo</th><th>Ruta</th><th>¿Qué hace?</th><th>Respuesta</th></tr>
              </thead>
              <tbody>
                <tr><td><span className="method m-get">GET</span></td><td><code>/api/products</code></td><td>Lista todos los productos</td><td>200 OK</td></tr>
                <tr><td><span className="method m-get">GET</span></td><td><code>/api/products/:id</code></td><td>Obtiene uno por id</td><td>200 / 404</td></tr>
                <tr><td><span className="method m-post">POST</span></td><td><code>/api/products</code></td><td>Crea un producto</td><td>201 Created</td></tr>
                <tr><td><span className="method m-patch">PATCH</span></td><td><code>/api/products/:id</code></td><td>Actualiza parcialmente</td><td>200 OK</td></tr>
                <tr><td><span className="method m-put">PUT</span></td><td><code>/api/products/:id</code></td><td>Reemplaza completo</td><td>200 OK</td></tr>
                <tr><td><span className="method m-delete">DELETE</span></td><td><code>/api/products/:id</code></td><td>Elimina (o desactiva)</td><td>204 No Content</td></tr>
              </tbody>
            </table>
          </Reveal>
          <Reveal>
            <div className="status-grid">
              {[
                ['200', LuCircleCheck, 'Todo bien', 'var(--mint)'],
                ['201', LuSparkles, 'Creado', 'var(--mint)'],
                ['400', LuCircleX, 'Datos inválidos', 'var(--warn)'],
                ['401', LuKeyRound, 'No autenticada', 'var(--warn)'],
                ['403', LuBan, 'Sin permiso', 'var(--warn)'],
                ['404', LuSearch, 'No existe', 'var(--warn)'],
                ['409', LuTriangleAlert, 'Conflicto', 'var(--warn)'],
                ['422', LuRuler, 'Regla incumplida', 'var(--warn)'],
                ['429', LuHourglass, 'Demasiadas peticiones', 'var(--warn)'],
                ['500', LuFlame, 'Error del servidor', 'var(--danger)'],
              ].map(([code, Icon, label, color]) => {
                const I = Icon as IconType;
                return (
                  <div className="status" key={code as string}>
                    <strong style={{ color: color as string }}>{code as string}</strong>
                    <span className="inline-icon"><I /> {label as string}</span>
                  </div>
                );
              })}
            </div>
          </Reveal>
          <Reveal>
            <div className="tip">
              <span className="e"><LuFlower2 /></span>
              <span>
                Rutas con sustantivos, no verbos: <code>POST /orders</code> (bien) en lugar de{' '}
                <code>POST /createOrder</code> (mal). Para acciones especiales usa sub-recursos:{' '}
                <code>PATCH /orders/:id/cancel</code>.
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= REGLAS DE NEGOCIO ================= */}
      <section className="block alt" id="reglas">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 6 · la más importante</span>
            <h2>Las <span className="gradient-text">reglas de negocio</span></h2>
            <p>
              Son las políticas que definen cómo funciona tu negocio en la vida real. El CRUD lo
              hace cualquiera; aplicar bien las reglas es lo que te convierte en backend developer
              profesional.
            </p>
          </Reveal>
          <div className="grid grid-3" style={{ marginBottom: 40 }}>
            {[
              [LuTarget, 'Validación ≠ regla de negocio', 'Validar es “el precio es un número positivo” (DTO). La regla es “no puedes vender más de lo que hay en stock” (service).'],
              [LuHouse, 'Un solo hogar', 'Cada regla vive en UN lugar (service o dominio). Si la copias en varios sitios, tarde o temprano se contradicen.'],
              [LuFlaskConical, 'Testeable', 'Escribe las reglas como funciones puras cuando puedas: entra un dato, sale un resultado. Fáciles de probar.'],
            ].map(([icon, title, text], i) => (
              <Reveal key={title as string} delay={i * 100}>
                <IconCard icon={icon as IconType} title={title as string} text={text as string} />
              </Reveal>
            ))}
          </div>
          <Reveal>
            <h3 style={{ fontSize: '1.5rem', marginBottom: 18, textAlign: 'center' }}>
              Toca cada regla para ver cómo se implementa
            </h3>
            <BusinessRules />
          </Reveal>
          <Reveal>
            <div className="do-dont">
              <div className="do">
                <h3 className="h-icon"><LuThumbsUp /> Sí hazlo</h3>
                <ul>
                  <li><LuCircleCheck /> Reglas en services o en una carpeta <code>domain/</code></li>
                  <li><LuCircleCheck /> Excepciones con mensajes claros (409, 422)</li>
                  <li><LuCircleCheck /> Constantes con nombre (<code>BULK_MIN_UNITS</code>)</li>
                  <li><LuCircleCheck /> Transacciones cuando tocas varias tablas</li>
                  <li><LuCircleCheck /> Tests para cada regla</li>
                </ul>
              </div>
              <div className="dont">
                <h3 className="h-icon"><LuThumbsDown /> Evítalo</h3>
                <ul>
                  <li><LuCircleX /> Lógica dentro del controller</li>
                  <li><LuCircleX /> Confiar en que el frontend ya validó</li>
                  <li><LuCircleX /> Números mágicos (<code>if (qty &gt; 10)</code>)</li>
                  <li><LuCircleX /> Devolver 500 para errores del usuario</li>
                  <li><LuCircleX /> Calcular precios con datos que manda el cliente</li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= CICLO DE VIDA ================= */}
      <section className="block" id="ciclo">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 7</span>
            <h2>El viaje de una <span className="gradient-text">petición</span></h2>
            <p>
              Cuando llega una petición, NestJS la pasa por varias “estaciones” en un orden fijo.
              Entender este orden te ayuda a saber dónde poner cada cosa.
            </p>
          </Reveal>
          <Reveal>
            <Lifecycle />
          </Reveal>
        </div>
      </section>

      {/* ================= SEGURIDAD Y TESTING ================= */}
      <section className="block alt" id="seguridad">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 8 y 9</span>
            <h2>Seguridad, configuración y <span className="gradient-text">testing</span></h2>
            <p>Una API profesional protege sus datos, no expone secretos y tiene tests que te dejan dormir tranquila.</p>
          </Reveal>
          <div className="grid grid-4" style={{ marginBottom: 36 }}>
            {[
              [LuKeyRound, 'JWT', 'Autentica usuarios con tokens firmados (@nestjs/jwt + passport).'],
              [LuSalad, 'Contraseñas hasheadas', 'Nunca guardes contraseñas en texto plano: usa bcrypt o argon2.'],
              [LuSprout, 'Variables de entorno', 'Secretos y URLs en .env con @nestjs/config. Nunca en el código.'],
              [LuGauge, 'Rate limiting', 'Limita peticiones por IP con @nestjs/throttler contra abusos.'],
            ].map(([icon, title, text], i) => (
              <Reveal key={title as string} delay={i * 100}>
                <IconCard icon={icon as IconType} title={title as string} text={text as string} />
              </Reveal>
            ))}
          </div>
          <div className="grid grid-2" style={{ alignItems: 'start' }}>
            <Reveal><CodeBlock code={configCode} file="src/app.module.ts" /></Reveal>
            <Reveal delay={120}><CodeBlock code={authCode} file="src/orders/orders.controller.ts" /></Reveal>
          </div>
          <Reveal>
            <div className="grid grid-2" style={{ alignItems: 'center', marginTop: 36 }}>
              <div>
                <h3 className="h-icon" style={{ fontSize: '1.6rem', marginBottom: 10 }}><LuFlaskConical /> Testea tus reglas de negocio</h3>
                <p style={{ color: 'var(--muted)', marginBottom: 12 }}>
                  NestJS viene con Jest listo. Como escribimos <code>calculateTotal</code> como
                  función pura, probarla es facilísimo. Ejecuta <code>npm run test</code> y mira
                  todo en verde.
                </p>
                <div className="tip" style={{ marginTop: 0 }}>
                  <span className="e"><LuBookOpen /></span>
                  <span>
                    Extra: documenta tu API con <code>@nestjs/swagger</code> y tendrás una página
                    interactiva en <code>/api/docs</code> para probar cada endpoint.
                  </span>
                </div>
              </div>
              <CodeBlock code={testCode} file="src/orders/domain/pricing.spec.ts" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================= QUIZ ================= */}
      <section className="block" id="quiz">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Lección 10</span>
            <h2>¿Qué tanto aprendiste? <span className="gradient-text">¡Quiz!</span></h2>
            <p>6 preguntas para poner a prueba tu cerebrito backend. ¡Sin presión!</p>
          </Reveal>
          <Reveal><Quiz /></Reveal>
        </div>
      </section>

      {/* ================= CHECKLIST ================= */}
      <section className="block alt" id="checklist">
        <div className="container">
          <Reveal className="section-head">
            <span className="section-tag">Bonus</span>
            <h2>Checklist de una <span className="gradient-text">API top</span></h2>
            <p>Marca lo que ya cumple tu proyecto. Tu progreso se guarda en este navegador.</p>
          </Reveal>
          <Reveal><Checklist /></Reveal>
        </div>
      </section>

      {/* ================= MOTIVACIÓN ================= */}
      <section className="block">
        <div className="container">
          <Reveal><Motivation /></Reveal>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer>
        <div className="container footer-inner">
          <p className="made-by">
            Construido con <span className="heart"><LuHeart /></span> por <strong className="gradient-text">Karen Rojas</strong>
          </p>
          <a className="author-card" href={GITHUB} target="_blank" rel="noopener noreferrer">
            <span className="avatar">KR</span>
            <span style={{ textAlign: 'left' }}>
              <strong>Karen Rojas</strong>
              <small>github.com/karendayanarb</small>
            </span>
            <GithubIcon />
          </a>
          <p className="footer-small">
            Hecho con Next.js · Enseñando NestJS · © {new Date().getFullYear()} Karen Rojas
          </p>
        </div>
      </footer>
    </>
  );
}
