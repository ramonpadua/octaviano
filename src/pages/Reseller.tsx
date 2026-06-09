import { useState } from 'react'
import { Settings } from 'lucide-react'
import { ResellerForm } from '@/components/reseller/ResellerForm'
import { ResellerNorms } from '@/components/reseller/ResellerNorms'
import { PdfUploadDialog } from '@/components/admin/PdfUploadDialog'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'

import imgDesconto from '@/assets/photo-2026-06-02-20-55-28-3be49.jpg'
import imgSuporte from '@/assets/photo-2026-06-02-20-55-27-745e3.jpg'
import imgBonificacoes from '@/assets/photo-2026-06-02-19-42-53-f193f.jpg'

export default function ResellerPage() {
  const { user } = useAuth()
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  return (
    <div className="flex flex-col w-full animate-fade-in-up flex-1 bg-background">
      {/* Hero Section */}
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center min-h-[500px] overflow-hidden">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://img.usecurling.com/p/1920/1080?q=cosmetics%20nature')",
          }}
        />
        <div className="absolute inset-0 z-0 w-full h-full bg-black/50" />
        <div className="container relative z-10 text-center flex flex-col items-center px-4">
          <img
            src="/logo-branca.png"
            alt="Sensatio"
            className="h-16 md:h-20 w-auto object-contain mb-8 drop-shadow-lg"
            onError={(e) => {
              const target = e.currentTarget
              if (target.src.includes('logo-branca.png')) {
                target.src = '/logo.png'
              } else if (target.src.includes('logo.png')) {
                target.src = '/logo-branca.svg'
              } else {
                target.style.display = 'none'
              }
            }}
          />
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Seja um Revendedor
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl drop-shadow-md">
            Junte-se ao nosso time, leve bem-estar aos seus clientes e conquiste
            sua independência financeira.
          </p>
        </div>
      </section>

      {/* Benefícios Section (3 Columns) */}
      <section className="py-20 md:py-24 bg-background w-full relative">
        <div className="container relative z-10 px-4 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Por que Revender?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Descubra as vantagens exclusivas de ser um parceiro Sensatio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Banner 1 */}
            <div className="relative group overflow-hidden rounded-2xl flex flex-col items-center justify-center text-center p-10 min-h-[320px] shadow-lg border border-border/50">
              <div
                className="absolute inset-0 z-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${imgDesconto})`,
                }}
              />
              <div className="absolute inset-0 z-0 w-full h-full bg-black/50 transition-opacity duration-300 group-hover:bg-black/60" />
              <div className="relative z-10 flex flex-col items-center h-full justify-center">
                <h3 className="text-3xl font-serif font-bold text-white mb-4 drop-shadow-md">
                  Desconto de 30%
                </h3>
                <p className="text-white/90 text-lg drop-shadow-sm max-w-[250px]">
                  Garanta 30% de desconto em todas as suas compras, sem
                  exigência de cotas ou metas.
                </p>
              </div>
            </div>

            {/* Banner 2 */}
            <div className="relative group overflow-hidden rounded-2xl flex flex-col items-center justify-center text-center p-10 min-h-[320px] shadow-lg border border-border/50">
              <div
                className="absolute inset-0 z-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${imgSuporte})`,
                }}
              />
              <div className="absolute inset-0 z-0 w-full h-full bg-black/50 transition-opacity duration-300 group-hover:bg-black/60" />
              <div className="relative z-10 flex flex-col items-center h-full justify-center">
                <h3 className="text-3xl font-serif font-bold text-white mb-4 drop-shadow-md">
                  Suporte Completo
                </h3>
                <p className="text-white/90 text-lg drop-shadow-sm max-w-[250px]">
                  Treinamento especializado e suporte contínuo para o seu
                  crescimento profissional.
                </p>
              </div>
            </div>

            {/* Banner 3 */}
            <div className="relative group overflow-hidden rounded-2xl flex flex-col items-center justify-center text-center p-10 min-h-[320px] shadow-lg border border-border/50">
              <div
                className="absolute inset-0 z-0 w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage: `url(${imgBonificacoes})`,
                }}
              />
              <div className="absolute inset-0 z-0 w-full h-full bg-black/50 transition-opacity duration-300 group-hover:bg-black/60" />
              <div className="relative z-10 flex flex-col items-center h-full justify-center">
                <h3 className="text-3xl font-serif font-bold text-white mb-4 drop-shadow-md">
                  Bonificações
                </h3>
                <p className="text-white/90 text-lg drop-shadow-sm max-w-[250px]">
                  Conheça nossas bonificações em material de consumo e no frete.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Normas Section */}
      <section className="relative py-20 md:py-24 w-full overflow-hidden px-2 sm:px-4">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://img.usecurling.com/p/1920/1080?q=botanical%20professional')",
          }}
        />
        <div className="absolute inset-0 z-0 w-full h-full bg-black/50" />

        <div className="container relative z-10 px-4 max-w-5xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-md">
              Passo 1: Normas de Vendas Sensatio
            </h2>
            <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto drop-shadow-sm px-4">
              Para se tornar um revendedor, é fundamental conhecer nossas
              políticas e diretrizes de vendas.
            </p>
            <ResellerNorms />
          </div>

          {user && (
            <div className="w-full max-w-4xl mx-auto bg-white/95 backdrop-blur-sm border border-primary/20 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg mt-8">
              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold text-primary mb-2 flex items-center gap-2">
                  <Settings className="w-6 h-6" /> Administração de Documentos
                </h3>
                <p className="text-muted-foreground text-lg">
                  Você está autenticado. Atualize o documento de normas e ele
                  refletirá imediatamente para todos os usuários.
                </p>
              </div>
              <Button
                onClick={() => setIsUploadOpen(true)}
                size="lg"
                className="shrink-0 w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Atualizar PDF de Normas
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Cadastro Section */}
      <section className="relative py-20 md:py-32 w-full overflow-hidden">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-fixed"
          style={{
            backgroundImage:
              "url('https://img.usecurling.com/p/1920/1080?q=business%20woman%20smiling')",
          }}
        />
        <div className="absolute inset-0 z-0 w-full h-full bg-black/60" />

        <div className="container relative z-10 px-4 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 drop-shadow-md">
              Passo 2: Cadastre-se
            </h2>
            <p className="text-white/90 text-xl max-w-2xl mx-auto drop-shadow-sm">
              Após ler as Normas de Vendas, preencha o formulário abaixo e
              aguarde que a Sensatio entrará em contato para liberar o acesso ao
              Portal Compras Avatim
            </p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 md:p-10">
            <ResellerForm />
          </div>
        </div>
      </section>

      {user && (
        <PdfUploadDialog
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          fixedTipo="normas"
        />
      )}
    </div>
  )
}
