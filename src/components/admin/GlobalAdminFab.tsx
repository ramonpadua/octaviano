import { useState } from 'react'
import { Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { PdfUploadDialog } from '@/components/admin/PdfUploadDialog'

export function GlobalAdminFab() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="rounded-full w-14 h-14 shadow-xl bg-verde hover:bg-verde/90 text-white p-0 flex items-center justify-center border border-white/20"
          title="Administrar Documentos"
        >
          <Settings2 className="w-6 h-6" />
        </Button>
      </div>
      <PdfUploadDialog isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
