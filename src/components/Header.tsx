import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/use-auth'

import logo from '@/assets/logomarca-sensatio-3d-sem-fundo-branco-a9ada.png'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = () => {
    signOut()
    navigate('/')
  }

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Catálogo', path: '/catalogo' },
    { name: 'Book Portfólio Avatim', path: '/booking' },
    { name: 'Releases', path: '/releases' },
    { name: 'Treinamentos', path: '/treinamentos' },
    { name: 'Seja Revendedor', path: '/seja-revendedor' },
    { name: 'Fale Conosco', path: '/fale-conosco' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-sm border-b border-light">
      <div className="container flex h-20 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Sensatio Distribuidora"
            className="h-[50px] w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'text-sm font-medium transition-colors hover:text-verde',
                location.pathname === link.path
                  ? 'text-verde font-semibold'
                  : 'text-metallic',
              )}
            >
              {link.name}
            </Link>
          ))}
          {user && user.email === 'burgosoctaviano@gmail.com' && (
            <Link
              to="/admin/upload-pdf"
              className={cn(
                'text-sm font-medium transition-colors hover:text-verde',
                location.pathname.startsWith('/admin')
                  ? 'text-verde font-semibold'
                  : 'text-metallic',
              )}
            >
              Admin
            </Link>
          )}
          {!user ? (
            <Link
              to="/login"
              className={cn(
                'text-sm font-medium transition-colors hover:text-verde',
                location.pathname === '/login'
                  ? 'text-verde font-semibold'
                  : 'text-metallic',
              )}
            >
              Login
            </Link>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-metallic hover:text-red-600 ml-4"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          )}
        </nav>

        <Button
          variant="ghost"
          className="lg:hidden px-2 text-metallic hover:bg-light hover:text-verde"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {isOpen && (
        <div className="lg:hidden border-t border-light bg-white px-4 py-6 space-y-6 shadow-lg overflow-y-auto max-h-[calc(100vh-5rem)]">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block text-base font-medium transition-colors',
                location.pathname === link.path
                  ? 'text-verde'
                  : 'text-metallic hover:text-verde',
              )}
            >
              {link.name}
            </Link>
          ))}
          {user && user.email === 'burgosoctaviano@gmail.com' && (
            <Link
              to="/admin/upload-pdf"
              onClick={() => setIsOpen(false)}
              className={cn(
                'block text-base font-medium transition-colors',
                location.pathname.startsWith('/admin')
                  ? 'text-verde'
                  : 'text-metallic hover:text-verde',
              )}
            >
              Admin
            </Link>
          )}
          {!user ? (
            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className={cn(
                'block text-base font-medium transition-colors',
                location.pathname === '/login'
                  ? 'text-verde'
                  : 'text-metallic hover:text-verde',
              )}
            >
              Login
            </Link>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false)
                handleLogout()
              }}
              className="w-full justify-start text-metallic hover:text-red-600 p-0"
            >
              <LogOut className="h-5 w-5 mr-2" />
              <span className="text-base font-medium">Sair</span>
            </Button>
          )}
        </div>
      )}
    </header>
  )
}
