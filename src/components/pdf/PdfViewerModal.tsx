import { useState, useMemo, useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Search,
  Download,
  Menu,
} from 'lucide-react'
import { getPdfUrl, type PdfRecord } from '@/services/pdfs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'
import { Link } from 'react-router-dom'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { usePdfBlob } from '@/hooks/use-pdf-blob'

interface PdfViewerModalProps {
  isOpen: boolean
  onClose: () => void
  pdfRecord: PdfRecord
}

export function PdfViewerModal({
  isOpen,
  onClose,
  pdfRecord,
}: PdfViewerModalProps) {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const pdfUrl = getPdfUrl(pdfRecord)
  const {
    pdfBlobUrl,
    loading: pdfLoading,
    error: pdfError,
  } = usePdfBlob(isOpen ? pdfUrl : '')
  const iframeSrc = pdfBlobUrl
    ? `${pdfBlobUrl}#page=${page}&toolbar=0&navpanes=0&scrollbar=0${zoom === 100 ? '&view=Fit' : `&zoom=${zoom}`}`
    : ''

  useEffect(() => {
    if (isOpen) {
      setPage(1)
      setZoom(100)
      setSearchQuery('')
    }
  }, [isOpen])

  const indexItems = Array.isArray(pdfRecord.indice_json)
    ? pdfRecord.indice_json
    : []

  const filteredIndex = useMemo(() => {
    if (!searchQuery) return indexItems
    const lowerQ = searchQuery.toLowerCase()
    return indexItems.filter((item) =>
      item.titulo.toLowerCase().includes(lowerQ),
    )
  }, [indexItems, searchQuery])

  const handleZoomIn = () => setZoom((z) => Math.min(z + 20, 200))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 20, 80))
  const handlePrevPage = () => setPage((p) => Math.max(p - 1, 1))
  const handleNextPage = () => setPage((p) => p + 1)

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPage(parseInt(e.target.value) || 1)
  }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#163029]/90 backdrop-blur-sm animate-in fade-in-0 duration-200" />
        <DialogPrimitive.Content className="fixed inset-4 md:inset-10 z-50 flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header Controls */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50 shrink-0">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-[#163029] hidden md:flex"
                title="Alternar Índice"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <VisuallyHidden>
                <DialogPrimitive.Title>
                  {pdfRecord.titulo}
                </DialogPrimitive.Title>
                <DialogPrimitive.Description>
                  Visualização detalhada do documento PDF com opções de zoom,
                  busca e navegação.
                </DialogPrimitive.Description>
              </VisuallyHidden>
              <h2
                aria-hidden="true"
                className="font-serif font-bold text-lg text-[#163029] hidden sm:block"
              >
                {pdfRecord.titulo}
              </h2>{' '}
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <div className="flex items-center gap-1 bg-white border rounded-lg px-2 py-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomOut}
                  disabled={zoom <= 80}
                  className="h-8 w-8 text-[#5f4b3c]"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium w-12 text-center text-[#5f4b3c]">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleZoomIn}
                  disabled={zoom >= 200}
                  className="h-8 w-8 text-[#5f4b3c]"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 bg-white border rounded-lg px-2 py-1 shadow-sm">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="h-8 w-8 text-[#5f4b3c]"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#5f4b3c] hidden sm:inline">
                    Pág.
                  </span>
                  <input
                    type="number"
                    value={page}
                    onChange={(e) => setPage(parseInt(e.target.value) || 1)}
                    className="w-12 text-center border rounded h-7 text-sm focus:ring-1 focus:ring-[#c97d31] outline-none"
                    min={1}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleNextPage}
                  className="h-8 w-8 text-[#5f4b3c]"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"
              >
                <X className="w-6 h-6" />
              </Button>
            </DialogPrimitive.Close>
          </div>

          {/* Main Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar Index */}
            {isSidebarOpen && (
              <div className="hidden md:flex w-72 bg-gray-50 border-r flex-col shrink-0">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Buscar no índice..."
                      className="pl-9 h-9 text-sm bg-white border-gray-200 focus-visible:ring-[#c97d31]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {filteredIndex.length > 0 ? (
                    filteredIndex.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPage(item.pagina)}
                        className={cn(
                          'w-full text-left px-3 py-2 text-sm rounded-md transition-colors flex justify-between items-center group',
                          page === item.pagina
                            ? 'bg-[#163029]/10 text-[#163029] font-semibold'
                            : 'text-[#5f4b3c] hover:bg-gray-200',
                        )}
                      >
                        <span className="truncate pr-2">{item.titulo}</span>
                        <span
                          className={cn(
                            'text-xs opacity-60',
                            page === item.pagina
                              ? 'opacity-100 font-bold'
                              : 'group-hover:opacity-100',
                          )}
                        >
                          {item.pagina}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-8 text-sm text-gray-500">
                      Nenhum item encontrado
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* PDF Viewer Content */}
            <div className="flex-1 bg-[#d1ccbd]/30 relative overflow-auto w-full flex flex-col touch-pan-x touch-pan-y">
              {pdfLoading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#163029]"></div>
                    <p className="text-[#5f4b3c] font-medium animate-pulse">
                      Carregando PDF seguro...
                    </p>
                  </div>
                </div>
              ) : pdfError ? (
                <div className="flex-1 flex flex-col items-center justify-center gap-4 text-red-600">
                  <p className="font-medium">
                    Erro ao carregar documento seguro.
                  </p>
                </div>
              ) : iframeSrc ? (
                <div
                  className="w-full h-full min-w-full overflow-auto touch-pan-x touch-pan-y"
                  style={{
                    width: zoom > 100 ? `${zoom}%` : '100%',
                    height: zoom > 100 ? `${zoom}%` : '100%',
                    maxWidth: zoom > 100 ? 'none' : '100%',
                  }}
                >
                  <iframe
                    src={iframeSrc.replace('view=Fit', 'view=FitH')}
                    className="w-full h-full min-w-full flex-1 border-0"
                    title={`Catálogo ${pdfRecord.titulo}`}
                    style={{ objectFit: 'contain', maxWidth: '100%' }}
                  />
                </div>
              ) : null}

              {/* Slider for quick nav */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-64 md:w-80 bg-white/95 backdrop-blur rounded-full px-4 py-2.5 shadow-xl border border-gray-100 flex items-center gap-3">
                <span className="text-xs font-bold text-[#5f4b3c]">1</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={page}
                  onChange={handleSliderChange}
                  className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#163029]"
                />
                <span className="text-xs font-bold text-[#5f4b3c]">...</span>
              </div>
            </div>
          </div>

          {/* Footer - Reading Mode adjustments */}
          <div className="px-4 py-4 sm:p-6 border-t bg-white flex flex-col md:flex-row items-center justify-between gap-4 shrink-0 max-w-full w-full">
            <div className="flex-1 text-sm sm:text-base text-[#5f4b3c] w-full max-w-full md:max-w-3xl">
              {pdfRecord.resumo && (
                <div className="flex flex-col sm:flex-row items-start gap-2 sm:gap-3 bg-gray-50 p-3 sm:p-4 rounded-xl border border-gray-100">
                  <div className="bg-[#c97d31]/10 text-[#c97d31] px-2.5 py-1 rounded text-xs font-bold uppercase shrink-0 mt-0.5 mb-1 sm:mb-0">
                    Resumo AI
                  </div>
                  <p className="leading-relaxed hover:line-clamp-none transition-all cursor-default text-sm sm:text-base">
                    {pdfRecord.resumo}
                  </p>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
              <Button
                asChild
                variant="outline"
                className="border-[#163029] text-[#163029] hover:bg-[#163029]/5"
              >
                <a href={pdfUrl} download target="_blank" rel="noreferrer">
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PDF
                </a>
              </Button>
              <DialogPrimitive.Close asChild>
                <Button className="bg-[#163029] hover:bg-[#163029]/90 text-white">
                  Fechar
                </Button>
              </DialogPrimitive.Close>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
