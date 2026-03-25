const http = require('http')
const { URL } = require('url')

const PORT = process.env.PORT || 8787
const MODEL_PATH = process.env.CARL_MODEL_PATH || 'local-heuristic-structured-v1'

function json(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  })
  res.end(JSON.stringify(payload))
}

function extractExplicitMotifs(text) {
  const motifPatterns = [
    /\blocked rooms?\b/gi,
    /\blocked doors?\b/gi,
    /\brooms?\b/gi,
    /\bdoors?\b/gi,
    /\bhouse\b/gi,
    /\bshadow\b/gi,
    /\bwater\b/gi,
    /\bmirror\b/gi,
    /\bfire\b/gi,
    /\bkey(?:s)?\b/gi,
    /\bstairs?\b/gi,
    /\bwindow(?:s)?\b/gi,
  ]
  const found = []
  for (const pattern of motifPatterns) {
    const matches = text.match(pattern)
    if (matches) found.push(...matches.map((match) => match.toLowerCase()))
  }
  return Array.from(new Set(found)).slice(0, 4)
}

function buildThemes(flowType, corpus) {
  const lower = corpus.toLowerCase()
  const themes = []

  const push = (label) => {
    if (!themes.includes(label)) themes.push(label)
  }

  if (/(dismiss|ignored|interrupted|misread|not heard|not seen)/.test(lower)) push('feeling dismissed or unseen')
  if (/(withdraw|distance|retreat|shut down|pull back)/.test(lower)) push('self-protection through distance')
  if (/(uncertain|unclear|confused|foggy|mixed)/.test(lower)) push('uncertainty and ambiguity')
  if (/(charge|irritat|angry|resent|frustrat)/.test(lower)) push('activated emotional charge')
  if (/(dream|symbol|image|figure|room|door|house)/.test(lower) || flowType === 'dream_exploration') push('symbolic material asking to be explored')
  if (/(repeat|again|always|pattern|recurring)/.test(lower)) push('recurring pattern worth tracking')

  if (!themes.length) push('emerging pattern still unclear')
  return themes.slice(0, 4)
}

function buildOpenQuestions(flowType, corpus, motifs) {
  const lower = corpus.toLowerCase()
  const questions = []

  if (/(dismiss|ignored|interrupted|misread)/.test(lower)) {
    questions.push('What exactly feels threatened when you experience dismissal or interruption?')
  }
  if (/(withdraw|distance|retreat|shut down|pull back)/.test(lower)) {
    questions.push('What happens in the moment just before you begin to pull away?')
  }
  if (flowType === 'dream_exploration' && motifs.length) {
    questions.push(`What feels most alive about the image of ${motifs[0]} without forcing an interpretation?`)
  }
  if (/(repeat|again|pattern|recurring)/.test(lower)) {
    questions.push('Where else has this same emotional pattern appeared before?')
  }
  if (!questions.length) {
    questions.push('What part of this reflection still feels unresolved or unfinished?')
    questions.push('What would be worth watching if this pattern returns?')
  }

  return questions.slice(0, 3)
}

function buildSummary(flowType, entry, answers, motifs, themes) {
  const answerText = answers.filter(Boolean).join(' ')
  const hasDreamTone = flowType === 'dream_exploration' || motifs.length > 0

  if (hasDreamTone) {
    return `This reflection gathers around a charged image or atmosphere rather than a clean conclusion. The strongest signal looks like ${themes[0]}, and the material seems more useful as something to stay with than to explain too quickly.`
  }

  if (flowType === 'conflict_clarity') {
    return `This conflict reflection suggests that the surface event carried extra emotional charge. The clearest pattern looks like ${themes[0]}, with a secondary movement toward ${themes[1] || 'self-protection'} that may be worth tracking across future entries.`
  }

  if (flowType === 'daily_checkin') {
    return `This check-in points to an active thread that is still unresolved. The clearest pattern looks like ${themes[0]}, and the current material suggests there may be more underneath the first feeling named.`
  }

  const source = (entry || answerText || '').trim()
  const snippet = source ? source.slice(0, 140) : 'the reflection'
  return `This entry suggests an emerging pattern rather than a finished conclusion. Starting from "${snippet}${source.length > 140 ? '…' : ''}", the strongest signal looks like ${themes[0]}.`
}

function analyze(payload) {
  const entry = String(payload.entry || '').trim()
  const flowType = String(payload.flowType || 'free_reflection')
  const answers = Array.isArray(payload.flowAnswers)
    ? payload.flowAnswers.map((item) => String(item.answer || item || '').trim()).filter(Boolean)
    : []

  const corpus = [entry, ...answers].filter(Boolean).join(' ')
  const symbolicMotifs = extractExplicitMotifs(corpus)
  const themeSuggestions = buildThemes(flowType, corpus)
  const openQuestions = buildOpenQuestions(flowType, corpus, symbolicMotifs)
  const summary = buildSummary(flowType, entry, answers, symbolicMotifs, themeSuggestions)

  return {
    summary,
    themeSuggestions,
    openQuestions,
    symbolicMotifs,
    meta: {
      modelPath: MODEL_PATH,
      mode: 'structured-json',
    },
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`)

  if (req.method === 'OPTIONS') return json(res, 200, { ok: true })

  if (req.method === 'GET' && url.pathname === '/api/health') {
    return json(res, 200, { ok: true, modelPath: MODEL_PATH })
  }

  if (req.method === 'POST' && url.pathname === '/api/analyze') {
    let body = ''
    req.on('data', (chunk) => {
      body += chunk
      if (body.length > 1_000_000) req.destroy()
    })
    req.on('end', () => {
      try {
        const payload = body ? JSON.parse(body) : {}
        const result = analyze(payload)
        json(res, 200, result)
      } catch (error) {
        json(res, 400, { error: 'Invalid JSON payload' })
      }
    })
    return
  }

  json(res, 404, { error: 'Not found' })
})

server.listen(PORT, () => {
  console.log(`Carl backend listening on http://localhost:${PORT}`)
})
