import { describe, it, expect, vi, beforeEach } from "vitest";
import { autopilotService } from "./autopilotService";
import { api } from "@/lib/api";
import { useStore } from "@/store/useStore";

vi.mock("@/lib/api", () => ({
  api: {
    post: vi.fn()
  }
}));

vi.mock("@/store/useStore", () => ({
  useStore: {
    getState: vi.fn()
  }
}));

describe("AutopilotService Credit Compensation", () => {
  const mockAddCredits = vi.fn();
  const mockDecrementCredits = vi.fn().mockReturnValue(true);

  beforeEach(() => {
    vi.clearAllMocks();
    (useStore.getState as any).mockReturnValue({
      credits: 100,
      decrementCredits: mockDecrementCredits,
      addCredits: mockAddCredits
    });
    // Limpa a fila interna para cada teste
    (autopilotService as any).batchQueue = [];
    (autopilotService as any).isProcessing = false;
  });

  it("should refund correct amount of credits when batch processing fails", async () => {
    // Mock API failure
    (api.post as any).mockRejectedValue(new Error("Network Error"));

    // BATCH_SIZE is 5 in autopilotService.ts
    // We'll schedule 5 tasks to trigger the batch processing
    // Costs: enrich=2, analyze=1, email=1
    await autopilotService.scheduleTask("enrich", { id: 1 });  // 2 credits
    await autopilotService.scheduleTask("analyze", { id: 2 }); // 1 credit
    await autopilotService.scheduleTask("email", { id: 3 });   // 1 credit
    await autopilotService.scheduleTask("analyze", { id: 4 }); // 1 credit
    await autopilotService.scheduleTask("enrich", { id: 5 });  // 2 credits
    // Total expected refund: 2+1+1+1+2 = 7 credits

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(mockAddCredits).toHaveBeenCalledWith(7);
  });

  it("should NOT refund credits when batch processing succeeds", async () => {
    // Mock API success
    (api.post as any).mockResolvedValue({ data: { success: true } });

    await autopilotService.scheduleTask("analyze", { id: 1 });
    await autopilotService.scheduleTask("analyze", { id: 2 });
    await autopilotService.scheduleTask("analyze", { id: 3 });
    await autopilotService.scheduleTask("analyze", { id: 4 });
    await autopilotService.scheduleTask("analyze", { id: 5 });

    expect(api.post).toHaveBeenCalledTimes(1);
    expect(mockAddCredits).not.toHaveBeenCalled();
  });
});
