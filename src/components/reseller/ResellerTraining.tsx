import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  Video,
  FileText,
  PackageX,
  AlertCircle,
  ExternalLink,
} from 'lucide-react'
import {
  getAllMaterials,
  getMaterialFileUrl,
  type Material,
} from '@/services/materials'
import { useDebounce } from '@/hooks/use-debounce'
import { useRealtime } from '@/hooks/use-realtime'

export function ResellerTraining() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const debouncedSearch = useDebounce(search, 300)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getAllMaterials({ sort: '-created' })
      setMaterials(data)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('materials', () => {
    loadData()
  })

  const categories = useMemo(() => {
    const cats = new Set(
      materials.map((m) => m.category).filter(Boolean) as string[],
    )
    return Array.from(cats).sort()
  }, [materials])

  const filteredMaterials = useMemo(() => {
    return materials.filter((m) => {
      const matchSearch = m.title
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase())
      const matchCategory = category ? m.category === category : true
      return matchSearch && matchCategory
    })
  }, [materials, debouncedSearch, category])

  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="bg-muted border-b border-primary/10">
        <CardTitle className="font-serif text-2xl text-primary">
          Material de Treinamento
        </CardTitle>
        <CardDescription>
          Acesse nossos materiais de treinamento para se preparar.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar materiais..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="flex h-10 w-full sm:w-[220px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Todas as categorias</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border bg-background shadow-sm">
                <CardContent className="p-4 flex flex-col gap-4 h-full">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-lg shrink-0" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-9 w-full mt-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-destructive opacity-50" />
            <p className="text-muted-foreground">Erro ao carregar materiais.</p>
            <Button onClick={loadData}>Tentar Novamente</Button>
          </div>
        ) : filteredMaterials.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center gap-4">
            <PackageX className="w-12 h-12 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Nenhum material encontrado.</p>
            <Button
              onClick={() => {
                setSearch('')
                setCategory('')
              }}
            >
              Voltar
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map((mat) => (
              <Card
                key={mat.id}
                className="border bg-background shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <CardContent className="p-4 flex flex-col justify-between h-full gap-4 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary shrink-0">
                      {mat.type === 'video' ? (
                        <Video className="w-6 h-6" />
                      ) : (
                        <FileText className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <p
                        className="font-bold text-secondary mb-1 line-clamp-2"
                        title={mat.title}
                      >
                        {mat.title}
                      </p>
                      <div className="flex gap-2 items-center flex-wrap mt-2">
                        <span className="inline-block px-2 py-0.5 bg-muted rounded text-[10px] font-semibold uppercase text-muted-foreground">
                          {mat.type}
                        </span>
                        {mat.category && (
                          <span className="inline-block px-2 py-0.5 bg-primary/10 rounded text-[10px] font-semibold uppercase text-primary">
                            {mat.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-auto" asChild>
                    <a
                      href={getMaterialFileUrl(mat)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Acessar
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
