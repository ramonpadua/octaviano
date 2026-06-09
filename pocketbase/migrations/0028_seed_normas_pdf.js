migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')

    try {
      app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Normas de Vendas Completas 2026',
      )
      return
    } catch (_) {}

    const record = new Record(collection)
    record.set('titulo', 'Normas de Vendas Completas 2026')
    record.set('tipo', 'normas')
    record.set('categoria', 'Geral')
    record.set(
      'descricao',
      'Documento completo com as regras comerciais para revendedores Sensatio 2026.',
    )

    record.set('arquivo', '')

    app.save(record)
  },
  (app) => {
    try {
      const record = app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Normas de Vendas Completas 2026',
      )
      app.delete(record)
    } catch (_) {}
  },
)
