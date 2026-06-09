routerAdd('OPTIONS', '/backend/v1/send-reseller-email', (e) => {
  e.response.header().set('Access-Control-Allow-Origin', '*')
  e.response.header().set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  e.response
    .header()
    .set('Access-Control-Allow-Headers', 'authorization, content-type, apikey')
  return e.noContent(204)
})

routerAdd('POST', '/backend/v1/send-reseller-email', (e) => {
  e.response.header().set('Access-Control-Allow-Origin', '*')

  console.log('Start request: /backend/v1/send-reseller-email')

  const body = e.requestInfo().body || {}
  console.log('Payload received:', JSON.stringify(body))

  const { name, email, phone, cnpj, companyName, city, state, message } = body

  const missing = []
  if (!name) missing.push('nome')
  if (!email) missing.push('email')
  if (!phone) missing.push('telefone')

  if (missing.length > 0) {
    console.log('Validation failed. Missing fields:', missing.join(', '))
    return e.json(400, {
      success: false,
      error: `Campos obrigatórios ausentes: ${missing.join(', ')}`,
    })
  }

  const apiKey = $secrets.get('RESEND_API_KEY')
  if (!apiKey) {
    console.log('Secret missing: RESEND_API_KEY não configurada')
    return e.internalServerError('RESEND_API_KEY não está configurada')
  }

  try {
    const collection = $app.findCollectionByNameOrId('revendedores')
    const record = new Record(collection)
    record.set('nome', name)
    record.set('email', email)
    record.set('whatsapp', phone)
    record.set('cpf_cnpj', cnpj || '')
    record.set('cidade', city || '')
    record.set('estado', state || '')
    record.set('status', 'pendente')
    record.set('ip_address', e.request.remoteAddr)
    $app.save(record)
  } catch (err) {
    console.log('DB save failed (ignored):', err.message)
  }

  const idempotencyKey = `revendedor/${email}/${Date.now()}`

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #f5f5f5; padding: 20px; text-align: center; border-bottom: 1px solid #ddd;">
        <h2 style="color: #333; margin: 0;">Novo Lead - Revendedor</h2>
      </div>
      <div style="padding: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold; width: 40%;">Nome Completo</td>
            <td style="padding: 10px 0;">${name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Email</td>
            <td style="padding: 10px 0;">${email}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Telefone/WhatsApp</td>
            <td style="padding: 10px 0;">${phone}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">CNPJ / CPF</td>
            <td style="padding: 10px 0;">${cnpj || '-'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Nome da Empresa</td>
            <td style="padding: 10px 0;">${companyName || '-'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; font-weight: bold;">Cidade / Estado</td>
            <td style="padding: 10px 0;">${city || '-'} - ${state || '-'}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; font-weight: bold;" colspan="2">Mensagem</td>
          </tr>
          <tr>
            <td style="padding: 0 0 10px 0; background-color: #f9f9f9; padding: 10px; border-radius: 4px;" colspan="2">${message || '-'}</td>
          </tr>
        </table>
      </div>
    </div>
  `

  console.log('Calling Resend API...')

  try {
    const res = $http.send({
      url: 'https://api.resend.com/emails',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify({
        from: 'Sensatio Cadastros <cadastro@sensatio.com.br>',
        to: ['sensatioavatim@gmail.com'],
        reply_to: email,
        subject: `Novo cadastro de revendedor: ${name}`,
        html: htmlContent,
        tags: [{ name: 'category', value: 'lead_revendedor' }],
      }),
      timeout: 15,
    })

    console.log('Resend response status:', res.statusCode)

    if (res.statusCode >= 200 && res.statusCode < 300) {
      console.log('Successfully delivered email to sensatioavatim@gmail.com')
    }

    if (res.statusCode >= 300) {
      console.log('Resend error response:', JSON.stringify(res.json))
      return e.json(400, {
        success: false,
        error: res.json || 'Erro ao enviar email',
      })
    }

    return e.json(200, { success: true, id: res.json?.id })
  } catch (err) {
    console.log('Resend transport error:', err.message)
    return e.json(500, {
      success: false,
      error: 'Erro de comunicação com o provedor de email',
    })
  }
})
