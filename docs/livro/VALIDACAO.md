# Validação local — LP do livro

## Atualização de UI/UX — 30/09/2026

QA atualizado para três telas: validação por etapa, botões de voltar, preservação de campos e de comprovante quando não houve edição, invalidação após editar o pedido, consentimento obrigatório do pedido separado do Analytics e modal informativo sem ações de consentimento. O corte da retirada retorna ao passo 1. Aviso inicial removido; backend sem configuração só bloqueia a abertura do pagamento, sem revelar o Pix.

Cores verificadas no navegador: H1 #b03f24 e compra #f8f3ed em cinco larguras; backgrounds desktop/mobile no hero, sem data. Evidências novas: `hero-390.png`, `hero-1440.png`, `pedido-etapa1-390.png`, `pedido-etapa1-1440.png`, `pedido-etapa2-mobile.png`, `pedido-etapa3-mobile-teste.png` e `qa/report.json`. Capturas antigas de fluxo contínuo são históricas e não representam esta revisão.

- `npm run check`: 0 erros, 0 warnings, 0 hints.
- `npm run build`: concluído; LP gerada na saída estática.
- `npm run test:book`: **22 testes aprovados**.
- Chrome instalado: LP em 360, 390, 768, 1024 e 1440 px, sem overflow horizontal e com H1 único.
- QA funcional: Correios, ambas as retiradas, cálculo dinâmico, Pix, edição que invalida revisão, falha simulada, reenvio de payload/chave idênticos, sucesso específico e virada de data em aba aberta.
- Modal: abertura, fechamento por Escape, recusa, aceite e retirada; preview sem GA4. Teste adicional com release habilitado somente na resposta interceptada: nenhum script antes de aceitar, script carregado após aceite e eventos interrompidos após retirada. Chamadas ao Google interceptadas: **nenhuma medição real**.
- Banner: imagens reais inspecionadas em desktop/mobile/tablet; ajustes restritos ao novo destaque para manter o livro inteiro e texto legível.
- Header sem alterações. Footer atualizado com links de privacidade e cookies abaixo dos copyrights.
- Saída gerada: canonical da LP, noindex da prévia, og:image WebP e entrada no sitemap verificados.
- `git diff --check`: sem erros de whitespace.

## Limites desta validação

Os testes usam o handler real com transportes Resend e Redis simulados. **Nenhum e-mail real foi enviado**, não houve Pix, não foi configurado GA4 no painel, não houve commit/deploy e não foi testada a função no ambiente Vercel publicado. O pedido real permanece desabilitado até configuração e teste operacional.

As capturas em `qa/` mostram a implementação local, não comprovam reprodução de um layout final anexado: esse layout não estava disponível entre as referências recuperadas. Aprovação visual permanece com Viviana.

Configuração, contrato, operação e pendências detalhados em `IMPLEMENTACAO.md`.

## Ajustes de cookies e prévia local — 30/09/2026

Aviso inicial resumido no canto inferior direito; links no rodapé. Check e build concluídos sem erros, 22 testes aprovados e fluxo de navegador aprovado em cinco larguras. O endpoint local retorna `available: false`. Somente em desenvolvimento e localhost, a etapa de pagamento pode ser visualizada sem token, com aviso explícito, chave oculta, cópia e envio bloqueados. Produção continua exigindo revisão assinada pelo servidor e configuração operacional. Nenhum envio real foi realizado.
