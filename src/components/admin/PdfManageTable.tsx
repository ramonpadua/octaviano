import { useState, useEffect } from 'react'
import {
  getPdfsPaginated,
  deletePdf,
  updatePdf,
  type PdfRecord,
} from '@/services/pdfs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import {
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Save,
  X,
  Loader2,
} from 'lucide-react'
import { PdfViewerModal } from '@/components/pdf/PdfViewerModal'

export function PdfManageTable() {
  const [pdfs, setPdfs] = useState<PdfRecord[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [editingPdf, setEditingPdf] = useState<PdfRecord | null>(null)
  const [viewingPdf, setViewingPdf] = useState<PdfRecord | null>(null)
  const { toast } = useToast()

  const fetchPdfs = async () => {
    setLoading(true)
    try {
      const res = await getPdfsPaginated(page, 10)
      setPdfs(res.items)
      setTotalPages(res.totalPages)
    } catch (e) {
      toast({ title: 'Erro ao buscar PDFs', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPdfs()
  }, [page])

  const handleDelete = async (id: string) => {
    if (
      !window.confirm(
        'Tem certeza que deseja deletar este PDF? O arquivo será permanentemente removido.',
      )
    )
      return
    try {
      await deletePdf(id)
      toast({
        title: 'PDF deletado com sucesso',
        className: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      })
      if (pdfs.length === 1 && page > 1) setPage((p) => p - 1)
      else fetchPdfs()
    } catch (e) {
      toast({ title: 'Erro ao deletar', variant: 'destructive' })
    }
  }

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingPdf) return
    try {
      await updatePdf(editingPdf.id, {
        titulo: editingPdf.titulo,
        categoria: editingPdf.categoria,
        descricao: editingPdf.descricao,
      })
      toast({
        title: 'PDF atualizado com sucesso',
        className: 'bg-emerald-50 text-emerald-900 border-emerald-200',
      })
      setEditingPdf(null)
      fetchPdfs()
    } catch (err) {
      toast({ title: 'Erro ao atualizar', variant: 'destructive' })
    }
  }

  return (
    <div className="bg-white rounded-xl border border-bege shadow-sm overflow-hidden animate-fade-in-up">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-earth">
          <thead className="bg-bege/30 text-verde uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Título</th>
              <th className="px-6 py-4 font-semibold">Tipo</th>
              <th className="px-6 py-4 font-semibold">Categoria</th>
              <th className="px-6 py-4 font-semibold">Data</th>
              <th className="px-6 py-4 font-semibold text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-verde mx-auto" />
                </td>
              </tr>
            ) : pdfs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-earth">
                  Nenhum PDF encontrado.
                </td>
              </tr>
            ) : (
              pdfs.map((pdf) => (
                <tr
                  key={pdf.id}
                  className="border-b border-bege/50 hover:bg-gray-50/50 transition-colors"
                >
                  {editingPdf?.id === pdf.id ? (
                    <td colSpan={5} className="p-0">
                      <form
                        onSubmit={handleSaveEdit}
                        className="flex flex-col md:flex-row items-center gap-4 p-4 bg-verde/5"
                      >
                        <Input
                          value={editingPdf.titulo}
                          onChange={(e) =>
                            setEditingPdf({
                              ...editingPdf,
                              titulo: e.target.value,
                            })
                          }
                          placeholder="Título"
                          className="flex-1 bg-white border-bege"
                          required
                        />
                        <div className="text-xs uppercase font-bold text-metallic bg-white px-3 py-2 rounded-md border border-bege select-none">
                          {pdf.tipo === 'book_portfolio_avatim'
                            ? 'BOOK PORTFÓLIO AVATIM'
                            : pdf.tipo}
                        </div>
                        <Input
                          value={editingPdf.categoria}
                          onChange={(e) =>
                            setEditingPdf({
                              ...editingPdf,
                              categoria: e.target.value,
                            })
                          }
                          placeholder="Categoria"
                          className="flex-1 bg-white border-bege"
                          required
                        />
                        <Input
                          value={editingPdf.descricao || ''}
                          onChange={(e) =>
                            setEditingPdf({
                              ...editingPdf,
                              descricao: e.target.value,
                            })
                          }
                          placeholder="Descrição"
                          className="flex-1 bg-white border-bege"
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            type="submit"
                            size="sm"
                            className="bg-verde hover:bg-verde/90 text-white"
                          >
                            <Save className="w-4 h-4 mr-2" /> Salvar
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingPdf(null)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </form>
                    </td>
                  ) : (
                    <>
                      <td
                        className="px-6 py-4 font-medium text-verde truncate max-w-[200px]"
                        title={pdf.titulo}
                      >
                        {pdf.titulo}
                      </td>
                      <td className="px-6 py-4 capitalize text-xs font-semibold">
                        {pdf.tipo === 'book_portfolio_avatim'
                          ? 'Book Portfólio Avatim'
                          : pdf.tipo}
                      </td>
                      <td
                        className="px-6 py-4 truncate max-w-[150px]"
                        title={pdf.categoria}
                      >
                        {pdf.categoria}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(pdf.created).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Visualizar"
                          onClick={() => setViewingPdf(pdf)}
                          className="text-verde hover:bg-verde/10 hover:text-verde"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Editar"
                          onClick={() => setEditingPdf(pdf)}
                          className="text-terracotta hover:bg-terracotta/10 hover:text-terracotta"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Deletar"
                          onClick={() => handleDelete(pdf.id)}
                          className="text-red-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-bege/50 bg-gray-50/50">
          <span className="text-sm text-earth">
            Página <span className="font-semibold text-verde">{page}</span> de{' '}
            <span className="font-semibold text-verde">{totalPages}</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="border-bege text-earth"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="border-bege text-earth"
            >
              Próxima <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {viewingPdf && (
        <PdfViewerModal
          isOpen={true}
          onClose={() => setViewingPdf(null)}
          pdfRecord={viewingPdf}
        />
      )}
    </div>
  )
}
