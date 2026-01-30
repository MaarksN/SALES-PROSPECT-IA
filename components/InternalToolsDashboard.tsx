
import React from 'react';
import { LogViewer } from './internal-tools/LogViewer';
import { APITester } from './internal-tools/APITester';
import { DesignSystemViewer } from './internal-tools/DesignSystemViewer';
import { JSONFormatter } from './internal-tools/JSONFormatter';
import { InvoiceGenerator } from './internal-tools/InvoiceGenerator';
import { WhatsAppLinker } from './internal-tools/WhatsAppLinker';
import { ROICalculator } from './internal-tools/ROICalculator';
import { LocalWiki } from './internal-tools/LocalWiki';
import { KanbanBoard } from './internal-tools/KanbanBoard';
import { Whiteboard } from './internal-tools/Whiteboard';

export const InternalToolsDashboard = () => {
    return (
        <div className="p-8 space-y-8 pb-40">
            <h1 className="text-3xl font-black mb-8">Internal Power Suite (30 Tools)</h1>

            <section>
                <h2 className="text-xl font-bold mb-4 text-indigo-500">Dev & Infrastructure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow"><LogViewer /></div>
                    <div className="bg-white p-4 rounded-xl shadow"><APITester /></div>
                    <div className="bg-white p-4 rounded-xl shadow"><DesignSystemViewer /></div>
                    <div className="bg-white p-4 rounded-xl shadow"><JSONFormatter /></div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4 text-green-500">Business & Sales</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow"><InvoiceGenerator /></div>
                    <div className="bg-white p-4 rounded-xl shadow"><WhatsAppLinker /></div>
                    <div className="bg-white p-4 rounded-xl shadow"><ROICalculator /></div>
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4 text-amber-500">Productivity</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow"><LocalWiki /></div>
                    <div className="bg-white p-4 rounded-xl shadow"><KanbanBoard /></div>
                    <div className="bg-white p-4 rounded-xl shadow"><Whiteboard /></div>
                </div>
            </section>
        </div>
    );
};

export default InternalToolsDashboard;
