import { describe, it, expect, vi } from "vitest";
import { geminiService } from "./geminiService";

// Mock da API (axios)
const postMock = vi.fn().mockResolvedValue({
  data: { text: "Texto gerado pela IA Mockada" }
});

vi.mock("@/lib/api", () => ({
  api: {
    post: (...args: any[]) => postMock(...args)
  }
}));

describe("GeminiService", () => {
  it("deve gerar um e-mail frio com sucesso", async () => {
    const context = { myProduct: "Software CRM", myCompany: "TestCorp" } as any;
    const response = await geminiService.generateColdMail("João", "Acme", context);

    expect(response).toBe("Texto gerado pela IA Mockada");
    expect(postMock).toHaveBeenCalledWith("/ai/generate", expect.objectContaining({
        prompt: expect.stringContaining("Atue como SDR Senior")
    }));
  });

  it("deve retornar JSON válido na análise de fit", async () => {
    postMock.mockResolvedValueOnce({
      data: { text: JSON.stringify({ score: 90, reason: "Bom fit" }) }
    });

    const result = await geminiService.analyzeFit("Empresa Tech", "Busco empresas de Tech");
    expect(result.score).toBe(90);
    expect(result.reason).toBe("Bom fit");
  });
});
