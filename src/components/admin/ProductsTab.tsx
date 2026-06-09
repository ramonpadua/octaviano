import { useState, useEffect, useCallback } from 'react'
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  type Product,
} from '@/services/products'
import { useRealtime } from '@/hooks/use-realtime'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Edit,
  Trash2,
  Search,
  Plus,
  PackageOpen,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { z } from 'zod'

const AVATIM_CATEGORIES = [
  'Açucena',
  'Águas Naturais',
  'Alira',
  'Ateliê',
  'Bakari',
  'Boníssimo',
  'Bulevar',
  'Cheiros da Bahia',
  'Clássicos',
  'Curumim',
  'Desfrutar',
  'Dia Dia',
  'Esplendor',
  'Gigi',
  'Íris',
  'Jardim Brasil',
  'Mel Terapia',
  'Ozara',
  'Relicário',
  'Reserva',
  'Ritos',
  'Santo Pé',
  'Seleto',
  'Sensore',
  'Serena',
  'Sublime',
  'Tato & Olfato',
  'Verbena & Bambu',
]

const productSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  codigo_produto: z.string().min(1, 'Código é obrigatório'),
  codigo_barras: z.string().optional(),
  price: z.number().min(0.01, 'Preço deve ser maior que 0'),
  preco_custo: z.number().optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  linha: z.string().min(1, 'Linha é obrigatória'),
  unidade_medida: z.string().min(1, 'Unidade obrigatória'),
  codigo_ncm: z.string().optional(),
  image_url: z.string().url('URL inválida').optional().or(z.literal('')),
})

