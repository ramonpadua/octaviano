onRecordAfterCreateSuccess((e) => {
  try {
    const record = e.record
    const resendApiKey = $secrets.get('RESEND_API_KEY')

    if (!resendApiKey) {
      $app
        .logger()
        .info(
          'RESEND_API_KEY not set. Mocking email notification.',
          'leadId',
          record.id,
        )
      return e.next()
    }

    const name = record.getString('name')
    const phone = record.getString('phone')
    const cpf = record.getString('cpf')
    const rg_ie = record.getString('rg_ie')
    const email = record.getString('email')
    const address = record.getString('address')
    const number = record.getString('number')
    const neighborhood = record.getString('neighborhood')
    const city = record.getString('city')
    const state = record.getString('state')
    const zip_code = record.getString('zip_code')

    const now = new Date()
    const pad = (n) => String(n).padStart(2, '0')
    const date = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

    const bodyText = `Nome: ${name}
WhatsApp: ${phone}
CPF/CNPJ: ${cpf}
RG/IE: ${rg_ie}
Email: ${email}
Endereço: ${address}, ${number}
Bairro: ${neighborhood}
Cidade: ${city}
Estado: ${state}
CEP: ${zip_code}
Data: ${date}`

    const res = $http.send({
      url: 'https://api.resend.com/emails',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Sensatio <onboarding@resend.dev>',
        to: 'comercial@sensatio.com.br',
        subject: 'Novo cadastro de revendedor - Sensatio',
        text: bodyText,
      }),
      timeout: 15,
    })

    if (res.statusCode >= 400) {
      $app
        .logger()
        .error(
          'Failed to send reseller notification email',
          'status',
          res.statusCode,
        )
    } else {
      $app
        .logger()
        .info('Reseller lead notification sent via Resend', 'leadId', record.id)
    }
  } catch (err) {
    $app
      .logger()
      .error(
        'Error sending reseller notification email',
        'error',
        err?.message || String(err),
      )
  }

  return e.next()
}, 'reseller_leads')
