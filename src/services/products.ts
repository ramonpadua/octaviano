import pb from '@/lib/pocketbase/client'
import { safeExecute } from '@/lib/pocketbase/circuit-breaker'
import type { RecordModel } from 'pocketbase'

export interface Product extends RecordModel {
  name: string
  price?: number
  description?: string
  category?: string
  image_url?: string
  codigo_produto?: string
  codigo_barras?: string
  descricao?: string
  grupo_produto?: string
  linha?: string
  codigo_ncm?: string
  preco_venda?: number
  unidade_medida?: string
  preco_custo?: number
  monofasico?: boolean
  categoria?: string
  imagem_url?: string
}

export const getProducts = async (
  page: number,
  perPage: number,
  options: any = {},
) => {
  return safeExecute(
    () =>
      pb
        .collection('products')
        .getList<Product>(page, perPage, { ...options, requestKey: null }),
    {
      collection: 'products',
      params: { page: String(page), perPage: String(perPage), ...options },
      extractItems: false,
      defaultReturn: {
        page,
        perPage,
        totalItems: 0,
        totalPages: 0,
        items: [] as Product[],
      } as any,
    },
  )
}

export const getAllProducts = async (options: any = {}) => {
  return safeExecute(
    () =>
      pb
        .collection('products')
        .getFullList<Product>({ ...options, requestKey: null }),
    {
      collection: 'products',
      params: { perPage: '500', ...options },
      extractItems: true,
      defaultReturn: [],
    },
  )
}

export const createProduct = async (data: Partial<Product>) => {
  try {
    return await pb.collection('products').create<Product>(data)
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const updateProduct = async (id: string, data: Partial<Product>) => {
  try {
    return await pb.collection('products').update<Product>(id, data)
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id: string) => {
  try {
    return await pb.collection('products').delete(id)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}
