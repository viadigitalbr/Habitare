import { BOOK, PICKUP, calculate, money, pickupAvailable, receiptError, validateOrder, type Totals } from '../lib/book';
import { trackBook } from '../lib/analytics';

const root = document.querySelector<HTMLElement>('[data-book-order]')!;
const $ = <T extends HTMLElement = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
const form = $<HTMLFormElement>('form');
const editable = $<HTMLFieldSetElement>('[data-order-fields]');
const payment = $<HTMLFieldSetElement>('[data-payment]');
const next = $<HTMLButtonElement>('[data-continue]');
const submit = $<HTMLButtonElement>('[data-submit]');
const receipt = $<HTMLInputElement>('[name=receipt]');
const quantity = $<HTMLInputElement>('[name=quantity]');
const endpoint = '/api/pedidos-livro';
const summary = $('.book-summary');
const mobileCheckout = matchMedia('(max-width: 760px)');
let available = false;
let statusKnown = false;
let localPreview = false;
const canPreview = import.meta.env.DEV && ['localhost', '127.0.0.1'].includes(location.hostname);
let serverTime: number | null = null;
let serverSyncedAt = 0;
let token: string | null = null;
let totals: Totals | null = null;
let busy = false;
let pending: FormData | null = null;
let started = false;
let complete = false;
let reviewedDelivery = '';
let reviewedPickup = '';
let cutoffTimer: ReturnType<typeof setTimeout> | undefined;
let currentStep = 1;
const currentTime = () => serverTime === null ? Date.now() : serverTime + performance.now() - serverSyncedAt;
const input = () => Object.fromEntries(new FormData(form).entries()) as Record<string, unknown>;
function placeSummary() {
  const screen = $(`[data-screen="${currentStep}"]`);
  if (mobileCheckout.matches) screen.insertBefore(summary, screen.querySelector('.book-step-actions'));
  else $('.book-checkout').append(summary);
}
function step(number: number, focus = true) {
  currentStep = number;
  root.querySelectorAll<HTMLElement>('[data-step]').forEach(item => {
    item.removeAttribute('aria-current');
    item.classList.toggle('is-complete', Number(item.dataset.step) < number);
    if (item.dataset.step === String(number)) item.setAttribute('aria-current', 'step');
  });
  root.querySelectorAll<HTMLElement>('[data-screen]').forEach(screen => { screen.hidden = Number(screen.dataset.screen) !== number; });
  editable.hidden = number === 3;
  payment.disabled = number !== 3 || (!token && !localPreview);
  placeSummary();
  $('[data-step-announcement]').textContent = `Etapa ${number} de 3: ${['Seu pedido', 'Seus dados', 'Pagamento'][number - 1]}`;
  if (focus) {
    const title = number === 3 ? $('[data-payment-title]') : $(`#book-step-${number}-title`);
    title.focus({ preventScroll: true });
    root.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
}
function notice(selector: string, message: string) { const element = $(selector); element.textContent = message; element.hidden = !message; }
function fieldErrors(errors: Record<string, string>, focus = true) {
  root.querySelectorAll<HTMLElement>('.book-field-error').forEach(element => element.textContent = '');
  root.querySelectorAll('[aria-invalid]').forEach(element => element.removeAttribute('aria-invalid'));
  for (const [name, message] of Object.entries(errors)) {
    const error = root.querySelector<HTMLElement>(`#error-${name}`);
    if (error) error.textContent = message;
    form.querySelector(`[name="${name}"]`)?.setAttribute('aria-invalid', 'true');
  }
  if (focus) {
    const first = form.querySelector<HTMLElement>('[aria-invalid=true]');
    const screen = first?.closest<HTMLElement>('[data-screen]');
    if (screen && Number(screen.dataset.screen) !== currentStep) step(Number(screen.dataset.screen));
    first?.focus();
  }
}
function resetReview(message = '') {
  token = null; localPreview = false; payment.hidden = true; payment.disabled = true; receipt.value = '';
  $('[data-receipt-status]').textContent = ''; $('[data-remove-receipt]').hidden = true;
  $('[data-copy-status]').textContent = '';
  notice('[data-review-notice]', message); step(currentStep === 3 ? 2 : currentStep, false);
}
function update() {
  if (pending || complete) return;
  const data = input();
  const canPickup = serverTime !== null && pickupAvailable(currentTime());
  $('[data-pickup-option]').hidden = !canPickup;
  const pickupRadio = $<HTMLInputElement>('[name=delivery][value=retirada]');
  pickupRadio.disabled = !canPickup;
  if (!canPickup && pickupRadio.checked) {
    pickupRadio.checked = false;
    resetReview('A retirada no lançamento não está mais disponível. Escolha Correios, informe o endereço e revise o novo total. Se já fez o Pix, não pague novamente: entre em contato com a Habitare.');
    data.delivery = '';
    step(1, false);
  }
  const address = $<HTMLFieldSetElement>('[data-address]');
  address.hidden = address.disabled = data.delivery !== 'correios';
  const locations = $<HTMLFieldSetElement>('[data-pickup-locations]');
  locations.hidden = locations.disabled = data.delivery !== 'retirada';
  $<HTMLButtonElement>('[data-quantity-minus]').disabled = Number(quantity.value) <= 1;
  const n = Number(quantity.value);
  const subtotal = Number.isSafeInteger(n) && n > 0 && Number.isSafeInteger(n * BOOK.price) ? money(n * BOOK.price) : '—';
  $('[data-subtotal]').textContent = subtotal; $('[data-summary-subtotal]').textContent = subtotal;
  $('[data-summary-quantity]').textContent = Number.isSafeInteger(n) && n > 0 ? `${n} ${n === 1 ? 'exemplar' : 'exemplares'}` : 'Informe a quantidade';
  $('[data-summary-delivery]').textContent = data.delivery === 'correios' ? 'Correios — PAC' : data.delivery === 'retirada' ? 'Retirada no lançamento' : 'A escolher';
  $('[data-summary-location-row]').hidden = data.delivery !== 'retirada';
  const pickup = $<HTMLInputElement>('[name=pickup]:checked')?.value;
  $('[data-summary-location]').textContent = PICKUP[pickup as keyof typeof PICKUP] || 'Escolha o local';
  try { totals = calculate(n, String(data.delivery), $<HTMLSelectElement>('[name=uf]').value); }
  catch { totals = null; }
  $('[data-summary-freight]').textContent = totals ? money(totals.freight) : data.delivery === 'correios' ? (currentStep === 1 ? 'Calculado no próximo passo' : 'Selecione a UF') : 'A calcular';
  $('[data-summary-total]').textContent = totals ? money(totals.total) : 'A calcular';
  next.disabled = busy;
}
async function status() {
  if (complete || busy) return;
  try {
    const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(6000) });
    if (!response.ok) throw new Error();
    const result = await response.json();
    if (typeof result.now !== 'number') throw new Error();
    statusKnown = true; serverTime = result.now; serverSyncedAt = performance.now(); available = result.available === true;
    clearTimeout(cutoffTimer);
    const remaining = BOOK.cutoff - currentTime();
    if (remaining > 0 && remaining < 2_147_483_647) cutoffTimer = setTimeout(update, remaining + 1);
  } catch {
    available = false;
  }
  if (!available && token && !pending) resetReview('O serviço está indisponível no momento. Seus dados continuam nesta página. Se já fez o Pix, não pague novamente.');
  update();
}
const messages: Record<string, string> = {
  invalid_fields: 'Confira os campos indicados para continuar.', invalid_file: 'Confira o comprovante anexado.',
  file_too_large: 'O comprovante deve ter até 3 MB.', rate_limited: 'Aguarde alguns minutos antes de tentar novamente. Seus dados continuam nesta página.',
  not_configured: 'Não foi possível abrir o pagamento agora. Seus dados foram preservados. Tente novamente em instantes.',
  review_expired: 'Esta revisão expirou. Se já tentou enviar ou fez o Pix, fale com a Habitare antes de iniciar outro pedido.',
  review_required: 'Os dados mudaram. Revise o pedido antes de continuar.', total_changed: 'O valor foi atualizado. Revise o pedido antes de continuar.',
  submission_conflict: 'Há uma tentativa anterior para este pedido. Não faça outro Pix. Entre em contato com a Habitare para conferir o recebimento.',
  send_uncertain: 'Não foi possível confirmar o encaminhamento. Não faça outro Pix. Tente reenviar este mesmo pedido; seus dados e comprovante foram preservados.',
  service_unavailable: 'O serviço está temporariamente indisponível. Tente novamente em instantes.',
};
async function parseResponse(response: Response) {
  let result: { code?: string; fields?: Record<string, string>; [key: string]: any };
  try { result = await response.json(); } catch { result = { code: response.status === 413 ? 'file_too_large' : 'send_uncertain' }; }
  if (!response.ok || result.code) throw result;
  return result;
}

