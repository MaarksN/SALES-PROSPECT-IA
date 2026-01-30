
import React, { useState } from 'react';

export const QuadroKanban = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Prospectar 10 Leads', status: 'todo' },
        { id: 2, title: 'Validar E-mails', status: 'doing' },
        { id: 3, title: 'Configurar CRM', status: 'done' },
    ]);

    const move = (id: number, currentStatus: string) => {
        const flow = ['todo', 'doing', 'done'];
        const nextIndex = flow.indexOf(currentStatus) + 1;
        if (nextIndex < flow.length) {
            setTasks(tasks.map(t => t.id === id ? { ...t, status: flow[nextIndex] } : t));
        } else {
            // Cycle back to todo
            setTasks(tasks.map(t => t.id === id ? { ...t, status: 'todo' } : t));
        }
    };

    const statusMap: Record<string, string> = { 'todo': 'A Fazer', 'doing': 'Em Progresso', 'done': 'Concluído' };
    const colorMap: Record<string, string> = { 'todo': 'bg-slate-100', 'doing': 'bg-blue-50', 'done': 'bg-green-50' };

    return (
        <div className="grid grid-cols-3 gap-3 h-64">
            {['todo', 'doing', 'done'].map(status => (
                <div key={status} className={`${colorMap[status]} p-3 rounded-xl flex flex-col`}>
                    <h4 className="font-bold uppercase text-[10px] text-slate-500 tracking-wider mb-3 flex justify-between">
                        {statusMap[status]}
                        <span className="bg-white px-2 rounded text-slate-400">{tasks.filter(t => t.status === status).length}</span>
                    </h4>
                    <div className="space-y-2 overflow-y-auto flex-1">
                        {tasks.filter(t => t.status === status).map(t => (
                            <div
                                key={t.id}
                                className="bg-white p-3 rounded-lg shadow-sm text-xs font-medium cursor-pointer hover:shadow-md transition-shadow border border-transparent hover:border-indigo-200"
                                onClick={() => move(t.id, status)}
                                title="Clique para avançar"
                            >
                                {t.title}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};
