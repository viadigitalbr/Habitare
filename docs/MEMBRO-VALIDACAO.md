# Seja membro — entrega para validação

Implementação local em 27/09/2026. Sem commit ou deploy.
Prévia: http://127.0.0.1:4321/seja-membro

## Alterações
Hero e cinco seções conforme briefing, imagem original, fontes Lora/Raleway, cores e componentes existentes. Contato mantido por site.email. Menu Faça parte ativo. Conteúdo anterior removido da página; resumo dos cards de Home/Faça parte preservado para não alterar outros conteúdos.

## Rotas
/quero-ser-membro-saude-mental → /seja-membro.
301 confirmado no servidor Astro local. vercel.json configura 301 HTTP na Vercel. Saída estática Astro inclui fallback HTML com refresh, canonical novo e noindex, sem conteúdo duplicado. A resposta HTTP em produção ainda depende da publicação e deve ser validada lá.
Links dos cards são gerados a partir do slug atualizado. Sitemap gerado com o domínio da configuração Astro, contendo somente a nova URL de membros.

## Formulário
PUBLIC_MEMBER_FORM_URL em .env (exemplo em .env.example), lido por forms.membro em src/data/site.ts. Atualização autorizada em 28/09/2026: o destino padrão temporário é https://forms.gle/EgzsqDg22MhYUcEH9. O botão está ativo e abre na mesma aba, seguindo o padrão atual dos formulários. PUBLIC_MEMBER_FORM_URL permite substituir esse destino; um valor explicitamente vazio desativa o botão. Não foi criado formulário.

## SEO
Title: Seja membro da Rede Habitare | Voluntariado em Saúde Mental
Description: Faça parte da Rede Habitare como profissional voluntária. Atuação clínica, supervisão e formação continuada em saúde mental na parentalidade.
Canonical e OG URL: https://redehabitare.org.br/seja-membro (domínio já configurado no projeto).
OG e Twitter title/description herdam os mesmos textos no layout Base.
Mantido noindex/nofollow do preview, controlado por PUBLIC_RELEASE_READY. Não alterar antes da aprovação de publicação.

## Analytics
cta_membro_hero e cta_membro_form com page_path fixo /seja-membro, cta_location e cta_label. Sem query string ou dados pessoais.
Integração com gtag, ou dataLayer já existente, sem instalar/carregar tracker. O protótipo não possui GA4 nem persistência de UTM ativos; não foi criado armazenamento paralelo. A URL atual permanece no scroll por âncora. O redirect Astro local não preserva query string; validar preservação de UTMs na regra Vercel após publicação. Recebimento real no GA4 permanece pendente da integração de medição já prevista no projeto.

## Verificações
- npm run check: 22 arquivos, zero erros, avisos ou hints.
- npm run build: aprovado, inclusive sitemap.
- Navegador: 1440, 768 e 390 px sem overflow horizontal; cards 3/2/1 colunas; hero mobile em uma coluna.
- Hero: navegação por âncora e foco na seção confirmados. Smooth scroll e reduced motion reutilizam CSS global existente.
- Um H1, cinco seções principais e contato; ausência de copy antiga e formulário antigo no HTML gerado.
- Na validação inicial, botão desativado sem URL; console sem erros ou avisos. Em 28/09/2026, ativado com o formulário antigo por autorização da usuária.
- Eventos exercitados em teste isolado com gtag, dataLayer e ausência de analytics; os dois nomes e parâmetros são emitidos corretamente. O envio real de conversão não foi realizado.
- Não há scripts separados de lint ou testes no package.json.

## Arquivos desta entrega
- src/pages/seja-membro.astro (novo)
- src/pages/sitemap.xml.ts (novo)
- src/pages/[slug].astro
- src/data/site.ts
- src/components/Header.astro (somente indicação de seção ativa)
- astro.config.mjs
- vercel.json (novo)
- .env.example
- docs/MEMBRO-VALIDACAO.md (este relatório)

Alterações preexistentes em src/data/banners.ts, src/styles/about.css e imagens do banner de doação preservadas.
