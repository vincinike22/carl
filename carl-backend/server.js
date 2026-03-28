import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8787;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const sessions = new Map();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

const MAX_HISTORY = 16;

const HIGH_RISK_PATTERNS = [
  /\bi want to die\b/i,
  /\bwant to die\b/i,
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bdon'?t want to live\b/i,
  /\bdont want to live\b/i,
  /\bwant to disappear forever\b/i,
  /\bhurt myself\b/i,
  /\bself[- ]?harm\b/i,
  /\bsuicid(?:e|al)\b/i
];

const GROUNDING_PATTERNS = [
  /\bpanic\b/i,
  /\bpanicking\b/i,
  /\bspiral(?:ing)?\b/i,
  /\boverwhelm(?:ed|ing)?\b/i,
  /\bcan't breathe\b/i,
  /\bcant breathe\b/i,
  /\bdissociat(?:e|ing|ed)\b/i,
  /\bnumb\b/i,
  /\bshaking\b/i,
  /\bfreaking out\b/i
];

const CLARIFY_PATTERNS = [
  /^idk\b/i,
  /^i don'?t know\b/i,
  /^dont know\b/i,
  /\bnot sure\b/i,
  /\bconfused\b/i,
  /\bweird\b/i,
  /\boff\b/i,
  /\bsomething feels\b/i,
  /\bi can'?t explain\b/i,
  /\bi cant explain\b/i
];

function detectRisk(message) {
  if (HIGH_RISK_PATTERNS.some((pattern) => pattern.test(message))) return 'high';
  if (GROUNDING_PATTERNS.some((pattern) => pattern.test(message))) return 'medium';
  return 'low';
}

function chooseMode(message, history) {
  const trimmed = message.trim();
  const risk = detectRisk(trimmed);

  if (risk === 'high') return 'crisis';
  if (risk === 'medium') return 'ground';

  const lower = trimmed.toLowerCase();
  const priorUserMessages = history.filter((item) => item.role === 'user').length;

  if (CLARIFY_PATTERNS.some((pattern) => pattern.test(trimmed)) || trimmed.length < 25) {
    return 'clarify';
  }

  if (
    priorUserMessages >= 3 &&
    (lower.includes('always') || lower.includes('again') || lower.includes('keep') || lower.includes('pattern'))
  ) {
    return 'synthesize';
  }

  return 'reflect';
}

function baseSystemPrompt() {
  return [
    'You are Carl, a calm reflective companion in a private writing space.',
    'Your job is to help the user articulate what is true, notice patterns, and think more clearly.',
    'Be warm, precise, and grounded. Do not sound robotic, clinical, saccharine, or mystical.',
    'Do not over-interpret limited evidence. Do not pretend certainty about hidden motives.',
    'Do not simply paraphrase the user and end with a vague question.',
    'Avoid filler such as: say a little more, tell me more, that sounds hard, something about this feels important.',
    'If a question helps, ask at most one specific question.',
    'Prefer plain language over therapy-speak.',
    'When the user is direct, be direct.'
  ].join(' ');
}

function modePrompt(mode) {
  switch (mode) {
    case 'crisis':
      return [
        'MODE: CRISIS SUPPORT.',
        'The user may be at risk of self-harm or suicide.',
        'Respond directly, clearly, and with care.',
        'First acknowledge the seriousness plainly.',
        'Ask whether they are in immediate danger right now.',
        'Encourage them to contact local emergency services or a crisis hotline now if they might act on it.',
        'Encourage them to reach out to one trusted real person immediately and not stay alone with it.',
        'Do not analyze symbolism, shadow material, or long-term patterns in this reply.',
        'Do not be poetic. Do not be abstract. Safety first.',
        'Keep it to 4-8 sentences.'
      ].join(' ');
    case 'ground':
      return [
        'MODE: GROUNDING.',
        'The user seems flooded, panicked, spiraling, or too activated for abstract reflection.',
        'Be concrete, steady, and present-focused.',
        'Help them orient to the immediate next minute, not their whole life.',
        'Offer 2-4 simple grounding actions in natural prose.',
        'Avoid analysis and avoid big interpretations.',
        'Keep it to 3-6 sentences.'
      ].join(' ');
    case 'clarify':
      return [
        'MODE: CLARIFY.',
        'The user is vague, early, or not yet formed in what they mean.',
        'Do not over-analyze.',
        'Briefly reflect the core ambiguity, then ask one concrete, narrowing question.',
        'Keep it to 2-4 sentences.'
      ].join(' ');
    case 'synthesize':
      return [
        'MODE: SYNTHESIZE.',
        'The user may be circling a recurring pattern or tension.',
        'Name the pattern carefully and with humility.',
        'Connect the present message to a larger conflict only if warranted by the conversation so far.',
        'Offer one useful framing or next step for reflection.',
        'Ask at most one question.',
        'Keep it to 3-6 sentences.'
      ].join(' ');
    case 'reflect':
    default:
      return [
        'MODE: REFLECT.',
        'Give a precise, human response to what the user actually said.',
        'Name the emotional or psychological texture without overreaching.',
        'Add one fresh insight, distinction, or reframing.',
        'Do not default to a question unless it genuinely sharpens the moment.',
        'Keep it to 3-5 sentences.'
      ].join(' ');
  }
}

function buildMessages(history, mode) {
  const trimmedHistory = history.slice(-MAX_HISTORY);
  return [
    { role: 'system', content: baseSystemPrompt() },
    { role: 'system', content: modePrompt(mode) },
    ...trimmedHistory
  ];
}

function extractTextContent(content) {
  if (typeof content === 'string') return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (typeof part === 'string') return part;
        if (part?.type === 'text' && typeof part.text === 'string') return part.text;
        return '';
      })
      .join('\n')
      .trim();
  }
  return '';
}

function normalizeReply(data) {
  const choice = data?.choices?.[0]?.message;
  const direct = extractTextContent(choice?.content);
  if (direct) return direct;

  const reasoning = extractTextContent(data?.choices?.[0]?.text);
  if (reasoning) return reasoning;

  return '';
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, model, sessions: sessions.size });
});

app.post('/chat', async (req, res) => {
  try {
    const { userId, message } = req.body ?? {};

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'userId is required' });
    }

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'message is required' });
    }

    if (!openRouterApiKey) {
      return res.status(500).json({ error: 'OPENROUTER_API_KEY is not configured' });
    }

    const history = sessions.get(userId) ?? [];
    history.push({ role: 'user', content: message.trim() });

    const mode = chooseMode(message, history);
    const risk = detectRisk(message);

    const payload = {
      model,
      temperature: mode === 'crisis' ? 0.2 : 0.7,
      messages: buildMessages(history, mode)
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://carl.local',
        'X-Title': 'Carl'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(502).json({ error: 'OpenRouter request failed', detail: errorText });
    }

    const data = await response.json();
    const reply = normalizeReply(data);

    if (!reply) {
      return res.status(502).json({ error: 'No reply returned from model', detail: data });
    }

    history.push({ role: 'assistant', content: reply });
    sessions.set(userId, history.slice(-MAX_HISTORY));

    res.json({ reply, userId, model, mode, risk });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', detail: String(error) });
  }
});

app.listen(port, () => {
  console.log(`Carl backend listening on :${port}`);
});
