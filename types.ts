// Defines the possible categories for a product.
export type ProductCategory = 'Motos' | 'Peças' | 'Acessórios';

// Defines the possible seller identifiers.
export type SellerId = 'especialista_motos' | 'especialista_pecas';

// Represents a product object with all its properties, including a unique ID.
export interface Product {
  id: number;
  nome: string;
  categoria: ProductCategory;
  descricao: string;
  preco: number;
  sku: string;
  estoque: number;
  vendedor_id: SellerId;
  imagem_url: string | null;
}

// Represents the data required to create a new product, which excludes the 'id'.
export type ProductInput = Omit<Product, 'id'>;

// Represents the structure for displaying alert messages to the user.
export interface AlertMessage {
  message: string;
  type: 'success' | 'error';
}
