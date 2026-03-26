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
      'What image, figure, object, or scene stands out to you?',
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
      'This week, some material seems to gather around emotional charge rising quickly around perceived dismissal, uncertainty, or things that feel just out of reach. Across conflict and dream material, there may be a repeated movement toward protection, distance, or standing outside something not yet fully faced. These are working impressions rather than conclusions.',
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
    <div className="app">
      <div className="room">
        <header className="roomHeader">
          <div className="brandRow">
            <div className="brand">Carl</div>
            <div className="subtle">Private reflection, kept simple</div>
          </div>
          <nav className="roomNav">
            <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>Write</button>
            <button className={screen === 'summary' ? 'active' : ''} onClick={() => setScreen('summary')} disabled={!currentEntry}>Current note</button>
            <button className={screen === 'themes' ? 'active' : ''} onClick={() => setScreen('themes')}>Working notes</button>
            <button className={screen === 'weekly' ? 'active' : ''} onClick={() => setScreen('weekly')}>Week</button>
          </nav>
        </header>

        <main className="surface">
          {screen === 'home' && (
            <section className="sheet">
              <h1>A calm place to put words around what is here.</h1>
              <p className="welcomeLine">You can begin anywhere: what happened today, what is still sitting with you, or what you do not want to lose.</p>
              <p className="muted softNote">No performance. No fixing. Just a clear place to start.</p>

              <div className="controls">
                <div>
                  <label>How you want to begin</label>
                  <div className="segLine">
                    <button className={inputMode === 'text' ? 'active' : ''} onClick={() => setInputMode('text')}>Write</button>
                    <button className={inputMode === 'voice' ? 'active' : ''} onClick={() => setInputMode('voice')}>Voice</button>
                  </div>
                </div>
                <div>
                  <label>What kind of reflection this is</label>
                  <select value={entryType} onChange={(e) => setEntryType(e.target.value as EntryType)}>
                    <option value="free_reflection">Free reflection</option>
                    <option value="daily_checkin">Daily check-in</option>
                    <option value="conflict_clarity">Conflict clarity</option>
                    <option value="dream_exploration">Dream exploration</option>
                  </select>
                </div>
              </div>

              {inputMode === 'text' ? (
                <div className="reflectiveInput">
                  <textarea
                    value={draftText}
                    onChange={(e) => setDraftText(e.target.value)}
                    placeholder="Write plainly. Stay close to what happened and what still feels important."
                    rows={10}
                  />
                </div>
              ) : (
                <div className="voiceNote">
                  <p>Voice stays simple here. Continue when you are ready, and the reflection will use a transcribed note.</p>
                </div>
              )}

              <div className="actionRow">
                <button className="primary" onClick={startEntry} disabled={isAnalyzing}>{isAnalyzing ? 'Gathering your note…' : entryType === 'free_reflection' ? 'Keep this note' : 'Continue gently'}</button>
                <button onClick={() => setDraftText('I keep getting irritated faster than the situation seems to warrant, and later I feel embarrassed by how much charge it had.')}>Try sample text</button>
              </div>

              <section className="sheet utilityNote">
                <h3>Recent notes</h3>
                <div className="entryList">
                  {entries.map((entry) => (
                    <button key={entry.id} className="entryCard" onClick={() => { setCurrentEntry(entry); setScreen('summary') }}>
                      <div className="entryMeta">{entry.createdAt} · {titleForType(entry.type)}</div>
                      <div className="entryText">{entry.summary}</div>
                    </button>
                  ))}
                </div>
              </section>
            </section>
          )}

          {screen === 'flow' && activeFlow && (
            <section className="sheet">
              <div className="metaLine">Question {flowIndex + 1} of {activeFlow.prompts.length}</div>
              <h1>{activeFlow.title}</h1>
              <p className="muted">{activeFlow.intro}</p>
              <p className="softNote muted">Take your time. Short answers are fine.</p>

              <div className="promptBlock">
                <p className="promptText">{currentPrompt}</p>
              </div>

              <textarea
                rows={10}
                value={flowAnswers[flowIndex] || ''}
                onChange={(e) => {
                  const next = [...flowAnswers]
                  next[flowIndex] = e.target.value
                  setFlowAnswers(next)
                }}
                placeholder="Write a few honest lines. You do not need to get it exactly right."
              />

              <div className="actionRow">
                <button onClick={() => setFlowIndex((v) => Math.max(0, v - 1))} disabled={flowIndex === 0}>Back</button>
                {flowIndex < activeFlow.prompts.length - 1 ? (
                  <button className="primary" onClick={() => setFlowIndex((v) => v + 1)}>Continue</button>
                ) : (
                  <button className="primary" onClick={completeFlow} disabled={isAnalyzing}>{isAnalyzing ? 'Generating…' : 'Complete reflection'}</button>
                )}
              </div>
            </section>
          )}

          {screen === 'summary' && currentEntry && (
            <section className="sheet">
              <div className="metaLine">{currentEntry.createdAt} · {titleForType(currentEntry.type)}</div>
              <h1>Your note, held in one place.</h1>

              <section className="archivalBlock">
                <h3>Summary</h3>
                <p className="summaryText">{currentEntry.summary}</p>
                {currentEntry.modelPath && <div className="inlineMeta"><small>Model path: {currentEntry.modelPath}</small></div>}
              </section>

              <section className="archivalBlock">
                <h3>Possible patterns</h3>
                <div className="stack">
                  {currentEntry.themes.map((theme) => (
                    <div key={theme.id}>
                      <div className="memoryHeader">
                        <strong>{theme.label}</strong>
                        <span className="statusWord">{theme.status}</span>
                      </div>
                      <p>{theme.description}</p>
                      <small>Evidence: {theme.evidence[0]}</small>
                    </div>
                  ))}
                </div>
              </section>

              <section className="archivalBlock">
                <h3>Open questions</h3>
                <ul className="archiveList">
                  {currentEntry.openQuestions.map((question) => <li key={question} className="archiveItem">{question}</li>)}
                </ul>
              </section>

              {currentEntry.symbolicMotifs.length > 0 && (
                <section className="archivalBlock">
                  <h3>Symbolic motifs</h3>
                  <ul className="archiveList">
                    {currentEntry.symbolicMotifs.map((motif) => <li key={motif} className="archiveItem">{motif}</li>)}
                  </ul>
                </section>
              )}

              <div className="actionRow">
                <button className="primary" onClick={() => { setThemes((prev) => dedupeThemes([...currentEntry.themes, ...prev])); setScreen('themes') }}>Keep as a working note</button>
                <button onClick={() => setScreen('home')}>Back to the page</button>
              </div>
            </section>
          )}

          {screen === 'themes' && (
            <section className="sheet">
              <h1>Working notes</h1>
              <p className="muted welcomeLine">These are not verdicts. They are provisional notes you can keep, revise, or let go of.</p>
              <p className="muted">Provisional patterns that may be worth keeping, revising, or discarding.</p>
              <div className="stack">
                {themes.map((theme) => (
                  <div key={theme.id} className="memoryRecord">
                    <div className="memoryHeader">
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
                      rows={3}
                      value={theme.description}
                      onChange={(e) => setThemes((prev) => prev.map((item) => item.id === theme.id ? { ...item, description: e.target.value } : item))}
                    />
                    <div className="inlineMeta"><small>Evidence: {theme.evidence.join(' · ')}</small></div>
                  </div>
                ))}
              </div>
              <div className="actionRow">
                <button className="primary" onClick={() => setScreen('weekly')}>Open weekly review</button>
              </div>
            </section>
          )}

          {screen === 'weekly' && (
            <section className="sheet">
              <div className="metaLine">Mar 25 – Mar 31</div>
              <h1>Weekly review</h1>
              <p className="muted welcomeLine">A slower pass over the week, gathered into one place without forcing a conclusion.</p>

              <section className="weeklyBlock">
                <h3>Overall pattern</h3>
                <p className="summaryText">{weeklyReview.overall}</p>
              </section>

              <section className="weeklyBlock">
                <h3>Patterns that may be repeating</h3>
                <ul className="archiveList">{weeklyReview.emotionalPatterns.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Conflict dynamics that may be repeating</h3>
                <ul className="archiveList">{weeklyReview.conflictDynamics.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Repeated images</h3>
                <ul className="archiveList">{weeklyReview.symbolicMotifs.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Possible tensions to keep in view</h3>
                <ul className="archiveList">{weeklyReview.tensions.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Questions to carry forward</h3>
                <ul className="archiveList">{weeklyReview.carryForward.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Prompt to carry forward</h3>
                <p>{weeklyReview.prompt}</p>
              </section>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
