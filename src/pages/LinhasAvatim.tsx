import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { PackageX, AlertCircle } from 'lucide-react'
import { getAvatimLines, type AvatimLine } from '@/services/avatim_lines'
import { getAllProducts, type Product } from '@/services/products'
import { useRealtime } from '@/hooks/use-realtime'
import bannerImg from '@/assets/institucionais-seja-revendedor-9dbff.jpg'

export default function LinhasAvatimPage() {
  const [lines, setLines] = useState<AvatimLine[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedLine, setSelectedLine] = useState<AvatimLine | null>(null)

  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(false)
      const [linesData, productsData] = await Promise.all([
        getAvatimLines({ sort: 'name' }),
        getAllProducts(),
      ])
      setLines(linesData)
      setProducts(productsData)
    } catch (err) {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useRealtime('avatim_lines', () => {
    loadData()
  })
  useRealtime('products', () => {
    loadData()
  })

  const lineProducts = useMemo(() => {
    if (!selectedLine) return []
    return products.filter(
      (p) => p.category?.toLowerCase() === selectedLine.name.toLowerCase(),
    )
  }, [products, selectedLine])

  return (
    <div className="flex flex-col w-full animate-fade-in-up flex-1">
      <section className="relative w-full h-[40vh] min-h-[300px] flex flex-col justify-end items-end overflow-hidden bg-[#163029] pb-2 md:pb-4 pr-6 md:pr-8">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-right bg-no-repeat scale-125 md:scale-110 origin-right"
          style={{ backgroundImage: `url(${bannerImg})` }}
        />
        <div className="absolute inset-0 z-0 bg-[#163029]/50 mix-blend-multiply" />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#163029]/90 via-[#163029]/40 to-transparent" />
        <div className="relative z-10 text-right flex flex-col items-end w-full max-w-full">
          <p className="text-[clamp(8px,2.2vw,1.25rem)] text-white/90 whitespace-nowrap drop-shadow-md">
            Conheça todas as nossas linhas de produtos inspiradas na natureza
          </p>
        </div>
      </section>

      <div className="container py-16 md:py-24">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden border-muted">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <CardContent className="p-5 space-y-4">
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <AlertCircle className="w-12 h-12 text-destructive opacity-50" />
            <p className="text-muted-foreground text-lg">
              Erro ao carregar as linhas.
            </p>
            <Button onClick={loadData}>Tentar Novamente</Button>
          </div>
        ) : lines.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <PackageX className="w-12 h-12 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground text-lg">
              Nenhuma linha encontrada.
            </p>
            <Button onClick={loadData}>Voltar</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {lines.map((line) => (
              <Card
                key={line.id}
                className="overflow-hidden group hover:shadow-lg transition-all flex flex-col border-muted"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted relative flex items-center justify-center p-6">
                  {line.image_url ? (
                    <img
                      src={line.image_url}
                      alt={line.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    />
                  ) : (
                    <PackageX className="w-12 h-12 text-secondary opacity-30" />
                  )}
                </div>
                <CardContent className="p-5 flex flex-col flex-1 text-center justify-between gap-4">
                  <h3 className="font-serif font-bold text-secondary text-lg line-clamp-2">
                    {line.name}
                  </h3>
                  <Button
                    className="w-full"
                    onClick={() => setSelectedLine(line)}
                  >
                    Ver Detalhes
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog
          open={!!selectedLine}
          onOpenChange={(open) => !open && setSelectedLine(null)}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
            {selectedLine && (
              <>
                <DialogHeader className="shrink-0 mb-4">
                  <DialogTitle className="font-serif text-3xl text-secondary">
                    Linha {selectedLine.name}
                  </DialogTitle>
                  <DialogDescription className="hidden">
                    Detalhes da linha
                  </DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto pr-2 flex-1 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm bg-muted flex items-center justify-center p-8">
                      {selectedLine.image_url ? (
                        <img
                          src={selectedLine.image_url}
                          alt={selectedLine.name}
                          className="w-full h-full object-contain mix-blend-multiply"
                        />
                      ) : (
                        <PackageX className="w-16 h-16 text-secondary opacity-30" />
                      )}
                    </div>
                    <div className="space-y-6">
                      {selectedLine.description ? (
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {selectedLine.description}
                        </p>
                      ) : (
                        <p className="text-muted-foreground italic">
                          Nenhuma descrição disponível para esta linha.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-serif text-2xl font-bold text-secondary mb-6 border-b pb-2">
                      Produtos desta linha
                    </h4>
                    {lineProducts.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {lineProducts.map((product) => (
                          <div
                            key={product.id}
                            className="flex gap-4 items-center p-3 rounded-lg border bg-card"
                          >
                            <div className="w-16 h-16 rounded bg-muted overflow-hidden flex-shrink-0 flex items-center justify-center p-1.5">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              ) : (
                                <PackageX className="w-6 h-6 opacity-30" />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-sm line-clamp-1">
                                {product.name}
                              </div>
                              <div className="text-primary font-bold text-sm">
                                {product.price
                                  ? `R$ ${product.price.toFixed(2).replace('.', ',')}`
                                  : 'Sob consulta'}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-center py-8 bg-muted/50 rounded-lg border border-dashed">
                        Nenhum produto cadastrado nesta linha no momento.
                      </div>
                    )}
                  </div>
                </div>
                <div className="pt-6 shrink-0 mt-auto border-t">
                  <Button
                    className="w-full md:w-auto"
                    onClick={() => setSelectedLine(null)}
                  >
                    Voltar
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
