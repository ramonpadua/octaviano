import { useState, useEffect } from 'react'
import { getPdfsByType, type PdfRecord } from '@/services/pdfs'

export function useCatalogData() {
  const [catalogs, setCatalogs] = useState<PdfRecord[]>([])
  const [catalog, setCatalog] = useState<PdfRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let mounted = true
    const controller = new AbortController()

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(false)

        const pdts = await getPdfsByType('catalogo', {
          signal: controller.signal,
        })

        if (!mounted) return

        setCatalogs(pdts || [])

        const currentCatalog =
          (pdts || []).find((p) => p.titulo.includes('2026.2')) ||
          (pdts || []).find((p) => p.titulo.includes('2026')) ||
          (pdts && pdts.length > 0 ? pdts[0] : null)

        setCatalog(currentCatalog || null)
      } catch (err) {
        console.error('Error fetching catalog data:', err)
        if (mounted) {
          setError(true)
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }

    fetchData()

    return () => {
      mounted = false
      controller.abort()
    }
  }, [])

  return { catalogs, catalog, setCatalog, loading, error }
}
