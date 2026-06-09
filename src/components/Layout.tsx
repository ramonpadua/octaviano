import { Link, Outlet } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { Header } from './Header'
import logo from '@/assets/logo-sensatio-branca-a7f1f.png'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground font-sans selection:bg-brand/20">
      <Header />
      <main className="flex-1 flex flex-col relative">
        <Outlet />
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 items-end">
        <Link
          to="/seja-revendedor"
          className="flex items-center justify-center gap-2 bg-verde hover:bg-verde/90 text-white rounded-full shadow-lg transition-transform hover:scale-105 h-[50px] w-[50px] md:h-[60px] md:w-auto md:px-6 group"
          aria-label="Seja Revendedor"
        >
          <span className="hidden md:inline font-medium text-lg whitespace-nowrap">
            Seja Revendedor
          </span>
          <svg
            className="h-6 w-6 md:h-7 md:w-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
            />
          </svg>
        </Link>

        <a
          href="https://wa.me/5573991861221"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-lg transition-transform hover:scale-105 h-[50px] w-[50px] md:h-[60px] md:w-auto md:px-6 group"
          aria-label="Fale Conosco via WhatsApp"
        >
          <span className="hidden md:inline font-medium text-lg whitespace-nowrap">
            Fale Conosco
          </span>
          <MessageCircle className="h-6 w-6 md:h-8 md:w-8" />
        </a>
      </div>

      <footer className="py-12 md:py-16 mt-auto bg-verde text-white">
        <div className="container flex flex-col items-center justify-between gap-8 md:flex-row">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Sensatio Distribuidora"
              className="h-12 w-auto object-contain mix-blend-screen invert grayscale brightness-200"
            />
          </Link>
          <p className="text-center text-sm leading-loose text-white/70 md:text-left">
            © {new Date().getFullYear()} Sensatio Distribuidora. Todos os
            direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
