onRecordCreateRequest((e) => {
  const ip = (e.request.remoteAddr || '').split(':')[0]
  if (ip) {
    e.record.set('ip_address', ip)
  }

  const sixtySecondsAgo = new Date(Date.now() - 60000)
    .toISOString()
    .replace('T', ' ')

  try {
    if (ip) {
      const recent = $app.findFirstRecordByFilter(
        'revendedores',
        `ip_address = {:ip} && created >= {:time}`,
        {
          ip: ip,
          time: sixtySecondsAgo,
        },
      )
      if (recent) {
        return e.badRequestError(
          'Por favor, aguarde antes de enviar um novo cadastro.',
          {
            email: 'Aguarde 60 segundos antes de enviar um novo cadastro.',
          },
        )
      }
    }
  } catch (err) {
    // not found, proceed
  }

  e.next()
}, 'revendedores')
