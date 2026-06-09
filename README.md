# Projeto Criado com o Skip

Este projeto foi criado de ponta a ponta com o [Skip](https://goskip.dev).

## 🚀 Stack Tecnológica

- **React 19** - Biblioteca JavaScript para construção de interfaces
- **Vite** - Build tool extremamente rápida
- **TypeScript** - Superset tipado do JavaScript
- **Shadcn UI** - Componentes reutilizáveis e acessíveis
- **Tailwind CSS** - Framework CSS utility-first
- **React Router** - Roteamento para aplicações React
- **React Hook Form** - Gerenciamento de formulários performático
- **Zod** - Validação de schemas TypeScript-first
- **Recharts** - Biblioteca de gráficos para React

## 📋 Pré-requisitos

- Node.js 18+
- npm

## 🔧 Instalação

```bash
npm install
```

## 💻 Scripts Disponíveis

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm start
# ou
npm run dev
```

Abre a aplicação em modo de desenvolvimento em [http://localhost:5173](http://localhost:5173).

### Build

```bash
# Build para produção
npm run build

# Build para desenvolvimento
npm run build:dev
```

Gera os arquivos otimizados para produção na pasta `dist/`.

### Preview

```bash
# Visualizar build de produção localmente
npm run preview
```

Permite visualizar a build de produção localmente antes do deploy.

### Linting e Formatação

```bash
# Executar linter
npm run lint

# Executar linter e corrigir problemas automaticamente
npm run lint:fix

# Formatar código com Prettier
npm run format
```

## 📁 Estrutura do Projeto

```
.
├── src/              # Código fonte da aplicação
├── public/           # Arquivos estáticos
├── dist/             # Build de produção (gerado)
├── node_modules/     # Dependências (gerado)
└── package.json      # Configurações e dependências do projeto
```

## 🎨 Componentes UI

Este template inclui uma biblioteca completa de componentes Shadcn UI baseados em Radix UI:

- Accordion
- Alert Dialog
- Avatar
- Button
- Checkbox
- Dialog
- Dropdown Menu
- Form
- Input
- Label
- Select
- Switch
- Tabs
- Toast
- Tooltip
- E muito mais...

## 📝 Ferramentas de Qualidade de Código

- **TypeScript**: Tipagem estática
- **ESLint**: Análise de código estático
- **Oxlint**: Linter extremamente rápido
- **Prettier**: Formatação automática de código

## 🔄 Workflow de Desenvolvimento

1. Instale as dependências: `npm install`
2. Inicie o servidor de desenvolvimento: `npm start`
3. Faça suas alterações
4. Verifique o código: `npm run lint`
5. Formate o código: `npm run format`
6. Crie a build: `npm run build`
7. Visualize a build: `npm run preview`

## 📦 Build e Deploy

Para criar uma build otimizada para produção:

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/` e estarão prontos para deploy.

## 📧 Configuração de E-mail (Resend)

Para habilitar o envio de e-mails de notificação de novos revendedores, siga os passos abaixo:

1. **Configurar o Secret no Skip Cloud:**
   - Acesse o painel do seu projeto no Skip Cloud.
   - Navegue até a seção de Secrets/Environment Variables.
   - Adicione um novo secret chamado `RESEND_API` contendo a sua chave de API do Resend.

2. **Verificar o Domínio:**
   - Acesse o painel do [Resend](https://resend.com).
   - Vá até "Domains" e adicione o domínio que será utilizado para enviar os e-mails (ex: `sensatio.com.br`).
   - Siga as instruções de DNS fornecidas pelo Resend para verificar o domínio.

3. **Atualizar o Remetente no Código:**
   - Abra o arquivo `pocketbase/hooks/send_reseller_email.js`.
   - Localize o parâmetro `from` na chamada do Resend.
   - Substitua `cadastro@YOUR_VERIFIED_DOMAIN.com.br` pelo endereço verificado na etapa anterior (ex: `cadastro@sensatio.com.br`).
