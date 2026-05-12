# ANALYTICS

> **Infraestrutura de medição** do cliente. Ferramentas, eventos, tagueamento, dashboards.
> Métricas e KPIs específicos: site (`23-website.md`), social (`22-social.md`), operacionais (`55-kpis.md`).
> Aqui mora **como** e **onde** se mede.
> Squad responsável: **Relatórios e Performance**.

---

## 1. Princípio de Medição

- **Critério único para ferramentas e métricas:** servir à decisão. Métrica que ninguém olha não existe.
- **Hierarquia de dados:** dados de conversão (triagem, inscrição em curso, doação) > dados de comportamento (alcance, engajamento) > dados de vaidade (curtidas).
- **Verdade única:** quando ferramentas divergerem, Instagram Insights é a fonte da verdade para métricas de social. GA4 é a fonte da verdade para comportamento no site.
- **Contexto ONG:** métricas de performance do conteúdo são proxies para impacto de missão — alcançar mães vulneráveis e converter profissionais em alunos.

---

## 2. Ferramentas de Medição em Uso

### Web Analytics

| Ferramenta | Propósito | Conta | Acesso | Status |
|---|---|---|---|---|
| Google Analytics 4 | Comportamento de site, conversões (triagem, doação, curso) | [A preencher após acesso] | Habitare — acesso via.digital pendente | **Pendente** |
| Google Search Console | SEO, indexação, busca orgânica para termos de saúde mental perinatal | [A preencher após acesso] | Habitare — acesso via.digital pendente | **Pendente** |

### Social Media Analytics

| Ferramenta | Propósito | Conta | Acesso | Status |
|---|---|---|---|---|
| Instagram Insights (nativo) | Alcance, engajamento, crescimento, stories, cliques bio | @rede.habitare | Requer acesso de admin — pendente | **Pendente** |
| Meta Business Suite | Visão consolidada Instagram + Facebook; audiências | [A preencher] | Pendente configuração | **Pendente** |

### Paid Media Analytics
> [NÃO APLICÁVEL — Mídia paga não está no escopo atual]

### Tag Management

| Ferramenta | Propósito | Status |
|---|---|---|
| Google Tag Manager | Gestão de tags do site para eventos GA4 | A configurar após acesso |

---

## 3. Eventos a Configurar (GA4 — quando acesso for liberado)

### Eventos do site

| Nome do evento | Onde dispara | Parâmetros | Importância | Status |
|---|---|---|---|---|
| `page_view` | Cada página | url, referrer | Padrão | ⏳ A configurar |
| `form_submit_triagem` | Formulário de triagem de mães | form_name = "triagem" | **Alta — conversão primária** | ⏳ A configurar |
| `cta_click_atendimento` | Clique em "Preciso de atendimento" | page, cta_label | Alta | ⏳ A configurar |
| `cta_click_apoiar` | Clique em "Quero apoiar" / "Quero apadrinhar" | page, cta_label | Alta | ⏳ A configurar |
| `cta_click_cursos` | Clique em páginas/botões de cursos | page, curso | Alta | ⏳ A configurar |
| `instagram_click` | Clique no link do Instagram a partir do site | referrer = site | Média | ⏳ A configurar |
| `whatsapp_click` | Clique em botão WhatsApp | page | Média | ⏳ A configurar |
| `scroll_75` | Scroll de 75% em página estratégica | page | Média | ⏳ A configurar |

### Conversões macro a configurar

| Nome | Definição | Onde dispara |
|---|---|---|
| **Triagem enviada** | Formulário de triagem de mãe submetido com campos obrigatórios | Página de atendimento + agradecimento |
| **Clique em doação/apadrinhamento** | Clique em CTA de doação que leva para link externo | Home + Faça Parte |
| **Clique em inscrição de curso** | Clique no CTA de inscrição de curso específico | Página de cursos |

---

## 4. Configuração de Conversão

### Modelo de atribuição (a definir após configuração)
- **GA4:** Data-driven (recomendado) ou Last click
- **Meta Business Suite:** 7 dias clique + 1 dia view

### UTMs padronizadas
Estrutura para links nas campanhas e bio do Instagram:
```
?utm_source=instagram&utm_medium=social&utm_campaign={campanha}&utm_content={post_id}
```

