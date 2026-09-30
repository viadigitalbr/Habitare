# Briefing técnico — Landing Page do livro da Rede Habitare

> Revisão de UI/UX de 30/09/2026: Viviana substituiu a revelação progressiva por três telas (Seu pedido → Seus dados → Pagamento), com retorno e preservação do preenchimento. Hero com os backgrounds desktop/mobile da campanha, sem data; textos antes roxos e botões da LP em #b03f24, fundos antes lilás em #f5eadf e compra em #f8f3ed. O aceite do pedido fica na etapa de dados, com link “políticas de privacidade” para modal somente informativo. Analytics tem um modal separado no primeiro acesso, com escolhas discretas e revogáveis. Não exibir o aviso inicial de pedidos indisponíveis. Essas decisões prevalecem sobre os trechos anteriores em conflito abaixo.

> Atualização de Viviana durante a implementação: não há política de privacidade. Em seu lugar, usar o modal com o texto fornecido sobre GA4, com consentimento opcional e revogável, separado do aceite para processamento do pedido. Essa atualização substitui as referências abaixo a uma URL de política existente. A implementação e a configuração atual estão em `IMPLEMENTACAO.md`.

## 1. Objetivo e escopo

Implementar a landing page de lançamento e venda direta do livro **Rede Habitare — Sonhar e cuidar da parentalidade em situações de vulnerabilidade**, com formulário, cálculo do pedido, pagamento manual via Pix, comprovante e envio por Resend aos dois e-mails definidos. Adicionar o banner à vitrine da Home.

A LP será o destino das campanhas de Instagram, divulgação pessoal dos membros, WhatsApp, Linktree e Home. Não direcionar a compra à Amazon ou ao checkout da editora.

Este documento consolida a conversa **Landing Page do Livro**, incluindo suas correções finais. A copy da seção 4 é a versão final recuperada da conversa. As decisões técnicas abaixo especificam a implementação; não representam infraestrutura já configurada. Rota, nomes de eventos, contrato de API e limite de arquivo são propostas técnicas deste briefing.

**Implementar e validar localmente; a publicação depende da revisão final.** Não alterar conteúdo institucional nem criar informações, endereços de eventos, dados bancários ou credenciais ausentes.

## 2. Projeto e integração existente

Pasta de desenvolvimento:

`/Users/vivianadelbianco/Clientes/Habitare/website`

Ler o `MIGRACAO.md` do contexto e o `AGENTS.md` do repositório antes de trabalhar. Não recriar `site-habitare`; o espelho do projeto ChatGPT não é o checkout. Todo `sources/` é somente leitura.

Inspeção realizada para este briefing:

- Astro 7.3.5; Node >=22.12.0; saída atual estática.
- `src/layouts/Base.astro`: metadados, canonical e controle de indexação por `PUBLIC_RELEASE_READY`.
- `src/components/Header.astro` e `Footer.astro`: componentes a reutilizar.
- `src/components/Carousel.astro` e `src/data/banners.ts`: vitrine orientada por dados.
- `src/styles/global.css`: estilos e tokens existentes.
- `src/pages/sitemap.xml.ts`: lista explícita de rotas.
- `src/pages/seja-membro.astro`: exemplo de hooks para `gtag`/`dataLayer`; a existência desses hooks não comprova GA4 configurado.
- Fontes aprovadas no projeto: **Lora nos títulos; Raleway em textos e botões**.

Proposta de rota única: **`/livro-rede-habitare`**, sem barra final, com âncora **`#pedido`**. Conferir conflitos antes de criar. Usar a mesma rota na Home, canonical, sitemap e campanhas.

Organização sugerida, adaptável às convenções atuais:

- Página Astro para a rota.
- Configuração central do livro: ficha, preço, faixas de frete, Pix e corte de retirada.
- Módulo compartilhado de validação/cálculo, utilizado no navegador e no servidor.
- Componente/script do formulário e estilos restritos à LP.
- Endpoint de pedidos e integração Resend exclusivamente no servidor.
- Testes das regras e documentação de operação/configuração.

## 3. Design, assets e composição

> **O layout visual anexado é somente referência de composição. Espaçamentos, fontes, estilos, componentes, header e footer devem seguir prioritariamente o design system e os componentes existentes do site. O header não deve ser alterado.**

Manter exatamente o header atual, inclusive navegação e comportamento desktop/mobile. Usar o footer existente, sem rodapé específico da campanha. Não modificar estilos globais para reproduzir a imagem de referência.

A direção final é clean, editorial, responsiva, com respiro e poucas colunas. A proposta anterior com muitas colunas e aparência de folder foi rejeitada. Proporções como 55/45 são sugestões de composição, não medidas obrigatórias.

O KV e a capa fornecem fios/tramas, atmosfera e grafismos. Não criar nova identidade, redesenhar a capa, inventar imagens, adicionar selos comerciais ou transformar a página em uma grade de cards. Reservar agrupamentos visuais principalmente para informação transacional.

