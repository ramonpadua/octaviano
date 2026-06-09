migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')

    const fieldsToAdd = [
      new TextField({ name: 'codigo_produto', required: true }),
      new TextField({ name: 'codigo_barras' }),
      new TextField({ name: 'descricao', required: true }),
      new TextField({ name: 'grupo_produto', required: true }),
      new TextField({ name: 'linha', required: true }),
      new TextField({ name: 'codigo_ncm' }),
      new NumberField({ name: 'preco_venda', required: true }),
      new TextField({ name: 'unidade_medida', required: true }),
      new NumberField({ name: 'preco_custo' }),
      new BoolField({ name: 'monofasico' }),
      new TextField({ name: 'categoria', required: true }),
      new URLField({ name: 'imagem_url' }),
    ]

    for (const field of fieldsToAdd) {
      if (!col.fields.getByName(field.name)) {
        col.fields.add(field)
      }
    }

    app.save(col)

    app
      .db()
      .newQuery(
        `
    UPDATE products SET codigo_produto = id WHERE codigo_produto = '' OR codigo_produto IS NULL
  `,
      )
      .execute()

    col.addIndex('idx_products_codigo', true, 'codigo_produto', '')
    app.save(col)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    col.removeIndex('idx_products_codigo')

    const fieldsToRemove = [
      'codigo_produto',
      'codigo_barras',
      'descricao',
      'grupo_produto',
      'linha',
      'codigo_ncm',
      'preco_venda',
      'unidade_medida',
      'preco_custo',
      'monofasico',
      'categoria',
      'imagem_url',
    ]

    for (const name of fieldsToRemove) {
      col.fields.removeByName(name)
    }

    app.save(col)
  },
)
