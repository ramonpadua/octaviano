import { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@/components/ui/button'
import { LogOut, Users, FileText, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

import { Link, NavLink, Outlet } from 'react-router-dom'

const logo = 'https://img.usecurling.com/i?q=sensatio&color=white'

export default function AdminPage() {
  const { user, signOut } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)] w-full bg-muted/5 animate-fade-in-up">
      {/* Mobile Header for Sidebar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-background">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Sensatio Distribuidora"
            className="h-8 w-auto object-contain invert mix-blend-multiply"
          />
          <h2 className="font-serif font-bold text-xl text-primary">Admin</h2>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'w-full md:w-64 border-r bg-background p-6 flex-col gap-2 shadow-sm',
          isMobileMenuOpen ? 'flex' : 'hidden md:flex',
        )}
      >
        <div className="hidden md:block mb-8">
          <Link to="/" className="inline-block mb-6">
            <img
              src={logo}
              alt="Sensatio Distribuidora"
              className="h-12 w-auto object-contain invert mix-blend-multiply"
            />
          </Link>
          <h2 className="font-serif font-bold text-2xl text-primary">
            Painel Admin
          </h2>
          <p
            className="text-sm text-muted-foreground truncate"
            title={user?.email || ''}
          >
            {user?.email}
          </p>
        </div>
        <nav className="space-y-2 flex-1">
          <NavLink
            to="/admin/revendedores"
            className="w-full block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {({ isActive }) => (
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  !isActive && 'text-muted-foreground hover:bg-secondary/50',
                )}
              >
                <Users className="mr-2 h-4 w-4" /> Gestão de Revendedores
              </Button>
            )}
          </NavLink>

          <NavLink
            to="/admin/pdfs"
            className="w-full block mt-2"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {({ isActive }) => (
              <Button
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  !isActive && 'text-muted-foreground hover:bg-secondary/50',
                )}
              >
                <FileText className="mr-2 h-4 w-4" /> Gestão de PDFs
              </Button>
            )}
          </NavLink>
        </nav>
        <Button
          variant="outline"
          className="mt-auto w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  )
}