Ordem de composição:

1. Header existente.
2. Hero: conceito, texto, capa real e CTA.
3. “Um livro tecido a muitas mãos”: texto editorial com largura confortável.
4. “Experiência, clínica e reflexão em diálogo”: conteúdo contínuo, sem três cards.
5. Capa + ficha + preço.
6. Transição “Leve essa história com você.”
7. Pedido → modalidade → dados → resumo → Pix → comprovante/privacidade → envio.
8. Sucesso substituindo a área transacional.
9. Footer existente.

Desktop pode usar duas colunas pontualmente no hero e na ficha. Formulário sem excesso de colunas. Não criar wizard em páginas separadas. Se houver indicador “1 — Seu pedido / 2 — Seus dados / 3 — Pagamento”, ele indica progresso, não é navegação.

No mobile: hero compacto, leitura confortável, capa proporcional, campos em uma coluna, controles amplos e resumo sem tabela larga. A última solicitação sobre o banner mobile foi **diminuir um pouco o livro**; respeitar o asset final e evitar ampliação/corte excessivos. Não aplicar botão de compra sticky permanente.

### Assets

Backgrounds finais da Home, cuja existência foi verificada:

- Desktop: `/Users/vivianadelbianco/Clientes/Habitare/Assets/Banners/banner-livro-desktop.png`
- Mobile: `/Users/vivianadelbianco/Clientes/Habitare/Assets/Banners/banner-livro-mobile.png`

Referências de produção: desktop 1920 × 840 px; mobile 1080 × 1620 px. Conferir as dimensões efetivas antes da integração. São fundos sem textos/botões incorporados. Desktop: metade esquerda limpa, livro à direita e cerca de 80 px superiores suaves, especialmente à direita. Mobile: topo livre para header, centro para copy/CTA e imagem principal inferior.

A conversa contém anexos chamados `Capa-Rede-Habitare-Sonhar-e-cuidar-scaled.jpg` e `1-Teaser-whatsapp.png`. Os caminhos retornados são temporários: localizar e copiar os originais para assets estáveis antes da implementação. A imagem final de layout não estava disponível no conteúdo recuperado: solicitar o anexo se não estiver no projeto, sem substituir por uma proposta rejeitada. Este briefing não certifica inspeção visual desse layout.

Copiar assets necessários para `public/images/livro/` ou organização equivalente. Não usar caminhos locais na URL pública. Otimizar sem alterar composição, cores, textos da capa ou proporção. Dimensões explícitas; imagem de primeira dobra prioritária, demais lazy quando aplicável. Capa com alt descritivo; fios/fundos decorativos sem leitura redundante.

## 4. Copy final e ordem dos blocos

Preservar os textos abaixo. Colchetes representam controles/conteúdo dinâmico e não devem aparecer literalmente na interface. Os títulos numerados abaixo são seções do conteúdo, não a hierarquia HTML final: usar somente um H1 na página. O título do livro e a organização podem ficar próximos ao hero ou na ficha, sem repetição excessiva. Eyebrow opcional do hero: **LANÇAMENTO • REDE HABITARE**; data de lançamento: **23 de outubro de 2026**.

## 1. HERO

**Uma história de cuidado que agora também pode ser lida.**

Mais de duas décadas de escuta, encontros, pesquisa e trabalho com mães, bebês e famílias reunidas em um livro.

**Rede Habitare — Sonhar e cuidar da parentalidade em situações de vulnerabilidade**

Organização: Tereza Marques de Oliveira

[QUERO MEU EXEMPLAR]

**Comportamento:** CTA leva diretamente ao bloco de compra.

---

# 2. SOBRE O LIVRO

## Um livro tecido a muitas mãos

Há mais de duas décadas, a Rede Habitare constrói uma história feita de encontros.

Entre a clínica, a pesquisa, a formação e o trabalho junto a mães, bebês e famílias em contextos de vulnerabilidade, foram se entrelaçando experiências, saberes, perguntas e descobertas.

Agora, parte dessa trajetória ganha as páginas de um livro.

**“Rede Habitare — Sonhar e cuidar da parentalidade em situações de vulnerabilidade”** reúne reflexões teóricas e experiências construídas a partir do trabalho da Habitare, aproximando a psicanálise da realidade de quem cuida, de quem é cuidado e de quem se dedica a pensar a parentalidade.

Um livro que nasce da prática e volta para ela como conhecimento, memória e possibilidade de novos encontros.

---

# 3. O QUE VOCÊ VAI ENCONTRAR

## Experiência, clínica e reflexão em diálogo

Ao longo de suas páginas, o livro compartilha diferentes olhares sobre a parentalidade em situações de vulnerabilidade e sobre o cuidado com os vínculos que começam a se construir desde o início da vida.

