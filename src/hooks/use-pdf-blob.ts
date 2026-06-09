import { useState, useEffect } from 'react'

export function usePdfBlob(pdfUrl: string) {
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!pdfUrl) {
      setPdfBlobUrl('')
      return
    }

    let mounted = true
    let objectUrl = ''
    const controller = new AbortController()
    setLoading(true)
    setError(false)

    fetch(pdfUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
        return res.blob()
      })
      .then((blob) => {
        if (mounted) {
          objectUrl = URL.createObjectURL(blob)
          setPdfBlobUrl(objectUrl)
          setLoading(false)
        }
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        console.error('Error fetching PDF blob:', err)
        if (mounted) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      mounted = false
      controller.abort()
      if (objectUrl) {
        // Delay revoking to prevent unmount flickering
        setTimeout(() => {
          URL.revokeObjectURL(objectUrl)
        }, 100)
      }
    }
  }, [pdfUrl])

  return { pdfBlobUrl, loading, error }
}
