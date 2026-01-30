import React, { useRef } from "react";
import { Button } from "@/components/ui/Button";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

export default function GeradorFaturas() {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [generating, setGenerating] = React.useState(false);

  const handleDownload = async () => {
    if (!invoiceRef.current) return;
    setGenerating(true);

    try {
        // 1. Captura o elemento HTML como imagem
        const canvas = await html2canvas(invoiceRef.current, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        // 2. Cria o PDF
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("fatura-prospector.pdf");

        toast.success("Download iniciado!");
    } catch (err) {
        toast.error("Erro ao gerar PDF.");
        console.error(err);
    } finally {
        setGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
        <div className="flex justify-end">
             <Button onClick={handleDownload} disabled={generating}>
                {generating ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
                {generating ? "Gerando..." : "Baixar PDF"}
            </Button>
        </div>

        {/* Área Capturável */}
        <div ref={invoiceRef} className="mx-auto w-full max-w-3xl rounded-xl bg-white p-12 shadow-xl text-slate-900">
            <div className="mb-12 flex justify-between border-b pb-8">
                <div>
                    <h1 className="text-4xl font-black text-indigo-600">FATURA</h1>
                    <p className="text-slate-500 mt-2">#INV-2024-001</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-xl">Sua Empresa Ltda</p>
                    <p className="text-slate-500">contato@empresa.com</p>
                    <p className="text-slate-500">CNPJ: 00.000.000/0001-99</p>
                </div>
            </div>

            <div className="mb-8">
                <h3 className="font-bold text-slate-400 uppercase text-xs mb-2">Faturado Para:</h3>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <input placeholder="Nome do Cliente" className="bg-transparent w-full font-bold text-lg outline-none" defaultValue="Cliente Exemplo SA" />
                    <input placeholder="E-mail" className="bg-transparent w-full text-slate-500 outline-none" defaultValue="financeiro@cliente.com" />
                </div>
            </div>

            <table className="w-full mb-12">
                <thead>
                    <tr className="border-b-2 border-slate-100 text-left">
                        <th className="py-4 font-bold text-slate-500">Descrição</th>
                        <th className="py-4 font-bold text-slate-500 text-right">Valor</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-slate-50">
                        <td className="py-4"><input className="w-full outline-none" defaultValue="Consultoria de Vendas B2B" /></td>
                        <td className="py-4 text-right"><input className="text-right outline-none" defaultValue="R$ 5.000,00" /></td>
                    </tr>
                    <tr className="border-b border-slate-50">
                        <td className="py-4"><input className="w-full outline-none" defaultValue="Setup de CRM" /></td>
                        <td className="py-4 text-right"><input className="text-right outline-none" defaultValue="R$ 1.500,00" /></td>
                    </tr>
                </tbody>
            </table>

            <div className="flex justify-end">
                <div className="text-right">
                    <p className="text-slate-500">Total</p>
                    <p className="text-3xl font-black text-indigo-600">R$ 6.500,00</p>
                </div>
            </div>

            <div className="mt-12 pt-8 border-t text-center text-xs text-slate-400">
                <p>Emitido via Sales Prospector v2</p>
            </div>
        </div>
    </div>
  );
}