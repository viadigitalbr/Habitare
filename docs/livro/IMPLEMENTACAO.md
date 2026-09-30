# Livro Rede Habitare — implementação e operação

## Revisão de UI/UX — 30/09/2026

- Hero usa os backgrounds originais da campanha em versões WebP, sem a data e sem a capa isolada; a capa na ficha do livro permanece.
- Paleta restrita à LP: #b03f24 em títulos, destaques e botões; #f5eadf nos fundos antes lilás; #f8f3ed na seção de compra. Header e demais páginas preservados.
- Checkout em três telas exclusivas. Etapa 1: quantidade, recebimento e local de retirada. Etapa 2: comprador, endereço condicional e aceite do pedido. Etapa 3: Pix, comprovante e confirmação. Botões Voltar preservam os campos; revisão/arquivo são invalidados apenas quando os dados são editados. O resumo aparece na lateral em desktop e antes das ações em mobile.
- Frete explicativo em disclosure “Como funciona o frete?”; preço e cálculo continuam visíveis no resumo. Na etapa 1 de Correios, o frete é anunciado como calculado no próximo passo.
- Aviso inicial de indisponibilidade removido. É possível passar do pedido aos dados sem credenciais. Abrir o Pix continua dependendo da revisão real do servidor; eventual falha aparece junto à ação, sem simular pagamento ou sucesso.
- Checkbox “Li e aceito as políticas de privacidade para o processamento deste pedido.” vinculado ao modal informativo, sem botões de aceitar/recusar dentro dele. Texto de finalidade do pedido preservado.
- Modal separado de Analytics no primeiro acesso sem escolha anterior; ações discretas com área de toque acessível. Fechar sem escolher mantém Analytics bloqueado e não repete o aviso naquela sessão. Preferências podem ser alteradas pelo link discreto “Preferências de cookies”. O aceite do pedido nunca autoriza Analytics.

Essa revisão substitui a apresentação anterior descrita nos itens históricos abaixo.

## Resultado local

Rota: `/livro-rede-habitare`, com âncora `#pedido`. Novo destaque ao final da vitrine da Home, preservando os anteriores. Header e Footer originais sem alterações. Layout editorial usando Lora/Raleway, tokens, containers e botões existentes. A referência final de layout não foi recuperada; esta versão segue o briefing e depende da revisão visual de Viviana.

O endpoint `api/pedidos-livro.mjs` é uma função Node separada do site Astro estático. A página calcula o pedido localmente; o servidor recalcula e valida antes de revelar o Pix e antes de enviar. Não há checkout externo, integração bancária, estoque ou rastreamento automático.

## Atualização aprovada durante a implementação

Viviana informou que ainda não há política de privacidade e pediu um modal com seu texto sobre GA4. Essa decisão substitui a pendência de URL da política no briefing anterior. Foi implementado um componente separado, antes do footer, com o texto literal informado e ações Aceitar Analytics, Recusar Analytics e Retirar consentimento.

O aceite dos dados do pedido permanece obrigatório e independente, com o texto aprovado na copy. O modal não é apresentado como uma política jurídica completa. Recusar Analytics nunca bloqueia o pedido.

O GA4 institucional `G-R427M1B8Q3`, já registrado em `docs/BRIEFING.md`, só carrega quando `PUBLIC_RELEASE_READY=true` **e** o visitante aceita. A prévia não carrega Analytics mesmo após aceitar. A preferência é armazenada localmente, sem dados do pedido. Retirar o consentimento desabilita novas medições, remove cookies `_ga` acessíveis e sincroniza a escolha entre abas. O componente não altera o Header ou o Footer.

## Configuração para operação

No servidor, preencher as variáveis de `.env.example`:

| Variável | Uso |
| --- | --- |
| `BOOK_ORDERS_ENABLED` | `false` por padrão; usar `true` somente após os testes reais de envio |
| `RESEND_API_KEY` | Chave privada da conta Resend |
| `BOOK_ORDER_FROM_EMAIL` | Remetente em domínio verificado no Resend, exemplo de formato `Rede Habitare <endereco-no-dominio-verificado>`; não usar o e-mail do comprador como remetente |
| `BOOK_ORDER_SECRET` | Segredo aleatório privado com pelo menos 32 caracteres, para assinatura de revisões e hashes |
| `BOOK_ALLOWED_ORIGINS` | Origens adicionais exatas, separadas por vírgula; domínio oficial já permitido; adicionar o preview autorizado ou `http://127.0.0.1:4321` para um teste local real |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Rate limiting compartilhado entre instâncias; não usa armazenamento público de pedidos |

Não foi criada conta, recurso pago ou credencial em serviços externos. O Redis é uma opção técnica de proteção distribuída para a função sem estado; se a infraestrutura institucional adotar rate limiting equivalente no gateway, substituir esse adaptador e seus testes antes de ativar o envio. O serviço permanece indisponível enquanto faltar configuração.

Destinatários fixos no servidor: `ohabitare@gmail.com` e `nathalia.e.machado@gmail.com`. O cliente não pode alterá-los. Sem configuração, a interface permite conhecer o livro e calcular valores, mas não mostra Pix nem aceita envio real. Não há sucesso simulado no produto.

