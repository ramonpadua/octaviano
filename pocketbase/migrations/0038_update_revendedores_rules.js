migrate(
  (app) => {
    try {
      const col = app.findCollectionByNameOrId('revendedores')
      col.createRule = ''
      app.save(col)
    } catch (_) {}

    try {
      const leads = app.findCollectionByNameOrId('reseller_leads')
      leads.createRule = ''
      app.save(leads)
    } catch (_) {}
  },
  (app) => {
    // Revert not strictly necessary for this security adjustment
  },
)
