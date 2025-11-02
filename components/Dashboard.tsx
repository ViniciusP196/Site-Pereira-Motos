import React, { useState, useEffect, useCallback } from 'react';
import Header from './Header';
import ProductManagement from './ProductManagement';
import AnalyticsDashboard from './AnalyticsDashboard';
import { Product, AlertMessage } from '../types';
import { getProducts } from '../services/apiService';
import Alert from './Alert';

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'management' | 'analytics'>('management');
  const [isLoading, setIsLoading] = useState(true);
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      setAlert({
        message: 'Falha ao carregar produtos do servidor. Verifique se o backend está rodando.',
        type: 'error',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const TabButton: React.FC<{ tabName: 'management' | 'analytics'; label: string; }> = ({ tabName, label }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors duration-200 ${
        activeTab === tabName
          ? 'border-b-2 border-red-600 text-red-600 bg-gray-50'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
    </button>
  );
  
  const closeAlert = useCallback(() => setAlert(null), []);

  return (
    <>
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {alert && <Alert message={alert.message} type={alert.type} onClose={closeAlert} />}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4" aria-label="Tabs">
              <TabButton tabName="management" label="Gerenciamento de Produtos" />
              <TabButton tabName="analytics" label="Análise de Estoque" />
            </nav>
          </div>
          
          <div className="mt-8">
            {isLoading ? (
                <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                    <p className="text-gray-500 mt-4">Carregando produtos...</p>
                </div>
            ) : (
                <>
                    {activeTab === 'management' && (
                      <ProductManagement 
                        initialProducts={products} 
                        onDataChange={loadProducts} 
                      />
                    )}
                    {activeTab === 'analytics' && <AnalyticsDashboard products={products} />}
                </>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;