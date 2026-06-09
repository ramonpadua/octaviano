import { useState, useEffect, useCallback } from 'react'
import { PdfRecord, getPdfsByType } from '@/services/pdfs'
import { useRealtime } from '@/hooks/use-realtime'
import { PdfViewerLayout } from '@/components/pdf/PdfViewerLayout'

interface PdfPageTemplateProps {
  title: string
  description: string
  tipo: 'catalogo' | 'booking' | 'releases' | 'treinamento'
}

export function PdfPageTemplate({
  title,
  description,
  tipo,
}: PdfPageTemplateProps) {
  const [pdfs, setPdfs] = useState<PdfRecord[]>([])
  const [activePdf, setActivePdf] = useState<PdfRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchPdfs = useCallback(async () => {
    try {
      const data = await getPdfsByType(tipo)
      const valid = data.filter((pdf) => pdf.arquivo !== '')
      setPdfs(valid)

      if (valid.length > 0) {
        setActivePdf((current) => {
          if (current && valid.some((p) => p.id === current.id)) return current
          return valid[0]
        })
      } else {
        setActivePdf(null)
      }
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [tipo])

  useEffect(() => {
    fetchPdfs()
  }, [fetchPdfs])

  useRealtime('pdfs', () => {
    fetchPdfs()
  })

  const bgImageMap = {
    catalogo: 'https://img.usecurling.com/p/1920/1080?q=cosmetics%20perfume',
    booking:
      'https://img.usecurling.com/p/1920/1080?q=calendar%20planning%20business',
    releases:
      'https://img.usecurling.com/p/1920/1080?q=new%20product%20launch%20beauty',
    treinamento:
      'https://img.usecurling.com/p/1920/1080?q=learning%20consultancy%20business',
  }

  return (
    <PdfViewerLayout
      title={title}
      description={description}
      bgImageUrl={bgImageMap[tipo]}
      documents={pdfs}
      activeDocument={activePdf}
      onSelectDocument={setActivePdf}
      loading={loading}
      error={error}
      emptyMessage="Nenhum documento disponível nesta categoria."
      tipo={tipo}
      showUpload={true}
    />
  )
}
