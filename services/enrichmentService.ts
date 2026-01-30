
interface BrasilAPICompany {
    cnpj: string;
    razao_social: string;
    nome_fantasia: string;
    cnae_fiscal_descricao: string;
    logradouro: string;
    numero: string;
    bairro: string;
    municipio: string;
    uf: string;
    cep: string;
    ddd_telefone_1: string;
    qsa: { nome_socio: string; qualificacao_socio_descricao: string }[];
}

export const enrichmentService = {
    async validateCNPJ(cnpj: string): Promise<Partial<BrasilAPICompany> | null> {
        const cleanCNPJ = cnpj.replace(/\D/g, '');
        if (cleanCNPJ.length !== 14) return null;

        try {
            const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`);
            if (!response.ok) throw new Error('CNPJ not found');
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("BrasilAPI Error:", error);
            return null;
        }
    }
};
