import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";
import { v4 as uuidv4 } from 'uuid';

export interface AutopilotTask {
  id: string;
  type: "enrich" | "email" | "analyze";
  payload: any;
}

class AutopilotService {
  private sessionId: string;
  private batchQueue: AutopilotTask[] = [];
  private isProcessing = false;
  private BATCH_SIZE = 5;

  constructor() {
    this.sessionId = uuidv4();
  }

  // Adiciona tarefa à fila com verificação de créditos
  async scheduleTask(type: AutopilotTask["type"], payload: any) {
    const cost = this.getCost(type);
    const store = useStore.getState();

    if (store.credits < cost) {
      throw new Error("Créditos insuficientes para esta operação.");
    }

    // Decrementa localmente (otimista) - Backend valida novamente
    const success = store.decrementCredits(cost);
    if (!success) throw new Error("Falha ao debitar créditos.");

    const task: AutopilotTask = { id: uuidv4(), type, payload };
    this.batchQueue.push(task);

    if (this.batchQueue.length >= this.BATCH_SIZE && !this.isProcessing) {
        await this.processBatch();
    }

    return task.id;
  }

  private getCost(type: string): number {
    switch (type) {
        case "enrich": return 2;
        case "analyze": return 1;
        case "email": return 1;
        default: return 1;
    }
  }

  // Processa lote acumulado
  async processBatch() {
    if (this.batchQueue.length === 0) return;
    this.isProcessing = true;

    const batch = this.batchQueue.splice(0, this.BATCH_SIZE);

    try {
        console.log(`[Autopilot] Processing batch of ${batch.length} tasks. Session: ${this.sessionId}`);

        // Envia para backend (assumindo endpoint de bulk)
        // Se falhar, poderia devolver créditos (compensação)
        await api.post("/autopilot/batch", {
            sessionId: this.sessionId,
            tasks: batch
        });

    } catch (error) {
        console.error("Batch processing failed:", error);
        // TODO: Lógica de compensação de créditos aqui
    } finally {
        this.isProcessing = false;
        // Se sobrou algo, processa o resto
        if (this.batchQueue.length > 0) {
            await this.processBatch();
        }
    }
  }
}

export const autopilotService = new AutopilotService();
