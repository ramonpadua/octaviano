import { useState, useEffect, useCallback } from 'react'
import {
  getRevendedores,
  getAllRevendedores,
  updateRevendedor,
  deleteRevendedor,
  type Revendedor,
} from '@/services/revendedores'
import { useRealtime } from '@/hooks/use-realtime'
import { useDebounce } from '@/hooks/use-debounce'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Download,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Trash2,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const StatusBadge = ({ status }: { status?: string }) => {
  switch (status) {
    case 'aprovado':
      return (
        <Badge
          variant="secondary"
          className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-none"
        >
          Aprovado
        </Badge>
      )
    case 'finalizado':
      return <Badge variant="destructive">Rejeitado</Badge>
    default:
      return <Badge variant="secondary">Pendente</Badge>
  }
}

export function RevendedoresTab() {
  const [leads, setLeads] = useState<Revendedor[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)
  const [statusFilter, setStatusFilter] = useState('todos')
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Revendedor | null>(null)
  const [leadToDelete, setLeadToDelete] = useState<Revendedor | null>(null)
  const { toast } = useToast()

  const fetchLeads = useCallback(
    async (isSilent = false) => {
      if (!isSilent) {
        setIsLoading(true)
        setIsError(false)
      }
      try {
        const filters = []
        if (debouncedSearch)
          filters.push(
            `(nome ~ "${debouncedSearch}" || email ~ "${debouncedSearch}" || cpf_cnpj ~ "${debouncedSearch}")`,
          )
        if (statusFilter !== 'todos') filters.push(`status = "${statusFilter}"`)
        const filterString = filters.join(' && ')

        const data = await getRevendedores(page, 10, {
          ...(filterString ? { filter: filterString } : {}),
          sort: '-created',
        })
        setLeads(data.items)
        setTotalItems(data.totalItems)
        setTotalPages(data.totalPages)
      } catch (err) {
        console.error(err)
        if (!isSilent) setIsError(true)
      } finally {
        if (!isSilent) setIsLoading(false)
      }
    },
    [page, debouncedSearch, statusFilter],
  )

  useEffect(() => {
    fetchLeads()
  }, [fetchLeads])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter])

  useRealtime('revendedores', () => {
    fetchLeads(true)
  })

  const handleStatusChange = async (
    id: string,
    status: 'aprovado' | 'finalizado',
  ) => {
    try {
      await updateRevendedor(id, { status })
      toast({
        title: 'Sucesso',
        description:
          status === 'aprovado'
            ? 'Cadastro aprovado com sucesso'
            : 'Cadastro rejeitado',
      })
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async () => {
    if (!leadToDelete?.id) return
    try {
      await deleteRevendedor(leadToDelete.id)
      toast({
        title: 'Sucesso',
        description: 'Cadastro excluído com sucesso.',
      })
      setLeadToDelete(null)
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o cadastro.',
        variant: 'destructive',
      })
    }
  }

  const handleExportCSV = async () => {
    try {
      const allData = await getAllRevendedores({ sort: '-created' })
      if (allData.length === 0) {
        toast({ title: 'Aviso', description: 'Não há dados para exportar.' })
        return
      }
      const headers = [
        'Nome',
        'Email',
        'WhatsApp',
        'CPF/CNPJ',
        'RG/IE',
        'Endereço',
        'Número',
        'Bairro',
        'Cidade',
        'Estado',
        'CEP',
        'Status',
        'Data',
      ]
      const rows = allData.map((lead) => [
        `"${lead.nome || ''}"`,
        `"${lead.email || ''}"`,
        `"${lead.whatsapp || ''}"`,
        `"${lead.cpf_cnpj || ''}"`,
        `"${lead.rg_ie || ''}"`,
        `"${lead.endereco || ''}"`,
        `"${lead.numero_porta || ''}"`,
        `"${lead.bairro || ''}"`,
        `"${lead.cidade || ''}"`,
        `"${lead.estado || ''}"`,
        `"${lead.cep || ''}"`,
        `"${lead.status || ''}"`,
        `"${lead.created ? format(new Date(lead.created), 'dd/MM/yyyy HH:mm') : ''}"`,
      ])
      const csvContent = [
        headers.join(','),
        ...rows.map((r) => r.join(',')),
      ].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute(
        'download',
        `revendedores_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`,
      )
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      toast({
        title: 'Erro',
        description: 'Falha ao exportar dados.',
        variant: 'destructive',
      })
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary">
            Gestão de Revendedores
          </h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as solicitações de novos parceiros.
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => fetchLeads()}
            disabled={isLoading}
            className="flex-1 md:flex-none"
          >
            <RefreshCw
              className={cn('h-4 w-4 mr-2', isLoading && 'animate-spin')}
            />{' '}
            Atualizar
          </Button>
          <Button
            onClick={handleExportCSV}
            className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1 md:flex-none"
          >
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      <div className="bg-background rounded-xl shadow-sm border p-4 md:p-6 mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por nome, email ou CPF/CNPJ..."
              className="pl-9 w-full"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-2">
            <span className="text-sm font-medium whitespace-nowrap hidden sm:inline-block">
              Filtrar por Status:
            </span>
            <select
              className="flex h-10 w-full sm:w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="aprovado">Aprovado</option>
              <option value="finalizado">Rejeitado</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-12 space-y-4 border rounded-xl bg-card">
            <p className="text-destructive font-medium">
              Erro ao carregar os dados.
            </p>
            <Button onClick={() => fetchLeads()} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Tentar Novamente
            </Button>
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 space-y-4 flex flex-col items-center border rounded-xl bg-card/50">
            <div className="p-4 bg-muted rounded-full">
              <Inbox className="h-12 w-12 text-muted-foreground opacity-60" />
            </div>
            <p className="text-lg font-medium text-muted-foreground">
              Nenhum revendedor cadastrado
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="hidden md:block rounded-md border bg-card overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {lead.nome}
                      </TableCell>
                      <TableCell>{lead.email}</TableCell>
                      <TableCell className="whitespace-nowrap">
                        {lead.whatsapp}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {lead.cpf_cnpj}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {lead.cidade}/{lead.estado}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={lead.status} />
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {lead.created
                          ? format(new Date(lead.created), 'dd/MM/yyyy')
                          : '-'}
                      </TableCell>
                      <TableCell className="text-right space-x-2 whitespace-nowrap">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Ver Detalhes"
                          onClick={() => setSelectedLead(lead)}
                        >
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Excluir"
                          onClick={() => setLeadToDelete(lead)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                        {lead.status === 'pendente' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Aprovar"
                              onClick={() =>
                                handleStatusChange(lead.id!, 'aprovado')
                              }
                            >
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              title="Rejeitar"
                              onClick={() =>
                                handleStatusChange(lead.id!, 'finalizado')
                              }
                            >
                              <XCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="md:hidden space-y-4">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="border rounded-lg p-4 bg-card shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 overflow-hidden">
                      <h3
                        className="font-semibold text-lg truncate"
                        title={lead.nome}
                      >
                        {lead.nome}
                      </h3>
                      <p
                        className="text-sm text-muted-foreground truncate"
                        title={lead.email}
                      >
                        {lead.email}
                      </p>
                    </div>
                    <StatusBadge status={lead.status} />
                  </div>
                  <div className="flex gap-2 justify-end pt-3 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <Eye className="h-4 w-4 mr-1" /> Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive hover:bg-destructive/10"
                      onClick={() => setLeadToDelete(lead)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Excluir
                    </Button>
                    {lead.status === 'pendente' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                          onClick={() =>
                            handleStatusChange(lead.id!, 'aprovado')
                          }
                        >
                          <CheckCircle className="h-4 w-4 mr-1" /> Aprovar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between border-t pt-4 gap-4">
              <p className="text-sm text-muted-foreground order-2 sm:order-1">
                Página {page} de {totalPages || 1} ({totalItems} registros)
              </p>
              <div className="flex space-x-2 w-full sm:w-auto justify-between sm:justify-end order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || isLoading}
                >
                  Próxima <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedLead}
        onOpenChange={(open) => !open && setSelectedLead(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw]">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl text-primary border-b pb-4 mb-2">
              Detalhes da Solicitação
            </DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Nome Completo
                </span>
                <p className="font-medium text-base break-words">
                  {selectedLead.nome}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Email
                </span>
                <p className="font-medium text-base break-words">
                  {selectedLead.email}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  WhatsApp / Telefone
                </span>
                <p className="font-medium text-base">{selectedLead.whatsapp}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  CPF/CNPJ
                </span>
                <p className="font-medium text-base">{selectedLead.cpf_cnpj}</p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  RG/IE
                </span>
                <p className="font-medium text-base">
                  {selectedLead.rg_ie || '-'}
                </p>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Status
                </span>
                <div className="mt-1">
                  <select
                    className="flex h-10 w-full sm:w-[180px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    value={selectedLead.status || 'pendente'}
                    onChange={(e) => {
                      const newStatus = e.target.value as
                        | 'pendente'
                        | 'aprovado'
                        | 'finalizado'
                      setSelectedLead({ ...selectedLead, status: newStatus })
                      handleStatusChange(selectedLead.id!, newStatus)
                    }}
                  >
                    <option value="pendente">Pendente</option>
                    <option value="aprovado">Aprovado</option>
                    <option value="finalizado">Rejeitado</option>
                  </select>
                </div>
              </div>
              <div className="sm:col-span-2 space-y-1 mt-2">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Endereço Completo
                </span>
                <p className="font-medium text-base break-words">
                  {selectedLead.endereco}
                  {selectedLead.numero_porta
                    ? `, ${selectedLead.numero_porta}`
                    : ''}
                  {selectedLead.bairro ? ` - ${selectedLead.bairro}` : ''}
                  <br />
                  {selectedLead.cidade} - {selectedLead.estado}
                  {selectedLead.cep ? ` | CEP: ${selectedLead.cep}` : ''}
                </p>
              </div>
              <div className="space-y-1 mt-2">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Data de Cadastro
                </span>
                <p className="font-medium text-base">
                  {selectedLead.created
                    ? format(new Date(selectedLead.created), 'dd/MM/yyyy HH:mm')
                    : '-'}
                </p>
              </div>
              <div className="space-y-1 mt-2">
                <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                  Endereço IP
                </span>
                <p className="font-medium text-base">
                  {selectedLead.ip_address || '-'}
                </p>
              </div>
            </div>
          )}
          <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-3 border-t pt-4">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setSelectedLead(null)}
            >
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!leadToDelete}
        onOpenChange={(open) => !open && setLeadToDelete(null)}
      >
        <DialogContent className="max-w-md w-[95vw]">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl text-destructive">
              Excluir Cadastro
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground my-4">
            Tem certeza que deseja excluir o cadastro de{' '}
            <strong>{leadToDelete?.nome}</strong>? Esta ação não pode ser
            desfeita.
          </p>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setLeadToDelete(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
