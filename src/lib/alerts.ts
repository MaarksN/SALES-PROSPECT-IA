export const alerts = {
  critical: (error: Error, context?: string) => {
    console.error(`🚨 CRITICAL ALERT [${context}]:`, error);
    // Enviar SMS/Slack/PagerDuty
  }
};
