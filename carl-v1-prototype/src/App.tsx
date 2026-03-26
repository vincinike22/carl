import { useMemo, useState } from 'react'

const API_BASE = 'http://localhost:8787'

type EntryType = 'free_reflection' | 'daily_checkin' | 'conflict_clarity' | 'dream_exploration'
type Screen = 'home' | 'flow' | 'summary' | 'themes' | 'weekly'
type RecurrenceStrength = 'weak' | 'strong'

type Investigation = {
  patternHypothesis: string
  counterpattern: string
  unproven: string
  chargedFragment: string
  possibleDisproportion: string
  unresolvedContradiction: string
  openQuestions: string[]
  repeatedImages: string[]
}

type PatternRecord = {
  id: string
  label: string
  description: string
  recurrence: RecurrenceStrength
  evidence: { entryId: string; createdAt: string; line: string }[]
}

type Entry = {
  id: string
  type: EntryType
  source: 'text' | 'voice'
  text: string
  flowAnswers?: { prompt: string; answer: string }[]
  investigation: Investigation
  createdAt: string
}

type FlowPromptMap = Record<Exclude<EntryType, 'free_reflection'>, { title: string; intro: string; prompts: string[] }>

const flows: FlowPromptMap = {
  daily_checkin: {
    title: 'Daily Check-In',
    intro: 'Capture what has charge, then test whether it belongs to a larger recurrence.',
    prompts: [
      'What feels most charged right now?',
      'What seems disproportionate to the surface event?',
      'What has been repeating beneath the day?',
      'What are you tempted to explain away too quickly?',
      'What remains unresolved or contradictory?',
    ],
  },
  conflict_clarity: {
    title: 'Conflict Clarity',
    intro: 'Isolate the charged part of the conflict and test what may be repeating around it.',
    prompts: [
      'What happened, in the simplest terms?',
      'Which line, gesture, or moment carried the most charge?',
      'What felt disproportionate in your reaction?',
      'What in the other person bothered you most?',
      'Where might some version of that also exist in you?',
      'What contradiction or unresolved part remains?',
    ],
  },
  dream_exploration: {
    title: 'Dream Exploration',
    intro: 'Pull out the image with charge, then test whether it belongs to a larger recurrence.',
    prompts: [
      'What happened in the dream?',
      'What image or scene carried the most charge?',
      'What feels disproportionate or strangely intensified about it?',
      'What in waking life does it seem adjacent to, if anything?',
      'What feels familiar or repeated here?',
      'What remains unproven or too easy to overread?',
    ],
  },
}

const seedEntries: Entry[] = [
  {
    id: 'e1',
    type: 'conflict_clarity',
    source: 'text',
    text: 'I got irritated in a call with my cofounder. I felt dismissed fast and then withdrew.',
    createdAt: '2026-03-23',
    investigation: {
      patternHypothesis: 'Dismissal may trigger faster emotional escalation than the surface event warrants.',
      counterpattern: 'It may also be true that the conflict actually contained a real slight and was not only projection.',
      unproven: 'It is still unproven whether dismissal itself is the trigger, or whether the trigger is loss of status, interruption, or accumulated resentment.',
      chargedFragment: 'I felt dismissed fast and then withdrew.',
      possibleDisproportion: 'The speed of the withdrawal may exceed what the immediate interruption alone would explain.',
      unresolvedContradiction: 'You wanted recognition, but responded by reducing contact.',
      openQuestions: ['What exactly gets threatened first when you feel dismissed?', 'Where else has this sequence appeared before?'],
      repeatedImages: [],
    },
  },
  {
    id: 'e2',
    type: 'dream_exploration',
    source: 'text',
    text: 'I dreamed I was in a house with many locked rooms. I kept hearing movement behind a door.',
    createdAt: '2026-03-24',
    investigation: {
      patternHypothesis: 'Sealed interior spaces may be showing up when something feels present but not yet accessible.',
      counterpattern: 'The dream may simply be vivid material from stress or overload, without a stable repeated pattern behind it.',
      unproven: 'It is unproven whether the locked rooms point to avoidance, curiosity, fear, or just strong dream imagery.',
      chargedFragment: 'I was in a house with many locked rooms.',
      possibleDisproportion: 'The number of closed rooms suggests more intensity than the dream scene strictly needs.',
      unresolvedContradiction: 'The dream implies both proximity and inaccessibility at the same time.',
      openQuestions: ['What in waking life currently feels near but unopened?', 'Has this image of closed interior space appeared before?'],
      repeatedImages: ['locked rooms', 'movement behind a door'],
    },
  },
]

