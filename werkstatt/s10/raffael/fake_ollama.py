# Nachgebauter lokaler Modell-Server (Ollama-/LM-Studio-artig, OpenAI-kompatibel) für den Prüfstand.
# python3 fake_ollama.py <port> [erlaubter-ursprung|*]  → GET /v1/models, POST /v1/chat/completions (SSE-Stream)
import json, sys, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 11434
ORIGINS = sys.argv[2] if len(sys.argv) > 2 else '*'
LOG = []
class H(BaseHTTPRequestHandler):
    def log_message(self, *a): pass
    def cors(self):
        o = self.headers.get('Origin', '')
        if ORIGINS == '*' or o == ORIGINS or (o == 'null' and ORIGINS == 'null'):
            self.send_header('Access-Control-Allow-Origin', o if o else '*')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Private-Network', 'true')
            return True
        return False
    def do_OPTIONS(self):
        self.send_response(204); self.cors(); self.end_headers()
    def do_GET(self):
        if self.path == '/v1/models':
            self.send_response(200); self.cors(); self.send_header('Content-Type', 'application/json'); self.end_headers()
            self.wfile.write(json.dumps({'object': 'list', 'data': [{'id': 'qwen3.5:9b', 'object': 'model'}, {'id': 'gemma4:e2b', 'object': 'model'}]}).encode())
        else:
            self.send_response(404); self.end_headers()
    def do_POST(self):
        n = int(self.headers.get('Content-Length') or 0); body = json.loads(self.rfile.read(n) or b'{}')
        open('/tmp/claude-0/-home-claude/19930791-4491-56b2-834b-c192503349bd/scratchpad/fake_ollama_last.json', 'w').write(json.dumps(body))
        if self.path != '/v1/chat/completions':
            self.send_response(404); self.end_headers(); return
        prompt = body.get('messages', [{}])[-1].get('content', '')
        antwort = 'Hallo, ich bin dein Rechner und ich höre zu.' if 'in einem Satz Hallo' in prompt else 'Das klingt nach Balkon und Erde. Was willst du zuerst pflanzen?'
        if body.get('stream'):
            self.send_response(200); self.cors(); self.send_header('Content-Type', 'text/event-stream'); self.end_headers()
            for w in antwort.split(' '):
                self.wfile.write(('data: ' + json.dumps({'choices': [{'delta': {'content': w + ' '}}]}) + '\n\n').encode()); self.wfile.flush(); time.sleep(0.03)
            self.wfile.write(b'data: [DONE]\n\n')
        else:
            self.send_response(200); self.cors(); self.send_header('Content-Type', 'application/json'); self.end_headers()
            self.wfile.write(json.dumps({'choices': [{'message': {'role': 'assistant', 'content': antwort}}], 'model': body.get('model')}).encode())
ThreadingHTTPServer(('127.0.0.1', PORT), H).serve_forever()
