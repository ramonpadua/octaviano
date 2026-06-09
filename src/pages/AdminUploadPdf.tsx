import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PdfUploadForm } from '@/components/admin/PdfUploadForm'
import { PdfManageTable } from '@/components/admin/PdfManageTable'

export default function AdminUploadPdf() {
  return (
    <div className="max-w-6xl mx-auto py-4 w-full animate-fade-in-up">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-verde">
          Gestão de PDFs
        </h1>
        <p className="text-earth mt-3 max-w-2xl mx-auto">
          Central de controle para catálogos, bookings, releases e treinamentos.
          Faça o upload e deixe a Inteligência Artificial gerar os índices e
          resumos automaticamente.
        </p>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8 bg-bege/30 p-1 rounded-lg">
          <TabsTrigger
            value="upload"
            className="rounded-md data-[state=active]:bg-verde data-[state=active]:text-white transition-all"
          >
            Upload de PDF
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="rounded-md data-[state=active]:bg-verde data-[state=active]:text-white transition-all"
          >
            Gerenciar Arquivos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-0 focus-visible:outline-none">
          <PdfUploadForm />
        </TabsContent>

        <TabsContent value="manage" className="mt-0 focus-visible:outline-none">
          <PdfManageTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}