São experiências que atravessam a prática clínica, a reflexão teórica, a pesquisa e o trabalho realizado pela Rede Habitare ao longo de sua trajetória.

Mais do que registrar uma história, esta obra compartilha um conhecimento construído coletivamente — entre profissionais, instituições, famílias e todas as pessoas que fizeram e fazem parte dessa rede.

---

# 4. O LIVRO

[CAPA DO LIVRO EM DESTAQUE]

**Rede Habitare — Sonhar e cuidar da parentalidade em situações de vulnerabilidade**

Organização  
**Tereza Marques de Oliveira**

Editora Zagodoni  
1ª edição · 2026  
232 páginas  
Formato: 16 × 23 cm  
ISBN 978-85-5524-194-9

**Valor do exemplar: R$ 89,00**

[QUERO COMPRAR O LIVRO]

---

# 5. COMPRE DIRETAMENTE COM A REDE HABITARE

## Leve essa história com você.

Ao adquirir seu exemplar diretamente com a Rede Habitare, você compra um dos livros destinados à própria organização.

Escolha a quantidade de exemplares e como prefere recebê-los. Antes do pagamento, você verá o valor total do seu pedido.

---

# 6. SEU PEDIDO

### Quantos exemplares você deseja?

**Quantidade**

[ – ] [ 1 ] [ + ]

**Valor unitário:** R$ 89,00  
**Subtotal:** R$ [VALOR]

---

# 7. COMO VOCÊ QUER RECEBER SEU LIVRO?

[ ] **Receber pelos Correios**

O envio é feito por PAC para todo o Brasil.

[ ] **Retirar no lançamento**

Seu pedido ficará reservado para você e não haverá cobrança de frete.

> **Regra funcional:** a opção “Retirar no lançamento” deverá deixar de ser exibida automaticamente a partir de 23/10/2026.

---

# 8. SEUS DADOS

> Esta seção aparece para **todos os compradores**, independentemente da modalidade de recebimento.

**Nome completo***  
[Campo]

**E-mail***  
[Campo]

**WhatsApp***  
[Campo]

**CPF***  
[Campo]

---

# 9A. SE ESCOLHER RECEBER PELOS CORREIOS

## Onde devemos enviar seu pedido?

**CEP***  
[Campo]

**Endereço***  
[Campo]

**Número***  
[Campo]

**Complemento**  
[Campo]

**Bairro***  
[Campo]

**Cidade***  
[Campo]

**UF***  
[SELETOR]

> O seletor deverá conter todas as UFs brasileiras.

### Frete

O envio é realizado pelos **Correios — PAC**, a partir de São Paulo/SP. O valor já inclui a embalagem.

**São Paulo:** R$ 30,70  
**Sul, Sudeste e Centro-Oeste:** R$ 39,80  
**Norte e Nordeste:** R$ 41,60

Para cada exemplar adicional, será acrescentado **50% do valor do frete da sua região**, considerando o peso total e o tamanho da embalagem.

O sistema deverá calcular o frete automaticamente a partir da UF selecionada.

---

# 9B. SE ESCOLHER RETIRAR NO LANÇAMENTO

## Onde você prefere retirar seu exemplar?

Escolha o local em que seu pedido ficará reservado:

( ) **SEDES**  
23 de outubro de 2026  
18h às 18h45

( ) **Livraria da Vila**  
23 de outubro de 2026  
19h30 às 21h30

> Nesta modalidade, os campos de endereço não são exibidos e o frete é R$ 0,00.

---

# 10. RESUMO DO PEDIDO

## Seu pedido

**Quantidade:** [X exemplares]  
**Livros:** R$ [VALOR]  
**Forma de recebimento:** [Correios — PAC / Retirada no lançamento]  
**Frete:** R$ [VALOR / 0,00]

### Total do pedido
# R$ [TOTAL]

> Se for retirada presencial, exibir também:  
> **Local de retirada:** [SEDES / Livraria da Vila]

[CONTINUAR PARA PAGAMENTO]

---

# 11. PAGAMENTO

> **Esta seção só aparece depois que quantidade, dados obrigatórios e modalidade de recebimento estiverem definidos e o valor total puder ser calculado.**

## Agora é só fazer o Pix

Faça o pagamento do valor total do seu pedido diretamente para a Rede Habitare.

**Valor do Pix**

# R$ [TOTAL DO PEDIDO]

**Chave Pix — CNPJ**

### 05.407.750/0001-04

[COPIAR CHAVE PIX]

Depois de realizar o pagamento, anexe o comprovante para que nossa equipe possa confirmar seu pedido.

---

# 12. COMPROVANTE

**Anexe seu comprovante de pagamento***

[SELECIONAR ARQUIVO]

Formatos aceitos: PDF, JPG ou PNG.

---

# 13. PRIVACIDADE

[ ] **Li e concordo com o uso dos meus dados para o processamento deste pedido.**

