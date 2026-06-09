import { useState, useEffect, useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Maximize,
  X,
  Download,
  FileText,
} from 'lucide-react'
import { PdfRecord, getPdfUrl } from '@/services/pdfs'
import { toast } from 'sonner'
import { VisuallyHidden } from '@/components/ui/visually-hidden'
import { usePdfBlob } from '@/hooks/use-pdf-blob'

interface PdfViewerModalProps {
  pdf: PdfRecord | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PdfViewerModal({
  pdf,
  open,
  onOpenChange,
}: PdfViewerModalProps) {
  const [page, setPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const viewerRef = useRef<HTMLDivElement>(null)

  const [downloadCount, setDownloadCount] = useState(0)
  const [downloadTimer, setDownloadTimer] = useState<NodeJS.Timeout | null>(
    null,
  )

  useEffect(() => {
    if (open) {
      setPage(1)
      setZoom(100)
      setSearch('')
      setLoading(true)
      setError(false)
    }
  }, [open, pdf])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const pdfUrl = pdf ? getPdfUrl(pdf) : ''
  const {
    pdfBlobUrl,
    loading: pdfBlobLoading,
    error: pdfBlobError,
  } = usePdfBlob(open ? pdfUrl : '')

  const indexJson = pdf?.indice_json || []
  const filteredIndex = indexJson.filter((item) =>
    item.titulo.toLowerCase().includes(debouncedSearch.toLowerCase()),
  )

  const totalPages =
    indexJson.length > 0
      ? Math.max(...indexJson.map((i) => i.pagina)) + 10
      : 100

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      viewerRef.current?.requestFullscreen().catch(() => {
        toast.error('Erro ao entrar em tela cheia.')
      })
    } else {
      document.exitFullscreen()
    }
  }

