
import { AIToolConfig } from '../types';
import { EXTRA_TOOLS } from './extra_tools';

export const TOOLS_REGISTRY: AIToolConfig[] = [
  // --- CATEGORIA 1: GERAÇÃO E INTELIGÊNCIA ---
  {
    id: "ai-voice-pitch",
    name: "Gerador de Pitch de Voz",
    description: "Cria roteiros otimizados para mensagens de áudio curtas.",
    category: "prospecting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" },
      { name: "role", label: "Cargo", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "objective", label: "Objetivo do Contato", type: "text" },
      { name: "product", label: "Seu Produto", type: "text" },
      { name: "benefits", label: "Principais Benefícios", type: "textarea" }
    ],
    promptTemplate: `Atue como um especialista em comunicação persuasiva. Gere um roteiro de áudio para {{name}} ({{role}}) da {{company}}. 
    Contexto: O lead atua no setor {{sector}} e o objetivo é {{objective}}. 
    Instruções: Use um tom amigável mas profissional. Inclua marcações de [PAUSA], [ENTONAÇÃO ALTA] e um Call to Action (CTA) claro. 
    Considere que o produto é {{product}} e foque nos benefícios: {{benefits}}. 
    O roteiro deve ter entre 30 e 45 segundos de fala natural.`,
    outputSchema: { script: "string", emphasis_points: "array", duration_est: "string", pacing_instructions: "string" }
  },
  {
    id: "ice-breaker",
    name: "Quebra-Gelo Contextual",
    description: "Gera frases de abertura baseadas em notícias ou posts.",
    category: "prospecting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" },
      { name: "role", label: "Cargo", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "news", label: "Notícia/Post Recente", type: "textarea" }
    ],
    promptTemplate: `Atue como um SDR de elite especializado em personalização. Analise o lead {{name}} e a notícia recente: "{{news}}". 
    Combine isso com o cargo do lead ({{role}}) e o histórico da empresa {{company}}. 
    Gere 3 opções de frases de abertura que não pareçam automatizadas. 
    Evite clichês como 'Espero que este email o encontre bem'. 
    Foque em curiosidade, parabenização ou insights sobre a notícia.`,
    outputSchema: { options: "array", context_used: "string", psychological_trigger: "string" }
  },
  {
    id: "disc-analyzer",
    name: "Analisador de Perfil DISC",
    description: "Prevê o perfil psicológico do lead para ajustar a fala.",
    category: "prospecting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" },
      { name: "role", label: "Cargo", type: "text" },
      { name: "bio", label: "Biografia/Sobre (LinkedIn)", type: "textarea" }
    ],
    promptTemplate: `Analise a biografia e o histórico de {{name}} ({{role}}): "{{bio}}". 
    Classifique o lead no modelo DISC (Dominância, Influência, Estabilidade, Conformidade). 
    Explique por que ele se encaixa nessa categoria. 
    Forneça 3 dicas de como falar com ele e 3 coisas que o irritariam. 
    Sugira o melhor canal de comunicação (Email, LinkedIn ou Call) para este perfil.`,
    outputSchema: { profile: "string", detailed_analysis: "string", tips: "array", forbidden_methods: "array", best_channel: "string" }
  },
  {
    id: "intent-radar",
    name: "Radar de Intenção",
    description: "Detecta sinais de compra em notícias da empresa.",
    category: "prospecting",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "news", label: "Notícias Recentes", type: "textarea" },
      { name: "metrics", label: "Métricas Financeiras", type: "text" },
      { name: "product", label: "Seu Produto", type: "text" }
    ],
    promptTemplate: `Atue como um analista de mercado. Varra o contexto da empresa {{company}} ({{sector}}). 
    Notícias recentes: "{{news}}". Gatilhos financeiros: "{{metrics}}". 
    Identifique se há sinais de 'Intenção de Compra' para o produto {{product}}. 
    Atribua um score de 0 a 100 e justifique com base em 3 sinais específicos. 
    Classifique a urgência em: Baixa, Média ou Alta.`,
    outputSchema: { intent_score: "number", signals: "array", urgency: "string", justification: "string" }
  },
  {
    id: "roi-calculator",
    name: "Calculadora de ROI IA",
    description: "Gera prova de valor financeira personalizada.",
    category: "prospecting",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "product", label: "Seu Produto", type: "text" },
      { name: "metrics", label: "Dados do Cliente (Fat., Equipe)", type: "text" },
      { name: "sector", label: "Setor", type: "text" }
    ],
    promptTemplate: `Atue como um consultor financeiro. Calcule o ROI estimado para a {{company}} ao implementar {{product}}. 
    Dados do cliente: {{metrics}} (faturamento, tamanho do time, custos atuais). 
    Utilize benchmarks do setor {{sector}} para prever: 1. Economia anual em R$; 2. Ganho de produtividade em %; 3. Período de Payback (meses). 
    Apresente uma justificativa baseada em dados para cada número.`,
    outputSchema: { estimate_summary: "string", annual_saving: "string", productivity_gain: "string", payback_period: "string", data_sources: "array" }
  },

  // --- CATEGORIA 2: DADOS ---
  {
    id: "technographics",
    name: "Localizador de Tecnologias",
    description: "Identifica a stack tecnológica do cliente.",
    category: "enrichment",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "product", label: "Seu Produto", type: "text" }
    ],
    promptTemplate: `Analise a presença digital e o site da {{company}}. 
    Identifique a provável stack tecnológica (CMS, CRM, Analytics, Hospedagem, ERP). 
    Com base nessas tecnologias, sugira 2 pontos de integração ou 1 ponto de substituição onde nosso produto {{product}} se destaca. 
    Foque em como ajudamos a otimizar o que eles já usam.`,
    outputSchema: { detected_stack: "array", integration_opportunities: "array", competitive_edge: "string" }
  },
  {
    id: "org-chart-mapper",
    name: "Mapeador de Hierarquia",
    description: "Visualiza quem são os decisores acima e abaixo do lead.",
    category: "enrichment",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" },
      { name: "role", label: "Cargo", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "department", label: "Departamento", type: "text" }
    ],
    promptTemplate: `Com base no lead {{name}} ({{role}}) da empresa {{company}}, mapeie a provável estrutura organizacional do departamento de {{department}}. 
    Identifique: 1. Quem provavelmente é o superior imediato; 2. Quem são os pares influenciadores; 3. Quem seriam os usuários finais. 
    Sugira como o {{name}} pode atuar como campeão interno para convencer os demais.`,
    outputSchema: { hierarchy_map: "array", key_influencers: "array", champion_strategy: "string" }
  },
  {
    id: "lookalike-builder",
    name: "Gerador de Públicos Semelhantes",
    description: "Encontra empresas com o mesmo perfil dos seus melhores clientes.",
    category: "enrichment",
    inputs: [
      { name: "bestClient", label: "Melhor Cliente Exemplo", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "size", label: "Tamanho", type: "text" }
    ],
    promptTemplate: `Analise meu cliente de sucesso: {{bestClient}} (Setor: {{sector}}, Tamanho: {{size}}). 
    Identifique os 3 atributos principais que tornam esta empresa um cliente ideal. 
    Com base nisso, gere uma lista de 5 empresas similares no Brasil que possuem as mesmas dores e potencial. 
    Justifique por que cada empresa foi escolhida.`,
    outputSchema: { traits_of_success: "array", lookalike_list: "array", rationale: "string" }
  },
  {
    id: "compliance-checker",
    name: "Validador LGPD/GDPR",
    description: "Garante que a abordagem respeita as normas de privacidade.",
    category: "enrichment",
    inputs: [
      { name: "script", label: "Script de Vendas", type: "textarea" }
    ],
    promptTemplate: `Atue como um DPO (Data Protection Officer). Analise este script de vendas: "{{script}}". 
    Verifique a conformidade com a LGPD (Brasil) e GDPR (Europa). 
    Identifique se há coleta indevida de dados sensíveis ou falta de transparência. 
    Sugira ajustes para tornar a abordagem 'Privacy-First' sem perder a eficácia comercial.`,
    outputSchema: { risk_level: "string", non_compliant_parts: "array", suggestions: "string", safety_score: "number" }
  },
  {
    id: "auto-crm-sync",
    name: "Sincronizador de CRM Inteligente",
    description: "Limpa e formata dados antes de enviar para o CRM.",
    category: "enrichment",
    inputs: [
      { name: "raw", label: "Dados Brutos (JSON ou Texto)", type: "textarea" }
    ],
    promptTemplate: `Analise estes dados brutos do lead: {{raw}}. 
    1. Padronize nomes (Capitalize); 2. Classifique o cargo em uma categoria (Executivo, Gerencial, Operacional); 
    3. Identifique o setor correto; 4. Estime o faturamento anual baseado no porte. 
    Retorne um objeto limpo e pronto para importação via API.`,
    outputSchema: { cleaned_data: "object", data_quality_score: "number", enrichment_notes: "string" }
  },

  // --- CATEGORIA 3: COMPORTAMENTO E DECISÃO ---
  {
    id: "lead-readiness",
    name: "Preditivo de Prontidão",
    description: "Mede o 'Timing' ideal para o fechamento.",
    category: "strategy",
    inputs: [
      { name: "name", label: "Lead", type: "text" },
      { name: "role", label: "Cargo", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "news", label: "Notícias", type: "text" },
      { name: "history", label: "Histórico Interação", type: "textarea" }
    ],
    promptTemplate: `Atue como um analista de inteligência de vendas. Avalie a prontidão de compra do lead {{name}} ({{role}}) da {{company}}. 
    Considere: Notícias ({{news}}), Histórico de interações ({{history}}), cargo e porte da empresa. 
    Atribua um score de 0 a 100 para a prontidão. 
    Recomende uma das ações: A) Abordagem Imediata, B) Nutrição (Nurturing), C) Aguardar Próximo Trimestre. Justifique.`,
    outputSchema: { score: "number", phase: "string", recommendation: "string", reasoning: "string" }
  },
  {
    id: "timing-optimizer",
    name: "Otimizador de Horários",
    description: "Indica o minuto exato para aumentar a taxa de abertura.",
    category: "strategy",
    inputs: [
      { name: "role", label: "Cargo do Lead", type: "text" },
      { name: "city", label: "Cidade/Região", type: "text" }
    ],
    promptTemplate: `Com base no cargo {{role}} e na cidade {{city}}, identifique o melhor horário para: 
    1. Enviar um E-mail; 2. Enviar um WhatsApp; 3. Fazer uma Ligação. 
    Considere picos de reuniões matinais para executivos e rotinas operacionais de tarde. 
    Explique o porquê de cada horário sugerido.`,
    outputSchema: { email_time: "string", whatsapp_time: "string", call_time: "string", logic_explanation: "string" }
  },
  {
    id: "objection-anticipator",
    name: "Antecipador de Objeções",
    description: "Prepara o vendedor para os 'Nãos' mais prováveis.",
    category: "strategy",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "product", label: "Produto Ofertado", type: "text" },
      { name: "sector", label: "Setor", type: "text" }
    ],
    promptTemplate: `Atue como o lead {{name}} da empresa {{company}}. 
    Imagine que você está ouvindo uma proposta de {{product}}. 
    Liste as 3 objeções mais realistas que você faria, considerando seu setor ({{sector}}) e o momento econômico. 
    Para cada objeção, forneça a 'Resposta de Ouro' que o vendedor deve usar para contorná-la.`,
    outputSchema: { objections: "array", rebuttal_strategy: "string" }
  },
  {
    id: "tone-optimizer",
    name: "Otimizador de Tom",
    description: "Ajusta a formalidade da mensagem em tempo real.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Empresa Alvo", type: "text" },
      { name: "name", label: "Nome do Lead", type: "text" },
      { name: "text", label: "Texto Original", type: "textarea" },
      { name: "tone", label: "Tom Desejado", type: "text" }
    ],
    promptTemplate: `Analise a cultura da empresa {{company}} e o perfil do lead {{name}}. 
    Reescreva este texto: "{{text}}" para que soe perfeitamente alinhado ao tom {{tone}}. 
    Explique quais palavras foram alteradas para garantir o rapport. 
    O objetivo é que o lead sinta que está falando com um par (peer-to-peer).`,
    outputSchema: { original_text: "string", optimized_text: "string", tone_analysis: "string", changes_made: "array" }
  },
  {
    id: "buying-committee",
    name: "Identificador de Comitê",
    description: "Descobre quem mais precisa estar na reunião.",
    category: "strategy",
    inputs: [
      { name: "product", label: "Produto", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "role", label: "Seu Contato Atual", type: "text" }
    ],
    promptTemplate: `Em uma venda de {{product}} para a empresa {{company}}, além do {{role}}, quem são os outros cargos fundamentais no comitê de decisão? 
    Identifique quem é o 'Dono do Orçamento', o 'Usuário Técnico' e o 'Aprovador de Segurança/Legal'. 
    Sugira uma abordagem específica para cada um deles.`,
    outputSchema: { stakeholders: "array", decision_power_map: "object" }
  },
  {
    id: "priority-ranker",
    name: "Ranker de Stakeholders",
    description: "Diz com quem você deve falar primeiro em uma conta.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "leads", label: "Lista de Cargos/Nomes", type: "textarea" }
    ],
    promptTemplate: `Analise esta lista de contatos da {{company}}: [{{leads}}]. 
    Ordene-os pela ordem lógica de prospecção. 
    Justifique: Quem é a 'Porta de Entrada' (mais fácil acesso) e quem é o 'Alvo Final' (decisor). 
    Sugira como usar a informação do primeiro contato para abrir caminho até o decisor final.`,
    outputSchema: { priority_list: "array", strategy_path: "string" }
  },
  {
    id: "personality-pitch",
    name: "Pitch Personalizado por Perfil",
    description: "Cria um discurso focado no que o lead valoriza.",
    category: "strategy",
    inputs: [
      { name: "disc", label: "Perfil DISC (Ex: Dominante)", type: "text" },
      { name: "name", label: "Nome", type: "text" },
      { name: "product", label: "Produto", type: "text" }
    ],
    promptTemplate: `Com base no perfil psicológico {{disc}} de {{name}}, crie um pitch de 2 parágrafos para o produto {{product}}. 
    Se o perfil for 'D', foque em resultados e ROI. Se for 'I', foque em inovação e status. 
    Se for 'S', foque em segurança e suporte. Se for 'C', foque em dados e detalhes técnicos.`,
    outputSchema: { pitch: "string", key_triggers_used: "array" }
  },
  {
    id: "empathy-mapping",
    name: "Mapa de Empatia IA",
    description: "Entenda o que o lead 'ouve, vê e sente'.",
    category: "strategy",
    inputs: [
      { name: "role", label: "Cargo", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "product", label: "Seu Produto", type: "text" }
    ],
    promptTemplate: `Gere um mapa de empatia completo para o cargo de {{role}} no setor {{sector}}. 
    O que este profissional vê no mercado hoje? O que ele ouve de seus pares? Quais são suas dores reais (Pains) e o que ele considera sucesso (Gains)? 
    Como nosso produto {{product}} se encaixa especificamente para aliviar essas dores?`,
    outputSchema: { sees: "array", hears: "array", pains: "array", gains: "array", product_fit: "string" }
  },
  {
    id: "conflict-resolver",
    name: "Mediador de Conflitos",
    description: "Sugere como responder a um lead irritado ou cético.",
    category: "strategy",
    inputs: [
      { name: "name", label: "Nome", type: "text" },
      { name: "text", label: "Mensagem Negativa", type: "textarea" }
    ],
    promptTemplate: `Atue como um especialista em resolução de conflitos. O lead {{name}} enviou a seguinte mensagem negativa: "{{text}}". 
    Analise a causa raiz da frustração. 
    Gere uma resposta que utilize a técnica 'Feel-Felt-Found' para validar a emoção dele, mostrar empatia e redirecionar para uma solução positiva sem ser defensivo.`,
    outputSchema: { root_cause_analysis: "string", response_script: "string", technique_applied: "string" }
  },
  {
    id: "trust-builder",
    name: "Gerador de Prova Social",
    description: "Escolhe o melhor case de sucesso para este lead.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Empresa Alvo", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "size", label: "Tamanho", type: "text" },
      { name: "cases", label: "Seus Cases Disponíveis", type: "textarea" }
    ],
    promptTemplate: `Analise a empresa {{company}} ({{sector}}, Porte {{size}}). 
    Dos meus cases de sucesso disponíveis [{{cases}}], selecione os 2 mais impactantes para este lead. 
    Justifique a escolha baseada em similaridade de dores. 
    Crie uma frase curta de 'Social Proof' que o vendedor pode usar para citar esses cases durante a conversa.`,
    outputSchema: { selected_cases: "array", justification: "string", social_proof_line: "string" }
  },

  // --- CATEGORIA 4: MERCADO E ESTRATÉGIA ---
  {
    id: "competitor-detector",
    name: "Detector de Concorrentes",
    description: "Alerta quando o lead menciona ou usa rivais.",
    category: "strategy",
    inputs: [
      { name: "name", label: "Lead", type: "text" },
      { name: "competitor", label: "Concorrente Mencionado", type: "text" },
      { name: "sector", label: "Setor", type: "text" }
    ],
    promptTemplate: `O lead {{name}} mencionou ou utiliza o concorrente {{competitor}}. 
    Atue como um estrategista competitivo. Liste 3 fraquezas conhecidas de {{competitor}} no setor {{sector}} e 3 forças nossas que anulam essas fraquezas. 
    Gere um 'Battlecard' rápido para o vendedor usar durante a objeção: 'Já usamos o concorrente'.`,
    outputSchema: { competitor_weaknesses: "array", our_advantages: "array", battlecard_script: "string" }
  },
  {
    id: "price-sensitivity",
    name: "Estimador de Sensibilidade",
    description: "Preveja se o lead vai priorizar preço ou valor.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "revenue", label: "Faturamento Estimado", type: "text" }
    ],
    promptTemplate: `Analise a sensibilidade a preço da empresa {{company}}. 
    Considere o faturamento estimado ({{revenue}}), o momento do setor e o histórico de compras. 
    Classifique a sensibilidade de 1 a 5. 
    Recomende: Devo focar no 'Desconto e Economia' ou no 'Valor Agregado e Qualidade'? Justifique.`,
    outputSchema: { sensitivity_score: "number", focus_area: "string", justification: "string" }
  },
  {
    id: "expansion-finder",
    name: "Buscador de Expansão",
    description: "Identifica oportunidades de Cross-sell e Upsell.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Cliente Atual", type: "text" },
      { name: "currentProduct", label: "Produto em Uso", type: "text" },
      { name: "time", label: "Tempo de Casa", type: "text" },
      { name: "upsellProduct", label: "Produto para Upsell", type: "text" }
    ],
    promptTemplate: `Dado que a {{company}} já utiliza nosso produto {{currentProduct}} há {{time}}, identifique a próxima etapa lógica de evolução. 
    O que eles estão perdendo por não terem {{upsellProduct}}? 
    Gere um pitch de expansão focado no sucesso que eles já tiveram e como levar isso para o próximo nível.`,
    outputSchema: { expansion_target: "string", value_proposition: "string", pitch: "string" }
  },
  {
    id: "market-saturation",
    name: "Analisador de Saturação",
    description: "Diz se o setor está 'bombardeado' de ofertas.",
    category: "strategy",
    inputs: [
      { name: "role", label: "Cargo do Lead", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "category", label: "O que você vende", type: "text" }
    ],
    promptTemplate: `Qual a saturação de ofertas para o cargo de {{role}} no setor {{sector}}? 
    Identifique se este lead recebe muitas abordagens de {{category}}. 
    Se a saturação for alta, sugira um 'Ângulo Disruptivo' para se destacar. 
    Se for baixa, sugira uma 'Abordagem Educativa'.`,
    outputSchema: { saturation_level: "string", market_noise_score: "number", strategy_pivot: "string" }
  },
  {
    id: "sales-angle",
    name: "Gerador de Ângulo de Venda",
    description: "Escolhe o melhor gancho narrativo para o lead.",
    category: "strategy",
    inputs: [
      { name: "name", label: "Lead", type: "text" }
    ],
    promptTemplate: `Atue como um redator publicitário de alta conversão. Para o lead {{name}}, gere 3 ângulos de venda distintos: 
    1. O Ângulo do Medo (O que ele perde se não agir); 2. O Ângulo da Ganância (O que ele ganha em lucro/tempo); 3. O Ângulo do Status (Como ele será visto na empresa). 
    Recomende qual ângulo tem mais chance de sucesso baseado no perfil DISC do lead.`,
    outputSchema: { angle_fear: "string", angle_gain: "string", angle_status: "string", recommended: "string" }
  },
  {
    id: "deal-complexity",
    name: "Score de Complexidade",
    description: "Preveja quanto esforço real levará para fechar.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "value", label: "Valor da Proposta", type: "text" }
    ],
    promptTemplate: `Analise a complexidade deste negócio com a {{company}}. 
    Considere: Valor da proposta ({{value}}), número de departamentos envolvidos, requisitos técnicos e burocracia de compras (Procurement). 
    Atribua um score de 1 a 10. 
    Estime o ciclo de vendas (em dias) e aponte os 2 principais gargalos que podem atrasar o fechamento.`,
    outputSchema: { complexity_score: "number", estimated_cycle_days: "number", bottlenecks: "array" }
  },
  {
    id: "swot-competitor",
    name: "SWOT Comparativa IA",
    description: "Análise de Forças e Fraquezas vs Concorrente.",
    category: "strategy",
    inputs: [
      { name: "competitor", label: "Concorrente", type: "text" },
      { name: "name", label: "Lead", type: "text" },
      { name: "company", label: "Empresa do Lead", type: "text" }
    ],
    promptTemplate: `Gere uma matriz SWOT (Forças, Fraquezas, Oportunidades, Ameaças) focada na nossa solução contra o concorrente {{competitor}}. 
    Foque especificamente no cenário do lead {{name}} da empresa {{company}}. 
    Como nossas forças anulam as oportunidades do concorrente neste caso específico?`,
    outputSchema: { strengths: "array", weaknesses: "array", opportunities: "array", threats: "array", strategic_insight: "string" }
  },
  {
    id: "blue-ocean-strategy",
    name: "Estratégia de Oceano Azul",
    description: "Encontre um nicho onde ninguém está vendendo.",
    category: "strategy",
    inputs: [
      { name: "product", label: "Seu Produto", type: "text" },
      { name: "sector", label: "Setor Alvo", type: "text" }
    ],
    promptTemplate: `Atue como um estrategista do Oceano Azul. Para o nosso produto {{product}}, identifique um sub-nicho ou uma aplicação no setor {{sector}} onde a concorrência é irrelevante. 
    Quais funcionalidades devemos 'Aumentar', 'Reduzir', 'Eliminar' ou 'Criar' para dominar este novo espaço? 
    Gere o pitch para esse novo posicionamento.`,
    outputSchema: { new_niche: "string", eric_framework: "object", blue_ocean_pitch: "string" }
  },
  {
    id: "macro-economic-impact",
    name: "Impacto Macroeconômico",
    description: "Como o cenário atual afeta o bolso do lead.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "product", label: "Seu Produto", type: "text" }
    ],
    promptTemplate: `Analise como o cenário macroeconômico atual (Ex: taxa de juros, inflação, dólar) afeta diretamente o orçamento da empresa {{company}} no setor {{sector}}. 
    Crie um argumento de venda que mostre como nosso produto {{product}} é um 'Hedge' (proteção) ou uma forma de sobreviver/lucrar neste cenário específico.`,
    outputSchema: { economic_threat: "string", our_solution_as_hedge: "string", talking_points: "array" }
  },
  {
    id: "value-proposition-canvas",
    name: "Canvas de Proposta de Valor",
    description: "Estrutura o valor real do seu produto.",
    category: "strategy",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" }
    ],
    promptTemplate: `Atue como um Product Manager. Preencha o Canvas de Proposta de Valor para o lead {{name}}. 
    Lado do Cliente: Tarefas (Jobs to be done), Dores, Ganhos. 
    Lado do Produto: Funcionalidades, Aliviadores de Dor, Criadores de Ganho. 
    Identifique o 'Fit' perfeito e gere o 'Value Statement' final de uma frase.`,
    outputSchema: { customer_profile: "object", value_map: "object", fit_statement: "string" }
  },

  // --- CATEGORIA 5: AUTOMAÇÃO ---
  {
    id: "auto-follow-up",
    name: "Motor de Follow-up",
    description: "Agenda e cria os próximos contatos sozinho.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" }
    ],
    promptTemplate: `Crie uma sequência de 3 e-mails de follow-up para o lead {{name}}. 
    E-mail 1 (Dia 3): Educativo (envie um insight). 
    E-mail 2 (Dia 7): Prova Social (cite um caso similar). 
    E-mail 3 (Dia 12): Direto (peça um sim ou não). 
    Garanta que as mensagens sejam curtas, personalizadas e com foco em ajudar, não em cobrar.`,
    outputSchema: { sequence: "array", goal_of_sequence: "string" }
  },
  {
    id: "silence-breaker",
    name: "Quebrador de Silêncio",
    description: "Última tentativa antes de descartar o lead.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" }
    ],
    promptTemplate: `O lead {{name}} parou de responder há mais de 15 dias. Gere 2 opções de 'Quebrador de Silêncio'. 
    Opção 1: Humor leve (Ex: 'Você foi sequestrado por alienígenas?'). 
    Opção 2: Honestidade radical (Ex: 'Presumo que suas prioridades mudaram'). 
    Objetivo: Obter uma resposta rápida, mesmo que seja um 'Não' definitivo.`,
    outputSchema: { option_humor: "string", option_radical_honesty: "string", advice: "string" }
  },
  {
    id: "multi-thread-planner",
    name: "Planejador Multi-thread",
    description: "Ataca várias pessoas na empresa ao mesmo tempo.",
    category: "copywriting",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "role1", label: "Cargo 1 (Ex: Técnico)", type: "text" },
      { name: "role2", label: "Cargo 2 (Ex: Financeiro)", type: "text" }
    ],
    promptTemplate: `Para a empresa {{company}}, planeje uma estratégia multi-thread. 
    Fale com o {{role1}} (Dores técnicas) e simultaneamente com o {{role2}} (Dores financeiras). 
    Como as mensagens devem se complementar sem parecer spam? 
    Gere o script de abertura para ambos os cargos garantindo a coerência da narrativa.`,
    outputSchema: { strategy: "string", scripts: "array", coordination_tips: "string" }
  },
  {
    id: "auto-disqualifier",
    name: "Desqualificador Automático",
    description: "Limpa sua base de leads que só perdem tempo.",
    category: "strategy",
    inputs: [
      { name: "name", label: "Lead", type: "text" },
      { name: "company", label: "Empresa", type: "text" }
    ],
    promptTemplate: `Atue como um gestor de vendas rigoroso. Analise os dados do lead {{name}} ({{company}}). 
    Identifique 'Red Flags': Empresa muito pequena? Setor em crise? Cargo sem poder? 
    Decida se devemos desqualificar este lead agora para economizar tempo do SDR. Justifique com 2 motivos claros.`,
    outputSchema: { disqualify: "boolean", red_flags: "array", justification: "string" }
  },
  {
    id: "lead-recycling",
    name: "Motor de Reciclagem",
    description: "Reativa leads antigos no momento certo.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Lead", type: "text" },
      { name: "reason", label: "Motivo Perda Anterior", type: "text" },
      { name: "company", label: "Empresa", type: "text" },
      { name: "news", label: "Fato Novo/Notícia", type: "text" }
    ],
    promptTemplate: `Temos este lead {{name}} que 'esfriou' há 6 meses. O motivo foi: "{{reason}}". 
    Considerando que agora a empresa dele ({{company}}) está em um novo momento ({{news}}), gere um script de reabordagem que reconheça o passado mas traga um fato novo e relevante para hoje. 
    O objetivo é parecer um 'Follow-up de Longo Prazo' inteligente.`,
    outputSchema: { recycling_script: "string", new_hook_used: "string" }
  },
  {
    id: "opportunity-reviver",
    name: "Reviver de Negócios",
    description: "Tenta salvar um negócio marcado como 'Perdido'.",
    category: "copywriting",
    inputs: [
      { name: "company", label: "Empresa", type: "text" },
      { name: "competitor", label: "Quem ganhou", type: "text" }
    ],
    promptTemplate: `O negócio com a {{company}} foi perdido para o concorrente {{competitor}}. 
    Gere um script de 'E-mail de Despedida Elegante' que deixe a porta aberta. 
    Dê 2 sugestões de quando e como entrar em contato novamente para perguntar como está sendo a experiência com o concorrente (plantando a dúvida).`,
    outputSchema: { farewell_script: "string", follow_up_trigger: "string", timing_advice: "string" }
  },
  {
    id: "smart-outreach-scheduler",
    name: "Agendador de Outreach",
    description: "Sugere quando disparar cada etapa da cadência.",
    category: "strategy",
    inputs: [
      { name: "sector", label: "Setor", type: "text" }
    ],
    promptTemplate: `Crie um cronograma de 15 dias para uma cadência de prospecção para o setor {{sector}}. 
    Quais dias da semana e horários têm maior taxa de conversão para este público? 
    Defina o intervalo entre: 1. LinkedIn; 2. Email 1; 3. Ligação; 4. Email 2. 
    Justifique o espaçamento para não saturar o lead.`,
    outputSchema: { schedule: "array", logic_behind_spacing: "string" }
  },
  {
    id: "whatsapp-automation-script",
    name: "Script de Automação Zap",
    description: "Cria mensagens curtas prontas para robôs de envio.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" }
    ],
    promptTemplate: `Atue como um copywriter de WhatsApp. Gere 3 variações de mensagens curtas (máx 200 caracteres) para {{name}}. 
    As mensagens devem ser formatadas para parecerem escritas à mão (sem links no primeiro contato, sem excesso de emojis). 
    Inclua uma pergunta aberta no final para forçar a resposta.`,
    outputSchema: { variation_1: "string", variation_2: "string", variation_3: "string", tips_to_avoid_spam: "array" }
  },
  {
    id: "linkedin-connector-ai",
    name: "Conector LinkedIn IA",
    description: "Mensagem de conexão que ninguém ignora.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Nome", type: "text" },
      { name: "about", label: "Resumo do Perfil (About)", type: "textarea" }
    ],
    promptTemplate: `Analise o perfil do LinkedIn de {{name}}: "{{about}}". 
    Gere um convite de conexão de até 300 caracteres que cite um ponto específico da carreira dele ou um post recente. 
    Não tente vender no convite. O objetivo é apenas que ele aceite a conexão para iniciarmos o relacionamento.`,
    outputSchema: { invitation_text: "string", anchor_point: "string" }
  },
  {
    id: "email-subject-ab-test",
    name: "Teste A/B de Assuntos",
    description: "Gera 5 assuntos de e-mail focados em abertura.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Nome", type: "text" },
      { name: "company", label: "Empresa", type: "text" }
    ],
    promptTemplate: `Gere 5 opções de assuntos de e-mail para o lead {{name}} da {{company}}. 
    Opção 1: Curiosidade; Opção 2: Benefício Direto; Opção 3: Personalizado (com o nome); Opção 4: Pergunta; Opção 5: Urgência. 
    Qual dessas você prevê que terá a maior taxa de abertura e por quê?`,
    outputSchema: { subjects: "array", winner_prediction: "string", reason: "string" }
  },

  // --- CATEGORIA 6: PERFORMANCE ---
  {
    id: "script-effectiveness",
    name: "Analisador de Eficácia",
    description: "Avalia se seu script atual é bom ou ruim.",
    category: "strategy",
    inputs: [
      { name: "script", label: "Seu Script Atual", type: "textarea" }
    ],
    promptTemplate: `Atue como um copywriter sénior. Analise este script: "{{script}}". 
    Dê uma nota de 0 a 10. Avalie: 1. Clareza do Gancho; 2. Proposta de Valor; 3. Call to Action. 
    Aponte 2 frases que devem ser removidas e sugira 2 frases mais fortes para substituí-las.`,
    outputSchema: { score: "number", strengths: "array", weaknesses: "array", improved_version: "string" }
  },
  {
    id: "sdr-coaching",
    name: "Mentor de Vendas IA",
    description: "Treinamento diário baseado nos seus erros.",
    category: "strategy",
    inputs: [
      { name: "history", label: "Histórico de Conversas", type: "textarea" }
    ],
    promptTemplate: `Analise o histórico de conversas do vendedor [{{history}}]. 
    Identifique o principal erro repetitivo (Ex: Fala demais do produto, não ouve o lead, desiste rápido). 
    Gere um exercício prático de 5 minutos para o vendedor treinar essa habilidade amanhã. 
    Dê uma palavra de incentivo baseada na melhor conversa dele.`,
    outputSchema: { main_flaw: "string", coaching_exercise: "string", motivation: "string" }
  },
  {
    id: "win-loss-analyzer",
    name: "Analisador Win-Loss",
    description: "Descubra o real motivo de ganhar ou perder.",
    category: "strategy",
    inputs: [
      { name: "reasons", label: "Motivos Declarados (Lista)", type: "textarea" }
    ],
    promptTemplate: `Analise estas 5 oportunidades marcadas como 'Perdidas'. 
    Motivos declarados: [{{reasons}}]. 
    Identifique a 'Causa Raiz' oculta. O problema é nosso preço? É nossa mensagem? É o perfil de lead que estamos buscando? 
    Sugira uma mudança estratégica para o próximo mês para aumentar a taxa de conversão em 10%.`,
    outputSchema: { root_cause_analysis: "string", pattern_detected: "string", strategic_pivot: "string" }
  },
  {
    id: "pipeline-bottleneck",
    name: "Detector de Gargalos",
    description: "Avisa onde os leads estão 'morrendo'.",
    category: "strategy",
    inputs: [
      { name: "metrics", label: "Métricas do Funil", type: "textarea" }
    ],
    promptTemplate: `Analise as métricas do funil: {{metrics}}. 
    Onde está o maior gargalo? (Ex: Muitos leads param na etapa de 'Proposta'). 
    Por que isso está acontecendo? Gere um plano de ação de 3 passos para 'desentupir' o pipeline nesta etapa específica.`,
    outputSchema: { bottleneck_stage: "string", reason: "string", action_plan: "array" }
  },
  {
    id: "forecast-accuracy",
    name: "Precisão de Forecast",
    description: "Preveja quanto vai vender com alta certeza.",
    category: "strategy",
    inputs: [
      { name: "pipeline_value", label: "Valor em Pipeline", type: "text" }
    ],
    promptTemplate: `Com base no pipeline atual ({{pipeline_value}}) e na velocidade histórica, quanto realmente fecharemos este mês? 
    Classifique a confiança dessa previsão em: Baixa, Média ou Alta. 
    Quais são os 3 deals específicos que o gestor deve focar hoje para garantir a meta?`,
    outputSchema: { predicted_revenue: "number", confidence_level: "string", priority_deals: "array" }
  },
  {
    id: "burnout-risk",
    name: "Risco de Fadiga",
    description: "Monitora a saúde mental e ritmo da equipe.",
    category: "strategy",
    inputs: [
      { name: "user", label: "Nome do Vendedor", type: "text" }
    ],
    promptTemplate: `Analise o padrão de atividade do vendedor {{user}} (Volume de ligações, tempo de resposta, tom dos registros). 
    Há sinais de esgotamento ou queda brusca de entusiasmo? 
    Se sim, sugira ao gestor uma abordagem empática ou um dia de folga estratégico. 
    O objetivo é manter a performance de longo prazo, não apenas o curto prazo.`,
    outputSchema: { fatigue_risk_score: "number", signs_detected: "array", manager_advice: "string" }
  },
  {
    id: "sales-velocity-calculator",
    name: "Calculadora de Velocidade",
    description: "Mede quão rápido o dinheiro entra.",
    category: "strategy",
    inputs: [
      { name: "count", label: "Nº Oportunidades", type: "number" },
      { name: "value", label: "Ticket Médio", type: "number" },
      { name: "conv", label: "Taxa Conversão (%)", type: "number" },
      { name: "cycle", label: "Ciclo Médio (Dias)", type: "number" }
    ],
    promptTemplate: `Calcule a 'Velocidade de Vendas' para este time: leads no funil ({{count}}), ticket médio ({{value}}), taxa de conversão ({{conv}}%) e ciclo de venda ({{cycle}} dias). 
    Interprete o resultado. Como podemos aumentar essa velocidade? (Ex: Diminuir o ciclo em 5 dias ou aumentar o ticket?) 
    Mostre o impacto financeiro de cada mudança.`,
    outputSchema: { velocity_result: "number", interpretation: "string", optimization_impact: "object" }
  },
  {
    id: "objection-handling-score",
    name: "Nota de Contorno",
    description: "Avalie quão bem você rebateu uma objeção.",
    category: "closing",
    inputs: [
      { name: "objection", label: "Objeção do Cliente", type: "text" },
      { name: "reply", label: "Resposta do Vendedor", type: "text" }
    ],
    promptTemplate: `Analise este diálogo. Lead: "{{objection}}". Vendedor: "{{reply}}". 
    Dê uma nota de 0 a 10 para o contorno de objeção. 
    O vendedor foi empático? Ele fez uma pergunta de controle depois? 
    Reescreva a resposta do vendedor para que ela seja uma 'Resposta Nota 10'.`,
    outputSchema: { score: "number", feedback: "string", perfect_reply: "string" }
  },
  {
    id: "meeting-quality-analyzer",
    name: "Analisador de Reunião",
    description: "Dê a nota da sua última demo/call.",
    category: "closing",
    inputs: [
      { name: "transcript", label: "Transcrição da Call", type: "textarea" }
    ],
    promptTemplate: `Analise a transcrição desta reunião: "{{transcript}}". 
    1. O vendedor descobriu a dor real? 2. Ele falou mais do que o lead (Talk/Listen Ratio)? 
    3. Ficou claro o próximo passo (Next Steps)? 
    Dê uma nota geral e liste os 3 momentos onde o deal quase foi perdido.`,
    outputSchema: { score: "number", talk_listen_ratio: "string", critical_moments: "array", next_steps_clear: "boolean" }
  },
  {
    id: "ideal-customer-refiner",
    name: "Refinador de ICP",
    description: "Ajusta quem você deve buscar amanhã.",
    category: "strategy",
    inputs: [
      { name: "wins_data", label: "Dados de Deals Ganhos", type: "textarea" }
    ],
    promptTemplate: `Analise os últimos 10 negócios fechados (Wins). 
    Quais são os padrões comuns (Setor, Cargo, Dor, Tecnologia usada)? 
    Com base nisso, como devemos mudar nosso Perfil de Cliente Ideal (ICP) para o próximo trimestre? 
    Identifique um tipo de lead que devemos parar de buscar imediatamente porque não converte.`,
    outputSchema: { new_icp_definition: "object", target_segments: "array", negative_icp_traits: "array" }
  },

  // --- CATEGORIA 9: ADICIONAIS DE ELITE (51-60) ---
  {
    id: "referral-generator",
    name: "Gerador de Indicação",
    description: "Pede indicações de forma natural para clientes satisfeitos.",
    category: "closing",
    inputs: [
      { name: "name", label: "Nome do Cliente", type: "text" },
      { name: "sector", label: "Setor", type: "text" },
      { name: "role", label: "Cargo Alvo da Indicação", type: "text" }
    ],
    promptTemplate: `O cliente {{name}} acabou de ter um resultado positivo com o nosso produto. 
    Gere um e-mail para pedir uma indicação. 
    Não peça 'qualquer pessoa'. Peça especificamente por 2 contatos no setor {{sector}} ou cargos de {{role}}. 
    Facilite a vida dele dando um texto pronto que ele só precise dar 'Forward'.`,
    outputSchema: { referral_email: "string", forward_ready_text: "string", logic: "string" }
  },
  {
    id: "video-script-ai",
    name: "Roteiro de Vídeo Personalizado",
    description: "Gera roteiro para um vídeo rápido de prospecção.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" }
    ],
    promptTemplate: `Crie um roteiro para um vídeo de 60 segundos para o lead {{name}}. 
    Instruções de cena: O que mostrar na tela (Ex: o site do lead)? 
    Script de fala: Abertura impactante + Problema + Nossa Solução + CTA. 
    Foque em ser visual e direto.`,
    outputSchema: { scene_instructions: "array", spoken_script: "string", duration_est: "string" }
  },
  {
    id: "churn-predictor",
    name: "Preditivo de Cancelamento",
    description: "Avisa se um cliente atual está prestes a sair.",
    category: "strategy",
    inputs: [
      { name: "company", label: "Empresa", type: "text" }
    ],
    promptTemplate: `Analise os dados de uso do cliente {{company}}. 
    Houve queda no login? Falta de abertura de e-mails? Reclamações no suporte? 
    Atribua um 'Risco de Churn' de 0 a 100. 
    Gere um plano de 'Salva-Vidas' imediato para o Customer Success agir hoje.`,
    outputSchema: { churn_risk: "number", red_flags: "array", recovery_plan: "string" }
  },
  {
    id: "partnership-identifier",
    name: "Identificador de Parcerias",
    description: "Descobre empresas que vendem para o mesmo lead que você.",
    category: "strategy",
    inputs: [
      { name: "product", label: "Seu Produto", type: "text" },
      { name: "sector", label: "Setor Alvo", type: "text" }
    ],
    promptTemplate: `Para o nosso produto {{product}}, quais outras empresas (não concorrentes) vendem para os mesmos leads no setor {{sector}}? 
    Sugira 3 parceiros ideais para fazermos 'Co-selling' (venda conjunta). 
    Explique como uma indicação mútua beneficiaria o cliente final.`,
    outputSchema: { potential_partners: "array", co_selling_pitch: "string" }
  },
  {
    id: "product-market-fit",
    name: "Analisador de Fit de Produto",
    description: "Diz se sua funcionalidade X resolve a dor Y do mercado.",
    category: "strategy",
    inputs: [
      { name: "feature", label: "Funcionalidade", type: "text" },
      { name: "sector", label: "Setor", type: "text" }
    ],
    promptTemplate: `Analise a funcionalidade "{{feature}}" do nosso produto. 
    No setor {{sector}}, essa funcionalidade resolve um problema 'Nice-to-have' (Desejável) ou um 'Pain-killer' (Necessário)? 
    Se for Nice-to-have, como podemos re-posicioná-la para parecer uma necessidade urgente?`,
    outputSchema: { fit_level: "string", positioning_pivot: "string", target_pain: "string" }
  },
  {
    id: "competitive-pricing-ai",
    name: "IA de Precificação Competitiva",
    description: "Sugere o preço ideal para ganhar o deal.",
    category: "strategy",
    inputs: [
      { name: "competitor", label: "Concorrente", type: "text" },
      { name: "price", label: "Preço do Concorrente", type: "text" },
      { name: "company", label: "Empresa Cliente", type: "text" }
    ],
    promptTemplate: `O concorrente {{competitor}} cobra aproximadamente {{price}}. 
    Para ganhar o negócio na {{company}}, qual deve ser nosso posicionamento de preço? 
    Devemos ser: A) Premium; B) Mais Barato; C) Valor Igual com mais entrega. 
    Justifique com base na força da marca e maturidade do cliente.`,
    outputSchema: { recommended_positioning: "string", price_anchor_script: "string" }
  },
  {
    id: "sales-playbook-generator",
    name: "Gerador de Playbook de Vendas",
    description: "Transforma seus acertos em um manual para o time.",
    category: "strategy",
    inputs: [
      { name: "success_stories", label: "Histórias de Sucesso", type: "textarea" }
    ],
    promptTemplate: `Com base nos nossos 10 melhores fechamentos deste mês, gere um 'Mini-Playbook' para novos vendedores. 
    O que funcionou? Qual foi o gancho? Como contornamos as objeções? 
    Estruture em: 1. Perfil do Lead; 2. Abordagem Vencedora; 3. Momento do Fechamento.`,
    outputSchema: { playbook_sections: "array", key_learnings: "array" }
  },
  {
    id: "user-behavior-analysis",
    name: "Análise de Comportamento",
    description: "Entenda como o lead interagiu com sua proposta digital.",
    category: "strategy",
    inputs: [
      { name: "behavior_data", label: "Dados de Comportamento", type: "textarea" }
    ],
    promptTemplate: `O lead abriu sua proposta 5 vezes e passou 80% do tempo na página de 'Preços'. 
    O que isso significa psicologicamente? 
    Ele está comparando? Ele está assustado? 
    Gere um script de follow-up que ataque essa dúvida de preço de forma sutil, sem dizer que você estava espionando o comportamento dele.`,
    outputSchema: { behavioral_insight: "string", recommended_action: "string", follow_up_script: "string" }
  },
  {
    id: "ai-email-replier",
    name: "Sugestão de Resposta de E-mail",
    description: "Sugere a melhor resposta para o e-mail do lead.",
    category: "copywriting",
    inputs: [
      { name: "email", label: "Email do Cliente", type: "textarea" }
    ],
    promptTemplate: `O lead enviou este e-mail: "{{email}}". 
    Qual o objetivo oculto dele? (Ex: Ele quer um desconto mas não disse explicitamente). 
    Gere uma resposta que: 1. Valide o ponto dele; 2. Mantenha o valor do produto; 3. Proponha um próximo passo claro (CTA).`,
    outputSchema: { hidden_intent: "string", suggested_reply: "string", tactical_advice: "string" }
  },
  {
    id: "cold-calling-navigator",
    name: "Navegador de Cold Call",
    description: "Guia o vendedor em tempo real durante a ligação.",
    category: "copywriting",
    inputs: [
      { name: "name", label: "Nome do Lead", type: "text" }
    ],
    promptTemplate: `O vendedor está em uma Cold Call com {{name}}. 
    Se o lead disser 'Estou em reunião', o que o vendedor diz? 
    Se o lead disser 'Não tenho interesse', como o vendedor faz a pergunta de descoberta? 
    Crie uma árvore de decisão de 3 níveis para esta chamada específica.`,
    outputSchema: { decision_tree: "object", opener: "string", objection_handlers: "array" }
  },
  ...EXTRA_TOOLS
];
