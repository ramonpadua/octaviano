migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('materials')

    // Enforce RLS for full CRUD by authenticated users
    col.listRule = "@request.auth.id != ''"
    col.viewRule = "@request.auth.id != ''"
    col.createRule = "@request.auth.id != ''"
    col.updateRule = "@request.auth.id != ''"
    col.deleteRule = "@request.auth.id != ''"

    // Add the file field for PDF uploads if it doesn't exist
    if (!col.fields.getByName('file')) {
      col.fields.add(
        new FileField({
          name: 'file',
          maxSelect: 1,
          maxSize: 10485760, // 10MB
          mimeTypes: ['application/pdf'],
        }),
      )
    }

    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('materials')

    // Revert rules to previous state
    col.listRule = ''
    col.viewRule = ''

    const fileField = col.fields.getByName('file')
    if (fileField) {
      col.fields.removeByName('file')
    }

    app.save(col)
  },
)
