import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  FileText,
  Video,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  FileUp,
} from 'lucide-react'

import { useDebounce } from '@/hooks/use-debounce'
import { useRealtime } from '@/hooks/use-realtime'
import { getErrorMessage } from '@/lib/pocketbase/errors'
import {
  Material,
  getMaterials,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  getMaterialFileUrl,
} from '@/services/materials'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'

const CATEGORIES = [
  'Como Vender',
  'Conhecendo as Linhas',
  'Técnicas de Abordagem',
  'Gestão de Vendas',
  'Outros',
]

export function MaterialsTab() {
  const [items, setItems] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [typeFilter, setTypeFilter] = useState('')

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [editId, setEditId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [type, setType] = useState('pdf')
  const [category, setCategory] = useState('')
  const [fileUrl, setFileUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const [materialToDelete, setMaterialToDelete] = useState<Material | null>(
    null,
  )

  const loadData = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getMaterials(
        page,
        10,
        debouncedSearch,
        typeFilter === 'all' ? '' : typeFilter,
      )
      setItems(data.items)
      setTotalPages(data.totalPages || 1)
    } catch (err) {
      setError(true)
      toast.error('Erro ao carregar materiais')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [page, debouncedSearch, typeFilter])

  useRealtime('materials', () => {
    loadData()
  })

  // Simulated progress bar for UI feel
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (saving && file) {
      setUploadProgress(10)
      interval = setInterval(() => {
        setUploadProgress((p) => (p < 90 ? p + 15 : p))
      }, 300)
    } else {
      setUploadProgress(0)
    }
    return () => clearInterval(interval)
  }, [saving, file])

  const openForm = (material?: Material) => {
    if (material) {
      setEditId(material.id)
      setTitle(material.title)
      setType(material.type)
      setCategory(material.category)
      setFileUrl(material.file_url || '')
      setFile(null)
    } else {
      setEditId(null)
      setTitle('')
      setType('pdf')
      setCategory('')
      setFileUrl('')
      setFile(null)
    }
    setIsFormOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !type || !category) {
      toast.error('Preencha os campos obrigatórios')
      return
    }
    if (!fileUrl && !file && !editId) {
      toast.error('Forneça uma URL ou um arquivo PDF')
      return
    }

    setSaving(true)
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('type', type)
      formData.append('category', category)

      if (file) {
        formData.append('file', file)
      } else if (fileUrl) {
        formData.append('file_url', fileUrl)
      }

      if (editId) {
        await updateMaterial(editId, formData)
        toast.success('Material atualizado com sucesso')
      } else {
        await createMaterial(formData)
        toast.success('Material adicionado com sucesso')
      }
      setIsFormOpen(false)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
      setUploadProgress(100)
    }
  }

  const handleDelete = async () => {
    if (!materialToDelete) return
    setSaving(true)
    try {
      await deleteMaterial(materialToDelete.id)
      toast.success('Material deletado com sucesso')
      setIsDeleteOpen(false)
      setMaterialToDelete(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    } finally {
      setSaving(false)
    }
  }

  const renderIcon = (mType: string) => {
    return mType === 'pdf' ? (
      <FileText className="h-5 w-5 text-red-500" />
    ) : (
      <Video className="h-5 w-5 text-blue-500" />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-serif font-bold text-primary">
          Materiais de Apoio
        </h2>
        <Button onClick={() => openForm()} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Material
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="video">Vídeo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error ? (
        <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-10 w-10 mb-4" />
          <p className="font-medium mb-4">Falha ao carregar os materiais</p>
          <Button variant="outline" onClick={loadData}>
            Tentar Novamente
          </Button>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border rounded-xl bg-card">
          <FileText className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
          <p className="text-muted-foreground mb-4">
            Nenhum material cadastrado
          </p>
          <Button variant="outline" onClick={() => openForm()}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Material
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block border rounded-xl bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <a
                        href={getMaterialFileUrl(item)}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:underline flex items-center gap-2"
                      >
                        {renderIcon(item.type)} {item.title}
                      </a>
                    </TableCell>
                    <TableCell className="capitalize">{item.type}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openForm(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => {
                          setMaterialToDelete(item)
                          setIsDeleteOpen(true)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-xl bg-card flex flex-col gap-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {renderIcon(item.type)}
                    <h3
                      className="font-medium break-words line-clamp-2"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground flex justify-between items-center">
                  <span>{item.category}</span>
                  <span className="capitalize px-2 py-1 bg-secondary rounded-full text-xs">
                    {item.type}
                  </span>
                </div>
                <div className="flex gap-2 justify-end pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm(item)}
                  >
                    <Edit className="h-4 w-4 mr-2" /> Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive border-destructive/30 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      setMaterialToDelete(item)
                      setIsDeleteOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" /> Excluir
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Página {page} de {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Form Modal */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editId ? 'Editar Material' : 'Adicionar Material'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">TÍTULO</label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">TIPO</label>
                <Select value={type} onValueChange={setType} required>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="video">Vídeo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CATEGORIA</label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                URL ARQUIVO / REFERÊNCIA
              </label>
              <Input
                type="url"
                placeholder="https://exemplo.com/arquivo"
                value={fileUrl}
                onChange={(e) => setFileUrl(e.target.value)}
              />
            </div>

            {type === 'pdf' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  OU UPLOAD DE ARQUIVO (PDF, MAX 10MB)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f && f.size > 10 * 1024 * 1024) {
                        toast.error('O arquivo deve ter no máximo 10MB')
                        e.target.value = ''
                        return
                      }
                      setFile(f || null)
                      if (f) setFileUrl('')
                    }}
                    className="cursor-pointer"
                  />
                  {file && (
                    <FileUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </div>
            )}

            {saving && file && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Fazendo upload...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja deletar este material? Esta ação não pode
              ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={saving}
            >
              {saving ? 'Deletando...' : 'Deletar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
