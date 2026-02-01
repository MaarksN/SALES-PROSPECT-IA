import React, { useState } from "react";
import { Button } from "@/components/ui/Button";

interface Task {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
}

export default function QuadroKanban() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Configurar Email", status: "todo" },
    { id: "2", title: "Validar Leads", status: "doing" },
    { id: "3", title: "Exportar Relatório", status: "done" },
  ]);

  const moveTask = (id: string, newStatus: Task["status"]) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const columns: { id: Task["status"], title: string, bg: string }[] = [
    { id: "todo", title: "A Fazer", bg: "bg-slate-100 dark:bg-slate-800" },
    { id: "doing", title: "Em Progresso", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { id: "done", title: "Concluído", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  return (
    <div className="h-[calc(100vh-200px)] overflow-x-auto">
        <div className="flex gap-6 h-full min-w-[800px]">
            {columns.map(col => (
                <div key={col.id} className={`flex-1 rounded-xl p-4 ${col.bg}`}>
                    <h3 className="font-bold mb-4 dark:text-white">{col.title}</h3>
                    <div className="space-y-3">
                        {tasks.filter(t => t.status === col.id).map(task => (
                            <div key={task.id} className="bg-white p-3 rounded-lg shadow-sm dark:bg-slate-950 dark:text-white border dark:border-slate-800">
                                <p>{task.title}</p>
                                <div className="mt-2 flex gap-1 justify-end">
                                    {col.id !== 'done' && (
                                        <Button size="sm" variant="ghost" onClick={() => moveTask(task.id, col.id === 'todo' ? 'doing' : 'done')}>→</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
