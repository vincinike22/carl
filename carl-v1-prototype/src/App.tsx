import { useMemo, useState } from 'react'

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
}

type FlowPromptMap = Record<Exclude<EntryType, 'free_reflection'>, { title: string; intro: string; prompts: string[] }>

const flows: FlowPromptMap = {
  daily_checkin: {
    title: 'Daily Check-In',
    intro: 'A short moment to notice what is quietly asking for attention right now.',
    prompts: [
      'What feels most present in you right now?',
      'What feeling has the most weight or charge?',
      'What has been lingering beneath the day?',
      'What are you not quite wanting to face yet?',
      'What still feels uncertain, unfinished, or hard to name?',
    ],
  },
  conflict_clarity: {
    title: 'Conflict Clarity',
    intro: 'A calm pass through conflict, reaction, and what may be repeating underneath it.',
    prompts: [
      'What happened, in the simplest terms?',
      'What part still feels most charged?',
      'What in the other person most bothered you?',
      'Where might some version of that also live in you, even differently?',
      'Does this resemble an older pattern in your life or relationships?',
      'What remains unresolved or difficult to admit?',
    ],
  },
  dream_exploration: {
    title: 'Dream Exploration',
    intro: 'A gentle look at dream imagery, feeling tone, and what may be echoing into waking life.',
    prompts: [
      'What happened in the dream?',
      'What image, figure, or place stands out most strongly?',
      'What feeling stayed with you after waking?',
      'Does any part of the dream touch your current waking life?',
      'What in the dream feels recurring, familiar, or especially charged?',
      'What should remain open rather than explained too quickly?',
    ],
  },
}

const starterPrompts = [
  'I keep circling around the same feeling and can’t quite settle it.',
  'Something small hit me harder than it should have today.',
  'A dream stayed with me, but I do not know why.',
]

