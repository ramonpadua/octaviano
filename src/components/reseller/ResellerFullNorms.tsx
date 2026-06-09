import { useState, useEffect, useCallback } from 'react'
import { FileText, BookOpen, Download, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getPdfUrl, type PdfRecord } from '@/services/pdfs'
import { BookViewModal } from '@/components/pdf/BookViewModal'
import { useAuth } from '@/hooks/use-auth'
import { useRealtime } from '@/hooks/use-realtime'
import { PdfUploadDialog } from '@/components/admin/PdfUploadDialog'
import pb from '@/lib/pocketbase/client'
import { ClientResponseError } from 'pocketbase'

export function ResellerFullNorms() {
  const [normaPdf, setNormaPdf] = useState<PdfRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookModalOpen, setIsBookModalOpen] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const { user } = useAuth()

  const fetchNormas = useCallback(async () => {
    try {
      setLoading(true)
      const targetPdf = await pb
        .collection('pdfs')
        .getFirstListItem<PdfRecord>('tipo="normas"', { sort: '-created' })
      setNormaPdf(targetPdf)
    } catch (err) {
      if (err instanceof ClientResponseError && err.status === 404) {
        setNormaPdf(null)
      } else {
        console.error('Failed to fetch normas pdf:', err)
        setNormaPdf(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNormas()
  }, [fetchNormas])

  useRealtime('pdfs', () => {
    fetchNormas()
  })

  if (loading) {
    return (
      <div className="mt-8 mb-12 p-8 bg-white/50 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center gap-4 max-w-4xl mx-auto">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-muted-foreground animate-pulse">
          Carregando documento...
        </p>
      </div>
    )
  }

  const pdfUrl = normaPdf ? getPdfUrl(normaPdf) : ''
  const isMissingFile = !normaPdf || !pdfUrl

  if (isMissingFile) {
    return (
      <div className="mt-8 mb-12 p-8 bg-white/50 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center max-w-4xl mx-auto text-center gap-4">
        <p className="text-muted-foreground text-lg">
          {user
            ? 'Nenhum documento de normas cadastrado ou arquivo ausente.'
            : 'Documento de normas não disponível no momento.'}
        </p>
        {user && (
          <>
            <Button
              onClick={() => setIsUploadOpen(true)}
              className="shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar/Atualizar Normas
            </Button>
            <PdfUploadDialog
              isOpen={isUploadOpen}
              onClose={() => setIsUploadOpen(false)}
              fixedTipo="normas"
            />
          </>
        )}
      </div>
    )
  }

  return (
    <div className="mt-4 mb-8 sm:mt-8 sm:mb-12 p-4 sm:p-8 bg-white rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 text-left">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary flex-shrink-0">
          <FileText className="w-6 h-6 sm:w-8 sm:h-8" />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-primary mb-1 leading-snug">
            {normaPdf?.titulo || 'Normas de Vendas Completas'}
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
            Leia o documento completo com todas as políticas e diretrizes.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto mt-4 sm:mt-0">
        <Button
          onClick={() => setIsBookModalOpen(true)}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
        >
          <BookOpen className="w-5 h-5 sm:w-4 sm:h-4" />
          Ler em forma de livro
        </Button>

        <Button
          variant="outline"
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2 w-full sm:w-auto h-12 sm:h-10 text-base sm:text-sm"
          asChild
        >
          <a
            href={pdfUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <Download className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
            Baixar PDF
          </a>
        </Button>

        {user && (
          <Button
            variant="ghost"
            className="text-muted-foreground hover:text-primary px-3"
            onClick={() => setIsUploadOpen(true)}
            title="Substituir/Atualizar Normas"
          >
            <Plus className="w-5 h-5" />
          </Button>
        )}
      </div>

      {isBookModalOpen && (
        <BookViewModal
          isOpen={isBookModalOpen}
          onClose={() => setIsBookModalOpen(false)}
          pdfRecord={normaPdf}
        />
      )}

      {user && (
        <PdfUploadDialog
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          fixedTipo="normas"
        />
      )}
    </div>
  )
}
