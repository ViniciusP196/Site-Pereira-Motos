

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Product, ProductCategory, SellerId, AlertMessage, ProductInput } from '../types';
import { generateDescription } from '../services/geminiService';
import { SparklesIcon, XCircleIcon } from './icons';

interface ProductFormProps {
  onAddProduct: (product: ProductInput) => void;
  onUpdateProduct: (product: Product) => void;
  setAlert: (alert: AlertMessage | null) => void;
  editingProduct: Product | null;
  onCancelEdit: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ onAddProduct, onUpdateProduct, setAlert, editingProduct, onCancelEdit }) => {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState<ProductCategory | ''>('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [sku, setSku] = useState('');
  const [estoque, setEstoque] = useState('');
  const [imagemUrl, setImagemUrl] = useState('');
  const [vendedorId, setVendedorId] = useState<SellerId | ''>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingProduct) {
      setNome(editingProduct.nome);
      setCategoria(editingProduct.categoria);
      setDescricao(editingProduct.descricao);
      setPreco(String(editingProduct.preco));
      setSku(editingProduct.sku);
      setEstoque(String(editingProduct.estoque));
      setImagemUrl(editingProduct.imagem_url || '');
      setVendedorId(editingProduct.vendedor_id);
    } else {
      clearForm(false); // Don't revoke image on switch to add mode
    }
  }, [editingProduct]);
  
  // To prevent memory leaks, we need to revoke the blob URL when the component unmounts or the URL changes
  useEffect(() => {
    return () => {
      if (imagemUrl && imagemUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagemUrl);
      }
    };
  }, [imagemUrl]);

  const cleanupImage = useCallback(() => {
    if (imagemUrl && imagemUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagemUrl);
    }
  }, [imagemUrl]);

  const clearForm = useCallback((cleanup = true) => {
    if(cleanup) cleanupImage();
    setNome('');
    setCategoria('');
    setDescricao('');
    setPreco('');
    setSku('');
    setEstoque('');
    setImagemUrl('');
    setVendedorId('');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }, [cleanupImage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !categoria || !preco || !sku || !vendedorId) {
      setAlert({ message: '⚠️ Preencha todos os campos obrigatórios (*)', type: 'error' });
      return;
    }

    const productData = {
      nome,
      categoria,
      descricao,
      preco: parseFloat(preco),
      sku,
      estoque: parseInt(estoque) || 0,
      vendedor_id: vendedorId,
      imagem_url: imagemUrl || null,
    };
    
    if (editingProduct) {
        onUpdateProduct({ ...productData, id: editingProduct.id });
    } else {
        onAddProduct(productData);
    }
    clearForm();
  };
  
  const handleGenerateDescription = async () => {
    if(!nome || !categoria) {
      setAlert({ message: '⚠️ Preencha o nome e a categoria para gerar uma descrição.', type: 'error' });
      return;
    }
    setIsGenerating(true);
    setAlert(null);
    try {
      const generatedDesc = await generateDescription(nome, categoria);
      setDescricao(generatedDesc);
      setAlert({ message: '✨ Descrição gerada com sucesso!', type: 'success' });
    } catch (error) {
      console.error("Error generating description:", error);
      setAlert({ message: `❌ Erro ao gerar descrição: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      cleanupImage(); // Clean up previous blob if any
      setImagemUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    cleanupImage(); // Clean up blob if user decides to type a URL
    setImagemUrl(event.target.value);
  }

  return (
    <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6">{editingProduct ? '📝 Editando Produto' : '➕ Adicionar Novo Produto'}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="prod_nome">Nome do Produto *</label>
            <input type="text" id="prod_nome" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Honda CB 500F" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
          </div>
          <div className="form-group">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="prod_categoria">Categoria *</label>
            <select id="prod_categoria" value={categoria} onChange={e => setCategoria(e.target.value as ProductCategory)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-white text-gray-900">
              <option value="">Selecione...</option>
              <option value="Motos">Motos</option>
              <option value="Peças">Peças</option>
              <option value="Acessórios">Acessórios</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <div className="flex justify-between items-center mb-1">
            <label className="font-semibold text-gray-700" htmlFor="prod_descricao">Descrição</label>
            <button type="button" onClick={handleGenerateDescription} disabled={isGenerating} className="text-sm bg-red-100 text-red-700 font-semibold py-1 px-3 rounded-full hover:bg-red-200 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-red-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Gerando...
                </>
              ) : (
                <><SparklesIcon /> Gerar com IA</>
              )}
            </button>
          </div>
          <textarea id="prod_descricao" value={descricao} onChange={e => setDescricao(e.target.value)} placeholder="Descrição detalhada do produto... Ou clique em 'Gerar com IA'!" rows={4} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition"></textarea>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="form-group">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="prod_preco">Preço (R$) *</label>
            <input type="number" id="prod_preco" value={preco} onChange={e => setPreco(e.target.value)} placeholder="0.00" step="0.01" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
          </div>
          <div className="form-group">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="prod_sku">SKU (Código) *</label>
            <input type="text" id="prod_sku" value={sku} onChange={e => setSku(e.target.value)} placeholder="Ex: HONDA-CB500F-001" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
          </div>
          <div className="form-group">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="prod_estoque">Estoque</label>
            <input type="number" id="prod_estoque" value={estoque} onChange={e => setEstoque(e.target.value)} placeholder="0" min="0" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="form-group">
            <label className="block mb-1 font-semibold text-gray-700">Imagem do Produto</label>
             <div className="flex items-center space-x-4">
                 <input type="url" value={imagemUrl.startsWith('blob:') ? '' : imagemUrl} onChange={handleImageUrlChange} placeholder="https://exemplo.com/imagem.jpg" className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition" />
                <span className="text-gray-500">ou</span>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="py-3 px-4 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-100 transition whitespace-nowrap">
                    Enviar Arquivo
                </button>
                <input type="file" ref={fileInputRef} onChange={handleImageFileChange} className="hidden" accept="image/png, image/jpeg, image/webp" />
             </div>
            {imagemUrl && <img src={imagemUrl} alt="Preview" className="mt-4 w-32 h-32 object-cover rounded-lg border-2 border-gray-200" onError={(e) => (e.currentTarget.style.display = 'none')} />}
          </div>
          <div className="form-group">
            <label className="block mb-1 font-semibold text-gray-700" htmlFor="prod_vendedor">Vendedor *</label>
            <select id="prod_vendedor" value={vendedorId} onChange={e => setVendedorId(e.target.value as SellerId)} className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition bg-white text-gray-900">
              <option value="">Selecione...</option>
              <option value="especialista_motos">Especialista em Motos</option>
              <option value="especialista_pecas">Especialista em Peças</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 pt-4">
          <button type="submit" className="py-3 px-6 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 hover:-translate-y-0.5 transform transition-all duration-200 flex items-center gap-2">
            {editingProduct ? '💾 Salvar Alterações' : '✅ Adicionar Produto'}
          </button>
          <button type="button" onClick={() => { clearForm(); onCancelEdit(); }} className="py-3 px-6 bg-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-300 transform transition flex items-center gap-2">
            {editingProduct ? <><XCircleIcon /> Cancelar Edição</> : <>🔄 Limpar</>}
          </button>
        </div>
      </form>
    </section>
  );
};

export default ProductForm;