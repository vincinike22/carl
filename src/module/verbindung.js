// Verbinden · Carl prüft, ob auf deinem Rechner Claude Code oder Codex läuft. Eine Zeile im Terminal rechnet einen Code, Carl rechnet denselben.
var C6 = window.C6 = window.C6 || {};

function S() { return C6.S || (C6.S = {}); }
function aendern(fn) {
  if (typeof C6.aendern === 'function') C6.aendern(fn);
  else { fn(S()); try { C6.speichern && C6.speichern(); } catch (e) {} }
}
function emit(n, d) { try { C6.bus && C6.bus.emit(n, d); } catch (e) {} }
function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function st(k, rueck, w) { try { var t = C6.stimme && C6.stimme.sag(k, w); if (t) return t; } catch (e) {} return rueck; }

var WER = { claude: { name: 'Claude Code', befehl: 'claude', hilfe: 'claude.com/download', version: '2.1.0 (Claude Code)' }, codex: { name: 'Codex', befehl: 'codex', hilfe: 'chatgpt.com/codex (im Terminal: curl -fsSL https://chatgpt.com/codex/install.sh | sh)', version: 'codex-cli 0.162.1' } };
var WO = {
  mac: { name: 'Mac', auf: 'Öffne das Programm „Terminal“: ⌘ + Leertaste, „Terminal“ tippen, Enter. Das ist ein Fenster, in das man Befehle schreibt.' },
  windows: { name: 'Windows', auf: 'Öffne „PowerShell“: Start-Menü, „PowerShell“ tippen, Enter. Das ist ein Fenster, in das man Befehle schreibt.' },
  linux: { name: 'Linux', auf: 'Öffne ein Terminal-Fenster (oft Strg + Alt + T).' },
  server: { name: 'Server', auf: 'Melde dich wie gewohnt an deinem Server an (ssh benutzer@adresse).' }
};
var ZEICHEN = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
function neueNonce() {
  var a = new Uint8Array(6), s = '';
  try { crypto.getRandomValues(a); } catch (e) { for (var i = 0; i < 6; i++) a[i] = Math.floor(Math.random() * 256); }
  for (var j = 0; j < 6; j++) s += ZEICHEN[a[j] % ZEICHEN.length];
  return s;
}

/* ---------- Was bei Codex anders ist (Kosten, Installation, Server, Rechte) ---------- */
var CODEX_INSTALL = {
  mac: 'curl -fsSL https://chatgpt.com/codex/install.sh | sh',
  linux: 'curl -fsSL https://chatgpt.com/codex/install.sh | sh',
  server: 'curl -fsSL https://chatgpt.com/codex/install.sh | sh',
  windows: 'powershell -ExecutionPolicy ByPass -c "irm https://chatgpt.com/codex/install.ps1 | iex"'
};
// „Erst fragen, dann ändern“: zwei Zeilen in Codex' Einstellungsdatei. Die Zeile legt die Datei an, wenn sie fehlt, und hängt die zwei Zeilen an.
var CODEX_TOML = 'sandbox_mode = "read-only"\napproval_policy = "on-request"';
function codexRechte(wo) {
  if (wo === 'windows') return 'New-Item -Force -ItemType Directory "$HOME\\.codex" | Out-Null; Add-Content -Path "$HOME\\.codex\\config.toml" -Value \'sandbox_mode = "read-only"\', \'approval_policy = "on-request"\'';
  return 'mkdir -p ~/.codex && printf \'sandbox_mode = "read-only"\\napproval_policy = "on-request"\\n\' >> ~/.codex/config.toml';
}
function codexBlock(wo) {
  var h = '<details class="c6v-codex"><summary>Was bei Codex anders ist</summary><div class="c6v-codex-innen">';
  h += '<p><b>Kosten:</b> Codex im Terminal braucht ChatGPT Plus (oder einen API-Schlüssel, dann zahlst du pro Nutzung). In der ChatGPT-App auf dem Computer darfst du es auch ohne Abo probieren, nur dort.</p>';
  h += '<p><b>Noch nicht installiert?</b> Diese Zeile lädt Codex von chatgpt.com herunter und installiert es, sonst nichts:</p><div class="c6v-zeile c6v-zeile-klein"><code>' + esc(CODEX_INSTALL[wo] || CODEX_INSTALL.mac) + '</code></div>' +
    '<button type="button" class="c6v-knopf c6v-leise c6v-kopier2" data-kopier="' + esc(CODEX_INSTALL[wo] || CODEX_INSTALL.mac) + '">Zeile kopieren</button>' +
    '<p>Danach das Fenster schließen und neu öffnen. <code>codex --version</code> antwortet dann mit „codex-cli“ und einer Nummer, zum Beispiel <code>codex-cli 0.162.1</code>.</p>';
  if (wo === 'linux' || wo === 'server') h += '<p><b>Zaun:</b> Auf Linux braucht Codex ein kleines Hilfsprogramm, damit es eingezäunt arbeitet: <code>sudo apt install bubblewrap</code> (Ubuntu, Debian).</p>';
  if (wo === 'server') h += '<p><b>Anmelden ohne Browser:</b> Vorher am Handy in ChatGPT: Einstellungen → Sicherheit → Anmeldung mit Gerätecode einschalten. Dann auf dem Server <code>codex login --device-auth</code>: Codex zeigt einen Link und einen kurzen Code, du öffnest den Link am Handy und tippst den Code ein.</p>';
  else h += '<p><b>Anmelden:</b> Tipp <code>codex</code>, wähl „Sign in with ChatGPT“, der Browser öffnet sich.</p>';
  h += '<p><b>Erst fragen, dann ändern:</b> Codex ändert Dateien in deinem Projektordner, ohne zu fragen. Diese Zeile stellt es so ein, dass es erst fragt. Sie schreibt zwei Zeilen in Codex\' eigene Einstellungsdatei, sonst nichts:</p>' +
    '<div class="c6v-zeile c6v-zeile-klein"><code>' + esc(codexRechte(wo)) + '</code></div>' +
    '<button type="button" class="c6v-knopf c6v-leise c6v-kopier2" data-kopier="' + esc(codexRechte(wo)) + '">Zeile kopieren</button>' +
    '<p>Später, wenn du Codex vertraust: im Gespräch <code>/permissions</code> tippen und eine Stufe höher wählen.</p>';
  return h + '</div></details>';
}

