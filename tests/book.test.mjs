import test from 'node:test';
import assert from 'node:assert/strict';
import { BOOK, STATES, calculate, pickupAvailable, validateOrder, validCPF } from '../src/lib/book.ts';
import { createBookHandler } from '../server/book-orders.mjs';

const before = Date.parse('2026-10-22T23:59:59-03:00');
const baseOrder = { name: 'Pessoa de Teste', email: 'teste@example.com', phone: '11999999999', cpf: '52998224725', quantity: '2', delivery: 'correios', cep: '01001000', street: 'Rua de teste', number: 's/n', complement: '', district: 'Centro', city: 'São Paulo', uf: 'SP', reviewedTotal: 22405 };
const cases = [['SP',1,3070,11970],['SP',2,4605,22405],['SP',3,6140,32840],['RJ',1,3980,12880],['DF',2,5970,23770],['BA',1,4160,13060],['AM',3,8320,35020]];
for (const [uf,n,freight,total] of cases) test(`${n} livro(s) PAC ${uf}`, () => assert.deepEqual(calculate(n,'correios',uf),{subtotal: n*8900,freight,total}));
test('27 UFs, SP excepcional e faixas completas', () => {
  assert.equal(Object.keys(STATES).length,27);
  for (const uf of Object.keys(STATES)) assert.ok([3070,3980,4160].includes(calculate(1,'correios',uf).freight));
  assert.throws(()=>calculate(1,'correios','ZZ')); assert.throws(()=>calculate(1,'correios'));
});
test('retirada sem frete e sem teto comercial', () => { assert.equal(calculate(2,'retirada').total,17800); assert.equal(calculate(10000,'retirada').total,89000000); });
test('quantidade rejeita inválidos e overflow', () => { for(const n of [0,-1,1.5,NaN,Infinity,Number.MAX_SAFE_INTEGER]) assert.throws(()=>calculate(n,'retirada')); });
test('corte exato em São Paulo', () => { assert.equal(pickupAvailable(before),true); assert.equal(pickupAvailable(BOOK.cutoff),false); });
test('CPF e validação por modalidade', () => {
  assert.equal(validCPF('529.982.247-25'),true); assert.equal(validCPF('11111111111'),false); assert.equal(validCPF('52998224726'),false);
  assert.equal(validateOrder(baseOrder,before).valid,true);
  const pickup = validateOrder({...baseOrder, delivery:'retirada', pickup:'sedes', cep:''},before);
  assert.equal(pickup.valid,true); assert.equal(pickup.order.address,null);
  assert.equal(validateOrder({...baseOrder,delivery:'retirada'},before).valid,false);
  assert.equal(validateOrder({...baseOrder,delivery:'retirada',pickup:'vila'},BOOK.cutoff).valid,false);
});

