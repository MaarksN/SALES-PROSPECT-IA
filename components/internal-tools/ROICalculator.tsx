
import React, { useState } from 'react';

export const ROICalculator = () => {
    const [cost, setCost] = useState(100);
    const [revenue, setRevenue] = useState(200);
    const roi = ((revenue - cost) / cost) * 100;

    return (
        <div className="p-4 bg-slate-50 rounded text-center">
            <h3 className="font-bold mb-4">ROI Calculator</h3>
            <div className="flex gap-4 mb-4">
                <input type="number" className="p-2 border w-24" value={cost} onChange={e => setCost(Number(e.target.value))} />
                <input type="number" className="p-2 border w-24" value={revenue} onChange={e => setRevenue(Number(e.target.value))} />
            </div>
            <div className="text-4xl font-black text-green-600">{roi.toFixed(1)}%</div>
        </div>
    );
};
