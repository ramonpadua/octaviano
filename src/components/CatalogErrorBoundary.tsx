import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Store } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children?: ReactNode
}

interface State {
  hasError: boolean
}

export class CatalogErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      'Catalog Route Error caught by ErrorBoundary:',
      error,
      errorInfo,
    )

    // Check if it's an SDK exception (e.g. from pocketbase.es.mjs)
    if (
      error.message.includes('Something went wrong') ||
      error.message.includes('autocancellation') ||
      error.stack?.includes('pocketbase')
    ) {
      // Auto-recover after a short delay for SDK transient errors
      setTimeout(() => {
        if (this.state.hasError) {
          this.setState({ hasError: false })
        }
      }, 3000)
    }
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#d1ccbd]/20 text-[#163029] w-full px-4 animate-fade-in">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center border border-[#163029]/10">
            <div className="w-16 h-16 bg-[#c97d31]/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Store className="w-8 h-8 text-[#c97d31]" />
            </div>
            <h2 className="text-2xl font-serif font-bold mb-3 text-[#163029]">
              Recuperando Dados...
            </h2>
            <p className="text-base text-[#5f4b3c] mb-8 leading-relaxed">
              Tivemos uma pequena instabilidade na conexão, estamos recalibrando
              para carregar o catálogo.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false })
              }}
              className="w-full bg-[#163029] text-white hover:bg-[#163029]/90 rounded-xl px-8 h-12 text-lg shadow-lg transition-transform hover:-translate-y-1"
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
