'use client';

import { useEffect, useState } from 'react';
import {
  LuMail, LuCable, LuShield, LuTimer, LuFlaskConical, LuTrafficCone,
  LuBrain, LuFireExtinguisher, LuPartyPopper, LuPlay, LuPause,
} from 'react-icons/lu';
import CodeBlock from './CodeBlock';

const stages = [
  {
    e: LuMail,
    name: 'Request',
    desc: 'El cliente (tu app de React, Postman, un celular…) envía una petición HTTP: POST /api/orders con un JSON.',
    file: 'request.http',
    code: `
POST http://localhost:3000/api/orders
Content-Type: application/json
Authorization: Bearer eyJhbGciOi...

{ "productId": "4f9c...", "quantity": 12 }`,
  },
  {
    e: LuCable,
    name: 'Middleware',
    desc: 'Lo primero que toca la petición. Ideal para logs, cabeceras o métricas. No sabe qué controller se va a ejecutar.',
    file: 'logger.middleware.ts',
    code: `
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(\`-> \${req.method} \${req.originalUrl}\`);
    next();
  }
}`,
  },
  {
    e: LuShield,
    name: 'Guards',
    desc: '¿Puedes pasar? Los guards deciden si la petición continúa: autenticación (JWT) y autorización (roles).',
    file: 'roles.guard.ts',
    code: `
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', ctx.getHandler());
    if (!roles) return true;
    const { user } = ctx.switchToHttp().getRequest();
    return roles.includes(user?.role);
  }
}`,
  },
  {
    e: LuTimer,
    name: 'Interceptors',
    desc: 'Envuelven la ejecución: pueden actuar ANTES y DESPUÉS del handler. Perfectos para medir tiempos o transformar respuestas.',
    file: 'timing.interceptor.ts',
    code: `
@Injectable()
export class TimingInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const start = Date.now();
    return next.handle().pipe(
      tap(() => console.log(\`Tiempo: \${Date.now() - start}ms\`)),
    );
  }
}`,
  },
  {
    e: LuFlaskConical,
    name: 'Pipes',
    desc: 'Validan y transforman los datos de entrada. El ValidationPipe revisa tu DTO; ParseUUIDPipe revisa los ids.',
    file: 'orders.controller.ts',
    code: `
@Post()
create(@Body() dto: CreateOrderDto) {
  // si llegamos aquí, dto YA está validado
}

@Get(':id')
findOne(@Param('id', ParseUUIDPipe) id: string) {}`,
  },
  {
    e: LuTrafficCone,
    name: 'Controller',
    desc: 'El handler de la ruta recibe los datos limpios y llama al service. Nada de lógica pesada aquí.',
    file: 'orders.controller.ts',
    code: `
@Post()
@Roles('customer')
create(@Body() dto: CreateOrderDto, @CurrentUser() user: User) {
  return this.ordersService.create(dto, user.id);
}`,
  },
  {
    e: LuBrain,
    name: 'Service',
    desc: 'Se aplican las reglas de negocio: stock, descuentos, estados, transacciones… y se guarda en la base de datos.',
    file: 'orders.service.ts',
    code: `
async create(dto: CreateOrderDto, userId: string) {
  // reglas de negocio + base de datos
  return this.dataSource.transaction(async (m) => { /* ... */ });
}`,
  },
  {
    e: LuFireExtinguisher,
    name: 'Exception Filter',
    desc: 'Si algo explota en cualquier punto, el filtro atrapa el error y responde con un JSON bonito y consistente.',
    file: 'http-exception.filter.ts',
    code: `
@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const status = exception.getStatus();
    res.status(status).json({
      ok: false,
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
    });
  }
}`,
  },
  {
    e: LuPartyPopper,
    name: 'Response',
    desc: '¡Listo! El cliente recibe su respuesta con el status correcto. 201 Created para un pedido nuevo.',
    file: 'response.json',
    code: `
HTTP/1.1 201 Created

{
  "id": "a1b2c3...",
  "quantity": 12,
  "total": 51.0,
  "status": "PENDING"
}`,
  },
];

export default function Lifecycle() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    if (active >= stages.length - 1) {
      setPlaying(false);
      return;
    }
    const t = setTimeout(() => setActive((a) => a + 1), 1400);
    return () => clearTimeout(t);
  }, [playing, active]);

  const s = stages[active];

  return (
    <div>
      <div className="lifecycle">
        {stages.map((st, i) => (
          <button
            key={st.name}
            className={`lc-step ${i === active ? 'active' : i < active ? 'passed' : ''}`}
            onClick={() => {
              setPlaying(false);
              setActive(i);
            }}
          >
            <span className="e">
              <st.e />
            </span>
            <strong>{st.name}</strong>
          </button>
        ))}
      </div>
      <div className="lc-controls">
        <button
          className="btn btn-primary"
          onClick={() => {
            if (active >= stages.length - 1) setActive(0);
            setPlaying((p) => !p);
          }}
        >
          {playing ? (
            <>
              <LuPause /> Pausar
            </>
          ) : (
            <>
              <LuPlay /> Ver el viaje de una petición
            </>
          )}
        </button>
      </div>
      <div className="lc-detail fade-key" key={s.name}>
        <div>
          <span className="lc-big-icon">
            <s.e />
          </span>
          <h3>
            {active + 1}. {s.name}
          </h3>
          <p>{s.desc}</p>
        </div>
        <CodeBlock code={s.code} file={s.file} />
      </div>
    </div>
  );
}
