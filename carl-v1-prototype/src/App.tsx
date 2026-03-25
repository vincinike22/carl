import { useMemo, useState } from 'react'

const API_BASE = 'http://localhost:8787'

type EntryType = 'free_reflection' | 'daily_checkin' | 'conflict_clarity' | 'dream_exploration'
type Screen = 'home' | 'flow' | 'summary' | 'themes' | 'weekly'
type ThemeStatus = 'emerging' | 'recurring' | 'core'

type Theme = {
  id: string
  label: string
  description: string
  status: ThemeStatus
  evidence: string[]
}

type StructuredAnalysis = {
  summary: string
  themeSuggestions: string[]
  openQuestions: string[]
  symbolicMotifs: string[]
  meta?: {
    modelPath?: string
    mode?: string
  }
}

type Entry = {
  id: string
  type: EntryType
  source: 'text' | 'voice'
  text: string
  flowAnswers?: { prompt: string; answer: string }[]
  summary: string
  openQuestions: string[]
  themes: Theme[]
  symbolicMotifs: string[]
  createdAt: string
  modelPath?: string
}

type FlowPromptMap = Record<Exclude<EntryType, 'free_reflection'>, { title: string; intro: string; prompts: string[] }>

const flows: FlowPromptMap = {
  daily_checkin: {
    title: 'Daily Check-In',
    intro: 'A short check-in to notice what is most alive in you right now.',
    prompts: [
      'What feels most alive in you right now?',
      'What emotion has the most charge at the moment?',
      'What feels unresolved, recurring, or difficult to put down?',
      'What are you avoiding, resisting, or not wanting to look at?',
      'What feels uncertain or still unclear?',
    ],
  },
  conflict_clarity: {
    title: 'Conflict Clarity',
    intro: 'A short reflection on conflict, reaction, and what may be repeating beneath the surface.',
    prompts: [
      'What happened? Describe the conflict as simply as you can.',
      'What part of it still carries the most charge?',
      'What bothered you most about the other person’s behavior, tone, or stance?',
      'Where might a version of that quality also exist in you, even if it shows up differently?',
      'Does this resemble an older pattern in your life or relationships? If so, how?',
      'What remains unresolved or difficult to admit?',
    ],
  },
  dream_exploration: {
    title: 'Dream Exploration',
    intro: 'A short exploration of dream images, feeling tone, and possible waking-life resonance.',
    prompts: [
      'What happened in the dream? Describe it in your own words.',
      'What image, figure, object, or scene stands out most strongly?',
      'What feeling stayed with you after waking?',
      'Does any part of the dream seem connected to your current waking life?',
      'Does anything in the dream feel familiar, recurring, or strangely charged?',
      'What part of the dream should remain open rather than explained too quickly?',
    ],
  },
}

const seedEntries: Entry[] = [
  {
    id: 'e1',
    type: 'conflict_clarity',
    source: 'text',
    text: 'I got irritated in a call with my cofounder. I felt dismissed fast and then withdrew.',
    summary:
      'You describe irritation rising quickly after feeling dismissed. A possible pattern here is that criticism or interruption becomes a struggle around dignity, then turns into withdrawal.',
    openQuestions: ['What exactly feels threatened when you feel dismissed?', 'What happens in you just before withdrawal begins?'],
    symbolicMotifs: [],
    createdAt: '2026-03-23',
    themes: [
      {
        id: 't1',
        label: 'Sensitivity to dismissal',
        description: 'Perceived interruption or dismissal quickly creates emotional charge.',
        status: 'recurring',
        evidence: ['I felt dismissed fast and then withdrew.'],
      },
      {
        id: 't2',
        label: 'Withdrawal after charge',
        description: 'Intensity is followed by stepping back rather than staying in contact.',
        status: 'emerging',
        evidence: ['I felt dismissed fast and then withdrew.'],
      },
    ],
  },
  {
    id: 'e2',
    type: 'dream_exploration',
    source: 'text',
    text: 'I dreamed I was in a house with many locked rooms. I kept hearing movement behind a door.',
    summary:
      'The dream centers on enclosed spaces, hidden movement, and something present but not yet seen. A possible motif is that something important feels near, but not yet approachable directly.',
    openQuestions: ['What in waking life currently feels present but unopened?', 'What would it mean to approach the locked room without forcing it open?'],
    symbolicMotifs: ['locked rooms', 'hidden movement'],
    createdAt: '2026-03-24',
    themes: [
      {
        id: 't3',
        label: 'Closed inner spaces',
        description: 'Images of sealed or hidden interior spaces recur around uncertainty.',
        status: 'emerging',
        evidence: ['house with many locked rooms'],
      },
    ],
  },
]

