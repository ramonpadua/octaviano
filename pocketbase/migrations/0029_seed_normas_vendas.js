migrate(
  (app) => {
    try {
      app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Normas de Vendas Completas 2026',
      )
      return
    } catch (_) {}

    const col = app.findCollectionByNameOrId('pdfs')
    const record = new Record(col)
    record.set('titulo', 'Normas de Vendas Completas 2026')
    record.set('tipo', 'normas')
    record.set(
      'descricao',
      'Regras comerciais, benefícios e diretrizes para revendedores.',
    )
    record.set('resumo', 'Documento completo com as Normas de Vendas 2026.')

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
