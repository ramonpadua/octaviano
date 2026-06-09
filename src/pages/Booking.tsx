import { useEffect, useState } from 'react'
import { getPdfsByType, type PdfRecord } from '@/services/pdfs'
import { PdfViewerLayout } from '@/components/pdf/PdfViewerLayout'

export default function BookingPage() {
  const [bookings, setBookings] = useState<PdfRecord[]>([])
  const [booking, setBooking] = useState<PdfRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchBooking() {
      try {
        const pdts = await getPdfsByType('book_portfolio_avatim')
        const valid = pdts.filter((c) => c.arquivo !== '')
        setBookings(valid)
        setBooking(valid[0] || null)
      } catch (err) {
        console.error('Error fetching booking:', err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [])

  return (
    <PdfViewerLayout
      title="Book Portfólio Avatim"
      description="Um refúgio de Boas Sensações"
      bgImageUrl="https://img.usecurling.com/p/1920/1080?q=spa%20products%20booking"
      documents={bookings}
      activeDocument={booking}
      onSelectDocument={setBooking}
      loading={loading}
      error={error}
      emptyMessage="Nenhum book disponível no momento"
      tipo="book_portfolio_avatim"
      showUpload={false}
    />
  )
}
