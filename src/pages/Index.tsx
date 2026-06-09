import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import pb from '@/lib/pocketbase/client'
import { Loader2 } from 'lucide-react'

// Use a local interface to prevent strict type import issues at runtime
interface LocalPdfRecord {
  id: string
  titulo: string
  resumo?: string
  tipo: string
  [key: string]: any
}

export default function Index() {
  const [latestCatalog, setLatestCatalog] = useState<LocalPdfRecord | null>(
    null,
  )
  const [latestBooking, setLatestBooking] = useState<LocalPdfRecord | null>(
    null,
  )
  const [isLoading, setIsLoading] = useState(true)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    let mounted = true

    const initData = async () => {
      setIsLoading(true)
      setFetchError(false)
      try {
        const [catalogRes, bookingRes, productsRes, linesRes] =
          await Promise.allSettled([
            pb.collection('pdfs').getList<LocalPdfRecord>(1, 1, {
              filter: "tipo='catalogo'",
              sort: '-created',
            }),
            pb.collection('pdfs').getList<LocalPdfRecord>(1, 1, {
              filter: "tipo='book_portfolio_avatim'",
              sort: '-created',
            }),
            pb.collection('products').getList(1, 1),
            pb.collection('avatim_lines').getList(1, 1),
          ])

        if (mounted) {
          if (
            catalogRes.status === 'rejected' ||
            bookingRes.status === 'rejected'
          ) {
            setFetchError(true)
          }

          setLatestCatalog(
            catalogRes.status === 'fulfilled' &&
              catalogRes.value?.items?.length > 0
              ? catalogRes.value.items[0]
              : null,
          )
          setLatestBooking(
            bookingRes.status === 'fulfilled' &&
              bookingRes.value?.items?.length > 0
              ? bookingRes.value.items[0]
              : null,
          )
        }
      } catch (err) {
        console.error('Failed to fetch initial data:', err)
        if (mounted) {
          setFetchError(true)
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    initData()

    return () => {
      mounted = false
    }
  }, [])

  return (
    <div className="flex flex-col w-full min-h-screen bg-light/30">
      {/* 1. Hero */}
      <section className="relative w-full h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden bg-verde">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat animate-fade-in"
          style={{
            backgroundImage:
              "url('https://img.usecurling.com/p/1920/1080?q=botanical%20perfume%20nature')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-verde/60 mix-blend-multiply" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-verde/90" />

        <div className="container relative z-10 flex flex-col items-center text-center px-4 mt-8 animate-fade-in-up">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg leading-tight">
            Bem vindo ao Portal Sensatio OnLine
          </h1>
          <p className="text-xl md:text-2xl text-white/95 max-w-2xl font-light mb-10 drop-shadow-md">
            conheça nossos produtos, acesse catálogos e material para
            treinamento
          </p>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-light text-verde rounded-full px-10 h-14 text-lg border-none shadow-xl hover:shadow-2xl transition-all"
            >
              <Link to="/catalogo">Explorar Catálogo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="py-16 md:py-24">
        <div className="container max-w-5xl mx-auto px-4 flex flex-col gap-6">
          {/* 1. Catálogo */}
          <div className="relative overflow-hidden rounded-xl shadow-md border-0 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all group min-h-[180px]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://img.usecurling.com/p/1200/600?q=perfume%20bottles%20elegant')",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 text-left flex-1 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Carregando
                    Catálogo...
                  </>
                ) : fetchError ? (
                  'Dados Temporariamente Indisponíveis'
                ) : latestCatalog ? (
                  latestCatalog.titulo
                ) : (
                  'Catálogo de Produtos'
                )}
              </h3>
              <p className="text-white/90 text-lg font-light drop-shadow-sm leading-relaxed">
                {isLoading
                  ? 'Aguarde um momento enquanto buscamos as informações...'
                  : fetchError
                    ? 'Não foi possível carregar os dados no momento. Tente novamente mais tarde.'
                    : latestCatalog?.resumo ||
                      'Consulte nosso catálogo completo em formato digital interativo.'}
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-verde hover:bg-gray-100 hover:text-verde font-semibold shadow-lg"
              >
                <Link to="/catalogo">Acessar Catálogo</Link>
              </Button>
            </div>
          </div>

          {/* 2. Book Portfólio Avatim */}
          <div className="relative overflow-hidden rounded-xl shadow-md border-0 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all group min-h-[180px]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://img.usecurling.com/p/1200/600?q=fragrance%20essential%20oils%20spa')",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 text-left flex-1 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> Carregando
                    Book...
                  </>
                ) : fetchError ? (
                  'Dados Temporariamente Indisponíveis'
                ) : latestBooking ? (
                  latestBooking.titulo
                ) : (
                  'Book Portfólio Avatim'
                )}
              </h3>
              <p className="text-white/90 text-lg font-light drop-shadow-sm leading-relaxed">
                {isLoading
                  ? 'Aguarde um momento enquanto buscamos as informações...'
                  : fetchError
                    ? 'Não foi possível carregar os dados no momento. Tente novamente mais tarde.'
                    : latestBooking?.resumo ||
                      'Conheça os produtos Avatim suas caraterísticas e famílias olfativas.'}
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-verde hover:bg-gray-100 hover:text-verde font-semibold shadow-lg"
              >
                <Link to="/booking">Ver Book</Link>
              </Button>
            </div>
          </div>

          {/* 3. Releases de Produtos */}
          <div className="relative overflow-hidden rounded-xl shadow-md border-0 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all group min-h-[180px]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://img.usecurling.com/p/1200/600?q=cosmetic%20products%20nature')",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 text-left flex-1 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md">
                Releases de Produtos
              </h3>
              <p className="text-white/90 text-lg font-light drop-shadow-sm leading-relaxed">
                Fique atualizado com os lançamentos mais recentes.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-verde hover:bg-gray-100 hover:text-verde font-semibold shadow-lg"
              >
                <Link to="/releases">Ver Releases</Link>
              </Button>
            </div>
          </div>

          {/* 4. Seja Revendedor */}
          <div className="relative overflow-hidden rounded-xl shadow-md border-0 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all group min-h-[180px]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://img.usecurling.com/p/1200/600?q=business%20woman%20smiling')",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 text-left flex-1 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md">
                Quero ser revendedor
              </h3>
              <p className="text-white/90 text-lg font-light drop-shadow-sm leading-relaxed">
                Junte-se ao nosso time de revendedores e comece a ganhar.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-verde hover:bg-gray-100 hover:text-verde font-semibold shadow-lg"
              >
                <Link to="/seja-revendedor">Quero Agora</Link>
              </Button>
            </div>
          </div>

          {/* 5. Sobre a Avatim */}
          <div className="relative overflow-hidden rounded-xl shadow-md border-0 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all group min-h-[180px]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://img.usecurling.com/p/1200/600?q=nature%20spa%20botanical')",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 text-left flex-1 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md">
                Sobre a Avatim
              </h3>
              <p className="text-white/90 text-lg font-light drop-shadow-sm leading-relaxed">
                Empresa líder em fragrâncias e produtos de bem-estar com mais de
                20 anos de experiência.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-verde hover:bg-gray-100 hover:text-verde font-semibold shadow-lg"
              >
                <Link to="/avatim">Saiba Mais</Link>
              </Button>
            </div>
          </div>

          {/* 6. Sobre a Sensatio */}
          <div className="relative overflow-hidden rounded-xl shadow-md border-0 p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:shadow-xl transition-all group min-h-[180px]">
            <div
              className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-105"
              style={{
                backgroundImage:
                  "url('https://img.usecurling.com/p/1200/600?q=team%20meeting%20office%20happy')",
              }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />

            <div className="relative z-10 text-left flex-1 max-w-2xl">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md">
                Sobre a Sensatio
              </h3>
              <p className="text-white/90 text-lg font-light drop-shadow-sm leading-relaxed">
                Parceira oficial dedicada a capacitar revendedores com suporte
                completo.
              </p>
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full md:w-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto bg-white text-verde hover:bg-gray-100 hover:text-verde font-semibold shadow-lg"
              >
                <Link to="/sensatio">Saiba Mais</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
