routerAdd('OPTIONS', '/backend/v1/pdfs/process', (e) => {
  const origin = e.request.header.get('Origin') || ''
  let allowedOrigin = 'https://sensatioonline.goskip.app'
  const allowedList = [
    'burgosoctaviano-cd529.goskip.app',
    'sensatioonline.goskip.app',
    'sanctuary-exploration-clone-e7bf4--preview.goskip.app',
    'localhost',
  ]
  if (allowedList.some((domain) => origin.includes(domain))) {
    allowedOrigin = origin
  }

  e.response.header().set('Access-Control-Allow-Origin', allowedOrigin)
  e.response.header().set('Access-Control-Allow-Methods', 'POST, OPTIONS')
  e.response
    .header()
    .set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  return e.noContent(204)
})

routerAdd(
  'POST',
  '/backend/v1/pdfs/process',
  (e) => {
    const origin = e.request.header.get('Origin') || ''
    let allowedOrigin = 'https://sensatioonline.goskip.app'
    const allowedList = [
      'burgosoctaviano-cd529.goskip.app',
      'sensatioonline.goskip.app',
      'sanctuary-exploration-clone-e7bf4--preview.goskip.app',
      'localhost',
    ]
    if (allowedList.some((domain) => origin.includes(domain))) {
      allowedOrigin = origin
    }

    e.response.header().set('Access-Control-Allow-Origin', allowedOrigin)
    e.response.header().set('Access-Control-Allow-Methods', 'POST, OPTIONS')
    e.response
      .header()
      .set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (!e.auth) {
      return e.unauthorizedError('Authentication required')
    }

    const body = e.requestInfo().body || {}
    const recordId = body.recordId

    if (!recordId) {
      return e.badRequestError('recordId is required')
    }

    const record = $app.findRecordById('pdfs', recordId)
    const arquivo = record.getString('arquivo')
    if (!arquivo) {
      return e.badRequestError('O PDF não possui um arquivo anexado')
    }

    if (!arquivo.toLowerCase().endsWith('.pdf')) {
      return e.badRequestError('O arquivo anexado não possui extensão PDF.')
    }

    // Access the PDF file directly from the Skip Cloud internal loopback
    // matching internal infrastructure on port 8080.
    const fileUrl = `http://127.0.0.1:8080/api/files/${record.collectionId}/${record.id}/${arquivo}`

    const fileRes = $http.send({ url: fileUrl, method: 'GET', timeout: 120 })
    if (fileRes.statusCode !== 200) {
      $app
        .logger()
        .error(
          'Falha ao baixar o arquivo do storage',
          'status',
          fileRes.statusCode,
          'url',
          fileUrl,
        )
      return e.internalServerError(
        'Falha ao baixar o arquivo do storage internamente',
      )
    }

    const bytes = new Uint8Array(fileRes.body)

    // Validation for size limits (> 100 bytes to ensure valid content, max 20MB for Gemini)
    if (bytes.length < 100) {
      $app
        .logger()
        .error('Arquivo muito pequeno para processamento', 'size', bytes.length)
      return e.badRequestError('Arquivo PDF muito pequeno ou corrompido.')
    }

    if (bytes.length > 20 * 1024 * 1024) {
      $app.logger().error('Arquivo excede limite de 20MB', 'size', bytes.length)
      return e.badRequestError(
        'O PDF excede o limite de tamanho suportado de 20MB.',
      )
    }

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    let base64Data = ''
    let i
    const l = bytes.length
    for (i = 2; i < l; i += 3) {
      base64Data += chars[bytes[i - 2] >> 2]
      base64Data += chars[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
      base64Data += chars[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)]
      base64Data += chars[bytes[i] & 0x3f]
    }
    if (i === l + 1) {
      base64Data += chars[bytes[i - 2] >> 2]
      base64Data += chars[(bytes[i - 2] & 0x03) << 4]
      base64Data += '=='
    }
    if (i === l) {
      base64Data += chars[bytes[i - 2] >> 2]
      base64Data += chars[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)]
      base64Data += chars[(bytes[i - 1] & 0x0f) << 2]
      base64Data += '='
    }

    const apiKey = $secrets.get('GEMINI_API_KEY')
    if (!apiKey) {
      $app.logger().error('GEMINI_API_KEY is not set in secrets')
      return e.internalServerError('API Key da IA não configurada no servidor')
    }

    const prompt =
      "Leia este PDF e gere: 1) Um índice em JSON com títulos, seções e números de página (array de objetos com chaves 'titulo', 'secao', 'pagina'). 2) Um resumo de 200 palavras em português. Retorne o resultado estritamente em formato JSON com duas chaves: 'indice_json' e 'resumo'. Sem formatação markdown ou blocos de código adicionais."

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { mimeType: 'application/pdf', data: base64Data } },
          ],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    }

    const res = $http.send({
      url:
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=' +
        apiKey,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      timeout: 120,
    })

    if (res.statusCode !== 200) {
      let errorBody = ''
      try {
        errorBody = res.string || new TextDecoder().decode(res.body)
      } catch (err) {
        errorBody = 'Unable to parse error response'
      }
      $app
        .logger()
        .error(
          'Gemini request failed',
          'status',
          res.statusCode,
          'body',
          errorBody,
        )
      return e.badRequestError('Falha ao processar o PDF com a IA')
    }

    try {
      const data = res.json
      if (!data.candidates || !data.candidates[0].content) {
        return e.internalServerError('IA retornou uma resposta vazia')
      }
      const text = data.candidates[0].content.parts[0].text

      let cleanedText = text.trim()
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.substring(7)
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.substring(3)
      }
      if (cleanedText.endsWith('```')) {
        cleanedText = cleanedText.substring(0, cleanedText.length - 3)
      }

      const result = JSON.parse(cleanedText)

      record.set('indice_json', result.indice_json)
      record.set('resumo', result.resumo)
      $app.save(record)

      return e.json(200, result)
    } catch (err) {
      $app.logger().error('Parse error', 'err', err.message)
      return e.internalServerError('Falha ao interpretar a resposta da IA')
    }
  },
  $apis.bodyLimit(100 * 1024 * 1024),
)