/* ---------- Rechenweg (identisch in JS, sh und PowerShell) ----------
   Text   = "carl:" + NONCE + ":" + befehl          (z. B. carl:K7M2QX:claude)
   Hash   = SHA-256(Text, UTF-8) als Hex
   Code   = (erste 8 Hex-Zeichen als Zahl) mod 1 000 000, sechsstellig mit führenden Nullen */
function text(nonce, wer) { return 'carl:' + nonce + ':' + WER[wer].befehl; }
function code(nonce, wer) {
  if (!(window.crypto && crypto.subtle && window.TextEncoder)) return Promise.reject(new Error('kein SubtleCrypto'));
  return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text(nonce, wer))).then(function (buf) {
    var b = new Uint8Array(buf), n = ((b[0] << 24) >>> 0) + (b[1] << 16) + (b[2] << 8) + b[3];
    return String(n % 1000000).padStart(6, '0');
  });
}
function zeile(nonce, wer, wo) {
  var w = WER[wer], t = text(nonce, wer);
  if (wo === 'windows') {
    return 'if (Get-Command ' + w.befehl + ' -ErrorAction SilentlyContinue) { $null = ' + w.befehl + ' --version; $h = [BitConverter]::ToString([Security.Cryptography.SHA256]::Create().ComputeHash([Text.Encoding]::UTF8.GetBytes(\'' + t + '\'))).Replace(\'-\',\'\'); \'Carl-Code: \' + ([Convert]::ToUInt32($h.Substring(0,8),16) % 1000000).ToString(\'000000\') } else { \'' + w.name + ' fehlt noch.\' }';
  }
  var hash = wo === 'mac' ? 'shasum -a 256' : 'sha256sum';
  return w.befehl + ' --version >/dev/null 2>&1 && printf \'Carl-Code: %06d\\n\' $(( 0x$(printf \'%s\' \'' + t + '\' | ' + hash + ' | cut -c1-8) % 1000000 )) || echo \'' + w.name + ' fehlt noch.\'';
}

// Die Zeile in einfachen Worten, Stück für Stück
function stuecke(wer, wo) {
  var w = WER[wer];
  if (wo === 'windows') return [
    ['Get-Command ' + w.befehl, 'Ist ' + w.name + ' da? Wenn nicht, steht am Ende „' + w.name + ' fehlt noch.“'],
    [w.befehl + ' --version', 'fragt ' + w.name + ' nur nach seiner Versionsnummer.'],
    ['SHA256 … \'carl:…\'', 'rechnet aus deinem Code-Satz von diesem Blatt eine lange Prüfzahl.'],
    ['% 1000000 … ToString(\'000000\')', 'kürzt sie auf sechs Ziffern und zeigt sie an.']
  ];
  return [
    [w.befehl + ' --version', 'Ist ' + w.name + ' da? Es fragt nur nach der Versionsnummer (bei ' + w.name + ' sieht sie so aus: ' + w.version + ').'],
    ['printf \'%s\' \'carl:…\'', 'schreibt deinen Code-Satz von diesem Blatt hin.'],
    [(wo === 'mac' ? 'shasum -a 256' : 'sha256sum') + ' | cut -c1-8', 'rechnet daraus eine lange Prüfzahl und nimmt die ersten acht Zeichen.'],
    ['% 1000000 … %06d', 'kürzt sie auf sechs Ziffern und zeigt sie an.'],
    ['|| echo …', 'fehlt ' + w.name + ', steht stattdessen „' + w.name + ' fehlt noch.“']
  ];
}

/* ---------- Zustand ---------- */
function V() { var s = S(); if (!s.verbindung || typeof s.verbindung !== 'object') s.verbindung = {}; return s.verbindung; }
function verbunden() { var v = V(); return v.status === 'verbunden' && !!v.wer; }