Para Vercel, manter o framework Astro e a saída `dist`; a função é descoberta em `/api`, com export `fetch` Web Standard. Isso é separado do build estático. Validar a função no preview autorizado antes do release; nenhum deploy foi feito nesta tarefa. Referência: [Node.js Functions da Vercel](https://vercel.com/docs/functions/runtimes/node-js).

## Execução local

Com Node 24 (validado), executar:

```sh
npm run dev:book
```

Isso inicia o endpoint em `127.0.0.1:4322` e usa a prévia Astro em `127.0.0.1:4321`. O proxy `/api/pedidos-livro` existe apenas no desenvolvimento. Astro pode manter um daemon próprio; interromper o comando encerra o endpoint e não necessariamente esse daemon. `npm run dev` sozinho serve a página, mas precisa do endpoint separado para verificar disponibilidade.

`npm run check`, `npm run build` e `npm run test:book` não enviam e-mails. Nenhuma chave real é necessária para esses testes.

## Contrato e regras do pedido

- `GET /api/pedidos-livro`: disponibilidade e relógio do servidor, com `Cache-Control: no-store`.
- `POST` JSON: dados do comprador/pedido e total revisado; devolve revisão assinada, identificador e totais. Sem envio de e-mail neste passo.
- `POST` multipart: os mesmos dados, token, comprovante, `consent=yes`, `privacyVersion=pedido-livro-v1`; valida e encaminha o e-mail.
- Quantidade inteira positiva, sem teto comercial, protegida contra overflow.
- Preço R$ 89. Frete SP R$ 30,70; demais Sul/Sudeste/Centro-Oeste R$ 39,80; Norte/Nordeste R$ 41,60. Adicionais: metade da base por exemplar.
- Retirada sem frete, escolha obrigatória de SEDES ou Livraria. Encerramento em 23/10/2026 às 00:00 de São Paulo; servidor e aba aberta validam o corte.
- Dados pessoais em ambas as modalidades; endereço somente Correios. Valores enviados pelo browser não são fonte de verdade.
- Upload de um PDF/JPG/PNG de até 3.000.000 bytes; corpo de até 3.200.000 bytes. Extensão, MIME e assinatura verificados. Assinatura não equivale a antivírus: anexos recebidos devem ser tratados como arquivos externos pela equipe.
- Nome de arquivo do anexo é substituído por nome seguro. Dados de texto têm escaping no HTML do e-mail.
- Rate limiting: 20 chamadas POST por janela de 10 minutos por hash de IP, com expiração em 660 segundos. IP bruto não é enviado ao Redis nem registrado pela aplicação.
- Resultado positivo: `aguardando_conferencia`. A confirmação da API não significa pagamento aprovado nem entrega comprovada do e-mail às caixas.

## Retries, privacidade e limites operacionais

O token liga o pedido normalizado a um identificador e horário fixos. Em falha incerta, o navegador mantém exatamente o mesmo FormData em memória, bloqueia edição e oferece reenvio. A mesma chave e o mesmo payload são enviados ao Resend. A revisão expira em 23 horas, dentro da janela de 24 horas documentada pelo Resend; não há promessa de deduplicação eterna. Referências: [envio de e-mail](https://resend.com/docs/api-reference/emails/send-email), [anexos](https://resend.com/docs/dashboard/emails/attachments), [idempotência](https://resend.com/docs/dashboard/emails/idempotency-keys).

Se a revisão expirar ou houver conflito após uma tentativa, a interface orienta contato com a equipe sem novo Pix. Recarregar/fechar a página perde os dados em memória; há aviso de saída enquanto um envio permanece incerto. Não usar localStorage para o pedido/CPF/comprovante. Caso seja necessária recuperação entre dispositivos ou sessões, implementar persistência privada em uma etapa específica.

O comprovante só é anexado ao e-mail, sem URL pública ou arquivo permanente no servidor. Credenciais ficam no servidor. A aplicação não registra corpo do pedido nem resposta bruta do provedor. Política de acesso e retenção das mensagens deve ser definida pela organização.

A data no e-mail é a data da revisão assinada do pedido, estável para retries; o painel do Resend registra o momento do encaminhamento. Não há e-mail automático ao comprador.

## Operação da equipe

1. Receber e conferir os dados e o comprovante nos dois e-mails.
2. Confirmar o Pix manualmente na conta institucional.
3. Para Correios, postar em até **3 dias após a confirmação**, sem trocar esse prazo por dias úteis; enviar rastreamento por WhatsApp ou e-mail.
4. Para retirada, separar no local selecionado; SEDES 18h–18h45 ou Livraria da Vila 19h30–21h30, em 23/10/2026.
5. Consultar falhas/bounces no painel do Resend e tratar pedidos incertos antes de orientar qualquer novo pagamento.

## Validação local e pendências de release

- Testes unitários e de contrato em `tests/book.test.mjs`: fórmulas, UFs, CPF, corte, origem, assinatura/limite de arquivo, consentimento, valores adulterados e payload idempotente.
- QA de Chrome em `scripts/qa-book.mjs`: cinco larguras, duas modalidades e locais, Pix, edição, erro/reenvio, sucesso, corte em aba aberta e modal. Transporte de e-mail/Redis simulado exclusivamente no teste.
- Evidências em `docs/livro/qa/`. Screenshots com “teste” são estados simulados, não pedidos reais.
- Header/Footer sem diff; noindex de preview preservado; rota adicionada ao sitemap; OG WebP 1200 × 630 a partir do fundo aprovado, sem cortar a composição.

Antes da publicação: revisar aparência com Viviana, configurar remetente/credenciais/proteção, autorizar um teste fictício identificado e comprovar entrega nos dois destinatários, validar API no ambiente Vercel, consentimento e eventos na propriedade GA4, e compartilhar OG no domínio publicado. Desativar a captura automática de interações de formulário na configuração de medição aprimorada do GA4 se ela estiver ativa; esta implementação envia somente os eventos explícitos sem dados pessoais. O teste de GA4 real não foi feito e não há alteração na propriedade.

Os eventos de sucesso medem encaminhamento do pedido; não é disparado `purchase`. Campanhas e URL podem usar atribuição própria posteriormente; o tracking atual remove query/hash de page_location para evitar envio acidental de dados pessoais.
