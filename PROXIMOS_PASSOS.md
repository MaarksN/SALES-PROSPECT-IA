# Próximos Passos e Plataforma Tecnológica

Aqui está o roadmap detalhado para a evolução do **Sales Prospector AI**, focado em profissionalizar a aplicação para produção.

## 🏢 Plataforma Tecnológica Atual
A aplicação é construída sobre uma stack moderna de **Single Page Application (SPA)**:

*   **Frontend:** React 18 (TypeScript)
*   **Build System:** Vite
*   **Inteligência Artificial:** Google Gemini 1.5 Flash (via SDK `@google/genai`)
*   **Gerenciamento de Estado:** Zustand
*   **Roteamento:** React Router Dom v6
*   **Estilização:** Tailwind CSS
*   **Testes:** Vitest + React Testing Library
*   **Internacionalização:** i18next (Infraestrutura pronta)

---

## 🚀 Roadmap de Próximos Passos (Priorizado)

### 1. Segurança Crítica: Implementar Backend-for-Frontend (BFF)
**Status:** 🔴 Crítico / Pendente
**Ação:** Criar um servidor Node.js/Express leve para intermediar as chamadas à IA.
**Por que:** Atualmente, a API Key do Gemini está exposta no navegador. Isso permite que qualquer usuário copie a chave e use sua cota de IA gratuitamente. O BFF esconderá essa chave no servidor.

### 2. Refatoração de UI para I18n
**Status:** 🟡 Médio / Em Progresso
**Ação:** Substituir todos os textos "hardcoded" (ex: "Dashboard", "Ferramentas") nos componentes React pelo hook `useTranslation()`.
**Por que:** A infraestrutura de tradução foi instalada, mas a interface ainda mostra apenas português fixo. Isso permitirá lançar o produto globalmente (PT/EN/ES) facilmente.

### 3. Recuperar Funcionalidades Multimodais (Imagem/Vídeo)
**Status:** 🟡 Médio
**Ação:** Implementar chamadas para APIs especializadas (Vertex AI Imagen / Veo) através do novo servidor BFF.
**Por que:** As funcionalidades de geração de imagem e vídeo foram desativadas pois dependiam de modelos instáveis (`*-preview`). Elas precisam ser reimplementadas usando endpoints de produção estáveis.

### 4. Pipeline de CI/CD (DevOps)
**Status:** 🟢 Melhoria Contínua
**Ação:** Criar workflows do GitHub Actions para rodar os testes (`npm run test`) e o build (`npm run build`) a cada Pull Request.
**Por que:** Garante que nenhum código quebrado entre na branch principal.

### 5. Modo Offline (PWA)
**Status:** ⚪ Futuro
**Ação:** Configurar o Vite PWA Plugin.
**Por que:** Permitirá que vendedores acessem seus leads e histórico mesmo sem internet em campo.
