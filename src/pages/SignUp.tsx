import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import logo from '@/assets/logo-sensatio-branca-a7f1f.png'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { extractFieldErrors } from '@/lib/pocketbase/errors'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFieldErrors({})

    if (password !== confirmPassword) {
      setFieldErrors({ confirmPassword: 'As senhas não coincidem.' })
      return
    }

    setLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      const errors = extractFieldErrors(error)
      setFieldErrors(errors)
      toast({
        title: 'Erro ao cadastrar',
        description: 'Verifique os dados informados e tente novamente.',
        variant: 'destructive',
      })
    } else {
      toast({
        title: 'Cadastro bem-sucedido',
        description: 'Sua conta foi criada com sucesso.',
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
            Criar Conta
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="seu@email.com"
                required
              />
              {fieldErrors.email && (
                <p className="text-sm text-red-500">{fieldErrors.email}</p>
              )}
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
              {fieldErrors.password && (
                <p className="text-sm text-red-500">{fieldErrors.password}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-semibold text-foreground"
              >
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-base mt-6"
              disabled={loading}
            >
              {loading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <div className="mt-4 text-center">
              <span className="text-sm text-muted-foreground">
                Já tem uma conta?{' '}
              </span>
              <Link
                to="/login"
                className="text-sm text-primary hover:underline font-semibold"
              >
                Faça login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