const formatPrice = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [categoryFilter, setCategoryFilter] = useState('todas')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    codigo_produto: '',
    codigo_barras: '',
    price: 0,
    preco_custo: 0,
    description: '',
    category: '',
    linha: '',
    unidade_medida: 'UN',
    codigo_ncm: '',
    image_url: '',
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()

  const fetchProducts = useCallback(
    async (isSilent = false) => {
      if (!isSilent) {
        setIsLoading(true)
        setIsError(false)
      }
      try {
        const filters = []
        if (debouncedSearch)
          filters.push(
            `name ~ "${debouncedSearch}" || codigo_produto ~ "${debouncedSearch}"`,
          )
        if (categoryFilter !== 'todas')
          filters.push(`category = "${categoryFilter}"`)

        const data = await getProducts(page, 10, {
          filter: filters.join(' && '),
          sort: '-created',
        })
        setProducts(data.items)
        setTotalItems(data.totalItems)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error(err)
        if (!isSilent) setIsError(true)
      } finally {
        if (!isSilent) setIsLoading(false)
      }
    },
    [page, debouncedSearch, categoryFilter],
  )

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, categoryFilter])
  useRealtime('products', () => {
    fetchProducts(true)
  })

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'price' | 'preco_custo',
  ) => {
    let val = e.target.value.replace(/\D/g, '')
    if (!val) val = '0'
    setFormData({ ...formData, [field]: parseInt(val, 10) / 100 })
  }

  const openModal = (product?: Product) => {
    setFormErrors({})
    if (product) {
      setSelectedProduct(product)
      setFormData({
        name: product.name || product.descricao || '',
        codigo_produto: product.codigo_produto || '',
        codigo_barras: product.codigo_barras || '',
        price: product.price || product.preco_venda || 0,
        preco_custo: product.preco_custo || 0,
        description: product.description || '',
        category: product.category || product.categoria || '',
        linha: product.linha || '',
        unidade_medida: product.unidade_medida || 'UN',
        codigo_ncm: product.codigo_ncm || '',
        image_url: product.image_url || product.imagem_url || '',
      })
    } else {
      setSelectedProduct(null)
      setFormData({
        name: '',
        codigo_produto: '',
        codigo_barras: '',
        price: 0,
        preco_custo: 0,
        description: '',
        category: '',
        linha: '',
        unidade_medida: 'UN',
        codigo_ncm: '',
        image_url: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      const parsed = productSchema.parse(formData)
      setFormErrors({})

      const payload = {
        ...parsed,
        descricao: parsed.name,
        preco_venda: parsed.price,
        categoria: parsed.category,
        grupo_produto: parsed.category,
        imagem_url: parsed.image_url,
      }

      if (selectedProduct?.id) {
        await updateProduct(selectedProduct.id, payload)
        toast({
          title: 'Sucesso',
          description: 'Produto atualizado com sucesso',
        })
      } else {
        await createProduct(payload)
        toast({
          title: 'Sucesso',
          description: 'Produto adicionado com sucesso',
        })
      }
      setIsModalOpen(false)
      fetchProducts(true)
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {}
        err.errors.forEach((e) => {
          if (e.path[0]) errors[e.path[0].toString()] = e.message
        })
        setFormErrors(errors)
      } else {
        toast({
          title: 'Erro',
          description: 'Erro ao salvar produto',
          variant: 'destructive',
        })
      }
    }
  }

  const handleDelete = async () => {
    if (!selectedProduct?.id) return
    try {
      await deleteProduct(selectedProduct.id)
      toast({ title: 'Sucesso', description: 'Produto deletado com sucesso' })
      setIsDeleteDialogOpen(false)
      fetchProducts(true)
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Erro ao deletar produto',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Gestão de Produtos
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie o catálogo de produtos e inventário.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => fetchProducts()}
            disabled={isLoading}
            className="flex-1 md:flex-none"
          >
            <RefreshCw
              className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')}
            />{' '}
            Atualizar
          </Button>
          <Button
            onClick={() => openModal()}
            className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 md:flex-none"
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar
          </Button>
        </div>
      </div>

      <div className="bg-background rounded-xl shadow-sm border p-4 md:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome ou código..."
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline-block">
              Filtrar:
            </span>
            <select
              className="flex h-10 w-full sm:w-[220px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="todas">Todas as Linhas</option>
              {AVATIM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 space-y-4 border rounded-xl bg-card">
            <p className="text-destructive font-medium">
              Erro ao carregar os dados.
            </p>
            <Button onClick={() => fetchProducts()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-4 flex flex-col items-center border rounded-xl bg-card/50">
            <div className="p-4 bg-muted rounded-full">
              <PackageOpen className="h-12 w-12 text-muted-foreground opacity-60" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              Nenhum produto encontrado
            </p>
            <Button
              onClick={() => openModal()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2"
            >
              <Plus className="mr-2 h-4 w-4" /> Adicionar Produto
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="hidden md:block rounded-md border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Preço</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-mono text-xs">
                        {product.codigo_produto || '-'}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatPrice(product.price || 0)}
                      </TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openModal(product)}
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedProduct(product)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-4">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="border rounded-lg p-4 bg-card shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-mono text-muted-foreground">
                        {product.codigo_produto}
                      </p>
                      <h3
                        className="font-semibold text-lg truncate"
                        title={product.name}
                      >
                        {product.name}
                      </h3>
                      <p className="text-sm font-medium text-primary mt-1">
                        {formatPrice(product.price || 0)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openModal(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setSelectedProduct(product)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Deletar
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Página {page} de {totalPages || 1} ({totalItems} registros)
              </p>
              <div className="flex space-x-2 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                >
                  Próxima <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">
              {selectedProduct ? 'Editar Produto' : 'Adicionar Produto'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Nome do Produto</label>
              <Input
                placeholder="Nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {formErrors.name && (
                <p className="text-xs text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Código do Produto (SKU)
              </label>
              <Input
                placeholder="PROD-001"
                value={formData.codigo_produto}
                onChange={(e) =>
                  setFormData({ ...formData, codigo_produto: e.target.value })
                }
              />
              {formErrors.codigo_produto && (
                <p className="text-xs text-destructive">
                  {formErrors.codigo_produto}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Código de Barras</label>
              <Input
                placeholder="EAN"
                value={formData.codigo_barras}
                onChange={(e) =>
                  setFormData({ ...formData, codigo_barras: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço de Venda</label>
              <Input
                value={formatPrice(formData.price)}
                onChange={(e) => handlePriceChange(e, 'price')}
              />
              {formErrors.price && (
                <p className="text-xs text-destructive">{formErrors.price}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Preço de Custo</label>
              <Input
                value={formatPrice(formData.preco_custo)}
                onChange={(e) => handlePriceChange(e, 'preco_custo')}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria / Grupo</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
              >
                <option value="" disabled>
                  Selecione...
                </option>
                {AVATIM_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {formErrors.category && (
                <p className="text-xs text-destructive">
                  {formErrors.category}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Linha</label>
              <Input
                placeholder="Linha"
                value={formData.linha}
                onChange={(e) =>
                  setFormData({ ...formData, linha: e.target.value })
                }
              />
              {formErrors.linha && (
                <p className="text-xs text-destructive">{formErrors.linha}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidade de Medida</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formData.unidade_medida}
                onChange={(e) =>
                  setFormData({ ...formData, unidade_medida: e.target.value })
                }
              >
                <option value="UN">Unidade (UN)</option>
                <option value="ML">Mililitro (ML)</option>
                <option value="G">Grama (G)</option>
                <option value="CX">Caixa (CX)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">NCM</label>
              <Input
                placeholder="NCM"
                value={formData.codigo_ncm}
                onChange={(e) =>
                  setFormData({ ...formData, codigo_ncm: e.target.value })
                }
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Descrição</label>
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="Descrição do produto..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              {formErrors.description && (
                <p className="text-xs text-destructive">
                  {formErrors.description}
                </p>
              )}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">URL da Imagem</label>
              <Input
                placeholder="https://exemplo.com/imagem.jpg"
                value={formData.image_url}
                onChange={(e) =>
                  setFormData({ ...formData, image_url: e.target.value })
                }
              />
              {formErrors.image_url && (
                <p className="text-xs text-destructive">
                  {formErrors.image_url}
                </p>
              )}
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-destructive">
              Deletar Produto
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground my-4">
            Tem certeza que deseja deletar o produto{' '}
            <strong>{selectedProduct?.name}</strong>?
          </p>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Deletar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
