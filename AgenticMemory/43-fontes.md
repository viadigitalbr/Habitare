# FONTES DE DADOS

> **Bases de dados e fluxo informacional** do cliente. Onde os dados nascem, onde moram, como circulam.
> Diferente de `42-config.md` (ferramentas) e `40-analytics.md` (medição de marketing): aqui mora o **panorama de dados** do negócio da Habitare.
> Squad responsável: **Relatórios e Performance / Automação & Tecnologia**.

---

## 1. Princípios de Gestão de Dados

- **Fonte da verdade única.** Para cada tipo de dado (mães, profissionais, doadores), definir um sistema como referência.
- **Sigilo clínico inegociável.** Dados de mães atendidas são cobertos por sigilo profissional e LGPD — nunca integram bases de marketing.
- **Histórico preservado.** Dados históricos de atendimento têm valor científico — não apagar sem política definida.

---

## 2. Inventário de Bases de Dados

### Base 1 — Dados de Mães Atendidas (base clínica)
- **O que armazena:** Dados de mães atendidas: nome, contato, localização, situação clínica, histórico de sessões
- **Sistema:** [A preencher — planilha interna? Software de prontuário? + Habitare]
- **Volume aproximado:** [A preencher + Habitare]
- **Atualização:** Manual — por profissional atendente
- **Fonte da verdade?** Sim — para dados clínicos
- **Quem alimenta:** Terapeutas / coordenação clínica
- **Quem consome:** Coordenação clínica, supervisores
- **Risco se corrompida:** Alto — impacta continuidade do cuidado
- **⚠️ Nota de escopo:** Esta base está **completamente fora do escopo da via.digital** — acesso zero.

### Base 2 — Dados de Profissionais em Formação
- **O que armazena:** Psicólogos e psicanalistas inscritos em cursos, supervisões e voluntariado
- **Sistema:** [A preencher — formulário? planilha? Sympla? + Habitare]
- **Volume aproximado:** [A preencher + Habitare]
- **Atualização:** Por ciclo de curso/supervisão
- **Fonte da verdade?** Sim — para gestão de alunos e voluntários
- **Quem alimenta:** Coordenação da Habitare
- **Quem consome:** Coordenação + via.digital (apenas para dados de divulgação: número de vagas, datas)
- **Risco se corrompida:** Alto — impede gestão de cursos

### Base 3 — Dados de Doadores
- **O que armazena:** Dados de doadores individuais (PF) — nome, contato, histórico de doação
- **Sistema:** [A preencher — planilha? sistema de doações? + Habitare]
- **Volume aproximado:** [A preencher + Habitare]
- **Atualização:** Por doação recebida
- **Fonte da verdade?** Sim — para gestão de relacionamento com doadores
- **Quem alimenta:** Coordenação / administrativo da Habitare
- **Quem consome:** Coordenação + via.digital (para contexto de comunicação com esse público)

### Base 4 — Audiência do Instagram (@rede.habitare)
- **O que armazena:** Seguidores, dados demográficos, engajamento, alcance
- **Sistema:** Instagram Insights / Meta Business Suite
- **Volume aproximado:** 1.300+ seguidores (Abril/2026)
- **Atualização:** Automática / em tempo real
- **Fonte da verdade?** Sim — para métricas de social
- **Quem alimenta:** Automático (Meta)
- **Quem consome:** via.digital (relatório mensal) + Habitare (visibilidade)
- **Status:** Acesso pendente

### Base 5 — Comportamento no Site
- **O que armazena:** Visitas, origens de tráfego, conversões (triagem, doação, curso), comportamento por página
- **Sistema:** Google Analytics 4
- **Atualização:** Automática / em tempo real
- **Fonte da verdade?** Sim — para métricas do site
- **Quem consome:** via.digital (relatório mensal + recomendações de SEO)
- **Status:** Acesso pendente

### Base 6 — Parceiros Institucionais e Corporativos
- **O que armazena:** Dados de parceiros, histórico de parcerias, status de relacionamento
- **Sistema:** [A preencher — email? planilha? + Habitare]
- **Quem alimenta:** Dra. Tereza / coordenação
- **Quem consome:** Interno Habitare + via.digital (para contexto de comunicação institucional)

---

## 3. Tipos de Dados Mantidos

### Dados clínicos / de beneficiárias
- **O que se mantém:** Dados de mães atendidas — clínicos e pessoais
- **Onde:** Sistema interno da Habitare (a mapear)
- **Sensibilidade LGPD:** **Máxima — dados sensíveis de saúde** (Art. 11 LGPD)
- **Acesso da via.digital:** Zero — completamente fora do escopo

