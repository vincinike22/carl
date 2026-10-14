// Teleskop: geteilte Gerüste als Sterne. Carl sitzt am Rohr und schaut mit hinein.
(function () {
  var C6 = window.C6;
  if (!C6 || !C6.raum) return;
  var esc = function (t) { return C6.strings.esc(t); };
  var SYMBOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14l13-6 2 4-13 6z"/><path d="M16 8l3-1.5 2 4-3 1.5"/><path d="M9 17l-3 5M10 16.5l3 5.5"/></svg>';

  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; }

  C6.raum({
    id: 'teleskop', name: 'Teleskop', hoehe: 'teleskop', dock: false, symbol: SYMBOL,
    bauen: function (buehne) {
      buehne.classList.add('c6w-teleskop');
      buehne.innerHTML =
        '<div class="c6w-t-halter" aria-hidden="false">' +
        '<i class="c6w-t-schraube" style="--w:45deg" aria-hidden="true"></i><i class="c6w-t-schraube" style="--w:135deg" aria-hidden="true"></i>' +
        '<i class="c6w-t-schraube" style="--w:225deg" aria-hidden="true"></i><i class="c6w-t-schraube" style="--w:315deg" aria-hidden="true"></i>' +
        '<div class="c6w-rohr"><canvas class="c6w-himmel" aria-hidden="true"></canvas><div class="c6w-sterne" role="list" aria-label="Geteilte Gerüste"></div></div>' +
        '<i class="c6w-t-fuss" aria-hidden="true"></i>' +
        '</div>' +
        '<div class="c6w-t-carl" aria-hidden="true"></div>' +
        '<div class="c6w-blatt c6w-nacht" role="dialog" hidden></div>' +
        '<div class="c6w-t-vorschau" role="dialog" aria-live="polite" hidden></div>';
      var halter = buehne.querySelector('.c6w-t-halter');
      var rohr = buehne.querySelector('.c6w-rohr');
      var lein = buehne.querySelector('.c6w-himmel');
      var ctx = lein.getContext('2d');
      var sterneEl = buehne.querySelector('.c6w-sterne');
      var carlEl = buehne.querySelector('.c6w-t-carl');
      var blatt = buehne.querySelector('.c6w-blatt');
      var karte = buehne.querySelector('.c6w-t-vorschau');
      var D = 300, DPR = 1, pan = { x: 0, y: 0 }, aktiv = false, raf = 0, t0 = performance.now(), tBild = 0;
      var taktAus = null, taktWecke = null;
      var punkte = [];
      for (var i = 0; i < 260; i++) punkte.push({ x: hash('x' + i) * 2 - 1, y: hash('y' + i) * 2 - 1, r: 0.4 + hash('r' + i) * 1.3, p: hash('p' + i) * 6.28, band: hash('b' + i), fk: hash('f' + i) < 0.3 ? 3.4 + hash('q' + i) * 2.2 : 0 });
      var orte = {};

      function liste() {
        var eigene = C6.geruest.eigene().filter(function (g) { return g.teleskop; }).map(function (g) { return { g: g, eigen: true }; });
        var vor = C6.geruest.vorlagen.map(function (g) { return { g: g, eigen: false }; });
        // geteilte Werkzeuge (Haken, Zähler …) stehen als eigene Sterne daneben
        var wz = [];
        try { wz = (C6.werkzeug && C6.werkzeug.geteilt ? C6.werkzeug.geteilt() : []).map(function (w) { return { g: { id: 'wz:' + w.id, name: w.name, farbe: w.farbe || '#4f7fa8', schritte: [] }, eigen: true, wz: w }; }); } catch (e) { wz = []; }
        return eigene.concat(wz, vor);
      }
      // Sterne verteilen: jedes Schild steht frei (Rechtecke stoßen sich ab, bleiben im Rohr)
      var liste0 = [];
      function verteilen() {
        var l = liste0, n = l.length; orte = {};
        if (!n) return;
        ctx.font = '600 14px Figtree, system-ui, sans-serif';
        var pts = l.map(function (e, i) {
          var r = Math.sqrt((i + 0.6) / n) * 0.56, a = i * 2.39996 + 0.7;
          var w = Math.min(D * 0.6, ctx.measureText(e.g.name).width + 14);
          if ((C6.S.wand || []).indexOf(e.g.id) >= 0) { ctx.font = '500 12px Figtree, system-ui, sans-serif'; w = Math.max(w, ctx.measureText('an deiner Wand').width + 14); ctx.font = '600 14px Figtree, system-ui, sans-serif'; }
          return { id: e.g.id, x: Math.cos(a) * r * D * 0.6, y: Math.sin(a) * r * D * 0.68, w: w, h: e.eigen || (C6.S.wand || []).indexOf(e.g.id) >= 0 ? 54 : 42 };
        });
        var R = D * 0.47;
        for (var it = 0; it < 80; it++) {
          var bewegt = false;
          for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
            var a = pts[i], b = pts[j];
            // Kasten: Stern oben (y-14), Schild darunter
            var dx = b.x - a.x, dy = (b.y + b.h / 2 - 14) - (a.y + a.h / 2 - 14);
            var ox = (a.w + b.w) / 2 + 6 - Math.abs(dx), oy = (a.h + b.h) / 2 + 2 - Math.abs(dy);
            if (ox <= 0 || oy <= 0) continue;
            bewegt = true;
            if (ox < oy) { var sx = (dx < 0 ? -1 : 1) * ox / 2; a.x -= sx; b.x += sx; }
            else { var sy = (dy < 0 ? -1 : 1) * oy / 2; a.y -= sy; b.y += sy; }
          }
          // im Rohr bleiben: Schildkasten innerhalb des Kreises
          pts.forEach(function (p) {
            var mx = R - p.w / 2, my = R - p.h / 2 - 4;
            if (p.x > mx) { p.x = mx; } if (p.x < -mx) { p.x = -mx; }
            if (p.y > my - 24) { p.y = my - 24; } if (p.y < -my + 14) { p.y = -my + 14; }
            var cx = p.x, cy = p.y + 10, d = Math.hypot(cx, cy), g = R - Math.max(p.w, p.h) * 0.42;
            if (d > g) { p.x = cx / d * g; p.y = cy / d * g - 10; bewegt = true; }
          });
          if (!bewegt) break;
        }
        pts.forEach(function (p) { orte[p.id] = { x: p.x, y: p.y }; });
      }
      function sterneBauen() {
        liste0 = liste();
        var wand = (C6.S.wand || []);
        sterneEl.innerHTML = liste0.map(function (e) {
          var an = wand.indexOf(e.g.id) >= 0;
          // jeder Stern atmet in eigenem Takt (Periode 3,4 bis 5,4 s) und mit eigenem Versatz
          return '<button class="c6w-stern' + (e.eigen ? ' c6w-eigen' : '') + (an ? ' c6w-an-wand' : '') + '" role="listitem" data-id="' + e.g.id + '" style="--f:' + e.g.farbe + ';--d:' + (hash(e.g.id) * 3).toFixed(2) + 's;--p:' + (3.4 + hash(e.g.id + 'p') * 2).toFixed(2) + 's">' +
            '<span class="c6w-glanz" aria-hidden="true"></span><span class="c6w-stern-name">' + esc(e.g.name) + '</span>' +
            (e.eigen ? '<span class="c6w-stern-art">von dir</span>' : '') + '</button>';
        }).join('');
        verteilen(); setzen();
      }
      function setzen() {
        [].forEach.call(sterneEl.children, function (b) {
          var o = orte[b.dataset.id]; if (!o) return;
          b.style.transform = 'translate(' + (o.x + pan.x + D / 2) + 'px,' + (o.y + pan.y + D / 2) + 'px) translate(-50%,-22px)';
        });
      }

      // ——— Carl am Rohr ———
      var carlCtl = null, carlOrt = null, carl = { gef: null, sitzt: false, lehnt: false, schlaeft: false, blickBis: 0, kipp: 0, pos: '' };
      function carlPx() { return C6.geraet === 'computer' ? 84 : 72; }
      function gefaehrtHolen() { try { return C6.laden && typeof C6.laden.gefaehrt === 'function' ? (C6.laden.gefaehrt() || null) : null; } catch (e) { return null; } }
      function carlMalen() {
        if (carlCtl || !C6.figur || !C6.figur.male) return;
        try { carlCtl = C6.figur.male(carlEl, { groesse: carlPx(), stimmung: 'staunt' }); } catch (e) { carlCtl = null; }
        try { if (carlCtl && C6.laden && C6.laden.an) carlCtl.kleid(C6.laden.an()); } catch (e) {}
      }
      function carlEinsteigen() {
        if (!carlCtl) return;
        var g = gefaehrtHolen(); carl.gef = null; carl.sitzt = false;
        if (g && typeof carlCtl.sitzIn === 'function') { try { carlCtl.kleid({ gefaehrt: g }); carlCtl.sitzIn(true); carl.gef = g; carl.sitzt = true; } catch (e) { carl.gef = null; carl.sitzt = false; } }
        buehne.classList.toggle('c6w-t-gefaehrt', !!carl.gef);
      }
      function carlAussteigen() {
        if (!carlCtl) return;
        if (carl.sitzt) { try { carlCtl.sitzIn(false); } catch (e) {} }
        if (carl.gef) { try { carlCtl.kleid({ gefaehrt: null }); } catch (e) {} }
        carl.gef = null; carl.sitzt = false; buehne.classList.remove('c6w-t-gefaehrt');
      }
      // sein Platz: rechts unten am Rand des Rohrs, halb über der Fassung, Blick hinein
      function carlPlatz() {
        var b = buehne.getBoundingClientRect(), r = rohr.getBoundingClientRect(), g = carlPx();
        // am Computer links unten (rechts liegt das Blatt), am iPhone rechts unten
        var a0 = C6.geraet === 'computer' ? Math.PI - 0.6 : 0.86, R = D / 2 + 10;
        function bei(a) { var cx = r.left - b.left + D / 2 + Math.cos(a) * R, cy = r.top - b.top + D / 2 + Math.sin(a) * R; return [cx - g * 0.42, cy - g * 0.62]; }
        if (!blattOffen()) return bei(a0);
        // das Blatt ist offen: Carl rückt an eine freie Stelle am Rohrrand, über dem Blatt, nichts deckt ihn
        var bl = blattKasten(b), frei = hindernisse(b), w = g * 0.92, h = g * 1.08;
        var wahl = [a0, -0.95, -2.2, -0.55, -2.6, -1.25, -1.9, 0.3, Math.PI - 0.3];
        for (var i = 0; i < wahl.length; i++) {
          var p = bei(wahl[i]), k = [p[0], p[1], p[0] + w, p[1] + h];
          if (k[0] < 6 || k[2] > b.width - 6 || k[1] < 56 || k[3] > b.height - 6) continue;
          if (bl && schneidet(k, bl, 8)) continue;
          if (frei.some(function (q) { return schneidet(k, q, 4); })) continue;
          return p;
        }
        return bei(a0);
      }
      function blattOffen() { return !blatt.hidden && blatt.classList.contains('c6w-an'); }
      function schneidet(a, q, m) { return a[0] < q[2] + m && a[2] > q[0] - m && a[1] < q[3] + m && a[3] > q[1] - m; }
      // Lage des Blatts ohne seine Einflug-Bewegung (Maß der Bühne)
      function blattKasten(b) {
        if (blatt.offsetParent === buehne) return [blatt.offsetLeft, blatt.offsetTop, blatt.offsetLeft + blatt.offsetWidth, blatt.offsetTop + blatt.offsetHeight];
        var q = blatt.getBoundingClientRect(); return [q.left - b.left, q.top - b.top, q.right - b.left, q.bottom - b.top];
      }
      // Knöpfe des Kerns, die oben rechts schweben (Nadel, Höhen): dort setzt Carl sich nicht hin
      function hindernisse(b) {
        return Array.prototype.slice.call(document.querySelectorAll('.c6p-knopf, .c6k-punkt')).map(function (e) { return e.getBoundingClientRect(); })
          .filter(function (q) { return q.width && q.bottom > b.top && q.top < b.bottom; })
          .map(function (q) { return [q.left - b.left, q.top - b.top, q.right - b.left, q.bottom - b.top]; });
      }
      // Blatt auf oder zu: Carl hebt kurz ab und rückt um (gefedert, ≤ 450 ms); bei „ruhig“ steht er gleich dort
      var umsetzUhr = 0;
      function carlUmsetzen() {
        if (!carlCtl) return;
        var alt = carlOrt, neu = carlPlatz();
        var weit = !alt || Math.hypot(neu[0] - alt[0], neu[1] - alt[1]) > 12;
        clearTimeout(umsetzUhr);
        if (weit && !C6.ruhig) {
          carlEl.style.transition = 'transform .44s cubic-bezier(.3,1.3,.5,1)';
          if (!carl.gef && !carl.sitzt && carlCtl.flieg) { try { carlCtl.flieg(true); } catch (e) {} }
          umsetzUhr = setTimeout(function () {
            carlEl.style.transition = '';
            if (!carl.gef && !carl.sitzt && carlCtl.flieg) { try { carlCtl.flieg(false); } catch (e) {} }
          }, 470);
        }
        carlSetzen();
        if (blattOffen() && !carl.schlaeft) {
          var q = blatt.getBoundingClientRect();
          carlSchau(q.left + q.width * 0.4, q.top + 40, 3200);
        }
      }
      function carlSetzen() {
        if (!carlCtl) return;
        carlOrt = carlPlatz();
        var kipp = carl.lehnt ? (carl.gef ? -4 : -2) : 0;
        var t = 'translate(' + Math.round(carlOrt[0]) + 'px,' + Math.round(carlOrt[1]) + 'px) rotate(' + kipp + 'deg)';
        if (t !== carl.pos) { carlEl.style.transform = t; carl.pos = t; }
      }
      function carlSchautHinein() { try { if (carlCtl && !carl.schlaeft) carlCtl.blick(-0.55, -0.42); } catch (e) {} carl.blickBis = 0; }
      function carlSchau(clientX, clientY, ms) {
        if (!carlCtl || carl.schlaeft) return;
        try { carlCtl.schau(clientX, clientY); } catch (e) {}
        clearTimeout(carl.blickBis);
        carl.blickBis = setTimeout(carlSchautHinein, ms || 2600);
      }
      function carlWach() {
        if (!carlCtl) return;
        var war = carl.schlaeft || carl.lehnt, selbst = carl.selbstSchlaf;
        carl.schlaeft = false; carl.lehnt = false; carl.selbstSchlaf = false;
        if (war) { try { if (selbst) carlCtl.stimmung('staunt'); } catch (e) {} carlSchautHinein(); carlSetzen(); }
      }
      function carlAnkunft() {
        if (!carlCtl) return;
        carlSetzen();
        carlEinsteigen();
        carlSchautHinein();
        if (C6.ruhig || !carlEl.animate) return;
        // er kommt von unten herauf und federt kurz nach
        try {
          carlEl.animate([
            { transform: carl.pos + ' translateY(140px)', opacity: 0 },
            { transform: carl.pos + ' translateY(-7px)', opacity: 1, offset: 0.72 },
            { transform: carl.pos + ' translateY(2px)', opacity: 1, offset: 0.9 },
            { transform: carl.pos + ' translateY(0)', opacity: 1 }
          ], { duration: 450, easing: 'cubic-bezier(.3,.7,.3,1)' });
        } catch (e) {}
      }

      function groesse() {
        var W = buehne.clientWidth, H = buehne.clientHeight;
        var unten = parseFloat(getComputedStyle(buehne).getPropertyValue('--c6-unten')) || 0;
        var platz = H - unten - 150;
        D = Math.max(240, Math.min(W - 24, platz, 720));
        rohr.style.width = rohr.style.height = D + 'px';
        halter.style.width = halter.style.height = D + 'px';
        halter.style.setProperty('--r', (D / 2 + 14) + 'px');
        DPR = Math.min(3, window.devicePixelRatio || 1);
        lein.width = Math.round(D * DPR); lein.height = Math.round(D * DPR);
        lein.style.width = lein.style.height = D + 'px';
        verteilen(); setzen(); male((performance.now() - t0) / 1000); carlSetzen();
      }
      function male(t) {
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        var g = ctx.createRadialGradient(D / 2, D / 2, D * 0.1, D / 2, D / 2, D * 0.7);
        g.addColorStop(0, '#1d2445'); g.addColorStop(1, '#0e1329');
        ctx.fillStyle = g; ctx.fillRect(0, 0, D, D);
        // der Sternhimmel dreht sich sehr langsam (eine Umdrehung in fünf Minuten)
        var dreh = C6.ruhig ? 0 : t * 6.2832 / 300;
        ctx.save(); ctx.translate(D / 2 + pan.x * 0.6, D / 2 + pan.y * 0.6); ctx.rotate(dreh);
        ctx.save(); ctx.rotate(-0.5);
        var b = ctx.createLinearGradient(0, -D * 0.25, 0, D * 0.25);
        b.addColorStop(0, 'rgba(170,178,220,0)'); b.addColorStop(0.5, 'rgba(170,178,220,0.10)'); b.addColorStop(1, 'rgba(170,178,220,0)');
        ctx.fillStyle = b; ctx.fillRect(-D * 1.5, -D * 0.25, D * 3, D * 0.5); ctx.restore();
        for (var i = 0; i < punkte.length; i++) {
          var p = punkte[i], x = p.x * D * 1.1, y = p.y * D * 1.1;
          if (x * x + y * y > D * D * 0.62) continue;
          var a = (p.fk && !C6.ruhig) ? 0.45 + 0.4 * Math.sin(t * 6.2832 / p.fk + p.p) : 0.7;
          ctx.fillStyle = 'rgba(238,240,255,' + a.toFixed(3) + ')';
          ctx.beginPath(); ctx.arc(x, y, p.r, 0, 6.29); ctx.fill();
        }
        ctx.restore();
      }
      // ein Hörer im gemeinsamen Takt, höchstens 20 Bilder/s (Rückfall: eigener rAF)
      function schritt(now) {
        if (!aktiv) return false;
        if (now - tBild < 50) return !C6.ruhig;
        tBild = now;
        male((now - t0) / 1000);
        return !C6.ruhig;
      }
      function taktAn() {
        if (taktAus) return;
        if (C6.takt && typeof C6.takt.on === 'function') {
          taktAus = C6.takt.on(function () { return schritt(performance.now()); }, { raum: 'teleskop', ruhig: true });
          taktWecke = function () { try { C6.takt.wecke(); } catch (e) {} };
        } else {
          var f = function (now) { raf = 0; if (aktiv && schritt(now)) raf = requestAnimationFrame(f); };
          taktWecke = function () { if (!raf) raf = requestAnimationFrame(f); };
          taktAus = function () { if (raf) cancelAnimationFrame(raf); raf = 0; };
          taktWecke();
        }
      }
      function taktAb() { if (taktAus) { try { taktAus(); } catch (e) {} } taktAus = null; taktWecke = null; if (raf) cancelAnimationFrame(raf); raf = 0; }

      // Ziehen: am Himmel umsehen
      var zieh = null;
      rohr.addEventListener('pointerdown', function (e) {
        if (e.target.closest('.c6w-stern')) return;
        zieh = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y, id: e.pointerId };
        vorschauZu(true);
        rohr.setPointerCapture && rohr.setPointerCapture(e.pointerId);
        carlWach(); carlSchau(e.clientX, e.clientY, 2200);
      });
      rohr.addEventListener('pointermove', function (e) {
        if (!zieh || e.pointerId !== zieh.id) return;
        var g = D * 0.35;
        pan.x = Math.max(-g, Math.min(g, zieh.px + e.clientX - zieh.x));
        pan.y = Math.max(-g, Math.min(g, zieh.py + e.clientY - zieh.y));
        setzen(); if (C6.ruhig) male((performance.now() - t0) / 1000); else if (taktWecke) taktWecke();
      });
      function los() { zieh = null; }
      rohr.addEventListener('pointerup', los); rohr.addEventListener('pointercancel', los);

      // ——— Vorschau am Stern: am Computer beim Darüberfahren, am iPhone beim ersten Antippen ———
      // Name, ein Satz, worum es geht, und „Übernehmen“; „Ansehen“ öffnet das ganze Blatt.
      var EINF = {
        'v-pruefung': 'Für den Berg vor einer Prüfung: erst sehen, was drankommt, dann ehrlich sortieren, dann ein Plan bis zum Tag.',
        'v-kunde': 'Bevor du baust, fragst du einen echten Menschen. Drei offene Fragen, kein Verkaufen.',
        'v-lied': 'Ein Lied in drei kleinen Abenden. Heute nur eine Zeile, die bleibt.',
        'v-woche': 'Zehn Minuten am Ende der Woche: was gut war, was gehakt hat, eine Sache weiter.',
        'v-seite': 'Gegen die leere Seite: erst absichtlich schlecht, dann etwas besser, dann der erste Absatz.',
        'v-entscheid': 'Wenn du zwischen zwei Wegen hängst: beide in einem Satz, dann die Frage, was du in einem Jahr bereust.',
        'v-umzug': 'Für ein Durcheinander, das drückt: alles ansehen, sortieren, die erste Kiste zu.'
      };
      function einfuehrung(g, eigen) {
        if (g.einleitung) return g.einleitung;
        if (EINF[g.id]) return EINF[g.id];
        var st = g.schritte || [];
        return (eigen ? 'Dein eigenes Gerüst' : 'Ein Gerüst') + (st.length ? ' in ' + st.length + ' Schritten. Es beginnt mit: „' + st[0] + '“' : '.');
      }
      var vor = { id: null, uhr: 0, mausZeit: 0 };
      var kannHover = !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches);
      function eintrag(id) {
        if (/^wz:/.test(id)) {
          var w = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(id.slice(3)) : null;
          return w ? { g: { id: id, name: w.name, farbe: w.farbe || '#4f7fa8', schritte: [] }, wz: w } : null;
        }
        var g = C6.geruest.hol(id); return g ? { g: g } : null;
      }
      // Der Bauplan in Klartext: was drinsteckt und was es nie tut. Fremder Text bleibt Text (nur gezeigt, nie ausgeführt).
      function datumText(j) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(j || ''); return m ? (+m[3]) + '.' + (+m[2]) + '.' + m[1] : (j || 'einem Tag'); }
      function bauplan(e) {
        var z = [];
        if (e.wz) {
          (e.wz.teile || []).forEach(function (t) {
            var tx = t.text ? ': „' + esc(t.text) + '“' : '';
            if (t.t === 'haken') z.push('Ein Haken für jeden Tag' + tx);
            else if (t.t === 'zaehler') z.push('Ein Zähler' + tx + (t.ziel ? ' (Ziel ' + esc(String(t.ziel)) + ')' : ''));
            else if (t.t === 'wert') z.push('Ein Wert am Tag' + (t.einheit ? ' in ' + esc(t.einheit) : '') + tx);
            else if (t.t === 'tag') z.push('Ein Satz am Tag' + tx);
            else if (t.t === 'liste') z.push('Eine Liste' + tx + ((t.punkte || []).length ? ' mit ' + (t.punkte || []).slice(0, 5).map(function (x) { return '„' + esc(x) + '“'; }).join(', ') : ''));
            else if (t.t === 'datum') z.push('Eine Erinnerung am ' + esc(datumText(t.wann)) + tx);
            else if (t.t === 'notiz') z.push('Eine Notiz' + tx);
            else if (t.t === 'frage') z.push('Fragen' + tx + ((t.fragen || []).length ? ': ' + (t.fragen || []).slice(0, 4).map(function (x) { return '„' + esc(x) + '“'; }).join(' · ') : ''));
            else z.push('Ein Baustein „' + esc(t.t || '?') + '“' + tx);
          });
        } else (e.g.schritte || []).forEach(function (x, i) { z.push('Frage ' + (i + 1) + ': „' + esc(x) + '“'); });
        return '<div class="c6w-t-bauplan"><p class="c6w-t-bp-kopf">Bauplan</p>' +
          (z.length ? '<ul>' + z.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul>' : '<p class="c6w-t-bp-nie">Leer.</p>') +
          '<p class="c6w-t-bp-nie">' + (e.wz ? 'Es tut nichts von selbst: nichts verschicken, nichts löschen. Es merkt sich nur, was du einträgst.' : 'Carl fragt dich das nacheinander. Es tut nichts von selbst und verschickt nichts.') + '</p></div>';
      }
      // Übernehmen läuft über die Freigabe des Kerns: umkehrbar, also ohne Karte, danach ein Satz mit Rückweg
      function freigeben(o) {
        if (C6.freigabe) return Promise.resolve(C6.freigabe(o)).then(function (x) { return !!x; }, function () { return false; });
        return Promise.resolve(true);
      }
      function zustand(id) {
        var eigen = C6.geruest.eigene().some(function (x) { return x.id === id; });
        return { eigen: eigen, anWand: eigen || (C6.S.wand || []).indexOf(id) >= 0 };
      }
      function vorschau(b) {
        clearTimeout(vor.uhr);
        var id = b.dataset.id, e = eintrag(id); if (!e) return;
        var g = e.g, z = e.wz ? { eigen: true, anWand: false } : zustand(id), st = g.schritte || [];
        vor.id = id;
        karte.style.setProperty('--f', g.farbe || '#f0a830');
        var n = e.wz ? (e.wz.teile || []).length : st.length;
        karte.innerHTML = '<p class="c6w-t-v-art"><i aria-hidden="true"></i>' + (e.wz ? 'Werkzeug von dir' : z.eigen ? 'Von dir' : 'Beispiel von mir') + (n ? ' · ' + n + (e.wz ? (n === 1 ? ' Baustein' : ' Bausteine') : ' Schritte') : '') + '</p>' +
          '<h3 class="c6w-t-v-name">' + esc(g.name) + '</h3>' +
          (e.wz ? '' : '<p class="c6w-t-v-text">' + esc(einfuehrung(g, z.eigen)) + '</p>') +
          bauplan(e) +
          '<div class="c6w-t-v-knoepfe">' +
          (e.wz ? '<button class="c6w-knopf c6w-haupt" data-tu="wz">In einen Space stellen</button><button class="c6w-t-v-leise" data-tu="wzraus">Aus dem Teleskop nehmen</button>'
            : (z.anWand ? '<button class="c6w-knopf c6w-haupt" data-tu="los">Ausprobieren</button>'
              : '<button class="c6w-knopf c6w-haupt" data-tu="wand">Übernehmen</button>') +
            (z.eigen ? '<button class="c6w-t-v-leise" data-tu="raus">Aus dem Teleskop nehmen</button>' : '')) + '</div>';
        karte.hidden = false;
        // an den Stern legen: lieber darüber, sonst darunter; seitlich im Bild halten
        var bb = buehne.getBoundingClientRect(), r = b.getBoundingClientRect();
        var w = karte.offsetWidth, h = karte.offsetHeight, rand = 12, oben = 64, unten = parseFloat(getComputedStyle(buehne).getPropertyValue('--c6-unten')) || 0;
        var x = r.left - bb.left + r.width / 2 - w / 2, sy = r.top - bb.top;
        x = Math.max(rand, Math.min(bb.width - w - rand, x));
        var y = sy - h - 10, unter = false;
        if (y < oben) { y = sy + r.height + 8; unter = true; }
        y = Math.max(oben, Math.min(bb.height - unten - h - rand, y));
        // Regler und Nadel bleiben frei: sonst auf die andere Seite des Sterns
        var hin = hindernisse(bb), stoss = function (yy) { return hin.some(function (q) { return schneidet([x, yy, x + w, yy + h], q, 6); }); };
        if (stoss(y)) {
          var y2 = unter ? sy - h - 10 : sy + r.height + 8;
          if (!stoss(y2) && y2 >= oben && y2 + h <= bb.height - unten - rand) { y = y2; unter = !unter; }
          else { var x2 = hin.reduce(function (m, q) { return Math.min(m, q[0] - w - 8); }, x); if (x2 >= rand) x = x2; }
        }
        karte.style.left = Math.round(x) + 'px'; karte.style.top = Math.round(y) + 'px';
        karte.classList.toggle('c6w-unter', unter);
        requestAnimationFrame(function () { karte.classList.add('c6w-an'); });
        carlWach(); carlSchau(r.left + r.width / 2, r.top + 18, 2600);
      }
      function vorschauZu(sofort) {
        clearTimeout(vor.uhr);
        if (karte.hidden) { vor.id = null; vor.fest = false; return; }
        var weg = function () { karte.classList.remove('c6w-an'); vor.id = null; vor.fest = false; setTimeout(function () { if (!karte.classList.contains('c6w-an')) karte.hidden = true; }, C6.ruhig ? 0 : 180); };
        if (sofort) weg(); else vor.uhr = setTimeout(weg, 260);
      }
      karte.addEventListener('click', function (e) {
        var k = e.target.closest('[data-tu]'); if (!k || !vor.id) return;
        var id = vor.id;
        if (k.dataset.tu === 'raus') { vorschauZu(true); C6.geruest.insTeleskop(id, false); sterneBauen(); return; }
        if (k.dataset.tu === 'wzraus') { vorschauZu(true); try { C6.werkzeug.teilen(id.slice(3), false); } catch (e2) {} sterneBauen(); return; }
        if (k.dataset.tu === 'wz') {
          var w = C6.werkzeug && C6.werkzeug.hol ? C6.werkzeug.hol(id.slice(3)) : null; if (!w) return;
          var sp = []; try { sp = C6.space && C6.space.alle ? C6.space.alle() : []; } catch (e2) {}
          if (!sp.length) { if (C6.sag) C6.sag('Dafür brauchst du zuerst einen Space.'); return; }
          var neu = null;
          freigeben({ was: '„' + w.name + '“ in „' + sp[0].titel + '“ stellen', umkehrbar: true,
            rueckweg: { text: '„' + w.name + '“ steht jetzt in „' + sp[0].titel + '“.', knopf: 'Wegräumen', tun: function () { try { if (neu && neu.id) C6.werkzeug.entferne(neu.id); } catch (e4) {} } } }).then(function (ok) {
            if (!ok) return;
            var kopie = JSON.parse(JSON.stringify(w)); delete kopie.id; delete kopie.teleskop; kopie.ts = Date.now();
            try { neu = C6.werkzeug.haenge(kopie, sp[0].stringId); } catch (e3) { return; }
            vorschauZu(true);
          });
          return;
        }
        if (k.dataset.tu === 'wand') {
          // erst die Freigabe (umkehrbar: eine Wahl), dann trägt Carl es hinunter: ein Satz, eine Wahl zum Hingehen
          var g = C6.geruest.hol(id) || {};
          freigeben({ was: '„' + (g.name || 'Das Werkzeug') + '“ übernehmen', umkehrbar: true,
            rueckweg: { text: '„' + (g.name || 'Das Werkzeug') + '“ hängt an deiner Wand.', knopf: 'Abnehmen', tun: function () { try { C6.geruest.vonDerWand(id); } catch (e4) {} sterneBauen(); } } }).then(function (ok) {
            if (!ok) return;
            uebernimm(id, g);
          });
          return;
        }
        if (k.dataset.tu === 'los') { vorschauZu(true); C6.geruest.starte(id); }
      });
      function uebernimm(id, g) {
          C6.geruest.anDieWand(id); sterneBauen(); vorschauZu(true);
          try { carlCtl && !carl.schlaeft && carlCtl.stimmung('froh'); setTimeout(function () { try { carlCtl && !carl.schlaeft && carlCtl.stimmung('staunt'); } catch (e2) {} }, 1600); } catch (e2) {}
      }
      if (kannHover) {
        sterneEl.addEventListener('pointerover', function (e) {
          if (e.pointerType !== 'mouse') return;
          var b = e.target.closest('.c6w-stern'); if (!b || zieh) return;
          clearTimeout(vor.uhr);
          if (vor.id === b.dataset.id && !karte.hidden) return;
          vor.uhr = setTimeout(function () { if (!zieh) vorschau(b); }, vor.id ? 60 : 140);
        });
        sterneEl.addEventListener('pointerout', function (e) {
          if (e.pointerType !== 'mouse') return;
          var nach = e.relatedTarget;
          if (vor.fest || (nach && (karte.contains(nach) || (nach.closest && nach.closest('.c6w-stern'))))) return;
          vorschauZu(false);
        });
        karte.addEventListener('pointerenter', function () { clearTimeout(vor.uhr); });
        karte.addEventListener('pointerleave', function (e) { if (vor.fest) return; if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.c6w-stern')) return; vorschauZu(false); });
      }
      sterneEl.addEventListener('focusin', function (e) { var b = e.target.closest('.c6w-stern'); if (b && e.target.matches(':focus-visible')) vorschau(b); });
      buehne.addEventListener('pointerdown', function (e) { if (!karte.hidden && !karte.contains(e.target) && !e.target.closest('.c6w-stern')) vorschauZu(true); });
      var tipTyp = 'mouse';
      sterneEl.addEventListener('pointerdown', function (e) { tipTyp = e.pointerType || 'mouse'; });

      // Stern antippen oder anklicken: er leuchtet auf, Carl schaut hin, die Karte bleibt offen
      sterneEl.addEventListener('click', function (e) {
        var b = e.target.closest('.c6w-stern'); if (!b) return;
        b.classList.remove('c6w-t-leuchtet'); void b.offsetWidth; b.classList.add('c6w-t-leuchtet');
        setTimeout(function () { b.classList.remove('c6w-t-leuchtet'); }, 900);
        if (!(vor.id === b.dataset.id && !karte.hidden)) vorschau(b);
        vor.fest = true;
      });
      function zu() { blatt.classList.remove('c6w-an'); carlUmsetzen(); setTimeout(function () { if (!blatt.classList.contains('c6w-an')) blatt.hidden = true; }, 320); }
      buehne.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (!karte.hidden) { e.stopPropagation(); vorschauZu(true); } else if (!blatt.hidden) { e.stopPropagation(); zu(); }
      });

      if (C6.bus) {
        C6.bus.on('strings', function (d) { if (d && /teleskop|geruest|wand/.test(d.was)) sterneBauen(); });
        C6.bus.on('geraet', function () { if (carlCtl) { try { carlCtl.groesse(carlPx()); } catch (e) {} carlSetzen(); } });
        C6.bus.on('kleid', function (k) {
          try { if (carlCtl) carlCtl.kleid(k || (C6.laden && C6.laden.an())); } catch (e) {}
          if (carlCtl && carl.sitzt && aktiv) { var vorher = carl.gef; carlEinsteigen(); if (!carl.gef && vorher) { try { carlCtl.kleid({ gefaehrt: null }); } catch (e) {} } }
        });
        // Wartezeit: schaut sich um, lehnt sich zurück, nickt ein; wacht bei Berührung auf
        C6.bus.on('warte', function (ev) {
          if (!aktiv || C6.jetzt !== 'teleskop' || !carlCtl) return;
          var st = ev && ev.stufe;
          if (st === 1) { var s = sterneEl.children[Math.floor(hash(String(Date.now())) * sterneEl.children.length)]; if (s) { var r = s.getBoundingClientRect(); carlSchau(r.left + r.width / 2, r.top + 18, 3200); } }
          else if (st === 2) { carl.lehnt = true; clearTimeout(carl.blickBis); try { carlCtl.blick(0.35, -0.75); carlCtl.stimmung('ruhig'); } catch (e) {} carlSetzen(); }
          else if (st === 3) { carl.schlaeft = true; carl.lehnt = true; clearTimeout(carl.blickBis); try { if (typeof carlCtl.nick !== 'function') { carlCtl.stimmung('schlaeft'); carl.selbstSchlaf = true; } } catch (e) {} carlSetzen(); }
        });
        C6.bus.on('wach', function () { if (aktiv) carlWach(); });
      }
      var ro = window.ResizeObserver ? new ResizeObserver(function () { if (aktiv) groesse(); }) : null;
      if (ro) ro.observe(buehne);
      sterneBauen();

      return {
        betreten: function (o) {
          var erneut = aktiv, imRundgang = !!((o && o.rundgang) || (C6.rundgang && C6.rundgang.an));
          aktiv = true; buehne.classList.add('c6w-t-aktiv'); sterneBauen();
          if (!imRundgang) carlMalen();
          carlEl.hidden = imRundgang;
          groesse(); taktAn();
          try { C6.lichtquelle && C6.lichtquelle.setze && C6.lichtquelle.setze('teleskop', { x: 0.5, y: 0.42, art: 'mond', warm: 0.15, staerke: 0.5, hoehe: 0.6 }); } catch (e) {}
          if (!erneut && !imRundgang) carlAnkunft();
          setTimeout(function () { if (aktiv) groesse(); }, 480);
          // Carl erklärt das Teleskop einmal; danach spricht der Himmel für sich
          if (!imRundgang && C6.sag && !(C6.S.himmel && C6.S.himmel.teleskopErklaert)) setTimeout(function () {
            if (!aktiv) return;
            C6.sag((C6.stimme && C6.stimme.sag('teleskop')) || 'Das sind Gerüste zum Anschauen. Nimm mit, was dich anstößt.');
            try { C6.S.himmel = C6.S.himmel && typeof C6.S.himmel === 'object' ? C6.S.himmel : {}; C6.S.himmel.teleskopErklaert = Date.now(); if (C6.speichern) C6.speichern(); } catch (e) {}
          }, 500);
        },
        verlassen: function () {
          aktiv = false; buehne.classList.remove('c6w-t-aktiv'); taktAb(); zu(); vorschauZu(true);
          clearTimeout(carl.blickBis); carlAussteigen(); carlWach();
        },
        groesse: groesse
      };
    }
  });
})();