Seus dados serão utilizados pela Rede Habitare exclusivamente para identificar o pagamento, processar seu pedido, realizar a entrega ou retirada do livro e entrar em contato com você sobre esta compra.

[Política de Privacidade]

---

# 14. FINALIZAÇÃO

Antes de enviar, confira seus dados, o valor pago e o comprovante anexado.

[CONFIRMAR MEU PEDIDO]

---

# 15. MENSAGEM DE SUCESSO

## Obrigada por fazer parte desta história.

Seu pedido foi recebido pela Rede Habitare.

Ficamos muito felizes em saber que este livro — construído a partir de tantos encontros, experiências e histórias — seguirá agora também com você.

Nossa equipe irá conferir seus dados e confirmar o recebimento do pagamento via Pix.

### Para pedidos enviados pelos Correios

Após a confirmação do pagamento, seu pedido será postado em até **3 dias**.

Assim que a postagem for realizada, enviaremos para você, por **WhatsApp ou e-mail**, o código de rastreamento dos Correios.

### Para retirada no lançamento

Seu pedido ficará reservado em seu nome no local escolhido:

**[SEDES / Livraria da Vila]**

É só chegar ao evento e informar seu nome para a nossa equipe.

Muito obrigada por caminhar com a Rede Habitare e por ajudar essa história de cuidado a continuar sendo construída.

**Equipe Rede Habitare**

---


## 5. Regras de quantidade, frete e retirada

### Quantidade e valores

Quantidade inicial 1, inteira e positiva. Controles menos/mais e edição direta acessível. Desabilitar menos em 1. **Não impor limite comercial de exemplares**. Rejeitar frações, negativos, zero, valores não numéricos e números fora da representação segura; essa proteção técnica não deve virar um teto arbitrário de compra.

Todos os cálculos em centavos inteiros; apresentação em BRL/pt-BR:

```text
precoUnitario = 8900
subtotal = quantidade * precoUnitario
freteCorreios = base + (quantidade - 1) * (base / 2)
freteRetirada = 0
total = subtotal + frete
```

| Faixa | UFs | Base do primeiro exemplar |
| --- | --- | ---: |
| São Paulo | SP | R$ 30,70 |
| Sul, demais estados do Sudeste e Centro-Oeste | PR, SC, RS, RJ, ES, MG, DF, GO, MT, MS | R$ 39,80 |
| Norte e Nordeste | AC, AP, AM, PA, RO, RR, TO, AL, BA, CE, MA, PB, PE, PI, RN, SE | R$ 41,60 |

**SP tem prioridade sobre a faixa Sudeste.** Cada adicional soma metade da base, nunca metade do frete acumulado. PAC, origem São Paulo capital, embalagem incluída; não acrescentar taxa de caixa ou buscar cotação dinâmica.

Sem UF válida em Correios, mostrar “Selecione a UF para calcular o frete”; não apresentar frete zero nem um total final enganoso. Atualizar subtotal, frete e total imediatamente ao alterar quantidade, UF ou modalidade. Tabela informativa de frete visível antes do Pix.

### Retirada e calendário

Disponível apenas **até 22/10/2026, 23:59:59, no fuso America/Sao_Paulo**. A partir de **23/10/2026 às 00:00**, remover toda a alternativa, inclusive locais, e aceitar apenas Correios. A escolha é intencionalmente encerrada no início do dia do evento, não ao fim dele.

- SEDES — 23/10/2026, 18h às 18h45.
- Livraria da Vila — 23/10/2026, 19h30 às 21h30.
- Seleção exclusiva e obrigatória do local; frete zero.
- Nome, e-mail, WhatsApp e CPF continuam obrigatórios.
- Não exibir nem exigir endereço nessa modalidade. Não enviar endereço residual após alternar para retirada.
- Não inventar endereço físico dos locais.

Validar corte também no servidor, por horário confiável, e na retomada de aba/avanço/envio. Não depender apenas de build estático ou relógio do dispositivo. Se a sessão atravessar a virada, preservar dados pessoais, invalidar retirada e pagamento anterior, explicar indisponibilidade e solicitar endereço/revisão do novo total.

O prazo de postagem é **até 3 dias após confirmação do Pix**. Não trocar por “dias úteis”, não contar a partir do formulário e não confundir com prazo de entrega dos Correios. Rastreamento comunicado manualmente pela equipe por WhatsApp ou e-mail após postagem.

## 6. Formulário e estados de interface

### Campos e validação

