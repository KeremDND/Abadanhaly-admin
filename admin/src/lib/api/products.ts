/**
 * Products API Client
 * 
 * Centralized API functions for product management
 */

export interface Product {
  id: string;
  name: string;
  sku?: string | null;
  category?: string | null;
  color?: string | null;
  image: string;
  description?: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProductInput {
  name: string;
  sku?: string;
  category?: string;
  color?: string;
  image: string;
  description?: string;
  active?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: string;
}

/**
 * Fetch all products
 */
export async function getProducts(): Promise<Product[]> {
  const response = await fetch('/api/products');
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

/**
 * Create a new product
 */
export async function createProduct(input: CreateProductInput): Promise<Product> {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create product');
  }
  
  return response.json();
}

/**
 * Update an existing product
 */
export async function updateProduct(input: UpdateProductInput): Promise<Product> {
  const { id, ...data } = input;
  const response = await fetch(`/api/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update product');
  }
  
  return response.json();
}

/**
 * Delete a product
 */
export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete product');
  }
}

