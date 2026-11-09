'use client';

import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  LuCake, LuShieldCheck, LuBrain, LuTrafficCone, LuPackage, LuRocket,
  LuChevronLeft, LuChevronRight, LuRotateCcw,
} from 'react-icons/lu';
import CodeBlock from './CodeBlock';

type Step = {
  id: string;
  tab: string;
  icon: IconType;
  title: string;
  desc: string;
  points: string[];
  file: string;
  code: string;
};

const steps: Step[] = [
  {
    id: 'entity',
    tab: '1 · Entidad',
    icon: LuCake,
    title: 'La entidad: tu tabla en código',
    desc: 'La entidad describe cómo se guarda un producto en la base de datos. Usamos TypeORM, pero con Prisma la idea es la misma.',
    points: [
      'Cada propiedad = una columna',
      'Usa tipos precisos (decimal para dinero)',
      'Fechas automáticas con @CreateDateColumn',
    ],
    file: 'src/products/entities/product.entity.ts',
    code: `
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 120 })
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int', { default: 0 })
  stock: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}`,
  },
  {
    id: 'dto',
    tab: '2 · DTO',
    icon: LuShieldCheck,
    title: 'DTO: el portero de tus datos',
    desc: 'Un DTO (Data Transfer Object) define QUÉ datos acepta tu API y los valida antes de que lleguen a tu lógica. ¡Nunca confíes en lo que manda el cliente!',
    points: [
      'class-validator valida cada campo',
      'PartialType reutiliza el DTO para actualizar',
      'Mensajes de error claros para el frontend',
    ],
    file: 'src/products/dto/create-product.dto.ts',
    code: `
import { IsString, IsNumber, IsInt, Min, MaxLength, IsPositive } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  @IsString()
  @MaxLength(120)
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @IsInt()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;
}

// Para PATCH: todos los campos se vuelven opcionales
export class UpdateProductDto extends PartialType(CreateProductDto) {}`,
  },
  {
    id: 'service',
    tab: '3 · Service',
    icon: LuBrain,
    title: 'Service: aquí vive la lógica',
    desc: 'El service es el cerebro. Habla con la base de datos y aplica las reglas de negocio. El controller NO debe tener lógica: solo delega aquí.',
    points: [
      '@Injectable() lo hace inyectable',
      'El repositorio llega por inyección de dependencias',
      'Lanza excepciones HTTP claras (404, 409…)',
    ],
    file: 'src/products/products.service.ts',
    code: `
import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepo: Repository<Product>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    const exists = await this.productsRepo.findOneBy({ name: dto.name });
    if (exists) throw new ConflictException('Ya existe un producto con ese nombre');
    return this.productsRepo.save(this.productsRepo.create(dto));
  }

  findAll(): Promise<Product[]> {
    return this.productsRepo.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepo.findOneBy({ id });
    if (!product) throw new NotFoundException(\`Producto \${id} no encontrado\`);
    return product;
  }

  async update(id: string, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);
    return this.productsRepo.save({ ...product, ...dto });
  }

  async remove(id: string): Promise<void> {
    const product = await this.findOne(id);
    product.isActive = false; // borrado lógico (no se pierde el historial)
    await this.productsRepo.save(product);
  }
}`,
  },
  {
    id: 'controller',
    tab: '4 · Controller',
    icon: LuTrafficCone,
    title: 'Controller: la recepción',
    desc: 'El controller recibe las peticiones HTTP, define las rutas y devuelve respuestas. Delgadito y elegante: recibe, delega, responde.',
    points: [
      'Decoradores para cada verbo HTTP',
      'ParseUUIDPipe valida el id de la URL',
      '@HttpCode para el status correcto',
    ],
    file: 'src/products/products.controller.ts',
    code: `
import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  ParseUUIDPipe, HttpCode, HttpStatus,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Controller('products') // -> /api/products
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}`,
  },
  {
    id: 'module',
    tab: '5 · Module',
    icon: LuPackage,
    title: 'Module: la cajita que lo une todo',
    desc: 'Cada funcionalidad vive en su propio módulo. Así tu app crece ordenada, como cajones bien etiquetados.',
    points: [
      'imports: lo que este módulo necesita',
      'providers: services que se pueden inyectar',
      'exports: lo que compartes con otros módulos',
    ],
    file: 'src/products/products.module.ts',
    code: `
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService], // OrdersModule podrá usarlo
})
export class ProductsModule {}`,
  },
  {
    id: 'main',
    tab: '6 · main.ts',
    icon: LuRocket,
    title: 'main.ts: ¡encendemos la app!',
    desc: 'El punto de entrada. Aquí activamos la validación global, el prefijo /api y CORS para que tu frontend pueda conectarse.',
    points: [
      'whitelist: elimina campos que no están en el DTO',
      'forbidNonWhitelisted: rechaza campos extra',
      'transform: convierte tipos automáticamente',
    ],
    file: 'src/main.ts',
    code: `
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('API lista en http://localhost:3000/api');
}
bootstrap();`,
  },
];

export default function ApiBuilder() {
  const [active, setActive] = useState(0);
  const s = steps[active];
  const Icon = s.icon;

  return (
    <div>
      <div className="tabs" role="tablist">
        {steps.map((st, i) => (
          <button
            key={st.id}
            role="tab"
            aria-selected={i === active}
            className={`tab ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            {st.tab}
          </button>
        ))}
      </div>
      <div className="tab-layout" key={s.id}>
        <div className="tab-explain">
          <div className="tab-icon">
            <Icon />
          </div>
          <h3>{s.title}</h3>
          <p>{s.desc}</p>
          <ul>
            {s.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
            <button
              className="btn btn-ghost"
              style={{ padding: '10px 18px' }}
              disabled={active === 0}
              onClick={() => setActive((a) => Math.max(0, a - 1))}
            >
              <LuChevronLeft /> Anterior
            </button>
            <button
              className="btn btn-primary"
              style={{ padding: '10px 18px' }}
              onClick={() => setActive((a) => (a + 1) % steps.length)}
            >
              {active === steps.length - 1 ? (
                <>
                  <LuRotateCcw /> ¡De nuevo!
                </>
              ) : (
                <>
                  Siguiente <LuChevronRight />
                </>
              )}
            </button>
          </div>
        </div>
        <div className="fade-key">
          <CodeBlock code={s.code} file={s.file} />
        </div>
      </div>
    </div>
  );
}
