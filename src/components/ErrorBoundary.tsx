import React, { Component, ErrorInfo, ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  children?: ReactNode
  fallback?:
    | ReactNode
    | ((props: { error: Error; resetErrorBoundary: () => void }) => ReactNode)
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return this.props.fallback({
            error: this.state.error!,
            resetErrorBoundary: () =>
              this.setState({ hasError: false, error: undefined }),
          })
        }
        return this.props.fallback
      }
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-red-50 text-red-600 rounded-lg border border-red-200 my-4 text-center w-full max-w-2xl mx-auto">
          <AlertTriangle className="w-10 h-10 mb-4 opacity-80" />
          <h2 className="text-lg font-semibold mb-2">Algo deu errado</h2>
          <p className="text-sm opacity-80 mb-6">
            Não foi possível carregar esta seção no momento.{' '}
            {this.state.error?.message}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              this.setState({ hasError: false, error: undefined })
              window.location.reload()
            }}
            className="border-red-200 text-red-600 hover:bg-red-100"
          >
            Tentar novamente
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
