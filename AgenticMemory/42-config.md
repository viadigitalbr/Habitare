# CONFIGURAÇÕES E ACESSOS

> **Stack tecnológico ativo** do cliente. Ferramentas em uso, integrações, gestão de acessos.
> Nunca armazenar senhas ou tokens aqui — apenas referência ao gerenciador.
> Squad responsável: **Automação & Tecnologia** (transversal — lido por todas as squads).

---

## 1. Princípios de Gestão de Stack

- **Stack mínimo viável.** ONG com orçamento limitado — cada ferramenta precisa se justificar.
- **Documentação antes de ferramenta.** A Habitare tem processos que precisam ser documentados antes de qualquer automação.
- **Acessos geridos com responsabilidade.** Acessos concedidos à via.digital são de uso profissional e revogados ao encerrar o projeto.
- **Gratuito sempre que possível.** Preferência por ferramentas com plano gratuito robusto (Google, Meta, Canva gratuito).

---

## 2. Stack Atual — Visão Geral

### Marketing & Comunicação

| Ferramenta | Categoria | Plano/Tier | Uso principal | Status |
|---|---|---|---|---|
| Instagram (@rede.habitare) | Rede social | Gratuito | Canal principal de comunicação | Ativo — acesso via.digital pendente |
| Meta Business Suite | Gestão social + analytics | Gratuito | Gestão do Instagram + análises | A confirmar se conta existe e está vinculada |
| ohabitare@gmail.com | Email institucional | Gmail (gratuito) | Comunicação institucional | Ativo |

### Conteúdo e Design (via.digital — em uso para produção)

| Ferramenta | Categoria | Uso principal | Status |
|---|---|---|---|
| Canva | Design | Produção de artes de posts e stories | Em uso pela via.digital |
| Google Drive | Repositório | Calendário editorial, artes, relatórios compartilhados | Ativo — pasta compartilhada |

### Site & Infraestrutura

| Ferramenta | Categoria | Status |
|---|---|---|
| redehabitare.org.br | Site institucional | Ativo |
| Hostinger | Hospedagem | Ativo — acesso via.digital pendente |
| [CMS do site] | A verificar (WordPress?) | A confirmar após acesso ao Hostinger |

### Analytics (todos pendentes de acesso)

| Ferramenta | Status |
|---|---|
| Google Analytics 4 | Pendente — aguarda acesso |
| Google Search Console | Pendente — aguarda acesso |
| Instagram Insights (via Meta BS) | Pendente — aguarda acesso de admin ao Instagram |
| Meta Pixel | A configurar |

### Comunicação com Clientes / Atendimento

| Ferramenta | Uso | Status |
|---|---|---|
| WhatsApp | Atendimento de mães e profissionais; comunicação com via.digital | Ativo |
| [Formulário do site] | Triagem de mães (se implementado) | A verificar |

### Inscrições em Cursos (a confirmar)

| Ferramenta | Uso | Status |
|---|---|---|
| Sympla | Plataforma recomendada para inscrição e pagamento de cursos | A confirmar se em uso |
| [Alternativa] | [Formulário Google / próprio?] | A verificar com Habitare |

---

## 3. Integrações Ativas

### Integração 1 — Instagram ↔ Meta Business Suite
- **Sistemas:** Instagram @rede.habitare ↔ Meta Business Suite
- **Ferramenta:** Nativa (Meta)
- **Dado transferido:** Publicações, métricas, gestão de conta
- **Status:** A verificar se vinculada corretamente

### Integração 2 — Instagram → Google Drive (produção de conteúdo)
- **Sistemas:** Produção de artes (Canva) → armazenamento no Drive → publicação no Instagram
- **Ferramenta:** Manual (arquivo salvo, upload manual)
- **Status:** Processo manual atual — a ser automatizado futuramente se Hootsuite ou similar for adotado

---

## 4. Gestão de Acessos

