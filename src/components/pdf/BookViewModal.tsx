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
import { FileText } from 'lucide-react'
import { PdfCanvasViewer } from '@/components/pdf/PdfCanvasViewer'
import { useDeviceOrientation } from '@/hooks/use-device-orientation'
import { usePdfViewer } from '@/contexts/PdfViewerContext'

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
  const [totalPages, setTotalPages] = useState(100)
  const [animating, setAnimating] = useState(false)
  const [direction, setDirection] = useState<'next' | 'prev'>('next')
  const [isMobile, setIsMobile] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [zoom, setZoom] = useState(1)

  const orientation = useDeviceOrientation()
  const { setIsPdfViewerActive } = usePdfViewer()
  const isFullscreen = isMobile && orientation === 'landscape'

  const pdfUrl = getPdfUrl(pdfRecord)
  const {
    pdfBlobUrl,
    loading: pdfLoading,
    error: pdfError,
  } = usePdfBlob(isOpen ? pdfUrl : '')

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)')
    const checkMobile = () => setIsMobile(mql.matches)
    checkMobile()

    mql.addEventListener('change', checkMobile)
    return () => mql.removeEventListener('change', checkMobile)
  }, [])

  useEffect(() => {
    if (isOpen) {
      setPage(1)
      setZoom(1)
      setAnimating(false)
    }
    setIsPdfViewerActive(isOpen)

    return () => setIsPdfViewerActive(false)
  }, [isOpen, setIsPdfViewerActive])

  const turnPage = (dir: 'next' | 'prev') => {
    if (animating) return
    if (dir === 'prev' && page <= 1) return
    if (dir === 'next' && page >= totalPages) return

    setDirection(dir)
    setAnimating(true)

    setTimeout(() => {
      const step = isMobile ? 1 : 2
      setPage((p) => {
        const nextP = dir === 'next' ? p + step : Math.max(1, p - step)
        return Math.min(nextP, totalPages)
      })
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

  let leftPage = page

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      {isOpen && (
        <style>{`
          #skip-badge,
          #goskip-badge,
          .skip-badge,
          [id^="skip-"],
          iframe[src*="goskip.app"] {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
        `}</style>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 backdrop-blur-sm animate-in fade-in-0 duration-200 transition-colors',
            isFullscreen ? 'bg-black' : 'bg-[#163029]/95',
          )}
        />
        <DialogPrimitive.Content
          className={cn(
            'fixed inset-0 z-50 flex flex-col animate-in zoom-in-95 duration-300 transition-all',
            isFullscreen
              ? 'w-screen h-screen bg-black rounded-none shadow-none max-w-none max-h-none'
              : '',
          )}
          aria-describedby="book-view-desc"
        >
          <div
            className={cn(
              'flex items-center justify-between text-white gap-2 sm:gap-4 shrink-0 z-20 shadow-sm transition-all duration-300',
              isFullscreen
                ? 'p-2 bg-black/80 backdrop-blur-md absolute top-0 left-0 right-0'
                : 'p-4 bg-transparent bg-gradient-to-b from-[#163029]/80 to-transparent',
            )}
          >
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
              className={cn(
                'font-serif font-bold drop-shadow-md leading-tight flex-1 line-clamp-1 transition-all',
                isFullscreen
                  ? 'text-sm sm:text-base'
                  : 'text-base sm:text-lg md:text-xl',
              )}
            >
              {pdfRecord.titulo}
            </h2>
            <div
              className={cn(
                'flex items-center shrink-0 bg-black/30 rounded-lg p-1 backdrop-blur-md border border-white/10 transition-all',
                isFullscreen ? 'gap-1 h-8' : 'gap-1 sm:gap-2',
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className={cn(
                  'text-white hover:bg-white/20',
                  isFullscreen ? 'h-6 w-6' : 'h-11 w-11 sm:h-10 sm:w-10',
                )}
                title="Reduzir Zoom"
              >
                <ZoomOut className={cn(isFullscreen ? 'w-3 h-3' : 'w-5 h-5')} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomReset}
                className={cn(
                  'text-white hover:bg-white/20',
                  isFullscreen ? 'h-6 w-6' : 'h-11 w-11 sm:h-10 sm:w-10',
                )}
                title="Resetar Zoom"
              >
                <RotateCcw
                  className={cn(isFullscreen ? 'w-3 h-3' : 'w-5 h-5')}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 3}
                className={cn(
                  'text-white hover:bg-white/20',
                  isFullscreen ? 'h-6 w-6' : 'h-11 w-11 sm:h-10 sm:w-10',
                )}
                title="Aumentar Zoom"
              >
                <ZoomIn className={cn(isFullscreen ? 'w-3 h-3' : 'w-5 h-5')} />
              </Button>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 shrink-0">
              <DialogPrimitive.Close asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    'text-white hover:bg-white/20 bg-black/20 backdrop-blur-md border border-white/10 transition-all',
                    isFullscreen ? 'px-2 h-8' : 'px-3 sm:px-4 h-11 sm:h-10',
                  )}
                >
                  <span
                    className={cn(isFullscreen ? 'hidden' : 'hidden sm:inline')}
                  >
                    Fechar
                  </span>
                  <X
                    className={cn(isFullscreen ? 'w-4 h-4' : 'w-6 h-6 sm:ml-2')}
                  />
                </Button>
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            className={cn(
              'flex-1 relative w-full z-0 overflow-auto flex scroll-smooth transition-all duration-300',
              zoom === 1 ? 'touch-none' : '',
              isFullscreen ? 'bg-black pt-12' : '',
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
                {pdfBlobUrl && (
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
                      className={cn(
                        'relative flex shadow-2xl bg-white rounded-lg mx-auto w-full transition-opacity duration-300',
                        animating ? 'opacity-0' : 'opacity-100',
                      )}
                    >
                      <PdfCanvasViewer
                        url={pdfBlobUrl}
                        page={leftPage}
                        mode={isMobile ? 'single' : 'spread'}
                        onLoad={(num) => setTotalPages(num)}
                      />
                    </div>
                  </div>
                )}
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
            <div
              className={cn(
                'flex items-center justify-between z-20 shrink-0 transition-all duration-300',
                isFullscreen
                  ? 'fixed bottom-2 right-2 gap-2 bg-black/50 p-1.5 rounded-full backdrop-blur-md shadow-lg'
                  : 'w-full max-w-[280px] mx-auto mb-4 gap-4',
              )}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={() => turnPage('prev')}
                disabled={page <= 1}
                className={cn(
                  'rounded-full text-white backdrop-blur-md disabled:opacity-30 shadow-lg shrink-0 transition-all',
                  isFullscreen
                    ? 'w-10 h-10 bg-transparent border-transparent hover:bg-white/20 disabled:hover:bg-transparent'
                    : 'w-14 h-14 bg-black/60 hover:bg-black/80 border-white/30 disabled:hover:bg-black/60',
                )}
                title="Anterior"
              >
                <ChevronLeft
                  className={cn(isFullscreen ? 'w-6 h-6' : 'w-8 h-8')}
                />
              </Button>
              <span
                className={cn(
                  'text-white font-medium transition-all',
                  isFullscreen
                    ? 'text-xs px-2'
                    : 'bg-black/60 px-5 py-2.5 rounded-full backdrop-blur-md shadow-lg text-sm',
                )}
              >
                Pág {page}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => turnPage('next')}
                className={cn(
                  'rounded-full text-white backdrop-blur-md shadow-lg shrink-0 transition-all',
                  isFullscreen
                    ? 'w-10 h-10 bg-transparent border-transparent hover:bg-white/20'
                    : 'w-14 h-14 bg-black/60 hover:bg-black/80 border-white/30',
                )}
                title="Próximo"
              >
                <ChevronRight
                  className={cn(isFullscreen ? 'w-6 h-6' : 'w-8 h-8')}
                />
              </Button>
            </div>
          )}

          <div
            className={cn(
              'text-center text-white/80 text-xs sm:text-sm flex justify-center items-center shrink-0 z-10 transition-all duration-300',
              isFullscreen
                ? 'h-0 opacity-0 overflow-hidden'
                : 'p-2 sm:p-4 gap-4 opacity-100 bg-gradient-to-t from-[#163029]/80 to-transparent',
            )}
          >
            <span>Use os botões laterais ou arraste para virar as páginas</span>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
