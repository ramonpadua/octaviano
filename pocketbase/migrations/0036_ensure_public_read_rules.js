migrate(
  (app) => {
    const collections = ['pdfs', 'products']

    for (const name of collections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (_) {
        // ignore if collection doesn't exist
      }
    }
  },
  (app) => {
    // no-op down migration
  },
)
