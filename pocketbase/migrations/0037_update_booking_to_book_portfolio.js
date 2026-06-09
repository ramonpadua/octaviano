migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('pdfs')

    col.fields.add(
      new SelectField({
        name: 'tipo',
        required: true,
        maxSelect: 1,
        values: [
          'catalogo',
          'booking',
          'book_portfolio_avatim',
          'releases',
          'treinamento',
          'normas',
        ],
      }),
    )
    app.save(col)

    app
      .db()
      .newQuery(
        "UPDATE pdfs SET tipo = 'book_portfolio_avatim' WHERE tipo = 'booking'",
      )
      .execute()

    const colUpdated = app.findCollectionByNameOrId('pdfs')
    colUpdated.fields.add(
      new SelectField({
        name: 'tipo',
        required: true,
        maxSelect: 1,
        values: [
          'catalogo',
          'book_portfolio_avatim',
          'releases',
          'treinamento',
          'normas',
        ],
      }),
    )
    app.save(colUpdated)
  },
  (app) => {
    const col = app.findCollectionByNameOrId('pdfs')

    col.fields.add(
      new SelectField({
        name: 'tipo',
        required: true,
        maxSelect: 1,
        values: [
          'catalogo',
          'booking',
          'book_portfolio_avatim',
          'releases',
          'treinamento',
          'normas',
        ],
      }),
    )
    app.save(col)

    app
      .db()
      .newQuery(
        "UPDATE pdfs SET tipo = 'booking' WHERE tipo = 'book_portfolio_avatim'",
      )
      .execute()

    const colUpdated = app.findCollectionByNameOrId('pdfs')
    colUpdated.fields.add(
      new SelectField({
        name: 'tipo',
        required: true,
        maxSelect: 1,
        values: ['catalogo', 'booking', 'releases', 'treinamento', 'normas'],
      }),
    )
    app.save(colUpdated)
  },
)
