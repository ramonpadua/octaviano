migrate(
  (app) => {
    const rawData = `
1091810210 | 7899891306338 | GEL DE BANHO ACUCENA 210 G | 42 | ACUCENA
1090830201 | 7899891318096 | GEL DE BANHO CHA VERDE & ERVAS 200 G - DIA DIA | 23 | CHA VERDE & ERVAS
1090830300 | 7899891303405 | GEL DE BANHO CHA VERDE & ERVAS 300 G - DIA DIA | 41 | CHA VERDE & ERVAS
1091920200 | 7899891307939 | GEL DE BANHO COCO & ROMA 200 G - SENSORE | 23 | SENSORE
1090760202 | 7899891318119 | GEL DE BANHO FLOR DE CEREJEIRA 200 G - DIA DIA | 23 | FLOR DE CEREJEIRA
1090760300 | 7899891303375 | GEL DE BANHO FLOR DE CEREJEIRA 300 G - DIA DIA | 41 | FLOR DE CEREJEIRA
1131520400 | 7899891308462 | XAMPU MURU MURU & PATAUA 400 ML | 64 | MURU MURU & PATAUA
  `.trim()

    const lines = rawData
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('...'))

    const collection = app.findCollectionByNameOrId('products')

    for (const line of lines) {
      const parts = line.split('|').map((p) => p.trim())
      if (parts.length < 5) continue

      const sku = parts[0]
      const barcode = parts[1]
      const desc = parts[2]
      const priceStr = parts[3]
      const groupLine = parts[4]

      try {
        app.findFirstRecordByData('products', 'codigo_produto', sku)
        continue
      } catch (_) {}

      let unit = 'UN'
      const unitMatch1 = desc.match(/\d+\s*(ML|G|CX|UN|KG)\b/i)
      const unitMatch2 = desc.match(/\b(ML|G|CX|UN|KG)\b/i)

      if (unitMatch1) {
        unit = unitMatch1[1].toUpperCase()
      } else if (unitMatch2) {
        unit = unitMatch2[1].toUpperCase()
      }

      const price = parseFloat(priceStr.replace(',', '.'))

      const record = new Record(collection)

      record.set('name', desc)
      record.set('codigo_produto', sku)
      record.set('codigo_barras', barcode)
      record.set('descricao', desc)
      record.set('preco_venda', price)
      record.set('price', price)
      record.set('linha', groupLine)
      record.set('grupo_produto', groupLine)
      record.set('categoria', groupLine)
      record.set('monofasico', false)
      record.set('unidade_medida', unit)
      record.set('codigo_ncm', null)
      record.set('preco_custo', null)
      record.set('imagem_url', null)

      app.save(record)
    }

    console.log(
      'Produtos importados com sucesso! Aguardando preenchimento de: NCM, Preço de Custo e Imagens.',
    )
  },
  (app) => {
    const skus = [
      '1091810210',
      '1090830201',
      '1090830300',
      '1091920200',
      '1090760202',
      '1090760300',
      '1131520400',
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
