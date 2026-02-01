# Sales Prospector v2 (Versão Final)

## Visão Geral
Plataforma completa de Inteligência de Vendas (SaaS), construída com arquitetura escalável e segura.

## Arquitetura
- **Frontend:** React 18, Vite, Tailwind CSS, Zustand, React Query.
- **Backend (BFF):** Node.js, Express, Security Hardening (Helmet, Rate Limit).
- **Banco de Dados:** Supabase (PostgreSQL) com RLS e Billing integrado.
- **IA:** Google Gemini 1.5 Flash via Proxy Seguro.
- **Infra:** Docker Compose (API + Worker + Frontend).

## Como Rodar (Quick Start)

### Pré-requisitos
- Node.js 20+
- Docker & Docker Compose

### Instalação
1. Clone o repositório.
2. Copie o arquivo de ambiente:
   ```bash
   cp .env.example .env
   ```
3. Instale as dependências:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```

### Execução em Desenvolvimento
Para rodar frontend e backend localmente:
```bash
npm run dev
# Em outro terminal:
npm run server
```

### Execução via Docker (Produção/Simulação)
```bash
docker-compose up --build
```
Acesse: `http://localhost:80` (Frontend) e `http://localhost:3001` (Backend).

## Funcionalidades Principais
- **Dashboard:** Métricas em tempo real e gráficos interativos.
- **Meus Leads:** Gestão de leads com pontuação e status.
- **AI Lab:** Geração de e-mails frios e análise de fit via IA (Mock ou Real).
- **Ferramentas:** Kanban, Calculadora ROI, Testador de API.
- **Segurança:** Autenticação via Supabase, Proteção de Rotas, Logs de Auditoria.

## Estrutura de Pastas
- `/src`: Código fonte Frontend.
- `/server`: Código fonte Backend (BFF e Workers).
- `/supabase`: Migrations e configurações de banco.
- `/e2e`: Testes End-to-End (Playwright).

---
**Status:** Production Ready (Ciclos 1-12 Concluídos)
