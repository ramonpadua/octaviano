import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react'

interface PdfViewerContextType {
  isPdfViewerActive: boolean
  setIsPdfViewerActive: (active: boolean) => void
}

const PdfViewerContext = createContext<PdfViewerContextType | undefined>(
  undefined,
)

export function PdfViewerProvider({ children }: { children: ReactNode }) {
  const [isPdfViewerActive, setIsPdfViewerActive] = useState(false)

  useEffect(() => {
    if (isPdfViewerActive) {
      document.body.classList.add('pdf-viewer-active')
    } else {
      document.body.classList.remove('pdf-viewer-active')
    }
  }, [isPdfViewerActive])

  return (
    <PdfViewerContext.Provider
      value={{ isPdfViewerActive, setIsPdfViewerActive }}
    >
      {children}
    </PdfViewerContext.Provider>
  )
}

export function usePdfViewer() {
  const context = useContext(PdfViewerContext)
  if (context === undefined) {
    throw new Error('usePdfViewer must be used within a PdfViewerProvider')
  }
  return context
}
