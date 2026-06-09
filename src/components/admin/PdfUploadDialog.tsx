import { useState, useRef } from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X, UploadCloud, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import pb from '@/lib/pocketbase/client'

interface PdfUploadDialogProps {
  isOpen: boolean
  onClose: () => void
  fixedTipo?: 'catalogo' | 'booking' | 'releases' | 'treinamento' | 'normas'
}

export function PdfUploadDialog({
  isOpen,
  onClose,
  fixedTipo,
}: PdfUploadDialogProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (fixedTipo) {
      formData.set('tipo', fixedTipo)
    }

    const file = formData.get('arquivo') as File
    if (file && file.size > 50 * 1024 * 1024) {
      toast({
        title: 'Erro de validação',
        description: 'O arquivo excede o limite máximo de 50MB.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const currentTipo = fixedTipo || formData.get('tipo')

      if (currentTipo === 'normas') {
        let existingRecord = null
        try {
          existingRecord = await pb
            .collection('pdfs')
            .getFirstListItem('tipo="normas"')
        } catch (_) {
          // not found
        }

        if (existingRecord) {
          await pb.collection('pdfs').update(existingRecord.id, formData)
        } else {
          await pb.collection('pdfs').create(formData)
        }
      } else {
        await pb.collection('pdfs').create(formData)
      }

      toast({
        title: 'PDF salvo com sucesso!',
        className: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      })
      onClose()
    } catch (err: any) {
      toast({
        title: 'Erro ao enviar PDF',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[#163029]/80 backdrop-blur-sm animate-in fade-in-0" />
        <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-white p-6 shadow-xl animate-in zoom-in-95">
          <div className="flex items-center justify-between mb-6">
            <div>
              <DialogPrimitive.Title className="text-xl font-serif font-bold text-verde">
                Adicionar Documento PDF
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground hidden">
                Preencha o formulário para fazer upload de um novo documento
                PDF.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-metallic hover:text-verde"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-verde">Título *</label>
              <Input
                name="titulo"
                required
                placeholder="Ex: Catálogo 2026"
                className="border-bege focus-visible:ring-verde"
              />
            </div>
            {!fixedTipo && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-verde">Tipo *</label>
                <select
                  name="tipo"
                  required
                  className="flex h-10 w-full rounded-md border border-bege bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde text-earth"
                >
                  <option value="catalogo">Catálogo</option>
                  <option value="booking">Booking</option>
                  <option value="releases">Releases</option>
                  <option value="treinamento">Treinamento</option>
                  <option value="normas">Normas</option>
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-verde">
                Categoria
              </label>
              <Input
                name="categoria"
                placeholder="Ex: Geral"
                className="border-bege focus-visible:ring-verde"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-verde">
                Descrição
              </label>
              <textarea
                name="descricao"
                placeholder="Breve descrição do documento..."
                rows={2}
                className="flex w-full rounded-md border border-bege bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-verde text-earth resize-none"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-verde">
                Arquivo PDF *
              </label>
              <Input
                name="arquivo"
                type="file"
                accept="application/pdf"
                required
                className="border-bege focus-visible:ring-verde cursor-pointer file:text-verde"
              />
            </div>
            <div className="flex justify-end pt-4 gap-3 border-t border-bege mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-bege text-earth"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-verde hover:bg-verde/90 text-white"
              >
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="mr-2 h-4 w-4" />
                )}
                Salvar PDF
              </Button>
            </div>
          </form>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
