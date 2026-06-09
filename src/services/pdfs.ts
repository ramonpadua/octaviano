import pb from '@/lib/pocketbase/client'
import { safeExecute } from '@/lib/pocketbase/circuit-breaker'
import type { RecordModel } from 'pocketbase'

export interface PdfRecord extends RecordModel {
  titulo: string
  tipo: string
  categoria?: string
  arquivo?: string
  descricao?: string
  indice_json?: any
  resumo?: string
}

export const getPdfsByType = async (tipo: string, options: any = {}) => {
  try {
    return await pb.collection('pdfs').getFullList<PdfRecord>({
      filter: `tipo="${tipo}"`,
      ...options,
    })
  } catch (err: any) {
    console.error('Error in getPdfsByType:', err)
    return []
  }
}

export const getPdfUrl = (record: PdfRecord) => {
  if (!record || !record.arquivo) return ''
  return `${import.meta.env.VITE_POCKETBASE_URL}/api/files/${record.collectionId}/${record.id}/${record.arquivo}`
}

export const updatePdf = async (id: string, data: any) => {
  return pb.collection('pdfs').update<PdfRecord>(id, data)
}

export const getPdfsPaginated = async (
  page: number,
  perPage: number,
  options: any = {},
) => {
  try {
    return await pb
      .collection('pdfs')
      .getList<PdfRecord>(page, perPage, options)
  } catch (err: any) {
    console.error('Error in getPdfsPaginated:', err)
    return {
      page,
      perPage,
      totalItems: 0,
      totalPages: 0,
      items: [] as PdfRecord[],
    }
  }
}

export const deletePdf = async (id: string) => {
  try {
    return await pb.collection('pdfs').delete(id)
  } catch (error) {
    console.error('Error deleting PDF:', error)
    throw error
  }
}
