import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8787;
const openRouterApiKey = process.env.OPENROUTER_API_KEY;
const model = process.env.OPENROUTER_MODEL || 'stepfun/step-3.5-flash:free';
const sessions = new Map();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

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
    history.push({ role: 'user', content: message });

    const payload = {
      model,
      messages: [
        {
          role: 'system',
          content: [
            'You are Carl, a reflective analytical-psychology-inspired companion.',
            'Respond with psychological depth, emotional precision, and calm restraint.',
            'Do not sound clinical or robotic.',
            'Do not give generic therapy disclaimers unless safety truly requires it.',
            'Focus on patterns, tensions, shadow material, contradictions, avoidance, longing, grief, desire, and identity-level conflicts when relevant.',
            'Keep responses concise but meaningful. Usually 3-7 sentences.',
            'Write in plain, elegant language.',
            'The user is writing into a private reflective space called Carl.'
          ].join(' ')
        },
        ...history
      ]
    };

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
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
    const reply = data?.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return res.status(502).json({ error: 'No reply returned from model' });
    }

    history.push({ role: 'assistant', content: reply });
    sessions.set(userId, history.slice(-20));

    res.json({ reply, userId, model });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', detail: String(error) });
  }
});

app.listen(port, () => {
  console.log(`Carl backend listening on :${port}`);
});
