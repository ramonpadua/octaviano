migrate(
  (app) => {
    const publicCollections = ['pdfs', 'products', 'materials', 'avatim_lines']
    for (const name of publicCollections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        col.listRule = ''
        col.viewRule = ''
        app.save(col)
      } catch (_) {}
    }

    const leadsCollections = ['reseller_leads', 'revendedores']
    for (const name of leadsCollections) {
      try {
        const col = app.findCollectionByNameOrId(name)
        if (col.createRule !== '') {
          col.createRule = ''
          app.save(col)
        }
      } catch (_) {}
    }
  },
  (app) => {
    // Revert not strictly necessary for this security alignment
  },
)
