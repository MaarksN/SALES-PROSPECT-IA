
import { AIToolConfig } from '../types';

export const EXTRA_TOOLS: AIToolConfig[] = [
  // --- PROSPECÇÃO AVANÇADA ---
  {
    id: "news-detector",
    name: "Detector de Notícias",
    description: "Encontra notícias recentes sobre a empresa para usar como gancho.",
    category: "prospecting",
    inputs: [
      { name: "company", label: "Empresa Alvo", type: "text" }
    ],
    promptTemplate: `Busque notícias recentes (últimos 30 dias) sobre a empresa {{company}}.
    Identifique eventos como: Fusões, Aquisições, Novas Contratações, Prêmios ou Lançamentos.
    Para cada notícia, crie um "Gancho de Prospecção" que conecte o fato ao meu produto.`,
    outputSchema: { news_found: "array", hooks: "array" }
  },
  {
    id: "email-validator-ai",
    name: "Validador de Email IA",
    description: "Analisa a sintaxe e padrão do email corporativo.",
    category: "prospecting",
    inputs: [
      { name: "email", label: "Email para Validar", type: "text" },
      { name: "company", label: "Empresa", type: "text" }
    ],
    promptTemplate: `Analise o email {{email}} da empresa {{company}}.
    Verifique: 1. Sintaxe correta? 2. Padrão corporativo comum (nome.sobrenome)?
    3. Probabilidade de ser um "Catch-all".
    Dê um score de confiança de 0 a 100 de que este email existe.`,
    outputSchema: { is_valid_syntax: "boolean", pattern_analysis: "string", confidence_score: "number" }
  },

  // --- COPYWRITING & PERSUASÃO ---
  {
    id: "rewrite-aggressive",
    name: "Reescrita Tom Agressivo",
    description: "Transforma texto morno em pitch de fechamento.",
    category: "copywriting",
    inputs: [
      { name: "text", label: "Texto Original", type: "textarea" }
    ],
    promptTemplate: `Reescreva o seguinte texto com um tom "Closer/Agressivo".
    Texto original: "{{text}}".
    Use gatilhos de urgência, escassez e autoridade. Remova palavras de hesitação (talvez, acho que).
    O objetivo é forçar uma decisão agora.`,
    outputSchema: { rewritten_text: "string", triggers_used: "array" }
  },
  {
    id: "rewrite-empathetic",
    name: "Reescrita Tom Empático",
    description: "Suaviza mensagens difíceis (cobrança/negociação).",
    category: "copywriting",
    inputs: [
      { name: "text", label: "Texto Original", type: "textarea" }
    ],
    promptTemplate: `Reescreva o texto: "{{text}}" com um tom de extrema empatia e colaboração.
    Use Comunicação Não Violenta (CNV).
    Foque em entender o lado do cliente e buscar solução conjunta.`,
    outputSchema: { rewritten_text: "string", cnv_technique: "string" }
  },
  {
    id: "viral-subject-lines",
    name: "Gerador de Assuntos Virais",
    description: "Cria 10 assuntos com alta taxa de abertura.",
    category: "copywriting",
    inputs: [
      { name: "topic", label: "Tópico do Email", type: "text" },
      { name: "target", label: "Cargo do Lead", type: "text" }
    ],
    promptTemplate: `Gere 10 Linhas de Assunto para um email sobre {{topic}} focado no cargo {{target}}.
    Use técnicas de: Curiosidade Gap, Anti-Marketing, Personalização Extrema e Humor.
    O objetivo é ter mais de 60% de Open Rate.`,
    outputSchema: { subjects: "array", psychological_principle: "array" }
  },
  {
    id: "business-translator",
    name: "Tradutor de 'Businessês'",
    description: "Transforma tecniquês em benefícios de negócio.",
    category: "copywriting",
    inputs: [
      { name: "technical_text", label: "Texto Técnico", type: "textarea" }
    ],
    promptTemplate: `Traduza este texto técnico: "{{technical_text}}" para a linguagem de um CEO/CFO.
    Elimine jargões de engenharia. Fale de: Redução de Risco, Aumento de Receita e Eficiência Operacional.`,
    outputSchema: { executive_summary: "string", key_benefits: "array" }
  },
  {
    id: "storyteller-ai",
    name: "Contador de Histórias",
    description: "Cria metáforas e anedotas para explicar produtos.",
    category: "copywriting",
    inputs: [
      { name: "concept", label: "Conceito/Produto para Explicar", type: "text" }
    ],
    promptTemplate: `Crie uma história curta ou metáfora (Storytelling) para explicar o conceito: {{concept}}.
    Comece com "Imagine que..." e use uma situação do dia a dia para tornar o conceito complexo em algo simples e memorável.`,
    outputSchema: { story: "string", moral_of_story: "string" }
  },

  // --- ESTRATÉGIA & NEGOCIAÇÃO ---
  {
    id: "objection-simulator",
    name: "Simulador de Objeções (Roleplay)",
    description: "Treine contra um cliente difícil.",
    category: "strategy",
    inputs: [
      { name: "product", label: "Seu Produto", type: "text" },
      { name: "difficulty", label: "Dificuldade (Fácil/Médio/Hard)", type: "text" }
    ],
    promptTemplate: `Vamos jogar um RPG. Eu sou um vendedor de {{product}}. Você é um comprador nível {{difficulty}}.
    Comece a conversa com uma objeção dura.
    Aguarde minha resposta (na sua mente, simule que eu tentei justificar) e me dê a tréplica.
    Gere um diálogo de 3 turnos onde você me coloca na parede.`,
    outputSchema: { roleplay_script: "string", learning_points: "string" }
  },
  {
    id: "email-sentiment-analyzer",
    name: "Análise de Sentimento de Email",
    description: "Descubra se o cliente está realmente interessado.",
    category: "strategy",
    inputs: [
      { name: "email_text", label: "Resposta do Cliente", type: "textarea" }
    ],
    promptTemplate: `Analise o sentimento deste email: "{{email_text}}".
    Classifique em: Interessado, Cético, Irritado ou Educadamente Desinteressado.
    Identifique subtextos (o que ele não disse, mas quis dizer).`,
    outputSchema: { sentiment: "string", subtext: "string", recommended_response_tone: "string" }
  },
  {
    id: "batna-generator",
    name: "Gerador de BATNA",
    description: "Define sua Melhor Alternativa em uma negociação.",
    category: "strategy",
    inputs: [
      { name: "deal", label: "Descrição do Negócio", type: "text" },
      { name: "constraints", label: "Restrições", type: "text" }
    ],
    promptTemplate: `Para o negócio "{{deal}}" com restrições "{{constraints}}", defina meu BATNA (Best Alternative to a Negotiated Agreement).
    Se essa negociação falhar, qual é meu plano B sólido?
    Também estime o provável BATNA do outro lado.`,
    outputSchema: { my_batna: "string", their_batna: "string", negotiation_leverage: "string" }
  },
  {
    id: "plan-30-60-90",
    name: "Plano de 30-60-90 Dias",
    description: "Gera um plano de implementação para fechar o deal.",
    category: "strategy",
    inputs: [
      { name: "project", label: "Nome do Projeto", type: "text" },
      { name: "goal", label: "Objetivo Final", type: "text" }
    ],
    promptTemplate: `Crie um plano de ação de 30-60-90 dias para o projeto {{project}} com objetivo {{goal}}.
    Use formato executivo. Mostre entregáveis claros para cada mês.
    Isso será usado para dar segurança ao cliente de que sabemos como implementar.`,
    outputSchema: { day_30: "array", day_60: "array", day_90: "array", success_metrics: "string" }
  },
  {
    id: "proposal-auditor",
    name: "Auditor de Proposta",
    description: "Analisa o texto da sua proposta e sugere melhorias.",
    category: "strategy",
    inputs: [
      { name: "proposal_text", label: "Texto da Proposta", type: "textarea" }
    ],
    promptTemplate: `Atue como um comprador profissional. Audite este texto de proposta: "{{proposal_text}}".
    1. O valor está claro? 2. Os riscos foram mitigados? 3. O preço parece investimento ou custo?
    Dê uma nota 0-10 e sugira 3 edições para aumentar a chance de assinatura.`,
    outputSchema: { score: "number", critique: "string", edits: "array" }
  },

  // --- SOCIAL SELLING ---
  {
    id: "auto-commenter",
    name: "Comentador Automático",
    description: "Gera comentários inteligentes para LinkedIn.",
    category: "social",
    inputs: [
      { name: "post_content", label: "Conteúdo do Post", type: "textarea" },
      { name: "author_role", label: "Cargo do Autor", type: "text" }
    ],
    promptTemplate: `Gere 3 opções de comentários para este post de um {{author_role}}: "{{post_content}}".
    Opção 1: Pergunta instigante.
    Opção 2: Complemento com dados.
    Opção 3: Elogio com insight.
    Nunca use "Parabéns pelo post" ou frases vazias.`,
    outputSchema: { comments: "array", strategy: "string" }
  },
  {
    id: "linkedin-bio-generator",
    name: "Gerador de Bio LinkedIn",
    description: "Otimiza seu perfil para atrair compradores.",
    category: "social",
    inputs: [
      { name: "role", label: "Seu Cargo", type: "text" },
      { name: "niche", label: "Seu Nicho", type: "text" },
      { name: "value", label: "Valor que entrega", type: "text" }
    ],
    promptTemplate: `Crie uma Headline e um Sobre para um perfil de LinkedIn de {{role}} focado no nicho {{niche}}.
    A promessa de valor é: {{value}}.
    Use palavras-chave para SEO. O perfil deve parecer um Consultor, não um Vendedor desesperado.`,
    outputSchema: { headline: "string", about_section: "string", keywords: "array" }
  },
  {
    id: "carousel-generator",
    name: "Gerador de Carrossel",
    description: "Cria estrutura de slides para post educativo.",
    category: "social",
    inputs: [
      { name: "topic", label: "Tema do Carrossel", type: "text" },
      { name: "slides_count", label: "Número de Slides", type: "number" }
    ],
    promptTemplate: `Crie a estrutura de um carrossel de Instagram/LinkedIn sobre {{topic}} com {{slides_count}} slides.
    Para cada slide, defina: Título (Grande), Texto de Apoio e Sugestão Visual.
    O último slide deve ser um CTA para o meu serviço.`,
    outputSchema: { slides: "array", caption_suggestion: "string" }
  },

  // --- INCLUSÃO & ACESSIBILIDADE ---
  {
    id: "language-simplifier",
    name: "Simplificador de Linguagem",
    description: "Reescreve para nível de leitura básico (Acessibilidade).",
    category: "inclusion",
    inputs: [
      { name: "text", label: "Texto Complexo", type: "textarea" }
    ],
    promptTemplate: `Reescreva o texto abaixo para que seja compreensível por uma pessoa com nível de leitura de 5ª série ou com dificuldades cognitivas.
    Use frases curtas, voz ativa e palavras simples.
    Texto: "{{text}}"`,
    outputSchema: { simplified_text: "string", readability_score_before_after: "string" }
  },
  {
    id: "image-alt-text",
    name: "Descritor de Imagens (Alt Text)",
    description: "Gera descrições para leitores de tela.",
    category: "inclusion",
    inputs: [
      { name: "image_description", label: "O que tem na imagem? (Resumo)", type: "text" }
    ],
    promptTemplate: `Crie um texto alternativo (Alt Text) otimizado para acessibilidade (WCAG) baseado nesta descrição visual: "{{image_description}}".
    Seja descritivo mas conciso (max 125 caracteres). Não comece com "Imagem de...".`,
    outputSchema: { alt_text: "string", tips: "string" }
  },
  {
    id: "gender-bias-checker",
    name: "Verificador de Viés de Gênero",
    description: "Analisa linguagem neutra/inclusiva.",
    category: "inclusion",
    inputs: [
      { name: "text", label: "Texto para Analisar", type: "textarea" }
    ],
    promptTemplate: `Analise este texto procurando por viés de gênero ou termos excludentes: "{{text}}".
    Sugira substituições neutras (ex: 'Todos' em vez de 'Todos os homens', 'Pessoas' em vez de 'Caras').
    Reescreva a versão inclusiva.`,
    outputSchema: { bias_found: "boolean", suggestions: "array", inclusive_version: "string" }
  },
  {
    id: "libras-translator",
    name: "Tradutor LIBRAS (Conceitual)",
    description: "Sugere sinais chave para atendimento a surdos.",
    category: "inclusion",
    inputs: [
      { name: "sentence", label: "Frase para Traduzir", type: "text" }
    ],
    promptTemplate: `Para a frase "{{sentence}}", identifique os conceitos-chave que precisam ser sinalizados em LIBRAS (Língua Brasileira de Sinais).
    Descreva a estrutura gramatical (Tópico-Comentário) e descreva visualmente como fazer os sinais principais.
    (Nota: Isso é um guia conceitual, não um vídeo).`,
    outputSchema: { libras_structure: "string", sign_descriptions: "array" }
  },
  {
    id: "accessibility-checklist",
    name: "Checklist de Acessibilidade",
    description: "Verifica se email/proposta segue WCAG.",
    category: "inclusion",
    inputs: [
      { name: "content_type", label: "Tipo de Conteúdo (Email/PDF)", type: "text" }
    ],
    promptTemplate: `Gere um checklist de verificação de acessibilidade (baseado na WCAG 2.1) para {{content_type}}.
    Inclua itens como contraste de cor, hierarquia de cabeçalhos, texto alternativo e linguagem simples.`,
    outputSchema: { checklist: "array", tools_recommendation: "string" }
  },

  // --- UTILITÁRIOS TÉCNICOS ---
  {
    id: "sql-generator",
    name: "Gerador de SQL",
    description: "Cria queries para extrair listas de CRM.",
    category: "utils",
    inputs: [
      { name: "request", label: "O que você quer extrair?", type: "text" },
      { name: "table_schema", label: "Esquema das Tabelas (Opcional)", type: "textarea" }
    ],
    promptTemplate: `Atue como um DBA. Gere uma query SQL padrão (PostgreSQL/MySQL) para: "{{request}}".
    Considere o esquema provável de um CRM (tabelas leads, deals, companies) se não fornecido: {{table_schema}}.
    Comente o código explicando a lógica.`,
    outputSchema: { sql_query: "string", explanation: "string" }
  },
  {
    id: "regex-sales",
    name: "Regex para Vendas",
    description: "Gera Regex para limpar telefones/CPFs.",
    category: "utils",
    inputs: [
      { name: "pattern", label: "O que você quer encontrar/limpar?", type: "text" }
    ],
    promptTemplate: `Gere uma Expressão Regular (Regex) para: {{pattern}}.
    Exemplos de uso: Validar telefone BR, CPF, CEP ou extrair emails de um texto.
    Forneça o padrão Regex e um exemplo de uso em JavaScript.`,
    outputSchema: { regex_pattern: "string", js_example: "string" }
  },
  {
    id: "csv-formatter",
    name: "Formatador de CSV",
    description: "Limpa e padroniza colunas de nome/empresa.",
    category: "utils",
    inputs: [
      { name: "csv_snippet", label: "Amostra do CSV (Header + 1 linha)", type: "textarea" }
    ],
    promptTemplate: `Analise esta amostra de CSV: "{{csv_snippet}}".
    Identifique problemas de formatação (separadores, encoding, datas fora de padrão).
    Sugira um script Python (Pandas) ou Excel Formula para limpar esses dados.`,
    outputSchema: { diagnosis: "string", cleaning_solution: "string" }
  },
  {
    id: "signature-extractor",
    name: "Extrator de Assinatura",
    description: "Tira dados de uma assinatura de email colada.",
    category: "utils",
    inputs: [
      { name: "signature_text", label: "Texto da Assinatura", type: "textarea" }
    ],
    promptTemplate: `Extraia as entidades nomeadas desta assinatura de email: "{{signature_text}}".
    Retorne JSON com: Nome, Cargo, Empresa, Telefone, Email, Site e Redes Sociais.`,
    outputSchema: { name: "string", role: "string", company: "string", phone: "string", email: "string", website: "string" }
  },
  {
    id: "utm-generator",
    name: "Gerador de UTMs",
    description: "Cria links rastreáveis para campanhas.",
    category: "utils",
    inputs: [
      { name: "url", label: "URL Destino", type: "text" },
      { name: "source", label: "Source (ex: linkedin)", type: "text" },
      { name: "medium", label: "Medium (ex: post)", type: "text" },
      { name: "campaign", label: "Campaign Name", type: "text" }
    ],
    promptTemplate: `Gere uma URL parametrizada com UTMs padrão Google Analytics.
    Base: {{url}}
    Source: {{source}}
    Medium: {{medium}}
    Campaign: {{campaign}}
    Verifique se a URL já tem query params e concatene corretamente (? ou &).`,
    outputSchema: { final_url: "string", parameters_explanation: "string" }
  },

  // --- FERRAMENTAS EXTRAS (PARA COMPLETAR AS 30) ---
  {
    id: "ice-breaker-v2",
    name: "O Quebra-Gelo (Advanced)",
    description: "Analisa o último post do LinkedIn do lead e cria uma frase de abertura.",
    category: "prospecting",
    inputs: [
      { name: "linkedin_post", label: "Texto do Post", type: "textarea" },
      { name: "author_style", label: "Estilo do Autor", type: "text" }
    ],
    promptTemplate: `Analise este post: "{{linkedin_post}}". Estilo do autor: {{author_style}}.
    Crie 3 frases de abertura (Ice Breakers) que gerem rapport imediato.
    Não seja bajulador. Seja perspicaz.`,
    outputSchema: { options: "array", why_it_works: "string" }
  },
  {
    id: "roi-calculator-v2",
    name: "Calculadora de ROI (Estimativa)",
    description: "Estima quanto o lead economizaria com sua solução.",
    category: "prospecting",
    inputs: [
      { name: "process_cost", label: "Custo do Processo Atual", type: "text" },
      { name: "efficiency_gain", label: "Ganho de Eficiência (%)", type: "number" }
    ],
    promptTemplate: `Calcule o ROI. Custo atual: {{process_cost}}. Ganho prometido: {{efficiency_gain}}%.
    Mostre a economia em 1, 3 e 5 anos.
    Gere um mini-texto para colocar no email.`,
    outputSchema: { savings_1y: "string", savings_3y: "string", email_snippet: "string" }
  },
  {
    id: "hierarchy-mapper-v2",
    name: "Mapeador de Hierarquia",
    description: "Tenta inferir o organograma do departamento de compras.",
    category: "enrichment",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "known_contact", label: "Contato Conhecido", type: "text" }
    ],
    promptTemplate: `Baseado no contato {{known_contact}} da {{company}}, quem provávelmente é seu chefe e quem é seu par?
    Crie uma arvore hierárquica hipotética para navegação de conta.`,
    outputSchema: { likely_boss: "string", likely_peers: "array", navigation_strategy: "string" }
  },
  {
    id: "connection-invite-v2",
    name: "Convite de Conexão (300 chars)",
    description: "Cria notas de convite personalizadas (limite de 300 caracteres).",
    category: "social",
    inputs: [
      { name: "name", label: "Nome", type: "text" },
      { name: "reason", label: "Motivo", type: "text" }
    ],
    promptTemplate: `Escreva um convite de conexão para {{name}} no LinkedIn. Motivo: {{reason}}.
    ESTRITAMENTE MENOS DE 300 CARACTERES.
    Seja cordial e profissional.`,
    outputSchema: { invite_text: "string", char_count: "number" }
  },
  {
    id: "video-script-loom-v2",
    name: "Roteiro de Vídeo (Loom)",
    description: "Script para gravar um vídeo de prospecção curto.",
    category: "social",
    inputs: [
      { name: "prospect_pain", label: "Dor do Cliente", type: "text" },
      { name: "screen_to_show", label: "O que mostrar na tela", type: "text" }
    ],
    promptTemplate: `Gere um script para vídeo Loom de 45 segundos.
    Cena 1 (Camera): Intro.
    Cena 2 (Tela - {{screen_to_show}}): Mostrar a dor {{prospect_pain}}.
    Cena 3 (Camera): CTA.`,
    outputSchema: { script_segments: "array", visual_cues: "array" }
  }
];
