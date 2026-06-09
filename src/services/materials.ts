import pb from '@/lib/pocketbase/client'

export const getMaterials = async () => {
  try {
    return await pb.collection('materials').getFullList()
  } catch (error) {
    console.error('Error fetching materials:', error)
    return []
  }
}

export const getAllMaterials = async () => {
  try {
    return await pb.collection('materials').getFullList()
  } catch (error) {
    console.error('Error fetching all materials:', error)
    return []
  }
}

export const getMaterial = async (id: string) => {
  try {
    return await pb.collection('materials').getOne(id)
  } catch (error) {
    console.error(`Error fetching material ${id}:`, error)
    return null
  }
}

export const createMaterial = async (data: FormData | any) => {
  try {
    return await pb.collection('materials').create(data)
  } catch (error) {
    console.error('Error creating material:', error)
    throw error
  }
}

export const updateMaterial = async (id: string, data: FormData | any) => {
  try {
    return await pb.collection('materials').update(id, data)
  } catch (error) {
    console.error('Error updating material:', error)
    throw error
  }
}

export const deleteMaterial = async (id: string) => {
  try {
    return await pb.collection('materials').delete(id)
  } catch (error) {
    console.error('Error deleting material:', error)
    throw error
  }
}

export const getMaterialFileUrl = (record: any, fileName: string) => {
  try {
    return pb.files.getURL(record, fileName)
  } catch (error) {
    console.error('Error getting material file URL:', error)
    return ''
  }
}

export const getNormasDeVendasMaterial = async () => {
  try {
    return await pb
      .collection('materials')
      .getFirstListItem('title = "Normas de Vendas"')
  } catch (error) {
    console.error('Failed to fetch Normas de Vendas', error)
    return null
  }
}