const allSeedThemes = dedupeThemes(seedEntries.flatMap((entry) => entry.themes))

function id() {
  return Math.random().toString(36).slice(2, 10)
}

function titleForType(type: EntryType) {
  switch (type) {
    case 'free_reflection':
      return 'Free Reflection'
    case 'daily_checkin':
      return 'Daily Check-In'
    case 'conflict_clarity':
      return 'Conflict Clarity'
    case 'dream_exploration':
      return 'Dream Exploration'
  }
}

function dedupeThemes(themes: Theme[]) {
  const map = new Map<string, Theme>()
  themes.forEach((theme) => {
    const existing = map.get(theme.label)
    if (!existing) {
      map.set(theme.label, { ...theme, evidence: [...theme.evidence] })
      return
    }
    existing.evidence = Array.from(new Set([...existing.evidence, ...theme.evidence]))
    if (existing.status === 'emerging' && theme.status !== 'emerging') existing.status = theme.status
  })
  return Array.from(map.values())
}

function describeTheme(label: string) {
  if (label.includes('dismiss')) return 'Moments of interruption or dismissal seem to carry disproportionate emotional weight.'
  if (label.includes('distance')) return 'Intensity appears to be followed by retreat, withdrawal, or protective distance.'
  if (label.includes('uncertainty')) return 'Ambiguity remains active and seems emotionally loaded rather than neutral.'
  if (label.includes('symbolic')) return 'Images, symbols, or dream material seem to be carrying emotional meaning.'
  if (label.includes('charge')) return 'The material carries noticeable emotional activation beyond the surface event.'
  if (label.includes('recurring')) return 'This may be a repeated pattern rather than a one-off event.'
  return 'This theme may be meaningful, but likely needs repetition before it becomes clear.'
}

function fallbackPrototypeSummary(type: EntryType, text: string, answers: string[]) {
  const source = [text, ...answers].join(' ').toLowerCase()
  if (type === 'conflict_clarity') {
    return {
      summary:
        'You describe a conflict that carries more charge than the surface event alone. A possible pattern is that feeling dismissed quickly becomes self-protection, then distance. This may be worth watching as an emerging loop rather than a settled truth.',
      openQuestions: ['What gets protected first when charge rises?', 'Where have you felt this pattern before?'],
      themes: [
        {
          id: id(),
          label: 'Sensitivity to dismissal',
          description: 'Dismissal or interruption appears to trigger immediate emotional charge.',
          status: 'emerging' as ThemeStatus,
          evidence: [answers[1] || text.slice(0, 90)],
        },
        {
          id: id(),
          label: 'Self-protection through distance',
          description: 'Conflict seems to move quickly toward withdrawal or internal retreat.',
          status: 'emerging' as ThemeStatus,
          evidence: [answers[5] || answers[0] || text.slice(0, 90)],
        },
      ],
      motifs: [] as string[],
      meta: {
        modelPath: 'frontend-fallback-rule-path',
      },
    }
  }
  if (type === 'dream_exploration') {
    return {
      summary:
        'This dream seems to gather around one charged image rather than a clear conclusion. A possible pattern is that something important feels near, hidden, or not yet fully available to awareness. The dream is better held as a motif than explained too quickly.',
      openQuestions: ['What in waking life currently feels present but unopened?', 'What part of this dream should remain open for now?'],
      themes: [
        {
          id: id(),
          label: 'Charged hidden imagery',
          description: 'Dream material points toward what is sensed but not yet fully known.',
          status: 'emerging' as ThemeStatus,
          evidence: [answers[1] || text.slice(0, 90)],
        },
      ],
      motifs: source.includes('door') || source.includes('room') ? ['doors / rooms'] : ['charged dream image'],
      meta: {
        modelPath: 'frontend-fallback-rule-path',
      },
    }
  }
  if (type === 'daily_checkin') {
    return {
      summary:
        'Your check-in suggests an active emotional thread that is not fully resolved. A possible pattern is that one feeling holds the visible charge while another concern remains underneath it. This feels early, but worth tracking across several entries.',
      openQuestions: ['What feeling is underneath the one you named first?', 'What keeps this from settling?'],
      themes: [
        {
          id: id(),
          label: 'Active unresolved tension',
          description: 'Something emotionally alive continues to remain unresolved.',
          status: 'emerging' as ThemeStatus,
          evidence: [answers[2] || text.slice(0, 90)],
        },
      ],
      motifs: [] as string[],
      meta: {
        modelPath: 'frontend-fallback-rule-path',
      },
    }
  }
  return {
    summary:
      'This reflection suggests an emotionally charged thread that may connect to a broader pattern. Nothing here needs to be concluded yet, but there may be the beginning of something recurring worth watching over time.',
    openQuestions: ['What in this entry feels familiar?', 'What seems larger than the immediate moment?'],
    themes: [
      {
        id: id(),
        label: 'Emerging recurring pattern',
        description: 'The material suggests a pattern that may become clearer with repetition.',
        status: 'emerging' as ThemeStatus,
        evidence: [text.slice(0, 90)],
      },
    ],
    motifs: [] as string[],
    meta: {
      modelPath: 'frontend-fallback-rule-path',
    },
  }
}

