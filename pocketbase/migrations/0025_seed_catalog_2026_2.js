migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')

    try {
      app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Catálogo de Produtos Avatim 2026.2',
      )
    } catch (_) {
      const record = new Record(collection)
      record.set('titulo', 'Catálogo de Produtos Avatim 2026.2')
      record.set('tipo', 'catalogo')
      record.set('categoria', 'Catálogo Geral')
      record.set(
        'descricao',
        'Catálogo completo com todas as linhas de produtos Avatim: Ambiente, Perfumaria, Corpo e Ateliê. Inclui mais de 200 produtos com preços e descrições.',
      )

      // The physical PDF file (src/assets/catalogo-avatim-20262-9dd9a.pdf)
      // is uploaded automatically by the frontend when an authenticated
      // user first views the catalog page.
      app.save(record)
    }
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Catálogo de Produtos Avatim 2026.2',
      )
      app.delete(record)
    } catch (_) {}
  },
)
