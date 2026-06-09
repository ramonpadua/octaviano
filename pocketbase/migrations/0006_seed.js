migrate(
  (app) => {
    // 1. Seed Users
    const users = app.findCollectionByNameOrId('_pb_users_auth_')
    const seedUsers = [
      {
        email: 'comercial@sensatio.com.br',
        pass: 'Skip@Pass123',
        name: 'Admin Comercial',
      },
      {
        email: 'burgosoctaviano@gmail.com',
        pass: 'Skip@Pass123',
        name: 'Dev Admin',
      },
    ]

    for (const u of seedUsers) {
      try {
        app.findAuthRecordByEmail('_pb_users_auth_', u.email)
      } catch (_) {
        const rec = new Record(users)
        rec.setEmail(u.email)
        rec.setPassword(u.pass)
        rec.setVerified(true)
        rec.set('name', u.name)
        app.save(rec)
      }
    }

    // 2. Seed Avatim Lines
    const linesCol = app.findCollectionByNameOrId('avatim_lines')
    const linhas = [
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

    for (const l of linhas) {
      try {
        app.findFirstRecordByData('avatim_lines', 'name', l)
      } catch (_) {
        const rec = new Record(linesCol)
        rec.set('name', l)
        rec.set(
          'description',
          `Descubra a essência e o bem-estar proporcionados pela linha ${l}.`,
        )
        rec.set(
          'image_url',
          `https://img.usecurling.com/p/400/300?q=perfume%20${encodeURIComponent(l)}&color=green`,
        )
        app.save(rec)
      }
    }

    // 3. Seed Products
    const prodsCol = app.findCollectionByNameOrId('products')
    for (let i = 1; i <= 10; i++) {
      const pName = `Produto Avatim ${i}`
      try {
        app.findFirstRecordByData('products', 'name', pName)
      } catch (_) {
        const rec = new Record(prodsCol)
        rec.set('name', pName)
        rec.set('price', 45 + i * 12.5)
        rec.set(
          'description',
          `Uma fragrância envolvente para o seu dia a dia. Referência: ${pName}.`,
        )
        rec.set('category', i % 2 === 0 ? 'Corpo' : 'Ambiente')
        rec.set(
          'image_url',
          `https://img.usecurling.com/p/300/300?q=cosmetics&seed=${i}`,
        )
        app.save(rec)
      }
    }

    // 4. Seed Materials
    const matCol = app.findCollectionByNameOrId('materials')
    const mats = [
      {
        title: 'Catálogo Completo Avatim',
        type: 'pdf',
        url: 'https://example.com/catalogo.pdf',
        cat: 'Catálogos',
      },
      {
        title: 'Guia Olfativo Sensatio',
        type: 'pdf',
        url: 'https://example.com/guia.pdf',
        cat: 'Guias',
      },
      {
        title: 'Como Vender Mais (Treinamento)',
        type: 'video',
        url: 'https://example.com/video1',
        cat: 'Vendas',
      },
      {
        title: 'Técnicas de Fechamento',
        type: 'video',
        url: 'https://example.com/video2',
        cat: 'Vendas',
      },
    ]
    for (const m of mats) {
      try {
        app.findFirstRecordByData('materials', 'title', m.title)
      } catch (_) {
        const rec = new Record(matCol)
        rec.set('title', m.title)
        rec.set('type', m.type)
        rec.set('file_url', m.url)
        rec.set('category', m.cat)
        app.save(rec)
      }
    }

    // 5. Seed Reseller Leads
    const leadsCol = app.findCollectionByNameOrId('reseller_leads')
    for (let i = 1; i <= 5; i++) {
      const lEmail = `lead_exemplo${i}@sensatio.local`
      try {
        app.findFirstRecordByData('reseller_leads', 'email', lEmail)
      } catch (_) {
        const rec = new Record(leadsCol)
        rec.set('name', `Maria Consultora ${i}`)
        rec.set('email', lEmail)
        rec.set('phone', '1199999999' + i)
        rec.set('cpf', '1234567890' + i)
        rec.set('address', 'Av. Paulista, ' + (1000 + i))
        rec.set('city', 'São Paulo')
        rec.set('state', 'SP')
        rec.set(
          'status',
          i % 3 === 0 ? 'aprovado' : i % 2 === 0 ? 'finalizado' : 'pendente',
        )
        app.save(rec)
      }
    }
  },
  (app) => {
    // Down migration left intentionally empty as seed removals are complex
  },
)
