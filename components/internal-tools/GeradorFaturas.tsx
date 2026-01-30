
import React from 'react';
import jsPDF from 'jspdf';

export const GeradorFaturas = () => {
    const generate = () => {
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.text("FATURA COMERCIAL", 20, 20);
        doc.setFontSize(12);
        doc.text("Para: Cliente Exemplo Ltda", 20, 40);
        doc.text("Item: Consultoria de Vendas Premium", 20, 50);
        doc.text("Valor: R$ 2.500,00", 20, 60);
        doc.text("Vencimento: 10/10/2026", 20, 70);
        doc.save("fatura_exemplo.pdf");
    };

    return (
        <div className="p-6 border rounded-xl text-center bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">💰</div>
            <h3 className="font-bold mb-2">Gerador de Faturas PDF</h3>
            <p className="text-sm text-slate-500 mb-6">Crie faturas profissionais instantaneamente para seus clientes.</p>
            <button onClick={generate} className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-colors w-full">Baixar PDF Demo</button>
        </div>
    );
};
