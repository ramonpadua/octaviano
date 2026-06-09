migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('reseller_leads')

    if (!col.fields.getByName('rg_ie')) {
      col.fields.add(new TextField({ name: 'rg_ie' }))
    }
    if (!col.fields.getByName('number')) {
      col.fields.add(new TextField({ name: 'number' }))
    }
    if (!col.fields.getByName('neighborhood')) {
      col.fields.add(new TextField({ name: 'neighborhood' }))
    }
    if (!col.fields.getByName('zip_code')) {
      col.fields.add(new TextField({ name: 'zip_code' }))
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('reseller_leads')

    if (col.fields.getByName('rg_ie')) col.fields.removeByName('rg_ie')
    if (col.fields.getByName('number')) col.fields.removeByName('number')
    if (col.fields.getByName('neighborhood'))
      col.fields.removeByName('neighborhood')
    if (col.fields.getByName('zip_code')) col.fields.removeByName('zip_code')

    app.save(col)
  },
)
