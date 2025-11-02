import { Product, ProductInput } from '../types';

const API_BASE_URL = '/api'; // Use a relative path for portability

const handleError = async (response: Response) => {
    const errorText = await response.text();
    let errorMessage = `HTTP error! status: ${response.status}`;
    try {
        // Try to parse the error text we already have as JSON
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || JSON.stringify(errorData);
    } catch (e) {
        // If it's not JSON, use the raw text body if available
        if (errorText) {
            errorMessage = errorText;
        }
    }
    throw new Error(errorMessage);
}

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    await handleError(response);
  }
  return response.json();
};

export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
};

export const addProduct = async (product: ProductInput): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  return handleResponse(response);
};

export const updateProduct = async (id: number, product: ProductInput): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  return handleResponse(response);
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
     await handleError(response);
  }
  // DELETE might not return a body, so we don't need to parse it on success
};