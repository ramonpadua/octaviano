import pb from '@/lib/pocketbase/client'
import type { RecordModel } from 'pocketbase'

export interface RevendedorData {
  nome: string
  email: string
  whatsapp: string
  cpf_cnpj: string
  rg_ie: string
  endereco: string
  numero_porta: string
  bairro: string
  cidade: string
  estado: string
  cep: string
}

export const createRevendedor = async (
  data: RevendedorData,
): Promise<RecordModel> => {
  return pb.collection('revendedores').create({
    ...data,
    status: 'pendente',
  })
}

export const getRevendedores = async (): Promise<RecordModel[]> => {
  return pb.collection('revendedores').getFullList({ sort: '-created' })
}

export const updateRevendedorStatus = async (
  id: string,
  status: 'pendente' | 'aprovado' | 'finalizado',
): Promise<RecordModel> => {
  return pb.collection('revendedores').update(id, { status })
}

export const getAllRevendedores = async (): Promise<RecordModel[]> => {
  return pb.collection('revendedores').getFullList({ sort: '-created' })
}

export const updateRevendedor = async (
  id: string,
  data: any,
): Promise<RecordModel> => {
  return pb.collection('revendedores').update(id, data)
}

export const deleteRevendedor = async (id: string): Promise<void> => {
  return pb.collection('revendedores').delete(id)
}
