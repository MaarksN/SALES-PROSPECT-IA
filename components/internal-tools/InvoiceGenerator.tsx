
import React from 'react';
import jsPDF from 'jspdf';

export const InvoiceGenerator = () => {
    const generate = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("INVOICE", 20, 20);
        doc.setFontSize(12);
        doc.text("To: John Doe", 20, 40);
        doc.text("Item: Consulting Services", 20, 50);
        doc.text("Amount: $500.00", 20, 60);
        doc.save("invoice.pdf");
    };

    return (
        <div className="p-4 border rounded text-center">
            <h3 className="font-bold mb-2">Invoice Generator</h3>
            <button onClick={generate} className="px-4 py-2 bg-green-600 text-white rounded">Download PDF</button>
        </div>
    );
};