C6.verbindung = {
  status: function () { return verbunden() ? 'verbunden' : 'nicht verbunden'; },
  verbunden: verbunden,
  info: function () { var v = V(); return verbunden() ? { wer: v.wer, name: WER[v.wer] ? WER[v.wer].name : v.wer, wo: v.wo, woName: WO[v.wo] ? WO[v.wo].name : v.wo, seit: v.seit } : null; },
  setze: function (status, info) {
    info = info || {};
    aendern(function () {
      var v = V();
      if (status === 'verbunden') { delete v.nonce; delete v.nonceTs; v.status = 'verbunden'; v.wer = info.wer === 'Codex' || info.wer === 'codex' ? 'codex' : 'claude'; v.wo = info.wo || v.wo || 'mac'; v.seit = Date.now(); }
      else { v.status = 'nicht verbunden'; delete v.wer; delete v.seit; }
    });
    emit('verbindung', { status: C6.verbindung.status(), info: C6.verbindung.info() });
  },
  oeffne: function (o) { o = o || {}; if (o.was === 'lokal') return oeffneLokal(o); oeffne(o); },
  oeffneLokal: function (o) { return oeffneLokal(o || {}); },
  zu: function () { zu(); },
  // für Prüfungen und die Anleitung
  _code: code, _zeile: zeile
};

