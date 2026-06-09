import pb from '@/lib/pocketbase/client'
import { type PdfRecord } from './pdfs'

export const processCatalogPdf = async (
  catalog: PdfRecord,
  fileBlob: Blob,
): Promise<PdfRecord> => {
  let updatedCatalog = catalog

  if (!catalog.arquivo) {
    try {
      const formData = new FormData()
      formData.append('arquivo', fileBlob, 'catalogo-avatim-20262.pdf')
      updatedCatalog = await pb
        .collection('pdfs')
        .update<PdfRecord>(catalog.id, formData)
    } catch (err) {
      console.warn('Failed to update catalog file via SDK:', err)
      // Return what we have to prevent UI crashing
      return updatedCatalog
    }
  }

  if (!updatedCatalog.resumo) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = async () => {
        try {
          const result = reader.result as string
          if (!result) return resolve(updatedCatalog)
          const base64data = result.split(',')[1]

          let success = false
          let lastErr = null
          for (let i = 0; i < 3; i++) {
            try {
              await pb.send('/backend/v1/pdfs/process', {
                method: 'POST',
                body: { pdfBase64: base64data, recordId: catalog.id },
              })
              success = true
              break
            } catch (err) {
              lastErr = err
              await new Promise((r) => setTimeout(r, 2000 * (i + 1)))
            }
          }

          if (!success) {
            console.warn('Failed to process catalog after retries:', lastErr)
            return resolve(updatedCatalog)
          }

          const finalUpdated = await pb
            .collection('pdfs')
            .getOne<PdfRecord>(catalog.id)
          resolve(finalUpdated)
        } catch (processErr) {
          console.warn('Failed to process catalog:', processErr)
          resolve(updatedCatalog) // graceful degradation
        }
      }
      reader.onerror = () => resolve(updatedCatalog)
      reader.readAsDataURL(fileBlob)
    })
  }

  return updatedCatalog
}
