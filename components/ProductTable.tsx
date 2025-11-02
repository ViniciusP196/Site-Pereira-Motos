import React from 'react';
import { Product } from '../types';
import { EditIcon, DeleteIcon } from './icons';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onEdit, onDelete }) => {

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <h3 className="text-xl font-bold text-gray-800 mb-6">📦 Lista de Produtos</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">Imagem</th>
              <th scope="col" className="px-6 py-3">Nome</th>
              <th scope="col" className="px-6 py-3">Categoria</th>
              <th scope="col" className="px-6 py-3">Preço</th>
              <th scope="col" className="px-6 py-3">Estoque</th>
              <th scope="col" className="px-6 py-3">SKU</th>
              <th scope="col" className="px-6 py-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr className="bg-white border-b">
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Nenhum produto cadastrado ainda.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <img
                      src={product.imagem_url || 'https://via.placeholder.com/64'}
                      alt={product.nome}
                      className="w-16 h-16 object-cover rounded-md"
                      onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/64'; }}
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.nome}
                  </td>
                  <td className="px-6 py-4">{product.categoria}</td>
                  <td className="px-6 py-4 text-green-600 font-semibold">{formatCurrency(product.preco)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.estoque > 10 ? 'bg-green-100 text-green-800' : 
                        product.estoque > 0 ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                    }`}>
                      {product.estoque} unidades
                    </span>
                  </td>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center items-center space-x-3">
                      <button onClick={() => onEdit(product)} className="text-blue-600 hover:text-blue-800 transition-colors" title="Editar">
                        <EditIcon />
                      </button>
                      <button onClick={() => onDelete(product.id)} className="text-red-600 hover:text-red-800 transition-colors" title="Excluir">
                        <DeleteIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ProductTable;
