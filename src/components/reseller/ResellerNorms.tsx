import { useEffect, useState, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, BookOpen, AlertCircle } from 'lucide-react'
import { getPdfUrl, PdfRecord } from '@/services/pdfs'
import { BookViewModal } from '@/components/pdf/BookViewModal'
import { useRealtime } from '@/hooks/use-realtime'
import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'

const normas = [
  'Desconto de 30%.',
  'Pedido mínimo 500,00.',
  'Portfólio de Fragrâncias R$ 495,00.',
  'Pagamento Cartão ou PIX.',
  'Pedido até R$ 500,00 pagamento em parcela única.',
  'Acima de R$ 500,00 pagamento em cartão 2x.',
  'Acima de R$ 1.500,00 pagamento em cartão 3x.',
  'Frete pago pelo Consultor.',
  'Pedido acima de R$ 1.500,00 frete dividido com a Sensatio.',
  'Pedido acima de R$ 3.000,00 frete pago pela Sensatio.',
]

export function ResellerNorms() {
  const [normasPdf, setNormasPdf] = useState<PdfRecord | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string>('')
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mounted = useRef(true)

  const fetchMaterial = useCallback(async (retryCount = 0) => {
    if (!mounted.current) return
    setLoading(true)
    setError(null)

    try {
      await pb.health.check()
      const targetPdf = await pb
        .collection('pdfs')
        .getFirstListItem<PdfRecord>('tipo="normas"', { sort: '-created' })

      if (!mounted.current) return

      if (targetPdf) {
        setNormasPdf(targetPdf)
        const url = getPdfUrl(targetPdf)
        setPdfUrl(url || '')
      } else {
        setNormasPdf(null)
        setPdfUrl('')
      }
    } catch (err) {
      if (!mounted.current) return

      if (err instanceof ClientResponseError && err.status === 404) {
        setNormasPdf(null)
        setPdfUrl('')
      } else {
        console.error('Failed to fetch normas pdf:', err)
        if (retryCount < 3) {
          setTimeout(() => fetchMaterial(retryCount + 1), 2000)
          return
        }
        setError('Erro de conexão. Por favor, tente novamente mais tarde.')
        setNormasPdf(null)
        setPdfUrl('')
      }
    } finally {
      if (mounted.current) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    mounted.current = true
    fetchMaterial()
    return () => {
      mounted.current = false
    }
  }, [fetchMaterial])

  useRealtime('pdfs', () => {
    fetchMaterial()
  })

  return (
    <Card className="shadow-lg border-primary/10 w-full max-w-4xl mx-auto text-left overflow-hidden">
      <CardHeader className="bg-muted border-b border-primary/10 px-4 sm:px-6 py-4">
        <CardTitle className="font-serif text-xl sm:text-2xl text-primary text-center leading-tight">
          Resumo das Normas de Vendas 2026
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-4 sm:p-6 pt-4 sm:pt-6 space-y-4 sm:space-y-6 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-muted-foreground animate-pulse">
              Carregando normas...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4 text-red-500">
            <AlertCircle className="w-10 h-10 mb-2 opacity-80" />
            <p className="text-center font-medium">{error}</p>
            <Button
              variant="outline"
              onClick={() => fetchMaterial(0)}
              className="mt-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              Tentar novamente
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
              {normas.map((n, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-background rounded-xl border border-muted p-3 sm:p-4 shadow-sm"
                >
                  <div className="text-terracotta text-lg sm:text-xl font-bold mt-[-2px]">
                    ❖
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base font-medium leading-relaxed">
                    {n}
                  </p>
                </div>
              ))}
            </div>

            {pdfUrl ? (
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-muted flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <Button
                  onClick={() => setIsViewerOpen(true)}
                  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <BookOpen className="w-5 h-5 sm:w-4 sm:h-4 mr-2" /> Ver em
                  forma de livro
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="flex items-center justify-center"
                  >
                    <Download className="w-5 h-5 sm:w-4 sm:h-4 mr-2" /> Baixar
                    Normas de Vendas
                  </a>
                </Button>
              </div>
            ) : (
              <div className="mt-8 pt-8 border-t border-muted text-center text-muted-foreground">
                <p>Documento de normas não disponível no momento.</p>
              </div>
            )}
          </>
        )}
      </CardContent>
      {normasPdf && (
        <BookViewModal
          isOpen={isViewerOpen}
          onClose={() => setIsViewerOpen(false)}
          pdfRecord={normasPdf}
        />
      )}
    </Card>
  )
}
