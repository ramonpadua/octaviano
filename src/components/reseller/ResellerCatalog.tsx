import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ResellerCatalog() {
  return (
    <Card className="shadow-lg border-primary/10">
      <CardHeader className="bg-muted border-b border-primary/10">
        <CardTitle className="font-serif text-2xl text-primary">
          Catálogo Avatim
        </CardTitle>
        <CardDescription>
          Explore nosso portfólio completo de produtos para o bem-estar.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-8 pb-8 flex flex-col items-center gap-8">
        <div className="w-full max-w-2xl bg-muted rounded-xl shadow-md overflow-hidden h-[400px] relative flex items-center justify-center">
          <img
            src="https://img.usecurling.com/p/800/450?q=beauty%20catalog"
            alt="Catálogo Avatim"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center space-y-4 max-w-xl">
          <p className="text-muted-foreground">
            Tenha em mãos o catálogo digital completo para compartilhar com seus
            clientes pelo WhatsApp e redes sociais. O material conta com dicas
            de vendas, pirâmides olfativas e informações detalhadas.
          </p>
          <Button size="lg" asChild>
            <Link to="/catalogo">
              <BookOpen className="w-5 h-5 mr-2" /> Acessar Catálogo Digital
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