function id() {
  return Math.random().toString(36).slice(2, 10)
}

function titleForType(type: EntryType) {
  switch (type) {
    case 'free_reflection':
      return 'Free Capture'
    case 'daily_checkin':
      return 'Daily Check-In'
    case 'conflict_clarity':
      return 'Conflict Clarity'
    case 'dream_exploration':
      return 'Dream Exploration'
  }
}

function extractLines(text: string, answers: string[]) {
  return [text, ...answers]
    .flatMap((item) => item.split(/\n+/))
    .map((line) => line.trim())
    .filter(Boolean)
}

function findChargedFragment(lines: string[]) {
  const scored = lines.map((line) => {
    const lower = line.toLowerCase()
    let score = 0
    if (/(dismiss|withdrew|angry|irritat|charge|locked|door|room|avoid|unresolved|contradiction|threat)/.test(lower)) score += 3
    score += Math.min(3, line.length / 40)
    return { line, score }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored[0]?.line || ''
}

function buildRepeatedImages(corpus: string) {
  const lower = corpus.toLowerCase()
  const motifs = []
  if (/(room|rooms)/.test(lower)) motifs.push('rooms')
  if (/(door|doors)/.test(lower)) motifs.push('doors')
  if (/(house)/.test(lower)) motifs.push('house')
  if (/(shadow)/.test(lower)) motifs.push('shadow')
  return motifs
}

function buildInvestigation(type: EntryType, text: string, answers: string[]): Investigation {
  const lines = extractLines(text, answers)
  const chargedFragment = findChargedFragment(lines) || text.slice(0, 120)
  const corpus = [text, ...answers].join(' ')
  const lower = corpus.toLowerCase()
  const repeatedImages = buildRepeatedImages(corpus)

  if (type === 'conflict_clarity') {
    return {
      patternHypothesis: 'The charged part may not be the disagreement itself, but how quickly it turns into felt dismissal and retreat.',
      counterpattern: 'Another reading is that withdrawal here was proportionate and protective rather than patterned overreaction.',
      unproven: 'It remains unproven whether dismissal is the recurring trigger, or whether speed, tone, and accumulated strain matter more.',
      chargedFragment,
      possibleDisproportion: 'The reaction may have escalated faster than the stated conflict alone would predict.',
      unresolvedContradiction: 'You wanted to stay seen, but the move was to step back.',
      openQuestions: ['Where else has this reaction sequence shown up?', 'What happens one second before the withdrawal?'],
      repeatedImages,
    }
  }

  if (type === 'dream_exploration') {
    return {
      patternHypothesis: 'The dream may be isolating closed or obscured space as a repeated site of tension.',
      counterpattern: 'It may also be a one-off image with charge but no larger recurrence behind it.',
      unproven: 'It remains unproven whether the dream imagery maps onto waking life in any stable way.',
      chargedFragment,
      possibleDisproportion: 'The image intensity appears greater than the dream narrative strictly requires.',
      unresolvedContradiction: 'Something feels near enough to sense, but not available enough to meet directly.',
      openQuestions: ['Has this kind of image appeared before?', 'What part of the image feels charged without explanation?'],
      repeatedImages,
    }
  }

  if (type === 'daily_checkin') {
    return {
      patternHypothesis: 'A smaller visible feeling may be standing in for a more persistent recurring tension.',
      counterpattern: 'This may simply be a passing state rather than evidence of a larger pattern.',
      unproven: 'It remains unproven whether today belongs to a recurrence or only feels that way because it is fresh.',
      chargedFragment,
      possibleDisproportion: 'The intensity may exceed what the immediate day-level trigger would suggest.',
      unresolvedContradiction: 'Part of you wants clarity, while another part keeps the thread unresolved.',
      openQuestions: ['What has shown up in this form before?', 'What would count as disconfirming this pattern?'],
      repeatedImages,
    }
  }

  return {
    patternHypothesis: 'The material may point to a repeatable pattern rather than a one-off event.',
    counterpattern: 'It may also be too early to call this a pattern at all.',
    unproven: 'It remains unproven what exactly is recurring, and what is only being inferred after the fact.',
    chargedFragment,
    possibleDisproportion: 'One part of the entry appears to hold more charge than the surface narrative alone explains.',
    unresolvedContradiction: 'The entry suggests both recognition and uncertainty at once.',
    openQuestions: ['Where else has this shown up before?', 'What evidence would weaken this reading?'],
    repeatedImages,
  }
}

function buildPatternRecords(entries: Entry[]) {
  const candidates = [
    {
      id: 'dismissal-sequence',
      label: 'Dismissal → withdrawal sequence',
      match: (entry: Entry) => /dismiss|withdraw|retreat|pull back/i.test(entry.text + ' ' + entry.investigation.chargedFragment),
      description: 'Charge appears to convert quickly into distance or retreat.',
    },
    {
      id: 'closed-space-imagery',
      label: 'Closed space imagery',
      match: (entry: Entry) => /room|door|house|locked/i.test(entry.text + ' ' + entry.investigation.repeatedImages.join(' ')),
      description: 'Closed or obscured spaces appear in the material more than once.',
    },
    {
      id: 'disproportionate-charge',
      label: 'Disproportionate charge',
      match: (entry: Entry) => /disproportion|charge|irritat|angry|dismiss/i.test(entry.investigation.possibleDisproportion + ' ' + entry.text),
      description: 'The reaction appears larger or faster than the surface event alone would explain.',
    },
  ]

  return candidates
    .map((candidate) => {
      const evidence = entries
        .filter(candidate.match)
        .map((entry) => ({
          entryId: entry.id,
          createdAt: entry.createdAt,
          line: entry.investigation.chargedFragment,
        }))

      if (!evidence.length) return null

      return {
        id: candidate.id,
        label: candidate.label,
        description: candidate.description,
        recurrence: evidence.length > 1 ? 'strong' : 'weak',
        evidence,
      } as PatternRecord
    })
    .filter(Boolean) as PatternRecord[]
}

function buildWeeklyCaseReview(entries: Entry[], patterns: PatternRecord[]) {
  const recent = [...entries].slice(0, 5)
  const chargedFragments = recent.map((entry) => `${entry.createdAt} — ${entry.investigation.chargedFragment}`)

  return {
    casePosition:
      'This week’s material does not resolve into one clean conclusion. The stronger working hypothesis is that charge gathers around perceived dismissal, blocked access, or moments where reaction outruns the surface event.',
    patternStrengths: patterns.map((pattern) => `${pattern.label} — ${pattern.recurrence} recurrence`),
    strongestFragments: chargedFragments,
    disproportions: recent.map((entry) => entry.investigation.possibleDisproportion),
    contradictions: recent.map((entry) => entry.investigation.unresolvedContradiction),
    unproven: recent.map((entry) => entry.investigation.unproven),
  }
}

export function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [entryType, setEntryType] = useState<EntryType>('daily_checkin')
  const [inputMode, setInputMode] = useState<'text' | 'voice'>('text')
  const [draftText, setDraftText] = useState('')
  const [entries, setEntries] = useState<Entry[]>(seedEntries)
  const [flowAnswers, setFlowAnswers] = useState<string[]>([])
  const [flowIndex, setFlowIndex] = useState(0)
  const [currentEntry, setCurrentEntry] = useState<Entry | null>(null)

  const activeFlow = entryType === 'free_reflection' ? null : flows[entryType]
  const patternRecords = useMemo(() => buildPatternRecords(entries), [entries])
  const weeklyReview = useMemo(() => buildWeeklyCaseReview(entries, patternRecords), [entries, patternRecords])

  const startEntry = () => {
    if (entryType === 'free_reflection') {
      const sourceText = draftText || 'Voice note placeholder transcript: I kept circling around the same feeling all day.'
      const investigation = buildInvestigation(entryType, sourceText, [])
      const entry: Entry = {
        id: id(),
        type: entryType,
        source: inputMode,
        text: sourceText,
        investigation,
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
    const sourceText = draftText || (inputMode === 'voice' ? 'Mock transcript: voice capture used for this investigation.' : '')
    const investigation = buildInvestigation(entryType, sourceText, flowAnswers)
    const promptAnswers = activeFlow?.prompts.map((prompt, index) => ({ prompt, answer: flowAnswers[index] || '' })) || []
    const entry: Entry = {
      id: id(),
      type: entryType,
      source: inputMode,
      text: sourceText,
      flowAnswers: promptAnswers,
      investigation,
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setEntries((prev) => [entry, ...prev])
    setCurrentEntry(entry)
    setScreen('summary')
  }

  const currentPrompt = activeFlow?.prompts[flowIndex] || ''

  return (
    <div className="app">
      <div className="room">
        <header className="roomHeader">
          <div className="brandRow">
            <div className="brand">Carl</div>
            <div className="subtle">Private pattern investigation</div>
          </div>
          <nav className="roomNav">
            <button className={screen === 'home' ? 'active' : ''} onClick={() => setScreen('home')}>Capture</button>
            <button className={screen === 'summary' ? 'active' : ''} onClick={() => setScreen('summary')} disabled={!currentEntry}>Current case</button>
            <button className={screen === 'themes' ? 'active' : ''} onClick={() => setScreen('themes')}>Patterns</button>
            <button className={screen === 'weekly' ? 'active' : ''} onClick={() => setScreen('weekly')}>Week file</button>
          </nav>
        </header>

        <main className="surface">
          {screen === 'home' && (
            <section className="sheet">
              <h1>Capture the fragment with charge.</h1>
              <p className="welcomeLine">Carl is for isolating the charged part, testing recurrence, and keeping interpretation open.</p>

              <div className="controls">
                <div>
                  <label>Input</label>
                  <div className="segLine">
                    <button className={inputMode === 'text' ? 'active' : ''} onClick={() => setInputMode('text')}>Write</button>
                    <button className={inputMode === 'voice' ? 'active' : ''} onClick={() => setInputMode('voice')}>Voice</button>
                  </div>
                </div>
                <div>
                  <label>Investigation path</label>
                  <select value={entryType} onChange={(e) => setEntryType(e.target.value as EntryType)}>
                    <option value="free_reflection">Free capture</option>
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
                    placeholder="Write the line, moment, image, or reaction that seems to carry more charge than it should."
                    rows={10}
                  />
                </div>
              ) : (
                <div className="voiceNote">
                  <p>Voice remains simple in this prototype. Continue when ready, and Carl will investigate a transcribed note.</p>
                </div>
              )}

              <div className="actionRow">
                <button className="primary" onClick={startEntry}>{entryType === 'free_reflection' ? 'Run investigation' : 'Continue'}</button>
                <button onClick={() => setDraftText('I keep getting irritated faster than the situation seems to warrant, and later I feel embarrassed by how much charge it had.')}>Use demo entry</button>
              </div>

              <section className="sheet utilityNote">
                <h3>Recent cases</h3>
                <div className="entryList">
                  {entries.map((entry) => (
                    <button key={entry.id} className="entryCard" onClick={() => { setCurrentEntry(entry); setScreen('summary') }}>
                      <div className="entryMeta">{entry.createdAt} · {titleForType(entry.type)}</div>
                      <div className="entryText">{entry.investigation.patternHypothesis}</div>
                    </button>
                  ))}
                </div>
              </section>
            </section>
          )}

          {screen === 'flow' && activeFlow && (
            <section className="sheet">
              <div className="metaLine">Step {flowIndex + 1} of {activeFlow.prompts.length}</div>
              <h1>{activeFlow.title}</h1>
              <p className="muted">{activeFlow.intro}</p>

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
                placeholder="Keep it concrete. If a line feels loaded, include the line."
              />

              <div className="actionRow">
                <button onClick={() => setFlowIndex((v) => Math.max(0, v - 1))} disabled={flowIndex === 0}>Back</button>
                {flowIndex < activeFlow.prompts.length - 1 ? (
                  <button className="primary" onClick={() => setFlowIndex((v) => v + 1)}>Next</button>
                ) : (
                  <button className="primary" onClick={completeFlow}>Finish investigation</button>
                )}
              </div>
            </section>
          )}

          {screen === 'summary' && currentEntry && (
            <section className="sheet">
              <div className="metaLine">{currentEntry.createdAt} · {titleForType(currentEntry.type)}</div>
              <h1>Current case</h1>

              <section className="archivalBlock">
                <h3>Charged fragment</h3>
                <p className="summaryText">{currentEntry.investigation.chargedFragment}</p>
              </section>

              <section className="archivalBlock">
                <h3>Pattern hypothesis</h3>
                <p>{currentEntry.investigation.patternHypothesis}</p>
              </section>

              <section className="archivalBlock">
                <h3>Counterpattern</h3>
                <p>{currentEntry.investigation.counterpattern}</p>
              </section>

              <section className="archivalBlock">
                <h3>Possible disproportion</h3>
                <p>{currentEntry.investigation.possibleDisproportion}</p>
              </section>

              <section className="archivalBlock">
                <h3>Unresolved contradiction</h3>
                <p>{currentEntry.investigation.unresolvedContradiction}</p>
              </section>

              <section className="archivalBlock">
                <h3>What remains unproven</h3>
                <p>{currentEntry.investigation.unproven}</p>
              </section>

              <section className="archivalBlock">
                <h3>Questions to test next</h3>
                <ul className="archiveList">
                  {currentEntry.investigation.openQuestions.map((question) => <li key={question} className="archiveItem">{question}</li>)}
                </ul>
              </section>

              {currentEntry.investigation.repeatedImages.length > 0 && (
                <section className="archivalBlock">
                  <h3>Repeated images</h3>
                  <ul className="archiveList">
                    {currentEntry.investigation.repeatedImages.map((motif) => <li key={motif} className="archiveItem">{motif}</li>)}
                  </ul>
                </section>
              )}

              <div className="actionRow">
                <button className="primary" onClick={() => setScreen('themes')}>Test recurrence</button>
                <button onClick={() => setScreen('home')}>Back to capture</button>
              </div>
            </section>
          )}

          {screen === 'themes' && (
            <section className="sheet">
              <h1>Pattern records</h1>
              <p className="muted">Recurrence is only as good as the lines that support it.</p>

              <div className="stack">
                {patternRecords.map((pattern) => (
                  <div key={pattern.id} className="memoryRecord">
                    <div className="memoryHeader">
                      <strong>{pattern.label}</strong>
                      <span className="statusWord">{pattern.recurrence} recurrence</span>
                    </div>
                    <p>{pattern.description}</p>
                    <div className="inlineMeta"><small>Appeared in: {pattern.evidence.map((item) => item.createdAt).join(' · ')}</small></div>
                    <ul className="archiveList">
                      {pattern.evidence.map((item) => (
                        <li key={`${pattern.id}-${item.entryId}`} className="archiveItem">
                          <strong>{item.createdAt}</strong> — {item.line}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="actionRow">
                <button className="primary" onClick={() => setScreen('weekly')}>Open week file</button>
              </div>
            </section>
          )}

          {screen === 'weekly' && (
            <section className="sheet">
              <div className="metaLine">Mar 25 – Mar 31</div>
              <h1>Week file</h1>
              <p className="muted">A case review of the week’s material, not a wrap-up.</p>

              <section className="weeklyBlock">
                <h3>Current case position</h3>
                <p className="summaryText">{weeklyReview.casePosition}</p>
              </section>

              <section className="weeklyBlock">
                <h3>Pattern strength</h3>
                <ul className="archiveList">{weeklyReview.patternStrengths.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Strongest fragments</h3>
                <ul className="archiveList">{weeklyReview.strongestFragments.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Possible disproportions</h3>
                <ul className="archiveList">{weeklyReview.disproportions.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>Contradictions still active</h3>
                <ul className="archiveList">{weeklyReview.contradictions.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>

              <section className="weeklyBlock">
                <h3>What remains unproven</h3>
                <ul className="archiveList">{weeklyReview.unproven.map((item) => <li key={item} className="archiveItem">{item}</li>)}</ul>
              </section>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}