Exemplos:
- Bio do Instagram: `utm_source=instagram&utm_medium=social&utm_campaign=bio`
- Post específico: `utm_source=instagram&utm_medium=social&utm_campaign=divulgacao_curso&utm_content=maio2026`

---

## 5. Configurações Específicas por Ferramenta

### Google Analytics 4
- **Property ID:** [A preencher após acesso]
- **Stream ID:** [A preencher após acesso]
- **Domínio rastreado:** redehabitare.org.br
- **IP do escritório filtrado?** A verificar
- **Conversões marcadas:** triagem_enviada, clique_doacao, clique_curso (a ativar após configuração)

### Meta Business Suite / Instagram
- **ID de conta Business:** [A preencher após acesso]
- **Página do Facebook vinculada:** [A verificar]
- **Pixel Meta ID:** [A preencher após acesso]
- **Conversions API:** A avaliar (recomendado para campanha futura)

### Google Search Console
- **Propriedade verificada:** redehabitare.org.br
- **Método de verificação:** [A definir — recomendado: tag HTML ou Google Analytics]
- **Sitemap enviado:** [A enviar após acesso]

---

## 6. Dashboards e Relatórios

### Dashboards a criar

| Dashboard | Ferramenta | Periodicidade | Audiência | O que terá |
|---|---|---|---|---|
| Performance mensal Instagram | Relatório próprio (PDF/Canva) | Mensal | Porta-voz + Habitare | Alcance, engajamento, crescimento, posts de destaque |
| Visão geral do site | Looker Studio (a criar) | Mensal | Viviana + Habitare | Visitas, CTAs clicados, tráfego orgânico |

### Relatórios entregues ao cliente

| Relatório | Periodicidade | Quem entrega | Quem recebe | Formato |
|---|---|---|---|---|
| Performance mensal Instagram | Mensal | Squad Analytics | Porta-voz + Habitare | PDF ou documento no Drive |
| Análise trimestral estratégica | Trimestral | Viviana + Analytics | Dra. Tereza + porta-voz | Apresentação + recomendações |

---

## 7. Gestão de Acessos

| Ferramenta | Quem precisa ter acesso | Nível | Status |
|---|---|---|---|
| Instagram (@rede.habitare) | via.digital | Administradora | **Pendente — Habitare** |
| Meta Business Suite | via.digital | Gerente ou Anunciante | **Pendente — Habitare** |
| Google Analytics 4 | via.digital | Analista | **Pendente — Habitare** |
| Google Search Console | via.digital | Usuário | **Pendente — Habitare** |

> Revisão de acessos: a cada 3 meses ou ao fim do projeto.

---

## 8. Privacidade e LGPD

- **Política de privacidade do site:** [A verificar se existe e se está atualizada — redehabitare.org.br]
- **Cookie banner:** [A verificar — necessário se há GA4 ativo]
- **Dados sensíveis:** Histórias e dados de mães atendidas NUNCA entram em analytics de marketing. São dados clínicos protegidos por sigilo profissional e LGPD.
- **Consentimento de dados de leads:** Formulário de triagem deve ter checkbox de consentimento explícito — verificar implementação.

---

## 9. Histórico de Mudanças

| Data | Mudança | Razão | Quem fez |
|---|---|---|---|
| — | — | — | — |

---

## 10. Próximos Passos

- [ ] Receber acesso de administradora ao Instagram → iniciar coleta de dados históricos de métricas
- [ ] Receber acesso ao GA4 → configurar eventos e metas conforme seção 3
- [ ] Instalar Google Tag Manager no site → configurar eventos
- [ ] Verificar presença de cookie banner no site
- [ ] Configurar UTMs padronizadas para bio do Instagram
- [ ] Criar dashboard mensal de performance após 1º mês com dados

---

## ⚠️ Regras de uso

- **Sem acesso ao Instagram Insights, relatório mensal é limitado** — registrar como "dados não disponíveis" com justificativa
- **Dados de mães atendidas são sigilosos** — nunca usados em analytics ou remarketing
- Coerência com `22-social.md` (métricas esperadas) e `55-kpis.md` (KPIs operacionais)
