# Diagnóstico da Integração de Email (Resend)

Este documento descreve as etapas de solução de problemas e diagnóstico para a funcionalidade de envio de email de novos revendedores.

## Passo a Passo para Solução de Problemas

**1. Verifique a Aba Network no Browser (DevTools)**

- Abra as Ferramentas do Desenvolvedor (F12) e vá até a aba "Network" (Rede).
- Envie um novo cadastro e procure pela requisição para `send-reseller-email`.
- **Nenhuma requisição disparada**: O erro ocorreu na validação do frontend antes da chamada (verifique a aba Console para erros do Zod/Form).
- **Status 404 (Not Found)**: A função não foi implantada corretamente ou há erro no nome do endpoint.
- **Status 401/403 (Unauthorized/Forbidden)**: Problema de autenticação com a chamada à API do Skip Cloud.
- **Status 500 (Internal Server Error)**: Verifique a mensagem de erro da resposta. Provavelmente a chave `RESEND_API_KEY` está ausente nos Secrets do Skip Cloud.
- **Status 400 (Bad Request)**:
  - Erro de validação de payload (campos obrigatórios faltando).
  - Erro retornado pela API do Resend (ex: domínio de remetente não verificado no painel do Resend, campo incorreto).
- **Status 200 (OK)**: O email foi despachado com sucesso via Resend. Verifique a caixa de entrada ou aba de spam do destinatário (`comercial@sensatio.com.br`).

**2. Implantação e Secrets**
Lembre-se de que se você configurar ou alterar qualquer chave nos Secrets do Skip Cloud (especialmente a `RESEND_API_KEY`), pode ser necessário **reimplantar (redeploy)** a função ou o projeto para que o ambiente de execução (hooks) tenha acesso às novas configurações de ambiente.

**3. Painel de Controle do Resend**

- Acesse o painel oficial em [resend.com](https://resend.com).
- Navegue até a seção "Emails" e busque o histórico mais recente. O Resend fornecerá logs detalhados do status de entrega, indicando "Delivered" (Entregue), "Bounced" (Rejeitado), "Spam", ou o motivo exato de bloqueio.
- Certifique-se de que o domínio remetente (`sensatio.com.br`) possui os registros DNS devidamente configurados e autenticados.

## Considerações de Segurança

- A chave `RESEND_API_KEY` **NUNCA** é exposta no código frontend. O frontend envia estritamente os dados do formulário preenchidos pelo usuário.
- Todo o processo seguro de comunicação com provedores terceirizados (Resend) acontece isolado no backend via os hooks Server-Side do Skip Cloud, mantendo as credenciais invisíveis para o usuário final.
