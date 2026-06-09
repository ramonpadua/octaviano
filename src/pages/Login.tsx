import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '@/assets/logo-sensatio-branca-a7f1f.png'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast({
        title: 'Erro ao entrar',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Login bem-sucedido',
        description: 'Bem-vindo ao painel administrativo.',
      })
      navigate('/admin')
    }

    setLoading(false)
  }

  return (
    <div className="container py-20 flex-1 flex flex-col items-center justify-center animate-fade-in-up">
      <Card className="w-full max-w-md shadow-lg border-primary/10">
        <CardHeader className="text-center bg-primary/5 border-b border-primary/10 pb-6 flex flex-col items-center">
          <Link to="/" className="mb-4 inline-block">
            <img
              src={logo}
              alt="Sensatio Distribuidora"
              className="h-16 w-auto object-contain"
            />
          </Link>
          <CardTitle className="font-serif text-2xl text-primary">
            Acesso Restrito
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sensatio.com"
                required
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-foreground"
              >
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base mt-6"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
              </span>
              <Link
                to="/register"
                className="text-sm text-primary hover:underline font-semibold"
              >
                Cadastre-se
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