const seedEntries: Entry[] = [
  {
    id: 'e1',
    type: 'conflict_clarity',
    source: 'text',
    text: 'I got irritated in a call with my cofounder. I felt dismissed fast and then withdrew.',
    summary:
      'You describe irritation rising quickly after feeling dismissed. A possible pattern here is that interruption or criticism lands as a threat to dignity, then turns into distance. That may be worth watching without deciding too quickly what it means.',
    openQuestions: ['What feels threatened first when you feel dismissed?', 'What happens in you just before you pull back?'],
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
      'The dream gathers around enclosed space, hidden movement, and something sensed but not yet met directly. A possible motif is that something important feels near, though not ready to be forced into explanation.',
    openQuestions: ['What in waking life currently feels present but unopened?', 'What would it mean to approach this without forcing it?'],
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

function subtitleForType(type: EntryType) {
  switch (type) {
    case 'free_reflection':
      return 'Start anywhere. No need to be polished.'
    case 'daily_checkin':
      return 'A brief emotional orientation.'
    case 'conflict_clarity':
      return 'For conflict, reaction, and projection.'
    case 'dream_exploration':
      return 'For dream images and waking echoes.'
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

function makePrototypeSummary(type: EntryType, text: string, answers: string[]) {
  const source = [text, ...answers].join(' ').toLowerCase()
  if (type === 'conflict_clarity') {
    return {
      summary:
        'You describe a conflict that seems to carry more charge than the surface event alone. A possible pattern is that feeling dismissed quickly becomes self-protection, then distance. That does not settle the meaning, but it does suggest a loop worth noticing earlier next time.',
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
    }
  }
  if (type === 'dream_exploration') {
    return {
      summary:
        'This dream seems to gather around one charged image rather than a clear conclusion. A possible pattern is that something important feels near, hidden, or not yet fully available to awareness. It is better held gently as a motif than turned into a verdict too quickly.',
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
    }
  }
  if (type === 'daily_checkin') {
    return {
      summary:
        'Your check-in suggests an active emotional thread that has not fully resolved. One feeling seems to hold the visible charge while something quieter may be sitting underneath it. Nothing here needs a grand interpretation yet, but it feels worth tracking across several days.',
      openQuestions: ['What feeling sits underneath the one you named first?', 'What keeps this from settling?'],
      themes: [
        {
          id: id(),
          label: 'Active unresolved tension',
          description: 'Something emotionally alive continues to remain unsettled.',
          status: 'emerging' as ThemeStatus,
          evidence: [answers[2] || text.slice(0, 90)],
        },
      ],
      motifs: [] as string[],
    }
  }
  return {
    summary:
      'This reflection carries the sense of something emotionally active but not yet named clearly. A pattern may be beginning to take shape here. It does not need to be concluded now, only noticed and returned to if it keeps repeating.',
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
  }
}

function buildWeeklyReview(entries: Entry[], themes: Theme[]) {
  const recent = [...entries].slice(0, 5)
  const topThemes = themes.slice(0, 3)
  const motifSet = Array.from(new Set(recent.flatMap((entry) => entry.symbolicMotifs))).slice(0, 3)

  return {
    overall:
      'This week, a possible pattern appears around emotional charge gathering quickly around dismissal, uncertainty, or material that feels just out of reach. Across conflict and dream reflections, the repeated movement is toward protection, distance, or standing outside something not yet fully faced. The underlying tension may involve wanting recognition while guarding against exposure. This is still emerging, not settled.',
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

  const activeFlow = entryType === 'free_reflection' ? null : flows[entryType]
  const weeklyReview = useMemo(() => buildWeeklyReview(entries, themes), [entries, themes])

  const startEntry = () => {
    if (entryType === 'free_reflection') {
      const generated = makePrototypeSummary(entryType, draftText, [])
      const entry: Entry = {
        id: id(),
        type: entryType,
        source: inputMode,
        text: draftText || 'Voice note placeholder transcript: I kept circling around the same feeling all day.',
        summary: generated.summary,
        openQuestions: generated.openQuestions,
        themes: generated.themes,
        symbolicMotifs: generated.motifs,
        createdAt: new Date().toISOString().slice(0, 10),
      }
      setEntries((prev) => [entry, ...prev])
      setCurrentEntry(entry)
      setScreen('summary')
      return
    }
    setFlowAnswers(Array(activeFlow?.prompts.length || 0).fill(''))
    setFlowIndex(0)
    setScreen('flow')
  }

  const completeFlow = () => {
    const generated = makePrototypeSummary(entryType, draftText, flowAnswers)
    const promptAnswers = activeFlow?.prompts.map((prompt, index) => ({ prompt, answer: flowAnswers[index] || '' })) || []
    const entry: Entry = {
      id: id(),
      type: entryType,
      source: inputMode,
      text: draftText || (inputMode === 'voice' ? 'Mock transcript: voice capture used for this reflection.' : ''),
      flowAnswers: promptAnswers,
      summary: generated.summary,
      openQuestions: generated.openQuestions,
      themes: generated.themes,
      symbolicMotifs: generated.motifs,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setEntries((prev) => [entry, ...prev])
    setCurrentEntry(entry)
    setThemes((prev) => dedupeThemes([...generated.themes, ...prev]))
    setScreen('summary')
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
          <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>Home</button>
          <button className={screen === 'summary' ? 'active' : ''} onClick={() => setScreen('summary')} disabled={!currentEntry}>Latest reflection</button>
          <button className={screen === 'themes' ? 'active' : ''} onClick={() => setScreen('themes')}>Themes</button>
          <button className={screen === 'weekly' ? 'active' : ''} onClick={() => setScreen('weekly')}>Weekly review</button>
        </nav>
        <div className="panel small softPanel">
          <strong>What changed in this pass</strong>
          <ul>
            <li>warmer entry language</li>
            <li>calmer visual rhythm</li>
            <li>softer prompts without losing seriousness</li>
            <li>more human summary tone</li>
          </ul>
        </div>
      </aside>

      <main className="main">
        {screen === 'home' && (
          <section className="heroWrap">
            <div className="hero panel softPanel">
              <div className="eyebrow">Private · Calm · Serious</div>
              <h1>A quieter way to notice what keeps returning.</h1>
              <p className="lead">
                Carl is a private reflection space for emotional patterns, conflict, dreams, and what remains unresolved.
                It offers questions and hypotheses, not verdicts.
              </p>
              <div className="starterRow">
                {starterPrompts.map((prompt) => (
                  <button key={prompt} className="starterChip" onClick={() => setDraftText(prompt)}>{prompt}</button>
                ))}
              </div>
            </div>

            <section className="panel composerPanel">
              <div className="sectionTop">
                <div>
                  <div className="sectionLabel">Begin here</div>
                  <h2>{titleForType(entryType)}</h2>
                  <p className="muted">{subtitleForType(entryType)}</p>
                </div>
              </div>

              <div className="grid two">
                <div>
                  <label>Entry mode</label>
                  <div className="segmented">
                    <button className={inputMode === 'text' ? 'active' : ''} onClick={() => setInputMode('text')}>Write</button>
                    <button className={inputMode === 'voice' ? 'active' : ''} onClick={() => setInputMode('voice')}>Voice</button>
                  </div>
                </div>
                <div>
                  <label>Reflection path</label>
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
                  placeholder="Write plainly. Start with what happened, what stayed with you, or what you cannot quite put down."
                  rows={8}
                />
              ) : (
                <div className="mockVoice softInset">
                  <div className="voiceBox">Mock voice capture</div>
                  <p className="muted">For this pass, voice is simulated and converted into a placeholder transcript when you continue.</p>
                </div>
              )}

              <div className="row gap wrap">
                <button className="primary" onClick={startEntry}>{entryType === 'free_reflection' ? 'Save reflection' : 'Continue gently'}</button>
                <button onClick={() => setDraftText('I keep getting irritated faster than the situation seems to warrant, and later I feel embarrassed by how much charge it had.')}>Use demo entry</button>
              </div>
            </section>

            <section className="panel softPanel">
              <div className="sectionTop">
                <div>
                  <div className="sectionLabel">Recent material</div>
                  <h2>What Carl is already holding</h2>
                </div>
              </div>
              <div className="stack">
                {entries.map((entry) => (
                  <button key={entry.id} className="entryCard calmCard" onClick={() => { setCurrentEntry(entry); setScreen('summary') }}>
                    <div className="entryMeta">{entry.createdAt} · {titleForType(entry.type)}</div>
                    <div>{entry.summary}</div>
                  </button>
                ))}
              </div>
            </section>
          </section>
        )}

        {screen === 'flow' && activeFlow && (
          <section className="panel softPanel flowPanel">
            <div className="eyebrow">{activeFlow.title}</div>
            <h1>{currentPrompt}</h1>
            <p className="muted">{activeFlow.intro}</p>
            <div className="progress">Step {flowIndex + 1} of {activeFlow.prompts.length}</div>
            <textarea
              rows={8}
              value={flowAnswers[flowIndex] || ''}
              onChange={(e) => {
                const next = [...flowAnswers]
                next[flowIndex] = e.target.value
                setFlowAnswers(next)
              }}
              placeholder="Take your time. Plain language is enough."
            />
            <div className="row gap wrap">
              <button onClick={() => setFlowIndex((v) => Math.max(0, v - 1))} disabled={flowIndex === 0}>Back</button>
              {flowIndex < activeFlow.prompts.length - 1 ? (
                <button className="primary" onClick={() => setFlowIndex((v) => v + 1)}>Next</button>
              ) : (
                <button className="primary" onClick={completeFlow}>Finish reflection</button>
              )}
            </div>
          </section>
        )}

        {screen === 'summary' && currentEntry && (
          <section className="panel softPanel">
            <div className="sectionLabel">Latest reflection</div>
            <h1>What may be taking shape</h1>
            <div className="summaryBlock softInset">
              <h3>Reflection summary</h3>
              <p>{currentEntry.summary}</p>
            </div>
            <div className="grid two">
              <div className="panel nested softInset">
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
              <div className="panel nested softInset">
                <h3>Questions worth carrying</h3>
                <ul>
                  {currentEntry.openQuestions.map((question) => <li key={question}>{question}</li>)}
                </ul>
                {currentEntry.symbolicMotifs.length > 0 && (
                  <>
                    <h3>Symbolic motifs</h3>
                    <ul>
                      {currentEntry.symbolicMotifs.map((motif) => <li key={motif}>{motif}</li>)}</ul>
                  </>
                )}
              </div>
            </div>
            <div className="row gap wrap">
              <button className="primary" onClick={() => { setThemes((prev) => dedupeThemes([...currentEntry.themes, ...prev])); setScreen('themes') }}>Keep these themes</button>
              <button onClick={() => setScreen('home')}>Back home</button>
            </div>
          </section>
        )}

        {screen === 'themes' && (
          <section className="panel softPanel">
            <div className="sectionLabel">Recurring memory</div>
            <h1>Themes that may be repeating</h1>
            <p className="muted">You remain the final authority. Everything here is editable.</p>
            <div className="stack">
              {themes.map((theme) => (
                <div key={theme.id} className="panel nested softInset">
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
            <div className="row gap wrap">
              <button className="primary" onClick={() => setScreen('weekly')}>See weekly review</button>
            </div>
          </section>
        )}

        {screen === 'weekly' && (
          <section className="panel softPanel">
            <div className="sectionLabel">Weekly review</div>
            <h1>The pattern underneath the week</h1>
            <p className="muted">Mar 25 – Mar 31</p>
            <div className="summaryBlock softInset">
              <h3>Overall pattern summary</h3>
              <p>{weeklyReview.overall}</p>
            </div>
            <div className="grid two">
              <div className="panel nested softInset">
                <h3>Recurring emotional patterns</h3>
                <ul>{weeklyReview.emotionalPatterns.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Recurring conflict dynamics</h3>
                <ul>{weeklyReview.conflictDynamics.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="panel nested softInset">
                <h3>Recurring symbolic motifs</h3>
                <ul>{weeklyReview.symbolicMotifs.map((item) => <li key={item}>{item}</li>)}</ul>
                <h3>Possible tensions</h3>
                <ul>{weeklyReview.tensions.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
            <div className="panel nested softInset">
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
