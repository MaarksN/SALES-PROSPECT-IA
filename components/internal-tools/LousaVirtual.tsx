
import React, { useRef, useState } from 'react';

export const LousaVirtual = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (ctx) {
            ctx.fillStyle = '#000';
            ctx.fillRect(x, y, 2, 2);
        }
    };

    const clear = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className="flex flex-col h-64">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold flex items-center gap-2">🖍️ Lousa Virtual</h3>
                <button onClick={clear} className="text-xs text-red-500 hover:text-red-700 font-bold uppercase">Limpar</button>
            </div>
            <div className="flex-1 border rounded-xl bg-white cursor-crosshair overflow-hidden relative shadow-inner">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={250}
                    onMouseDown={() => setIsDrawing(true)}
                    onMouseUp={() => setIsDrawing(false)}
                    onMouseLeave={() => setIsDrawing(false)}
                    onMouseMove={draw}
                    className="w-full h-full block"
                />
                <div className="absolute bottom-2 right-2 text-[10px] text-slate-300 pointer-events-none">Desenhe aqui</div>
            </div>
        </div>
    );
};
