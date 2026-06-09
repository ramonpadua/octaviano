migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')

    try {
      app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Catálogo de Produtos Avatim 2026.2',
      )
      return // already seeded
    } catch (_) {}

    const record = new Record(collection)
    record.set('titulo', 'Catálogo de Produtos Avatim 2026.2')
    record.set('tipo', 'catalogo')
    record.set('categoria', 'Catálogo Geral')
    record.set(
      'descricao',
      'Catálogo completo com todas as linhas de produtos Avatim: Ambiente, Perfumaria, Corpo e Ateliê. Inclui mais de 200 produtos com preços e descrições.',
    )

    const index = [
      { titulo: 'Ambiente', pagina: 4 },
      { titulo: 'Corpo', pagina: 38 },
      { titulo: 'Perfumaria', pagina: 66 },
      { titulo: 'Ateliê', pagina: 108 },
    ]
    record.set('indice_json', index)

    const resumo =
      "O Catálogo de Produtos Avatim 2026.2 apresenta a essência pioneira da marca em perfumaria e bem-estar, com mais de 200 produtos cuidadosamente desenvolvidos para transformar a rotina em rituais de autocuidado. A palavra 'Avatim', de origem Tupi, significa 'cheiros da terra', refletindo o compromisso da marca em buscar inspiração na rica biodiversidade brasileira. O catálogo é dividido em quatro grandes linhas: Ambiente (p. 4), oferecendo difusores, perfumes para interiores e velas para criar refúgios acolhedores; Corpo (p. 38), com produtos que proporcionam sensações únicas e benefícios para a pele; Perfumaria (p. 66), destacando fragrâncias exclusivas e marcantes; e Ateliê (p. 108), com acessórios de sofisticação para um verdadeiro SPA em casa. Com aromas autênticos extraídos de frutos, flores e raízes, a Avatim convida você a explorar criações únicas que equilibram o corpo, a mente e o ambiente, promovendo relaxamento, leveza e conexão com a natureza em cada detalhe."
    record.set('resumo', resumo)

    app.save(record)
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
