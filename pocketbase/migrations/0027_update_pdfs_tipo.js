migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('pdfs')
    const field = col.fields.getByName('tipo')

    if (field) {
      if (!field.values.includes('normas')) {
        field.values.push('normas')
      }
      app.save(col)
    }
  },
  (app) => {
    const col = app.findCollectionByNameOrId('pdfs')
    const field = col.fields.getByName('tipo')

    if (field) {
      field.values = field.values.filter((v) => v !== 'normas')
      app.save(col)
    }
  },
)
