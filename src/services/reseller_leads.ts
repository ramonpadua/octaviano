import pb from '@/lib/pocketbase/client'
import type { RecordListOptions } from 'pocketbase'

export type ResellerLead = {
  id?: string
  name: string
  email: string
  phone: string
  cpf: string
  rg_ie?: string
  address: string
  number?: string
  neighborhood?: string
  city: string
  state: string
  zip_code?: string
  status?: 'pendente' | 'aprovado' | 'finalizado'
  user_id?: string
  created?: string
  updated?: string
}

export const createResellerLead = (
  data: Omit<ResellerLead, 'id' | 'created' | 'updated'>,
) => pb.collection('reseller_leads').create({ ...data, status: 'pendente' })

export const getResellerLeads = (
  page = 1,
  perPage = 10,
  options?: RecordListOptions,
) =>
  pb.collection('reseller_leads').getList<ResellerLead>(page, perPage, options)

export const getAllResellerLeads = (options?: RecordListOptions) =>
  pb.collection('reseller_leads').getFullList<ResellerLead>(options)

export const updateResellerLead = (id: string, data: Partial<ResellerLead>) =>
  pb.collection('reseller_leads').update(id, data)
