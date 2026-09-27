# Rede Habitare — reconstrução

Primeira versão local. GitHub + Vercel serão configurados pela via.digital na etapa de publicação. Nada foi publicado.

- Briefing: [docs/BRIEFING.md](docs/BRIEFING.md).
- Imagens/fontes locais preservadas na origem; cópias em `public/`. Proveniência em [docs/ASSETS-UTILIZADOS.json](docs/ASSETS-UTILIZADOS.json).
- Dados e links dos Forms: `src/data/site.ts`.
- Vitrine: `src/data/banners.ts`. Cada banner tem imagens desktop/mobile, texto, CTA e estado ativo.
- Cursos é a última etapa. Sobre já é uma página local. Cursos ainda abre o site público de referência nesta primeira versão. Não publicar assim.
- Tipografia aprovada por Viviana: Lora nos títulos e Raleway nos textos e botões; arquivos locais incorporados.
- Nenhum blog ou depoimento é gerado. Nenhum formulário é enviado pelo site; os links preservam os destinos atuais.

## Executar

Node >=22.12.0. `npm ci`, depois `npm run dev`. Validar com `npm run check` e `npm run build`.

## Antes da publicação

- Revisar com Viviana a versão visual e o conteúdo.
- Validar a relação da equipe e a imagem social de Sobre (ver docs/SOBRE-VALIDACAO.md); decidir Cursos por último.
- OG Images por página principal.
- Revisar restrições de acesso dos Forms com Patricia, sem acessar respostas clínicas.
- Finalizar privacidade/consentimento e GA4 na propriedade existente. Preview não carrega analytics.
- Sitemap, robots, redirecionamentos/retirada das páginas de blog e 404; testar preview Vercel antes do DNS.
- `PUBLIC_RELEASE_READY` é falso por padrão, com noindex/nofollow. Ativar somente na publicação aprovada.

## Referências técnicas

- [Astro — instalação](https://docs.astro.build/en/install-and-setup/).
- [W3C — carrosséis acessíveis](https://www.w3.org/WAI/tutorials/carousels/).

O site tem saída estática, HTML sem depender de JavaScript para o conteúdo e scripts pequenos para menu, vitrine e cópia de Pix. Na configuração da Vercel, usar preset Astro, comando `npm run build` e pasta `dist`.

## Pasta principal

Projeto migrado em 27/09/2026 para `/Users/vivianadelbianco/Clientes/Habitare/website`. Execute os comandos nesta pasta. Auditoria em `auditoria-habitare/`; referências de leitura em `sources/`. A pasta antiga permanece apenas como cópia de segurança.
