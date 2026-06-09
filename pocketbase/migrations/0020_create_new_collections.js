migrate(
  (app) => {
    const pdfs = new Collection({
      name: 'pdfs',
      type: 'base',
      listRule: '',
      viewRule: '',
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'titulo', type: 'text', required: true },
        {
          name: 'tipo',
          type: 'select',
          required: true,
          values: ['catalogo', 'booking', 'releases', 'treinamento'],
          maxSelect: 1,
        },
        { name: 'categoria', type: 'text' },
        {
          name: 'arquivo',
          type: 'file',
          required: true,
          maxSelect: 1,
          maxSize: 52428800,
          mimeTypes: ['application/pdf'],
        },
        { name: 'descricao', type: 'text' },
        { name: 'indice_json', type: 'json' },
        { name: 'resumo', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(pdfs)

    const contatos = new Collection({
      name: 'contatos_whatsapp',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'nome', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'mensagem', type: 'text' },
        { name: 'numero_whatsapp', type: 'text' },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(contatos)

    const revendedores = new Collection({
      name: 'revendedores',
      type: 'base',
      listRule: "@request.auth.id != ''",
      viewRule: "@request.auth.id != ''",
      createRule: '',
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
      fields: [
        { name: 'nome', type: 'text' },
        { name: 'whatsapp', type: 'text' },
        { name: 'cpf_cnpj', type: 'text' },
        { name: 'rg_ie', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'endereco', type: 'text' },
        { name: 'numero_porta', type: 'text' },
        { name: 'bairro', type: 'text' },
        { name: 'cidade', type: 'text' },
        { name: 'estado', type: 'text' },
        { name: 'cep', type: 'text' },
        {
          name: 'status',
          type: 'select',
          values: ['pendente', 'aprovado', 'finalizado'],
          maxSelect: 1,
        },
        { name: 'created', type: 'autodate', onCreate: true, onUpdate: false },
        { name: 'updated', type: 'autodate', onCreate: true, onUpdate: true },
      ],
    })
    app.save(revendedores)
  },
  (app) => {
    try {
      app.delete(app.findCollectionByNameOrId('pdfs'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('contatos_whatsapp'))
    } catch (_) {}
    try {
      app.delete(app.findCollectionByNameOrId('revendedores'))
    } catch (_) {}
  },
)
