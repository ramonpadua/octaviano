migrate(
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')

    const fileField = collection.fields.getByName('arquivo')
    if (fileField) {
      fileField.required = false
      app.save(collection)
    }

    const mockPdfs = [
      {
        titulo: 'Catálogo Sensatio 2026',
        tipo: 'catalogo',
        categoria: 'Geral',
        descricao: 'O catálogo completo de produtos Avatim para 2026.',
        resumo:
          'Este catálogo detalha todas as linhas de produtos Avatim disponíveis para revendedores no ano de 2026. Inclui lançamentos em perfumaria, cuidados com a pele, e aromatizadores de ambiente, além de dicas de vendas. Explore as páginas para encontrar as melhores oportunidades.',
        indice_json: [
          { titulo: 'Capa', pagina: 1 },
          { titulo: 'Perfumaria', pagina: 4 },
          { titulo: 'Corpo e Banho', pagina: 10 },
          { titulo: 'Casa', pagina: 15 },
        ],
      },
      {
        titulo: 'Catálogo Inverno',
        tipo: 'catalogo',
        categoria: 'Sazonal',
        descricao: 'Produtos especiais para a estação mais fria do ano.',
        resumo:
          'Uma seleção rigorosa de hidratantes intensivos, óleos corporais e fragrâncias amadeiradas para o inverno. Saiba como posicionar esses produtos para seus clientes durante os meses frios.',
        indice_json: [
          { titulo: 'Introdução', pagina: 1 },
          { titulo: 'Hidratação', pagina: 3 },
          { titulo: 'Kits de Inverno', pagina: 7 },
        ],
      },
      {
        titulo: 'Catálogo Verão',
        tipo: 'catalogo',
        categoria: 'Sazonal',
        descricao: 'Refrescância e proteção para o verão.',
        resumo:
          'A linha de verão traz fragrâncias cítricas, águas refrescantes e produtos com proteção UV. Tudo o que você precisa para alavancar suas vendas na estação mais quente.',
        indice_json: [
          { titulo: 'Introdução', pagina: 1 },
          { titulo: 'Águas Refrescantes', pagina: 2 },
          { titulo: 'Kits de Verão', pagina: 5 },
        ],
      },
      {
        titulo: 'Booking Dia das Mães',
        tipo: 'booking',
        categoria: 'Datas Comemorativas',
        descricao: 'Reserve seus kits para o Dia das Mães.',
        resumo:
          'Garanta o estoque antecipado dos kits de Dia das Mães. Este documento apresenta as opções de presentes, preços especiais de pré-venda e as condições de pagamento para revendedores.',
        indice_json: [
          { titulo: 'Kits', pagina: 1 },
          { titulo: 'Preços', pagina: 3 },
          { titulo: 'Condições', pagina: 4 },
        ],
      },
      {
        titulo: 'Booking Natal',
        tipo: 'booking',
        categoria: 'Datas Comemorativas',
        descricao: 'A campanha de Natal começa agora.',
        resumo:
          'O Natal é a melhor época para vendas. Conheça as caixas de presente exclusivas, os combos promocionais e faça sua reserva para não ficar sem produtos no final do ano.',
        indice_json: [
          { titulo: 'Opções de Presente', pagina: 1 },
          { titulo: 'Combos', pagina: 4 },
          { titulo: 'Regras', pagina: 6 },
        ],
      },
      {
        titulo: 'Booking Dia dos Namorados',
        tipo: 'booking',
        categoria: 'Datas Comemorativas',
        descricao: 'Kits românticos em pré-venda.',
        resumo:
          'O amor está no ar com nossas linhas sensuais e românticas. O booking antecipado oferece brindes exclusivos para quem reservar os kits completos de Dia dos Namorados.',
        indice_json: [
          { titulo: 'Kits Ele & Ela', pagina: 1 },
          { titulo: 'Brindes', pagina: 3 },
          { titulo: 'Como Reservar', pagina: 5 },
        ],
      },
      {
        titulo: 'Release: Nova Linha Sensatio',
        tipo: 'releases',
        categoria: 'Lançamento',
        descricao: 'Tudo sobre a nova marca da empresa.',
        resumo:
          'Conheça em primeira mão a linha Sensatio. Um documento detalhado com os ativos de cada produto, público-alvo, e argumentos de venda para encantar seus clientes.',
        indice_json: [
          { titulo: 'Conceito', pagina: 1 },
          { titulo: 'Produtos', pagina: 2 },
          { titulo: 'Público', pagina: 5 },
        ],
      },
      {
        titulo: 'Release: Embalagens Sustentáveis',
        tipo: 'releases',
        categoria: 'Institucional',
        descricao: 'Nossa transição para embalagens eco-friendly.',
        resumo:
          'A Avatim tem um compromisso com a natureza. Este release explica as mudanças nas embalagens, os materiais utilizados e como comunicar essa vantagem competitiva sustentável.',
        indice_json: [
          { titulo: 'O Projeto', pagina: 1 },
          { titulo: 'Novos Materiais', pagina: 2 },
          { titulo: 'FAQ', pagina: 4 },
        ],
      },
      {
        titulo: 'Release: Fragrância do Ano',
        tipo: 'releases',
        categoria: 'Lançamento',
        descricao: 'A nova fragrância premium.',
        resumo:
          'Notas olfativas detalhadas, inspiração do perfumista e perfil do consumidor para a nova fragrância premium. Esteja preparado para apresentar esse lançamento de luxo.',
        indice_json: [
          { titulo: 'A Inspiração', pagina: 1 },
          { titulo: 'Pirâmide Olfativa', pagina: 3 },
          { titulo: 'Vendas', pagina: 6 },
        ],
      },
      {
        titulo: 'Treinamento: Técnicas de Venda',
        tipo: 'treinamento',
        categoria: 'Vendas',
        descricao: 'Aprenda a fechar mais vendas.',
        resumo:
          'Um guia prático com técnicas de abordagem, contorno de objeções e fechamento de vendas focado em produtos de beleza e bem-estar. Essencial para novos revendedores.',
        indice_json: [
          { titulo: 'Abordagem', pagina: 1 },
          { titulo: 'Objeções', pagina: 5 },
          { titulo: 'Fechamento', pagina: 10 },
        ],
      },
      {
        titulo: 'Treinamento: Produtos e Ativos',
        tipo: 'treinamento',
        categoria: 'Técnico',
        descricao: 'Conhecimento aprofundado dos ingredientes.',
        resumo:
          'Saiba o que faz os produtos Avatim serem tão especiais. Detalhes sobre os extratos naturais, óleos essenciais e benefícios dermatológicos para enriquecer seu discurso de vendas.',
        indice_json: [
          { titulo: 'Extratos', pagina: 1 },
          { titulo: 'Óleos', pagina: 4 },
          { titulo: 'Benefícios', pagina: 8 },
        ],
      },
      {
        titulo: 'Treinamento: Redes Sociais',
        tipo: 'treinamento',
        categoria: 'Marketing',
        descricao: 'Como vender usando Instagram e WhatsApp.',
        resumo:
          'Dicas de como fotografar produtos, escrever legendas atrativas e criar listas de transmissão eficientes no WhatsApp para manter seus clientes sempre engajados.',
        indice_json: [
          { titulo: 'Instagram', pagina: 1 },
          { titulo: 'WhatsApp', pagina: 6 },
          { titulo: 'Fotos', pagina: 11 },
        ],
      },
    ]

    mockPdfs.forEach((data) => {
      try {
        app.findFirstRecordByData('pdfs', 'titulo', data.titulo)
      } catch (_) {
        const record = new Record(collection)
        record.set('titulo', data.titulo)
        record.set('tipo', data.tipo)
        record.set('categoria', data.categoria)
        record.set('descricao', data.descricao)
        record.set('resumo', data.resumo)
        record.set('indice_json', data.indice_json)
        app.save(record)
      }
    })
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('pdfs')
    const fileField = collection.fields.getByName('arquivo')
    if (fileField) {
      fileField.required = true
      app.save(collection)
    }
  },
)
