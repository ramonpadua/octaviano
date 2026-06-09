migrate(
  (app) => {
    const data = [
      [
        '1071580500',
        '7899891315385',
        'ACUCAR EM OLEO CACAU E UCUUBA 500 G',
        192,
        'CACAU & UCUUBA',
      ],
      [
        '1071550501',
        '7899891315804',
        'ACUCAR EM OLEO COPAIBA & ANDIROBA 500 G - SERIE 1',
        157,
        'COPAIBA & ANDIROBA',
      ],
      [
        '1071030501',
        '7899891315798',
        'ACUCAR EM OLEO CUPUACU E CASTANHA DO BRASIL 500 G - SERIE 1',
        157,
        'CUPUACU & CASTANHA DO BRASIL',
      ],
      [
        '1030551100',
        '7898464620444',
        'AGUA PERFUMADA PARA ROUPAS ALECRIM 1100 ML',
        48,
        'ALECRIM',
      ],
      [
        '1030581100',
        '7898464621991',
        'AGUA PERFUMADA PARA ROUPAS AMBAR 1100 ML',
        48,
        'AMBAR',
      ],
      [
        '1031071101',
        '7899891308844',
        'AGUA PERFUMADA PARA ROUPAS BAMBU 1100 ML',
        48,
        'BAMBU',
      ],
      [
        '1030021100',
        '7898464622028',
        'AGUA PERFUMADA PARA ROUPAS CASCAS & FOLHAS 1100 ML',
        48,
        'CASCAS & FOLHAS',
      ],
      [
        '1030111100',
        '7898464622066',
        'AGUA PERFUMADA PARA ROUPAS CURUMIM 1100 ML',
        48,
        'CURUMIM',
      ],
      [
        '1030491100',
        '7898464622080',
        'AGUA PERFUMADA PARA ROUPAS FLOR DE ALGODAO 1100 ML',
        48,
        'FLOR DE ALGODAO',
      ],
      [
        '1030251100',
        '7898464620451',
        'AGUA PERFUMADA PARA ROUPAS MARRUA 1100 ML',
        48,
        'MARRUA',
      ],
      [
        '1030231100',
        '7898464622257',
        'AGUA PERFUMADA PARA ROUPAS PITANGA 1100 ML',
        48,
        'PITANGA',
      ],
      [
        '1030641100',
        '7898464622264',
        'AGUA PERFUMADA PARA ROUPAS PROVENCE 1100 ML',
        48,
        'PROVENCE',
      ],
      [
        '1081920200',
        '7899891307922',
        'AGUA REFRESC COCO & ROMA 200 ML SENSORE',
        38,
        'SENSORE',
      ],
      [
        '1081920260',
        '7899891315279',
        'AGUA REFRESC COCO & ROMA 260 ML SENSORE',
        62,
        'SENSORE',
      ],
      [
        '1081930200',
        '7899891307953',
        'AGUA REFRESC ROSAS & DAMASCO 200 ML SENSORE',
        38,
        'SENSORE',
      ],
      [
        '1081930260',
        '7899891315262',
        'AGUA REFRESC ROSAS & DAMASCO 260 ML SENSORE',
        62,
        'SENSORE',
      ],
      [
        '1081940200',
        '7899891307984',
        'AGUA REFRESC SICILIANO & BAUNILHA 200 ML SENSORE',
        38,
        'SENSORE',
      ],
      [
        '1081940260',
        '7899891315255',
        'AGUA REFRESC SICILIANO & BAUNILHA 260 ML SENSORE',
        62,
        'SENSORE',
      ],
      [
        '1081880200',
        '7899891307618',
        'AGUA REFRESCANTE ACONCHEGO 200 ML - AGUAS NATURAIS',
        118,
        'AGUAS NATURAIS',
      ],
      [
        '1081900200',
        '7899891307632',
        'AGUA REFRESCANTE CONCENTRACAO 200 ML - AGUAS NATURAIS',
        118,
        'AGUAS NATURAIS',
      ],
      [
        '1081890200',
        '7899891307625',
        'AGUA REFRESCANTE ENERGIA 200 ML - AGUAS NATURAIS',
        118,
        'AGUAS NATURAIS',
      ],
      [
        '1081870200',
        '7899891307601',
        'AGUA REFRESCANTE RELAXAMENTO 200 ML - AGUAS NATURAIS',
        118,
        'AGUAS NATURAIS',
      ],
      [
        '1081100300',
        '7899891308615',
        'AGUA REFRESCANTE VERBENA & BAMBU 300 ML',
        120,
        'VERBENA & BAMBU',
      ],
      [
        '1070680055',
        '7899891305348',
        'ALCOOL EM GEL AMORA SILVESTRE 55 G - AUTOCUIDADO',
        14,
        'AMORA SILVESTRE',
      ],
      [
        '1071360055',
        '7899891305362',
        'ALCOOL EM GEL CUPUACU 55 G - AUTOCUIDADO',
        14,
        'CUPUACU',
      ],
      [
        '1070730055',
        '7899891305355',
        'ALCOOL EM GEL MANGA VERDE 55 G - AUTOCUIDADO',
        14,
        'MANGA VERDE',
      ],
      [
        '1010000400',
        '7899891314562',
        'APLICADOR SPRAY 400 ML',
        16,
        'APLICADOR',
      ],
      [
        '1010009331',
        '7899891305539',
        'BALDE CINZA METAL AVATIM G',
        43,
        'BALDES',
      ],
      [
        '1010009330',
        '7899891305522',
        'BALDE CINZA METAL AVATIM M',
        33,
        'BALDES',
      ],
      [
        '1010009329',
        '7899891305515',
        'BALDE CINZA METAL AVATIM P',
        27,
        'BALDES',
      ],
      [
        '1080830300',
        '7899891303283',
        'BANHO REFRESCANTE CHA VERDE & ERVAS 300 ML - DIA DIA',
        120,
        'CHA VERDE & ERVAS',
      ],
      [
        '1080760300',
        '7899891303252',
        'BANHO REFRESCANTE FLOR DE CEREJEIRA 300 ML - DIA DIA',
        120,
        'FLOR DE CEREJEIRA',
      ],
      [
        '1080010300',
        '7899891303290',
        'BANHO REFRESCANTE LAVANDA 300 ML - DIA DIA',
        120,
        'LAVANDA',
      ],
      [
        '1080780300',
        '7899891303269',
        'BANHO REFRESCANTE MARINA 300 ML - DIA DIA',
        120,
        'MARINA',
      ],
      [
        '1010009366',
        '7899891306536',
        'BASE DE MADEIRA ESCURA PARA FRASCO DIFUSOR',
        52,
        'FRASCOS DIFUSORES E DISPENSER',
      ],
      [
        '1010009365',
        '7899891306529',
        'BASE DE MADEIRA NATURAL PARA FRASCO DIFUSOR',
        52,
        'FRASCOS DIFUSORES E DISPENSER',
      ],
      ['1010009022', '7898464625234', 'BOLSA BAG', 169, 'ECOBAGS'],
      [
        '1071110060',
        '7899891308325',
        'BONISSIMO BALM - POS BARBA 60 G',
        38,
        'BONISSIMO',
      ],
      [
        '1131110140',
        '7899891304259',
        'BONISSIMO BEARD - SHAMPOO PARA BARBA 140 ML',
        32,
        'BONISSIMO',
      ],
      [
        '1071110085',
        '7899891304266',
        'BONISSIMO POMADE - POMADA MODELADORA 85 G',
        35,
        'BONISSIMO',
      ],
      [
        '1071110080',
        '7898464628426',
        'BONISSIMO SHAVE - CREME PARA BARBEAR 80 G',
        38,
        'BONISSIMO',
      ],
      [
        '1091119301',
        '7899891304273',
        'BONISSIMO SHAVING - GEL PARA BARBEAR 100 G',
        34,
        'BONISSIMO',
      ],
      ['1010009007', '7898464628600', 'BUCHA VEGETAL REDONDA', 19, 'BANHO'],
      [
        '2091660100',
        '7899891307809',
        'CALDA ESFOLIANTE 100 ML - BISNAGA - MEL TERAPIA',
        42,
        'MEL TERAPIA',
      ],
      [
        '1090009467',
        '7899891314074',
        'CHEIROS DA BAHIA - SERIE 1 - CX COM 5 SABONETES',
        114,
        'CHEIROS DA BAHIA',
      ],
      [
        '1010009026',
        '7898464629003',
        'COLHER DE MADEIRA',
        8,
        'ACESSORIOS BANHO',
      ],
      [
        '1130110201',
        '7899891312155',
        'CONDICIONADOR CURUMIM 200 ML',
        44,
        'CURUMIM - INFANTIL',
      ],
      [
        '1131520303',
        '7899891318959',
        'CONDICIONADOR MURU MURU & PATAUA 300 ML SERIE 1',
        50,
        'MURU MURU & PATAUA',
      ],
      [
        '1131520401',
        '7899891308486',
        'CONDICIONADOR MURU MURU & PATAUA 400 ML',
        65,
        'MURU MURU & PATAUA',
      ],
      [
        '1131100201',
        '7899891307823',
        'CONDICIONADOR VERBENA & BAMBU 200 ML',
        34,
        'VERBENA & BAMBU',
      ],
      [
        '1071810200',
        '7899891306352',
        'CREME ACETINADO HIDRATANTE CORPORAL ACUCENA 200 G',
        165,
        'ACUCENA',
      ],
      [
        '1071500201',
        '7899891306437',
        'CREME ACETINADO HIDRATANTE CORPORAL GIGI 200 G',
        165,
        'GIGI',
      ],
      [
        '1071170200',
        '7899891307663',
        'CREME ACETINADO HIDRATANTE CORPORAL SERENA 200 G',
        165,
        'SERENA',
      ],
      [
        '1072080200',
        '7899891314142',
        'CREME ACETINADO HIDRATANTE GIGI LAZULI 200 G',
        165,
        'GIGI LAZULI',
      ],
      [
        '1071580200',
        '7899891301227',
        'CREME DE MANTEIGAS CACAU & UCUUBA 200 G',
        135,
        'CACAU & UCUUBA',
      ],
    ]

    const col = app.findCollectionByNameOrId('products')

    for (const item of data) {
      const sku = item[0].trim()
      const barcode = item[1].trim()
      const desc = item[2].trim()
      const price = Number(item[3])
      const group = item[4].trim()

      let unit = 'UN'
      const measureMatch = desc.match(/\b\d+\s*(G|ML|KG|L)\b/i)
      if (measureMatch) {
        unit = measureMatch[1].toUpperCase()
      } else if (/\bCX\b/i.test(desc)) {
        unit = 'CX'
      }

      try {
        app.findFirstRecordByData('products', 'codigo_produto', sku)
        // Already seeded, skip
      } catch (_) {
        const record = new Record(col)
        record.set('name', desc)
        record.set('codigo_produto', sku)
        record.set('codigo_barras', barcode)
        record.set('descricao', desc)
        record.set('preco_venda', price)
        record.set('price', price)
        record.set('linha', group)
        record.set('grupo_produto', group)
        record.set('categoria', group)
        record.set('unidade_medida', unit)
        record.set('monofasico', false)
        record.set('codigo_ncm', '')
        record.set('imagem_url', '')

        app.save(record)
      }
    }
  },
  (app) => {
    const skus = [
      '1071580500',
      '1071550501',
      '1071030501',
      '1030551100',
      '1030581100',
      '1031071101',
      '1030021100',
      '1030111100',
      '1030491100',
      '1030251100',
      '1030231100',
      '1030641100',
      '1081920200',
      '1081920260',
      '1081930200',
      '1081930260',
      '1081940200',
      '1081940260',
      '1081880200',
      '1081900200',
      '1081890200',
      '1081870200',
      '1081100300',
      '1070680055',
      '1071360055',
      '1070730055',
      '1010000400',
      '1010009331',
      '1010009330',
      '1010009329',
      '1080830300',
      '1080760300',
      '1080010300',
      '1080780300',
      '1010009366',
      '1010009365',
      '1010009022',
      '1071110060',
      '1131110140',
      '1071110085',
      '1071110080',
      '1091119301',
      '1010009007',
      '2091660100',
      '1090009467',
      '1010009026',
      '1130110201',
      '1131520303',
      '1131520401',
      '1131100201',
      '1071810200',
      '1071500201',
      '1071170200',
      '1072080200',
      '1071580200',
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
