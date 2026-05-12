# ESTRATÉGIA DE WEBSITE

> Estratégia completa do site.
> Squad responsável: **Website & SEO**.

---

## 1. Objetivo Principal do Site

### Função primária
- [x] Geração de leads qualificados (mães que buscam atendimento, doadores, profissionais interessados em cursos)
- [x] Validação institucional / autoridade (ONG de credibilidade com 20+ anos)

### Funções secundárias
- Triagem inicial de mães que buscam atendimento
- Apresentação dos cursos de formação profissional
- Conversão de doadores (apadrinhamento, doação pontual)
- Recrutamento de voluntários (profissionais)

### O que o site NÃO é
- Não é plataforma de e-commerce — as doações são direcionadas para link externo
- Não é blog editorial — o conteúdo editorial é o Instagram; o site é institucional

---

## 2. KPIs do Site

| Métrica | Meta | Onde medir |
|---|---|---|
| Formulários de triagem enviados/mês | [A definir após baseline + Habitare] | GA4 |
| Cliques em "Quero apoiar" / "Quero apadrinhar" | [A definir após baseline] | GA4 |
| Acessos mensais ao site | [A definir após auditoria técnica] | GA4 |
| Taxa de conversão de visita em formulário | [A definir após baseline] | GA4 |
| Tráfego orgânico (busca) | Crescimento mês a mês | GA4 + Search Console |

> **Status atual:** Analytics ainda não configurado. Aguarda acesso ao GA4 e Search Console. Ver `33-status.md`.

---

## 3. Arquitetura de Informação (Sitemap)

### Páginas atuais / propostas

- **Home (`/`)** — apresentação geral + CTAs para os três públicos
- **Sobre (`/sobre` ou `/quem-somos`)** — história, fundadora, base teórica, parceiros
- **Atendimento (`/atendimento` ou `/preciso-de-atendimento`)** — para mães; como funciona + formulário de triagem
- **Faça Parte (`/faca-parte`)** — para doadores e voluntários; apadrinhamento + como apoiar
- **Cursos (`/cursos` ou `/formacao`)** — para profissionais; cursos disponíveis + inscrição
- **Contato (`/contato`)** — formulário geral + redes + email
- **Política de privacidade** / **Termos** — páginas legais

### Páginas a confirmar com Habitare
- Verificar se site atual tem blog ou área de artigos científicos
- Verificar se há página de "Impacto" ou "Resultados" — se não, recomendar criação

---

## 4. Wireframe Textual por Página

### Home
1. **Hero** — Headline: "Cuidando de quem cuida na parentalidade." + Sub: três pilares em uma linha + CTA "Preciso de atendimento" / "Quero apoiar"
2. **O problema** — "A maternidade real não deveria ser solitária" — bloco de contexto
3. **Os três pilares** — Atendimento / Conhecimento / Formação com cards
4. **Depoimento** — com mãe atendida (autorização obrigatória) ou parceiro
5. **Como fazer parte** — 3 opções (mãe / doador / profissional) com CTA específico
6. **Credibilidade** — logos de parceiros (Einstein, PUC-SP, Casa Ângela)
7. **Footer** — contato, redes, newsletter

### Página de Atendimento
1. **Hero** — "Você não precisa atravessar isso sozinha."
2. **Como funciona** — processo simples, humanizado, sem burocracia
3. **Formulário de triagem** — campos: nome, contato, região, fase (gestante/puerpério), breve descrição
4. **Para quem é** — gestantes e puérperas em vulnerabilidade em SP
5. **O que esperar** — próximos passos após envio do formulário

### Página Faça Parte
1. **Hero** — "Transforme o início da vida de alguém."
2. **Apadrinhamento** — R$150/mês = 4 meses de atendimento
3. **Doação pontual** — qualquer valor
4. **Para profissionais** — voluntariado clínico
5. **Patrocínio corporativo** — link para contato institucional

---

## 5. Jornada de Conversão

