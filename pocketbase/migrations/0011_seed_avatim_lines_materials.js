migrate(
  (app) => {
    const avatimLines = [
      'Açucena',
      'Águas Naturais',
      'Alira',
      'Ateliê',
      'Bakari',
      'Boníssimo',
      'Bulevar',
      'Cheiros da Bahia',
      'Clássicos',
      'Curumim',
      'Desfrutar',
      'Dia Dia',
      'Esplendor',
      'Gigi',
      'Íris',
      'Jardim Brasil',
      'Mel Terapia',
      'Ozara',
      'Relicário',
      'Reserva',
      'Ritos',
      'Santo Pé',
      'Seleto',
      'Sensore',
      'Serena',
      'Sublime',
      'Tato & Olfato',
      'Verbena & Bambu',
    ]

    const colAvatim = app.findCollectionByNameOrId('avatim_lines')
    for (const name of avatimLines) {
      try {
        app.findFirstRecordByData('avatim_lines', 'name', name)
      } catch (_) {
        const record = new Record(colAvatim)
        record.set('name', name)
        app.save(record)
      }
    }

    const materials = [
      { title: 'Como Vender Produtos Avatim', type: 'pdf', category: 'Vendas' },
      { title: 'Conhecendo as Linhas', type: 'video', category: 'Produtos' },
      { title: 'Técnicas de Abordagem', type: 'pdf', category: 'Vendas' },
      { title: 'Gestão de Vendas', type: 'video', category: 'Gestão' },
    ]

    const colMat = app.findCollectionByNameOrId('materials')
    for (const mat of materials) {
      try {
        app.findFirstRecordByData('materials', 'title', mat.title)
      } catch (_) {
        const record = new Record(colMat)
        record.set('title', mat.title)
        record.set('type', mat.type)
        record.set('category', mat.category)
        app.save(record)
      }
    }
  },
  (app) => {
    // Down migration
  },
)