async function generateStructuredOutput(type: EntryType, text: string, answers: string[]) {
  const flowAnswers = answers.map((answer, index) => ({ prompt: `q${index + 1}`, answer }))

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        flowType: type,
        entry: text,
        flowAnswers,
      }),
    })

    if (!response.ok) throw new Error('analysis request failed')

    const data = (await response.json()) as StructuredAnalysis
    const evidence = answers.find(Boolean) || text.slice(0, 90)

    return {
      summary: data.summary,
      openQuestions: data.openQuestions,
      themes: data.themeSuggestions.map((label) => ({
        id: id(),
        label,
        description: describeTheme(label),
        status: 'emerging' as ThemeStatus,
        evidence: [evidence],
      })),
      motifs: data.symbolicMotifs,
      meta: data.meta,
    }
  } catch {
    return fallbackPrototypeSummary(type, text, answers)
  }
}

function buildWeeklyReview(entries: Entry[], themes: Theme[]) {
  const recent = [...entries].slice(0, 5)
  const topThemes = themes.slice(0, 3)
  const motifSet = Array.from(new Set(recent.flatMap((entry) => entry.symbolicMotifs))).slice(0, 3)

  return {
    overall:
      'This week, a possible pattern appears around emotional charge rising quickly around perceived dismissal, uncertainty, or material that feels just out of reach. Across conflict and dream material, the repeated movement is toward protection, distance, or standing outside something not yet fully faced. The underlying tension may involve wanting clearer recognition while also guarding against exposure. This is still emerging, not settled.',
    emotionalPatterns: topThemes.map((theme) => `${theme.label} — ${theme.description}`),
    conflictDynamics: [
      'Charge rises quickly after feeling interrupted or misread.',
      'Distance or withdrawal appears as a response to intensity.',
    ],
    symbolicMotifs: motifSet.length ? motifSet : ['locked rooms', 'hidden movement'],
    tensions: ['Recognition vs exposure', 'Control vs contact'],
    carryForward: [
      'What happens just before emotional distance begins?',
      'Where does a wish to be understood become self-protection instead?',
    ],
    prompt: 'As the week continues, notice the moment a reaction begins to close rather than speak.',
  }
}

