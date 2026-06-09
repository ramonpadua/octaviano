migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')

    // Seed Catalog
    try {
      app.findFirstRecordByData('pdfs', 'titulo', 'Catálogo 2026.2')
    } catch (_) {
      const catalog = new Record(collection)
      catalog.set('titulo', 'Catálogo 2026.2')
      catalog.set('tipo', 'catalogo')
      catalog.set(
        'resumo',
        'Somos a marca pioneira em perfumes para ambientes e nosso propósito é proporcionar refúgios de boas sensações através de produtos de autocuidado e bem-estar.',
      )
      catalog.set('indice_json', [
        { titulo: 'Ambiente', pagina: 4 },
        { titulo: 'Corpo', pagina: 38 },
        { titulo: 'Perfumaria', pagina: 66 },
        { titulo: 'Ateliê', pagina: 108 },
      ])
      app.save(catalog)
    }

    // Seed Booking
    try {
      app.findFirstRecordByData('pdfs', 'titulo', 'Booking de Produtos')
    } catch (_) {
      const booking = new Record(collection)
      booking.set('titulo', 'Booking de Produtos')
      booking.set('tipo', 'booking')
      booking.set(
        'resumo',
        'Conheça os produtos Avatim suas caraterísticas e famílias olfativas.',
      )
      app.save(booking)
    }
  },
  (app) => {
    try {
      const catalog = app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Catálogo 2026.2',
      )
      app.delete(catalog)
    } catch (_) {}

    try {
      const booking = app.findFirstRecordByData(
        'pdfs',
        'titulo',
        'Booking de Produtos',
      )
      app.delete(booking)
    } catch (_) {}
  },
)
