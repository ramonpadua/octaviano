import { type PdfRecord } from '@/services/pdfs'
import { useCatalogData } from '@/hooks/use-catalog-data'
import { PdfViewerLayout } from '@/components/pdf/PdfViewerLayout'

export default function CatalogoPage() {
  const { catalogs, catalog, setCatalog, loading, error } = useCatalogData()

  const handleSelectCatalog = (c: PdfRecord) => {
    setCatalog(c)
  }

  return (
    <PdfViewerLayout
      title="Catálogo de Produtos Avatim"
      description="Conheça todos os nossos catálogos e materiais exclusivos"
      bgImageUrl="https://img.usecurling.com/p/1920/1080?q=cosmetics%20perfume"
      documents={catalogs}
      activeDocument={catalog}
      onSelectDocument={handleSelectCatalog}
      loading={loading}
      error={error ? true : false}
      emptyMessage="Nenhum catálogo disponível no momento"
      tipo="catalogo"
      showUpload={false}
    />
  )
}
