migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('revendedores')
    collection.createRule = ''
    collection.listRule = "@request.auth.id != ''"
    collection.viewRule = "@request.auth.id != ''"
    collection.updateRule = "@request.auth.id != ''"
    collection.deleteRule = "@request.auth.id != ''"
    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('revendedores')
    collection.createRule = "@request.auth.id != ''"
    app.save(collection)
  },
)
