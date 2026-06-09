migrate(
  (app) => {
    const products = app.findRecordsByFilter(
      'products',
      "id != ''",
      '',
      10000,
      0,
    )

    for (let i = 0; i < products.length; i++) {
      const record = products[i]
      const desc = record.getString('descricao') || ''
      const name = record.getString('name') || ''
      let changed = false

      // Matches 'Produto' (case-insensitive) at the beginning of the string with any trailing spaces
      const regex = /^produto\s*/i

      if (regex.test(desc)) {
        record.set('descricao', desc.replace(regex, '').trim())
        changed = true
      }

      if (regex.test(name)) {
        record.set('name', name.replace(regex, '').trim())
        changed = true
      }

      if (changed) {
        app.saveNoValidate(record)
      }
    }
  },
  (app) => {
    // Revert is not implemented as original prefixes cannot be accurately restored
  },
)
