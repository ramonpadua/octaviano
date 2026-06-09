migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')

    const products = [
      {
        name: 'Perfume Gigi 100ml',
        price: 159.9,
        description:
          'Fragrância marcante e sofisticada, perfeita para ocasiões especiais. Combina notas florais e amadeiradas.',
        category: 'Gigi',
        image_url: 'https://img.usecurling.com/p/400/400?q=perfume&color=pink',
      },
      {
        name: 'Sabonete Líquido Bulevar 500ml',
        price: 45.5,
        description:
          'Sabonete com toque suave e hidratante. Limpa sem agredir a pele, deixando um perfume duradouro.',
        category: 'Bulevar',
        image_url: 'https://img.usecurling.com/p/400/400?q=soap&color=yellow',
      },
      {
        name: 'Óleo Corporal Amêndoas Doces',
        price: 78.0,
        description:
          'Hidratação profunda para a pele. Enriquecido com óleos essenciais que promovem maciez extrema.',
        category: 'Clássicos',
        image_url: 'https://img.usecurling.com/p/400/400?q=oil&color=orange',
      },
    ]

    for (const p of products) {
      try {
        app.findFirstRecordByData('products', 'name', p.name)
      } catch (_) {
        const record = new Record(col)
        record.set('name', p.name)
        record.set('price', p.price)
        record.set('description', p.description)
        record.set('category', p.category)
        record.set('image_url', p.image_url)
        app.save(record)
      }
    }
  },
  (app) => {
    const names = [
      'Perfume Gigi 100ml',
      'Sabonete Líquido Bulevar 500ml',
      'Óleo Corporal Amêndoas Doces',
    ]

    for (const name of names) {
      try {
        const record = app.findFirstRecordByData('products', 'name', name)
        app.delete(record)
      } catch (_) {}
    }
  },
)
