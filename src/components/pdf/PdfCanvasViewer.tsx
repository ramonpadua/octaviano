import { useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@5.4.296/build/pdf.worker.min.mjs`

interface PdfCanvasViewerProps {
  url: string
  page: number
  onPageChange?: (page: number) => void
  onLoad?: (numPages: number) => void
  mode?: 'single' | 'spread'
  className?: string
}

export function PdfCanvasViewer({
  url,
  page,
  onPageChange,
  onLoad,
  mode = 'single',
  className,
}: PdfCanvasViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [containerWidth, setContainerWidth] = useState<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let timeoutId: ReturnType<typeof setTimeout>
    const resizeObserver = new ResizeObserver((entries) => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        for (const entry of entries) {
          setContainerWidth(entry.contentRect.width)
        }
      }, 100)
    })

    resizeObserver.observe(container)
    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      resizeObserver.disconnect()
    }
  }, [])

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
    if (onLoad) onLoad(numPages)
  }

  const pageWidth = mode === 'spread' ? containerWidth / 2 : containerWidth

  return (
    <div
      ref={containerRef}
      className={cn('w-full flex justify-center', className)}
    >
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={
          <div className="flex flex-col items-center justify-center p-8 text-[#5f4b3c]">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#c97d31]" />
            <p>Carregando documento...</p>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center p-8 text-red-500">
            <p>Erro ao carregar o PDF. Tente novamente.</p>
          </div>
        }
      >
        <div
          className={cn(
            'flex justify-center',
            mode === 'spread' ? 'flex-row' : 'flex-col',
          )}
        >
          {containerWidth > 0 && (
            <Page
              pageNumber={page}
              width={pageWidth}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              className="shadow-sm"
            />
          )}
          {mode === 'spread' &&
            numPages !== null &&
            page + 1 <= numPages &&
            containerWidth > 0 && (
              <Page
                pageNumber={page + 1}
                width={pageWidth}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                className="shadow-sm"
              />
            )}
        </div>
      </Document>
    </div>
  )
}
