import { useState, useEffect } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Loader2,
} from 'lucide-react'
import { getPdfUrl, type PdfRecord } from '@/services/pdfs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { usePdfBlob } from '@/hooks/use-pdf-blob'

interface BookViewModalProps {
  isOpen: boolean
  onClose: () => void
  pdfRecord: PdfRecord
}

export function BookViewModal({
  isOpen,
  onClose,
  pdfRecord,
}: BookViewModalProps) {
  const [page, setPage] = useState(1)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)

  const pdfUrl = getPdfUrl(pdfRecord)
  const {
    pdfBlobUrl,
    loading: pdfLoading,
    error: pdfError,
  } = usePdfBlob(isOpen ? pdfUrl : '')

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setPage(1)
      setZoom(1)
      setAnimating(false)
    }
  }, [isOpen])

  const turnPage = (dir: 'next' | 'prev') => {
    if (animating) return
    if (dir === 'prev' && page <= 1) return

    setDirection(dir)
    setAnimating(true)

    setTimeout(() => {
      const step = isMobile ? 1 : 2
      setPage((p) => (dir === 'next' ? p + step : Math.max(1, p - step)))
      setAnimating(false)
    }, 300)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return
    const touchEnd = e.changedTouches[0].clientX
    const diff = touchStart - touchEnd

    if (diff > 50) {
      turnPage('next')
    } else if (diff < -50) {
      turnPage('prev')
    }
    setTouchStart(null)
  }

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5))
  const handleZoomReset = () => setZoom(1)

  let leftPage = 0
  let rightPage = 0
  if (isMobile) {
    leftPage = page
    rightPage = 0
  } else {
    leftPage = page
    rightPage = page + 1
  }

  const iframeParams = '#toolbar=0&navpanes=0&scrollbar=0&view=Fit'

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#163029]/95 backdrop-blur-sm animate-in fade-in-0 duration-200" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col animate-in zoom-in-95 duration-200"
          aria-describedby="book-view-desc"
        >
          <div className="flex items-center justify-between p-4 bg-transparent text-white gap-2 sm:gap-4 shrink-0 z-20 shadow-sm bg-gradient-to-b from-[#163029]/80 to-transparent">
            <VisuallyHidden id="book-view-desc">
              <DialogPrimitive.Description>
                Visualização do documento em formato de livro digital com
                paginação interativa.
              </DialogPrimitive.Description>
            </VisuallyHidden>
            <VisuallyHidden>
              <DialogPrimitive.Title>
                {pdfRecord.titulo} - Modo Livro
              </DialogPrimitive.Title>
            </VisuallyHidden>
            <h2
              aria-hidden="true"
              className="font-serif text-base sm:text-lg md:text-xl font-bold drop-shadow-md leading-tight flex-1 line-clamp-1"
            >
              {pdfRecord.titulo}
            </h2>
            <div className="flex items-center gap-1 sm:gap-2 shrink-0 bg-black/30 rounded-lg p-1 backdrop-blur-md border border-white/10">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className="text-white hover:bg-white/20 h-11 w-11 sm:h-10 sm:w-10"
                title="Reduzir Zoom"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomReset}
                className="text-white hover:bg-white/20 h-11 w-11 sm:h-10 sm:w-10"
                title="Resetar Zoom"
              >
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className="text-white hover:bg-white/20 h-11 w-11 sm:h-10 sm:w-10"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  className="text-white hover:bg-white/20 px-3 sm:px-4 h-11 sm:h-10 bg-black/20 backdrop-blur-md border border-white/10"
                >
                  <span className="hidden sm:inline">Fechar</span>
                  <X className="w-6 h-6 sm:ml-2" />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            className={cn(
              'flex-1 relative w-full z-0 overflow-auto flex scroll-smooth',
              zoom === 1 ? 'touch-none' : '',
            )}
            onTouchStart={zoom === 1 ? handleTouchStart : undefined}
            onTouchEnd={zoom === 1 ? handleTouchEnd : undefined}
          >
            {pdfLoading ? (
              <div className="m-auto flex flex-col items-center justify-center text-white/80 gap-4">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className="font-medium animate-pulse">
                  Carregando livro interativo...
                </p>
              </div>
            ) : pdfError ? (
              <div className="m-auto flex flex-col items-center justify-center text-red-400 gap-4">
                <p className="font-medium">
                  Erro ao carregar o documento seguro.
                </p>
              </div>
            ) : (
              <div className="absolute inset-0 overflow-auto flex p-0 sm:p-8 w-full max-w-full touch-pan-x touch-pan-y">
                <div
                  className="m-auto flex items-center justify-center transition-all duration-300 ease-in-out w-full"
                  style={{
                    width: isMobile
                      ? zoom > 1
                        ? `calc(100% * ${zoom})`
                        : '100%'
                      : `calc(100% * ${zoom})`,
                    height: isMobile
                      ? zoom > 1
                        ? `calc(100% * ${zoom})`
                        : '100%'
                      : `calc(100% * ${zoom})`,
                    minWidth: isMobile ? '100%' : `calc(100% * ${zoom})`,
                    maxWidth: zoom > 1 ? 'none' : '100%',
                  }}
                >
                  <div
                    className="relative flex shadow-2xl bg-white rounded-lg mx-auto"
                    style={{
                      width: isMobile ? '100%' : '10000px',
                      maxWidth: zoom > 1 ? 'none' : '100%',
                      maxHeight: zoom > 1 ? 'none' : '100%',
                      aspectRatio: isMobile ? '1 / 1.414' : '2 / 1.414',
                    }}
                  >
                    {!isMobile && (
                      <div className="flex-1 relative overflow-hidden border-r border-gray-300/50 rounded-l-lg bg-white">
                        <iframe
                          key={`left-${leftPage}`}
                          src={`${pdfBlobUrl}${iframeParams}&page=${leftPage}`}
                          className={cn(
                            'absolute inset-0 w-full h-full border-0 pointer-events-none transition-opacity duration-300',
                            animating ? 'opacity-0' : 'opacity-100',
                          )}
                          title="Página Esquerda"
                        />
                      </div>
                    )}

                    <div
                      className={cn(
                        'flex-1 relative overflow-hidden bg-white',
                        isMobile ? 'rounded-lg' : 'rounded-r-lg',
                      )}
                    >
                      {rightPage > 0 || isMobile ? (
                        <iframe
                          key={`right-${isMobile ? leftPage : rightPage}`}
                          src={`${pdfBlobUrl}${iframeParams}&page=${isMobile ? leftPage : rightPage}`}
                          className={cn(
                            'absolute inset-0 w-full h-full border-0 pointer-events-none transition-opacity duration-300',
                            animating ? 'opacity-0' : 'opacity-100',
                          )}
                          title="Página Direita"
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!isMobile && !pdfLoading && !pdfError && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => turnPage('prev')}
                  disabled={page <= 1}
                  className="fixed left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border-white/20 text-white backdrop-blur-md disabled:opacity-30 disabled:hover:bg-black/40 z-20 shadow-lg"
                  title="Anterior"
                >
                  <ChevronLeft className="w-8 h-8" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => turnPage('next')}
                  className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 border-white/20 text-white backdrop-blur-md z-20 shadow-lg"
                  title="Próximo"
                >
                  <ChevronRight className="w-8 h-8" />
                </Button>
              </>
            )}
          </div>

          {isMobile && !pdfLoading && !pdfError && (
            <div className="flex items-center justify-between w-full max-w-[280px] mx-auto mb-4 gap-4 z-20 shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={() => turnPage('prev')}
                disabled={page <= 1}
                className="w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 border-white/30 text-white backdrop-blur-md disabled:opacity-30 disabled:hover:bg-black/60 shrink-0 shadow-lg"
                title="Anterior"
              >
                <ChevronLeft className="w-8 h-8" />
              </Button>
              <span className="text-white font-medium bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg text-sm">
                Pág {page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => turnPage('next')}
                className="w-14 h-14 rounded-full bg-black/60 hover:bg-black/80 border-white/30 text-white backdrop-blur-md shrink-0 shadow-lg"
                title="Próximo"
              >
                <ChevronRight className="w-8 h-8" />
              </Button>
            </div>
          )}

          <div className="p-2 sm:p-4 text-center text-white/80 text-xs sm:text-sm flex justify-center items-center gap-4 shrink-0 z-10 bg-gradient-to-t from-[#163029]/80 to-transparent">
            <span>Use os botões laterais ou arraste para virar as páginas</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
