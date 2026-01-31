import React from "react";

export default function LousaVirtual() {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden rounded-2xl border bg-white dark:bg-slate-900 dark:border-slate-800">
        <div className="absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-lg bg-white p-2 shadow-md border dark:bg-slate-800 dark:border-slate-700">
            <button className="h-8 w-8 rounded bg-black text-white"></button>
            <button className="h-8 w-8 rounded bg-red-500"></button>
            <button className="h-8 w-8 rounded bg-blue-500"></button>
        </div>

        <div className="flex h-full w-full items-center justify-center text-slate-400">
            <p>Canvas HTML5 (Implementação de desenho via MouseEvents viria aqui)</p>
        </div>
    </div>
  );
}