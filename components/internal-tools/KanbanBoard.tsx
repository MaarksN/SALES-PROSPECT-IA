
import React, { useState } from 'react';

export const KanbanBoard = () => {
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Task 1', status: 'todo' },
        { id: 2, title: 'Task 2', status: 'done' },
    ]);

    const move = (id: number, status: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
    };

    return (
        <div className="grid grid-cols-3 gap-2 h-64">
            {['todo', 'doing', 'done'].map(status => (
                <div key={status} className="bg-slate-100 p-2 rounded">
                    <h4 className="font-bold uppercase text-xs mb-2">{status}</h4>
                    {tasks.filter(t => t.status === status).map(t => (
                        <div key={t.id} className="bg-white p-2 mb-1 shadow text-xs cursor-pointer" onClick={() => move(t.id, status === 'todo' ? 'doing' : 'done')}>
                            {t.title}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};