### Dados de profissionais e alunos
- **O que se mantém:** Inscrições, participação, certificados
- **Onde:** A mapear
- **Sensibilidade LGPD:** Média — dados pessoais com finalidade de formação

### Dados de doadores
- **O que se mantém:** Identidade, contato, histórico de doação
- **Onde:** A mapear
- **Sensibilidade LGPD:** Média — dados pessoais com finalidade de relacionamento

### Dados de marketing e analytics
- **O que se mantém:** Comportamento no site, métricas do Instagram, dados de audiência
- **Onde:** GA4 / Instagram Insights / Meta Business Suite
- **Sensibilidade LGPD:** Baixa — dados agregados e comportamentais

---

## 4. Fluxo de Dados Relevante para a via.digital

### Fluxo 1 — Lead de atendimento (mãe busca ajuda)
- **Origem:** Instagram DM / formulário do site / WhatsApp
- **Destino:** Equipe de acolhimento da Habitare (email + WhatsApp)
- **Transformação:** Nenhuma — contato direto
- **Frequência:** Contínua / assíncrona
- **Mecanismo:** Manual
- **Relevância para via.digital:** Saber que esse fluxo existe para direcionar corretamente CTAs no conteúdo

### Fluxo 2 — Inscrição em curso (profissional)
- **Origem:** Formulário do site / Sympla (se em uso) / WhatsApp
- **Destino:** Planilha/sistema de gestão de cursos da Habitare
- **Frequência:** Por ciclo de curso
- **Relevância para via.digital:** Confirmar dados com a Habitare antes de divulgação; evitar divulgar vagas esgotadas

### Fluxo 3 — Doação (doador)
- **Origem:** Link de doação no site / Instagram
- **Destino:** Sistema de pagamento / administrativo da Habitare
- **Relevância para via.digital:** Garantir que CTAs de doação apontam para links corretos e ativos

---

## 5. Relatórios Existentes

### Relatórios de marketing (produzidos pela via.digital)

| Relatório | Periodicidade | Para quem | Como é gerado |
|---|---|---|---|
| Performance mensal Instagram | Mensal | Porta-voz + Habitare | Instagram Insights + consolidação manual |
| Análise trimestral | Trimestral | Dra. Tereza + porta-voz | Instagram Insights + GA4 (quando disponível) |

### Relatórios internos da Habitare (a mapear)
> A via.digital não tem acesso a relatórios internos da ONG. O conhecimento abaixo é apenas de contexto.

| Relatório | Periodicidade | Para quem | Status |
|---|---|---|---|
| [Relatório de atendimentos] | [A preencher + Habitare] | Coordenação / Conselho | A mapear |
| [Relatório de captação] | [A preencher + Habitare] | Diretoria | A mapear |

---

## 6. Qualidade de Dados

### Problemas conhecidos
| Base | Problema | Impacto | Plano |
|---|---|---|---|
| Instagram Insights | Sem acesso — zero dados disponíveis para via.digital | Impossibilita relatório contratado | Resolver urgentemente via concessão de acesso |
| GA4 | Não configurado ou sem acesso | Sem dados de comportamento no site | Resolver ao liberar acesso |

---

## 7. LGPD e Privacidade

### Bases legais para tratamento de dados
- **Dados de mães (clínicos):** Execução de serviço de saúde + legítimo interesse de prevenção
- **Dados de profissionais:** Execução de contrato (inscrição em curso)
- **Dados de doadores:** Consentimento + execução de relação de apoio
- **Dados do site (analytics):** Legítimo interesse + cookie banner (a implementar)

### Pontos críticos LGPD para a via.digital
- Nunca usar dados de mães atendidas para qualquer ação de marketing
- Formulário de triagem deve ter consentimento explícito (a verificar no site)
- Depoimentos de beneficiárias: autorização específica, por escrito, para uso público específico

---

## 8. Próximos Passos

- [ ] Mapear sistema de gestão de inscrições de cursos da Habitare (qual ferramenta/planilha?)
- [ ] Mapear fluxo de recebimento de doações (link externo qual? plataforma de pagamento?)
- [ ] Verificar se formulário de triagem está implementado no site
- [ ] Verificar política de privacidade no site (existe? está atualizada?)
- [ ] Configurar GA4 após acesso liberado → ativar eventos críticos

---

## ⚠️ Regras de uso

- **Dados de mães atendidas: acesso zero para a via.digital** — sigilosos por ética clínica e LGPD
- Fonte da verdade para social: Instagram Insights; para site: GA4
- Coerência com `40-analytics.md` (configuração de medição) e `42-config.md` (ferramentas)
