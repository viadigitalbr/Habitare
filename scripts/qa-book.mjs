// Local browser QA. API calls use the real handler with fake mail/rate-limit transports.
// No e-mail is sent, no bank payment is made and no production credentials are used.
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createBookHandler } from '../server/book-orders.mjs';
import { BOOK } from '../src/lib/book.ts';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE ? pathToFileURL(process.env.PLAYWRIGHT_MODULE).href : 'playwright');
const output = 'docs/livro/qa'; await mkdir(output,{recursive:true});
const browser = await chromium.launch({headless:true,...(process.env.CHROME_PATH ? {executablePath:process.env.CHROME_PATH} : {})});
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:4321';
const report = { screenshots:[], layouts:[], journeys:[], consoleErrors:[], mode:'API real com transporte Resend/Redis simulado; nenhum e-mail enviado' };
const context = await browser.newContext({locale:'pt-BR',viewport:{width:1440,height:1000},reducedMotion:'reduce'});
const page = await context.newPage();
page.on('pageerror',error=>report.consoleErrors.push(error.message));
let mailCalls=[];let now=Date.parse('2026-10-21T12:00:00-03:00');let failSend=false;
const handler = createBookHandler({env:{BOOK_ORDERS_ENABLED:'true',RESEND_API_KEY:'test-only',BOOK_ORDER_FROM_EMAIL:'Teste <test@example.com>',BOOK_ORDER_SECRET:'test-secret-at-least-thirty-two-characters',UPSTASH_REDIS_REST_URL:'https://redis.example.com',UPSTASH_REDIS_REST_TOKEN:'test-only',BOOK_ALLOWED_ORIGINS:base},clock:()=>now,fetcher:async(url,options)=>{
  if(url.includes('redis.example.com')) return Response.json([{result:1},{result:1}]);
  mailCalls.push(options);return Response.json(failSend ? {error:'simulated'} : {id:'simulated-email'}, {status:failSend?500:200});
}});
const routeHandler=async route=>{
  const original=route.request();
  const response=await handler(new Request(original.url(),{method:original.method(),headers:original.headers(),...(original.method()==='POST'?{body:original.postDataBuffer()}: {})}));
  await route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
};
const screenshot=async name=>{await page.screenshot({path:`${output}/${name}.png`,fullPage:true});report.screenshots.push(name);};
try {
  const fillBuyer=async()=>{for(const [key,value] of Object.entries({name:'Pessoa de Teste',email:'teste@example.com',phone:'11999999999',cpf:'52998224725'})) await page.locator(`[name=${key}]`).fill(value);};
  const fillShipping=async()=>{for(const [key,value] of Object.entries({cep:'01001000',street:'Rua de teste',number:'s/n',district:'Centro',city:'São Paulo'})) await page.locator(`[name=${key}]`).fill(value);await page.locator('[name=uf]').selectOption('SP');};
  const details=async()=>{await page.locator('[data-to-details]').click();await page.locator('[data-screen="2"]').waitFor({state:'visible'});};
  const goPayment=async()=>{await page.locator('[data-continue]').click();await page.locator('[data-payment]').waitFor({state:'visible'});};
  const upload=async()=>page.locator('[name=receipt]').setInputFiles({name:'comprovante.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.7\n%%EOF')});
  const oneScreen=async number=>{
    for(const n of [1,2,3]) assert.equal(await page.locator(`[data-screen="${n}"]`).isVisible(),n===number);
    assert.equal(await page.locator(`[data-step="${number}"]`).getAttribute('aria-current'),'step');
  };
  await page.goto(base+'/livro-rede-habitare');
  await page.locator('#analytics-dialog').waitFor({state:'visible'});
  const cookieBox = await page.locator('#analytics-dialog').boundingBox();
  assert.ok(cookieBox.x > 900 && cookieBox.y > 500);
  assert.equal(await page.locator('footer [data-analytics-open]').count(),1);
  assert.equal(await page.locator('footer [data-privacy-open]').count(),1);
  assert.equal(await page.locator('#habitare-ga').count(),0);
  await page.locator('[data-consent-deny]').click();
  assert.equal(await page.locator('[data-service-notice]').count(),0);await oneScreen(1);
  await page.locator('[data-to-details]').click();await oneScreen(1); // No delivery selected.
  await page.locator('[name=delivery][value=correios]').check();await details();await fillBuyer();await fillShipping();
  await page.locator('[name=consent]').check();await page.locator('[data-continue]').click();
  await page.locator('[data-payment]').waitFor({state:'visible'});await oneScreen(3);
  assert.equal(await page.locator('[data-submit]').isDisabled(),true);
  assert.equal(await page.locator('[data-copy-pix]').isDisabled(),true);
  assert.match(await page.locator('[data-preview-notice]').textContent(),/Prévia local/);
  report.journeys.push('Três telas exclusivas; sem aviso inicial; prévia local permite revisar pagamento com Pix e envio bloqueados');
  await page.route('**/api/pedidos-livro',routeHandler);
  for(const width of [360,390,768,1024,1440]){
    await page.setViewportSize({width,height:1000});await page.goto(base+'/livro-rede-habitare');await page.evaluate(()=>document.fonts.ready);
    await page.locator('.book-hero-background img').evaluate(image=>image.decode());
    const measure=await page.evaluate(()=>({viewport:innerWidth,scroll:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,color:getComputedStyle(document.querySelector('h1')).color,bg:getComputedStyle(document.querySelector('.book-purchase')).backgroundColor}));
    assert.equal(measure.h1,1);assert.ok(measure.scroll<=width);assert.equal(measure.color,'rgb(176, 63, 36)');assert.equal(measure.bg,'rgb(248, 243, 237)');report.layouts.push(measure);
    assert.equal(await page.locator('.book-date,.book-hero-cover').count(),0);await oneScreen(1);
    if(width===390||width===1440){await screenshot(`lp-${width}`);await page.screenshot({path:`${output}/hero-${width}.png`});await page.locator('[data-book-order]').screenshot({style:'.site-header,.skip-link{visibility:hidden!important}',path:`${output}/pedido-etapa1-${width}.png`});}
  }
  await page.setViewportSize({width:390,height:844});
  await page.locator('[name=delivery][value=correios]').check();await page.locator('[name=quantity]').fill('2');await details();
  await fillBuyer();await fillShipping();assert.match(await page.locator('[data-summary-total]').textContent(),/224,05/);
  await page.locator('[data-continue]').click();await oneScreen(2);assert.equal(await page.locator('[name=consent]').getAttribute('aria-invalid'),'true');
  await page.locator('[data-book-order] [data-privacy-open]').click();await page.locator('#privacy-dialog').waitFor({state:'visible'});
  assert.equal(await page.locator('#privacy-dialog [data-consent-accept],#privacy-dialog [data-consent-deny]').count(),0);
  assert.equal(await page.locator('[name=consent]').isChecked(),false);
  await page.keyboard.press('Escape');assert.equal(await page.locator('#privacy-dialog').isVisible(),false);
  await page.locator('[name=consent]').check();await page.locator('[data-book-order]').screenshot({style:'.site-header,.skip-link{visibility:hidden!important}',path:`${output}/pedido-etapa2-mobile.png`});
  await page.locator('[data-back="1"]').click();await oneScreen(1);assert.equal(await page.locator('[name=quantity]').inputValue(),'2');await details();assert.equal(await page.locator('[name=name]').inputValue(),'Pessoa de Teste');assert.equal(await page.locator('[name=uf]').inputValue(),'SP');
  await goPayment();await oneScreen(3);assert.match(await page.locator('[data-pix-total]').textContent(),/224,05/);
  await page.locator('[data-copy-pix]').click();await page.waitForFunction(()=>document.querySelector('[data-copy-status]')?.textContent.length>0);
  await page.locator('[data-book-order]').screenshot({style:'.site-header,.skip-link{visibility:hidden!important}',path:`${output}/pedido-etapa3-mobile-teste.png`});
  await upload();await page.locator('[data-back="2"]').click();await oneScreen(2);await goPayment();assert.equal(await page.locator('[name=receipt]').evaluate(input=>input.files.length),1);
  await page.locator('[data-back="2"]').click();await page.locator('[data-back="1"]').click();await page.locator('[name=quantity]').fill('3');await details();await goPayment();assert.match(await page.locator('[data-pix-total]').textContent(),/328,40/);assert.equal(await page.locator('[name=receipt]').evaluate(input=>input.files.length),0);
  await upload();failSend=true;await page.locator('[data-submit]').click();await page.getByText('Tentar reenviar este pedido',{exact:true}).waitFor();
  assert.equal(await page.locator('[data-success]').isVisible(),false);assert.equal(await page.locator('[data-back="2"]').isDisabled(),true);
  failSend=false;await page.locator('[data-submit]').click();await page.locator('[data-success]').waitFor({state:'visible'});
  assert.equal(mailCalls.length,2);assert.equal(mailCalls[0].body,mailCalls[1].body);assert.equal(mailCalls[0].headers['Idempotency-Key'],mailCalls[1].headers['Idempotency-Key']);
  assert.equal(await page.locator('[data-success-shipping]').isVisible(),true);assert.equal(await page.locator('[data-success-pickup]').isVisible(),false);
  report.journeys.push('Correios: aceite obrigatório, modal informativo, ida/volta preserva campos, edição invalida Pix, retry idempotente e sucesso');
  for(const pickup of ['sedes','vila']){
    await page.goto(base+'/livro-rede-habitare');await page.locator('[data-pickup-option]').waitFor({state:'visible'});
    await page.locator('[name=delivery][value=retirada]').check();await page.locator(`[name=pickup][value=${pickup}]`).check();await details();await fillBuyer();
    assert.equal(await page.locator('[data-address]').isVisible(),false);await page.locator('[name=consent]').check();await goPayment();assert.match(await page.locator('[data-pix-total]').textContent(),/89,00/);
    await upload();await page.locator('[data-submit]').click();await page.locator('[data-success]').waitFor({state:'visible'});
    assert.match(await page.locator('[data-success-location]').textContent(),pickup==='sedes'?/SEDES/:/Livraria/);assert.equal(await page.locator('[data-success-shipping]').isVisible(),false);
  }
  report.journeys.push('Retirada: locais na etapa 1; dados obrigatórios sem endereço na etapa 2; sem frete na etapa 3');
  await page.goto(base+'/livro-rede-habitare');await page.locator('[data-pickup-option]').waitFor({state:'visible'});await page.locator('[name=delivery][value=retirada]').check();await page.locator('[name=pickup][value=sedes]').check();await details();
  now=BOOK.cutoff;await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));await page.locator('[data-screen="1"]').waitFor({state:'visible'});assert.equal(await page.locator('[data-pickup-option]').isVisible(),false);await oneScreen(1);
  assert.match(await page.locator('[data-review-notice]').textContent(),/não está mais disponível/);report.journeys.push('Corte de retirada devolve ao primeiro passo para escolher Correios');
  await page.locator('[data-analytics-open]').click();await page.locator('#analytics-dialog').waitFor({state:'visible'});await page.locator('[data-consent-accept]').click();assert.equal(await page.locator('#habitare-ga').count(),0);
  await page.locator('[data-analytics-open]').click();await page.locator('[data-consent-withdraw]').click();assert.equal(await page.evaluate(()=>localStorage.getItem('habitare-analytics-consent-v1')),'denied');report.journeys.push('Analytics separado: modal no acesso, aceite/recusa/revogação; preview sem rastreamento');
  assert.deepEqual(report.consoleErrors,[]);
  await writeFile(`${output}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
} finally { await browser.close(); }
