'use client';

import { useState } from 'react';
import { LuPackage, LuGift, LuLock, LuAtom, LuLightbulb } from 'react-icons/lu';
import CodeBlock from './CodeBlock';

const rules = [
  {
    icon: LuPackage,
    title: 'No vender sin stock',
    short: 'Un pedido no puede superar las unidades disponibles.',
    file: 'src/orders/orders.service.ts',
    code: `
// Regla: no se puede pedir más de lo que hay en inventario
private ensureStock(product: Product, quantity: number) {
  if (quantity > product.stock) {
    throw new UnprocessableEntityException(
      \`Solo quedan \${product.stock} unidades de "\${product.name}"\`,
    );
  }
}`,
  },
  {
    icon: LuGift,
    title: 'Descuento por volumen',
    short: '10 o más unidades → 15% de descuento automático.',
    file: 'src/orders/domain/pricing.ts',
    code: `
// Regla pura: fácil de testear, sin base de datos
export const BULK_MIN_UNITS = 10;
export const BULK_DISCOUNT = 0.15;

export function calculateTotal(unitPrice: number, quantity: number): number {
  const subtotal = unitPrice * quantity;
  const discount = quantity >= BULK_MIN_UNITS ? subtotal * BULK_DISCOUNT : 0;
  return Math.round((subtotal - discount) * 100) / 100;
}`,
  },
  {
    icon: LuLock,
    title: 'Estados válidos del pedido',
    short: 'Un pedido enviado ya no se puede cancelar.',
    file: 'src/orders/domain/order-status.ts',
    code: `
export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

// Máquina de estados: qué transiciones están permitidas
const transitions: Record<OrderStatus, OrderStatus[]> = {
  PENDING: [OrderStatus.PAID, OrderStatus.CANCELLED],
  PAID: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  SHIPPED: [],
  CANCELLED: [],
};

export function assertTransition(from: OrderStatus, to: OrderStatus) {
  if (!transitions[from].includes(to)) {
    throw new ConflictException(\`No puedes pasar de \${from} a \${to}\`);
  }
}`,
  },
  {
    icon: LuAtom,
    title: 'Todo o nada (transacciones)',
    short: 'Crear pedido y descontar stock deben ocurrir juntos.',
    file: 'src/orders/orders.service.ts',
    code: `
async create(dto: CreateOrderDto, userId: string): Promise<Order> {
  // Si algo falla, se revierte TODO. Cero inventarios fantasma
  return this.dataSource.transaction(async (manager) => {
    const product = await manager.findOne(Product, {
      where: { id: dto.productId, isActive: true },
      lock: { mode: 'pessimistic_write' }, // evita ventas dobles
    });
    if (!product) throw new NotFoundException('Producto no encontrado');

    this.ensureStock(product, dto.quantity);
    product.stock -= dto.quantity;
    await manager.save(product);

    const order = manager.create(Order, {
      userId,
      product,
      quantity: dto.quantity,
      total: calculateTotal(product.price, dto.quantity),
      status: OrderStatus.PENDING,
    });
    return manager.save(order);
  });
}`,
  },
];

export default function BusinessRules() {
  const [active, setActive] = useState(0);
  const r = rules[active];

  return (
    <div className="rules-layout">
      <div className="rule-list">
        {rules.map((rule, i) => (
          <button
            key={rule.title}
            className={`rule ${i === active ? 'active' : ''}`}
            onClick={() => setActive(i)}
          >
            <span className="rule-icon">
              <rule.icon />
            </span>
            <span>
              <strong>{rule.title}</strong>
              <small>{rule.short}</small>
            </span>
          </button>
        ))}
        <div className="tip">
          <span className="e">
            <LuLightbulb />
          </span>
          <span>
            Regla de oro: si un abogado, contador o el dueño del negocio podría explicarte la regla
            sin saber programar… <strong>es una regla de negocio</strong> y va en el service o en el
            dominio, nunca en el controller.
          </span>
        </div>
      </div>
      <div key={r.title} className="fade-key">
        <CodeBlock code={r.code} file={r.file} />
      </div>
    </div>
  );
}
