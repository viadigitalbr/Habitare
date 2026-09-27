> Atualização de QA — 25/09/2026: Viviana definiu Lora para todos os títulos, substituindo a orientação anterior de Maragsa. Fonte Lora local aplicada; essa pendência está encerrada. Vitrine com navegação manual por setas e bolinhas, sem botão Pausar e sem avanço automático. Banner editado aplicado à chamada de acolhimento na Home e na página de Atendimento.

# Briefing de reconstrução — Rede Habitare

Versão 1 • 24/09/2026 • Direcionamento de Viviana após leitura da auditoria.

## Objetivo e prioridade

Reconstruir o site institucional em código, para GitHub + Vercel da via.digital, preservando identidade e composição reconhecíveis e corrigindo legibilidade, responsividade, navegação e manutenção. Faça Parte e suas quatro páginas são a prioridade de negócio e implementação. O atendimento deve continuar fácil de encontrar.

## Decisões confirmadas

- Remover blog, seus seis posts de exemplo e todos os depoimentos do novo site. Não divulgar pacientes nem transportar o depoimento oculto do construtor.
- O site publicado é a referência operacional de conteúdo. Os documentos estratégicos antigos não justificam reabrir confirmações já respondidas. Manter modalidades, descrições e projetos existentes, com correções ortográficas e de interface.
- Home com vitrine de banners rotativos para campanhas e cursos, preparada para artes/enquadramentos desktop e mobile.
- Usar a identidade do Brandbook original, que prevalece sobre os resumos em `sources`.
- Deixar Cursos para a última etapa. A agenda é disponibilizada dez dias antes do início de cada mês. A maioria dos cursos é interna para membros; a divulgação também deve atrair novos associados. Não pressupor inscrições abertas ao público.
- Patricia cria os Google Forms e acompanha formulários/inscrições. O site continua encaminhando para os Forms; não construir uma base própria de inscrições nesta etapa.
- Todas as imagens da pasta Assets/Imagens têm direitos de uso ou foram geradas por IA, conforme confirmação de Viviana. Copiar apenas arquivos necessários; manter originais intactos.
- Projetos: preservar o conteúdo atual e seu escopo; não exigir novos textos ou dados de impacto.
- Migração administrada por via.digital + Codex; Viviana tem os acessos necessários. Habitare não tem e-mail no domínio. Não solicitar novamente esses acessos à cliente.

## Marca e arquivos

Origem: `/Users/vivianadelbianco/Clientes/Habitare/Assets`.

O Brandbook de março/2026, páginas 11 e 16, especifica **Maragsa Display** para H1/H2 e **Raleway** para textos, chamadas e H3. O resumo antigo que indicava Lora foi superado. A pasta contém Raleway e Lora; Maragsa não foi localizada na primeira leitura. Sua incorporação é uma pendência de arquivo, não uma nova escolha de identidade. Raleway local pode ser incorporada imediatamente.

Paleta: verde `#a5d998`, lilás `#cca2db`, rosa `#f7bbc0`; fundos `#d7edd2`, `#dccde7`, `#ffe9eb`, `#f8f7f2`; texto `#5b5955`, destaque `#915210`. Preservar cores suaves em superfícies e usar os tons escuros do manual para contraste. Logo horizontal no header, proporções e respiro preservados. Não adicionar efeitos ao logo.

Os arquivos públicos catalogados em ASSETS.md também podem ser recuperados por URL. A estratégia de migração é copiar os binários necessários para o projeto e servir a partir dele. Prioridade: original local → arquivo público catalogado quando não houver equivalente local. Não depender do CDN Hostinger depois da migração.

## Arquitetura

