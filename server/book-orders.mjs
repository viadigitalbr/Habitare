import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { BOOK, PICKUP, money, pickupAvailable, receiptError, validateOrder } from '../src/lib/book.ts';

export const PRIVACY_VERSION = 'pedido-livro-v1';
const RECIPIENTS = ['ohabitare@gmail.com', 'nathalia.e.machado@gmail.com'];
const MAX_BODY = 3_200_000;
const TOKEN_LIFETIME = 23 * 60 * 60 * 1000; // Less than Resend's 24-hour deduplication window.
const json = (data, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
class RequestError extends Error {
  constructor(code, status = 400, fields = {}) { super(code); this.code = code; this.status = status; this.fields = fields; }
}
const digest = (value, secret) => createHmac('sha256', secret).update(value).digest('base64url');
function sign(value, secret) {
  const payload = Buffer.from(JSON.stringify(value)).toString('base64url');
  return `${payload}.${digest(payload, secret)}`;
}
function verify(token, secret, now) {
  if (typeof token !== 'string' || token.length > 2500) throw new RequestError('review_required', 409);
  const [body, signature, extra] = token.split('.');
  const expected = digest(body || '', secret);
  if (extra || !signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) throw new RequestError('review_required', 409);
  let value;
  try { value = JSON.parse(Buffer.from(body, 'base64url').toString()); } catch { throw new RequestError('review_required', 409); }
  if (now - value.issued >= TOKEN_LIFETIME || value.issued > now + 60_000) throw new RequestError('review_expired', 409);
  return value;
}
function ready(env) {
  return env.BOOK_ORDERS_ENABLED === 'true' && Boolean(env.RESEND_API_KEY && env.BOOK_ORDER_FROM_EMAIL && env.BOOK_ORDER_SECRET?.length >= 32 && env.UPSTASH_REDIS_REST_URL?.startsWith('https://') && env.UPSTASH_REDIS_REST_TOKEN);
}
async function limitedBody(request) {
  if (Number(request.headers.get('content-length')) > MAX_BODY) throw new RequestError('file_too_large', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError('invalid_request');
  const chunks = []; let length = 0;
  for (;;) {
    const { value, done } = await reader.read(); if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY) { await reader.cancel(); throw new RequestError('file_too_large', 413); }
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}
async function rateLimit(request, env, fetcher, now) {
  // Vercel's trusted edge header. No raw IP is stored or sent to Redis.
  const ip = request.headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim() || 'local';
  const key = `book-rate:${digest(ip, env.BOOK_ORDER_SECRET)}:${Math.floor(now / 600_000)}`;
  const response = await fetcher(`${env.UPSTASH_REDIS_REST_URL}/pipeline`, {
    method: 'POST', headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([['INCR', key], ['EXPIRE', key, 660]]), signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new RequestError('service_unavailable', 503);
  const result = await response.json();
  if (!Number.isFinite(result?.[0]?.result) || result.some(item => item.error)) throw new RequestError('service_unavailable', 503);
  if (result[0].result > 20) throw new RequestError('rate_limited', 429);
}
function checkOrigin(request, env) {
  const origins = new Set(['https://redehabitare.org.br', ...(env.BOOK_ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean)]);
  const origin = request.headers.get('origin');
  if (!origin || !origins.has(origin)) throw new RequestError('invalid_origin', 403);
}
function validate(input, now) {
  const result = validateOrder(input, now);
  if (!result.valid) throw new RequestError('invalid_fields', 422, result.errors);
  if (Number(input.reviewedTotal) !== result.totals.total) throw new RequestError('total_changed', 409);
  return result;
}
function fileSignature(bytes, type) {
  if (type === 'application/pdf') return bytes.subarray(0, 5).toString() === '%PDF-';
  if (type === 'image/png') return bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return type === 'image/jpeg' && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255;
}
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
function emailPayload(order, totals, review, file, bytes, env) {
  const date = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'long', timeZone: 'America/Sao_Paulo' }).format(review.issued);
  const rows = [['Pedido', review.id], ['Status', 'Pagamento via Pix aguardando conferência manual'], ['Data da revisão do pedido (São Paulo)', date], ['Nome completo', order.name], ['E-mail', order.email], ['WhatsApp', order.phone], ['CPF', order.cpf], ['Quantidade', order.quantity], ['Valor unitário', money(BOOK.price)], ['Livros', money(totals.subtotal)], ['Frete', money(totals.freight)], ['Total', money(totals.total)], ['Recebimento', order.delivery === 'correios' ? 'Correios — PAC' : 'Retirada no lançamento']];
  if (order.address) for (const [key, label] of Object.entries({ cep: 'CEP', street: 'Endereço', number: 'Número', complement: 'Complemento', district: 'Bairro', city: 'Cidade', uf: 'UF' })) rows.push([label, order.address[key] || '—']);
  if (order.pickup) rows.push(['Local de retirada', PICKUP[order.pickup]]);
  rows.push(['Consentimento', `Aceito para processamento deste pedido — ${PRIVACY_VERSION}`]);
  const extension = file.type === 'application/pdf' ? 'pdf' : file.type === 'image/png' ? 'png' : 'jpg';
  return { from: env.BOOK_ORDER_FROM_EMAIL, to: RECIPIENTS, reply_to: order.email,
    subject: `[Livro Habitare] Novo pedido — ${review.id} — ${order.delivery === 'correios' ? 'Correios' : 'Retirada'}`,
    text: rows.map(([label, value]) => `${label}: ${value}`).join('\n'),
    html: `<h1>Pedido do livro Rede Habitare</h1><dl>${rows.map(([label, value]) => `<dt><strong>${escape(label)}</strong></dt><dd>${escape(value)}</dd>`).join('')}</dl>`,
    attachments: [{ filename: `comprovante-${review.id}.${extension}`, content: bytes.toString('base64') }],
  };
}

export function createBookHandler({ env = process.env, fetcher = fetch, clock = Date.now } = {}) {
  return async function handle(request) {
    const now = clock();
    if (request.method === 'GET') return json({ available: ready(env), now, pickupAvailable: pickupAvailable(now), cutoff: BOOK.cutoff, privacyVersion: PRIVACY_VERSION });
    if (request.method !== 'POST') return json({ code: 'method_not_allowed' }, 405);
    try {
      checkOrigin(request, env);
      if (!ready(env)) throw new RequestError('not_configured', 503);
      await rateLimit(request, env, fetcher, now);
      const body = await limitedBody(request);
      const contentType = request.headers.get('content-type') || '';
      if (contentType.startsWith('application/json')) {
        let input;
        try { input = JSON.parse(body.toString()); } catch { throw new RequestError('invalid_request'); }
        if (!input || typeof input !== 'object' || input.website) throw new RequestError('invalid_request');
        const { order, totals } = validate(input, now);
        const review = { id: randomUUID(), issued: now, hash: digest(JSON.stringify(order), env.BOOK_ORDER_SECRET), total: totals.total, policy: PRIVACY_VERSION };
        return json({ token: sign(review, env.BOOK_ORDER_SECRET), id: review.id, now, totals });
      }
      if (!contentType.startsWith('multipart/form-data')) throw new RequestError('invalid_request');
      let form;
      try { form = await new Response(body, { headers: { 'Content-Type': contentType } }).formData(); } catch { throw new RequestError('invalid_request'); }
      for (const key of form.keys()) if (form.getAll(key).length !== 1) throw new RequestError('invalid_request');
      const input = Object.fromEntries(form);
      if (input.website) throw new RequestError('invalid_request');
      if (input.consent !== 'yes' || input.privacyVersion !== PRIVACY_VERSION) throw new RequestError('invalid_fields', 422, { consent: 'É necessário concordar com o uso dos dados para processar o pedido.' });
      const { order, totals } = validate(input, now);
      const review = verify(input.token, env.BOOK_ORDER_SECRET, now);
      if (review.hash !== digest(JSON.stringify(order), env.BOOK_ORDER_SECRET) || review.total !== totals.total || review.policy !== PRIVACY_VERSION) throw new RequestError('review_required', 409);
      const file = form.get('receipt');
      const fileError = receiptError(file instanceof File ? file : null);
      if (fileError) throw new RequestError(file?.size > BOOK.maxFileBytes ? 'file_too_large' : 'invalid_file', file?.size > BOOK.maxFileBytes ? 413 : 422, { receipt: fileError });
      const bytes = Buffer.from(await file.arrayBuffer());
      if (!fileSignature(bytes, file.type)) throw new RequestError('invalid_file', 422, { receipt: 'O conteúdo do arquivo não corresponde a PDF, JPG ou PNG.' });
      const response = await fetcher('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `livro/${review.id}` }, body: JSON.stringify(emailPayload(order, totals, review, file, bytes, env)), signal: AbortSignal.timeout(15_000) });
      if (!response.ok) throw new RequestError(response.status === 409 ? 'submission_conflict' : 'send_uncertain', response.status === 409 ? 409 : 502);
      const result = await response.json();
      if (!result.id) throw new RequestError('send_uncertain', 502);
      return json({ status: 'aguardando_conferencia', id: review.id, delivery: order.delivery, pickup: order.pickup });
    } catch (error) {
      if (error instanceof RequestError) return json({ code: error.code, fields: error.fields }, error.status);
      // Neither request contents nor provider responses are logged.
      return json({ code: 'send_uncertain' }, 503);
    }
  };
}
