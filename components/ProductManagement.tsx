import React, { useState } from 'react';
import ProductForm from './ProductForm';
import ProductTable from './ProductTable';
import ConfirmationModal from './ConfirmationModal';
import ImportModal from './ImportModal';
import { Product, ProductInput, AlertMessage } from '../types';
import { addProduct, updateProduct, deleteProduct } from '../services/apiService';

interface ProductManagementProps {
  initialProducts: Product[];
  onDataChange: () => void;
}

const ProductManagement: React.FC<ProductManagementProps> = ({ initialProducts, onDataChange }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  const handleAddProduct = async (productData: ProductInput) => {
    try {
      await addProduct(productData);
      setAlert({ message: '✅ Produto adicionado com sucesso!', type: 'success' });
      onDataChange(); // Refresh data from source
    } catch (error) {
      console.error("Failed to add product:", error);
      setAlert({ message: `❌ Erro ao adicionar produto: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
    }
  };

  const handleUpdateProduct = async (productData: Product) => {
    try {
      await updateProduct(productData.id, productData);
      setAlert({ message: '💾 Produto atualizado com sucesso!', type: 'success' });
      setEditingProduct(null);
      onDataChange();
    } catch (error) {
      console.error("Failed to update product:", error);
      setAlert({ message: `❌ Erro ao atualizar produto: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete === null) return;
    try {
      await deleteProduct(productToDelete);
      setAlert({ message: '🗑️ Produto excluído com sucesso!', type: 'success' });
      onDataChange();
    } catch (error) {
      console.error("Failed to delete product:", error);
      setAlert({ message: `❌ Erro ao excluir produto: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
    } finally {
      setProductToDelete(null);
    }
  };
  
  const handleImportProducts = async (importedProducts: ProductInput[]) => {
    try {
      for (const p of importedProducts) {
        await addProduct(p);
      }
      setAlert({ message: `📊 ${importedProducts.length} produtos importados com sucesso!`, type: 'success'});
      onDataChange();
    } catch (error) {
       console.error("Failed to import products:", error);
       setAlert({ message: `❌ Erro ao importar produtos: ${error instanceof Error ? error.message : 'Unknown error'}`, type: 'error' });
    } finally {
      setImportModalOpen(false);
    }
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  return (
    <div className="space-y-8">
      <ProductForm 
        onAddProduct={handleAddProduct}
        onUpdateProduct={handleUpdateProduct}
        setAlert={setAlert}
        editingProduct={editingProduct}
        onCancelEdit={handleCancelEdit}
      />
      <div className="flex justify-end">
          <button onClick={() => setImportModalOpen(true)} className="py-2 px-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition">
              Importar CSV
          </button>
      </div>
      <ProductTable 
        products={initialProducts} 
        onEdit={handleEdit} 
        onDelete={(id) => setProductToDelete(id)} 
      />
      <ConfirmationModal 
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
        title="Confirmar Exclusão"
      >
        Você tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.
      </ConfirmationModal>
      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImportProducts}
        setAlert={setAlert}
      />
    </div>
  );
};

export default ProductManagement;
