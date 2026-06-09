migrate(
  (app) => {
    const users = app.findCollectionByNameOrId('_pb_users_auth_')

    try {
      app.findAuthRecordByEmail('_pb_users_auth_', 'comercial@sensatio.com.br')
      return // already seeded
    } catch (_) {}

    const record = new Record(users)
    record.setEmail('comercial@sensatio.com.br')
    record.setPassword('Skip@2026')
    record.setVerified(true)
    record.set('name', 'Admin Comercial')
    app.save(record)
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'comercial@sensatio.com.br',
      )
      app.delete(record)
    } catch (_) {}
  },
)