### Gerenciador de senhas
- [A preencher — onde a Habitare armazena credenciais + Habitare]

> **Recomendação:** Utilizar 1Password Teams (plano ONG gratuito) ou Bitwarden Business para gestão segura de credenciais.

### Matriz de acessos necessários para a via.digital

| Ferramenta | Pessoa | Nível necessário | Status | Data solicitação |
|---|---|---|---|---|
| Instagram @rede.habitare | via.digital | Administradora | **Pendente** | Abril/2026 |
| Meta Business Suite | via.digital | Gerente ou Anunciante | **Pendente** | Abril/2026 |
| Google Analytics 4 | via.digital | Analista | **Pendente** | Abril/2026 |
| Google Search Console | via.digital | Usuário | **Pendente** | Abril/2026 |
| Hostinger (hPanel) | via.digital | Leitura para auditoria | **Pendente** | Pendente solicitação |

### Política de acessos
- Revisão de acessos: a cada 3 meses
- Ao encerrar o projeto: acessos da via.digital revogados em até 48h
- Acessos a dados clínicos ou de beneficiárias: **nunca** concedidos à via.digital

---

## 5. Domínios e Propriedades Digitais

| Domínio | Registrador | Hospedagem | Auto-renovação |
|---|---|---|---|
| redehabitare.org.br | [A confirmar + Habitare] | Hostinger | [A confirmar + Habitare] |

### Certificado SSL
- **Status:** A verificar (deve estar ativo em site com formulários)
- **Provedor:** Normalmente Let's Encrypt via Hostinger (automático)

---

## 6. Backups e Continuidade

### Sistemas com backup

| Sistema | Backup | Frequência | Status |
|---|---|---|---|
| Site redehabitare.org.br | Backup via Hostinger (nativo) | A verificar | A confirmar |
| Artes e conteúdo (via.digital) | Google Drive | Contínuo | Ativo |
| Arquivos de memória agêntica | Repositório do projeto | A cada entrega | Ativo |

### Plano de contingência
- **Site fora do ar:** Acionar Hostinger + Habitare imediatamente; verificar se problema é de domínio, hospedagem ou CMS
- **Perda de acesso ao Instagram:** Acionar Meta Business Suite + Dra. Tereza para recuperação via proprietária da conta

---

## 7. Custos Recorrentes Estimados

| Ferramenta | Custo mensal | Tipo | Observação |
|---|---|---|---|
| Instagram/Meta | R$0 | Gratuito | Orgânico no escopo atual |
| Google Analytics + Search Console | R$0 | Gratuito | — |
| Gmail (ohabitare@gmail.com) | R$0 | Gratuito | Não Google Workspace |
| Hostinger | [A confirmar + Habitare] | Anual (estimativa mensal) | — |
| Canva (via.digital para produção) | Incluso no R$500/mês | — | Custo da via.digital |

---

## 8. Histórico de Mudanças no Stack

| Data | Mudança | Razão | Quem decidiu |
|---|---|---|---|
| — | — | — | — |

---

## 9. Roadmap de Stack

### Ferramentas em avaliação
- **Ferramenta de agendamento de posts** (Buffer, Later, Hootsuite gratuito) — a avaliar quando acesso ao Instagram for liberado; melhora a autonomia de publicação
- **Formulário de triagem estruturado** (Google Forms ou Typeform gratuito) — para substituir contato informal por WhatsApp e alimentar analytics
- **Sympla** — para inscrições em cursos com pagamento integrado (se ainda não em uso)

### Substituições previstas
- Nenhuma prevista no curto prazo

---

## ⚠️ Regras de uso

- **Nunca colocar senha, token ou credencial aqui** — apenas referência ao gerenciador
- **Acessos a dados clínicos e de beneficiárias: zero** — fora do escopo da via.digital
- Ferramentas de analytics: detalhe em `40-analytics.md`
- Bases de dados e fluxo informacional: `43-fontes.md`
