# Carl v1 prototype

Narrow reflection prototype with a single structured output path.

## Run

```bash
npm install
npm run dev:full
```

This starts:
- Vite frontend on `http://localhost:5173`
- Lightweight backend on `http://localhost:8787`

## Model path

Current backend path: `local-heuristic-structured-v1`

This is intentionally narrow: one endpoint accepts an entry plus flow answers and returns structured JSON:
- `summary`
- `themeSuggestions`
- `openQuestions`
- `symbolicMotifs`

No broader architecture changes were introduced in this pass.
