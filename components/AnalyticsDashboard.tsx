import React from 'react';
import { Product } from '../types';
import { 
    calculateTotalStockValue, 
    countProductsByCategory, 
    getTopSellingProducts,
    getStockStatusCounts 
} from '../services/analyticsService';

interface AnalyticsDashboardProps {
  products: Product[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ products }) => {
  const totalValue = calculateTotalStockValue(products);
  const categoryCounts = countProductsByCategory(products);
  const topProducts = getTopSellingProducts(products, 3);
  const stockStatus = getStockStatusCounts(products);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`bg-white p-6 rounded-lg border border-gray-200 shadow-sm ${className}`}>
      <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card title="Valor Total do Estoque">
        <p className="text-4xl font-bold text-red-600">{formatCurrency(totalValue)}</p>
      </Card>

      <Card title="Produtos por Categoria">
        <ul className="space-y-2">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <li key={category} className="flex justify-between items-center text-gray-600">
              <span>{category}</span>
              <span className="font-bold text-gray-800 bg-gray-100 px-2 py-1 rounded-md">{count}</span>
            </li>
          ))}
        </ul>
      </Card>
      
      <Card title="Status do Estoque">
        <div className="space-y-3">
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <span className="text-gray-600">Em estoque (&gt;10):</span>
                <span className="ml-auto font-bold text-gray-800">{stockStatus.inStock}</span>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                <span className="text-gray-600">Estoque baixo (&le;10):</span>
                <span className="ml-auto font-bold text-gray-800">{stockStatus.lowStock}</span>
            </div>
            <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-3"></div>
                <span className="text-gray-600">Fora de estoque:</span>
                <span className="ml-auto font-bold text-gray-800">{stockStatus.outOfStock}</span>
            </div>
        </div>
      </Card>

      <Card title="Top 3 Produtos (por preço)" className="md:col-span-2 lg:col-span-3">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead>
                    <tr className="text-gray-500">
                        <th className="pb-2 font-normal">Produto</th>
                        <th className="pb-2 font-normal">Categoria</th>
                        <th className="pb-2 font-normal text-right">Preço</th>
                    </tr>
                </thead>
                <tbody>
                {topProducts.map(product => (
                    <tr key={product.id} className="border-t border-gray-100">
                    <td className="py-3 font-semibold text-gray-800">{product.nome}</td>
                    <td className="py-3 text-gray-600">{product.categoria}</td>
                    <td className="py-3 font-semibold text-red-600 text-right">{formatCurrency(product.preco)}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;