  const handleDownload = () => {
    if (downloadCount >= 10) {
      toast.error('Limite de downloads atingido. Aguarde um minuto.')
      return
    }
    setDownloadCount((c) => c + 1)
    if (!downloadTimer) {
      const timer = setTimeout(() => {
        setDownloadCount(0)
        setDownloadTimer(null)
      }, 60000)
      setDownloadTimer(timer)
    }

    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    } else {
      toast.info('Arquivo não disponível neste registro de demonstração.')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] w-full h-[98vh] p-0 gap-0 overflow-hidden flex flex-col bg-background rounded-xl">
        <div className="h-14 flex items-center justify-between px-4 border-b bg-verde text-white shrink-0">
          <VisuallyHidden>
            <DialogTitle>{pdf?.titulo || 'Visualizador'}</DialogTitle>
            <DialogDescription>
              Visualizador de documento PDF e seu resumo gerado por IA.
            </DialogDescription>
          </VisuallyHidden>
          <div
            aria-hidden="true"
            className="flex items-center gap-3 overflow-hidden"
          >
            <FileText className="h-5 w-5 shrink-0" />
            <span className="font-serif text-lg font-bold truncate">
              {pdf?.titulo || 'Visualizador'}
            </span>
          </div>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 shrink-0"
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogClose>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Sidebar */}
          <div className="w-full lg:w-[30%] flex flex-col border-b lg:border-b-0 lg:border-r h-[40%] lg:h-full bg-light shrink-0">
            <Tabs
              defaultValue="indice"
              className="flex-1 flex flex-col h-full overflow-hidden"
            >
              <div className="p-2 sm:p-3 bg-white border-b shrink-0">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="indice" className="text-xs sm:text-sm">
                    Índice
                  </TabsTrigger>
                  <TabsTrigger value="resumo" className="text-xs sm:text-sm">
                    Resumo AI
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent
                value="indice"
                className="flex-1 flex flex-col m-0 p-0 overflow-hidden data-[state=active]:flex"
              >
                <div className="p-3 border-b bg-white shrink-0">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar seção..."
                      className="pl-9 bg-light border-none h-9 text-sm"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                </div>
                <ScrollArea className="flex-1">
                  <div className="p-2 space-y-1">
                    {filteredIndex.length > 0 ? (
                      filteredIndex.map((item, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(item.pagina)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors ${page === item.pagina ? 'bg-verde text-white' : 'hover:bg-black/5 text-verde'}`}
                        >
                          <span className="font-medium text-left truncate pr-2">
                            {item.titulo}
                          </span>
                          <span className="text-xs opacity-70 shrink-0">
                            Pág. {item.pagina}
                          </span>
                        </button>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-muted-foreground">
                        Nenhuma seção encontrada.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="resumo"
                className="flex-1 m-0 p-6 overflow-y-auto bg-white data-[state=active]:block"
              >
                <div className="prose prose-sm max-w-none">
                  <h4 className="text-verde font-bold text-lg mb-3">
                    Resumo do Documento
                  </h4>
                  <p className="text-metallic leading-relaxed">
                    {pdf?.resumo || 'Nenhum resumo disponível.'}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Viewer */}
          <div
            className="w-full lg:w-[70%] flex-1 flex flex-col bg-gray-100/50 relative overflow-hidden"
            ref={viewerRef}
          >
            {/* Controls */}
            <div className="h-14 bg-white border-b flex items-center justify-between px-2 sm:px-4 shadow-sm z-10 shrink-0">
              <div className="flex items-center gap-1 sm:gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs font-medium w-16 sm:w-24 text-center truncate">
                  Pág {page}{' '}
                  <span className="hidden sm:inline">de {totalPages}</span>
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="hidden md:flex items-center gap-3 flex-1 max-w-[250px] mx-4">
                <Slider
                  value={[page]}
                  min={1}
                  max={totalPages}
                  step={1}
                  onValueChange={(val) => setPage(val[0])}
                  className="flex-1"
                />
              </div>

              <div className="flex items-center gap-1">
                <div className="hidden sm:flex items-center bg-light rounded-md p-0.5 mr-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setZoom((z) => Math.max(80, z - 20))}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-xs font-medium w-12 text-center">
                    {zoom}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => setZoom((z) => Math.min(200, z + 20))}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={toggleFullscreen}
                  title="Tela Cheia"
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* PDF Area */}
            <div className="flex-1 relative overflow-auto bg-gray-200 w-full touch-pan-x touch-pan-y">
              {(loading || pdfBlobLoading) && pdfUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verde"></div>
                    <p className="text-sm text-metallic">
                      Carregando documento seguro...
                    </p>
                  </div>
                </div>
              )}
              {error || pdfBlobError ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-4">
                  <p className="text-red-500 font-medium">
                    Erro ao carregar PDF. Tente novamente.
                  </p>
                  <Button onClick={() => setError(false)}>
                    Tentar Novamente
                  </Button>
                </div>
              ) : pdfBlobUrl ? (
                <div
                  className="w-full h-full min-w-full overflow-auto"
                  style={{
                    width: zoom > 100 ? `${zoom}%` : '100%',
                    height: zoom > 100 ? `${zoom}%` : '100%',
                  }}
                >
                  <iframe
                    src={`${pdfBlobUrl}#page=${page}&toolbar=0&navpanes=0&scrollbar=0${zoom === 100 ? '&view=Fit' : `&view=FitH`}`}
                    className={`w-full h-full min-w-full border-none transition-opacity duration-300 ${loading && !pdfBlobLoading ? 'opacity-0' : 'opacity-100'}`}
                    style={{ objectFit: 'contain' }}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                      setLoading(false)
                      setError(true)
                    }}
                    title={pdf?.titulo || 'Documento PDF'}
                  />
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
                  <div className="max-w-md w-full bg-white p-6 sm:p-8 rounded-xl shadow-sm border text-center">
                    <div className="mx-auto w-16 h-16 bg-light rounded-full flex items-center justify-center mb-4 text-metallic">
                      <FileText className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-verde mb-2">
                      Modo de Demonstração
                    </h3>
                    <p className="text-sm text-metallic mb-6">
                      Este é um registro de demonstração sem arquivo anexado.
                      Navegue pelo índice e veja o resumo da IA na barra
                      lateral. Página atual:{' '}
                      <strong className="text-verde">{page}</strong>
                    </p>
                    <div className="aspect-[1/1.4] w-full max-w-[250px] mx-auto bg-white border shadow-sm flex flex-col items-center justify-center p-4 relative">
                      <span className="absolute top-2 right-3 text-xs text-muted-foreground">
                        {page}
                      </span>
                      <img
                        src={`https://img.usecurling.com/p/400/560?q=document&color=gray&seed=${page}`}
                        alt={`Página ${page}`}
                        className="w-full h-full object-cover opacity-30 mix-blend-multiply"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center gap-2">
                        <div className="w-full h-2 bg-gray-200 rounded"></div>
                        <div className="w-3/4 h-2 bg-gray-200 rounded"></div>
                        <div className="w-full h-2 bg-gray-200 rounded mt-4"></div>
                        <div className="w-full h-2 bg-gray-200 rounded"></div>
                        <div className="w-2/3 h-2 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-16 border-t bg-white flex items-center justify-between px-4 shrink-0">
          <p className="text-xs text-metallic hidden sm:block truncate max-w-[40%] xl:max-w-xl">
            <strong className="text-verde">Resumo:</strong> {pdf?.resumo}
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            <Button
              className="bg-verde hover:bg-verde/90 text-white"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" /> Baixar PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