/* ---------- Das Blatt ---------- */
var hulle = null, wahl = { wer: 'claude', wo: 'mac' }, nonce = null;
function rate() {
  var ua = navigator.userAgent || '';
  // am iPhone, iPad oder Android tippt Otto die Zeile am Computer: dann ist der Mac der beste Vorschlag
  if (/iPhone|iPad|iPod|Android/.test(ua) || (navigator.maxTouchPoints > 0 && /Macintosh|Linux/.test(ua) && !/CrOS/.test(ua))) return 'mac';
  if (/Windows/.test(ua)) return 'windows';
  if (/CrOS|Linux/.test(ua)) return 'linux';
  return 'mac';
}
function chips(name, liste, an) {
  return '<div class="c6v-wahl" role="radiogroup" aria-label="' + esc(name) + '">' + Object.keys(liste).map(function (k) {
    return '<button type="button" role="radio" class="c6v-chip' + (k === an ? ' c6v-an' : '') + '" aria-checked="' + (k === an) + '" data-k="' + k + '">' + esc(liste[k].name) + '</button>';
  }).join('') + '</div>';
}
function mal() {
  var b = hulle.querySelector('.c6v-blatt'), w = WER[wahl.wer], v = C6.verbindung.info();
  var h = '<div class="c6v-kopf"><h2 class="c6v-titel">Mit deinem Rechner verbinden</h2><button type="button" class="c6v-zu" aria-label="Schließen"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>';
  if (v) {
    h += '<p class="c6v-satz">Verbunden: <b>' + esc(v.name) + '</b> auf deinem ' + esc(v.woName) + '.</p>' +
      '<p class="c6v-ehrlich">Das heißt heute: Ich weiß, dass es bei dir läuft. Steuern kann ich es noch nicht, und ich sehe nichts von deinem Rechner.</p>' +
      '<div class="c6v-tun"><button type="button" class="c6v-knopf c6v-haupt" data-tun="ufo">Zum UFO</button><button type="button" class="c6v-knopf c6v-leise" data-tun="trennen">Trennen</button></div>';
    b.innerHTML = h; binde(); return;
  }
  var eigen = {}; ['mac', 'windows', 'linux'].forEach(function (k) { eigen[k] = WO[k]; });
  var anders = wahl.wer !== 'claude' || wahl.wo === 'server';
  h += '<p class="c6v-satz">Du hast ' + esc(w.name) + ' auf deinem Computer? Dann zeig ich dir, wie ich das nachprüfen kann. Zum Dank wacht das UFO in der Garage auf.</p>' +
    '<span class="c6v-klein">Dein Computer</span>' + chips('Dein Computer', eigen, wahl.wo === 'server' ? '' : wahl.wo) +
    '<details class="c6v-andere"' + (anders ? ' open' : '') + '><summary>Andere Wege</summary>' +
    '<div class="c6v-wahl c6v-wahl-andere">' +
    '<button type="button" class="c6v-chip' + (wahl.wer === 'codex' ? ' c6v-an' : '') + '" aria-pressed="' + (wahl.wer === 'codex') + '" data-anders="codex">Codex statt Claude Code</button>' +
    '<button type="button" class="c6v-chip' + (wahl.wo === 'server' ? ' c6v-an' : '') + '" aria-pressed="' + (wahl.wo === 'server') + '" data-anders="server">Auf meinem Server</button></div></details>' +
    '<p class="c6v-warn">Kopier nie Zeilen von Fremden ins Terminal.</p>' +
    (wahl.wer === 'codex' ? codexBlock(wahl.wo) : '') +
    '<ol class="c6v-schritte">' +
    '<li><span>' + esc(WO[wahl.wo].auf) + '</span></li>' +
    '<li><span>Dort fügst du eine Zeile ein, die ich dir zeige. Sie fragt nur, ob ' + esc(w.name) + ' da ist, und rechnet daraus sechs Ziffern. Sie installiert nichts, löscht nichts und schickt nichts weg.</span>' +
    '<details class="c6v-sehen"><summary>Zeile ansehen</summary><div class="c6v-zeile"><code>' + esc(zeile(nonce, wahl.wer, wahl.wo)) + '</code></div>' +
    '<ul class="c6v-stuecke">' + stuecke(wahl.wer, wahl.wo).map(function (x) { return '<li><code>' + esc(x[0]) + '</code><span>' + esc(x[1]) + '</span></li>'; }).join('') + '</ul>' +
    '<button type="button" class="c6v-knopf c6v-haupt c6v-kopier" data-tun="kopier">Zeile kopieren</button></details></li>' +
    '<li><span>Dort steht dann „Carl-Code:“ und sechs Ziffern. Tipp sie hier ein.</span>' +
    '<form class="c6v-form"><input class="c6v-feld" inputmode="numeric" autocomplete="one-time-code" maxlength="7" placeholder="123456" aria-label="Carl-Code, sechs Ziffern"><button type="submit" class="c6v-knopf c6v-haupt">Prüfen</button></form>' +
    '<p class="c6v-meldung" aria-live="polite"></p></li></ol>' +
    '<p class="c6v-ehrlich">Steht dort „' + esc(w.name) + ' fehlt noch.“? Dann ist es noch nicht installiert: ' + (wahl.wer === 'codex' ? 'siehe „Was bei Codex anders ist“ oben' : esc(w.hilfe)) + '.</p>' +
    '<p class="c6v-ehrlich"><b>Was das heute heißt:</b> Ich weiß dann, dass ' + esc(w.name) + ' bei dir läuft. Steuern kann ich es noch nicht, und ich sehe nichts von deinem Computer.</p>';
  b.innerHTML = h; binde();
}
function binde() {
  var b = hulle.querySelector('.c6v-blatt');
  b.querySelector('.c6v-zu').onclick = zu;
  Array.prototype.forEach.call(b.querySelectorAll('.c6v-chip[data-k]'), function (c) { c.onclick = function () { wahl.wo = c.dataset.k; mal(); }; });
  Array.prototype.forEach.call(b.querySelectorAll('.c6v-chip[data-anders]'), function (c) {
    c.onclick = function () {
      if (c.dataset.anders === 'codex') wahl.wer = wahl.wer === 'codex' ? 'claude' : 'codex';
      else wahl.wo = wahl.wo === 'server' ? rate() : 'server';
      mal();
    };
  });
  Array.prototype.forEach.call(b.querySelectorAll('[data-tun]'), function (k) {
    k.onclick = function () {
      var t = k.dataset.tun;
      if (t === 'kopier') kopier(k);
      if (t === 'trennen') { C6.verbindung.setze('nicht verbunden'); nonce = neueNonce(); aendern(function () { var x = V(); x.nonce = nonce; x.nonceTs = Date.now(); }); mal(); }
      if (t === 'ufo') { zu(); if (C6.jetzt !== 'fahrrad') C6.geh('fahrrad'); }
    };
  });
  Array.prototype.forEach.call(b.querySelectorAll('[data-kopier]'), function (k) { k.onclick = function () { kopierText(k.dataset.kopier, k); }; });
  var f = b.querySelector('.c6v-form');
  if (f) f.onsubmit = function (e) { e.preventDefault(); pruefe(b.querySelector('.c6v-feld').value); };
}
function kopierText(z, k) {
  var alt = k.textContent;
  function ok() { k.textContent = 'Kopiert'; k.classList.add('c6v-ok'); setTimeout(function () { if (k.isConnected) { k.textContent = alt; k.classList.remove('c6v-ok'); } }, 1800); }
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(z).then(ok, function () { k.textContent = 'Markier die Zeile und kopier sie'; }); return; } } catch (e) {}
  k.textContent = 'Markier die Zeile und kopier sie';
}
function kopier(k) {
  var z = zeile(nonce, wahl.wer, wahl.wo);
  function ok() { k.textContent = 'Kopiert'; k.classList.add('c6v-ok'); setTimeout(function () { if (k.isConnected) { k.textContent = 'Zeile kopieren'; k.classList.remove('c6v-ok'); } }, 1800); }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(z).then(ok, alt); return; }
  } catch (e) {}
  alt();
  function alt() {
    var code = hulle.querySelector('.c6v-zeile code'); if (!code) return;
    var r = document.createRange(); r.selectNodeContents(code); var s = getSelection(); s.removeAllRanges(); s.addRange(r);
    var gut = false; try { gut = document.execCommand('copy'); } catch (e) {}
    if (gut) ok(); else k.textContent = 'Markiert: jetzt kopieren';
  }
}
function meldung(t, gut) { var m = hulle.querySelector('.c6v-meldung'); if (m) { m.textContent = t; m.classList.toggle('c6v-gut', !!gut); try { m.scrollIntoView({ block: 'nearest', behavior: C6.ruhig ? 'auto' : 'smooth' }); } catch (e) {} } }
function pruefe(roh) {
  var z = String(roh || '').replace(/\D/g, '');
  if (z.length !== 6) { meldung('Es sind sechs Ziffern.'); return; }
  code(nonce, wahl.wer).then(function (soll) {
    if (soll !== z) {
      // vielleicht das andere Werkzeug gewählt
      var anders = wahl.wer === 'claude' ? 'codex' : 'claude';
      return code(nonce, anders).then(function (soll2) {
        if (soll2 === z) { wahl.wer = anders; return erfolg(); }
        meldung('Der Code passt nicht. Stimmt die Zeile von eben? Eine Zeile gilt 30 Minuten.');
        var f = hulle.querySelector('.c6v-feld'); if (f && !C6.ruhig) { try { f.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'none' }], { duration: 300 }); } catch (e) {} }
      });
    }
    return erfolg();
  }).catch(function () { meldung('Hier kann ich nicht rechnen (der Browser lässt es nicht zu). Öffne Carl über seine Adresse in Safari oder Chrome.'); });
}
function erfolg() {
  C6.verbindung.setze('verbunden', { wer: wahl.wer, wo: wahl.wo });
  meldung('Passt. ' + WER[wahl.wer].name + ' läuft bei dir.', true);
  setTimeout(function () {
    zu();
    if (C6.jetzt !== 'fahrrad') C6.geh('fahrrad', { ufoWach: true });
    else emit('verbindung', { status: 'verbunden', info: C6.verbindung.info(), wach: true });
  }, C6.ruhig ? 300 : 900);
}
function oeffne(o) {
  if (!hulle) {
    hulle = document.createElement('div'); hulle.className = 'c6v-hulle'; hulle.setAttribute('data-c6-kein-wisch', '');
    hulle.innerHTML = '<div class="c6v-blatt" role="dialog" aria-modal="true" aria-label="Mit deinem Rechner verbinden"></div>';
    hulle.addEventListener('click', function (e) { if (e.target === hulle) zu(); });
  }
  wahl.wer = o.wer && WER[o.wer] ? o.wer : 'claude';
  wahl.wo = o.wo && WO[o.wo] ? o.wo : rate();
  // dieselbe Zeile gilt 30 Minuten, auch wenn Carl zwischendurch neu lädt (z. B. am iPhone, während du am Rechner bist)
  var v = V();
  if (v.nonce && v.nonceTs && Date.now() - v.nonceTs < 30 * 60 * 1000) nonce = v.nonce;
  else { nonce = neueNonce(); aendern(function () { var x = V(); x.nonce = nonce; x.nonceTs = Date.now(); }); }
  document.body.appendChild(hulle);
  mal();
  try { hulle.querySelector('.c6v-blatt').animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: C6.ruhig ? 0 : 260, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
  setTimeout(function () { var k = hulle.querySelector('.c6v-zu'); try { k && k.focus({ preventScroll: true }); } catch (e) {} }, 40);
}
function zu() { if (hulle && hulle.parentNode) hulle.parentNode.removeChild(hulle); }
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && hulle && hulle.parentNode) { e.stopPropagation(); zu(); } }, true);


