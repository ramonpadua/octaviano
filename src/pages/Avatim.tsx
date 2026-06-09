import { Card, CardContent } from '@/components/ui/card'
import avatimLogo from '../assets/avatim_logotipo-02-1e487.png'

export default function AvatimPage() {
  return (
    <div className="flex flex-col w-full animate-fade-in-up">
      <section className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden bg-[#163029]">
        <div
          className="absolute inset-0 z-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://img.usecurling.com/p/1920/1080?q=nature%20waterfall%20forest')",
          }}
        />
        <div className="absolute inset-0 z-0 bg-[#163029]/60 mix-blend-multiply" />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/40 via-transparent to-[#163029]/90" />
        <div className="container relative z-10 text-center flex flex-col items-center px-4">
          <img
            src={avatimLogo}
            alt="Avatim Logotipo"
            className="h-20 md:h-[100px] w-auto mb-6 object-contain mix-blend-screen invert grayscale brightness-200 drop-shadow-sm"
          />
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Sobre a Avatim
          </h1>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary">
                QUEM SOMOS
              </h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-justify">
                <p>
                  Somos a marca pioneira em perfumes para ambientes e nosso
                  propósito é proporcionar refúgios de boas sensações através de
                  produtos de autocuidado e bem-estar.
                </p>
                <p>
                  Nossas fragrâncias são únicas e traduzem a essência do nosso
                  nome: Avatim, em Tupi, significa cheiros da terra. É nos
                  frutos, flores e aromas da nossa biodiversidade que
                  encontramos a matéria-prima perfeita para transformar
                  inspiração em criações autênticas.
                </p>
                <p>
                  Acreditamos que os sentidos são uma ferramenta poderosa de
                  conexão com as pessoas, com aquilo que nos cerca e com o nosso
                  mundo interior.
                </p>
                <p>
                  Por isso, apostamos na combinação criativa entre os elementos
                  da natureza para desenvolver itens para o corpo e para a casa
                  que despertam a sensibilidade e promovem momentos de aconchego
                  e afetividade.
                </p>
                <p>
                  Somos um time apaixonado por transformar vidas através do
                  mercado de bem-estar, de forma funcional e sustentável.
                  Sabemos que cada ser humano é único e acreditamos que a melhor
                  maneira de propagar nossas raízes brasileiras é buscando a
                  inovação constante, apoiados na transparência das relações e
                  no comprometimento com a sociedade e o meio ambiente.
                </p>
                <p>
                  Construímos diariamente uma marca que reflete a personalidade
                  e a alma do nosso país. Temos muito orgulho de nossas origens
                  e queremos ir cada vez mais longe, sendo referência no ramo de
                  bem-estar.
                </p>
              </div>
            </div>
            <div className="aspect-[4/5] md:aspect-auto md:h-full min-h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <img
                src="https://cdn.vnda.com.br/850x/avatim/2024/07/09/16_7_1_111_BannerSide02.jpg?v=1776875454"
                alt="Banner Quem Somos"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="mb-24">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary text-center mb-12">
              NOSSA HISTÓRIA
            </h2>
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-muted-foreground leading-relaxed text-justify">
              <p>
                Foi em Ilhéus, no sul da Bahia, que fincamos raízes e plantamos
                as primeiras sementes. Nossa primeira fábrica foi montada em
                2002, debaixo de uma barcaça, quando dois amigos tiveram o sonho
                de levar bem-estar para as pessoas.
              </p>
              <p>
                No ano de 2003, a fábrica foi ampliada e, nos anos seguintes,
                crescemos de forma rápida e exponencial, graças a muitas pessoas
                que se uniram a nós no trabalho e no sonho de construir uma
                marca sólida e diferenciada.
              </p>
              <p>
                Em 2009, inauguramos a nossa primeira loja conceito em Salvador
                e expandimos nossa operação rapidamente em todo o país. Até que,
                no ano de 2017, atravessamos o oceano e chegamos em Portugal. Em
                2024, abrimos a nossa 4° operação em Portugal e queremos
                continuar evoluindo.
              </p>
              <p className="font-medium text-secondary text-center pt-4">
                Esse é apenas o início da nossa história. Por isso, vamos
                continuar espalhando sementes pelo mundo, com os pés bem
                fincados na nossa terra!
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg order-2 md:order-1">
              <img
                src="https://img.usecurling.com/p/800/600?q=brazil%20forest"
                alt="Natureza Brasileira"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-8 order-1 md:order-2">
              <div>
                <h3 className="font-serif text-2xl font-bold text-secondary mb-3">
                  Missão
                </h3>
                <p className="text-muted-foreground text-lg text-justify">
                  Proporcionar bem-estar através de produtos de excelência,
                  inspirados na natureza, valorizando a sustentabilidade e a
                  cultura local, além de gerar oportunidades de negócios para
                  nossos parceiros e revendedores.
                </p>
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-secondary mb-3">
                  Visão
                </h3>
                <p className="text-muted-foreground text-lg text-justify">
                  Ser reconhecida como a principal marca de bem-estar e
                  perfumaria com essência natural do Brasil, expandindo nossa
                  presença nacional e internacional com ética, inovação e
                  responsabilidade socioambiental.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-24">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-secondary text-center mb-12">
              Valores
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  image:
                    'https://img.usecurling.com/p/200/200?q=premium%20quality',
                  title: 'Qualidade',
                  desc: 'Excelência em cada detalhe do produto.',
                },
                {
                  image:
                    'https://img.usecurling.com/p/200/200?q=modern%20innovation',
                  title: 'Inovação',
                  desc: 'Busca constante por novas experiências.',
                },
                {
                  image:
                    'https://img.usecurling.com/p/200/200?q=nature%20sustainability',
                  title: 'Sustentabilidade',
                  desc: 'Respeito e cuidado com o meio ambiente.',
                },
                {
                  image:
                    'https://img.usecurling.com/p/200/200?q=trust%20partnership',
                  title: 'Confiança',
                  desc: 'Relações transparentes e duradouras.',
                },
              ].map((val, i) => (
                <Card
                  key={i}
                  className="text-center border border-muted shadow-sm hover:shadow-md transition-shadow bg-card"
                >
                  <CardContent className="pt-8 pb-8">
                    <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-secondary/10">
                      <img
                        src={val.image}
                        alt={val.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-secondary mb-3">
                      {val.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">{val.desc}</p>
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