export function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [entryType, setEntryType] = useState<EntryType>('daily_checkin')
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text')
  const [draftText, setDraftText] = useState('')
  const [entries, setEntries] = useState<Entry[]>(seedEntries)
  const [themes, setThemes] = useState<Theme[]>(allSeedThemes)
  const [flowIndex, setFlowIndex] = useState(0)
  const [flowAnswers, setFlowAnswers] = useState<string[]>([])
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const activeFlow = entryType === 'free_reflection' ? null : flows[entryType]
  const weeklyReview = useMemo(() => buildWeeklyReview(entries, themes), [entries, themes])

  const startEntry = async () => {
    if (entryType === 'free_reflection') {
      setIsAnalyzing(true)
      const sourceText = draftText || 'Voice note placeholder transcript: I kept circling around the same feeling all day.'
      const generated = await generateStructuredOutput(entryType, sourceText, [])
      const entry: Entry = {
        id: id(),
        type: entryType,
        source: inputMode,
        text: sourceText,
        summary: generated.summary,
        openQuestions: generated.openQuestions,
        themes: generated.themes,
        symbolicMotifs: generated.motifs,
        createdAt: new Date().toISOString().slice(0, 10),
        modelPath: generated.meta?.modelPath,
      }
      setEntries((prev) => [entry, ...prev])
      setThemes((prev) => dedupeThemes([...generated.themes, ...prev]))
      setCurrentEntry(entry)
      setScreen('summary')
      setIsAnalyzing(false)
      return
    }
    setFlowAnswers(Array(activeFlow?.prompts.length || 0).fill(''))
    setFlowIndex(0)
    setScreen('flow')
  }

  const completeFlow = async () => {
    setIsAnalyzing(true)
    const sourceText = draftText || (inputMode === 'voice' ? 'Mock transcript: voice capture used for this reflection.' : '')
    const generated = await generateStructuredOutput(entryType, sourceText, flowAnswers)
    const promptAnswers = activeFlow?.prompts.map((prompt, index) => ({ prompt, answer: flowAnswers[index] || '' })) || []
    const entry: Entry = {
      id: id(),
      type: entryType,
      source: inputMode,
      text: sourceText,
      flowAnswers: promptAnswers,
      summary: generated.summary,
      openQuestions: generated.openQuestions,
      themes: generated.themes,
      symbolicMotifs: generated.motifs,
      createdAt: new Date().toISOString().slice(0, 10),
      modelPath: generated.meta?.modelPath,
    }
    setEntries((prev) => [entry, ...prev])
    setCurrentEntry(entry)
    setThemes((prev) => dedupeThemes([...generated.themes, ...prev]))
    setScreen('summary')
    setIsAnalyzing(false)
  }

  const currentPrompt = activeFlow?.prompts[flowIndex] || ''

  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <div className="brand">Carl</div>
          <div className="subtle">Private reflection prototype</div>
        </div>
        <nav className="nav">
          <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>Home / Capture</button>
          <button className={screen === 'summary' ? 'active' : ''} onClick={() => setScreen('summary')} disabled={!currentEntry}>Entry Summary</button>
          <button className={screen === 'themes' ? 'active' : ''} onClick={() => setScreen('themes')}>Themes Memory</button>
          <button className={screen === 'weekly' ? 'active' : ''} onClick={() => setScreen('weekly')}>Weekly Review</button>
        </nav>
        <div className="panel small">
          <strong>Prototype assumptions</strong>
          <ul>
            <li>Local in-memory state only</li>
            <li>Mocked transcription</li>
            <li>One narrow backend endpoint for structured output</li>
            <li>No broader architecture changes in this pass</li>
          </ul>
        </div>
      </aside>

      <main className="main">
        {screen === 'home' && (
          <section className="panel">
            <h1>Home / Capture</h1>
            <p className="muted">A private space for reflection and recurring patterns.</p>
            <div className="row gap">
              <div>
                <label>Input mode</label>
                <div className="segmented">
                  <button className={inputMode === 'text' ? 'active' : ''} onClick={() => setInputMode('text')}>Write</button>
                  <button className={inputMode === 'voice' ? 'active' : ''} onClick={() => setInputMode('voice')}>Voice</button>
                </div>
              </div>
              <div>
                <label>Entry type</label>
                <select value={entryType} onChange={(e) => setEntryType(e.target.value as EntryType)}>
                  <option value="free_reflection">Free reflection</option>
                  <option value="daily_checkin">Daily check-in</option>
                  <option value="conflict_clarity">Conflict clarity</option>
                  <option value="dream_exploration">Dream exploration</option>
                </select>
              </div>
            </div>

            {inputMode === 'text' ? (
              <textarea
                value={draftText}
                onChange={(e) => setDraftText(e.target.value)}
                placeholder="Write what happened, what you felt, or what image stays with you..."
                rows={9}
              />
            ) : (
              <div className="mockVoice">
                <div className="voiceBox">Mock voice capture enabled</div>
                <p className="muted">For prototype purposes, voice is treated as uploaded and transcribed when you continue.</p>
              </div>
            )}

            <div className="row gap">
              <button className="primary" onClick={startEntry} disabled={isAnalyzing}>{isAnalyzing ? 'Generating…' : entryType === 'free_reflection' ? 'Save entry' : 'Continue'}</button>
              <button onClick={() => setDraftText('I keep getting irritated faster than the situation seems to warrant, and later I feel embarrassed by how much charge it had.')}>Load demo text</button>
            </div>

            <div className="panel nested">
              <h3>Recent entries</h3>
              <div className="stack">
                {entries.map((entry) => (
                  <button key={entry.id} className="entryCard" onClick={() => { setCurrentEntry(entry); setScreen('summary') }}>
                    <div className="entryMeta">{entry.createdAt} · {titleForType(entry.type)}</div>
                    <div>{entry.summary}</div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {screen === 'flow' && activeFlow && (
          <section className="panel">
            <h1>{activeFlow.title}</h1>
            <p className="muted">{activeFlow.intro}</p>
            <div className="progress">Question {flowIndex + 1} of {activeFlow.prompts.length}</div>
            <label>{currentPrompt}</label>
            <textarea
              rows={8}
              value={flowAnswers[flowIndex] || ''}
              onChange={(e) => {
                const next = [...flowAnswers]
                next[flowIndex] = e.target.value
                setFlowAnswers(next)
              }}
              placeholder="Write plainly. No need to conclude anything yet."
            />
            <div className="row gap">
              <button onClick={() => setFlowIndex((v) => Math.max(0, v - 1))} disabled={flowIndex === 0}>Back</button>
              {flowIndex < activeFlow.prompts.length - 1 ? (
                <button className="primary" onClick={() => setFlowIndex((v) => v + 1)}>Next</button>
              ) : (
                <button className="primary" onClick={completeFlow} disabled={isAnalyzing}>{isAnalyzing ? 'Generating…' : 'Finish reflection'}</button>
              )}
            </div>
          </section>
        )}

        {screen === 'summary' && currentEntry && (
          <section className="panel">
            <h1>Entry Summary</h1>
            <div className="summaryBlock">
              <h3>Reflection summary</h3>
              <p>{currentEntry.summary}</p>
              {currentEntry.modelPath && <small>Model path: {currentEntry.modelPath}</small>}
            </div>
            <div className="grid two">
              <div className="panel nested">
                <h3>Possible recurring themes</h3>
                {currentEntry.themes.map((theme) => (
                  <div key={theme.id} className="themeChipBlock">
                    <div className="themeHeader">
                      <strong>{theme.label}</strong>
                      <span>{theme.status}</span>
                    </div>
                    <p>{theme.description}</p>
                    <small>Evidence: {theme.evidence[0]}</small>
                  </div>
                ))}
              </div>
              <div className="panel nested">
                <h3>Open questions</h3>
                <ul>
                  {currentEntry.openQuestions.map((question) => <li key={question}>{question}</li>)}
                </ul>
                {currentEntry.symbolicMotifs.length > 0 && (
                  <>
                    <h3>Symbolic motifs</h3>
                    <ul>
                      {currentEntry.symbolicMotifs.map((motif) => <li key={motif}>{motif}</li>)}
                    </ul>
                  </>
                )}
              </div>
            </div>
            <div className="row gap">
              <button className="primary" onClick={() => { setThemes((prev) => dedupeThemes([...currentEntry.themes, ...prev])); setScreen('themes') }}>Accept themes</button>
              <button onClick={() => setScreen('home')}>Back to capture</button>
            </div>
          </section>
        )}

        {screen === 'themes' && (
          <section className="panel">
            <h1>Themes Memory</h1>
            <p className="muted">Editable recurring themes across entries.</p>
            <div className="stack">
              {themes.map((theme) => (
                <div key={theme.id} className="panel nested">
                  <div className="themeHeader">
                    <input
                      value={theme.label}
                      onChange={(e) => setThemes((prev) => prev.map((item) => item.id === theme.id ? { ...item, label: e.target.value } : item))}
                    />
                    <select
                      value={theme.status}
                      onChange={(e) => setThemes((prev) => prev.map((item) => item.id === theme.id ? { ...item, status: e.target.value as ThemeStatus } : item))}
                    >
                      <option value="emerging">emerging</option>
                      <option value="recurring">recurring</option>
                      <option value="core">core</option>
                    </select>
                  </div>
                  <textarea
                    rows={2}
                    value={theme.description}
                    onChange={(e) => setThemes((prev) => prev.map((item) => item.id === theme.id ? { ...item, description: e.target.value } : item))}
                  />
                  <small>Evidence: {theme.evidence.join(' · ')}</small>
                </div>
              ))}
            </div>
            <div className="row gap">
              <button className="primary" onClick={() => setScreen('weekly')}>View weekly review</button>
            </div>
          </section>
        )}

        {screen === 'weekly' && (
          <section className="panel">
            <h1>Weekly Review</h1>
            <p className="muted">Mar 25 – Mar 31</p>
            <div className="summaryBlock">
              <h3>Overall pattern summary</h3>
              <p>{weeklyReview.overall}</p>
            </div>
            <div className="grid two">
              <div className="panel nested">
                <h3>Recurring emotional patterns</h3>
                <ul>{weeklyReview.emotionalPatterns.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Recurring conflict dynamics</h3>
                <ul>{weeklyReview.conflictDynamics.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="panel nested">
                <h3>Recurring symbolic motifs</h3>
                <ul>{weeklyReview.symbolicMotifs.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Possible tensions / polarities</h3>
                <ul>{weeklyReview.tensions.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
            <div className="panel nested">
              <h3>Questions to carry forward</h3>
              <ul>{weeklyReview.carryForward.map((item) => <li key={item}>{item}</li>)}</ul>
              <h3>One grounded prompt for next week</h3>
              <p>{weeklyReview.prompt}</p>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
