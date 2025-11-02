import React, { useState } from 'react';
import { ProductInput, AlertMessage, ProductCategory, SellerId } from '../types';
import { UploadIcon, FileTextIcon } from './icons';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (products: ProductInput[]) => void;
  setAlert: (alert: AlertMessage | null) => void;
}

const CSV_TEMPLATE = `nome,categoria,descricao,preco,sku,estoque,vendedor_id,imagem_url
Moto Z,Motos,"Moto potente e economica",35000,MOTO-Z-01,10,especialista_motos,https://example.com/moto.jpg
Pneu X,Peças,"Pneu para alta performance",500,PNEU-X-02,50,especialista_pecas,`;

const ImportModal: React.FC<ImportModalProps> = ({ isOpen, onClose, onImport, setAlert }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<ProductInput[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv') {
      setError('Por favor, selecione um arquivo .csv');
      setFile(null);
      setParsedProducts([]);
      return;
    }
    
    setFile(selectedFile);
    setError(null);
    parseCSV(selectedFile);
  };

  const parseCSV = (csvFile: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
      if (lines.length < 2) {
        setError("O arquivo CSV está vazio ou contém apenas o cabeçalho.");
        return;
      }

      const header = lines[0].split(',').map(h => h.trim());
      const requiredHeaders = ['nome', 'categoria', 'preco', 'sku', 'vendedor_id'];
      const missingHeaders = requiredHeaders.filter(rh => !header.includes(rh));

      if (missingHeaders.length > 0) {
        setError(`O cabeçalho do CSV está inválido. Faltando colunas: ${missingHeaders.join(', ')}`);
        setParsedProducts([]);
        return;
      }
      
      const products: ProductInput[] = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        if (!values) continue;

        const row: any = {};
        header.forEach((h, index) => {
          row[h] = values[index]?.replace(/"/g, '') || '';
        });

        if (!row.nome || !row.categoria || !row.preco || !row.sku || !row.vendedor_id) {
            console.warn(`Linha ${i+1} ignorada por falta de dados obrigatórios.`);
            continue;
        }

        products.push({
            nome: row.nome,
            categoria: row.categoria as ProductCategory,
            descricao: row.descricao || '',
            preco: parseFloat(row.preco) || 0,
            sku: row.sku,
            estoque: parseInt(row.estoque) || 0,
            vendedor_id: row.vendedor_id as SellerId,
            imagem_url: row.imagem_url || null,
        });
      }
      setParsedProducts(products);
    };

    reader.onerror = () => setError("Erro ao ler o arquivo.");
    reader.readAsText(csvFile);
  };
  
  const handleImportClick = () => {
    if (parsedProducts.length > 0) {
        onImport(parsedProducts);
    }
  };
  
  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "template_produtos.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl transform transition-all">
        <div className="p-6 border-b">
          <h3 className="text-xl leading-6 font-bold text-gray-900">Importar Produtos via CSV</h3>
        </div>
        <div className="p-6 space-y-4">
            <div className='bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg'>
                <p className='font-semibold'>Instruções:</p>
                <ol className='list-decimal list-inside text-sm mt-2'>
                    <li>O arquivo deve ser no formato <strong>.csv</strong>.</li>
                    <li>As colunas obrigatórias são: <strong>nome, categoria, preco, sku, vendedor_id</strong>.</li>
                    <li>As colunas opcionais são: <strong>descricao, estoque, imagem_url</strong>.</li>
                </ol>
                <button onClick={downloadTemplate} className='text-sm mt-3 text-blue-600 hover:underline font-semibold flex items-center gap-1'>
                    <FileTextIcon /> Baixar modelo de exemplo
                </button>
            </div>
            <div>
              <label htmlFor="file-upload" className="cursor-pointer flex justify-center w-full px-6 py-10 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition">
                <div className="space-y-1 text-center">
                  <UploadIcon />
                  <div className="flex text-sm text-gray-600">
                    <span className="relative font-medium text-indigo-600">
                      <span>Selecione um arquivo</span>
                    </span>
                    <p className="pl-1">ou arraste e solte aqui</p>
                  </div>
                  <p className="text-xs text-gray-500">CSV até 10MB</p>
                </div>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv"/>
              </label>
            </div>
            {file && !error && (
                <div className='text-center p-3 bg-gray-100 rounded-md'>
                    <p className='font-semibold text-gray-800'>{file.name}</p>
                    {parsedProducts.length > 0 ? (
                        <p className='text-green-600'>{parsedProducts.length} produtos encontrados e prontos para importar.</p>
                    ) : (
                         <p className='text-yellow-600'>Analisando arquivo...</p>
                    )}
                </div>
            )}
            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md text-center">{error}</p>}
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed"
            onClick={handleImportClick}
            disabled={parsedProducts.length === 0}
          >
            Importar {parsedProducts.length > 0 ? `${parsedProducts.length} Produtos` : ''}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm transition-colors"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;