/* ====================================================================================
   Blatt 2 · Dein eigenes Modell (erweiternder Bereich): Ollama oder LM Studio auf dem eigenen Rechner,
   über raffaels C6.lokal. Ohne C6.lokal sagt das Blatt ehrlich, dass es noch nicht geht.
   ==================================================================================== */
var LURL = { ollama: 'http://127.0.0.1:11434/v1', lmstudio: 'http://localhost:1234/v1' };
var lh = null, L = { weg: 'ollama', wo: 'mac', gb: 16, ergebnis: null, modell: '', probe: null, laeuft: false };
function lokalDa() { return !!(C6.lokal && C6.lokal.pruefe && C6.lokal.setze && C6.lokal.status); }
function lBrowser() { try { return C6.lokal.browser(); } catch (e) { return 'andere'; } }
function lUrsprung() { try { return C6.lokal.ursprung(); } catch (e) { return null; } }
function lStatus() { try { return C6.lokal.status(); } catch (e) { return { an: false }; } }
function lEmpfehlung(gb) { try { return C6.lokal.empfehlung(gb); } catch (e) { return gb >= 32 ? 'qwen3.8:27b' : gb >= 16 ? 'qwen3.5:9b' : 'gemma4:e2b'; } }
function lZeile(art) { try { return C6.lokal.zeile(art); } catch (e) { return null; } }
function lMal() {
  var b = lh.querySelector('.c6v-blatt'), u = lUrsprung(), br = lBrowser(), st = lStatus(), wo = WO[L.wo] || WO.mac;
  var h = '<div class="c6v-kopf"><h2 class="c6v-titel">Dein eigenes Modell</h2><button type="button" class="c6v-zu" aria-label="Schließen"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>';
  if (!lokalDa()) {
    h += '<p class="c6v-satz">Ein Modell auf deinem eigenen Rechner: Das kommt noch. Heute denke ich über claude.ai mit.</p>';
    b.innerHTML = h; lBinde(); return;
  }
  h += '<p class="c6v-satz">Das ist der Teil für Bastler: Ein Sprachmodell läuft auf deinem eigenen Rechner, und ich frage es, statt claude.ai. Gratis, privat, und ab 16 GB Speicher wirklich brauchbar.</p>';
  if (st.an) {
    h += '<p class="c6v-gut-kasten">Dein Rechner denkt mit: <b>' + esc(st.modell) + '</b>' + (st.fehler ? '<br><span class="c6v-leise-text">Zuletzt hat er nicht geantwortet. Läuft ' + (L.weg === 'lmstudio' ? 'LM Studio' : 'Ollama') + ' noch?</span>' : '') + '</p>';
  }
  // Safari und Ursprung: vor Schritt 1
  if (br === 'safari') h += '<p class="c6v-warn">Für dein eigenes Modell brauchst du Chrome oder Firefox. Safari lässt Seiten wie mich nicht mit Programmen auf deinem Rechner reden. Öffne mich dort, dann geht es weiter.</p>';
  else if (!u) h += '<p class="c6v-warn">Auf dieser Seite kann ich deinen Rechner nicht erreichen. Öffne mich über meine eigene Adresse, dann geht es.</p>';
  var eigen = {}; ['mac', 'windows', 'linux'].forEach(function (k) { eigen[k] = WO[k]; });
  h += '<span class="c6v-klein">Dein Computer</span>' + chips('Dein Computer', eigen, L.wo) +
    '<details class="c6v-andere"' + (L.weg === 'lmstudio' ? ' open' : '') + '><summary>Anderer Weg</summary><div class="c6v-wahl c6v-wahl-andere">' +
    '<button type="button" class="c6v-chip' + (L.weg === 'lmstudio' ? ' c6v-an' : '') + '" aria-pressed="' + (L.weg === 'lmstudio') + '" data-weg="lmstudio">LM Studio statt Ollama</button></div></details>';
  h += '<p class="c6v-warn">Kopier nie Zeilen von Fremden ins Terminal.</p>';
  h += '<ol class="c6v-schritte">';
  var gbChips = [8, 16, 32].map(function (g) { return '<button type="button" class="c6v-chip c6v-chip-klein' + (L.gb === g ? ' c6v-an' : '') + '" data-gb="' + g + '">' + (g === 32 ? '32 GB oder mehr' : g + ' GB') + '</button>'; }).join('');
  var emp = lEmpfehlung(L.gb);
  if (L.weg === 'ollama') {
    h += '<li><span><b>Ollama laden:</b> ollama.com/download, öffnen. ' + (L.wo === 'mac' ? 'Oben in der Menüleiste erscheint ein Lamakopf.' : L.wo === 'windows' ? 'Unten rechts im Infobereich erscheint ein Lamakopf.' : 'Auf Linux läuft es nach dem Installieren als Dienst im Hintergrund.') + '</span></li>';
    h += '<li><span><b>Ein Modell wählen.</b> Wie viel Speicher hat dein Rechner?</span><div class="c6v-wahl">' + gbChips + '</div>' +
      '<span>Dann nimm <code>' + esc(emp) + '</code>: Im Chatfenster von Ollama oben das Modell wählen und eine erste Frage stellen. Beim ersten Mal lädt Ollama es herunter (ein paar GB, dauert).</span></li>';
    h += '<li><span><b>Mich erlauben (einmal):</b> Ollama lässt nur Seiten zu, die du ihm nennst. Meine Adresse ist <code>' + esc(u || '…') + '</code>. ' + lOllamaErlauben(u) + '</span></li>';
  } else {
    h += '<li><span><b>LM Studio laden:</b> lmstudio.ai, öffnen' + (L.wo === 'mac' ? ' (nur Apple-Silicon-Macs, macOS 14 oder neuer)' : '') + '.</span></li>';
    h += '<li><span><b>Ein Modell laden.</b> Wie viel Speicher hat dein Rechner?</span><div class="c6v-wahl">' + gbChips + '</div>' +
      '<span>Im Reiter „Discover“ (Lupe) nach <code>' + esc(emp.replace(/:/, ' ')) + '</code> suchen; nur Modelle mit grünem „fits“ nehmen. Dann im Reiter „Chat“ das Modell laden und eine Frage stellen.</span></li>';
    h += '<li><span><b>Mich erlauben (einmal):</b> Reiter „Developer“ (Terminal-Symbol; wenn er fehlt, unten „User“ auf „Developer“ stellen) → Schalter „Start server“. Dann im Server-Fenster „Settings“: <b>„Enable CORS“ an</b>, <b>„Serve on Local Network“ aus</b> lassen.</span></li>';
  }
  // Prüfen
  h += '<li><span><b>Prüfen.</b> Ich schaue nach, ob dein Rechner antwortet. Dein Browser fragt dabei vielleicht einmal „Apps auf diesem Gerät“: Erlauben.</span>' +
    '<div class="c6v-tun"><button type="button" class="c6v-knopf c6v-haupt" data-ltun="pruefen"' + (br === 'safari' || !u || L.laeuft ? ' disabled' : '') + '>' + (L.laeuft ? 'Ich schaue nach …' : 'Prüfen') + '</button></div>' +
    lErgebnis(emp, st) + '</li>';
  h += '</ol>';
  h += '<p class="c6v-ehrlich"><b>Was dein Rechner kann:</b> Sortieren, Zusammenfassen, Entwürfe. <b>Was er nicht kann:</b> Fakten. Kleine Modelle erfinden oft etwas, ruhig und überzeugt. Ich sag dir immer, wer gerade antwortet, und jede Antwort kannst du mit Claude prüfen lassen.</p>';
  if (st.an) h += '<div class="c6v-tun"><button type="button" class="c6v-knopf c6v-leise" data-ltun="aus">Wieder über claude.ai denken</button></div>';
  b.innerHTML = h; lBinde();
}
function lOllamaErlauben(u) {
  if (!u) return 'Sobald ich meine Adresse kenne, zeig ich dir die Zeile dafür.';
  var z = lZeile(L.wo === 'windows' ? 'windows' : L.wo === 'linux' ? 'linux' : 'mac');
  if (L.wo === 'windows') return 'Ollama unten rechts beenden. Windows-Suche → „Umgebungsvariablen für dieses Konto bearbeiten“ → „Neu“: Name <code>OLLAMA_ORIGINS</code>, Wert meine Adresse → OK. Ollama über das Startmenü neu starten.' +
    '<div class="c6v-zeile c6v-zeile-klein"><code>' + esc(u) + '</code></div><button type="button" class="c6v-knopf c6v-leise" data-kopier="' + esc(u) + '">Adresse kopieren</button>';
  if (L.wo === 'linux') return 'Im Terminal <code>sudo systemctl edit ollama.service</code> tippen, unter <code>[Service]</code> diese Zeile einfügen, speichern, dann <code>sudo systemctl daemon-reload &amp;&amp; sudo systemctl restart ollama</code>.' +
    '<div class="c6v-zeile c6v-zeile-klein"><code>' + esc(z) + '</code></div><button type="button" class="c6v-knopf c6v-leise" data-kopier="' + esc(z) + '">Zeile kopieren</button>';
  return WO.mac.auf.replace(/ Das ist ein Fenster.*$/, '') + ' Füg diese Zeile ein, Enter. Sie merkt sich nur meine Adresse, sonst nichts. Dann Ollama über den Lamakopf beenden und neu öffnen.' +
    '<div class="c6v-zeile c6v-zeile-klein"><code>' + esc(z) + '</code></div><button type="button" class="c6v-knopf c6v-leise" data-kopier="' + esc(z) + '">Zeile kopieren</button>' +
    '<span class="c6v-leise-text">Nur meine Adresse, nie ein Sternchen. Und in Ollamas Einstellungen „Expose Ollama to the network“ aus lassen.</span>';
}
function lErgebnis(emp, st) {
  var r = L.ergebnis; if (!r) return '<p class="c6v-meldung" aria-live="polite"></p>';
  if (!r.ok) {
    var t = r.grund === 'verweigert' ? 'Dein Browser hat mich nicht zu deinem Rechner gelassen. Klick vorn in der Adressleiste auf das Schloss und erlaube „Apps auf diesem Gerät“, dann nochmal prüfen.'
      : r.grund === 'cors' ? 'Dein Rechner antwortet, lässt mich aber noch nicht zu. Die Zeile aus Schritt 3 fehlt noch, oder ' + (L.weg === 'lmstudio' ? 'LM Studio' : 'Ollama') + ' wurde danach nicht neu gestartet.'
      : r.grund === 'zeit' ? 'Dein Rechner hat nicht geantwortet. Vielleicht lädt er gerade ein Modell.'
      : r.grund === 'safari' ? 'In Safari geht es nicht. Öffne mich in Chrome oder Firefox.'
      : r.grund === 'ursprung' ? 'Auf dieser Seite kann ich deinen Rechner nicht erreichen.'
      : 'Ich finde nichts auf deinem Rechner. Läuft ' + (L.weg === 'lmstudio' ? 'LM Studio mit gestartetem Server' : 'Ollama') + '?';
    return '<p class="c6v-meldung" aria-live="polite">' + esc(t) + '</p>';
  }
  if (!r.modelle.length) return '<p class="c6v-meldung" aria-live="polite">Dein Rechner antwortet, hat aber noch kein Modell. Lade erst eins (Schritt 2).</p>';
  var h = '<p class="c6v-meldung c6v-gut" aria-live="polite">Dein Rechner antwortet. Das hat er geladen:</p><div class="c6v-modelle" role="radiogroup" aria-label="Modell wählen">';
  r.modelle.forEach(function (m) {
    var an = L.modell === m.id;
    h += '<button type="button" role="radio" aria-checked="' + an + '" class="c6v-modell' + (an ? ' c6v-an' : '') + '" data-modell="' + esc(m.id) + '"><b>' + esc(m.name) + '</b>' + (m.id === emp || m.name === emp ? '<i>mein Vorschlag</i>' : '') + '</button>';
  });
  h += '</div>';
  if (L.modell) {
    h += '<div class="c6v-tun"><button type="button" class="c6v-knopf c6v-haupt" data-ltun="probe"' + (L.laeuft ? ' disabled' : '') + '>' + (L.laeuft ? 'Ich frage …' : 'Probe: „Sag mir in einem Satz Hallo“') + '</button></div>';
    if (L.probe) h += '<div class="c6v-probe"><span class="c6v-klein">Antwort von ' + esc(L.modell) + ' (dein Rechner)</span><p>' + esc(L.probe.text || L.probe.fehler) + '</p>' + (L.probe.text ? '<p class="c6v-gut">Passt. Ab jetzt denkt dein Rechner mit, wenn er erreichbar ist.</p>' : '') + '</div>';
  }
  return h;
}
function lBinde() {
  var b = lh.querySelector('.c6v-blatt');
  b.querySelector('.c6v-zu').onclick = lZu;
  Array.prototype.forEach.call(b.querySelectorAll('.c6v-chip[data-k]'), function (c) { c.onclick = function () { L.wo = c.dataset.k; lMal(); }; });
  Array.prototype.forEach.call(b.querySelectorAll('[data-weg]'), function (c) { c.onclick = function () { L.weg = L.weg === 'lmstudio' ? 'ollama' : 'lmstudio'; L.ergebnis = null; L.modell = ''; L.probe = null; lMal(); }; });
  Array.prototype.forEach.call(b.querySelectorAll('[data-gb]'), function (c) { c.onclick = function () { L.gb = +c.dataset.gb; lMal(); }; });
  Array.prototype.forEach.call(b.querySelectorAll('[data-kopier]'), function (k) { k.onclick = function () { kopierText(k.dataset.kopier, k); }; });
  Array.prototype.forEach.call(b.querySelectorAll('[data-modell]'), function (k) {
    k.onclick = function () {
      L.modell = k.dataset.modell; L.probe = null;
      try { C6.lokal.setze({ url: L.ergebnis.url, modell: L.modell }); } catch (e) {}
      lMal();
    };
  });
  Array.prototype.forEach.call(b.querySelectorAll('[data-ltun]'), function (k) {
    k.onclick = function () {
      var t = k.dataset.ltun;
      if (t === 'pruefen') lPruefen();
      if (t === 'probe') lProbe();
      if (t === 'aus') { try { C6.lokal.setze(null); } catch (e) {} L.modell = ''; L.probe = null; lMal(); }
    };
  });
}
function lPruefen() {
  L.laeuft = true; L.ergebnis = null; L.probe = null; lMal();
  var url = LURL[L.weg];
  Promise.resolve().then(function () { return C6.lokal.pruefe(url); }).then(function (r) {
    L.ergebnis = r || { ok: false, modelle: [], grund: 'kein-server' };
    var st = lStatus();
    if (r && r.ok && r.modelle.length) {
      var emp = lEmpfehlung(L.gb), ids = r.modelle.map(function (m) { return m.id; });
      L.modell = (st.an && ids.indexOf(st.modell) >= 0) ? st.modell : (ids.indexOf(emp) >= 0 ? emp : '');
      if (L.modell) { try { C6.lokal.setze({ url: r.url, modell: L.modell }); } catch (e) {} }
    }
  }).catch(function () { L.ergebnis = { ok: false, modelle: [], grund: 'kein-server' }; }).then(function () { L.laeuft = false; if (lh && lh.parentNode) lMal(); });
}
function lProbe() {
  L.laeuft = true; L.probe = null; lMal();
  Promise.resolve().then(function () { return C6.lokal.probe('Sag mir in einem Satz Hallo.'); }).then(function (t) {
    L.probe = { text: String(t || '').trim() || '(keine Antwort)' };
  }).catch(function (e) {
    L.probe = { fehler: e && e.code === 'kein-modell' ? 'Erst ein Modell wählen.' : 'Dein Rechner hat nicht geantwortet. Läuft das Modell noch?' };
  }).then(function () { L.laeuft = false; if (lh && lh.parentNode) lMal(); });
}
function oeffneLokal(o) {
  if (!lh) {
    lh = document.createElement('div'); lh.className = 'c6v-hulle'; lh.setAttribute('data-c6-kein-wisch', '');
    lh.innerHTML = '<div class="c6v-blatt c6v-blatt-lokal" role="dialog" aria-modal="true" aria-label="Dein eigenes Modell"></div>';
    lh.addEventListener('click', function (e) { if (e.target === lh) lZu(); });
  }
  zu();
  L.wo = o.wo && WO[o.wo] && o.wo !== 'server' ? o.wo : rate();
  if (o.url) L.weg = /1234/.test(String(o.url)) ? 'lmstudio' : 'ollama';
  var st = lStatus(); if (st.an && st.url) { L.weg = /1234/.test(String(st.url)) ? 'lmstudio' : 'ollama'; L.modell = st.modell || ''; }
  document.body.appendChild(lh);
  lMal();
  try { lh.querySelector('.c6v-blatt').animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: C6.ruhig ? 0 : 260, easing: 'cubic-bezier(.3,.7,.3,1)' }); } catch (e) {}
  return true;
}
function lZu() { if (lh && lh.parentNode) lh.parentNode.removeChild(lh); }
document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && lh && lh.parentNode) { e.stopPropagation(); lZu(); } }, true);
