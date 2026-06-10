import { useEffect, useState } from 'react'
import { getPdfsByType, type PdfRecord } from '@/services/pdfs'
import { PdfViewerLayout } from '@/components/pdf/PdfViewerLayout'
import { useToast } from '@/components/ui/use-toast'

export default function TreinamentosPage() {
  const { toast } = useToast()
  const [documents, setDocuments] = useState<PdfRecord[]>([])
  const [activeDoc, setActiveDoc] = useState<PdfRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const pdts = await getPdfsByType('treinamento')
        const valid = (pdts || []).filter((c) => c.arquivo !== '')
        setDocuments(valid)
        setActiveDoc(valid.length > 0 ? valid[0] : null)
      } catch (err) {
        console.error('Error fetching treinamentos:', err)
        setError(true)
        toast({
          title: 'Erro de conexão',
          description:
            'Não foi possível carregar os materiais no momento. Tente novamente mais tarde.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <PdfViewerLayout
      title="Material de Treinamento"
      description="Acesse materiais de capacitação para decolar suas vendas"
      bgImageUrl="https://img.usecurling.com/p/1920/1080?q=training%20business%20meeting"
      documents={documents}
      activeDocument={activeDoc}
      onSelectDocument={setActiveDoc}
      loading={loading}
      error={error}
      emptyMessage="Nenhum material de treinamento disponível no momento"
      tipo="treinamento"
      showUpload={false}
    />
  )
}
