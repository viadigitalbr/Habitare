# Sobre a Habitare — implementação de 27/09/2026

Página local: `/sobre-a-habitare`. Nenhuma publicação realizada.

## Conteúdo e fontes

- Copy preservada de `BRIEFING-SOBRE.md`; instruções editoriais não são conteúdo público.
- 11 momentos editoriais em 7 agrupamentos visuais; Hero sem CTA; botões finais usam `/faca-parte` e `/#o-que-fazemos`, destinos existentes.
- Linha do tempo: 1999, 2000, 2003 e 2004 confirmados no texto visível de `../../auditoria-habitare/evidencias/sobre-a-habitare.html`, registro institucional de 24/09/2026. A meta description antiga contradiz o texto ao citar fundação em 2004: não foi reutilizada. A data 2000 coincide com o briefing aprovado.
- Projeto de Atenção à Gestante aparece na referência antiga sem data própria. Não ganhou um marco datado por inferência.
- Os nove nomes de projetos são históricos. Nenhuma descrição, parceiro adicional ou indicação de atividade atual foi adicionada.
- Tereza: apenas biografia aprovada no briefing; sem currículo complementar.
- Assets originais preservados. Derivados WebP e dimensões em `ASSETS-SOBRE.json`.

## Pendências editoriais

- Receber relação atual de profissionais e associação nome/função/arquivo. A pasta tem capturas sem identificação e duplicatas; não inferir identidades pela aparência. O componente de cards está pronto e condicionado aos registros validados em `src/data/about.ts`. Não há cards vazios ou notas de produção na página.
- Confirmar a imagem definitiva de compartilhamento: por ora utiliza o Hero fornecido, com URL absoluta no domínio oficial. MIME local esperado: image/webp. Verificação da URL de produção somente após disponibilizar os novos arquivos no domínio; não afirmar que essa URL já está publicada.
- Descrições e status individuais de projetos só serão adicionados se fornecidos e validados.

## Revisão visual

CSS possui composições próprias para mobile, grids adaptáveis e linha do tempo vertical. A revisão visual em navegador de desktop/mobile ficou pendente porque o controle de navegador não conseguiu verificar a política de segurança do ambiente. Não foi contornado esse bloqueio.

## Verificações concluídas

- `astro check`: zero erros, avisos ou sugestões.
- `astro build`: 9 páginas geradas com sucesso, incluindo `/sobre-a-habitare`.
- HTML gerado: H1 único, Hero sem link/botão, título SEO exato e canonical oficial.
- Comparação automatizada de 26 blocos de prosa com o briefing; demais títulos, valores e pilares mantidos na fonte.
- Destinos internos e âncoras existentes; imagens locais presentes com alt e dimensões; imagem social é WebP válido.
- Nove assets otimizados totalizam aproximadamente 710 KiB.
- Nenhuma nota de implementação exposta como texto público.