| Campo | Regra |
| --- | --- |
| Nome completo | Obrigatório em ambas as modalidades; aceitar acentos e nomes reais sem regex excessivamente restritiva |
| E-mail | Obrigatório, formato válido, tipo email |
| WhatsApp | Obrigatório, normalizar DDD/número e permitir máscara amigável |
| CPF | Obrigatório, normalizar 11 dígitos e validar dígitos verificadores; não enviar ao analytics |
| CEP | Obrigatório apenas Correios, 8 dígitos; máscara opcional |
| Endereço, número, bairro e cidade | Obrigatórios apenas Correios; permitir número textual como “s/n” |
| Complemento | Opcional |
| UF | Select com placeholder e todas as 27 UFs; somente valores enumerados |
| Local de retirada | Obrigatório apenas retirada, enumerado SEDES ou Livraria da Vila |
| Comprovante | Um arquivo obrigatório |
| Consentimento | Checkbox obrigatório, inicialmente desmarcado |

Busca automática por CEP é opcional e não deve bloquear preenchimento manual se o serviço falhar. Não integrar serviço externo desnecessariamente.

Revelação progressiva dentro da mesma LP. CTA do hero/ficha ancora em #pedido com compensação da altura do header e respeito a movimento reduzido. **Continuar para pagamento** valida quantidade, modalidade e todos os campos aplicáveis; somente então revela Pix/valor/comprovante. Não submeter o pedido nesse passo.

Se quantidade, UF, modalidade ou dados relevantes forem editados após abrir o Pix, invalidar a revisão, recalcular e exigir nova passagem pelo resumo. Se já houver comprovante, pedir revisão do valor e nova anexação quando o total mudar; não cobrar novamente nem sugerir que um segundo pagamento seja automaticamente necessário.

### Pix

Chave exibida: **05.407.750/0001-04**. Botão copia exatamente a chave e mostra **“Chave Pix copiada”** após sucesso real. Em falha da área de transferência, manter chave selecionável e instrução de cópia manual. Valor total antes da chave, com texto: **“Pague exatamente este valor para que possamos identificar e confirmar seu pedido.”**

Não inventar banco, agência, conta, nome de favorecido ou QR Code. Não tratar o upload como conciliação bancária. Pagamento é conferido manualmente pela equipe.

### Upload

Aceitar PDF, JPEG/JPG e PNG; proposta técnica: **um arquivo de até 3 MB (3.000.000 bytes)**. Exibir o limite junto aos formatos. Confirmar que limite total do endpoint/hospedagem comporta multipart e demais campos; ajustar arquitetura se necessário, sem anunciar um limite que o servidor não suporta.

Selecionar no mobile; drag-and-drop opcional no desktop, sempre com alternativa por teclado. Mostrar nome, tamanho, remover/substituir e erro específico. Validar no servidor extensão permitida, tipo declarado e assinatura real; rejeitar vazio, incompatível, executável ou excesso de tamanho. Sanitizar nome de arquivo. Não embutir prévia HTML nem expor arquivo por URL pública.

### Estados obrigatórios

- Inicial; modalidade selecionada; frete pendente; resumo válido.
- Campo inválido com mensagem associada e foco no primeiro erro.
- Pix aberto; cópia concluída/falhou.
- Arquivo selecionado/removido/rejeitado.
- Enviando: impedir cliques duplicados e anunciar progresso.
- Erro de validação, limite, conexão ou serviço: preservar dados em memória e permitir nova tentativa; nunca limpar tudo ou pedir novo Pix.
- Sucesso somente após resposta positiva real do backend; substituir toda a área transacional, manter conteúdo editorial e footer.

No sucesso, mostrar texto comum da seção 4, **somente o bloco da modalidade escolhida**, local correto quando retirada e agradecimento final. Dar foco ao título da confirmação. Incluir identificador não sensível do pedido se implementado.

A confirmação significa **pedido encaminhado, aguardando conferência do Pix**. Não exibir “pagamento aprovado”, “compra paga” ou promessa de e-mail automático ao comprador. Não incluir etapa de rastreamento em sucesso de retirada.

## 7. Backend, Resend e confiabilidade

### Arquitetura proposta

O site atual é estático e não tem backend Resend confirmado. Implementar endpoint real, por exemplo **POST /api/pedidos-livro**, em função do provedor compatível com o deploy existente. Manter páginas estáticas quando possível. Um arquivo de endpoint Astro em saída puramente estática não basta: configurar execução de servidor/adaptador ou função independente e testar no ambiente equivalente ao deploy.

Contrato recomendado: multipart/form-data com quantidade, modalidade, dados do comprador, endereço ou local, aceite/versão da política, comprovante e chave de idempotência. Não aceitar destinatários, preço, frete ou total definidos pelo cliente como fonte de verdade.

Servidor:

1. Validar método, origem, tamanho e proteção antispam/rate limiting.
2. Validar campos/arquivo, corte de retirada e consentimento.
3. Recalcular todos os valores a partir da configuração confiável.
4. Comparar total revisado pelo usuário com total atual; divergência exige revisão antes de encaminhar.
5. Criar identificador/data-hora do pedido e fixar payload para tentativas idempotentes.
6. Encaminhar por Resend aos **dois destinatários fixos**.
7. Responder JSON sanitizado; nunca expor chave, stack trace ou dados pessoais.

