migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')
    collection.listRule = ''
    collection.viewRule = ''
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')
    collection.listRule = ''
    collection.viewRule = ''
    app.save(collection)
  },
)
