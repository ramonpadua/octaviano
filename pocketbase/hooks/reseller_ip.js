onRecordCreateRequest(
  (e) => {
    if (!e.request) return e.next()

    try {
      let ip = e.request.remoteAddr || ''
      if (ip.includes(':')) {
        if (ip.startsWith('[')) {
          ip = ip.substring(1, ip.indexOf(']'))
        } else {
          ip = ip.split(':')[0]
        }
      }

      // Ensure we only set the field on collections that actually support it
      if (e.collection.name === 'revendedores') {
        e.record.set('ip_address', ip)
      }
    } catch (err) {
      $app
        .logger()
        .error(
          'Error setting reseller IP',
          'error',
          err?.message || String(err),
        )
    }
    return e.next()
  },
  'revendedores',
  'reseller_leads',
)
