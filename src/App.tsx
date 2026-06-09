/* Main App Component - Handles routing (using react-router-dom), query client and other providers */
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/hooks/use-auth'
import { PocketBaseProvider } from '@/contexts/PocketBaseContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

import Layout from './components/Layout'
import { GlobalAdminFab } from './components/admin/GlobalAdminFab'
import Index from './pages/Index'
import ProdutosPage from './pages/Produtos'
import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'
import { CatalogErrorBoundary } from './components/CatalogErrorBoundary'

import LinhasAvatimPage from './pages/LinhasAvatim'
import AvatimPage from './pages/Avatim'
import SensatioPage from './pages/Sensatio'
import ResellerPage from './pages/Reseller'
import BookingPage from './pages/Booking'
import ReleasesPage from './pages/Releases'
import TreinamentosPage from './pages/Treinamentos'
import LoginPage from './pages/Login'
import SignUpPage from './pages/SignUp'
import AdminPage from './pages/Admin'
import FaleConoscoPage from './pages/FaleConosco'
import AdminUploadPdf from './pages/AdminUploadPdf'
import { ProtectedRoute } from './components/ProtectedRoute'
import NotFound from './pages/NotFound'
import { RevendedoresTab } from './components/admin/RevendedoresTab'
import { Navigate } from 'react-router-dom'

const CatalogoPage = lazy(() => import('./pages/Catalogo'))

const CatalogLoadingFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-[#d1ccbd]/20 text-[#163029] w-full">
    <Loader2 className="w-12 h-12 mb-4 animate-spin text-[#c97d31]" />
    <h2 className="text-xl font-serif font-bold animate-pulse">
      Carregando Catálogo...
    </h2>
  </div>
)

const App = () => (
  <PocketBaseProvider>
    <AuthProvider>
      <BrowserRouter
        future={{ v7_startTransition: false, v7_relativeSplatPath: false }}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <GlobalAdminFab />
          <ErrorBoundary
            fallback={({ error, resetErrorBoundary }) => (
              <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-600 p-8 text-center w-full">
                <h1 className="text-3xl font-bold mb-4">Erro Crítico</h1>
                <p className="text-xl opacity-80 mb-8 max-w-lg">
                  A aplicação encontrou um problema e não pôde continuar.
                  <br />
                  <span className="text-sm mt-2 block opacity-75">
                    {error.message}
                  </span>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={resetErrorBoundary}
                    className="px-8 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Tentar Novamente
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-8 py-3 bg-white text-red-600 border border-red-200 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Recarregar Página
                  </button>
                </div>
              </div>
            )}
          >
            <Routes>
              <Route element={<Layout />}>
                <Route
                  path="/"
                  element={
                    <ErrorBoundary>
                      <Index />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/produtos"
                  element={
                    <ErrorBoundary>
                      <ProdutosPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/catalogo"
                  element={
                    <CatalogErrorBoundary>
                      <Suspense fallback={<CatalogLoadingFallback />}>
                        <CatalogoPage />
                      </Suspense>
                    </CatalogErrorBoundary>
                  }
                />
                <Route
                  path="/booking"
                  element={
                    <ErrorBoundary>
                      <BookingPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/releases"
                  element={
                    <ErrorBoundary>
                      <ReleasesPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/treinamentos"
                  element={
                    <ErrorBoundary>
                      <TreinamentosPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/linhas-avatim"
                  element={
                    <ErrorBoundary>
                      <LinhasAvatimPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/avatim"
                  element={
                    <ErrorBoundary>
                      <AvatimPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/sensatio"
                  element={
                    <ErrorBoundary>
                      <SensatioPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/seja-revendedor"
                  element={
                    <ErrorBoundary>
                      <ResellerPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/fale-conosco"
                  element={
                    <ErrorBoundary>
                      <FaleConoscoPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <ErrorBoundary>
                      <LoginPage />
                    </ErrorBoundary>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <ErrorBoundary>
                      <SignUpPage />
                    </ErrorBoundary>
                  }
                />
                <Route element={<ProtectedRoute />}>
                  <Route
                    path="/admin"
                    element={
                      <ErrorBoundary>
                        <AdminPage />
                      </ErrorBoundary>
                    }
                  >
                    <Route
                      index
                      element={<Navigate to="/admin/revendedores" replace />}
                    />
                    <Route
                      path="revendedores"
                      element={
                        <ErrorBoundary>
                          <RevendedoresTab />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="pdfs"
                      element={
                        <ErrorBoundary>
                          <AdminUploadPdf />
                        </ErrorBoundary>
                      }
                    />
                    <Route
                      path="upload-pdf"
                      element={<Navigate to="/admin/pdfs" replace />}
                    />
                  </Route>
                  <Route
                    path="/upload-pdf"
                    element={<Navigate to="/admin/pdfs" replace />}
                  />
                </Route>
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </TooltipProvider>
      </BrowserRouter>
    </AuthProvider>
  </PocketBaseProvider>
)

export default App