form.addEventListener('input', event => {
  if (!started) { started = true; trackBook('livro_form_start'); }
  const target = event.target as HTMLInputElement;
  if (target.name) {
    target.removeAttribute('aria-invalid');
    const error = root.querySelector<HTMLElement>(`#error-${target.name}`);
    if (error) error.textContent = '';
  }
  if (editable.contains(event.target as Node)) {
    if (token || localPreview) resetReview('Seu pedido foi alterado. Confira o total e continue novamente. Se já fez o Pix, confira o valor antes de anexar o comprovante. Não faça um novo pagamento sem orientação da equipe.');
    update();
  }
});
form.addEventListener('change', event => {
  const element = event.target as HTMLInputElement;
  if (element.name === 'delivery') trackBook('livro_delivery_select', { delivery: element.value });
});
for (const [selector, amount] of [['[data-quantity-minus]', -1], ['[data-quantity-plus]', 1]] as const) {
  $(selector).addEventListener('click', () => { quantity.value = String(Math.max(1, Number(quantity.value || 1) + amount)); quantity.dispatchEvent(new Event('input', { bubbles: true })); });
}
function goToDetails() {
  if (busy || pending) return;
  update();
  const validation = validateOrder(input(), currentTime());
  const errors = Object.fromEntries(Object.entries(validation.errors).filter(([key]) => ['quantity', 'delivery', 'pickup'].includes(key)));
  if (errors.quantity) errors.quantity = 'Informe uma quantidade inteira, a partir de 1.';
  if (errors.delivery) errors.delivery = 'Escolha como prefere receber seu livro.';
  fieldErrors(errors);
  if (Object.keys(errors).length) return;
  notice('[data-submit-status]', '');
  step(2); update();
}
$('[data-to-details]').addEventListener('click', goToDetails);
root.querySelectorAll<HTMLButtonElement>('[data-back]').forEach(button => button.addEventListener('click', () => {
  if (busy || pending) return;
  notice('[data-submit-status]', ''); fieldErrors({}, false);
  step(Number(button.dataset.back)); update();
}));
next.addEventListener('click', async () => {
  if (busy || pending) return;
  update();
  const data = input();
  const result = validateOrder(data, currentTime());
  if (!$<HTMLInputElement>('[name=consent]').checked) result.errors.consent = 'Aceite as políticas de privacidade para processar este pedido.';
  fieldErrors(result.errors);
  if (Object.keys(result.errors).length || !result.totals) return;
  if (token || localPreview) { step(3); return; }
  // Local design review only. Production always requires the server-signed review.
  if (canPreview && statusKnown && !available) {
    localPreview = true; totals = result.totals;
    $('[data-pix-total]').textContent = money(totals.total);
    $('.book-pix-key').textContent = 'Indisponível na prévia';
    $<HTMLButtonElement>('[data-copy-pix]').disabled = true;
    submit.disabled = true;
    notice('[data-preview-notice]', 'Prévia local do pagamento. Não faça o Pix: o serviço de pedidos ainda não está configurado. Você pode revisar esta tela e testar a seleção do comprovante, mas o pedido não será enviado.');
    notice('[data-submit-status]', ''); step(3); return;
  }
  $('.book-pix-key').textContent = BOOK.pix;
  $<HTMLButtonElement>('[data-copy-pix]').disabled = false;
  submit.disabled = false;
  notice('[data-preview-notice]', '');
  busy = true; next.disabled = true; next.firstChild!.textContent = 'Conferindo seu pedido… '; editable.disabled = true;
  notice('[data-submit-status]', '');
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, reviewedTotal: result.totals.total }), signal: AbortSignal.timeout(15000) });
    const review = await parseResponse(response);
    if (typeof review.token !== 'string' || review.totals?.total !== result.totals.total) throw { code: 'total_changed' };
    token = review.token; totals = result.totals; reviewedDelivery = result.order.delivery; reviewedPickup = result.order.pickup || '';
    payment.hidden = false; payment.disabled = false; $('[data-pix-total]').textContent = money(totals.total);
    notice('[data-review-notice]', ''); step(3);
    trackBook('livro_payment_view', { delivery: reviewedDelivery, quantity: result.order.quantity, value: totals.total / 100, currency: 'BRL' });
  } catch (error) {
    const result = error as { code?: string; fields?: Record<string, string> };
    editable.disabled = false;
    if (result.fields) fieldErrors(result.fields);
    notice('[data-submit-status]', messages[result.code || 'service_unavailable'] || messages.service_unavailable);
  } finally { busy = false; editable.disabled = false; next.firstChild!.textContent = 'Pagamento '; update(); }
});
$('[data-copy-pix]').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(BOOK.pix); $('[data-copy-status]').textContent = 'Chave Pix copiada'; trackBook('livro_pix_copy'); }
  catch { $('[data-copy-status]').textContent = 'Não foi possível copiar. Selecione a chave acima e copie manualmente.'; }
});
receipt.addEventListener('change', () => {
  const file = receipt.files?.[0] || null;
  const error = receiptError(file);
  fieldErrors(error ? { receipt: error } : {}, false);
  $('[data-receipt-status]').textContent = error ? '' : `${file!.name} · ${(file!.size / 1000).toFixed(0)} KB`;
  $('[data-remove-receipt]').hidden = !file;
  if (!error) trackBook('livro_receipt_select');
});
$('[data-remove-receipt]').addEventListener('click', () => { receipt.value = ''; $('[data-receipt-status]').textContent = ''; $('[data-remove-receipt]').hidden = true; receipt.focus(); });
form.addEventListener('submit', async event => {
  event.preventDefault();
  if (currentStep === 1) { goToDetails(); return; }
  if (currentStep === 2) { next.click(); return; }
  if (busy || complete || !token || !totals) return;
  if (!pending) {
    update(); if (!token) return;
    const errors: Record<string, string> = {};
    const fileError = receiptError(receipt.files?.[0] || null);
    if (fileError) errors.receipt = fileError;
    if (!$<HTMLInputElement>('[name=consent]').checked) errors.consent = 'Confirme o uso dos seus dados para processar este pedido.';
    fieldErrors(errors); if (Object.keys(errors).length) return;
    pending = new FormData(form); pending.set('token', token); pending.set('reviewedTotal', String(totals.total)); pending.set('privacyVersion', 'pedido-livro-v1');
  }
  busy = true; editable.disabled = true; payment.disabled = true; next.disabled = true; submit.textContent = 'Enviando seu pedido…';
  notice('[data-submit-status]', 'Encaminhando seus dados e comprovante…');
  trackBook('livro_order_submit', { delivery: reviewedDelivery });
  try {
    const response = await fetch(endpoint, { method: 'POST', body: pending, signal: AbortSignal.timeout(25000) });
    const result = await parseResponse(response);
    if (result.status !== 'aguardando_conferencia' || typeof result.id !== 'string') throw { code: 'send_uncertain' };
    complete = true; pending = null; token = null;
    form.hidden = true; $('[data-success]').hidden = false;
    $('[data-success-shipping]').hidden = reviewedDelivery !== 'correios'; $('[data-success-pickup]').hidden = reviewedDelivery !== 'retirada';
    $('[data-success-location]').textContent = PICKUP[reviewedPickup as keyof typeof PICKUP] || '';
    $('[data-order-id]').textContent = result.id; $('#book-success-title').focus();
    trackBook('livro_order_success', { delivery: reviewedDelivery, currency: 'BRL', value: totals.total / 100 });
    form.reset();
  } catch (error) {
    const result = error as { code?: string; fields?: Record<string, string> };
    const code = result.code || 'send_uncertain';
    notice('[data-submit-status]', messages[code] || messages.send_uncertain);
    trackBook('livro_order_error', { error_code: Object.hasOwn(messages, code) ? code : 'send_uncertain' });
    // Only definite validation failures can safely unlock editing. Unknown outcomes retry the exact FormData.
    if (['invalid_fields', 'invalid_file', 'file_too_large', 'review_required', 'total_changed'].includes(code)) {
      pending = null; editable.disabled = false; payment.disabled = false;
      payment.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input,button').forEach(element => { element.disabled = false; });
      if (result.fields) fieldErrors(result.fields);
      if (['review_required', 'total_changed'].includes(code) || result.fields?.delivery) resetReview(messages[code]);
    }
    if (['review_expired', 'submission_conflict'].includes(code)) submit.disabled = true;
  } finally {
    busy = false;
    if (!complete) {
      if (pending) {
        // Keep the submitted data immutable, but enable only the retry button.
        payment.disabled = false;
        payment.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input,button').forEach(element => { if (element !== submit) element.disabled = true; });
      }
      submit.textContent = pending ? 'Tentar reenviar este pedido' : 'Confirmar meu pedido';
      update();
    }
  }
});
placeSummary();
mobileCheckout.addEventListener('change', placeSummary);
void status();
setInterval(() => { if (!document.hidden) void status(); }, 60_000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) void status(); });
window.addEventListener('beforeunload', event => { if (pending && !complete) event.preventDefault(); });
