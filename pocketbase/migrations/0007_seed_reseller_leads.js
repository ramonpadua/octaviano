migrate((app) => {
  const col = app.findCollectionByNameOrId('reseller_leads')

  const leads = [
    {
      name: 'João Silva',
      email: 'joao.silva@example.com',
      phone: '11999999999',
      cpf: '12345678901',
      address: 'Rua A',
      city: 'São Paulo',
      state: 'SP',
      status: 'pendente',
    },
    {
      name: 'Maria Oliveira',
      email: 'maria.o@example.com',
      phone: '11888888888',
      cpf: '10987654321',
      address: 'Rua B',
      city: 'Rio de Janeiro',
      state: 'RJ',
      status: 'aprovado',
    },
    {
      name: 'Carlos Souza',
      email: 'carlos.s@example.com',
      phone: '11777777777',
      cpf: '11223344556',
      address: 'Rua C',
      city: 'Curitiba',
      state: 'PR',
      status: 'finalizado',
    },
    {
      name: 'Ana Lima',
      email: 'ana.l@example.com',
      phone: '11666666666',
      cpf: '99887766554',
      address: 'Rua D',
      city: 'Belo Horizonte',
      state: 'MG',
      status: 'pendente',
    },
    {
      name: 'Pedro Alves',
      email: 'pedro.a@example.com',
      phone: '11555555555',
      cpf: '55443322110',
      address: 'Rua E',
      city: 'Porto Alegre',
      state: 'RS',
      status: 'pendente',
    },
    {
      name: 'Lucas Mendes',
      email: 'lucas.m@example.com',
      phone: '11444444444',
      cpf: '66778899000',
      address: 'Rua F',
      city: 'Salvador',
      state: 'BA',
      status: 'pendente',
    },
  ]

  for (const lead of leads) {
    try {
      app.findFirstRecordByData('reseller_leads', 'email', lead.email)
    } catch (_) {
      const record = new Record(col)
      record.set('name', lead.name)
      record.set('email', lead.email)
      record.set('phone', lead.phone)
      record.set('cpf', lead.cpf)
      record.set('address', lead.address)
      record.set('city', lead.city)
      record.set('state', lead.state)
      record.set('status', lead.status)
      app.save(record)
    }
  }
})
