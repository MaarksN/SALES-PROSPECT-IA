// Métricas de uso simples
export const metrics = {
  trackAction: (action: string, value: number = 1) => {
    // console.log(`[Metric] ${action}: ${value}`);
    // Enviar para Analytics (GA4, Mixpanel, etc)
  },

  trackLatency: (metric: string, durationMs: number) => {
    // console.log(`[Latency] ${metric}: ${durationMs}ms`);
  }
};
