migrate(
  (app) => {
    try {
      const records = app.findRecordsByFilter(
        'pdfs',
        "tipo = 'catalogo'",
        '',
        1000,
        0,
      )

      if (!records || records.length === 0) {
        return
      }

      // Filter to find the exact catalog title we want to preserve
      const candidates = records.filter(
        (r) => r.getString('titulo') === 'Catálogo de Produtos Avatim 2026.2',
      )

      let bestMatch = null
      if (candidates.length > 0) {
        // Prioritize the record that has both the file and the interactive index JSON
        bestMatch =
          candidates.find(
            (r) =>
              r.getString('arquivo') !== '' &&
              r.getString('indice_json') !== '' &&
              r.getString('indice_json') !== '[]' &&
              r.getString('indice_json') !== 'null',
          ) ||
          // Fallback to one that at least has the file
          candidates.find((r) => r.getString('arquivo') !== '') ||
          // Fallback to the first one found if none have files
          candidates[0]
      }

      // Perform deduplication: delete all catalog records except the best match
      for (const record of records) {
        if (bestMatch && record.id === bestMatch.id) {
          continue // Keep the best match
        }
        app.delete(record)
      }
    } catch (err) {
      console.log('Error in duplicate catalogs cleanup:', err)
    }
  },
  (app) => {
    // Down migration not applicable for deleted data
  },
)
