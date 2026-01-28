# Sugestões de Melhoria Futura: Sales Prospector AI

Com base na análise técnica e nas refatorações recentes, aqui estão as recomendações prioritárias para a evolução do projeto:

## 1. Segurança e Arquitetura (Prioridade Alta)

### Implementação de Backend-for-Frontend (BFF)
**Problema Atual:** A `GEMINI_API_KEY` é exposta no cliente (navegador), permitindo que usuários maliciosos a roubem e consumam sua cota.
**Solução:**
- Criar um servidor intermediário (Node.js Express, NestJS ou Next.js API Routes).
- Mover a lógica de chamada do `geminiService.ts` para este servidor.
- O frontend envia apenas os inputs; o servidor autentica a requisição e chama a API do Google usando a chave armazenada em variáveis de ambiente seguras.

### Autenticação Robusta
**Melhoria:** Se o Supabase for usado em produção, implementar Row Level Security (RLS) no banco de dados para garantir que usuários só acessem seus próprios leads.

## 2. Qualidade e Testes (Prioridade Média)

### Cobertura de Testes Automatizados
**Estado Atual:** O projeto carece de uma suíte de testes abrangente.
**Sugestão:**
- **Unitários:** Instalar `Vitest` para testar a lógica de negócios isolada (ex: `useStore`, funções de parsing do Gemini).
- **Integração/E2E:** Configurar `Playwright` para testar fluxos críticos (Login -> Dashboard -> Gerar Lead -> Salvar).

### CI/CD Pipeline
**Sugestão:** Configurar GitHub Actions para rodar o lint, build e testes automaticamente a cada Pull Request.

## 3. Funcionalidades e UX (Prioridade Média)

### Internacionalização (i18n)
**Estado Atual:** Textos hardcoded em Português.
**Sugestão:** Utilizar `react-i18next` para isolar as strings de texto, permitindo suporte futuro a Inglês e Espanhol, expandindo o mercado alvo da ferramenta.

### Acessibilidade (a11y)
**Sugestão:** Auditar o app com ferramentas como Lighthouse ou Axe. Melhorar o suporte a navegação por teclado e leitores de tela (ARIA labels), especialmente nos componentes customizados como o `ToolsHub`.

### Modo Offline Real
**Sugestão:** Implementar Service Workers (PWA) para permitir que o app carregue e permita visualização de leads cacheados mesmo sem internet.

## 4. Integração de IA (Evolução)

### Streaming de Respostas
**Sugestão:** Implementar `streamGenerateContent` do Gemini.
**Benefício:** Em vez de esperar 5-10 segundos vendo "Processando...", o usuário veria o texto sendo digitado em tempo real, melhorando muito a percepção de performance.

### RAG (Retrieval-Augmented Generation)
**Sugestão:** Permitir que o usuário faça upload de PDFs (ex: Catálogo de Produtos da empresa).
**Implementação:** Usar a API de Embedding do Gemini para que as ferramentas de vendas consultem esse catálogo ao gerar scripts, tornando as respostas ainda mais precisas.
