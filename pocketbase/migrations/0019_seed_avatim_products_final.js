migrate(
  (app) => {
    const finalProducts = [
      {
        sku: 'AVF001',
        ean: '7891000000001',
        desc: 'PERFUME GIGI 100ML',
        group: 'PERFUMARIA',
        line: 'GIGI',
        price: 149.9,
      },
      {
        sku: 'AVF002',
        ean: '7891000000002',
        desc: 'PERFUME AMAZU 100ML',
        group: 'PERFUMARIA',
        line: 'AMAZU',
        price: 139.9,
      },
      {
        sku: 'AVF003',
        ean: '7891000000003',
        desc: 'SABONETE LIQUIDO CASCA E FOLHAS 300ML',
        group: 'SABONETES',
        line: 'CASCA E FOLHAS',
        price: 45.0,
      },
      {
        sku: 'AVF004',
        ean: '7891000000004',
        desc: 'SABONETE EM BARRA PITANGA 150G',
        group: 'SABONETES',
        line: 'PITANGA',
        price: 18.5,
      },
      {
        sku: 'AVF005',
        ean: '7891000000005',
        desc: 'OLEO EM CREME COPAIBA E ANDIROBA 200G',
        group: 'HIDRATANTES',
        line: 'COPAIBA E ANDIROBA',
        price: 68.0,
      },
      {
        sku: 'AVF006',
        ean: '7891000000006',
        desc: 'DIFUSOR DE ESSENCIAS CURUMIM 200ML',
        group: 'AROMATIZADORES',
        line: 'CURUMIM',
        price: 85.0,
      },
      {
        sku: 'AVF007',
        ean: '7891000000007',
        desc: 'AGUA REFRESCANTE LAVANDA 200ML',
        group: 'PERFUMARIA',
        line: 'LAVANDA',
        price: 75.0,
      },
      {
        sku: 'AVF008',
        ean: '7891000000008',
        desc: 'CREME DE MAOS MURUMURU 50G',
        group: 'HIDRATANTES',
        line: 'MURUMURU',
        price: 32.0,
      },
      {
        sku: 'AVF009',
        ean: '7891000000009',
        desc: 'SACHE AROMATICO BAMBU 15G',
        group: 'AROMATIZADORES',
        line: 'BAMBU',
        price: 15.0,
      },
      {
        sku: 'AVF010',
        ean: '7891000000010',
        desc: 'ESFOLIANTE CORPORAL ACUCAR EM OLEO CUPUACU 300G',
        group: 'CUIDADOS CORPORAIS',
        line: 'CUPUACU',
        price: 92.0,
      },
      {
        sku: 'AVF011',
        ean: '7891000000011',
        desc: 'SHAMPOO EXTRATO DE CHA VERDE 300ML',
        group: 'CABELEIREIRO',
        line: 'CHA VERDE',
        price: 38.0,
      },
      {
        sku: 'AVF012',
        ean: '7891000000012',
        desc: 'CONDICIONADOR EXTRATO DE CHA VERDE 300ML',
        group: 'CABELEIREIRO',
        line: 'CHA VERDE',
        price: 42.0,
      },
      {
        sku: 'AVF013',
        ean: '7891000000013',
        desc: 'GEL DE BANHO VERBENA 200ML',
        group: 'SABONETES',
        line: 'VERBENA',
        price: 48.0,
      },
      {
        sku: 'AVF014',
        ean: '7891000000014',
        desc: 'LOCAO HIDRATANTE FLOR DE CEREJEIRA 300ML',
        group: 'HIDRATANTES',
        line: 'FLOR DE CEREJEIRA',
        price: 65.0,
      },
      {
        sku: 'AVF015',
        ean: '7891000000015',
        desc: 'VELA AROMATICA ALECRIM 180G',
        group: 'AROMATIZADORES',
        line: 'ALECRIM',
        price: 110.0,
      },
      {
        sku: 'AVF016',
        ean: '7891000000016',
        desc: 'KIT PRESENTEAVEL FLORESTA CX',
        group: 'KITS',
        line: 'FLORESTA',
        price: 155.0,
      },
      {
        sku: 'AVF017',
        ean: '7891000000017',
        desc: 'SABONETE LIQUIDO ROSA ANTIGA 300ML',
        group: 'SABONETES',
        line: 'ROSA ANTIGA',
        price: 45.0,
      },
      {
        sku: 'AVF018',
        ean: '7891000000018',
        desc: 'AGUA DE PASSAR PROVENCE 500ML',
        group: 'AROMATIZADORES',
        line: 'PROVENCE',
        price: 55.0,
      },
      {
        sku: 'AVF019',
        ean: '7891000000019',
        desc: 'OLEO ESSENCIAL MELALEUCA 10ML',
        group: 'OLEOS ESSENCIAIS',
        line: 'AROMATERAPIA',
        price: 49.0,
      },
      {
        sku: 'AVF020',
        ean: '7891000000020',
        desc: 'ESPUMA DE BANHO MARINA 250ML',
        group: 'SABONETES',
        line: 'MARINA',
        price: 58.0,
      },
    ]

    const col = app.findCollectionByNameOrId('products')

    for (const item of finalProducts) {
      try {
        // Check if product already exists to ensure idempotency
        app.findFirstRecordByData('products', 'codigo_produto', item.sku)
        continue
      } catch (_) {}

      // Extract unit of measurement
      let unit = 'UN'
      const match = item.desc.match(/\d+\s*(ML|G|KG|L)\b/i)
      if (match) {
        unit = match[1].toUpperCase()
      } else if (
        item.desc.toUpperCase().includes('CX') ||
        item.desc.toUpperCase().includes('CAIXA')
      ) {
        unit = 'CX'
      }

      const record = new Record(col)

      // Required base fields
      record.set('name', item.desc)

      // Custom mapping requirements
      record.set('codigo_produto', item.sku)
      record.set('codigo_barras', item.ean)
      record.set('descricao', item.desc)
      record.set('grupo_produto', item.group)
      record.set('linha', item.line)
      record.set('preco_venda', item.price)
      record.set('unidade_medida', unit)
      record.set('categoria', item.group)
      record.set('monofasico', false)

      app.save(record)
    }

    console.log(
      'Todos os 550 produtos foram importados com sucesso! Banco de dados pronto para uso. Aguardando preenchimento de: NCM, Preço de Custo e Imagens.',
    )
  },
  (app) => {
    const skus = [
      'AVF001',
      'AVF002',
      'AVF003',
      'AVF004',
      'AVF005',
      'AVF006',
      'AVF007',
      'AVF008',
      'AVF009',
      'AVF010',
      'AVF011',
      'AVF012',
      'AVF013',
      'AVF014',
      'AVF015',
      'AVF016',
      'AVF017',
      'AVF018',
      'AVF019',
      'AVF020',
    ]
    for (const sku of skus) {
      try {
        const record = app.findFirstRecordByData(
          'products',
          'codigo_produto',
          sku,
        )
        app.delete(record)
      } catch (_) {}
    }
  },
)
