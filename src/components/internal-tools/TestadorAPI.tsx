import React from "react";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { toast } from "sonner";

export default function TestadorAPI() {
  const runTest = async (endpoint: string) => {
    try {
        const start = Date.now();
        await api.get(endpoint);
        const duration = Date.now() - start;
        toast.success(`${endpoint}: OK (${duration}ms)`);
    } catch (e) {
        toast.error(`${endpoint}: FAILED`);
    }
  };

  return (
    <div className="grid gap-4 max-w-lg">
        <h3 className="font-bold">Health Checks Manuais</h3>
        <Button variant="outline" onClick={() => runTest("/health")}>Testar /health</Button>
        <Button variant="outline" onClick={() => runTest("/api/generate")}>Testar /ai/generate (Auth required)</Button>
    </div>
  );
}