| Página | Tratamento |
|---|---|
| `/` | Preservar seções; acrescentar vitrine rotativa e dar destaque a Faça Parte. |
| `/faca-parte` | Hub prioritário com Membros, Doação, Mãe Social e Apadrinhamento. |
| `/quero-ser-membro-saude-mental` | Preservar proposta de voluntariado, supervisão e rede de formação. |
| `/doe-doacoes` | Dados confirmados, chave Pix copiável, transferência e contato. |
| `/mae-social` | Manter programa de visitas domiciliares remuneradas e CTA para Forms. |
| `/madrinha-social-e-apadrinhamento-social` | Manter quatro meses de atendimento e formulário de interesse; não inventar valor. |
| `/quero-ser-atendida-saude-mental-materna` | Manter três modalidades online e seus Forms; acesso pelo menu. |
| `/sobre-a-habitare` e `/projetos` | Preservar conteúdo; sem expansão de escopo. Próxima etapa após apoio. |
| `/cursos` | Última etapa, a desenhar com Viviana pensando em rotina mensal e associação. |
| `/blog-list`, `/blog-post*` | Não gerar páginas. Definir 404/410 ou redirecionamento relevante na migração, sem mandar tudo à Home. |

## Vitrine de banners

- Preparar por banner: identificador, título, texto breve, rótulo/destino do CTA, arte desktop, arte mobile, texto alternativo, posição do foco e estado ativo.
- Imagens sem texto obrigatório embutido. Títulos e CTAs em HTML, legíveis e acessíveis.
- Desktop: composição horizontal; celular: imagem própria ou recorte dedicado com texto em bloco separado, sem espremer a arte larga.
- Rotação suave a cada 7 segundos quando não houver interação; controles anterior/próximo, indicadores com rótulos e botão pausar/retomar.
- Pausar em hover, foco de teclado e aba oculta. Respeitar preferência por movimento reduzido. Sem rotação quando existe só um banner.
- Banner institucional e convite a apoiar podem demonstrar o componente. Não anunciar curso antigo como aberto nem inventar campanha/data. Banners de cursos entram após definirmos essa etapa.
- Troca de conteúdo deve acontecer num arquivo de dados centralizado; decidir eventual editor/CMS apenas na etapa de Cursos.

## Dados financeiros confirmados

Pix/CNPJ: **05.407.750/0001-04**. Banco Itaú; agência **8463**; conta corrente **08200-1**. Não gerar QR de pagamento sem payload validado. Copiar a chave não é confirmação de doação. Não acrescentar checkout ou recorrência de pagamento.

## Integrações, privacidade e publicação

Preservar IDs/destinos dos Forms auditados e centralizá-los para Patricia/via.digital atualizarem com facilidade. As restrições de login observadas não impedem o desenvolvimento das páginas, mas precisam ser verificadas com Patricia antes de ativar a nova versão. Não alterar Forms sem pedido específico.

GA4 `G-R427M1B8Q3` será preservado na etapa de medição. Não carregar rastreamento no protótipo local. Política de privacidade, decisão de consentimento e validação dos eventos ficam como aceite de publicação, sem transformar isso em bloqueio à montagem do site. Não enviar dados clínicos ou formulários ao analytics.

**OG Images:** mapear e criar para as páginas principais antes da publicação. Pendência lembrada a Viviana no marco escolhido. Não usar imagem genérica inventada como arte aprovada.

## Sequência de trabalho

1. Base visual e estrutura; Faça Parte + quatro páginas prioritárias; Home com vitrine.
2. Atendimento, Sobre e Projetos com o conteúdo existente; revisar navegação e versão móvel.
3. Cursos por último: reunião de decisões sobre agenda mensal, membros/público, manutenção, estados e divulgação na vitrine.
4. OG Images, privacidade, medição e validação final; então GitHub/Vercel/DNS sob condução via.digital.

## Critérios de aceite da primeira versão local

Conteúdo das páginas prioritárias preservado; logo e cores oficiais; sem blog/depoimentos; CTAs levam aos destinos existentes; Pix copiado com retorno acessível; menu navegável por teclado; vitrine com controles e pausa; ausência de overflow em 390/768/1440 px; fontes legíveis, contraste e foco visível; nenhuma divulgação de datas/vagas inventadas; build estático reproduzível. Preview não significa autorização de publicação.

## Decisões futuras, sem bloquear esta etapa

Arquivo Maragsa; mapeamento das OG Images; detalhes da página Cursos; política final de privacidade/analytics; confirmação de acesso anônimo aos Forms por Patricia. Os demais itens respondidos por Viviana estão encerrados.
