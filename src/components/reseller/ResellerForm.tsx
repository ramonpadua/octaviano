import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { CheckCircle, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { createRevendedor } from '@/services/revendedores'
import { Checkbox } from '@/components/ui/checkbox'

const UFS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const

const formSchema = z.object({
  nome: z.string().min(3, 'Mínimo 3 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z
    .string()
    .min(1, 'Obrigatório')
    .refine((v) => v.replace(/\D/g, '').length >= 10, 'Telefone inválido'),
  cpf_cnpj: z
    .string()
    .min(1, 'Obrigatório')
    .refine((v) => v.replace(/\D/g, '').length >= 11, 'Documento inválido'),
  rg_ie: z.string().min(2, 'Obrigatório'),
  endereco: z.string().min(3, 'Obrigatório'),
  numero_porta: z.string().min(1, 'Obrigatório'),
  bairro: z.string().min(2, 'Obrigatório'),
  cidade: z.string().min(2, 'Obrigatória'),
  estado: z.enum(UFS, {
    required_error: 'Obrigatório',
    invalid_type_error: 'Selecione um Estado',
  }),
  cep: z
    .string()
    .min(8, 'CEP inválido')
    .refine((v) => v.replace(/\D/g, '').length === 8, 'CEP inválido'),
  aceito_normas: z
    .boolean({
      required_error:
        'Você precisa aceitar as normas de vendas para continuar.',
    })
    .refine((val) => val === true, {
      message: 'Você precisa aceitar as normas de vendas para continuar.',
    }),
})

type FormData = z.infer<typeof formSchema>

const InputField = ({
  label,
  name,
  mask,
  placeholder,
  type = 'text',
  register,
  errors,
}: any) => {
  return (
    <div className="w-full">
      <label className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 block text-muted-foreground">
        {label}
      </label>
      <Input
        type={type}
        {...register(name, {
          onChange: mask
            ? (e: React.ChangeEvent<HTMLInputElement>) => {
                const el = e.target
                const start = el.selectionStart
                const val = el.value
                const newVal = mask(val)
                el.value = newVal
                if (start !== null) {
                  const diff = newVal.length - val.length
                  const pos = Math.max(0, start + diff)
                  window.requestAnimationFrame(() => {
                    el.setSelectionRange(pos, pos)
                  })
                }
              }
            : undefined,
        })}
        placeholder={placeholder}
        className="h-12 sm:h-11 text-base transition-colors focus-visible:ring-primary"
      />
      {errors[name] && (
        <p className="text-xs sm:text-sm text-destructive mt-1.5 font-medium">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  )
}

const maskPhone = (v: string) => {
  let x = v.replace(/\D/g, '').slice(0, 11)
  return x
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{4,5})(\d{4})$/, '$1-$2')
}

const maskCnpj = (v: string) => {
  let x = v.replace(/\D/g, '')
  if (x.length <= 11)
    return x
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  x = x.slice(0, 14)
  return x
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

const maskCep = (v: string) => {
  let x = v.replace(/\D/g, '').slice(0, 8)
  return x.replace(/(\d{5})(\d)/, '$1-$2')
}

export function ResellerForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>(
    'idle',
  )
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'onBlur',
    defaultValues: {
      aceito_normas: false,
    },
  })

  const onSubmit = async (data: FormData) => {
    setStatus('submitting')
    try {
      const { aceito_normas, ...apiData } = data
      await createRevendedor({
        ...apiData,
        cpf_cnpj: data.cpf_cnpj.replace(/\D/g, ''),
        whatsapp: data.whatsapp.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
      })
      toast({
        title: 'Cadastro enviado!',
        description: 'Em breve entraremos em contato.',
        className: 'bg-green-50 text-green-900 border-green-200',
      })
      setStatus('success')
      reset()
    } catch (err: any) {
      console.error('Erro na chamada:', err)
      toast({
        title: 'Erro ao enviar',
        description:
          'Não foi possível enviar agora. Tente novamente em instantes.',
        variant: 'destructive',
      })
      setStatus('idle')
    }
  }

  if (status === 'success') {
    return (
      <Card className="shadow-lg border-primary/10 animate-fade-in-up">
        <CardContent className="py-16 text-center space-y-6">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h3 className="text-3xl font-bold text-primary">
            Cadastro Recebido!
          </h3>
          <p className="text-muted-foreground text-lg">
            Em breve nossa equipe entrará em contato para os próximos passos.
          </p>
          <Button size="lg" onClick={() => setStatus('idle')} className="mt-4">
            Enviar Novo Cadastro
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="shadow-lg border-primary/10 overflow-hidden max-w-full">
      <CardHeader className="bg-muted border-b border-primary/10 px-4 py-6 sm:p-6">
        <CardTitle className="font-serif text-2xl sm:text-3xl text-primary text-center">
          Ficha de Cadastro
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-center mt-2">
          Preencha os dados abaixo com atenção e entraremos em contato com você.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 py-6 sm:p-8 sm:pt-8 w-full max-w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full">
            <InputField
              label="Nome Completo"
              name="nome"
              placeholder="Seu nome"
              register={register}
              errors={errors}
            />
            <InputField
              label="Email"
              name="email"
              type="email"
              placeholder="email@exemplo.com"
              register={register}
              errors={errors}
            />
            <InputField
              label="Telefone / WhatsApp"
              name="whatsapp"
              mask={maskPhone}
              placeholder="(11) 99999-9999"
              register={register}
              errors={errors}
            />
            <InputField
              label="CNPJ (ou CPF)"
              name="cpf_cnpj"
              mask={maskCnpj}
              placeholder="00.000.000/0000-00"
              register={register}
              errors={errors}
            />
            <InputField
              label="RG ou IE"
              name="rg_ie"
              placeholder="RG ou Inscrição Estadual"
              register={register}
              errors={errors}
            />
            <InputField
              label="CEP"
              name="cep"
              mask={maskCep}
              placeholder="00000-000"
              register={register}
              errors={errors}
            />
            <div className="md:col-span-2">
              <InputField
                label="Endereço"
                name="endereco"
                placeholder="Rua, Avenida, etc."
                register={register}
                errors={errors}
              />
            </div>
            <InputField
              label="Número"
              name="numero_porta"
              placeholder="123 ou S/N"
              register={register}
              errors={errors}
            />
            <InputField
              label="Bairro"
              name="bairro"
              placeholder="Seu Bairro"
              register={register}
              errors={errors}
            />
            <div className="grid grid-cols-2 gap-4 md:col-span-2">
              <InputField
                label="Cidade"
                name="cidade"
                placeholder="Sua Cidade"
                register={register}
                errors={errors}
              />
              <div className="w-full">
                <label className="text-sm sm:text-base font-semibold mb-1 sm:mb-2 block text-muted-foreground">
                  Estado
                </label>
                <select
                  {...register('estado')}
                  className="flex h-12 sm:h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                >
                  <option value="">UF</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>
                      {uf}
                    </option>
                  ))}
                </select>
                {errors.estado && (
                  <p className="text-xs sm:text-sm text-destructive mt-1.5 font-medium">
                    {errors.estado.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-2 pt-4">
            <Controller
              control={control}
              name="aceito_normas"
              render={({ field }) => (
                <div className="flex flex-row items-center space-x-3">
                  <Checkbox
                    id="aceito_normas"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  <label
                    htmlFor="aceito_normas"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground cursor-pointer"
                  >
                    Li e concordo com as normas de vendas
                  </label>
                </div>
              )}
            />
            {errors.aceito_normas && (
              <p className="text-sm font-medium text-destructive mt-1">
                {errors.aceito_normas.message}
              </p>
            )}
          </div>

          <Button
            disabled={status === 'submitting'}
            size="lg"
            className="w-full h-14 text-lg mt-6 sm:mt-8 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-md"
          >
            {status === 'submitting' && (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            )}
            {status === 'submitting' ? 'Enviando...' : 'Enviar Cadastro'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