Respostas sugeridas: 2xx com status **aguardando_conferencia**, 400/422 para dados inválidos, 409 para pedido alterado/corte/total divergente, 413 para arquivo grande, 429 para limite e 5xx para falha de integração. Não retornar sucesso em erro do Resend.

### Envio

Destinatários obrigatórios:

- **ohabitare@gmail.com**
- **nathalia.e.machado@gmail.com**

Usar remetente de domínio verificado configurado no servidor; não inventar endereço nem usar e-mail do comprador como From. Reply-To pode usar e-mail validado do comprador. Resend aceita destinatários e anexos no envio; integrar conforme [referência oficial de envio](https://resend.com/docs/api-reference/emails/send-email) e [documentação de anexos](https://resend.com/docs/dashboard/emails/attachments).

Proposta: enviar o comprovante como anexo privado no mesmo e-mail, sem criar armazenamento público. Incluir versão texto e HTML com escaping seguro.

Assunto sugerido: **[Livro Habitare] Novo pedido — {id} — {Correios ou Retirada}**. Sem CPF no assunto.

Corpo deve conter nome, e-mail, WhatsApp, CPF, quantidade, preço unitário, subtotal, frete, total, modalidade, endereço somente Correios/local somente retirada, data/hora com fuso, aceite/versão da política e indicação **“Pagamento via Pix aguardando conferência manual”**. Anexar comprovante.

Proteção contra duplicidade deve funcionar em duplo clique e timeout/retry. Reutilizar mesma chave e mesmo payload no reenvio do mesmo pedido; mudanças reais criam nova tentativa. Resend oferece [chaves de idempotência](https://resend.com/docs/dashboard/emails/idempotency-keys); implementar conforme a janela documentada e não prometer deduplicação permanente. Timestamp, identificador e conteúdo precisam permanecer estáveis em um retry. Não usar apenas uma variável em memória de uma função sem estado como garantia.

Se houver resposta incerta, recuperar/repetir de forma idempotente antes de afirmar falha definitiva. Aceitação pela API não prova chegada às caixas: validar entrega nos dois destinatários no QA e documentar consulta de falhas/bounces no painel. Não criar automação de confirmação de Pix, emissão fiscal ou rastreamento.

### Configuração e operação

Documentar em .env.example, sem valores secretos:

- RESEND_API_KEY — somente servidor.
- BOOK_ORDER_FROM_EMAIL — remetente verificado.
- Destinatários fixos acima em configuração de servidor.
- Configuração de origem permitida e endpoint conforme infraestrutura.
- Modo de teste, separado de produção.
- Recursos adicionais de persistência/antispam, se a arquitetura os exigir.

Preço/frete/corte/Pix não são segredos, mas precisam de fonte única. Nunca prefixar a API key com PUBLIC_, incluí-la no bundle, commit ou logs. Ausência de configuração deve impedir compra operacional e produzir aviso claro; não mostrar sucesso simulado em produção.

Documentar como a equipe recebe, confere o Pix, posta em até 3 dias, envia rastreamento e atende retirada. Teste real por e-mail somente com dados fictícios e assunto identificando teste; não disparar pedidos fictícios à equipe sem autorização de teste.

## 8. Privacidade e proteção de dados

Manter integralmente o texto e checkbox aprovados. Linkar a política real do site. A inspeção não localizou uma rota de política confirmada: identificar o documento oficial; se inexistente, registrar como pendência de publicação, sem link morto, texto jurídico inventado ou destino genérico.

Não coletar consentimento de marketing junto ao pedido. Transmitir por HTTPS. Não colocar dados pessoais/comprovante em URL, analytics, localStorage, logs de requisição ou mensagens de erro. Manter preenchimento apenas na memória da página durante a tentativa, salvo necessidade de arquitetura explicitamente documentada.

Se houver armazenamento temporário, deve ser privado, com acesso restrito, expiração e eliminação documentadas. Evitar duplicação desnecessária do comprovante. A política de retenção dos e-mails/dados e responsáveis por acesso deve ser definida pela Habitare antes da operação; não inventar prazo legal. Este briefing especifica comportamento do produto, não certifica conformidade jurídica.

## 9. Banner na vitrine da Home

Adicionar um item em **src/data/banners.ts**, reutilizando **Carousel.astro**:

| Campo | Conteúdo obrigatório |
| --- | --- |
| ID sugerido | livro-rede-habitare |
| Título | Uma história de cuidado que agora também pode ser lida. |
| Descrição | Conheça o livro da Rede Habitare, que reúne mais de duas décadas de experiências, encontros e reflexões sobre parentalidade e cuidado. |
| CTA | Conheça o livro |
| Destino | /livro-rede-habitare |
| Desktop | /Users/vivianadelbianco/Clientes/Habitare/Assets/Banners/banner-livro-desktop.png |
| Mobile | /Users/vivianadelbianco/Clientes/Habitare/Assets/Banners/banner-livro-mobile.png |

Os caminhos acima são arquivos de origem; copiar para assets públicos e referenciar URLs do site. Eyebrow permitido: **LANÇAMENTO · REDE HABITARE**. Sem CTA secundário.

Preservar os demais banners e o comportamento de navegação do carrossel. Como a ordem não foi decidida na conversa, adicionar após os itens atuais sem reordená-los. Não incluir link novo no header. O CTA leva à LP, não diretamente ao Pix.

Copy como HTML sobre o fundo, não rasterizada. Mesma mensagem no mobile; quebras adaptáveis. Usar imagem mobile real, não corte automático da desktop. Conferir contraste, topo do header, presença proporcional do livro e ausência de sobreposição entre texto/CTA e capa. Ajustes de focal point devem ser restritos a esse banner.

## 10. Responsividade, acessibilidade e desempenho

Validar pelo menos em 360, 390, 768, 1024 e 1440 px, além de uma largura ampla de desktop. Sem rolagem horizontal, textos cortados, botões fora da tela ou teclado encobrindo controles essenciais.

Labels permanentes; autocomplete apropriado; inputmode conforme campo; grupos de radio com fieldset/legend; estados de erro com aria-describedby; mensagens assíncronas anunciadas; foco visível e ordem lógica. Área de toque confortável, idealmente 44 px. Não depender somente de cor. Testar teclado, zoom 200%, movimento reduzido e leitor de tela em jornada essencial.

Resumo legível sem tabelas largas no mobile; total e Pix podem quebrar linha sem cortar números. Otimizar assets e evitar carregar biblioteca pesada de formulário para interações simples. Não recriar fontes, animações ou componentes já existentes.

## 11. SEO e GA4

### SEO proposto

- Title: **Livro Rede Habitare: Sonhar e cuidar | Rede Habitare**.
- Description: **Conheça o livro Rede Habitare — Sonhar e cuidar da parentalidade em situações de vulnerabilidade e adquira seu exemplar diretamente com a organização.**
- H1 único: **Uma história de cuidado que agora também pode ser lida.**
- Canonical absoluto com domínio oficial já configurado e rota da LP.
- Incluir rota no sitemap existente.
- Reutilizar Base.astro e seus controles de release; não habilitar indexação de todo o site para publicar esta LP.
- Preview preserva política de não indexação; produção só indexa conforme configuração aprovada.
- OG/Twitter: título, descrição, URL e imagem real da campanha apropriada para compartilhamento, preferencialmente 1200 × 630. Não usar caminho local como og:image, nem cortar título/capa para caber.
- Validar URL da imagem por HTTP, Content-Type de imagem, dimensões e renderização de compartilhamento.
- Dados estruturados Book são opcionais: somente ficha conhecida; organização da obra não deve ser convertida em autoria por suposição. Não inventar reviews, estoque, avaliação ou disponibilidade.

Title/description e nomes de eventos são propostas técnicas novas, não textos previamente aprovados na conversa.

### Medição proposta

Reutilizar integração e consentimento existentes; confirmar ID GA4 e recebimento real de eventos. Não duplicar tags. Na ausência de configuração, entregar hooks funcionais e listar pendência sem afirmar medição ativa.

| Evento proposto | Gatilho |
| --- | --- |
| livro_home_banner_click | Clique no CTA específico da Home |
| livro_cta_click | CTA do hero ou ficha, com posição |
| livro_form_start | Primeira interação efetiva no pedido, uma vez |
| livro_delivery_select | Escolha Correios ou retirada |
| livro_payment_view | Dados validados e Pix revelado |
| livro_pix_copy | Cópia realmente concluída |
| livro_receipt_select | Arquivo local aceito, sem nome do arquivo |
| livro_order_submit | Tentativa válida de envio |
| livro_order_success | Resposta positiva do backend, uma vez por pedido |
| livro_order_error | Falha com código categórico sanitizado |

Parâmetros permitidos: posição, modalidade, quantidade, currency=BRL e valores numéricos quando pertinentes. Proibir nome, CPF, contato, endereço, comprovante, nome de arquivo e mensagens de erro livres. Não enviar identificador de pedido ao GA4 por padrão.

**Não disparar purchase:** pagamento ainda não foi confirmado. O evento de sucesso mede encaminhamento do pedido e pode ser conversão específica de formulário. Não criar compra fictícia. UTMs externas podem seguir convenção da campanha; não adicionar UTMs no link interno Home → LP. Analytics bloqueado/ausente nunca impede compra.

## 12. Critérios de aceite e evidências

### Conteúdo e visual

- [ ] Copy final preservada, ficha correta e nenhum link de compra para Amazon.
- [ ] Header inalterado em código e aparência; footer existente.
- [ ] Layout clean segue sistema atual; referência visual não prevalece sobre componentes/tokens.
- [ ] Assets originais corretos; sem capa recriada, deformada ou cortada indevidamente.
- [ ] Banner Home usa copy literal e backgrounds separados; demais slides preservados.
- [ ] CTA Home chega à rota correta; CTAs da LP chegam ao pedido.
- [ ] Revisão visual desktop/mobile documentada separadamente dos testes técnicos.

### Casos de cálculo obrigatórios

| Modalidade/UF | Quantidade | Livros | Frete | Total |
| --- | ---: | ---: | ---: | ---: |
| PAC/SP | 1 | R$ 89,00 | R$ 30,70 | R$ 119,70 |
| PAC/SP | 2 | R$ 178,00 | R$ 46,05 | R$ 224,05 |
| PAC/SP | 3 | R$ 267,00 | R$ 61,40 | R$ 328,40 |
| PAC/RJ | 1 | R$ 89,00 | R$ 39,80 | R$ 128,80 |
| PAC/DF | 2 | R$ 178,00 | R$ 59,70 | R$ 237,70 |
| PAC/BA | 1 | R$ 89,00 | R$ 41,60 | R$ 130,60 |
| PAC/AM | 3 | R$ 267,00 | R$ 83,20 | R$ 350,20 |
| Retirada/SEDES | 2 | R$ 178,00 | R$ 0,00 | R$ 178,00 |
| Retirada/Livraria da Vila | 1 | R$ 89,00 | R$ 0,00 | R$ 89,00 |

- [ ] Todas as 27 UFs mapeadas uma única vez; UF ausente/inválida não produz total final.
- [ ] Quantidade sem teto comercial; inválidos/frações/overflow rejeitados.
- [ ] Backend ignora adulteração de preço/frete/total e valida modalidades.
- [ ] Retirada aceita imediatamente antes do corte e rejeitada exatamente no corte; testar também aba aberta atravessando a data.
- [ ] Retirada sempre exige quatro dados pessoais e local, nunca endereço.
- [ ] Alteração pós-Pix força nova revisão e não mantém valor/comprovante incompatível.

### Jornada e integração

- [ ] Pix oculto até revisão válida; cópia e fallback testados.
- [ ] Upload aceita PDF/JPG/PNG válidos; rejeita assinatura falsa, tamanho excessivo e vazio.
- [ ] Consentimento não vem marcado; política abre endereço real.
- [ ] Dois cliques e retry após timeout não duplicam encaminhamento do mesmo pedido.
- [ ] Falhas não mostram sucesso, não apagam preenchimento e não pedem novo pagamento.
- [ ] Sucesso Correios mostra prazo/rastreamento; sucesso retirada mostra local correto.
- [ ] Nenhum estado confunde envio do formulário com aprovação de Pix.
- [ ] Em teste autorizado, ambos os destinatários recebem todos os campos aplicáveis e anexo legível.
- [ ] Segredos ausentes do bundle/repositório/logs; arquivos sem acesso público.
- [ ] API executa de fato no ambiente previsto; não é endpoint meramente estático.
- [ ] GA4 validado em ambiente de depuração, sem dados pessoais e sem purchase indevido.
- [ ] Canonical, sitemap, OG, indexação e links verificados.

### Verificação e entrega do desenvolvimento

Executar **npm run check** e **npm run build** no checkout correto. Criar testes significativos para fórmulas, mapeamento das UFs, corte de retirada, validação de upload e idempotência. Testar a API em ambiente compatível com a função de produção; build estático não valida envio de e-mail.

Entregar lista de arquivos alterados, rota e preview, screenshots desktop/mobile dos estados Correios/retirada/Pix/sucesso, resultados de testes, configuração necessária e manual curto de operação. Distinguir explicitamente: validação técnica local, revisão visual, teste real Resend/GA4 e validação de produção.

## 13. Pendências que não devem ser preenchidas por suposição

O briefing funcional está definido. Antes da publicação operacional, confirmar:

1. Originais estáveis da capa, KV e referência final de layout; estes dois últimos anexos visuais não foram integralmente inspecionados nesta consolidação.
2. API key do Resend, domínio/remetente verificado e infraestrutura de servidor.
3. URL/documento real da política de privacidade e rotina institucional de retenção/acesso.
4. ID/configuração GA4, política de consentimento e imagem OG adequada.
5. Teste autorizado de recebimento nos dois e-mails e revisão final do site.

Dados de conta além do CNPJ Pix e endereços dos locais não foram fornecidos; não são necessários ao fluxo especificado e não devem ser inventados. Não prometer automações de e-mail ao comprador, conciliação de Pix, estoque, Correios ou rastreamento que não fazem parte deste escopo.

**Orientação final ao Codex:** implemente este fluxo no projeto existente, preserve a copy e as regras aprovadas, mantenha o header intacto e reporte qualquer conflito real entre referência, assets e sistema atual antes de reinterpretar a solução.
