
import jsPDF from 'jspdf';

export const exportToPDF = (title: string, content: string) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 20, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.text("Sales Prospector AI - Relatório Executivo", 105, 13, { align: 'center' });

    // Title
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(title, 20, 40);

    // Timestamp
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 20, 46);

    // Content
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    // Split text to fit page width (A4 width ~210mm, margins ~20mm each -> 170mm safe width)
    const splitText = doc.splitTextToSize(content, 170);

    // Simple pagination handling
    let cursorY = 60;
    const pageHeight = 290;

    splitText.forEach((line: string) => {
        if (cursorY > pageHeight - 20) {
            doc.addPage();
            cursorY = 30;
        }
        doc.text(line, 20, cursorY);
        cursorY += 6; // Line height
    });

    doc.save(`${title.replace(/\s+/g, '_')}_Report.pdf`);
};
