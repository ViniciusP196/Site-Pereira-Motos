import { Product, ProductCategory } from '../types';

export const calculateTotalStockValue = (products: Product[]): number => {
  return products.reduce((total, product) => total + product.preco * product.estoque, 0);
};

export const countProductsByCategory = (products: Product[]): Record<ProductCategory, number> => {
  const counts: Record<string, number> = {
    Motos: 0,
    Peças: 0,
    Acessórios: 0,
  };
  products.forEach(product => {
    if (counts[product.categoria] !== undefined) {
      counts[product.categoria]++;
    }
  });
  return counts as Record<ProductCategory, number>;
};

export const getTopSellingProducts = (products: Product[], count: number = 3): Product[] => {
  // Mock function, as we don't have sales data.
  // We'll sort by price as a proxy for "top selling".
  return [...products]
    .sort((a, b) => b.preco - a.preco)
    .slice(0, count);
};

export const getStockStatusCounts = (products: Product[]): { inStock: number; lowStock: number; outOfStock: number } => {
    let inStock = 0;
    let lowStock = 0;
    let outOfStock = 0;

    products.forEach(p => {
        if (p.estoque === 0) {
            outOfStock++;
        } else if (p.estoque <= 10) {
            lowStock++;
        } else {
            inStock++;
        }
    });

    return { inStock, lowStock, outOfStock };
}