function setup({ now = before, env: extra = {}, sendStatus = 200 } = {}) {
  const calls=[];
  const env = { BOOK_ORDERS_ENABLED:'true',RESEND_API_KEY:'test-only',BOOK_ORDER_FROM_EMAIL:'Habitare <test@example.com>',BOOK_ORDER_SECRET:'test-secret-longer-than-thirty-two-characters',UPSTASH_REDIS_REST_URL:'https://redis.example.com',UPSTASH_REDIS_REST_TOKEN:'test-only',...extra };
  const handle = createBookHandler({env,clock:()=>now,fetcher:async(url,options)=>{
    if(url.includes('redis.example.com')) return Response.json([{result:1},{result:1}]);
    calls.push({url,options}); return Response.json(sendStatus===200?{id:'mock-email'}:{error:'no'}, {status:sendStatus});
  }});
  return {handle,calls};
}
function req(body, origin='https://redehabitare.org.br') { return new Request('https://redehabitare.org.br/api/pedidos-livro',{method:'POST',headers:{Origin:origin,...(typeof body==='string'?{'Content-Type':'application/json'}:{})},body}); }
async function quote(handle, order=baseOrder) { const response=await handle(req(JSON.stringify(order))); assert.equal(response.status,200); return response.json(); }
function submission(token,order=baseOrder, file=new File(['%PDF-1.7\n%%EOF'],'comprovante.pdf',{type:'application/pdf'})) {
  const form=new FormData(); for(const [key,value] of Object.entries(order)) form.set(key,String(value));
  form.set('token',token);form.set('consent','yes');form.set('privacyVersion','pedido-livro-v1');form.set('receipt',file);return form;
}
test('configuração ausente mantém pedidos indisponíveis', async()=>{
  const {handle}=setup({env:{BOOK_ORDERS_ENABLED:'false'}});
  assert.equal((await (await handle(new Request('https://redehabitare.org.br/api/pedidos-livro'))).json()).available,false);
  assert.equal((await handle(req(JSON.stringify(baseOrder)))).status,503);
});
test('origem e valores adulterados rejeitados',async()=>{
  const {handle}=setup();assert.equal((await handle(req(JSON.stringify(baseOrder),'https://attacker.example'))).status,403);
  assert.equal((await handle(req(JSON.stringify({...baseOrder,reviewedTotal:1})))).status,409);
});
test('envio contém dois destinatários, dados e comprovante; sem aprovação de pagamento', async()=>{
  const {handle,calls}=setup();const review=await quote(handle);const response=await handle(req(submission(review.token)));
  assert.equal(response.status,200);assert.equal((await response.json()).status,'aguardando_conferencia');
  const body=JSON.parse(calls[0].options.body);assert.deepEqual(body.to,['ohabitare@gmail.com','nathalia.e.machado@gmail.com']);assert.equal(body.attachments.length,1);assert.match(body.text,/224,05/);assert.match(body.text,/aguardando conferência manual/);assert.equal(body.reply_to,'teste@example.com');
});
test('retirada não transmite endereço residual',async()=>{
  const {handle,calls}=setup(); const order={...baseOrder,delivery:'retirada',pickup:'vila',reviewedTotal:17800};const review=await quote(handle,order);await handle(req(submission(review.token,order)));const body=JSON.parse(calls[0].options.body);assert.match(body.text,/Livraria da Vila/);assert.doesNotMatch(body.text,/Rua de teste/);
});
test('retry produz chave e payload idênticos mesmo com novo horário no servidor',async()=>{
  const first=setup(); const review=await quote(first.handle); await first.handle(req(submission(review.token)));
  const second=setup({now:before+500}); await second.handle(req(submission(review.token)));
  assert.equal(first.calls[0].options.headers['Idempotency-Key'],second.calls[0].options.headers['Idempotency-Key']);assert.equal(first.calls[0].options.body,second.calls[0].options.body);
});
test('dados alterados após revisão são rejeitados',async()=>{
  const {handle}=setup();const review=await quote(handle);assert.equal((await handle(req(submission(review.token,{...baseOrder,name:'Outro nome'})))).status,409);
});
test('assinatura de arquivo e consentimento são validados no servidor',async()=>{
  const {handle,calls}=setup();const review=await quote(handle);
  assert.equal((await handle(req(submission(review.token,baseOrder,new File(['HTML'],'falso.pdf',{type:'application/pdf'}))))).status,422);
  const form=submission(review.token);form.delete('consent');assert.equal((await handle(req(form))).status,422);assert.equal(calls.length,0);
});
test('arquivo acima de 3MB e campos duplicados rejeitados',async()=>{
  const {handle}=setup();const review=await quote(handle);
  const file=new File([new Uint8Array(3_000_001)],'grande.pdf',{type:'application/pdf'});
  assert.equal((await handle(req(submission(review.token,baseOrder,file)))).status,413);
  const form=submission(review.token);form.append('quantity','3');assert.equal((await handle(req(form))).status,400);
});
test('timeout ou erro do provedor nunca retorna sucesso',async()=>{
  const {handle}=setup({sendStatus:500});const review=await quote(handle);const response=await handle(req(submission(review.token)));assert.equal(response.status,502);assert.equal((await response.json()).code,'send_uncertain');
});
test('token adulterado e expirado impedem envio',async()=>{
  const {handle}=setup();const review=await quote(handle);
  assert.equal((await handle(req(submission(review.token+'x')))).status,409);
  const late=setup({now:before+23*60*60*1000});const response=await late.handle(req(submission(review.token)));assert.equal(response.status,409);assert.equal((await response.json()).code,'review_expired');
});
