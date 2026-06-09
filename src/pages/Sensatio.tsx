import { Card, CardContent } from '@/components/ui/card'
import seletoBanner from '@/assets/linhas-seleto-223b7.jpg'

export default function SensatioPage() {
  return (
    <div className="flex flex-col w-full animate-fade-in-up">
      <section className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] flex items-center justify-center overflow-hidden bg-[#163029]">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${seletoBanner})` }}
        />
        <div className="absolute inset-0 z-0 bg-[#163029]/20 mix-blend-multiply" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/30 via-transparent to-transparent" />
      </section>

      <section id="historia" className="py-20 bg-background">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
                Sobre Sensatio
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
                <p>
                  A Sensatio Distribuidora nasceu em agosto de 2011, em Itabuna,
                  Bahia, com um propósito claro: tornar-se uma das maiores
                  distribuidoras do Brasil, impulsionando o desenvolvimento
                  regional e gerando oportunidades para a comunidade baiana.
                  Como uma empresa genuinamente baiana, temos orgulho das nossas
                  raízes. Ao longo da nossa história, atuamos não apenas como um
                  canal de distribuição, mas como um agente ativo no
                  fortalecimento da economia local, promovendo:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Geração de empregos</li>
                  <li>Desenvolvimento da economia regional</li>
                  <li>Fortalecimento das cadeias produtivas</li>
                </ul>
                <p>
                  Nosso crescimento está diretamente ligado à qualidade dos
                  produtos que representamos e à solidez das nossas parcerias.
                  Trabalhamos com fornecedores cuidadosamente selecionados,
                  garantindo excelência em tudo o que entregamos. Com essa
                  estratégia, expandimos nossa atuação para diversos estados do
                  país, tornando-nos referência em distribuição e comprovando
                  nossa capacidade de inovar, romper barreiras e conquistar
                  novos mercados. A Sensatio é movida por excelência, confiança
                  e dedicação — valores que acompanham cada etapa da nossa
                  história e fortalecem nossa relação com parceiros e clientes.
                </p>
              </div>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://img.usecurling.com/p/800/600?q=business%20meeting"
                alt="Equipe Sensatio"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg order-2 lg:order-1">
              <img
                src="https://img.usecurling.com/p/800/600?q=logistics%20success"
                alt="Nossa Missão"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-6 order-1 lg:order-2">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary">
                Missão
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Impulsionar o sucesso de nossos parceiros comerciais oferecendo
                logística ágil, treinamento especializado e um atendimento
                humanizado, consolidando a Sensatio como a melhor distribuidora
                Avatim da região.
              </p>
            </div>
          </div>

          <div className="mb-24">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary text-center mb-12">
              Valores
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  image:
                    'https://img.usecurling.com/p/400/400?q=premium%20quality',
                  title: 'Excelência',
                  desc: 'Buscar o melhor em cada processo.',
                },
                {
                  image:
                    'https://img.usecurling.com/p/400/400?q=business%20handshake',
                  title: 'Compromisso',
                  desc: 'Honrar prazos, parcerias e relacionamentos.',
                },
                {
                  image:
                    'https://img.usecurling.com/p/400/400?q=solid%20architecture',
                  title: 'Confiança',
                  desc: 'Construir relações sólidas e transparentes.',
                },
                {
                  image:
                    'https://img.usecurling.com/p/400/400?q=innovation%20light',
                  title: 'Inovação',
                  desc: 'Evoluir constantemente para atender às novas demandas do mercado.',
                },
                {
                  image:
                    'https://img.usecurling.com/p/400/400?q=nature%20landscape',
                  title: 'Responsabilidade Regional',
                  desc: 'Contribuir para o crescimento econômico da Bahia e do Brasil.',
                },
              ].map((val, i) => (
                <Card
                  key={i}
                  className="text-center shadow-md border-primary/10 hover:-translate-y-1 transition-transform h-full"
                >
                  <CardContent className="pt-8 pb-8 flex flex-col items-center h-full">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-6 mx-auto border-4 border-primary/10">
                      <img
                        src={val.image}
                        alt={val.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-primary mb-3">
                      {val.title}
                    </h3>
                    <p className="text-muted-foreground flex-1">{val.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
