import { Button } from '@/components/ui/button'
import whatsappImg from '../assets/editedimage1780018858483-25846.png'
import instagramImg from '../assets/photo-2026-05-24-19-32-27-00c49.jpg'

export default function FaleConoscoPage() {
  return (
    <div className="flex flex-col flex-1 bg-light min-h-screen animate-fade-in-up">
      <section className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden min-h-[400px]">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://img.usecurling.com/p/1920/1080?q=cosmetics%20nature')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-black/60" />
        <div className="container relative z-10 text-center flex flex-col items-center px-4">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 drop-shadow-lg">
            Fale Conosco
          </h1>
          <p className="text-xl md:text-2xl text-bege max-w-2xl drop-shadow-md">
            Estamos aqui para ajudar. Escolha o melhor canal para entrar em
            contato com nossa equipe.
          </p>
        </div>
      </section>

      <section className="py-20 md:py-32 w-full bg-white">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Banner 1 - WhatsApp */}
            <div className="relative group overflow-hidden rounded-2xl shadow-xl min-h-[450px] flex flex-col justify-end p-8 transition-transform hover:-translate-y-2">
              <div
                className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${whatsappImg})`,
                }}
              />
              <div className="absolute inset-0 z-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <h3 className="text-3xl font-serif font-bold text-white mb-4">
                  WhatsApp
                </h3>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Atendimento rápido e personalizado para tirar suas dúvidas e
                  realizar pedidos.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full text-lg h-14 bg-verde hover:bg-verde/90 text-white"
                >
                  <a
                    href="https://wa.me/5573991861221"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Iniciar Conversa
                  </a>
                </Button>
              </div>
            </div>

            {/* Banner 2 - Instagram */}
            <div className="relative group overflow-hidden rounded-2xl shadow-xl min-h-[450px] flex flex-col justify-end p-8 transition-transform hover:-translate-y-2">
              <div
                className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 group-hover:scale-110"
                style={{
                  backgroundImage: `url(${instagramImg})`,
                }}
              />
              <div className="absolute inset-0 z-0 bg-black/60 group-hover:bg-black/70 transition-colors duration-500" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <h3 className="text-3xl font-serif font-bold text-white mb-4">
                  Instagram
                </h3>
                <p className="text-white/90 text-lg mb-8 leading-relaxed">
                  Acompanhe nossas redes sociais para ficar por dentro das
                  novidades e lançamentos.
                </p>
                <Button
                  asChild
                  size="lg"
                  className="w-full text-lg h-14 bg-verde hover:bg-verde/90 text-white"
                >
                  <a
                    href="https://instagram.com/sensatioavatim"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver Perfil
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
