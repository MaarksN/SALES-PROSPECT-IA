
import React, { useRef, useState } from 'react';

export const Whiteboard = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
            ctx.fillStyle = 'black';
            ctx.fillRect(e.nativeEvent.offsetX, e.nativeEvent.offsetY, 2, 2);
        }
    };

    return (
        <div className="border rounded h-64 bg-white cursor-crosshair">
            <canvas
                ref={canvasRef}
                width={300}
                height={250}
                onMouseDown={() => setIsDrawing(true)}
                onMouseUp={() => setIsDrawing(false)}
                onMouseMove={draw}
                className="w-full h-full"
            />
        </div>
    );
};
