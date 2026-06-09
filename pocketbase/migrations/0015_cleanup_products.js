migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    app.truncateCollection(col)
  },
  (app) => {
    // Cannot automatically restore truncated data
  },
)