### Fluxo 1 — Mãe que busca atendimento
1. Mãe busca "atendimento psicológico gratuito São Paulo" / "depressão pós-parto ajuda"
2. Encontra a página de Atendimento no Google (SEO) ou vem do Instagram (link na bio)
3. Lê o conteúdo, se sente acolhida
4. Preenche formulário de triagem
5. Equipe da Habitare entra em contato

### Fluxo 2 — Doador
1. Descobre a Habitare pelo Instagram ou indicação
2. Chega na home ou na página "Faça Parte"
3. Escolhe forma de apoio
4. Clica em CTA de doação (link externo ou formulário)

### Fluxo 3 — Profissional que busca formação
1. Busca "curso psicanálise perinatal São Paulo" ou similar
2. Chega na página de Cursos
3. Vê o que está disponível
4. Clica em CTA de inscrição

### Pontos de conversão
- **CTA primário:** "Preciso de atendimento" → formulário de triagem
- **CTA secundário:** "Quero apoiar" / "Quero apadrinhar"
- **CTA terciário:** "Conheça nossos cursos" / "Quero ser voluntário(a)"

---

## 6. SEO — Estratégia

### Termos prioritários

| Palavra-chave | Intenção | Prioridade |
|---|---|---|
| saúde mental perinatal | Informacional / profissionais | Alta |
| saúde mental materna | Informacional / mães | Alta |
| atendimento psicológico gratuito São Paulo | Transacional / mães | **Máxima** |
| depressão pós-parto | Informacional / mães | Alta |
| vínculo mãe-bebê | Informacional | Alta |
| ONG saúde mental materna | Navegacional / doadores | Alta |
| formação psicanálise perinatal | Transacional / profissionais | Alta |
| psicologia perinatal | Informacional / profissionais | Média |
| curso saúde mental materno-infantil São Paulo | Transacional / profissionais | Alta |

### SEO técnico — Checklist de auditoria (pendente)
> **Status:** Auditoria não realizada. Aguarda acesso ao painel Hostinger e Search Console.

- [ ] Títulos H1 únicos por página
- [ ] Meta-titles entre 50–60 caracteres com palavra-chave
- [ ] Meta-descriptions entre 140–160 caracteres
- [ ] Estrutura de heading semântica (H1 → H2 → H3)
- [ ] URLs limpas com hífen e lowercase
- [ ] Imagens com alt-text descritivo
- [ ] Schema markup (Organization, FAQ)
- [ ] Sitemap XML enviado ao Google Search Console
- [ ] Robots.txt configurado
- [ ] Open Graph tags para compartilhamento social

---

## 7. Performance Técnica (a auditar)

| Métrica | Meta | Status |
|---|---|---|
| LCP | < 2.5s | Não auditado |
| CLS | < 0.1 | Não auditado |
| Score Mobile (Lighthouse) | > 85 | Não auditado |
| Score Desktop (Lighthouse) | > 90 | Não auditado |

---

## 8. Stack Técnico (a confirmar)

- **Plataforma/CMS:** A verificar (WordPress, HTML estático — pendente acesso ao Hostinger)
- **Hospedagem:** Hostinger
- **Domínio:** redehabitare.org.br (Registro.br ou similar — a confirmar)
- **SSL:** A verificar
- **Analytics:** GA4 — pendente configuração (ver `40-analytics.md`)

---

## 9. Roadmap de Site

### Próximos 3 meses
- Concluir auditoria técnica (velocidade, mobile, SEO on-page)
- Configurar GA4 e Search Console
- Revisar e atualizar copy das páginas principais conforme `05-copy-site.md`
- Implementar formulário de triagem com integração ao email da equipe

### Próximos 6 meses
- Criar ou reestruturar página de Cursos com informações sempre atualizadas
- Otimização SEO das páginas principais
- Avaliar necessidade de redesign ou apenas ajustes

---

## ⚠️ Regras de uso

- Mudanças estruturais no site precisam de aprovação da Habitare
- Copy das páginas vem de `05-copy-site.md` (já documentado) — não criar copy novo sem consultar
- Acesso ao site: aguardando credenciais do Hostinger da Habitare (ver `33-status.md`)
