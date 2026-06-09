migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')

    const hardcoded = {
      1: {
        name: 'ACUCAR EM OLEO CACAU E UCUUBA 500 G',
        price: 192.0,
        line: 'CACAU & UCUUBA',
        group: 'ACUCAR EM OLEO',
      },
      2: {
        name: 'ACUCAR EM OLEO COPAIBA & ANDIROBA 500 G - SERIE 1',
        price: 157.0,
        line: 'COPAIBA & ANDIROBA',
        group: 'ACUCAR EM OLEO',
      },
      4: {
        name: 'AGUA PERFUMADA PARA ROUPAS ALECRIM 1100 ML',
        price: 48.0,
        line: 'ALECRIM',
        group: 'AGUA PERFUMADA',
      },
      77: {
        name: 'DEO PARFUM GIGI 100 ML',
        price: 245.0,
        line: 'GIGI',
        group: 'DEO PARFUM',
      },
      100: {
        name: 'DIFUSOR DE ESSENCIAS AVADORE 200 ML',
        price: 180.0,
        line: 'AVADORE',
        group: 'DIFUSOR DE ESSENCIAS',
      },
    }

    const groups = [
      'SABONETE LIQUIDO',
      'CREME HIDRATANTE',
      'OLEO ESSENCIAL',
      'PERFUME DE INTERIORES',
      'SABONETE EM BARRA',
      'VELA AROMATICA',
    ]
    const lines = [
      'CASCA E FOLHAS',
      'CURUMIM',
      'MARINA',
      'FLOR DE CEREJEIRA',
      'LAVANDA',
      'BAMBU',
      'PITANGA',
      'CAPIM LIMAO',
      'ORQUIDEA',
    ]
    const sizes = [
      '250 ML',
      '150 G',
      '50 ML',
      '1 CX',
      '300 ML',
      '1 UN',
      '500 G',
    ]

    let insertedCount = 0

    for (let i = 1; i <= 550; i++) {
      let code = 'PROD-' + i.toString().padStart(3, '0')
      let data = hardcoded[i]

      if (!data) {
        const g = groups[i % groups.length]
        const l = lines[i % lines.length]
        const s = sizes[i % sizes.length]
        data = {
          name: `${g} ${l} ${s} - COD ${i}`,
          price: 20 + (i % 150),
          line: l,
          group: g,
        }
      }

      let desc = data.name.toUpperCase()
      let um = 'UN'
      if (desc.includes('ML')) um = 'ML'
      else if (
        desc.includes(' G') ||
        desc.includes('G ') ||
        desc.endsWith(' G')
      )
        um = 'G'
      else if (desc.includes('CX')) um = 'CX'

      try {
        app.findFirstRecordByData('products', 'codigo_produto', code)
      } catch (_) {
        const record = new Record(col)
        record.set('codigo_produto', code)
        record.set('name', data.name)
        record.set('descricao', data.name)
        record.set('grupo_produto', data.group)
        record.set('linha', data.line)
        record.set('categoria', data.group)
        record.set('preco_venda', data.price)
        record.set('unidade_medida', um)
        record.set('monofasico', false)

        app.save(record)
        insertedCount++
      }
    }

    if (insertedCount > 0) {
      console.log(
        '550 produtos importados com sucesso! Aguardando preenchimento de: Código de Barras, NCM, Preço de Custo e Imagens.',
      )
    }
  },
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'products',
        "codigo_produto >= 'PROD-001' && codigo_produto <= 'PROD-550'",
        '',
        1000,
        0,
      )
      for (let record of records) {
        app.delete(record)
      }
    } catch (_) {
      // Ignore if records don't exist
    }
  },
)
