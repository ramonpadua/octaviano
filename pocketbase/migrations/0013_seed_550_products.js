migrate(
  (app) => {
    const col = app.findCollectionByNameOrId('products')
    const lines = [
      'ACUCENA',
      'GIGI',
      'SERENA',
      'SUBLIME',
      'OZARA',
      'ALIRA',
      'BAKARI',
      'IRIS',
      'SELETO',
      'BONISSIMO',
      'RELICARIO',
      'AGUAS NATURAIS',
      'DIA DIA',
      'DESFRUTAR',
      'SENSORE',
      'RITOS',
      'JARDIM BRASIL',
      'VERBENA & BAMBU',
      'MURU MURU & PATAUA',
      'CACAU & UCUUBA',
      'COPAIBA & ANDIROBA',
      'CUPUACU & CASTANHA DO BRASIL',
      'CHEIROS DA BAHIA',
      'CLASSICOS',
      'CURUMIM',
      'ESPLENDOR',
      'GIGI LAZULI',
      'IRIS ROSE',
      'SELETO HERBO',
      'SELETO OCEAN',
      'SUBLIME LUME',
      'BONISSIMO BLACK',
      'BONISSIMO URBAN',
      'CAMELIA RELICARIO',
      'ACUCENA ROUGE',
      'TERRA MADRE',
      'SILVESTRE',
      'VELVET',
      'AMANE',
      'AMIR SLAMA',
      'APOGEU',
      'AQUAMARE',
      'AVADORE',
      'BERGAMO',
      'LEMONGRASS',
      'YLANG YLANG',
      'ZIMBRO',
      'OLIBANO',
      'SANTO PE',
      'MEL TERAPIA',
      'MASCARAS FACIAIS',
      'BALDES',
      'FRASCOS DIFUSORES E DISPENSER',
      'ECOBAGS',
      'SACOLAS',
      'ACESSORIOS BANHO',
      'BANHO',
      'VARETAS DIFUSORAS',
      'VALVULA DISPERSORA',
      'NECESSAIRES',
      'MINI ALMOFADA',
      'MATERIAL DE APOIO',
      'RITOS ESSENCIAIS',
      'KIT CREME PARA MAOS',
      'KIT SABONETE EM BARRA DIA DIA',
      'MURUMURU (LINHA RESERVA)',
      'PERFUME PARA INTERIORES 1100',
      'CEDRO & CIPRESTE',
      'AMORA SILVESTRE',
      'MANGA VERDE',
      'APLICADOR',
      'FLOR DE CEREJEIRA',
      'LAVANDA',
      'MARINA',
      'CHA VERDE & ERVAS',
    ]

    let count = 0

    app.runInTransaction((txApp) => {
      for (let i = 1; i <= 550; i++) {
        const codigo = `PROD-${i.toString().padStart(3, '0')}`

        try {
          txApp.findFirstRecordByData('products', 'codigo_produto', codigo)
          continue
        } catch (_) {}

        const line = lines[i % lines.length]

        let suffix = ''
        let um = 'UN'
        if (i % 3 === 0) {
          suffix = ' 100ML'
          um = 'ML'
        } else if (i % 5 === 0) {
          suffix = ' 50G'
          um = 'G'
        } else if (i % 7 === 0) {
          suffix = ' 1CX'
          um = 'CX'
        }

        const descricao = `Produto ${line} Premium ${i}${suffix}`
        const preco = 10 + (i % 100) + 0.99

        const record = new Record(col)
        record.set('codigo_produto', codigo)
        record.set('codigo_barras', '')
        record.set('descricao', descricao)
        record.set('grupo_produto', line)
        record.set('linha', line)
        record.set('codigo_ncm', '')
        record.set('preco_venda', preco)
        record.set('unidade_medida', um)
        record.set('monofasico', false)
        record.set('categoria', line)
        record.set('imagem_url', '')

        // Retro-compatibility fields
        record.set('name', descricao)
        record.set('price', preco)
        record.set('description', `Descrição detalhada do ${descricao}`)
        record.set('category', line)
        record.set('image_url', '')

        txApp.save(record)
        count++
      }
    })

    if (count > 0) {
      console.log(
        '550 produtos importados com sucesso! Aguardando preenchimento de: Código de Barras, NCM, Preço de Custo e Imagens.',
      )
    }
  },
  (app) => {
    app.runInTransaction((txApp) => {
      for (let i = 1; i <= 550; i++) {
        const codigo = `PROD-${i.toString().padStart(3, '0')}`
        try {
          const record = txApp.findFirstRecordByData(
            'products',
            'codigo_produto',
            codigo,
          )
          txApp.delete(record)
        } catch (_) {}
      }
    })
  },
)
