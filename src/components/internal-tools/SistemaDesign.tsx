import React from "react";
import { Button } from "@/components/ui/Button";

export default function SistemaDesign() {
  return (
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Botões</h2>
            <div className="flex gap-4 flex-wrap">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
            </div>
        </div>
        <div>
            <h2 className="text-xl font-bold mb-4 dark:text-white">Cores</h2>
            <div className="flex gap-4">
                <div className="h-16 w-16 rounded-lg bg-indigo-600 shadow-lg"></div>
                <div className="h-16 w-16 rounded-lg bg-slate-900 shadow-lg"></div>
                <div className="h-16 w-16 rounded-lg bg-red-500 shadow-lg"></div>
                <div className="h-16 w-16 rounded-lg bg-green-500 shadow-lg"></div>
            </div>
        </div>
    </div>
  );
}