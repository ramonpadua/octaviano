onRecordAfterUpdateSuccess((e) => {
  const original = e.record.original()
  const oldStatus = original ? original.getString('status') : ''
  const newStatus = e.record.getString('status')

  if (
    oldStatus !== newStatus &&
    (newStatus === 'aprovado' || newStatus === 'finalizado')
  ) {
    const email = e.record.getString('email')
    const name = e.record.getString('name')

    let subject = ''
    let text = ''

    if (newStatus === 'aprovado') {
      subject = 'Seu cadastro foi aprovado!'
      text =
        'Parabéns! Seu cadastro foi aprovado. Você já pode acessar o Portal Compras Avatim. Seus dados de acesso serão enviados em breve.'
    } else {
      subject = 'Atualização sobre seu cadastro'
      text =
        'Infelizmente, seu cadastro não foi aprovado neste momento. Entre em contato conosco para mais informações.'
    }

    const resendApiKey = $secrets.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        const res = $http.send({
          url: 'https://api.resend.com/emails',
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + resendApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Sensatio <onboarding@resend.dev>',
            to: email,
            subject: subject,
            html: '<p>Olá ' + name + ',</p><p>' + text + '</p>',
          }),
          timeout: 10,
        })
        $app
          .logger()
          .info(
            'Email notification sent',
            'leadId',
            e.record.id,
            'status',
            res.statusCode,
          )
      } catch (err) {
        $app
          .logger()
          .error(
            'Failed to send email notification',
            'leadId',
            e.record.id,
            'error',
            err.message,
          )
      }
    } else {
      $app
        .logger()
        .info(
          'Email notification skipped: RESEND_API_KEY not set',
          'leadId',
          e.record.id,
          'newStatus',
          newStatus,
        )
    }
  }
  e.next()
}, 'reseller_leads')
