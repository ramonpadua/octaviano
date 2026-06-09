migrate(
  (app) => {
    try {
      const record = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'burgosoctaviano@gmail.com',
      )
      record.setPassword('Burgos2009@')
      app.save(record)
    } catch (_) {
      const users = app.findCollectionByNameOrId('_pb_users_auth_')
      const record = new Record(users)
      record.setEmail('burgosoctaviano@gmail.com')
      record.setPassword('Burgos2009@')
      record.setVerified(true)
      record.set('name', 'Admin')
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findAuthRecordByEmail(
        '_pb_users_auth_',
        'burgosoctaviano@gmail.com',
      )
      record.setPassword('Skip@Pass')
      app.save(record)
    } catch (_) {}
  },
)
