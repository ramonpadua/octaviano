migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('revendedores')
    col.fields.add(new TextField({ name: 'ip_address' }))
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('revendedores')
    col.fields.removeByName('ip_address')
    app.save(col)
  },
)
