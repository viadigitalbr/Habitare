# Pausa de vendas — 26/10/2026

Sem previsão de reposição. `BOOK.salesPaused` em `src/lib/book.ts` controla a mensagem estática e o bloqueio da API. A pausa prevalece sobre `BOOK_ORDERS_ENABLED=true`; não depende de alterar credenciais na Vercel.

Somente a seção #pedido exibe o aviso. O formulário original permanece na alternativa condicional. A API responde GET com available:false/salesPaused:true e rejeita revisão JSON e envio multipart com 409/out_of_stock antes de acessar Redis ou Resend.

## Configuração operacional

Após autorização específica, configurar BOOK_ORDERS_ENABLED=false em Preview/HML e Production/PRD e fazer novo deploy de cada ambiente. Variáveis não foram alteradas por esta implementação. Manter PUBLIC_RELEASE_READY como está.

## Retomada

Após confirmação de estoque e autorização de Viviana: mudar BOOK.salesPaused para false, configurar BOOK_ORDERS_ENABLED=true no ambiente autorizado e fazer novo build/deploy. Conferir preços, frete e regras de retirada vigentes antes de reativar; não reabrir retirada de evento passado. Executar check/build/test:book e validar HML antes de solicitar publicação em PRD. Atualizar o teste que confirma a pausa comercial conforme a nova situação de estoque. A descrição SEO permanece institucional.

A ordenação da Home permanece: seja-membro, livro, institucional, doação. Não há dados estruturados de oferta introduzidos por esta mudança.
