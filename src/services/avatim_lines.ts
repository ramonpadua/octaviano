import pb from '@/lib/pocketbase/client'
import { safeExecute } from '@/lib/pocketbase/circuit-breaker'
import type { RecordModel } from 'pocketbase'

export interface AvatimLine extends RecordModel {
  name: string
  description?: string
  image_url?: string
}

export const getAvatimLines = async (options: any = {}) => {
  return safeExecute(
    () =>
      pb
        .collection('avatim_lines')
        .getFullList<AvatimLine>({ ...options, requestKey: null }),
    {
      collection: 'avatim_lines',
      params: { perPage: '500', ...options },
      extractItems: true,
      defaultReturn: [],
    },
  )
}

export const createAvatimLine = async (data: Partial<AvatimLine>) => {
  try {
    return await pb.collection('avatim_lines').create<AvatimLine>(data)
  } catch (err) {
    console.error('Error creating avatim line:', err)
    throw err
  }
}

export const updateAvatimLine = async (
  id: string,
  data: Partial<AvatimLine>,
) => {
  try {
    return await pb.collection('avatim_lines').update<AvatimLine>(id, data)
  } catch (err) {
    console.error('Error updating avatim line:', err)
    throw err
  }
}

export const deleteAvatimLine = async (id: string) => {
  try {
    return await pb.collection('avatim_lines').delete(id)
  } catch (err) {
    console.error('Error deleting avatim line:', err)
    throw err
  }
}
