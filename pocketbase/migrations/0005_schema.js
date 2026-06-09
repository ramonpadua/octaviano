migrate(
  (app) => {
    // 1. Update reseller_leads collection
    const leads = app.findCollectionByNameOrId('reseller_leads')
    leads.fields.add(
      new SelectField({
        name: 'status',
        values: ['pendente', 'aprovado', 'finalizado'],
        maxSelect: 1,
        required: true,
      }),
    )
    leads.fields.add(
      new RelationField({
        name: 'user_id',
        collectionId: '_pb_users_auth_',
        maxSelect: 1,
      }),
    )
    app.save(leads)

    // Set default status for existing records
    app
      .db()
      .newQuery(
        "UPDATE reseller_leads SET status = 'pendente' WHERE status IS NULL OR status = ''",
      )
      .execute()

    // 2. Create products collection
    const products = new Collection({
      name: 'products',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'price', type: 'number', min: 0 },
        { name: 'description', type: 'text' },
        { name: 'category', type: 'text' },
        { name: 'image_url', type: 'url' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(products)

    // 3. Create materials collection
    const materials = new Collection({
      name: 'materials',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'title', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          values: ['pdf', 'video'],
          maxSelect: 1,
          required: true,
        },
        { name: 'file_url', type: 'url' },
        { name: 'category', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(materials)

    // 4. Create avatim_lines collection
    const lines = new Collection({
      name: 'avatim_lines',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'name', type: 'text', required: true },
        { name: 'description', type: 'text' },
        { name: 'image_url', type: 'url' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(lines)

    // Add unique index on avatim_lines name
    lines.addIndex('idx_avatim_lines_name', true, 'name', '')
    app.save(lines)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('avatim_lines'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('materials'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('products'))
    } catch (_) {}

    try {
      const leads = app.findCollectionByNameOrId('reseller_leads')
      leads.fields.removeByName('status')
      leads.fields.removeByName('user_id')
      app.save(leads)
    } catch (_) {}
  },
)
