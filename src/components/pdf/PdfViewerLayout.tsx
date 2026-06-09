import { useState, useRef, useEffect } from 'react'
import { getPdfUrl, type PdfRecord } from '@/services/pdfs'
import { usePdfBlob } from '@/hooks/use-pdf-blob'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Download, FileText, Plus } from 'lucide-react'
import { BookViewModal } from '@/components/pdf/BookViewModal'
import logoSensatio from '@/assets/logomarca-sensatio-3d-sem-fundo-branco-a9ada.png'
import { PdfUploadDialog } from '@/components/admin/PdfUploadDialog'
import { useAuth } from '@/hooks/use-auth'

interface PdfViewerLayoutProps {
  title: string
  description: string
  bgImageUrl: string
  documents: PdfRecord[]
  activeDocument: PdfRecord | null
  onSelectDocument: (doc: PdfRecord) => void
  loading: boolean
  error: boolean
  emptyMessage: string
  tipo: string
  showUpload?: boolean
}

export function PdfViewerLayout({
  title,
  description,
  bgImageUrl,
  documents,
  activeDocument,
  onSelectDocument,
  loading,
  error,
  emptyMessage,
  tipo,
  showUpload = false,
}: PdfViewerLayoutProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [isBookViewOpen, setIsBookViewOpen] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const { user } = useAuth()

  const pdfUrl = activeDocument ? getPdfUrl(activeDocument) : ''
  const {
    pdfBlobUrl,
    loading: pdfLoading,
    error: pdfBlobError,
  } = usePdfBlob(pdfUrl)

  if (pdfBlobError) {
    throw new Error(
      'Falha ao carregar o arquivo PDF. Verifique sua conexão ou desative bloqueadores de anúncios (adblockers).',
    )
  }

  useEffect(() => {
    setCurrentPage(1)
  }, [activeDocument?.id])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (iframeRef.current && pdfBlobUrl) {
      iframeRef.current.src = `${pdfBlobUrl}#page=${page}&toolbar=0&navpanes=0&scrollbar=0&view=Fit`
    }
  }

  const viewerUrl = pdfBlobUrl
    ? `${pdfBlobUrl}#page=${currentPage}&toolbar=0&navpanes=0&scrollbar=0&view=Fit`
    : ''

  return (
    <div className="flex flex-col flex-1 bg-[#f8f7f5] animate-fade-in-up w-full min-h-screen">
      <section className="relative bg-[#163029] py-16 md:py-24 text-center px-4 flex items-center justify-center shadow-inner overflow-hidden min-h-[300px]">
        {bgImageUrl && (
          <>
            <div
              className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat opacity-40"
              style={{ backgroundImage: `url('${bgImageUrl}')` }}
            />
            <div className="absolute inset-0 z-0 bg-[#163029]/80 mix-blend-multiply" />
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/50 via-transparent to-[#163029]/90" />
          </>
        )}
        <div className="relative z-10 container flex flex-col items-center">
          <img
            src={logoSensatio}
            alt="Sensatio"
            className="h-16 md:h-20 w-auto object-contain mb-8 drop-shadow-md"
          />
          <h1 className="text-3xl md:text-5xl font-serif font-bold text-white max-w-4xl mx-auto drop-shadow-lg leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-[#d1ccbd] text-lg max-w-2xl mx-auto drop-shadow-md">
            {description}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 max-w-7xl">
        {showUpload && user && (
          <div className="flex justify-end mb-6">
            <Button
              onClick={() => setUploadOpen(true)}
              className="bg-[#c97d31] hover:bg-[#c97d31]/90 text-white shadow-md"
            >
              <Plus className="w-4 h-4 mr-2" /> Adicionar PDF
            </Button>
          </div>
        )}

        {loading ? (
          <div className="w-full flex flex-col lg:flex-row gap-8 animate-pulse">
            <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0">
              <div className="h-80 bg-gray-200 rounded-2xl w-full"></div>
            </div>
            <div className="w-full lg:flex-1 bg-gray-200 rounded-2xl h-[600px] lg:h-[800px]"></div>
          </div>
        ) : activeDocument ? (
          <div className="w-full flex flex-col lg:flex-row gap-8 items-stretch">
            {/* Left Panel - Info Card */}
            <div className="w-full lg:w-[380px] flex flex-col gap-6 shrink-0">
              <Card className="shadow-lg border-0 bg-[#f4f2eb] overflow-hidden rounded-2xl">
                <CardHeader className="pb-4">
                  <div className="text-xs font-bold text-[#c97d31] tracking-widest uppercase mb-3 flex items-center gap-2">
                    <span className="w-4 h-px bg-[#c97d31]"></span>
                    {activeDocument.categoria || 'DOCUMENTO GERAL'}
                  </div>
                  <CardTitle className="text-2xl font-serif text-[#163029] leading-tight">
                    {activeDocument.titulo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-[#5f4b3c] text-sm leading-relaxed mb-8">
                    {activeDocument.resumo ||
                      activeDocument.descricao ||
                      'Documento disponível para visualização e download.'}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => setIsBookViewOpen(true)}
                      className="w-full bg-[#c97d31] hover:bg-[#b06d2a] text-white h-12 text-base font-medium rounded-xl shadow-md transition-all"
                    >
                      <BookOpen className="w-5 h-5 mr-2" />
                      Ver como Livro
                    </Button>
                    {pdfUrl && (
                      <Button
                        className="w-full bg-[#163029] hover:bg-[#0f221d] text-white h-12 text-base font-medium rounded-xl shadow-md transition-all"
                        asChild
                      >
                        <a
                          href={pdfUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                        >
                          <Download className="w-5 h-5 mr-2" />
                          Baixar Catálogo PDF
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {activeDocument.indice_json &&
                Array.isArray(activeDocument.indice_json) &&
                activeDocument.indice_json.length > 0 && (
                  <Card className="shadow-lg border-0 bg-white rounded-2xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-serif text-[#163029] flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#c97d31]" />
                        Índice Interativo
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col space-y-1 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {activeDocument.indice_json.map(
                          (item: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => handlePageChange(item.pagina || 1)}
                              className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f4f2eb] transition-colors text-left group"
                            >
                              <span className="font-medium text-[#5f4b3c] text-sm group-hover:text-[#163029] transition-colors line-clamp-1">
                                {item.titulo}
                              </span>
                              <span className="text-xs font-semibold text-[#c97d31] bg-[#c97d31]/10 px-2 py-1 rounded-full shrink-0">
                                Pág {item.pagina}
                              </span>
                            </button>
                          ),
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
            </div>

            {/* Right Panel - Reader */}
            <div className="w-full lg:flex-1 flex flex-col h-[80vh] min-h-[400px] lg:h-auto lg:min-h-[700px] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#163029]/10">
              <div className="bg-[#163029] text-white px-4 py-3 flex justify-between items-center text-sm">
                <span className="font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#c97d31]" />
                  Leitor Digital Avatim
                </span>
                <span className="text-white/80 font-medium">
                  Página {currentPage}
                </span>
              </div>
              <div className="flex-1 w-full relative bg-[#f0f0f0] overflow-auto flex items-center justify-center">
                {pdfLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center text-[#5f4b3c]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#163029]"></div>
                      <p className="font-medium animate-pulse">
                        Carregando PDF seguro...
                      </p>
                    </div>
                  </div>
                ) : viewerUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={viewerUrl.replace('view=Fit', 'view=FitH')}
                    className="w-full h-full min-w-full border-0 m-0 p-0 block touch-pan-y touch-pan-x"
                    title="Leitor PDF"
                    style={{
                      backgroundColor: 'transparent',
                      minHeight: '100%',
                      maxWidth: '100%',
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-[#5f4b3c]">
                    Nenhum arquivo disponível para visualizar.
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-32 text-[#5f4b3c] bg-white rounded-2xl shadow-sm w-full border border-dashed border-[#d1ccbd]">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#d1ccbd]" />
            <h3 className="text-2xl font-serif text-[#163029] mb-2">
              {error ? 'Erro ao carregar' : emptyMessage}
            </h3>
            {error && (
              <Button
                onClick={() => window.location.reload()}
                className="mt-6 bg-[#163029] hover:bg-[#163029]/90 text-white"
              >
                Tentar Novamente
              </Button>
            )}
          </div>
        )}
      </section>

      {!loading && documents.length > 1 && (
        <section className="container mx-auto px-4 py-16 max-w-7xl border-t border-[#163029]/10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-serif font-bold text-[#163029] flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#c97d31]" />
              Outros Documentos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents
              .filter((d) => d.id !== activeDocument?.id)
              .map((c) => (
                <Card
                  key={c.id}
                  className="flex flex-col overflow-hidden border border-[#163029]/10 transition-all duration-300 hover:shadow-xl hover:border-[#c97d31]/50 bg-white rounded-2xl group cursor-pointer"
                  onClick={() => {
                    onSelectDocument(c)
                    window.scrollTo({ top: 300, behavior: 'smooth' })
                  }}
                >
                  <div className="relative w-full aspect-[1/1.414] bg-gray-50 flex items-center justify-center overflow-hidden border-b border-[#163029]/5">
                    {getPdfUrl(c) ? (
                      <>
                        <iframe
                          src={`${getPdfUrl(c)}#page=1&toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                          className="absolute inset-0 w-full h-full border-0 pointer-events-none"
                          tabIndex={-1}
                          title={c.titulo}
                        />
                        <div className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/5 transition-colors" />
                      </>
                    ) : (
                      <FileText className="h-16 w-16 text-[#c97d31]/30 group-hover:scale-110 transition-transform" />
                    )}
                    <div className="absolute top-3 left-3 bg-[#163029] text-white text-xs px-2 py-1 rounded-md font-medium z-20 shadow-sm">
                      {c.categoria || 'Documento'}
                    </div>
                  </div>
                  <CardHeader className="bg-white pb-2 pt-5">
                    <CardTitle className="text-lg font-serif text-[#163029] leading-tight line-clamp-2">
                      {c.titulo}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pt-0 pb-5">
                    <p className="text-[#5f4b3c] text-sm line-clamp-2">
                      {c.descricao || 'Nenhuma descrição disponível.'}
                    </p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </section>
      )}

      {activeDocument && (
        <BookViewModal
          isOpen={isBookViewOpen}
          onClose={() => setIsBookViewOpen(false)}
          pdfRecord={activeDocument}
        />
      )}

      {showUpload && (
        <PdfUploadDialog
          isOpen={uploadOpen}
          onClose={() => setUploadOpen(false)}
          fixedTipo={tipo as any}
        />
      )}
    </div>
  )
}
