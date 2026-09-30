export const BOOK = {
  path: '/livro-rede-habitare', price: 8900, pix: '05.407.750/0001-04',
  cutoff: Date.parse('2026-10-23T00:00:00-03:00'), maxFileBytes: 3_000_000,
  title: 'Rede Habitare — Sonhar e cuidar da parentalidade em situações de vulnerabilidade',
} as const;

export const STATES = {
  AC: 'Acre', AL: 'Alagoas', AP: 'Amapá', AM: 'Amazonas', BA: 'Bahia', CE: 'Ceará',
  DF: 'Distrito Federal', ES: 'Espírito Santo', GO: 'Goiás', MA: 'Maranhão', MT: 'Mato Grosso',
  MS: 'Mato Grosso do Sul', MG: 'Minas Gerais', PA: 'Pará', PB: 'Paraíba', PR: 'Paraná',
  PE: 'Pernambuco', PI: 'Piauí', RJ: 'Rio de Janeiro', RN: 'Rio Grande do Norte',
  RS: 'Rio Grande do Sul', RO: 'Rondônia', RR: 'Roraima', SC: 'Santa Catarina',
  SP: 'São Paulo', SE: 'Sergipe', TO: 'Tocantins',
} as const;
export const PICKUP = { sedes: 'SEDES', vila: 'Livraria da Vila' } as const;
export type Delivery = 'correios' | 'retirada';
export type Buyer = { name: string; email: string; phone: string; cpf: string };
export type Address = { cep: string; street: string; number: string; complement: string; district: string; city: string; uf: string };
export type Order = Buyer & { quantity: number; delivery: Delivery; address: Address | null; pickup: keyof typeof PICKUP | null };
export type Totals = { subtotal: number; freight: number; total: number };
export const money = (cents: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
export const pickupAvailable = (now: number) => now < BOOK.cutoff;
export const digits = (value: string) => value.replace(/\D/g, '');

export function calculate(quantity: number, delivery: string, uf = ''): Totals {
  if (!Number.isSafeInteger(quantity) || quantity < 1) throw new Error('quantity');
  if (delivery !== 'correios' && delivery !== 'retirada') throw new Error('delivery');
  if (delivery === 'correios' && !Object.hasOwn(STATES, uf)) throw new Error('uf');
  const base = uf === 'SP' ? 3070 : ['PR', 'SC', 'RS', 'RJ', 'ES', 'MG', 'DF', 'GO', 'MT', 'MS'].includes(uf) ? 3980 : 4160;
  const freight = delivery === 'retirada' ? 0 : base + (quantity - 1) * (base / 2);
  const subtotal = quantity * BOOK.price;
  const total = subtotal + freight;
  if (![subtotal, freight, total].every(Number.isSafeInteger)) throw new Error('quantity');
  return { subtotal, freight, total };
}

export function validCPF(value: string) {
  const cpf = digits(value);
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  return [9, 10].every(length => {
    const sum = [...cpf.slice(0, length)].reduce((s, n, i) => s + Number(n) * (length + 1 - i), 0);
    const check = (sum * 10) % 11;
    return (check === 10 ? 0 : check) === Number(cpf[length]);
  });
}

export function validateOrder(input: Record<string, unknown>, now: number) {
  const errors: Record<string, string> = {};
  const text = (key: string, max: number, required = true) => {
    const value = typeof input[key] === 'string' ? input[key].trim().replace(/\s+/g, ' ') : '';
    if ((required && !value) || value.length > max || /[\x00-\x1f\x7f]/.test(value)) errors[key] = 'Preencha este campo corretamente.';
    return value;
  };
  const name = text('name', 150);
  const email = text('email', 254);
  const phone = digits(text('phone', 24));
  const cpf = digits(text('cpf', 18));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Informe um e-mail válido.';
  if (!/^(?:55)?\d{10,11}$/.test(phone)) errors.phone = 'Informe o WhatsApp com DDD.';
  if (!validCPF(cpf)) errors.cpf = 'Confira o CPF informado.';
  const quantity = typeof input.quantity === 'string' && !/^\d+$/.test(input.quantity) ? NaN : Number(input.quantity);
  const delivery = input.delivery as Delivery;
  const pickup = input.pickup as keyof typeof PICKUP;
  if (delivery === 'retirada' && !pickupAvailable(now)) errors.delivery = 'A retirada no lançamento não está mais disponível. Escolha Correios e revise o pedido.';
  if (delivery === 'retirada' && !Object.hasOwn(PICKUP, pickup)) errors.pickup = 'Escolha onde retirar seu pedido.';
  let address: Address | null = null;
  if (delivery === 'correios') {
    address = { cep: digits(text('cep', 10)), street: text('street', 180), number: text('number', 20), complement: text('complement', 120, false), district: text('district', 100), city: text('city', 100), uf: text('uf', 2) };
    if (!/^\d{8}$/.test(address.cep)) errors.cep = 'Informe os oito dígitos do CEP.';
  }
  let totals: Totals | null = null;
  try { totals = calculate(quantity, delivery, address?.uf); }
  catch (error) { errors[(error as Error).message] = 'Informe uma quantidade inteira positiva, a modalidade e uma UF válida para entrega.'; }
  const order: Order = { name, email, phone, cpf, quantity, delivery, address, pickup: delivery === 'retirada' ? pickup : null };
  return { order, totals, errors, valid: Object.keys(errors).length === 0 };
}

export function receiptError(file: { size: number; type: string; name: string } | null) {
  if (!file || !file.size) return 'Selecione seu comprovante de pagamento.';
  if (file.size > BOOK.maxFileBytes) return 'O arquivo deve ter até 3 MB.';
  const extension = file.name.split('.').pop()?.toLowerCase();
  const types: Record<string, string[]> = { pdf: ['application/pdf'], jpg: ['image/jpeg'], jpeg: ['image/jpeg'], png: ['image/png'] };
  if (!extension || !types[extension]?.includes(file.type)) return 'Use um arquivo PDF, JPG ou PNG.';
  return '';
}
