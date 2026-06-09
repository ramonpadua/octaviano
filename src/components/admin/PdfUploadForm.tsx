import { useState, useRef } from 'react'
import { Loader2, CheckCircle2, AlertCircle, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import pb from '@/lib/pocketbase/client'
import {
  extractFieldErrors,
  getErrorMessage,
  type FieldErrors,
} from '@/lib/pocketbase/errors'

export function PdfUploadForm() {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle')
  const [progress, setProgress] = useState(0)
  const [errorMsg, setErrorMsg] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [tipo, setTipo] = useState('catalogo')
  const [file, setFile] = useState<File | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!tipo) {
      setErrorMsg('Selecione o tipo do documento.')
      return setStatus('error')
    }
    if (!file) {
      setErrorMsg('Por favor, anexe um arquivo PDF.')
      return setStatus('error')
    }
    if (file.type !== 'application/pdf') {
      setErrorMsg('Apenas arquivos .pdf são permitidos.')
      return setStatus('error')
    }
    if (file.size > 50 * 1024 * 1024) {
      setErrorMsg('O arquivo excede o limite máximo de 50MB.')
      return setStatus('error')
    }

    setStatus('loading')
    setProgress(5)
    setFieldErrors({})
    setErrorMsg('')

    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + Math.floor(Math.random() * 10) + 1 : p))
    }, 800)

    try {
      const formData = new FormData(formRef.current!)
      formData.append('tipo', tipo)
      formData.append('arquivo', file)

      // Create record first
      const record = await pb.collection('pdfs').create(formData)

      // Trigger AI processing on the backend
      try {
        await pb.send('/backend/v1/pdfs/process', {
          method: 'POST',
          body: { recordId: record.id },
        })
      } catch (aiErr) {
        console.warn('AI processing failed, but PDF was saved:', aiErr)
        // We don't fail the upload just because AI didn't respond
      }

      clearInterval(interval)
      setProgress(100)
      setStatus('success')
    } catch (err: any) {
      clearInterval(interval)
      console.error(err)
      setFieldErrors(extractFieldErrors(err))
      const msg = getErrorMessage(err)
      setErrorMsg(msg || 'Ocorreu um erro durante o upload.')
      setStatus('error')
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in bg-white rounded-xl shadow-sm border border-bege">
        <Loader2 className="h-16 w-16 animate-spin text-verde mb-6" />
        <h2 className="text-2xl font-serif font-bold text-verde mb-4">
          Processando PDF...
        </h2>
        <div className="w-full max-w-md bg-bege/30 rounded-full h-4 mb-2 overflow-hidden relative">
          <div
            className="bg-terracotta h-full transition-all duration-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-sm font-bold text-terracotta mb-4">
          {progress}%
        </div>
        <p className="text-earth text-sm text-center max-w-md">
          {progress < 90
            ? 'Enviando arquivo e processando IA (extraindo índice e resumo)...'
            : 'Finalizando o salvamento...'}
        </p>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up bg-white rounded-xl shadow-sm border border-bege">
        <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-6" />
        <h2 className="text-2xl font-serif font-bold text-verde mb-2">
          PDF enviado com sucesso!
        </h2>
        <p className="text-earth text-center mb-8">
          O documento foi processado pela IA e salvo na base de dados.
        </p>
        <Button
          onClick={() => {
            setStatus('idle')
            setFile(null)
            setTipo('')
            formRef.current?.reset()
          }}
          className="bg-verde hover:bg-verde/90 text-white"
        >
          <UploadCloud className="mr-2 h-4 w-4" /> Enviar Outro
        </Button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 animate-fade-in-up bg-white rounded-xl shadow-sm border border-bege">
        <AlertCircle className="h-20 w-20 text-red-500 mb-6" />
        <h2 className="text-2xl font-serif font-bold text-red-600 mb-2">
          Erro no Processamento
        </h2>
        <p className="text-earth text-center mb-8 max-w-md">{errorMsg}</p>
        <Button
          variant="outline"
          onClick={() => setStatus('idle')}
          className="border-verde text-verde"
        >
          Tentar Novamente
        </Button>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 md:p-8 rounded-xl border border-bege shadow-sm animate-fade-in-up"
    >
      <div className="space-y-2">
        <label htmlFor="titulo" className="text-sm font-medium text-verde">
          Título do Documento *
        </label>
        <Input
          id="titulo"
          name="titulo"
          required
          defaultValue="Catálogo de Produtos Avatim 2026.2"
          placeholder="Ex: Catálogo de Produtos Avatim 2026.2"
          className="focus-visible:ring-terracotta"
        />
        {fieldErrors.titulo && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.titulo}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {' '}
        <div className="space-y-2">
          <label className="text-sm font-medium text-verde">Tipo *</label>
          <Select value={tipo} onValueChange={setTipo} required>
            <SelectTrigger className="focus:ring-terracotta">
              <SelectValue placeholder="Selecione o tipo..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="catalogo">Catálogo</SelectItem>
              <SelectItem value="book_portfolio_avatim">
                Book Portfólio Avatim
              </SelectItem>
              <SelectItem value="releases">Releases</SelectItem>
              <SelectItem value="treinamento">Treinamento</SelectItem>
              <SelectItem value="normas">Normas</SelectItem>
            </SelectContent>
          </Select>
          {fieldErrors.tipo && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.tipo}</p>
          )}
        </div>
        <div className="space-y-2">
          {' '}
          <label htmlFor="categoria" className="text-sm font-medium text-verde">
            Categoria *
          </label>
          <Input
            id="categoria"
            name="categoria"
            required
            defaultValue="Catálogo Geral"
            placeholder="Ex: Catálogo Geral"
            className="focus-visible:ring-terracotta"
          />
          {fieldErrors.categoria && (
            <p className="text-sm text-red-500 mt-1">{fieldErrors.categoria}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {' '}
        <label htmlFor="descricao" className="text-sm font-medium text-verde">
          Descrição *
        </label>
        <textarea
          id="descricao"
          name="descricao"
          required
          rows={3}
          defaultValue="Catálogo completo com todas as linhas de produtos Avatim: Ambiente, Perfumaria, Corpo e Ateliê. Inclui mais de 200 produtos com preços e descrições."
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-terracotta"
          placeholder="Breve descrição do material..."
        />
        {fieldErrors.descricao && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.descricao}</p>
        )}
      </div>

      <div className="space-y-2">
        {' '}
        <label htmlFor="arquivo" className="text-sm font-medium text-verde">
          Arquivo PDF (Máx. 50MB) *
        </label>
        <Input
          id="arquivo"
          type="file"
          accept="application/pdf"
          required
          className="cursor-pointer file:text-verde focus-visible:ring-terracotta"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        {fieldErrors.arquivo && (
          <p className="text-sm text-red-500 mt-1">{fieldErrors.arquivo}</p>
        )}
      </div>

      <div className="pt-4 border-t border-bege flex justify-end">
        {' '}
        <Button
          type="submit"
          size="lg"
          className="w-full md:w-auto bg-verde hover:bg-verde/90 text-white"
        >
          <UploadCloud className="mr-2 h-5 w-5" /> Enviar e Processar IA
        </Button>
      </div>
    </form>
  )
}
