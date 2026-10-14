// Himmel: du in der Mitte, deine Strings kreisen als Planeten um dich
(function () {
  var C6 = window.C6;
  if (!C6 || !C6.raum) return;
  var esc = function (t) { return C6.strings.esc(t); };

  var SYMBOL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="5"/><ellipse cx="12" cy="12" rx="10.5" ry="4" transform="rotate(-18 12 12)"/></svg>';

  // Nacht-Töne (dasselbe System im anderen Licht)
  var NACHT = { grund: '#141a33', tief: '#0b0f22', karte: '#1d2445', text: '#eef0ff', leise: '#aab2dc', linie: '#3a4370', licht: '#f0a830', rot: '#d62a26', rotHell: '#ff7a6e' };
  var MOND_FARBEN = ['#e9dcc4', '#cfd8c4', '#d8cfe6', '#e6cfc4', '#c9d9e6', '#e6e0c4'];

  function rgb(hex) { var n = parseInt(String(hex || '#8ea37a').slice(1), 16); return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]; }
  function mische(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
  function css(c, al) { return 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + (al == null ? 1 : al) + ')'; }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100000) / 100000; }
  // Fadenfarbe für die Nacht: heller, damit sie im Dunkeln trägt
  function nachtFarbe(hex) { var c = rgb(hex), m = (c[0] + c[1] + c[2]) / 3; c = [c[0] + (c[0] - m) * 0.45, c[1] + (c[1] - m) * 0.45, c[2] + (c[2] - m) * 0.45].map(function (x) { return Math.max(0, Math.min(1, x)); }); return mische(c, [1, 0.97, 0.92], 0.38); }

  // ——— Shader ———
  var VS = [
    'attribute vec2 aPos; attribute vec4 aC; attribute vec4 aCol; attribute vec4 aP; attribute vec3 aN;',
    'uniform vec2 uRes;',
    'varying vec2 vS; varying vec4 vC; varying vec4 vCol; varying vec4 vP; varying vec3 vN;',
    'void main(){ vS=aPos; vC=aC; vCol=aCol; vP=aP; vN=aN;',
    ' gl_Position=vec4(aPos.x/uRes.x*2.0-1.0, 1.0-aPos.y/uRes.y*2.0, 0.0, 1.0); }'
  ].join('\n');
  var FS = [
    'precision highp float;',
    'uniform vec2 uCen; uniform float uF; uniform vec3 uSun; uniform mat3 uInv; uniform float uT; uniform float uDpr;',
    'varying vec2 vS; varying vec4 vC; varying vec4 vCol; varying vec4 vP; varying vec3 vN;',
    'float hs(vec3 p){ p=fract(p*0.3183099+0.1); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }',
    'float rs(vec3 x){ vec3 i=floor(x); vec3 f=fract(x); f=f*f*(3.0-2.0*f);',
    ' return mix(mix(mix(hs(i),hs(i+vec3(1,0,0)),f.x),mix(hs(i+vec3(0,1,0)),hs(i+vec3(1,1,0)),f.x),f.y),',
    '  mix(mix(hs(i+vec3(0,0,1)),hs(i+vec3(1,0,1)),f.x),mix(hs(i+vec3(0,1,1)),hs(i+vec3(1,1,1)),f.x),f.y),f.z); }',
    'float fb(vec3 p){ float a=0.5; float s=0.0; for(int i=0;i<4;i++){ s+=a*rs(p); p*=2.03; a*=0.5; } return s; }',
    'void main(){',
    ' vec3 d=normalize(vec3((vS.x-uCen.x)/uF, -(vS.y-uCen.y)/uF, 1.0));',
    ' vec3 c=vC.xyz; float r=vC.w; float kind=vCol.w; vec3 base=vCol.rgb; float al=vP.w;',
    ' float px=c.z/uF;',
    ' if(kind>4.5 && kind<5.5){',
    '  float dn=dot(d,vN); if(abs(dn)<1e-4) discard;',
    '  float t=dot(c,vN)/dn; vec3 h=d*t; float q=length(h-c);',
    '  if(vP.x>0.0 && h.z>c.z) discard; if(vP.x<0.0 && h.z<c.z) discard;',
    '  float r1=r*1.38; float r2=r*1.92; float pp=t/uF;',
    '  float a=clamp((q-r1)/pp+0.5,0.0,1.0)*clamp((r2-q)/pp+0.5,0.0,1.0); if(a<=0.0) discard;',
    '  float s=(q-r1)/(r2-r1); float band=0.78+0.22*sin(s*26.0)+0.0;',
    '  float gap=smoothstep(0.52,0.56,s)*(1.0-smoothstep(0.60,0.64,s));',
    '  vec3 L=normalize(uSun-h); float li=0.55+0.45*max(dot(vN*sign(dot(vN,-d)),L),0.0);',
    '  vec3 col=base*band*li; a*=0.82*(1.0-gap*0.8)*al;',
    '  gl_FragColor=vec4(col*a,a); return; }',
    ' float b=dot(d,c); float cc=dot(c,c); float dist=sqrt(max(cc-b*b,0.0));',
    ' float edge=(r-dist)/px; float a=clamp(edge+0.5,0.0,1.0); if(a<=0.0) discard;',
    ' float t=b-sqrt(max(r*r-dist*dist,0.0)); vec3 h=d*t; vec3 n=normalize(h-c);',
    ' float mu=max(dot(n,-d),0.0);',
    ' vec3 nw=uInv*n; float sp=vP.x; vec3 lo=vec3(cos(sp)*nw.x-sin(sp)*nw.z, nw.y, sin(sp)*nw.x+cos(sp)*nw.z);',
    ' float seed=vP.y*37.0;',
    ' if(kind<0.5){',
    '  float g=fb(lo*5.0+vec3(seed,uT*0.05,0.0));',
    '  vec3 col=mix(vec3(1.0,0.985,0.93), vec3(0.97,0.70,0.26), pow(1.0-mu,1.6));',
    '  col*=0.92+0.16*g; col=mix(col, vec3(1.0,0.93,0.78), 0.25*(1.0-smoothstep(0.0,1.2,edge)));',
    '  gl_FragColor=vec4(col*a*al,a*al); return; }',
    ' vec3 L=normalize(uSun-h); float ndl=dot(n,L);',
    ' float lit=smoothstep(-0.14,0.42,ndl); float dif=max(ndl,0.0);',
    ' vec3 col=base;',
    ' if(kind>0.5 && kind<1.5){',
    '  float lat=lo.y; float w=fb(lo*2.2+seed); float v=sin(lat*10.0+w*3.0);',
    '  col*=0.86+0.14*smoothstep(-0.2,0.2,v);',
    '  float ln=1.0-smoothstep(0.0,0.06,abs(v)); col=mix(col,col*0.62,ln*0.55);',
    ' } else if(kind>1.5 && kind<2.5){',
    '  float f=fb(lo*3.4+seed); float fl=smoothstep(0.57,0.62,f);',
    '  col=mix(col*0.92, min(col*1.25+0.10,vec3(1.0)), fl);',
    ' } else if(kind>2.5 && kind<3.5){',
    '  float w=fb(lo*1.6+seed); col*=0.9+0.12*sin(lo.y*5.0+w*2.0);',
    ' } else if(kind>3.5 && kind<4.5){',
    '  float f=fb(lo*5.0+seed); col*=0.80+0.30*f;',
    '  float k=fb(lo*9.0+seed+3.0); col=mix(col,col*0.72,smoothstep(0.62,0.66,k)*0.8);',
    ' } else if(kind>5.5){',
    '  float ln=1.0-smoothstep(0.0,0.05,abs(sin(lo.y*7.0)));',
    '  float rim=1.0-smoothstep(0.9,2.0,edge);',
    '  float aa=(0.10+0.35*ln*mu+0.9*rim)*a*al;',
    '  vec3 cg=vec3(0.80,0.83,0.95);',
    '  gl_FragColor=vec4(cg*aa,aa); return; }',
    ' vec3 amb=vec3(0.10,0.12,0.24);',
    ' vec3 tag=col*(0.70+0.42*dif);',
    ' vec3 nacht=col*0.26+amb*0.5+col*amb*0.5;',
    ' col=mix(nacht,tag,lit);',
    ' float fres=pow(1.0-mu,2.4);',
    ' col+=vec3(0.55,0.60,0.86)*fres*0.22*(1.0-lit);',
    ' col+=vec3(1.0,0.90,0.74)*fres*0.22*lit;',
    ' if(vP.z>0.5){ col+=vec3(0.94,0.66,0.19)*pow(1.0-mu,1.8)*0.75; }',
    ' float ct=1.0-smoothstep(0.9,1.9,edge);',
    ' vec3 kc=mix(vec3(0.05,0.06,0.14), vec3(0.93,0.94,1.0), 0.18+0.32*lit);',
    ' col=mix(col,kc,ct*0.45);',
    ' gl_FragColor=vec4(col*a*al,a*al);',
    '}'
  ].join('\n');

  C6.raum({
    id: 'netz', name: 'Himmel', hoehe: 'vogel', licht: 'nacht', dock: false, symbol: SYMBOL,
    bauen: function (buehne) {
      buehne.classList.add('c6w-netz', 'c6w-himmel');
      buehne.innerHTML =
        '<canvas class="c6w-h-hinten" aria-hidden="true"></canvas>' +
        '<canvas class="c6w-h-gl" aria-hidden="true"></canvas>' +
        '<canvas class="c6w-h-vorn" role="img" aria-label="Dein Himmel. Du in der Mitte, deine Gedanken kreisen als Planeten um dich. Ziehen dreht, zwei Finger zoomen, Antippen fliegt hin."></canvas>' +
        '<div class="c6w-h-schatten" aria-hidden="true"></div><div class="c6w-h-licht" aria-hidden="true"></div>' +
        '<div class="c6w-h-couch" aria-hidden="true" hidden></div>' +
        '<div class="c6w-h-carl" aria-hidden="true"></div>' +
        '<div class="c6w-h-tauch" aria-hidden="true"></div>' +
        '<p class="c6w-stimme" aria-live="polite"></p>' +
        '<p class="c6w-wink"></p>' +
        '<button class="c6w-h-teleskop" type="button" aria-label="Teleskop: Gerüste anderer ansehen"><svg viewBox="0 0 48 48" aria-hidden="true"><g fill="none" stroke="#2b2722" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M9 25l26-12 4 9-26 12z" fill="#c9a46a"/><path d="M33 14l6-3 4 9-6 3z" fill="#e6c48c"/><path d="M6 27l4-2 3 7-4 2z" fill="#8f6f45"/><path d="M22 28l-6 15M24 27l8 16M23 28v15"/></g><circle cx="41" cy="15.5" r="1.4" fill="#fff"/></svg><span>Teleskop</span></button>' +
        '<ul class="c6w-h-liste" aria-label="Deine Planeten"></ul>' +
        '<div class="c6w-netz-unten">' +
        '<button class="c6w-knopf c6w-h-mitte" data-tu="mitte" hidden><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="currentColor"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>Zu dir</button>' +
        '<button class="c6w-knopf c6w-haupt" data-tu="neu"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="13" r="6" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M18 3v6M15 6h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>Neuer Planet</button></div>' +
        '<div class="c6w-blatt" role="dialog" aria-modal="false" hidden></div>';

      var hinten = buehne.querySelector('.c6w-h-hinten'), hx = hinten.getContext('2d');
      var glc = buehne.querySelector('.c6w-h-gl');
      var vorn = buehne.querySelector('.c6w-h-vorn'), vx = vorn.getContext('2d');
      var carlEl = buehne.querySelector('.c6w-h-carl'), couchEl = buehne.querySelector('.c6w-h-couch');
      var schattenEl = buehne.querySelector('.c6w-h-schatten'), lichtEl = buehne.querySelector('.c6w-h-licht');
      var schattenPos = '', lichtPos = '';
      var tauchEl = buehne.querySelector('.c6w-h-tauch');
      var stimmeEl = buehne.querySelector('.c6w-stimme');
      var winkEl = buehne.querySelector('.c6w-wink');
      var listeEl = buehne.querySelector('.c6w-h-liste');
      var blatt = buehne.querySelector('.c6w-blatt');
      var mitteKnopf = buehne.querySelector('[data-tu="mitte"]');

      var W = 1, H = 1, DPR = 1, F = 600, CX = 0, CY = 0;
      var aktiv = false, raf = 0, tLetzt = 0, tRaf = 0, tCarl = 0, zeit = 0, takt = 16;
      var imRundgang = false;
      var stimmeTimer = 0;
      var taktAus = null, taktWecke = null;

      // Kamera: kreist um ein Ziel (anfangs: du)
      var cam = { yaw: -0.6, pitch: 0.8, dist: 16, tx: 0, ty: 0, tz: 0 };
      var soll = { yaw: -0.6, pitch: 0.8, dist: 16, tx: 0, ty: 0, tz: 0 };
      var folge = null, tauchen = null, tauchFeder = null, schwung = 0, ueberblick = true, ausSpace = false;
      var drehung = 0;
      var neuWachsen = {};
      var E = { r: [1, 0, 0], u: [0, 1, 0], f: [0, 0, 1], eye: [0, 0, 16] };

      // ——— Welt ———
      var K = 1.65, RSONNE = 0.95;
      function r0() { return C6.geraet === 'computer' ? 2.6 : 3.1; }   // kein Planet berührt die Sonne, „Du“ bleibt frei
      var welt = { planeten: [], knoten: [], nadeln: [], sterne: [], geist: null };
      var sterne = [];
      (function () {
        for (var i = 0; i < 320; i++) {
          var u = hash('su' + i) * 2 - 1, a = hash('sa' + i) * Math.PI * 2, s = Math.sqrt(1 - u * u);
          // etwa ein Drittel funkelt (im Bild sind das 3 bis 8), langsam und mit eigenem Versatz; der Rest steht still
          var fk = hash('sf' + i) < 0.34 ? { per: 3.2 + hash('sq' + i) * 2.3, ph: hash('sp' + i) * 6.28 } : null;
          sterne.push({ d: [s * Math.cos(a), u, s * Math.sin(a)], g: 0.5 + hash('sg' + i) * 1.3, p: hash('sp' + i) * 6.28, w: hash('sw' + i), fk: fk });
        }
      })();

      // am Handy sind die Kugeln größer, damit sie im schmalen Bild tragen
      function fak() { return C6.geraet === 'computer' ? 1.08 : 1.28; }
      function planetRadius(p) { return 0.78 + 0.42 * p.groesse; }
      function spiralPunkt(theta, rot) {
        var R = r0() + K * theta / (Math.PI * 2);
        var a = theta + rot;
        return [R * Math.cos(a), 0, R * Math.sin(a)];
      }
      function planetTheta(i) { return Math.PI * 2 * (i + 0.18 + 0.64 * ((i * 0.618 + 0.31) % 1)); }

      function lesen() {
        var pl = C6.strings.planeten();
        var kat = (C6.space && C6.space.places) || {};
        welt.planeten = pl.map(function (p, i) {
          var c = nachtFarbe(p.farbe);
          return {
            d: p, id: p.id, i: i, r: planetRadius(p), farbe: c, theta: planetTheta(i), pos: [0, 0, 0],
            kind: p.art === 'idee' ? 2 : p.art === 'gewohnheit' ? 3 : 1,
            seed: hash(p.id), spin: hash(p.id + 's') * 6.28, marken: marken(p.id, C6.strings.hol(p.id)),
            monde: p.monde.map(function (m, j) {
              var k = kat[m] || {};
              var kf = k.farbe || (/^#[0-9a-f]{6}$/i.test(k.grund || '') ? k.grund : '');
              var f = kf ? mische(rgb(kf), [0.95, 0.93, 0.88], 0.25) : rgb(MOND_FARBEN[Math.floor(hash(m) * MOND_FARBEN.length)]);
              return { id: m, name: k.name || k.titel || m.charAt(0).toUpperCase() + m.slice(1), farbe: f, j: j, pos: [0, 0, 0], r: 0.19 + 0.05 * ((j + 1) % 2), ph: hash(m + p.id) * 6.28 };
            })
          };
        });
        welt.knoten = C6.strings.knotenAlle().map(function (k) { return { k: k }; });
        welt.nadeln = C6.strings.nadelnAlle().map(function (n, i) { return { n: n, i: i, h: hash(n.ts + 'n' + i), pos: [0, 0, 0] }; });
        listeBauen();
      }
      function hol(id) { for (var i = 0; i < welt.planeten.length; i++) if (welt.planeten[i].id === id) return welt.planeten[i]; return null; }

      function bewegen(dt) {
        var n = welt.planeten.length;
        welt.planeten.forEach(function (p) {
          p.r = planetRadius(p.d) * fak();
          p.pos = spiralPunkt(p.theta, drehung);
          p.pos[1] = Math.sin(zeit * 0.35 + p.seed * 6.28) * 0.06;
          if (!C6.ruhig) p.spin += dt * (0.12 + p.seed * 0.1);
          p.monde.forEach(function (m) {
            var rr = p.r * (p.kind === 3 ? 2.25 : 1.55) + m.j * 0.4;
            var w = m.ph + zeit * (0.5 / (1 + m.j * 0.35)) * (C6.ruhig ? 0 : 1);
            var x = Math.cos(w) * rr, z = Math.sin(w) * rr, y = Math.sin(w) * rr * 0.28;
            m.pos = [p.pos[0] + x, p.pos[1] + y, p.pos[2] + z];
            m.r = (0.19 + 0.05 * ((m.j + 1) % 2)) * fak();
          });
        });
        welt.nadeln.forEach(function (nd, k) {
          var p = nd.n.stringId && hol(nd.n.stringId);
          var sch = C6.ruhig ? 0 : Math.sin(zeit * 0.6 + nd.h * 6) * 0.08;
          if (p) {
            var vor = welt.nadeln.slice(0, k).filter(function (x) { return x.n.stringId === nd.n.stringId; }).length;
            var aus = Math.atan2(p.pos[2], p.pos[0]) + (nd.h - 0.5) * 0.9 + vor * 0.7;
            var ab = p.r + 0.75 + vor * 0.45;
            nd.pos = [p.pos[0] + Math.cos(aus) * ab, p.pos[1] + p.r * 0.9 + 0.45 + sch, p.pos[2] + Math.sin(aus) * ab];
          } else {
            var b = nd.h * 6.28 + drehung * 0.5, rr = 1.2 + nd.h * 2.4;
            nd.pos = [Math.cos(b) * rr, 2.4 + nd.h * 1.6 + sch, Math.sin(b) * rr];
          }
        });
        // der nächste Platz auf dem Faden: hier geht der nächste Planet auf
        var th = planetTheta(n);
        welt.geist = { pos: spiralPunkt(th, drehung), r: 0.62 * fak() * (C6.ruhig ? 1 : 1 + 0.05 * Math.sin(zeit * 1.7)), theta: th };
        welt.geist.pos[1] = 0;
      }

      // ——— Kamera ———
      function augen() {
        var cp = Math.cos(cam.pitch), sp = Math.sin(cam.pitch);
        var eye = [cam.tx + cam.dist * cp * Math.sin(cam.yaw), cam.ty + cam.dist * sp, cam.tz + cam.dist * cp * Math.cos(cam.yaw)];
        var f = norm([cam.tx - eye[0], cam.ty - eye[1], cam.tz - eye[2]]);
        var r = norm(kreuz(f, [0, 1, 0]));
        var u = kreuz(r, f);
        E = { r: r, u: u, f: f, eye: eye };
      }
      function norm(v) { var l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
      function kreuz(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
      function ansicht(p) {
        var v = [p[0] - E.eye[0], p[1] - E.eye[1], p[2] - E.eye[2]];
        return [v[0] * E.r[0] + v[1] * E.r[1] + v[2] * E.r[2], v[0] * E.u[0] + v[1] * E.u[1] + v[2] * E.u[2], v[0] * E.f[0] + v[1] * E.f[1] + v[2] * E.f[2]];
      }
      function schirm(v) { var z = Math.max(0.05, v[2]); return [CX + v[0] * F / z, CY - v[1] * F / z, z]; }
      function proj(p) { return schirm(ansicht(p)); }

      function oben() { return C6.geraet === 'computer' ? 90 : 120; }
      function unten() { var u = parseFloat(getComputedStyle(buehne).getPropertyValue('--c6-unten')) || 0; return u + 80; }
      function rahmen() {
        var hav = Math.max(200, H - oben() - unten());
        CX = W / 2; CY = oben() + hav / 2;
        F = Math.min((W / 2) / Math.tan(0.52), (hav / 2) / Math.tan(0.40));
        return hav;
      }
      function uebersicht(sofort) {
        var hav = rahmen();
        var n = welt.planeten.length;
        var Rmax = Math.max(n ? 0 : 6.2, r0() + K * (n + 0.82) + 0.6);
        var a = hav / W;
        var pitch = a > 1.2 ? 1.12 : a > 0.8 ? 0.8 : 0.6;
        var sp = Math.sin(pitch);
        var dist = Math.max(F * Rmax / (W * 0.5), F * Rmax * (sp + 0.1) / (hav * 0.48)) + Rmax * 0.05;
        dist = Math.max(6, dist);
        soll.pitch = pitch; soll.dist = dist; soll.tx = 0; soll.ty = 0; soll.tz = 0;
        folge = null; ueberblick = true;
        if (sofort || C6.ruhig) { cam.pitch = pitch; cam.dist = dist; cam.tx = cam.ty = cam.tz = 0; }
        mitteZeigen();
      }
      function mitteZeigen() { mitteKnopf.hidden = (ueberblick && !folge) || !!feier; }

      // ——— Malen ———
      var gl = null, prog = null, buf = null, loc = {}, glOk = false;
      function glAn() {
        try {
          gl = glc.getContext('webgl', { alpha: true, antialias: false, premultipliedAlpha: true }) || glc.getContext('experimental-webgl');
          if (!gl) return false;
          function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
          prog = gl.createProgram();
          gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
          gl.linkProgram(prog);
          if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error('link');
          gl.useProgram(prog);
          ['aPos', 'aC', 'aCol', 'aP', 'aN'].forEach(function (a) { loc[a] = gl.getAttribLocation(prog, a); });
          ['uRes', 'uCen', 'uF', 'uSun', 'uInv', 'uT', 'uDpr'].forEach(function (u) { loc[u] = gl.getUniformLocation(prog, u); });
          buf = gl.createBuffer();
          gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
          glc.addEventListener('webglcontextlost', function (e) { e.preventDefault(); glOk = false; buehne.classList.add('c6w-h-flach'); });
          return true;
        } catch (e) { gl = null; return false; }
      }

      var dinge = []; // Treffer des letzten Bildes
      var kugeln = []; // {kind, c:viewpos, r, farbe, spin, seed, sel, al, s:[x,y,R], id, ...}

      function kugel(o) {
        var v = ansicht(o.p);
        if (!(o.r > 0) || v[2] < o.r * 1.2 + 0.05) return null;
        var s = schirm(v);
        var R = F * o.r / Math.sqrt(Math.max(1e-4, v[2] * v[2] - o.r * o.r));
        o.v = v; o.s = s; o.R = R;
        kugeln.push(o);
        return o;
      }

      function zeichne(now, dt) {
        if (!W) return;
        augen();
        kugeln = []; dinge = [];
        var sel = folge;
        // Sonne (du)
        kugel({ kind: 0, p: [0, 0, 0], r: (RSONNE * fak()), farbe: [1, 0.9, 0.6], spin: 0, seed: 0.3, al: 1, id: '__du' });
        welt.planeten.forEach(function (p) {
          var g = neuWachsen[p.id], al = 1, sk = 1;
          if (g != null) { var k = Math.min(1, (performance.now() - g) / 1400); if (k >= 1) delete neuWachsen[p.id]; k = Math.max(0, k); sk = 1 - Math.pow(1 - k, 3); al = Math.min(1, k * 2); }
          var o = kugel({ kind: p.kind, p: p.pos, r: p.r * sk, farbe: p.farbe, spin: p.spin, seed: p.seed, sel: p.id === sel, al: al, id: p.id, pl: p });
          if (o && p.kind === 3) {
            o.ring = true;
            kugeln.push({ kind: 5, p: p.pos, r: p.r * sk, v: o.v, s: o.s, R: o.R * 1.95, farbe: mische(p.farbe, [0.93, 0.94, 1], 0.25), half: 1, al: al, ringFuer: p.id });
            kugeln.push({ kind: 5, p: p.pos, r: p.r * sk, v: o.v, s: o.s, R: o.R * 1.95, farbe: mische(p.farbe, [0.93, 0.94, 1], 0.25), half: -1, al: al, ringFuer: p.id });
          }
          p.monde.forEach(function (m) { kugel({ kind: 4, p: m.pos, r: m.r, farbe: m.farbe, spin: zeit * 0.1, seed: hash(m.id), al: al, id: p.id, mond: m, pl: p }); });
        });
        if (welt.geist && !imRundgang) kugel({ kind: 6, p: welt.geist.pos, r: welt.geist.r, farbe: [0.8, 0.83, 0.95], spin: drehung, seed: 0.5, al: welt.planeten.length ? 0.75 : 1, id: '__neu' });
        // Reihenfolge: hinten zuerst
        kugeln.sort(function (a, b) {
          var za = a.v[2] + (a.kind === 5 ? a.half * 1e-3 * -1 : 0), zb = b.v[2] + (b.kind === 5 ? b.half * 1e-3 * -1 : 0);
          return zb - za;
        });
        malHinten();
        if (glOk) malGL(); else malFlach();
        malVorn();
        carlSetzen(now || performance.now(), dt);
        listeSetzen();
      }

      function malHinten() {
        var c = hx;
        c.setTransform(DPR, 0, 0, DPR, 0, 0);
        c.globalCompositeOperation = 'source-over';
        // Grund: oben tiefer (Richtung Teleskop), um dich ein warmer Schein
        c.clearRect(0, 0, W, H);
        var du = proj([0, 0, 0]);
        var rs = Math.max(W, H) * 0.55;
        c.drawImage(schein(), du[0] - rs, du[1] - rs, rs * 2, rs * 2);
        // Sterne: nur Richtung, kein Ort (sie liegen unendlich weit)
        c.fillStyle = '#fffbe8';
        for (var i = 0; i < sterne.length; i++) {
          var s = sterne[i], d = s.d;
          var z = d[0] * E.f[0] + d[1] * E.f[1] + d[2] * E.f[2];
          if (z < 0.08) continue;
          var x = CX + (d[0] * E.r[0] + d[1] * E.r[1] + d[2] * E.r[2]) * F / z;
          var y = CY - (d[0] * E.u[0] + d[1] * E.u[1] + d[2] * E.u[2]) * F / z;
          if (x < -4 || y < -4 || x > W + 4 || y > H + 4) continue;
          var fl = (s.fk && !C6.ruhig) ? 0.5 + 0.5 * Math.sin(zeit * 6.2832 / s.fk.per + s.fk.ph) : 0.8;
          c.globalAlpha = 0.25 + 0.5 * fl * s.w;
          var gg = s.g * (s.w > 0.92 ? 1.6 : 1);
          c.fillRect(x - gg / 2, y - gg / 2, gg, gg);
        }
        c.globalAlpha = 1;
        schnuppeMalen(c, performance.now());
        // Hof um dich: er atmet sehr langsam (eine Periode in sieben Sekunden)
        var atem = C6.ruhig ? 0.5 : 0.5 + 0.5 * Math.sin(zeit * 6.2832 / 7);
        var sh = proj([0, 0, 0]), sr = F * (RSONNE * fak()) / Math.max(0.1, sh[2]);
        var hofR = sr * (4.0 + 0.4 * atem);
        var hof = c.createRadialGradient(sh[0], sh[1], sr * 0.6, sh[0], sh[1], hofR);
        hof.addColorStop(0, 'rgba(255,214,140,' + (0.5 + 0.1 * atem).toFixed(3) + ')'); hof.addColorStop(0.3, 'rgba(240,168,48,' + (0.16 + 0.05 * atem).toFixed(3) + ')'); hof.addColorStop(1, 'rgba(240,168,48,0)');
        c.fillStyle = hof; c.beginPath(); c.arc(sh[0], sh[1], hofR, 0, 6.29); c.fill();
        // Bahn: ein Faden, der um dich kreist; jeder String beginnt am Ende des vorigen
        fadenMalen(c);
        // Sternbilder: der rote Faden von Planet zu Planet (beim Entstehen zeichnet er sich)
        welt.knoten.forEach(function (kk) {
          var a = hol(kk.k.a), b = hol(kk.k.b); if (!a || !b) { kk.s = null; return; }
          var pts = bogen(a.pos, b.pos), neu = feier && feier.ts === kk.k.ts;
          var bis = neu ? Math.min(1, (performance.now() - feier.t0 - 500) / 1500) : 1;
          var ok = true, sp = [];
          pts.forEach(function (q) { var s = proj(q); if (s[2] < 0.2) ok = false; sp.push(s); });
          kk.s = ok ? sp[12] : null; kk.mitte = pts[12];
          if (!ok || bis <= 0) return;
          var e = bis < 1 ? 1 - Math.pow(1 - bis, 2) : 1, n = e * (sp.length - 1), ganz = Math.floor(n);
          var weg = function () {
            c.beginPath(); c.moveTo(sp[0][0], sp[0][1]);
            for (var j = 1; j <= ganz; j++) c.lineTo(sp[j][0], sp[j][1]);
            if (ganz < sp.length - 1) { var f = n - ganz, q0 = sp[ganz], q1 = sp[ganz + 1]; c.lineTo(q0[0] + (q1[0] - q0[0]) * f, q0[1] + (q1[1] - q0[1]) * f); }
          };
          c.lineCap = 'round'; c.lineJoin = 'round';
          c.lineWidth = neu ? 12 : 7; c.strokeStyle = 'rgba(255,90,70,' + (neu ? 0.2 : 0.12) + ')'; weg(); c.stroke();
          c.lineWidth = neu ? 3.2 : 2.2; c.strokeStyle = neu ? 'rgba(255,122,110,0.98)' : 'rgba(232,74,62,0.85)'; weg(); c.stroke();
          if (neu && bis < 1) { var kopf = sp[Math.min(sp.length - 1, ganz + 1)]; stern4(c, kopf[0], kopf[1], 7, 'rgba(255,214,200,0.95)', '#ffffff'); }
        });
        // Halos: ausgewählter Planet, rote Sterne
        if (feier) welt.planeten.forEach(function (p) {
          if (p.id !== feier.a && p.id !== feier.b) return;
          var t = (performance.now() - feier.t0) / 1000, an = Math.min(1, Math.max(0, (t - 1.3) / 0.8)) * (t > 6 ? Math.max(0, 1 - (t - 6) / 1.2) : 1);
          if (an <= 0) return;
          var s = proj(p.pos), R = F * p.r / s[2], hell = mische(p.farbe, [1, 0.95, 0.85], 0.5);
          var hg = c.createRadialGradient(s[0], s[1], R * 0.95, s[0], s[1], R * 2.6);
          hg.addColorStop(0, css(hell, 0.42 * an)); hg.addColorStop(1, css(hell, 0));
          c.fillStyle = hg; c.beginPath(); c.arc(s[0], s[1], R * 2.6, 0, 6.29); c.fill();
        });
        welt.planeten.forEach(function (p) {
          if (p.id !== folge) return;
          var s = proj(p.pos), R = F * p.r / s[2];
          var hg = c.createRadialGradient(s[0], s[1], R * 0.9, s[0], s[1], R * 3);
          hg.addColorStop(0, 'rgba(240,168,48,0.35)'); hg.addColorStop(1, 'rgba(240,168,48,0)');
          c.fillStyle = hg; c.beginPath(); c.arc(s[0], s[1], R * 3, 0, 6.29); c.fill();
        });
        pulsMalen(c);
        welt.nadeln.forEach(function (nd) {
          if (nd.n.stringId && !zeigbar(nd.n.stringId, nd.n.ts)) return;
          var s = proj(nd.pos); if (s[2] < 0.2) return;
          var R = Math.max(10, Math.min(34, 70 / s[2] * 3));
          var hg = c.createRadialGradient(s[0], s[1], 0, s[0], s[1], R);
          hg.addColorStop(0, 'rgba(214,42,38,0.55)'); hg.addColorStop(1, 'rgba(214,42,38,0)');
          c.fillStyle = hg; c.beginPath(); c.arc(s[0], s[1], R, 0, 6.29); c.fill();
        });
      }

      // warmer Schein um dich: einmal gemalt, dann nur gesetzt
      var scheinBild = null;
      function schein() {
        if (scheinBild) return scheinBild;
        var cv = document.createElement('canvas'); cv.width = cv.height = 256;
        var c = cv.getContext('2d'), gw = c.createRadialGradient(128, 128, 0, 128, 128, 128);
        gw.addColorStop(0, 'rgba(240,168,48,0.16)'); gw.addColorStop(0.35, 'rgba(240,168,48,0.05)'); gw.addColorStop(1, 'rgba(240,168,48,0)');
        c.fillStyle = gw; c.fillRect(0, 0, 256, 256);
        return (scheinBild = cv);
      }

      function bogen(a, b) {
        var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
        var l = Math.hypot(b[0] - a[0], b[2] - a[2]);
        var c = [m[0], m[1] + 1.2 + l * 0.5, m[2]];
        var out = [];
        for (var i = 0; i <= 24; i++) {
          var t = i / 24, u = 1 - t;
          out.push([u * u * a[0] + 2 * u * t * c[0] + t * t * b[0], u * u * a[1] + 2 * u * t * c[1] + t * t * b[1], u * u * a[2] + 2 * u * t * c[2] + t * t * b[2]]);
        }
        return out;
      }

      function fadenMalen(c) {
        var n = welt.planeten.length;
        c.lineCap = 'butt'; c.lineJoin = 'round';
        var schritte = 96;
        for (var i = 0; i <= n; i++) {
          var leer = i === n;
          if (leer && imRundgang) break;
          var farbe = leer ? [0.67, 0.70, 0.86] : welt.planeten[i].farbe;
          var bis = 1;
          if (!leer && neuWachsen[welt.planeten[i].id] != null) bis = Math.max(0, Math.min(1, (performance.now() - neuWachsen[welt.planeten[i].id]) / 1400));
          var t0 = i * Math.PI * 2, t1 = t0 + Math.PI * 2 * (leer ? 0.75 : 1) * bis;
          if (!leer && i === 0) t0 = 0;
          var vor = null;
          for (var k = 0; k <= schritte; k++) {
            var th = t0 + (t1 - t0) * k / schritte;
            var s = proj(spiralPunkt(th, drehung));
            if (vor && s[2] > 0.2 && vor[2] > 0.2) {
              var w = Math.max(0.6, Math.min(3.2, 26 / s[2]));
              var al = leer ? 0.22 * (1 - k / schritte) : 0.62;
              c.strokeStyle = css(farbe, al); c.lineWidth = leer ? Math.max(0.6, w * 0.6) : w;
              c.beginPath(); c.moveTo(vor[0], vor[1]); c.lineTo(s[0], s[1]); c.stroke();
            }
            vor = s;
          }
          // Perlen auf dem Faden: was unten festgehalten wurde, reiht sich vor dem Planeten auf
          if (!leer && bis >= 1) perlenMalen(c, welt.planeten[i], t0);
          // Bindestelle: Anfang an das Ende des vorigen
          if (i > 0 && !leer) {
            var b = proj(spiralPunkt(t0, drehung));
            if (b[2] > 0.2) { c.fillStyle = css(farbe, 0.9); c.beginPath(); c.arc(b[0], b[1], Math.max(1.6, Math.min(3.5, 30 / b[2])), 0, 6.29); c.fill(); }
          }
        }
      }

      function perlenMalen(c, p, t0) {
        var m = p.marken; if (!m || !m.perlen.length) return;
        var hell = mische(p.farbe, [1, 0.97, 0.92], 0.35), j = 0;
        for (var i = m.perlen.length - 1; i >= 0; i--) {
          if (!zeigbar(p.id, m.perlen[i])) continue;
          var th = p.theta - 0.34 - j * 0.15; j++;
          if (th < t0 + 0.05) break;
          var s = proj(spiralPunkt(th, drehung)); if (s[2] < 0.2) continue;
          var r = Math.max(2, Math.min(4.6, 38 / s[2]));
          c.fillStyle = css(hell, 0.95); c.beginPath(); c.arc(s[0], s[1], r, 0, 6.29); c.fill();
          c.strokeStyle = 'rgba(11,15,34,0.7)'; c.lineWidth = 1; c.stroke();
        }
      }

      // WebGL: jede Kugel ein Viereck auf dem Schirm, der Shader rechnet die Kugel genau
      var daten = new Float32Array(17 * 6 * 64);
      function malGL() {
        var n = kugeln.length;
        if (daten.length < n * 6 * 17) daten = new Float32Array(n * 6 * 17 * 2);
        var o = 0;
        var ecken = [[-1, -1], [1, -1], [1, 1], [-1, -1], [1, 1], [-1, 1]];
        kugeln.forEach(function (k) {
          var R = k.R * 1.12 + 2, ringN = [0, 1, 0];
          if (k.kind === 5) {
            var tilt = 0.42, nw = [Math.sin(tilt) * 0.6, Math.cos(tilt), Math.sin(tilt) * 0.8];
            nw = norm(nw);
            ringN = [nw[0] * E.r[0] + nw[1] * E.r[1] + nw[2] * E.r[2], nw[0] * E.u[0] + nw[1] * E.u[1] + nw[2] * E.u[2], nw[0] * E.f[0] + nw[1] * E.f[1] + nw[2] * E.f[2]];
          }
          for (var e = 0; e < 6; e++) {
            daten[o++] = k.s[0] + ecken[e][0] * R; daten[o++] = k.s[1] + ecken[e][1] * R;
            daten[o++] = k.v[0]; daten[o++] = k.v[1]; daten[o++] = k.v[2]; daten[o++] = k.r;
            daten[o++] = k.farbe[0]; daten[o++] = k.farbe[1]; daten[o++] = k.farbe[2]; daten[o++] = k.kind;
            daten[o++] = k.kind === 5 ? k.half : (k.spin || 0); daten[o++] = k.seed || 0; daten[o++] = k.sel ? 1 : 0; daten[o++] = k.al == null ? 1 : k.al;
            daten[o++] = ringN[0]; daten[o++] = ringN[1]; daten[o++] = ringN[2];
          }
        });
        gl.viewport(0, 0, glc.width, glc.height);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        if (!n) return;
        gl.useProgram(prog);
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, daten.subarray(0, o), gl.DYNAMIC_DRAW);
        var st = 17 * 4;
        [['aPos', 2, 0], ['aC', 4, 2], ['aCol', 4, 6], ['aP', 4, 10], ['aN', 3, 14]].forEach(function (a) {
          gl.enableVertexAttribArray(loc[a[0]]);
          gl.vertexAttribPointer(loc[a[0]], a[1], gl.FLOAT, false, st, a[2] * 4);
        });
        var sun = ansicht([0, 0, 0]);
        gl.uniform2f(loc.uRes, W, H);
        gl.uniform2f(loc.uCen, CX, CY);
        gl.uniform1f(loc.uF, F);
        gl.uniform3f(loc.uSun, sun[0], sun[1], sun[2]);
        gl.uniformMatrix3fv(loc.uInv, false, new Float32Array([E.r[0], E.r[1], E.r[2], E.u[0], E.u[1], E.u[2], E.f[0], E.f[1], E.f[2]]));
        gl.uniform1f(loc.uT, zeit);
        gl.uniform1f(loc.uDpr, DPR);
        gl.drawArrays(gl.TRIANGLES, 0, o / 17);
      }

      // Ohne WebGL: dieselben Kugeln, flach gemalt (Licht kommt von dir)
      function malFlach() {
        var c = hx, du = proj([0, 0, 0]);
        kugeln.forEach(function (k) {
          var x = k.s[0], y = k.s[1], R = k.R;
          if (!isFinite(x + y + R) || R <= 0) return;
          c.globalAlpha = k.al == null ? 1 : k.al;
          if (k.kind === 5) {
            if (k.half < 0) return;
            c.strokeStyle = css(k.farbe, 0.8); c.lineWidth = Math.max(1.5, R * 0.12);
            c.beginPath(); c.ellipse(x, y, R * 0.85, R * 0.24, -0.25, 0, 6.29); c.stroke();
            c.globalAlpha = 1; return;
          }
          if (k.kind === 6) {
            c.strokeStyle = 'rgba(204,212,242,0.8)'; c.lineWidth = 1.6;
            c.beginPath(); c.arc(x, y, R, 0, 6.29); c.stroke(); c.globalAlpha = 1; return;
          }
          var dx = du[0] - x, dy = du[1] - y, dl = Math.hypot(dx, dy) || 1;
          var lx = k.kind === 0 ? x : x + dx / dl * R * 0.45, ly = k.kind === 0 ? y : y + dy / dl * R * 0.45;
          var g = c.createRadialGradient(lx, ly, R * 0.1, x, y, R);
          if (k.kind === 0) { g.addColorStop(0, '#fffaf0'); g.addColorStop(1, '#f0a830'); }
          else { g.addColorStop(0, css(mische(k.farbe, [1, 1, 1], 0.15))); g.addColorStop(0.55, css(k.farbe)); g.addColorStop(1, css(mische(k.farbe, [0.08, 0.1, 0.2], 0.7))); }
          c.fillStyle = g; c.beginPath(); c.arc(x, y, R, 0, 6.29); c.fill();
          if (k.sel) { c.strokeStyle = 'rgba(240,168,48,0.9)'; c.lineWidth = 2; c.stroke(); }
          c.globalAlpha = 1;
        });
      }

      function verdeckt(s) {
        for (var i = 0; i < kugeln.length; i++) {
          var k = kugeln[i]; if (k.kind === 5 || k.kind === 6) continue;
          if (k.v[2] < s[2] && Math.hypot(k.s[0] - s[0], k.s[1] - s[1]) < k.R * 0.95) return true;
        }
        return false;
      }

      function stern4(c, x, y, R, farbe, kern) {
        c.fillStyle = farbe;
        c.beginPath();
        c.moveTo(x, y - R); c.quadraticCurveTo(x, y, x + R, y); c.quadraticCurveTo(x, y, x, y + R); c.quadraticCurveTo(x, y, x - R, y); c.quadraticCurveTo(x, y, x, y - R);
        c.fill();
        c.fillStyle = kern; c.beginPath(); c.arc(x, y, R * 0.24, 0, 6.29); c.fill();
      }

      function umbruch(t, n) {
        var w = String(t || '').split(/\s+/), z = [], l = '';
        var zeilen = Math.ceil(String(t || '').length / n); n = Math.ceil(String(t || '').length / Math.max(1, zeilen)) + 2;   // gleich lange Zeilen
        w.forEach(function (x) { if ((l + ' ' + x).trim().length > n && l) { z.push(l); l = x; } else l = (l + ' ' + x).trim(); });
        if (l) z.push(l);
        if (z.length > 3) { z = z.slice(0, 3); z[2] = kuerze(z[2], n); }
        return z;
      }
      function kuerze(t, n) { t = String(t || ''); return t.length > n ? t.slice(0, n - 1).trim() + '…' : t; }

      function malVorn() {
        var c = vx;
        c.setTransform(DPR, 0, 0, DPR, 0, 0);
        c.clearRect(0, 0, W, H);
        // Knoten-Sterne
        welt.knoten.forEach(function (kk) {
          if (!kk.s || verdeckt(kk.s)) return;
          var R = Math.max(6, Math.min(12, 40 / kk.s[2] * 2));
          stern4(c, kk.s[0], kk.s[1], R, 'rgba(238,240,255,0.95)', '#ffffff');
          dinge.push({ art: 'knoten', k: kk.k, x: kk.s[0], y: kk.s[1], R: 22, z: kk.s[2] });
        });
        // Rote Nadeln: helle rote Sterne
        kranzMalen(c);
        welt.nadeln.forEach(function (nd) {
          if (nd.n.stringId && !zeigbar(nd.n.stringId, nd.n.ts)) return;
          var s = proj(nd.pos); if (s[2] < 0.2 || verdeckt(s)) return;
          var fl = C6.ruhig ? 1 : 0.85 + 0.15 * Math.sin(zeit * 2.2 + nd.h * 9);
          var R = Math.max(9, Math.min(16, 46 / s[2] * 2)) * fl;
          stern4(c, s[0], s[1], R * 1.5, NACHT.rotHell, '#fff3f0');
          stern4(c, s[0], s[1], R, '#ff4a3d', '#fff3f0');
          dinge.push({ art: 'nadel', n: nd.n, x: s[0], y: s[1], R: 24, z: s[2] });
        });
        // Beschriftungen
        c.textAlign = 'center'; c.textBaseline = 'middle'; c.lineJoin = 'round';
        var belegt = [];
        function frei(r) { for (var i = 0; i < belegt.length; i++) { var b = belegt[i]; if (r[0] < b[2] && r[2] > b[0] && r[1] < b[3] && r[3] > b[1]) return false; } return true; }
        function schrift(t, x, y, font, farbe, pflicht) {
          c.font = font;
          var w = c.measureText(t).width, h = parseFloat(font.match(/(\d+)px/)[1]) + 4;
          x = Math.max(w / 2 + 10, Math.min(W - w / 2 - 10, x));
          var r = [x - w / 2 - 3, y - h / 2, x + w / 2 + 3, y + h / 2];
          if (!pflicht && !frei(r)) return false;
          belegt.push(r);
          c.lineWidth = 4; c.strokeStyle = 'rgba(20,26,51,0.85)'; c.strokeText(t, x, y);
          c.fillStyle = farbe; c.fillText(t, x, y);
          return true;
        }
        // Carl schwebt irgendwo: dort keine Schrift
        if (carlCtl && !carlEl.hidden) { var cg = carlPx() * carl.s, gw = carl.gef ? 0.45 : 0; belegt.push([carl.x - cg * gw, carl.y - cg * 0.1, carl.x + cg * (0.8 + gw), carl.y + cg * (1 + gw * 0.5)]); }
        // erst die Kugeln selbst als belegt zählen (Schrift soll nicht auf Planeten liegen)
        kugeln.forEach(function (k) { if (k.kind !== 5 && k.R > 6) belegt.push([k.s[0] - k.R * 0.8, k.s[1] - k.R * 0.8, k.s[0] + k.R * 0.8, k.s[1] + k.R * 0.8]); });
        var gross = C6.geraet === 'computer' ? 16 : 15;
        // du
        var du = kugeln.filter(function (k) { return k.kind === 0; })[0];
        if (du) dinge.push({ art: 'du', x: du.s[0], y: du.s[1], R: Math.max(26, du.R), z: du.v[2] });
        // „Du“ steht über der Sonne; der Platz wird vor allen anderen Namen reserviert
        var duY = du ? du.s[1] - du.R - 12 : 0;
        if (du && duY > oben() - 30) { c.font = '700 ' + (gross + 1) + 'px Figtree, system-ui, sans-serif'; var dw = c.measureText('Du').width; belegt.push([du.s[0] - dw / 2 - 6, duY - 11, du.s[0] + dw / 2 + 6, duY + 11]); }
        var nahe = [];
        kugeln.forEach(function (k) {
          if (k.kind >= 1 && k.kind <= 3) nahe.push(k);
          if (k.kind === 4) dinge.push({ art: 'mond', id: k.id, mond: k.mond, x: k.s[0], y: k.s[1], R: Math.max(16, k.R + 6), z: k.v[2] });
          if (k.kind >= 1 && k.kind <= 3) dinge.push({ art: 'planet', id: k.id, x: k.s[0], y: k.s[1], R: Math.max(24, k.R + 4), z: k.v[2] });
          if (k.kind === 6) dinge.push({ art: 'neu', x: k.s[0], y: k.s[1], R: Math.max(26, k.R + 6), z: k.v[2] });
        });
        nahe.sort(function (a, b) { return a.v[2] - b.v[2]; });
        nahe.forEach(function (k) {
          var p = k.pl; if (!p || k.al < 0.4) return;
          if (k.s[0] < 0 || k.s[0] > W || k.s[1] < 0 || k.s[1] > H - unten() + 30) return;
          var y = k.s[1] + k.R + (k.ring ? Math.max(10, k.R * 0.5) : 0) + 13;
          var an = p.id === folge;
          var lang = C6.geraet === 'computer' ? 30 : 20;
          var ok = schrift(kuerze(p.d.titel, lang), k.s[0], y, (an ? '700 ' : '600 ') + (gross + (an ? 2 : 0)) + 'px Figtree, system-ui, sans-serif', an ? '#ffe2ad' : NACHT.text, an);
          var y2 = y + 18;
          if (!ok) { var yo = k.s[1] - k.R - 30; y2 = yo + 18; ok = schrift(kuerze(p.d.titel, lang), k.s[0], yo, '600 ' + gross + 'px Figtree, system-ui, sans-serif', NACHT.text, false); }
          var sx2 = k.s[0];
          if (!ok) {
            var ft = '600 ' + gross + 'px Figtree, system-ui, sans-serif', tt = kuerze(p.d.titel, 20);
            c.font = ft; var bw = c.measureText(tt).width;
            var links = k.s[0] - k.R - 10 - bw / 2;
            sx2 = links - bw / 2 > 10 ? links : k.s[0] + k.R + 10 + bw / 2;
            ok = schrift(tt, sx2, k.s[1], ft, NACHT.text, false); y2 = k.s[1] + 18;
            if (!ok) { sx2 = k.s[0]; for (var dy = 20; !ok && dy <= 60; dy += 20) { ok = schrift(tt, k.s[0], y + dy, ft, NACHT.text, false); y2 = y + dy + 18; } if (!ok) { ok = schrift(tt, k.s[0], y, ft, NACHT.text, true); y2 = y + 18; } }
          }
          // Art und Orte nur am angeflogenen Planeten; im Überblick trägt der Himmel nur Namen
          if (ok && an) {
            var zw = [];
            if (p.monde.length) zw.push(p.monde.length + (p.monde.length === 1 ? ' Ort' : ' Orte'));
            if (p.d.rad) zw.push(p.d.rad);
            if (zw.length) schrift(zw.join(' · '), y2 === k.s[1] + 18 ? sx2 : k.s[0], y2, '500 13px Figtree, system-ui, sans-serif', NACHT.leise, false);
          }
        });
        // Sternbild-Namen: dein Satz steht am Himmel (beim Entstehen groß, sonst klein und leise)
        welt.knoten.forEach(function (kk) {
          if (!kk.s || verdeckt(kk.s)) return;
          var neu = feier && feier.ts === kk.k.ts;
          if (neu) {
            var fa = Math.max(0, Math.min(1, (performance.now() - feier.t0 - 1700) / 900));
            if (fa <= 0) return;
            c.save(); c.globalAlpha = fa;
            var fg = C6.geraet === 'computer' ? 26 : 21, zl = umbruch(kk.k.satz, C6.geraet === 'computer' ? 34 : 24);
            // über beiden Planeten (und ihren Namen), damit nichts sich überdeckt
            var top = kk.s[1];
            [feier.a, feier.b].forEach(function (id) { var pp = hol(id); if (!pp) return; var q = proj(pp.pos), R = F * pp.r / Math.max(0.1, q[2]); top = Math.min(top, q[1] - R - 26); });
            var unterste = Math.max(oben() + (zl.length - 1) * (fg + 6) + fg, top - 8);
            zl.forEach(function (z, i) { schrift(z, kk.s[0], unterste - (zl.length - 1 - i) * (fg + 6), 'italic 400 ' + fg + 'px Fraunces, Georgia, serif', '#ffe6dc', true); });
            c.restore(); return;
          }
          var st = '„' + kuerze(kk.k.satz, C6.geraet === 'computer' ? 34 : 24) + '“', sf = 'italic 400 ' + (gross - 1) + 'px Fraunces, Georgia, serif';
          // klein an der Linie: erst darüber, dann darunter, dann seitlich; zur Not über allem
          if (!schrift(st, kk.s[0], kk.s[1] - 16, sf, '#ffd9cf', false) && !schrift(st, kk.s[0], kk.s[1] + 18, sf, '#ffd9cf', false) && !schrift(st, kk.s[0], kk.s[1] - 36, sf, '#ffd9cf', false)) schrift(st, kk.s[0], kk.s[1] - 16, sf, '#ffd9cf', true);
        });
        if (du && duY > oben() - 30) {
          belegt = belegt.filter(function (r) { return !(r[1] === duY - 11 && Math.abs((r[0] + r[2]) / 2 - du.s[0]) < 1); });
          schrift('Du', du.s[0], duY, '700 ' + (gross + 1) + 'px Figtree, system-ui, sans-serif', '#ffe2ad', true);
        }
        // Mondnamen nur am angeflogenen Planeten; sonst trägt der Himmel nur Planetennamen
        kugeln.forEach(function (k) {
          if (k.kind !== 4 || k.R < 5 || k.s[1] > H - unten()) return;
          if (!folge || k.id !== folge) return;
          schrift(kuerze(k.mond.name, 18), k.s[0], k.s[1] - k.R - 10, '500 13px Figtree, system-ui, sans-serif', NACHT.leise, false);
        });
        // der nächste Planet
        var ge = kugeln.filter(function (k) { return k.kind === 6; })[0];
        var winkWeg = !!folge || !ueberblick || !!(ge && ge.s[1] + ge.R + 24 > H - unten() - 64 && ge.s[1] - ge.R < H - unten());
        if (winkWeg !== buehne.classList.contains('c6w-wink-weg')) buehne.classList.toggle('c6w-wink-weg', winkWeg);
        if (ge && ge.s[1] < H - unten() + 20 && ge.s[0] > 0 && ge.s[0] < W && ge.s[1] > 0) {
          var x = ge.s[0], y = ge.s[1], a = Math.max(5, ge.R * 0.42);
          c.strokeStyle = 'rgba(238,240,255,0.9)'; c.lineWidth = 2; c.lineCap = 'round';
          c.beginPath(); c.moveTo(x - a, y); c.lineTo(x + a, y); c.moveTo(x, y - a); c.lineTo(x, y + a); c.stroke();
          schrift(welt.planeten.length ? 'Neuer Planet' : 'Dein erster Planet', x, y + ge.R + 14, '600 ' + gross + 'px Figtree, system-ui, sans-serif', NACHT.text, !welt.planeten.length);
        }
        // Ziehen: ein neues Sternbild entsteht
        if (zieh && zieh.weit) {
          var a0 = hol(zieh.von); var s0 = a0 && proj(a0.pos);
          if (s0) {
            c.strokeStyle = 'rgba(238,240,255,0.9)'; c.lineWidth = 2;
            c.beginPath(); c.moveTo(s0[0], s0[1]);
            c.quadraticCurveTo((s0[0] + zieh.x) / 2, Math.min(s0[1], zieh.y) - 50, zieh.x, zieh.y); c.stroke();
            stern4(c, zieh.x, zieh.y, zieh.ziel ? 13 : 9, zieh.ziel ? '#ffffff' : 'rgba(238,240,255,0.7)', '#ffffff');
          }
        }
        spurMalen(c);
        rauchMalen(c);
        tragMalen(c);
      }

      // ——— Carl: der Bote zwischen oben und unten ———
      // Er wohnt neben dir, fliegt voraus zum Planeten, den du antippst, und bringt, was unten entstanden ist, hinauf.
      // Hier oben hat er seinen Platz: rechts oben neben dir, in seinem Gefährt (wenn er eins hat; sonst schwebt er).
      var carlCtl = null, carlPos = '';
      var carl = { ort: { art: 'du' }, flug: null, x: 0, y: 0, s: 1, kipp: 0, traegt: null, unterwegs: false, fliegt: false, sitzt: false, gef: null, wipp: { x: 0, v: 0 }, blickBis: 0, lehnt: false, schlaeft: false };
      var letzterPuls = null;
      function carlPx() { return C6.geraet === 'computer' ? 78 : 66; }
      function gefaehrtHolen() { try { return C6.laden && typeof C6.laden.gefaehrt === 'function' ? (C6.laden.gefaehrt() || null) : null; } catch (e) { return null; } }
      function carlMalen() {
        if (carlCtl || !C6.figur || !C6.figur.male) return;
        try { carlCtl = C6.figur.male(carlEl, { groesse: carlPx(), stimmung: 'staunt' }); } catch (e) { carlCtl = null; }
        try { if (carlCtl && C6.laden && C6.laden.an) carlCtl.kleid(C6.laden.an()); } catch (e) {}
        try { if (carlCtl && typeof carlCtl.licht === 'function') carlCtl.licht({ staerke: 0.92 }); } catch (e) {}
      }
      // Gefährt anlegen und hineinsetzen. Fehlt eins (oder die Figur kann es noch nicht): er schwebt wie bisher.
      function carlEinsteigen() {
        if (!carlCtl) return false;
        var g = mitAuspuff(gefaehrtHolen());
        carl.gef = null; carl.sitzt = false;
        if (g && typeof carlCtl.sitzIn === 'function') {
          try { carlCtl.kleid({ gefaehrt: g }); carlCtl.sitzIn(true); carl.gef = g; carl.sitzt = true; carlFlieg(false); } catch (e) { carl.gef = null; carl.sitzt = false; }
        }
        buehne.classList.toggle('c6w-h-gefaehrt', !!carl.gef);
        if (carl.gef && !C6.ruhig) carl.wipp.v += 40;
        return !!carl.gef;
      }
      // Hier oben fährt die Couch: zwei kleine Auspuffrohre, unten hinter den Armlehnen (Einheit m wie das Gefährt)
      var ROHR = (function () {
        var r = '<path d="M-6.3 4.62L-8.2 5.02L-8.05 5.62L-6.2 5.3Z" fill="#9c7350" stroke="#2b2722" stroke-width=".12" stroke-linejoin="round"/>' +
          '<path d="M-6.5 4.82L-8 5.14" fill="none" stroke="#e8c79c" stroke-width=".14" stroke-linecap="round" opacity=".85"/>' +
          '<ellipse cx="-8.26" cy="5.33" rx=".34" ry=".5" transform="rotate(-12 -8.26 5.33)" fill="#c0916a" stroke="#2b2722" stroke-width=".12"/>' +
          '<ellipse cx="-8.33" cy="5.34" rx=".17" ry=".3" transform="rotate(-12 -8.33 5.34)" fill="#2b2722"/>';
        return '<g class="c6w-h-rohr">' + r + '</g><g class="c6w-h-rohr" transform="scale(-1,1)">' + r + '</g>';
      })();
      function mitAuspuff(g) {
        if (!g || g.id !== 'g-couch') return g;
        var k = {}; for (var a in g) k[a] = g[a];
        k.hinten = ROHR + g.hinten; k.auspuff = true;
        return k;
      }
      // Im Rundgang zeigt der Rundgang seine eigene Figur; sie bekommt hier dieselbe Gefährt-Pipeline
      var rgCtl = null;
      function rundgangCarl() {
        try { var w = document.querySelector('#c6r-schicht .c6z-figur'); return w && w.__c6z && w.__c6z.ctl ? w.__c6z.ctl : null; } catch (e) { return null; }
      }
      function rundgangEinsteigen() {
        rundgangAussteigen();
        var c = rundgangCarl(), g = gefaehrtHolen();
        if (!c || !g || typeof c.sitzIn !== 'function') return;
        try { c.kleid({ gefaehrt: g }); c.sitzIn(true); rgCtl = c; } catch (e) { rgCtl = null; }
      }
      function rundgangAussteigen() {
        if (!rgCtl) return;
        try { rgCtl.sitzIn(false); rgCtl.kleid({ gefaehrt: null }); } catch (e) {}
        rgCtl = null;
      }
      function carlAussteigen() {
        if (!carlCtl) return;
        if (carl.sitzt) { try { carlCtl.sitzIn(false); } catch (e) {} }
        if (carl.gef) { try { carlCtl.kleid({ gefaehrt: null }); } catch (e) {} }
        carl.gef = null; carl.sitzt = false;
        buehne.classList.remove('c6w-h-gefaehrt');
      }
      function carlFlieg(an) {
        if (carl.gef) an = false; // das Gefährt trägt, der Rotor bleibt aus
        if (carl.fliegt === an) return; carl.fliegt = an;
        try { if (carlCtl && typeof carlCtl.flieg === 'function') carlCtl.flieg(an); } catch (e) {}
      }
      function carlStimmung(s, ms) {
        if (carl.schlaeft) return;
        try { if (carlCtl) carlCtl.stimmung(s); } catch (e) {}
        if (ms) setTimeout(function () { try { if (carlCtl && !carl.flug && !carl.schlaeft) carlCtl.stimmung('staunt'); } catch (e) {} }, ms);
      }
      // Blick: zu einem Punkt auf der Bühne (Finger, Planet, Sternschnuppe), nach einer Weile wieder frei
      function carlSchau(sx, sy, ms) {
        if (!carlCtl || carl.schlaeft) return;
        try { var r = vorn.getBoundingClientRect(); carlCtl.schau(r.left + sx, r.top + sy); } catch (e) {}
        carl.blickBis = performance.now() + (ms || 2600);
        carl.lehnt = false;
        weiter();
      }
      function carlWach() {
        if (!carlCtl) return;
        var war = carl.schlaeft || carl.lehnt, selbst = carl.selbstSchlaf;
        carl.schlaeft = false; carl.lehnt = false; carl.blickBis = 0; carl.selbstSchlaf = false;
        if (war) { try { carlCtl.schau(null); if (selbst) carlCtl.stimmung('staunt'); } catch (e) {} weiter(); }
      }
      // Wo Carl an einem Ort ist: ein Punkt im Raum (Welt), damit Größe, Licht und Verdeckung aus der Tiefe folgen
      function rs() { return RSONNE * fak(); }
      function unproj(sx, sy, z) {
        var v0 = (sx - CX) * z / F, v1 = -(sy - CY) * z / F;
        return [E.eye[0] + E.r[0] * v0 + E.u[0] * v1 + E.f[0] * z, E.eye[1] + E.r[1] * v0 + E.u[1] * v1 + E.f[1] * z, E.eye[2] + E.r[2] * v0 + E.u[2] * v1 + E.f[2] * z];
      }
      function plus(a, b, k) { return [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k]; }
      function ortWelt(o) {
        var r = rs(), g = carlPx(), zs = Math.max(0.5, ansicht([0, 0, 0])[2]);
        if (o.art === 'unten') return unproj(W * 0.5, H + g * 0.9, zs);
        if (o.art === 'oben') return unproj(W * 0.5, -g * 1.3, zs * 0.85);
        if (o.art === 'planet' || o.art === 'mitte') {
          var p = hol(o.id);
          if (p) {
            if (o.art === 'mitte') return p.pos.slice();
            var seite = proj(p.pos)[0] > W * 0.6 ? -1 : 1;
            return plus(plus(p.pos, E.r, seite * (p.r * 1.25 + r * 0.55)), E.u, p.r * 0.75 + r * 0.25);
          }
        }
        if (o.art === 'spiel' && spiel) return spiel.w;
        // sein Platz: rechts oben neben dir, in deiner Tiefe
        return plus(plus([0, 0, 0], E.r, r * 2.2), E.u, r * 1.3);
      }
      // Maßstab aus der Tiefe: so groß, wie ein Ding seiner Größe in dieser Entfernung wirkt
      function massVon(z) { return Math.max(0.5, Math.min(1.7, F * rs() / Math.max(0.1, z) / 46)); }
      // Weltpunkt → [x, y, Maßstab, Tiefe] (x/y = linke obere Ecke der Figur, Mitte am Punkt)
      function schirmOrt(w, k) {
        var P = proj(w), px = carlPx(), s = massVon(P[2]) * (k || 1);
        return [P[0] - px * 240 / 270 * 0.4, P[1] - px * 0.5, s, P[2]];
      }
      function ortPunkt(o) { return schirmOrt(ortWelt(o), o.art === 'mitte' ? 0.3 : 1); }
      function carlFliegZu(nach, ms, fertig, bogen) {
        if (spiel) spielStopp();
        var a = carl.w ? carl.w.slice() : ortWelt(carl.ort);
        carlWach();
        if (C6.ruhig || !ms) { carl.ort = nach; carl.flug = null; carlFlieg(false); if (fertig) fertig(); weiter(); return; }
        carl.flug = { a: a, nach: nach, t0: performance.now(), ms: ms, fertig: fertig, bogen: bogen == null ? 46 : bogen };
        carlFlieg(true);
        weiter();
      }
      // Nachwippen: eine Feder, die nach jedem Flug und beim Einsteigen kurz nachschwingt
      function wippSchritt(dt) {
        var w = carl.wipp;
        if (C6.ruhig) { w.x = 0; w.v = 0; return false; }
        w.v += (-42 * w.x - 5.4 * w.v) * dt; w.x += w.v * dt;
        if (Math.abs(w.x) < 0.06 && Math.abs(w.v) < 0.3) { w.x = 0; w.v = 0; return false; }
        return true;
      }
      function carlLebt(now) { return !!carl.flug || carl.wipp.x !== 0 || carl.wipp.v !== 0 || (carl.blickBis > 0 && now >= carl.blickBis); }
      function carlSetzen(now, dt) {
        if (!carlCtl) return;
        var x, y, s, kipp = 0;
        var w, kz = 1;
        if (carl.flug) {
          var f = carl.flug, k = Math.min(1, (now - f.t0) / f.ms), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          var bw = ortWelt(f.nach), l = Math.hypot(bw[0] - f.a[0], bw[1] - f.a[1], bw[2] - f.a[2]);
          // ein Bogen im Raum: nach oben und ein wenig auf dich zu, so wächst er unterwegs und wird wieder kleiner
          var hub = Math.min(rs() * 3, Math.max(rs() * 0.4, l * 0.3)) * (f.bogen / 46), nah = l * 0.18 * Math.min(1, f.bogen / 46);
          w = [f.a[0] + (bw[0] - f.a[0]) * e, f.a[1] + (bw[1] - f.a[1]) * e, f.a[2] + (bw[2] - f.a[2]) * e];
          w = plus(plus(w, E.u, hub * Math.sin(Math.PI * k)), E.f, -nah * Math.sin(Math.PI * k));
          if (f.nach.art === 'mitte') kz = 1 - 0.7 * e;
          if (k >= 1) {
            carl.flug = null; carl.ort = f.nach; carlFlieg(false);
            if (carl.gef) auspuffAus();
            if (!C6.ruhig) carl.wipp.v += 55 + Math.min(60, l * 6); // Gewicht: er kommt an und federt nach
            if (f.fertig) f.fertig();
            heimkehr();
          }
        } else if (spiel) {
          spielSchritt(now, dt); w = spiel.w; kipp += spiel.dreh;
        } else {
          w = ortWelt(carl.ort);
          if (carl.ort.art === 'mitte') kz = 0.3;
          if (!C6.ruhig) { if (carl.gef) kipp = Math.sin(zeit * 0.9 + 1) * 1.3; else w = plus(w, E.u, Math.sin(zeit * 1.15) * rs() * 0.04); }
          if (carl.lehnt) kipp -= carl.gef ? 4 : 2;
        }
        carl.w = w;
        var q = schirmOrt(w, kz); x = q[0]; y = q[1]; s = q[2]; carl.z = q[3];
        if (dt) wippSchritt(dt);
        y += carl.wipp.x; kipp += carl.wipp.x * 0.12;
        kipp += fahrtNeigung(x, y, dt) * (carl.gef ? 1 : 0.8);
        if (carl.blickBis && now >= carl.blickBis) { carl.blickBis = 0; try { carlCtl.schau(null); } catch (e) {} }
        carl.x = x; carl.y = y; carl.s = s; carl.kipp = kipp;
        var t = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px) rotate(' + kipp.toFixed(1) + 'deg) scale(' + s.toFixed(3) + ')';
        if (t !== carlPos) { carlEl.style.transform = t; carlPos = t; }
        scheinSetzen(x, y, s);
        verdeckeCarl(x, y, s, kipp);
        couchSetzen();
        sonneAufCarl();
        if (carl.gef && carl.gef.auspuff) auspuffTakt(now, dt);
      }
      // Fahrt: die Couch neigt sich mit der Geschwindigkeit in die Richtung, mit Feder (anfahren: erst zurück, halten: nachschwingen)
      var fahrt = { x: null, y: 0, v: 0, n: 0, nv: 0, vx: 0, vy: 0 };
      function fahrtNeigung(x, y, dt) {
        var f = fahrt;
        if (f.x == null || !dt || dt > 0.2) { f.x = x; f.y = y; f.vx = f.vy = 0; return f.n; }
        var vx = (x - f.x) / dt, vy = (y - f.y) / dt; f.x = x; f.y = y;
        f.vx += (vx - f.vx) * Math.min(1, dt * 14); f.vy += (vy - f.vy) * Math.min(1, dt * 14);
        if (C6.ruhig) { f.n = 0; f.nv = 0; return 0; }
        var ziel = Math.max(-13, Math.min(13, f.vx * 0.022 + f.vy * 0.004 * (f.vx < 0 ? -1 : 1)));
        f.nv += (-58 * (f.n - ziel) - 7.5 * f.nv) * dt; f.n += f.nv * dt;
        return f.n;
      }
      // Verdeckung: Was im Raum vor Carl liegt (Sonne, Planeten, Monde), schneidet ihn aus (Maske auf der Figur)
      var maskeAlt = '';
      function verdeckeCarl(x, y, s, kipp) {
        var px = carlPx(), w0 = px * 240 / 270, h0 = px, ox = w0 * 0.4, oy = h0 * 0.5, cx = x + ox, cy = y + oy;
        var a = -(kipp || 0) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), rC = px * s * 0.95, schichten = [];
        if (carl.z && !carlEl.hidden) kugeln.forEach(function (k) {
          if (k.kind === 5 || k.kind === 6 || !k.s || !k.v || k.R < 2) return;
          if (!(k.v[2] < carl.z - 0.05)) return;
          var dx = k.s[0] - cx, dy = k.s[1] - cy;
          if (Math.hypot(dx, dy) > k.R + rC) return;
          var lx = (c * dx - sn * dy) / s + ox + w0 * 1.5, ly = (sn * dx + c * dy) / s + oy + h0 * 1.5, lr = k.R / s;
          schichten.push('radial-gradient(circle ' + lr.toFixed(1) + 'px at ' + lx.toFixed(1) + 'px ' + ly.toFixed(1) + 'px, transparent ' + Math.max(0, lr - 0.8).toFixed(1) + 'px, #000 ' + (lr + 0.6).toFixed(1) + 'px)');
        });
        var m = schichten.slice(0, 4).join(',');
        if (m === maskeAlt) return; maskeAlt = m;
        var st = carlEl.style;
        st.maskImage = st.webkitMaskImage = m || '';
        st.maskSize = st.webkitMaskSize = m ? '400% 400%' : '';
        st.maskPosition = st.webkitMaskPosition = m ? 'center' : '';
        st.maskRepeat = st.webkitMaskRepeat = m ? 'no-repeat' : '';
        st.maskComposite = m ? 'intersect' : ''; st.webkitMaskComposite = m ? 'source-in' : '';
        st.maskClip = m ? 'no-clip' : ''; st.webkitMaskClip = m ? 'no-clip' : '';
      }

      // ——— Freudenflug: nach einer Weile Ruhe steigt Carl von der Couch und fliegt vergnügt um deine Planeten.
      // Hinter ihm zieht der rote Faden bunt nach. Jede Eingabe holt ihn sanft zurück. Nicht bei ruhiger Bewegung.
      var spiel = null, spur = [], stillSeit = performance.now(), couchAn = false, couchAlt = '';
      var RUHE_MS = 25000, SPIEL_MS = 48000;
      function eingabe() {
        stillSeit = performance.now();
        if (spiel) spielEnde();
      }
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (t) { window.addEventListener(t, eingabe, { passive: true, capture: true }); });
      window.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' && (Math.abs(e.movementX) + Math.abs(e.movementY) > 2)) eingabe(); }, { passive: true });
      function spielDarf(now) {
        return aktiv && !spiel && !C6.ruhig && !imRundgang && C6.jetzt === 'netz' && carlCtl && !carlEl.hidden && !carl.flug && !carl.unterwegs &&
          blatt.hidden && !feier && !zieh && !geste && !tauchen && carl.ort.art === 'du' && welt.planeten.length > 0 && now - stillSeit > RUHE_MS && !(C6.werkzeug && C6.werkzeug.offen);
      }
      function spielStart(now) {
        carlWach();
        var start = carl.w ? carl.w.slice() : ortWelt({ art: 'du' });
        spiel = { t0: now, w: start, dreh: 0, seg: null, n: 0, letzte: null };
        if (carl.gef) { couchParken(); carlAussteigen(); }
        carlFlieg(true); carlStimmung('froh');
        try { if (carlCtl) carlCtl.huepf(10); } catch (e) {}
        spur = [];
        weiter();
      }
      // die Wege: hin zum nächsten Planeten, einmal um ihn herum (vorn vorbei und hinten herum), weiter
      function naechsterSeg(now) {
        var pl = welt.planeten.filter(function (p) { return p.id !== spiel.letzte; });
        if (!pl.length) pl = welt.planeten;
        var p = pl[Math.floor(Math.random() * pl.length)];
        spiel.letzte = p.id; spiel.n++;
        var rad = p.r * 1.3 + rs() * 0.35;
        var e0 = kreisPunkt(p, rad, 0), e1 = kreisPunkt(p, rad, Math.PI);
        var d0 = Math.hypot(e0[0] - spiel.w[0], e0[1] - spiel.w[1], e0[2] - spiel.w[2]), d1 = Math.hypot(e1[0] - spiel.w[0], e1[1] - spiel.w[1], e1[2] - spiel.w[2]);
        var th0 = d0 <= d1 ? 0 : Math.PI, l = Math.min(d0, d1);
        spiel.seg = { art: 'hin', t0: now, ms: Math.max(1100, Math.min(3200, l / (rs() * 2.6) * 1000)), a: spiel.w.slice(), p: p.id, th0: th0, rad: rad, ri: Math.random() < 0.5 ? 1 : -1 };
      }
      // Die Runde liegt in der Ebene, die vom Bild aus waagrecht in die Tiefe geht: hinten ein wenig tiefer,
      // so führt sie für das Auge hinter den Planeten (er verschwindet kurz) und vorn vor ihm vorbei.
      function kreisPunkt(p, rad, th) {
        var a = norm([E.r[0], 0, E.r[2]]), c = norm([E.f[0], 0, E.f[2]]), sn = Math.sin(th);
        return plus(plus(plus(p.pos, a, rad * Math.cos(th)), c, rad * sn), [0, 1, 0], -rad * 0.32 * sn + p.r * 0.15);
      }
      function spielSchritt(now, dt) {
        var sg = spiel.seg;
        if (!sg) { naechsterSeg(now); sg = spiel.seg; }
        var p = hol(sg.p); if (!p) { spiel.seg = null; return; }
        var k = Math.min(1, (now - sg.t0) / sg.ms);
        spiel.dreh = 0;
        if (sg.art === 'hin') {
          var ein = kreisPunkt(p, sg.rad, sg.th0), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
          var l = Math.hypot(ein[0] - sg.a[0], ein[1] - sg.a[1], ein[2] - sg.a[2]);
          spiel.w = plus([sg.a[0] + (ein[0] - sg.a[0]) * e, sg.a[1] + (ein[1] - sg.a[1]) * e, sg.a[2] + (ein[2] - sg.a[2]) * e], E.u, Math.sin(Math.PI * k) * Math.min(rs() * 2.4, l * 0.35));
          if (k >= 1) { spiel.seg = { art: 'kreis', t0: now, ms: 2800, p: sg.p, th0: sg.th0, ri: sg.ri, rad: sg.rad, rolle: spiel.n % 2 === 0 }; }
        } else {
          // um den Planeten: eine geneigte Bahn, die hinter ihm entlangführt
          spiel.w = kreisPunkt(p, sg.rad, sg.th0 + sg.ri * k * Math.PI * 2);
          // jedes zweite Mal ein Purzelbaum mitten in der Runde
          if (sg.rolle && k > 0.35 && k < 0.65) { var r = (k - 0.35) / 0.3; spiel.dreh = 360 * (r < 0.5 ? 2 * r * r : 1 - Math.pow(-2 * r + 2, 2) / 2); }
          if (k >= 1) spiel.seg = null;
        }
        // die Spur: der rote Faden wird bunt
        spur.push({ w: spiel.w.slice(), t: now });
        if (spur.length > 150) spur.splice(0, spur.length - 150);
        if (now - spiel.t0 > SPIEL_MS) spielEnde();
      }
      function spielStopp() { if (!spiel) return; spiel = null; try { carlCtl && carlCtl.stimmung('staunt'); } catch (e) {} }
      function spielEnde() {
        if (!spiel) return;
        spielStopp();
        carl.ort = { art: 'spiel' };
        carlFliegZu({ art: 'du' }, C6.ruhig ? 0 : 1300, null, 30);
      }
      // Heimkehr: wieder an seinem Platz, die Couch wartet dort
      function heimkehr() {
        if (couchAn && carl.ort.art === 'du' && !spiel) {
          couchAn = false; couchEl.hidden = true; carlEinsteigen();
          var t = satz('himmel.freude.heim', ''); if (t) stimme(t, 4000);   // nur wenn es dafür einen Satz gibt
        }
      }
      function couchParken() {
        var g = carl.gef; if (!g) return;
        couchEl.innerHTML = '<svg viewBox="0 0 240 270" aria-hidden="true" focusable="false" style="overflow:visible;width:100%;height:100%"><g transform="translate(120,156) scale(20)">' + (g.hinten || '') + (g.vorn || '') + '</g></svg>';
        couchEl.style.width = Math.round(carlPx() * 240 / 270) + 'px'; couchEl.style.height = carlPx() + 'px';
        couchAn = true; couchEl.hidden = false; couchAlt = '';
      }
      function couchSetzen() {
        if (!couchAn) return;
        var q = ortPunkt({ art: 'du' }), px = carlPx(), bob = C6.ruhig ? 0 : Math.sin(zeit * 1.8) * 2;
        var t = 'translate(' + Math.round(q[0]) + 'px,' + Math.round(q[1] - 10 * px / 270 * q[2] + bob) + 'px) scale(' + q[2].toFixed(3) + ')';
        if (t !== couchAlt) { couchEl.style.transform = t; couchAlt = t; }
      }
      function spurMalen(c) {
        if (!spur.length) return;
        var jetzt = performance.now(), lang = 2400;
        while (spur.length && jetzt - spur[0].t > lang) spur.shift();
        if (spur.length < 2) return;
        var pts = spur.map(function (q) { var s = proj(q.w); return { s: s, t: q.t, weg: s[2] < 0.2 || verdeckt(s) }; });
        c.lineCap = 'round'; c.lineJoin = 'round';
        // weich: von Mitte zu Mitte als Kurve; die Farbe wandert mit der Zeit den Faden entlang
        for (var i = 1; i < pts.length - 1; i++) {
          var a = pts[i - 1], b = pts[i], n = pts[i + 1]; if (a.weg || b.weg || n.weg) continue;
          var m0 = [(a.s[0] + b.s[0]) / 2, (a.s[1] + b.s[1]) / 2], m1 = [(b.s[0] + n.s[0]) / 2, (b.s[1] + n.s[1]) / 2];
          var alt = (jetzt - b.t) / lang, al = Math.max(0, 1 - alt), br = Math.max(1.4, 4.4 * massVon(b.s[2]) * (0.35 + 0.65 * al));
          var hue = (b.t * 0.18) % 360;
          c.strokeStyle = 'hsla(' + hue.toFixed(0) + ',90%,68%,' + (0.22 * al).toFixed(3) + ')'; c.lineWidth = br * 2.6;
          c.beginPath(); c.moveTo(m0[0], m0[1]); c.quadraticCurveTo(b.s[0], b.s[1], m1[0], m1[1]); c.stroke();
          c.strokeStyle = 'hsla(' + hue.toFixed(0) + ',88%,64%,' + (0.9 * al).toFixed(3) + ')'; c.lineWidth = br;
          c.beginPath(); c.moveTo(m0[0], m0[1]); c.quadraticCurveTo(b.s[0], b.s[1], m1[0], m1[1]); c.stroke();
        }
      }

      // Licht: Richtung von Carls Körpermitte zur Sonne „Du“, nur bei merklicher Änderung an die Figur
      var sonneLetzt = null;
      function sonneAufCarl() {
        if (!carlCtl || typeof carlCtl.licht !== 'function') return;
        var du = proj([0, 0, 0]), g = carlPx() * carl.s;
        var dx = du[0] - (carl.x + g * 0.4), dy = du[1] - (carl.y + g * 0.45), l = Math.hypot(dx, dy) || 1, d = carl.kipp || 0;
        dx /= l; dy /= l;
        var a = sonneLetzt;
        if (a && Math.abs(a[0] - dx) < 0.03 && Math.abs(a[1] - dy) < 0.03 && Math.abs(a[2] - d) < 0.8) return;
        sonneLetzt = [dx, dy, d];
        try { carlCtl.licht({ dx: dx, dy: dy, dreh: d }); } catch (e) {}
      }

      // ——— Auspuff: kleine Rauch- und Funkenwölkchen aus dem Rohr auf der Rückseite der Fahrt ———
      var rauch = [], puff = { ph: 0, leer: 0, start: 0, roll: [] };
      function rohrPunkt(seite) {
        // Rohrende in Figur-Einheiten (240 × 270) → Bühne, mit Carls Lage, Drehung und Maßstab
        var px = carlPx(), u = px / 270, w = px * 240 / 270, h = px, ox = w * 0.4, oy = h * 0.5;
        var lx = (120 + seite * 8.5 * 20) * u - ox, ly = (156 + 5.36 * 20 - 10) * u - oy;
        var a = (carl.kipp || 0) * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), sk = carl.s;
        return [carl.x + ox + (c * lx - sn * ly) * sk, carl.y + oy + (sn * lx + c * ly) * sk];
      }
      function wolke(seite, staerke, funke) {
        if (rauch.length > 46) rauch.splice(0, rauch.length - 46);
        var p = rohrPunkt(seite), sk = carl.s * carlPx() / 66, kl = [];
        // ein Wölkchen aus drei kleinen Ballen (wie ein Blumenkohl), damit es nicht als Kugel gelesen wird
        for (var j = 0; j < 3; j++) kl.push([(Math.random() - 0.5) * 1.3, (Math.random() - 0.5) * 1.1, 0.55 + Math.random() * 0.45]);
        rauch.push({ x: p[0], y: p[1], vx: seite * (10 + Math.random() * 12) * sk + fahrt.vx * 0.3, vy: -3 - Math.random() * 7 + fahrt.vy * 0.3,
          t: 0, life: 0.45 + Math.random() * 0.3 + staerke * 0.3, r0: (1.3 + staerke * 1.1) * sk, r1: (4.2 + staerke * 4 + Math.random() * 1.4) * sk, a: 0.55 + staerke * 0.4, f: 0, kl: kl });
        if (funke) for (var i = 0; i < funke; i++) {
          rauch.push({ x: p[0], y: p[1], vx: seite * (34 + Math.random() * 46) * sk + fahrt.vx * 0.2, vy: (Math.random() - 0.65) * 44 * sk + fahrt.vy * 0.2,
            t: 0, life: 0.28 + Math.random() * 0.3, r0: 1.25 * sk, r1: 0.45 * sk, a: 1, f: 1 });
        }
      }
      // Seite des Rohrs: das hintere zur Fahrtrichtung (links, wenn er nach rechts fährt); im Stand das linke
      function rohrSeite() { return fahrt.vx < -20 ? 1 : -1; }
      function auspuffTakt(now, dt) {
        if (C6.ruhig || carlEl.hidden || !dt) { if (C6.ruhig) rauch.length = 0; return; }
        var f = carl.flug;
        if (f) {
          var k = Math.min(1, (now - f.t0) / f.ms);
          if (puff.start !== f.t0) { puff.start = f.t0; puff.roll = []; wolke(rohrSeite() || -1, 1, 3); wolke(-1, 0.9, 0); wolke(1, 0.6, 0); puff.ph = 0; }
          var tempo = Math.hypot(fahrt.vx, fahrt.vy), aus = k > 0.72 ? Math.max(0.15, (1 - k) / 0.28) : 1;
          puff.ph += dt * (6 + Math.min(9, tempo / 50)) * aus;
          if (puff.ph >= 1) { puff.ph -= 1; puff.n = (puff.n || 0) + 1; wolke(rohrSeite(), 0.35 + 0.4 * aus, puff.n % 3 === 0 && aus > 0.6 ? 2 : 0); }
          puff.leer = now + 2600;
        } else {
          if (puff.roll.length && now >= puff.roll[0]) { puff.roll.shift(); wolke(-1, 0.25, 0); }
          if (!puff.leer) puff.leer = now + 1800;
          if (now >= puff.leer) { puff.leer = now + 2800 + Math.random() * 1600; wolke(-1, 0.12, 0); }
        }
      }
      function auspuffAus() { var t = performance.now(); puff.roll = [t + 200, t + 520]; }
      function rauchMalen(c) {
        if (!rauch.length) return;
        var t = performance.now(), dt = Math.min(0.08, (t - (rauch.tl || t)) / 1000); rauch.tl = t;
        for (var i = rauch.length - 1; i >= 0; i--) {
          var p = rauch[i]; p.t += dt;
          if (p.t >= p.life) { rauch.splice(i, 1); continue; }
          var dr = Math.exp(-dt * (p.f ? 2.4 : 1.7)); p.vx *= dr; p.vy = p.vy * dr - (p.f ? 0 : 6 * dt); p.x += p.vx * dt; p.y += p.vy * dt;
          var k = p.t / p.life, r = p.r0 + (p.r1 - p.r0) * (1 - Math.pow(1 - k, 2)), al = p.a * Math.pow(1 - k, 1.4) * (k < 0.1 ? k / 0.1 : 1);
          if (p.f) {
            c.fillStyle = 'rgba(255,' + Math.round(214 - 60 * k) + ',' + Math.round(130 - 80 * k) + ',' + al.toFixed(3) + ')';
            c.beginPath(); c.arc(p.x, p.y, Math.max(0.4, r), 0, 6.2832); c.fill();
          } else {
            // warm am Rohr, dann kühl im Raum: Ballen in Schattenton, darüber ein Lichtsaum zur Sonne
            var w = Math.max(0, 1 - k * 2.4), rr = Math.round(196 + 52 * w), gg = Math.round(198 + 30 * w), bb = Math.round(226 - 50 * w);
            var sl = sonneLetzt || [-0.7, 0.7], kl = p.kl;
            c.fillStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',' + (al * 0.62).toFixed(3) + ')';
            c.beginPath();
            for (var j = 0; j < 3; j++) { var q = kl[j], bx = p.x + q[0] * r, by = p.y + q[1] * r; c.moveTo(bx + r * q[2], by); c.arc(bx, by, r * q[2], 0, 6.2832); }
            c.fill();
            c.fillStyle = 'rgba(255,232,196,' + (al * 0.5).toFixed(3) + ')';
            c.beginPath();
            for (j = 0; j < 3; j++) { q = kl[j]; var hr = r * q[2] * 0.55, hx = p.x + q[0] * r + sl[0] * r * q[2] * 0.42, hy = p.y + q[1] * r + sl[1] * r * q[2] * 0.42; c.moveTo(hx + hr, hy); c.arc(hx, hy, hr, 0, 6.2832); }
            c.fill();
          }
        }
      }
      // Unter dem Gefährt: ein weicher Schatten, vom Licht („Du“) weg versetzt, und ein warmer Hauch auf der Lichtseite
      function scheinSetzen(x, y, s) {
        var g = carlPx() * s, bw = g * 0.8;
        var cx = x + bw * 0.5, cy = y + g * (carl.gef ? 1.02 : 0.98);
        var du = proj([0, 0, 0]), dx = cx - du[0], dy = cy - du[1], l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
        var hoch = carl.flug ? 0.55 : 1, an = carlCtl && !carlEl.hidden && carl.ort.art !== 'unten' && carl.ort.art !== 'oben' && carl.ort.art !== 'mitte';
        var sw = (carl.gef ? 1.35 : 0.9) * s, sh = (carl.gef ? 0.42 : 0.3) * s;
        var ts = 'translate(' + Math.round(cx + dx * 9 * hoch - 50) + 'px,' + Math.round(cy + 3 + dy * 5 * hoch - 20) + 'px) scale(' + sw.toFixed(3) + ',' + sh.toFixed(3) + ')';
        var os = an ? (carl.gef ? 0.62 : 0.3) * (carl.flug ? 0.5 : 1) : 0;
        var tl = 'translate(' + Math.round(cx - dx * bw * 0.35 - 50) + 'px,' + Math.round(cy - dy * g * 0.25 - g * 0.3 - 50) + 'px) scale(' + (s * (carl.gef ? 1.1 : 0.8)).toFixed(3) + ')';
        var ol = an && carl.gef ? 0.7 : 0;
        var ps = ts + '|' + os.toFixed(2), pl = tl + '|' + ol.toFixed(2);
        if (ps !== schattenPos) { schattenEl.style.transform = ts; schattenEl.style.opacity = os; schattenPos = ps; }
        if (pl !== lichtPos) { lichtEl.style.transform = tl; lichtEl.style.opacity = ol; lichtPos = pl; }
      }
      // Sternschnuppe: alle 40 bis 90 Sekunden eine Linie, 600 ms; Carl schaut hin
      var schnuppe = null, schnuppeNaechste = 0;
      function schnuppePlanen(now) { schnuppeNaechste = now + 40000 + Math.random() * 50000; }
      function schnuppeSchritt(now) {
        if (C6.ruhig || imRundgang || !aktiv) { schnuppe = null; return; }
        if (!schnuppe && schnuppeNaechste && now >= schnuppeNaechste) {
          var ob = oben(), hav = Math.max(100, H - ob - unten());
          var x0 = W * (0.2 + Math.random() * 0.6), y0 = ob + hav * (0.05 + Math.random() * 0.35);
          var a = 0.35 + Math.random() * 0.4, ri = Math.random() < 0.5 ? -1 : 1;
          schnuppe = { t0: now, x0: x0, y0: y0, dx: Math.cos(a) * 150 * ri, dy: Math.sin(a) * 90 };
          schnuppePlanen(now);
          if (!carl.flug && !carl.unterwegs) carlSchau(x0 + schnuppe.dx * 0.6, y0 + schnuppe.dy * 0.6, 1800);
        }
        if (schnuppe && now - schnuppe.t0 > 600) schnuppe = null;
      }
      function schnuppeMalen(c, now) {
        if (!schnuppe) return;
        var k = Math.min(1, (now - schnuppe.t0) / 600), kopf = Math.min(1, k * 1.3), schwanz = Math.max(0, k * 1.3 - 0.3);
        var x1 = schnuppe.x0 + schnuppe.dx * kopf, y1 = schnuppe.y0 + schnuppe.dy * kopf, x0 = schnuppe.x0 + schnuppe.dx * schwanz, y0 = schnuppe.y0 + schnuppe.dy * schwanz;
        var g = c.createLinearGradient(x0, y0, x1, y1);
        g.addColorStop(0, 'rgba(255,251,232,0)'); g.addColorStop(1, 'rgba(255,251,232,' + (0.9 * (1 - k * 0.4)).toFixed(3) + ')');
        c.strokeStyle = g; c.lineWidth = 1.5; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
      }
      // Licht: „Du“ ist die Quelle des Raums; wird nur neu gesetzt, wenn die Mitte sich merklich verschiebt
      var lichtLetzt = null, lichtT = 0;
      function lichtSetzen(now) {
        if (!C6.lichtquelle || typeof C6.lichtquelle.setze !== 'function' || !W || now - lichtT < 500) return;
        lichtT = now;
        var du = proj([0, 0, 0]), x = Math.max(0, Math.min(1, du[0] / W)), y = Math.max(0, Math.min(1, du[1] / H));
        if (lichtLetzt && Math.abs(lichtLetzt[0] - x) < 0.02 && Math.abs(lichtLetzt[1] - y) < 0.02) return;
        lichtLetzt = [x, y];
        try { C6.lichtquelle.setze('netz', { x: x, y: y, art: 'du', warm: 1, staerke: 0.9, hoehe: 0.5 }); } catch (e) {}
      }
      // was Carl trägt: ein kleines Licht in seinen Händen
      function tragMalen(c) {
        if (!carl.traegt || !carlCtl) return;
        var g = carlPx() * carl.s, x = carl.x + g * 0.42, y = carl.y + g * 0.78;
        var r = 5 + (C6.ruhig ? 0 : Math.sin(zeit * 6) * 0.8);
        var hg = c.createRadialGradient(x, y, 0, x, y, r * 3.2);
        hg.addColorStop(0, 'rgba(255,236,190,0.9)'); hg.addColorStop(1, 'rgba(255,200,110,0)');
        c.fillStyle = hg; c.beginPath(); c.arc(x, y, r * 3.2, 0, 6.29); c.fill();
        stern4(c, x, y, r * 1.5, css(mische(carl.traegt, [1, 0.95, 0.8], 0.55), 1), '#ffffff');
      }

      // ——— Wie oben, so unten ———
      var pulse = {};   // stringId → Startzeit des Lichtpulses
      var wartet = {};  // stringId → Zeitpunkt; was danach entstand, zeigt sich erst, wenn Carl es gebracht hat
      var boten = [];
      function zeigbar(sid, ts) { var w = wartet[sid]; return w == null || !(ts > w); }
      function marken(sid, s) {
        var dn = [], fu = [];
        try { dn = (C6.space && C6.space.dinge ? C6.space.dinge(sid) || [] : []).filter(function (d) { return !C6.strings.vonOben(d); }); } catch (e) {}
        try { fu = C6.auftrag && typeof C6.auftrag.funde === 'function' ? (C6.auftrag.funde(sid) || []) : []; } catch (e) {}
        return {
          dinge: dn.slice(-8).map(function (d) { return d.ts || 0; }),
          funde: (Array.isArray(fu) ? fu : []).slice(-6).map(function (f) { return (f && f.ts) || 0; }),
          perlen: ((s && s.perlen) || []).slice(-14).map(function (x) { return x.ts || 0; })
        };
      }
      function neuigkeiten(seit) {
        var je = {}, a = [];
        function dazu(sid, was, ts, extra) {
          if (!(ts > seit) || !hol(sid)) return;
          var e = je[sid]; if (!e) { e = je[sid] = { sid: sid, n: 0, ts: 0 }; a.push(e); }
          e.n++; if (ts >= e.ts) { e.ts = ts; e.was = was; e.extra = extra; }
        }
        C6.strings.alle().forEach(function (s) {
          (s.perlen || []).forEach(function (x) { dazu(s.id, 'perle', x.ts); });
          try { (C6.space && C6.space.dinge ? C6.space.dinge(s.id) || [] : []).forEach(function (d) { if (!C6.strings.vonOben(d)) dazu(s.id, 'ding', d.ts, d); }); } catch (e) {}
          try { var fu = C6.auftrag && typeof C6.auftrag.funde === 'function' ? C6.auftrag.funde(s.id) || [] : []; fu.forEach(function (f) { if (f) dazu(s.id, 'fund', f.ts, f); }); } catch (e) {}
        });
        C6.strings.nadelnAlle().forEach(function (n) { if (n.stringId) dazu(n.stringId, 'nadel', n.ts); });
        return a.sort(function (x, y) { return y.ts - x.ts; }).slice(0, 3);
      }
      var DING = { ergebnis: 'ein Ergebnis aus der Werkstatt', geruest: 'ein Gerüst', zettel: 'ein Zettel', karte: 'eine Karte' };
      function boteSatz(b, p) {
        var t = '„' + kuerze(p.d.titel, 28) + '“';
        if (b.n > 1) return satz('himmel.bote.viel', 'Bei ' + t + ' ist einiges dazugekommen.').replace('{titel}', t);
        if (b.was === 'nadel') return 'Dein Kernsatz steht jetzt als roter Stern über ' + t + '.';
        if (b.was === 'fund') return 'Ein Fund für ' + t + '. Er liegt unten im Space.';
        if (b.was === 'ding') return /^Brief von /.test((b.extra && b.extra.titel) || '') ? 'Mein Brief liegt jetzt bei ' + t + '.' : 'Bei ' + t + ' ist ' + (DING[b.extra && b.extra.art] || 'etwas') + ' dazugekommen.';
        return 'Ein neuer Zettel in ' + t + '.';
      }
      function bote(b) {
        if (imRundgang || !hol(b.sid)) return;
        if (wartet[b.sid] == null) wartet[b.sid] = b.seit != null ? b.seit : Date.now() - 1;
        boten.push(b);
        if (!carl.unterwegs) naechsterBote();
      }
      function naechsterBote() {
        var b = boten.shift();
        if (!b) {
          carl.unterwegs = false; carl.traegt = null;
          if (!aktiv) return;
          setTimeout(function () {
            if (carl.unterwegs || carl.flug || !aktiv) return;
            var ziel = folge && hol(folge) ? { art: 'planet', id: folge } : { art: 'du' };
            if (carl.ort.art !== ziel.art || carl.ort.id !== ziel.id) carlFliegZu(ziel, 1000);
          }, C6.ruhig ? 0 : 900);
          return;
        }
        var p = hol(b.sid); if (!p) { delete wartet[b.sid]; naechsterBote(); return; }
        carl.unterwegs = true; carl.traegt = p.farbe;
        var schon = carl.ort.art === 'planet' && carl.ort.id === b.sid && !carl.flug;
        carlFliegZu({ art: 'planet', id: b.sid }, schon ? 0 : 1300, function () {
          carl.traegt = null;
          delete wartet[b.sid];
          pulsAn(b.sid);
          carlStimmung('froh', 1500);
          if (!b.still) stimme(boteSatz(b, p), 5600);
          weiter();
          setTimeout(naechsterBote, C6.ruhig ? 400 : 1700);
        }, 70);
      }
      function gesehen() {
        // still merken (ohne 'zustand' zu senden: die anderen Räume sollen dafür nicht neu zeichnen)
        try { var s = C6.S; if (!s) return; s.himmel = s.himmel && typeof s.himmel === 'object' ? s.himmel : {}; s.himmel.gesehen = Date.now(); if (C6.speichern) C6.speichern(); } catch (e) {}
      }
      // ein Planet leuchtet auf; Carl schaut hin, wenn er nicht gerade selbst dort ist
      function pulsAn(sid, spaeter) {
        var p = hol(sid); if (!p) return;
        pulse[sid] = performance.now() + (spaeter || 0);
        letzterPuls = sid;
        if (carl.flug || carl.unterwegs || (carl.ort.art === 'planet' && carl.ort.id === sid)) return;
        var s = proj(p.pos); if (s[2] > 0.2) carlSchau(s[0], s[1], 3200);
      }
      function pulsMalen(c) {
        var jetzt = performance.now();
        Object.keys(pulse).forEach(function (sid) {
          var k = (jetzt - pulse[sid]) / 1800;
          if (k >= 1) { delete pulse[sid]; return; }
          if (k < 0) return;
          var p = hol(sid); if (!p) { delete pulse[sid]; return; }
          var s = proj(p.pos); if (s[2] < 0.2) return;
          var R = F * p.r / s[2], e = 1 - Math.pow(1 - k, 3), hell = mische(p.farbe, [1, 0.95, 0.8], 0.55);
          var ra = R * (1.7 + 1.3 * e);
          var g = c.createRadialGradient(s[0], s[1], R * 0.8, s[0], s[1], ra);
          g.addColorStop(0, css(hell, 0.6 * (1 - k))); g.addColorStop(1, css(hell, 0));
          c.fillStyle = g; c.beginPath(); c.arc(s[0], s[1], ra, 0, 6.29); c.fill();
          c.strokeStyle = css([1, 0.94, 0.8], 0.9 * Math.pow(1 - k, 1.4)); c.lineWidth = Math.max(1.4, 3.2 * (1 - k));
          c.beginPath(); c.arc(s[0], s[1], R * (1.08 + 1.5 * e), 0, 6.29); c.stroke();
        });
      }
      // Kranz: was unten im Space liegt, kreist als kleine Sterne um den Planeten (Funde in Bernstein)
      function kranzMalen(c) {
        kugeln.forEach(function (k) {
          if (k.kind < 1 || k.kind > 3 || !k.pl || k.R < 5 || (k.al != null && k.al < 0.5)) return;
          var p = k.pl, m = p.marken; if (!m) return;
          var st = [];
          m.dinge.forEach(function (ts) { if (zeigbar(p.id, ts)) st.push(0); });
          m.funde.forEach(function (ts) { if (zeigbar(p.id, ts)) st.push(1); });
          var n = st.length; if (!n) return;
          var rx = k.R * (k.ring ? 2.15 : 1.34) + 5, ry = rx * 0.4, rot = (C6.ruhig ? 0 : zeit * 0.16) + p.seed * 6.28;
          var gr = Math.max(3, Math.min(6.5, k.R * 0.12));
          for (var j = 0; j < n; j++) {
            var a = rot + j / n * Math.PI * 2, x = k.s[0] + Math.cos(a) * rx, y = k.s[1] + Math.sin(a) * ry;
            if (Math.sin(a) < 0 && Math.abs(x - k.s[0]) < k.R * 0.98) continue; // hinter dem Planeten
            if (verdeckt([x, y, k.v[2] - k.r])) continue;
            stern4(c, x, y, gr * 1.7, st[j] ? '#ffc65a' : 'rgba(255,248,228,0.95)', '#ffffff');
          }
        });
      }

      // ——— Lauf: ein Hörer im gemeinsamen Takt (Rückfall: eigener rAF) ———
      // Rückgabe true = weiterlaufen. Bei Gesten und Kamerafahrt jedes Bild, in Ruhe höchstens 30 Bilder/s;
      // nur Carl (ein DOM-Knoten) läuft dann jedes Bild.
      function schritt(now) {
        if (!aktiv) return false;
        if (spielDarf(now)) spielStart(now);
        schnuppeSchritt(now);
        var dtc = Math.min(0.05, (now - (tCarl || now)) / 1000); tCarl = now;
        var lebt = carlLebt(now) || !!spiel || spur.length > 0 || !!feier || rauch.length > 0 || !!carl.traegt || Object.keys(pulse).length > 0 || !!schnuppe;
        var ruht = !geste && !zieh && !tauchen && !Object.keys(neuWachsen).length && Math.abs(schwung) < 0.0005 && Math.abs(soll.dist - cam.dist) < 0.01 && Math.abs(soll.tx - cam.tx) < 0.01 && Math.abs(soll.tz - cam.tz) < 0.01;
        if (tRaf) takt = takt * 0.9 + Math.min(300, now - tRaf) * 0.1; tRaf = now;
        // schwaches Gerät: in Ruhe seltener malen, damit alles andere flüssig bleibt
        var pause = takt > 40 ? 160 : 34;
        if (ruht && tLetzt && now - tLetzt < pause) { if (lebt) carlSetzen(now, dtc); return !C6.ruhig || lebt; }
        var dt = Math.min(0.05, (now - (tLetzt || now)) / 1000); tLetzt = now;
        zeit += dt;
        var bewegt = false;
        if (!C6.ruhig) {
          if (!geste) drehung += dt * 0.03;
          if (!geste && Math.abs(schwung) > 0.0005) { soll.yaw += schwung; cam.yaw += schwung; schwung *= Math.pow(0.04, dt); bewegt = true; }
        }
        if (folge) { var p = hol(folge); if (p) { soll.tx = p.pos[0]; soll.ty = p.pos[1]; soll.tz = p.pos[2]; } }
        var k = C6.ruhig ? 1 : 1 - Math.exp(-dt * (tauchen ? 6 : now < hinaufBis ? 1.7 : 3.2));
        ['yaw', 'pitch', 'dist', 'tx', 'ty', 'tz'].forEach(function (a) {
          if (a === 'dist' && tauchFeder) return;
          var d = soll[a] - cam[a];
          if (Math.abs(d) > 1e-4) { cam[a] += d * k; bewegt = true; }
        });
        if (tauchFeder) {
          // beim Eintauchen: die Distanz federt mit kleinem Überschwingen ans Ziel (kein Ruck)
          var fd = cam.dist - soll.dist;
          tauchFeder.v += (-tauchFeder.k * fd - tauchFeder.d * tauchFeder.v) * dt; cam.dist += tauchFeder.v * dt;
          bewegt = true;
          if (Math.abs(fd) < 0.01 && Math.abs(tauchFeder.v) < 0.02) { cam.dist = soll.dist; tauchFeder = null; }
        }
        bewegen(dt);
        zeichne(now, dtc);
        if (!bewegt && !geste) lichtSetzen(now);
        if (tauchen && now >= tauchen.bis) { var tt = tauchen; tauchen = null; tt.fertig(); }
        return !!(!C6.ruhig || bewegt || lebt || Object.keys(neuWachsen).length || zieh || tauchen);
      }
      function taktAn() {
        if (taktAus) return;
        tLetzt = 0; tRaf = 0; tCarl = 0;
        if (C6.takt && typeof C6.takt.on === 'function') {
          taktAus = C6.takt.on(function () { return schritt(performance.now()); }, { raum: 'netz', ruhig: true });
          taktWecke = function () { try { C6.takt.wecke(); } catch (e) {} };
        } else {
          var f = function (now) { raf = 0; if (aktiv && schritt(now)) raf = requestAnimationFrame(f); };
          taktWecke = function () { if (!raf) raf = requestAnimationFrame(f); };
          taktAus = function () { if (raf) cancelAnimationFrame(raf); raf = 0; };
          taktWecke();
        }
      }
      function taktAb() { if (taktAus) { try { taktAus(); } catch (e) {} } taktAus = null; taktWecke = null; if (raf) cancelAnimationFrame(raf); raf = 0; }
      function weiter() { if (!aktiv) return; tLetzt = 0; if (taktWecke) taktWecke(); else taktAn(); }

      // ——— Fliegen ———
      function fliegZu(id, oeffnen, platz) {
        var p = hol(id); if (!p) return;
        folge = id; ueberblick = false; mitteZeigen();
        soll.dist = Math.max(2.6, p.r * 7.5 + (p.monde.length ? 1.2 : 0));
        soll.pitch = Math.min(soll.pitch, 0.62);
        schliessen(true);
        try { C6.bus.emit('himmel', { was: 'flug', id: id }); } catch (e) {}
        // Carl fliegt voraus (außer er ist gerade als Bote unterwegs)
        if (!carl.unterwegs && !(carl.ort.art === 'planet' && carl.ort.id === id && !carl.flug)) carlFliegZu({ art: 'planet', id: id }, 820, null, 40);
        weiter();
        if (!oeffnen) return;
        var warte = C6.ruhig ? 50 : 900;
        tauchen = {
          bis: performance.now() + warte,
          fertig: function () { eintauchen(p, platz); }
        };
      }
      function eintauchen(p, platz) {
        if (!aktiv) return;
        var hatSpace = C6.space && typeof C6.space.oeffne === 'function';
        if (!hatSpace) { zeigFaden(p.id); return; }
        soll.dist = p.r * 2.4;
        tauchFeder = C6.ruhig ? null : { v: 0, k: 95, d: 11 };
        tauchEl.style.background = 'radial-gradient(circle at 50% ' + Math.round(CY / H * 100) + '%, ' + css(p.farbe, 1) + ' 0%, ' + css(mische(p.farbe, [0.08, 0.1, 0.2], 0.5), 1) + ' 70%)';
        tauchEl.classList.add('c6w-an'); ausSpace = true;
        // Carl taucht voraus hinunter in den Planeten
        if (!carl.unterwegs) carlFliegZu({ art: 'mitte', id: p.id }, 360, null, 10);
        try { C6.bus.emit('himmel', { was: 'oeffne', id: p.id }); } catch (e) {}
        setTimeout(function () {
          try { C6.space.oeffne(p.id, platz ? { place: platz } : undefined); } catch (e) { tauchEl.classList.remove('c6w-an'); zeigFaden(p.id); }
        }, C6.ruhig ? 0 : 380);
      }
      function zuDir() {
        uebersicht(false);
        schliessen(true);
        if (!carl.unterwegs && carl.ort.art !== 'du') carlFliegZu({ art: 'du' }, 900);
        try { C6.bus.emit('himmel', { was: 'ueberblick' }); } catch (e) {}
        weiter();
      }

      // ——— Finger ———
      var zeiger = {}, geste = null, zieh = null;
      function pos(e) { var r = vorn.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
      function treffer(x, y) {
        var best = null, bz = 1e9;
        dinge.forEach(function (d) {
          var a = Math.hypot(x - d.x, y - d.y);
          if (a > d.R) return;
          var prio = (d.art === 'nadel' || d.art === 'knoten') && a < 16 ? -1000 : 0;
          var z = d.z + prio + a * 0.001;
          if (z < bz) { bz = z; best = d; }
        });
        return best;
      }
      vorn.addEventListener('pointerdown', function (e) {
        try { vorn.setPointerCapture(e.pointerId); } catch (x) {}
        var p = pos(e); zeiger[e.pointerId] = p;
        var ids = Object.keys(zeiger);
        schwung = 0;
        if (ids.length === 1) {
          var d = treffer(p[0], p[1]);
          geste = { art: 'dreh', start: p, last: p, ding: d, weg: 0, t: performance.now() };
          // Carl schaut zum Finger
          carlWach();
          if (!carl.flug && !carl.unterwegs) carlSchau(p[0], p[1], 2400);
          if (d && d.art === 'planet' && welt.planeten.length > 1) zieh = { von: d.id, x: p[0], y: p[1], weit: false, ziel: null };
        } else if (ids.length === 2) {
          zieh = null;
          var a = zeiger[ids[0]], b = zeiger[ids[1]];
          geste = { art: 'zoom', d: Math.hypot(a[0] - b[0], a[1] - b[1]), dist: soll.dist, weg: 99 };
        }
        weiter();
      });
      vorn.addEventListener('pointermove', function (e) {
        if (!zeiger[e.pointerId] || !geste) return;
        var p = pos(e); zeiger[e.pointerId] = p;
        if (geste.art === 'zoom') {
          var ids = Object.keys(zeiger); if (ids.length < 2) return;
          var a = zeiger[ids[0]], b = zeiger[ids[1]];
          var d = Math.hypot(a[0] - b[0], a[1] - b[1]);
          soll.dist = cam.dist = Math.max(1.6, Math.min(80, geste.dist * (geste.d || 1) / Math.max(10, d)));
          ueberblick = false; mitteZeigen();
        } else {
          geste.weg = Math.max(geste.weg, Math.hypot(p[0] - geste.start[0], p[1] - geste.start[1]));
          if (zieh && geste.weg > 12) {
            zieh.weit = true; zieh.x = p[0]; zieh.y = p[1];
            var t = treffer(p[0], p[1]); zieh.ziel = t && t.art === 'planet' && t.id !== zieh.von ? t.id : null;
          } else if (!zieh && geste.weg > 6) {
            var dx = p[0] - geste.last[0], dy = p[1] - geste.last[1];
            soll.yaw -= dx * 0.0062; cam.yaw = soll.yaw;
            soll.pitch = cam.pitch = Math.max(0.12, Math.min(1.42, cam.pitch + dy * 0.004));
            schwung = -dx * 0.0062 * 0.6;
            ueberblick = false; mitteZeigen();
          }
          geste.last = p;
        }
        if (C6.ruhig) zeichne();
      });
      function los(e) {
        if (!zeiger[e.pointerId]) return;
        delete zeiger[e.pointerId];
        if (!geste) return;
        var g = geste;
        if (Object.keys(zeiger).length) { if (g.art === 'zoom') { var r = zeiger[Object.keys(zeiger)[0]]; geste = { art: 'dreh', start: r, last: r, weg: 99 }; } return; }
        geste = null;
        var z = zieh; zieh = null;
        if (g.weg < 10 && e.type !== 'pointercancel') {
          schwung = 0;
          var d = g.ding;
          if (!d) schliessen();
          else if (d.art === 'planet') fliegZu(d.id, true);
          else if (d.art === 'mond') fliegZu(d.id, true, d.mond && d.mond.id);
          else if (d.art === 'nadel') zeigNadel(d.n);
          else if (d.art === 'knoten') zeigKnoten(d.k);
          else if (d.art === 'neu') neuerPlanet();
          else if (d.art === 'du') zuDir();
        } else if (z && z.weit && z.ziel) {
          frageKnoten(z.von, z.ziel);
        }
        if (C6.ruhig) schwung = 0;
        weiter();
      }
      vorn.addEventListener('pointerup', los);
      vorn.addEventListener('pointercancel', los);
      vorn.addEventListener('wheel', function (e) {
        if (e.altKey) return;
        e.preventDefault();
        soll.dist = Math.max(1.6, Math.min(80, soll.dist * Math.exp(e.deltaY * 0.0012)));
        if (C6.ruhig) cam.dist = soll.dist;
        ueberblick = false; mitteZeigen();
        weiter();
      }, { passive: false });
      vorn.addEventListener('pointermove', function (e) {
        if (geste || e.pointerType !== 'mouse') return;
        var p = pos(e), d = treffer(p[0], p[1]);
        vorn.style.cursor = d ? 'pointer' : 'grab';
      });

      // ——— Stimme ———
      function stimme(t, ms) {
        if (imRundgang || (C6.rundgang && C6.rundgang.an)) return;
        if (feier) return;   // im Sternbild-Moment schweigt Carl
        clearTimeout(stimmeTimer);
        stimmeEl.textContent = t;
        stimmeEl.classList.add('c6w-an');
        stimmeTimer = setTimeout(function () { stimmeEl.classList.remove('c6w-an'); wink(); }, ms || 6500);
        wink();
      }
      function satz(k, rueck) { try { var s = C6.stimme && C6.stimme.sag(k); if (s && s !== k) return s; } catch (e) {} return rueck; }
      function wink() {
        var n = welt.planeten.length, t = '';
        if (n >= 2 && !welt.knoten.length && !feier && !stimmeEl.classList.contains('c6w-an')) t = 'Zieh von einem Planeten zum anderen. So entsteht ein Sternbild.';
        winkEl.textContent = t;
        winkEl.classList.toggle('c6w-an', !!t);
      }

      // Zugängliche Liste (Tastatur, Vorlesen). Jeder Eintrag liegt genau über seinem Planeten
      // und fängt keine Finger: ein Tipp an seiner Stelle trifft den Planeten selbst.
      var listeOrte = {};
      function listeSetzen() {
        if (!listeEl.firstChild) return;
        var lis = listeEl.children;
        for (var i = 0; i < lis.length; i++) {
          var li = lis[i], id = li.getAttribute('data-id'), k = null;
          for (var j = 0; j < kugeln.length; j++) if (kugeln[j].id === id && kugeln[j].kind >= 1 && kugeln[j].kind <= 3) { k = kugeln[j]; break; }
          var x = k ? Math.round(k.s[0]) : -200, y = k ? Math.round(k.s[1]) : -200, d = k ? Math.max(44, Math.round(k.R * 1.6)) : 44;
          var alt = listeOrte[id];
          if (alt && Math.abs(alt[0] - x) < 3 && Math.abs(alt[1] - y) < 3 && alt[2] === d) continue;
          listeOrte[id] = [x, y, d];
          li.style.setProperty('--x', x + 'px'); li.style.setProperty('--y', y + 'px'); li.style.setProperty('--d', d + 'px');
        }
      }
      function listeBauen() {
        listeEl.textContent = ''; listeOrte = {};
        welt.planeten.forEach(function (p) {
          var li = document.createElement('li'), b = document.createElement('button');
          li.setAttribute('data-id', p.id);
          b.type = 'button'; b.textContent = p.d.titel + ' öffnen';
          b.onclick = function () { fliegZu(p.id, true); };
          b.onfocus = function () { fliegZu(p.id, false); };
          li.appendChild(b); listeEl.appendChild(li);
        });
      }

      // ——— Blatt ———
      function oeffne(html, fokus) {
        blatt.innerHTML = '<button class="c6w-zu" aria-label="Schließen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>' + html;
        blatt.hidden = false;
        buehne.classList.add('c6w-blatt-auf');
        requestAnimationFrame(function () { blatt.classList.add('c6w-an'); });
        blatt.querySelector('.c6w-zu').onclick = function () { schliessen(); };
        if (fokus) setTimeout(function () { var f = blatt.querySelector(fokus); if (f) f.focus(); }, 320);
      }
      function schliessen(still) {
        if (blatt.hidden) return;
        blatt.classList.remove('c6w-an');
        buehne.classList.remove('c6w-blatt-auf');
        setTimeout(function () { if (!blatt.classList.contains('c6w-an')) blatt.hidden = true; }, 320);
      }
      function zeigFaden(id) {
        var s = C6.strings.hol(id); if (!s) return;
        var g = C6.strings.geschichte(id);
        var zeilen = g.map(function (e) {
          var zeichen = e.art === 'perle' ? '<i class="c6w-perle" style="background:' + s.farbe + '"></i>'
            : e.art === 'knoten' ? '<i class="c6w-knoten"></i>'
            : e.art === 'nadel' ? '<i class="c6w-nadel-z"></i>' : '<i class="c6w-anfang" style="border-color:' + s.farbe + '"></i>';
          var text = e.art === 'knoten' ? '<span class="c6w-mit">Sternbild mit „' + esc(e.mit) + '“</span> ' + esc(e.t) : esc(e.t);
          return '<li>' + zeichen + '<span class="c6w-z-t">' + text + '</span><span class="c6w-z-d">' + C6.strings.datum(e.ts) + '</span></li>';
        }).join('');
        oeffne(
          '<p class="c6w-kicker"><i style="background:' + s.farbe + '"></i>' + 'Planet · seit ' + C6.strings.datum(s.erstellt) + '</p>' +
          '<h2 class="c6w-titel">' + esc(s.titel) + '</h2>' +
          '<ol class="c6w-geschichte">' + zeilen + '</ol>' +
          '<form class="c6w-perle-form"><label class="c6w-nur-lesbar" for="c6w-perle-in">Ein Zettel für diesen Space</label>' +
          '<input id="c6w-perle-in" class="c6w-feld" autocomplete="off" maxlength="200" placeholder="Ein Zettel, ein Satz reicht">' +
          '<button class="c6w-knopf c6w-haupt" type="submit">An die Leine</button></form>'
        );
        blatt.querySelector('form').onsubmit = function (ev) {
          ev.preventDefault();
          var v = blatt.querySelector('#c6w-perle-in').value.trim();
          if (!v) { blatt.querySelector('#c6w-perle-in').focus(); return; }
          C6.strings.perle(id, v);
          zeigFaden(id);
          stimme('Hängt jetzt als Zettel in „' + s.titel + '“.', 4000);
        };
      }
      function zeigKnoten(k) {
        var a = C6.strings.hol(k.a), b = C6.strings.hol(k.b);
        oeffne('<p class="c6w-kicker"><i class="c6w-knoten c6w-h-sternzeichen"></i>Sternbild · ' + C6.strings.datum(k.ts) + '</p>' +
          '<h2 class="c6w-titel c6w-carl">' + esc(k.satz) + '</h2>' +
          '<p class="c6w-leise">zwischen „' + esc(a ? a.titel : '') + '“ und „' + esc(b ? b.titel : '') + '“</p>');
      }
      function zeigNadel(n) {
        var s = n.stringId && C6.strings.hol(n.stringId);
        oeffne('<p class="c6w-kicker"><i class="c6w-nadel-z"></i>Kernsatz · ' + C6.strings.datum(n.ts) + '</p>' +
          '<h2 class="c6w-titel c6w-carl c6w-rot">' + esc(n.satz) + '</h2>' +
          (s ? '<p class="c6w-leise">leuchtet über „' + esc(s.titel) + '“</p>' : '<p class="c6w-leise">Das blieb übrig, als der Heuhaufen abgebrannt war.</p>'));
      }
      function frageKnoten(a, b) {
        var A = C6.strings.hol(a), B = C6.strings.hol(b); if (!A || !B) return;
        oeffne('<p class="c6w-kicker"><i class="c6w-knoten c6w-h-sternzeichen"></i>Neues Sternbild</p>' +
          '<h2 class="c6w-titel c6w-carl">Was verbindet „' + esc(A.titel) + '“ und „' + esc(B.titel) + '“?</h2>' +
          '<form><label class="c6w-nur-lesbar" for="c6w-knoten-in">Was die beiden verbindet</label>' +
          '<input id="c6w-knoten-in" class="c6w-feld" autocomplete="off" maxlength="200" placeholder="Ein Satz, deiner">' +
          '<button class="c6w-knopf c6w-haupt" type="submit">Verbinden</button></form>', '#c6w-knoten-in');
        blatt.querySelector('form').onsubmit = function (ev) {
          ev.preventDefault();
          var v = blatt.querySelector('#c6w-knoten-in').value.trim();
          if (!v) { blatt.querySelector('#c6w-knoten-in').focus(); return; }
          C6.strings.knoten(a, b, v);
          try { C6.gespraech && C6.gespraech('du', v); } catch (e2) {}
          schliessen(true);
          sternbildMoment(a, b);
        };
      }
      // Der Höhepunkt: die Kamera nimmt beide Planeten ins Bild, der rote Faden zeichnet sich,
      // beide leuchten, dein Satz erscheint als Name am Himmel. Carl schaut nur hin und schweigt.
      var feier = null, hinaufBis = 0;
      function sternbildMoment(a, b) {
        var kk = C6.strings.knotenAlle(), k = kk[kk.length - 1], A = hol(a), B = hol(b);
        if (!k || !A || !B) return;
        feier = { ts: k.ts, t0: performance.now() - (C6.ruhig ? 4000 : 0), a: a, b: b };
        lesen();
        var m = [(A.pos[0] + B.pos[0]) / 2, (A.pos[1] + B.pos[1]) / 2 + 0.6, (A.pos[2] + B.pos[2]) / 2];
        var l = Math.hypot(B.pos[0] - A.pos[0], B.pos[2] - A.pos[2]);
        folge = null; ueberblick = false; mitteZeigen && mitteZeigen();
        soll.tx = m[0]; soll.ty = m[1]; soll.tz = m[2];
        soll.dist = Math.max(4.2, l * (C6.geraet === 'computer' ? 1.25 : 1.9) + 2.4); soll.pitch = Math.min(soll.pitch, 0.55);
        clearTimeout(stimmeTimer); stimmeEl.classList.remove('c6w-an');
        pulsAn(a, 1500); pulsAn(b, 1760);
        try { if (carlCtl && !carl.unterwegs) { carlStimmung('staunt'); setTimeout(function () { if (feier) { var q = proj(m); carlSchau(q[0], q[1] - 20, 4200); } }, 600); } } catch (e) {}
        weiter();
        setTimeout(function () {
          if (!feier || feier.ts !== k.ts) return;
          feier = null;
          if (aktiv && !folge) { uebersicht(false); weiter(); }   // zurück in den Überblick, wo das Sternbild nun klein mit Namen steht
          mitteZeigen(); wink();
        }, 6200);
      }
      function neuerPlanet() {
        oeffne('<p class="c6w-kicker">Neuer Planet</p>' +
          '<h2 class="c6w-titel c6w-carl">Woran denkst du gerade?</h2>' +
          '<form><label class="c6w-nur-lesbar" for="c6w-neu-in">Name des Planeten</label>' +
          '<input id="c6w-neu-in" class="c6w-feld" autocomplete="off" maxlength="48" placeholder="Ein paar Wörter">' +
          '<button class="c6w-knopf c6w-haupt" type="submit">Aufgehen lassen</button></form>', '#c6w-neu-in');
        var art = 'projekt';
        blatt.querySelector('form').onsubmit = function (ev) {
          ev.preventDefault();
          var v = blatt.querySelector('#c6w-neu-in').value.trim();
          if (!v) { blatt.querySelector('#c6w-neu-in').focus(); return; }
          var id = C6.strings.neu({ titel: v, art: art }).id;
          schliessen(true);
          lesen();
          if (!C6.ruhig) neuWachsen[id] = performance.now();
          var n = welt.planeten.length;
          stimme(n === 1 ? '„' + v + '“ ist dein erster Planet. Unten ist er ein Space. Tipp ihn an, dann gehen wir hinein.' : '„' + v + '“ ist aufgegangen. Tipp ihn an, dann gehen wir hinein.', 6000);
          setTimeout(function () { fliegZu(id, false); }, C6.ruhig ? 0 : 700);
          wink();
          weiter();
        };
      }

      buehne.querySelector('[data-tu="neu"]').onclick = neuerPlanet;
      mitteKnopf.onclick = zuDir;
      buehne.querySelector('.c6w-h-teleskop').onclick = function () { if (C6.geh) C6.geh('teleskop'); };
      buehne.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !blatt.hidden) { e.stopPropagation(); schliessen(); } });
      if (C6.bus) {
        C6.bus.on('esc', function (ev) {
          if (C6.jetzt !== 'netz' || !ev || ev.erledigt) return;
          if (!blatt.hidden) { schliessen(); ev.erledigt = true; }
          else if (!ueberblick || folge) { zuDir(); ev.erledigt = true; }
        });
        C6.bus.on('rundgang', function (an) { if (!an) { imRundgang = false; buehne.classList.remove('c6w-im-rundgang'); rundgangAussteigen(); wink(); } });
        C6.bus.on('strings', function (ev) {
          lesen(); wink();
          if (!aktiv) return;
          bewegen(0);
          // was hier oben entsteht, bringt Carl still zum Planeten
          if (ev && ev.was === 'perle' && ev.id) bote({ sid: ev.id, was: 'perle', still: true, n: 1 });
          if (ev && ev.was === 'nadel' && ev.id) bote({ sid: ev.id, was: 'nadel', n: 1 });
          if (ev && ev.was === 'knoten') {
            var kk = C6.strings.knotenAlle(), k = kk[kk.length - 1];
            if (k && !feier) { pulsAn(k.a); pulsAn(k.b, 260); }
          }
          zeichne(); weiter();
        });
        // wie unten, so oben: was im Space entsteht, leuchtet am Planeten auf
        C6.bus.on('space', function (ev) {
          if (!ev || ev.was !== 'ding' || !ev.stringId) return;
          var d = null;
          try { (C6.space.dinge(ev.stringId) || []).forEach(function (x) { if (x.id === ev.id) d = x; }); } catch (e) {}
          if (d && C6.strings.vonOben(d)) return;
          lesen();
          if (aktiv) bote({ sid: ev.stringId, was: 'ding', extra: d, n: 1, still: true });
        });
        C6.bus.on('auftrag', function (ev) {
          if (!ev || !ev.stringId) return;
          lesen();
          if (aktiv && ev.was === 'fund') bote({ sid: ev.stringId, was: 'fund', extra: ev, n: 1 });
          else if (aktiv && ev.was === 'erledigt') bote({ sid: ev.stringId, was: 'perle', still: true, n: 1 });
        });
        C6.bus.on('geraet', function () { if (carlCtl) { try { carlCtl.groesse(carlPx()); } catch (e) {} } });
        C6.bus.on('zustand', function () { if (!aktiv) return; var m = JSON.stringify(welt.planeten.map(function (p) { return p.monde.length; })), m2 = JSON.stringify(C6.strings.planeten().map(function (p) { return p.monde.length; })); if (m !== m2) { lesen(); } });
        C6.bus.on('kleid', function (k) {
          try { if (carlCtl) carlCtl.kleid(k || (C6.laden && C6.laden.an())); } catch (e) {}
          // das Gefährt bleibt (oder wechselt mit der Wahl im Laden)
          if (carlCtl && carl.sitzt && aktiv) { var vorher = carl.gef; carlEinsteigen(); if (!carl.gef && vorher) { try { carlCtl.kleid({ gefaehrt: null }); } catch (e) {} } }
        });
        // Wartezeit: schaut sich um, lehnt sich zurück, nickt im Gefährt ein; wacht bei Berührung auf
        C6.bus.on('warte', function (ev) {
          if (!aktiv || C6.jetzt !== 'netz' || !carlCtl || imRundgang || carl.flug || carl.unterwegs || spiel || couchAn) return;
          var st = ev && ev.stufe;
          if (st === 1) {
            var z = letzterPuls && hol(letzterPuls), s = z && proj(z.pos);
            if (s && s[2] > 0.2) carlSchau(s[0], s[1], 3200);
            else { try { carlCtl.blick(-0.55, -0.15); } catch (e) {} carl.blickBis = performance.now() + 3200; }
          } else if (st === 2) {
            carl.lehnt = true; carl.blickBis = 0;
            try { carlCtl.blick(0.4, -0.75); carlCtl.stimmung('ruhig'); } catch (e) {}
          } else if (st === 3) {
            // die Figur nickt von sich aus ein (ctl.nick), wenn sie das kann; sonst schläft er hier
            carl.schlaeft = true; carl.lehnt = true; carl.blickBis = 0;
            try { if (typeof carlCtl.nick !== 'function') { carlCtl.stimmung('schlaeft'); carl.selbstSchlaf = true; } } catch (e) {}
          }
          weiter();
        });
        C6.bus.on('wach', function () { if (aktiv) carlWach(); });
        // Ende der Höhen-Kamerafahrt: einmal nachmessen, damit der Canvas scharf bleibt
        C6.bus.on('kamera', function (ev) { if (aktiv && ev && ev.was === 'ende' && (buehne.clientWidth !== W || buehne.clientHeight !== H)) groesse(); });
      }

      function groesse() {
        W = Math.max(1, buehne.clientWidth); H = Math.max(1, buehne.clientHeight);
        DPR = Math.min(3, window.devicePixelRatio || 1);
        [hinten, glc, vorn].forEach(function (cv) {
          cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
          cv.style.width = W + 'px'; cv.style.height = H + 'px';
        });
        rahmen();
        if (ueberblick && !folge) uebersicht(true);
        zeichne();
      }
      var ro = window.ResizeObserver ? new ResizeObserver(function () { if (aktiv) groesse(); }) : null;
      if (ro) ro.observe(buehne);

      glOk = glAn();
      if (!glOk) buehne.classList.add('c6w-h-flach');
      lesen();

      // Ankunft im Himmel: Carl kommt mit (von unten herauf, aus dem Planeten oder von oben herab)
      // und bringt, was unten seit dem letzten Besuch entstanden ist.
      function ankunft(ausDemSpace, ziel) {
        var h = (C6.S && C6.S.himmel) || {};
        var seit = h.gesehen || (Date.now() - 6 * 3600e3);
        var neu = neuigkeiten(seit);
        neu.forEach(function (b) { wartet[b.sid] = seit; });
        gesehen();
        var vor = C6.vorher && C6.raeume && C6.raeume[C6.vorher];
        var von = ausDemSpace && folge ? { art: 'planet', id: folge } : (vor && vor.hoehe === 'teleskop' ? { art: 'oben' } : { art: 'unten' });
        var nach = ziel && hol(ziel) ? { art: 'planet', id: ziel } : (folge && hol(folge) ? { art: 'planet', id: folge } : { art: 'du' });
        carl.flug = null; carl.ort = von; carl.unterwegs = true; carl.traegt = null;
        var q = ortPunkt(von); carl.x = q[0]; carl.y = q[1]; carl.s = q[2]; carl.w = ortWelt(von); stillSeit = performance.now();
        // Zettel und Briefe bringt er still (der Planet leuchtet auf); nur Kernsatz und Fund bekommen einen Satz
        function los() { neu.reverse().forEach(function (b) { if (b.was !== 'nadel' && b.was !== 'fund') b.still = true; boten.push(b); }); naechsterBote(); }
        // Von unten steigt er mit dem Rotor herauf und setzt sich oben in sein Gefährt;
        // aus dem Planeten oder vom Teleskop kommt er schon darin an.
        var vonUnten = von.art === 'unten';
        if (!vonUnten) carlEinsteigen();
        function angekommen() {
          if (!aktiv) return;
          if (vonUnten) carlEinsteigen();
          los();
        }
        if (von.art === 'planet') { carlFliegZu(von, 0); setTimeout(function () { if (aktiv) los(); }, C6.ruhig ? 0 : 700); }
        else carlFliegZu(nach, C6.ruhig ? 0 : 1250, angekommen, 0);
      }

      return {
        betreten: function (o) {
          o = o || {};
          var erneut = aktiv;
          imRundgang = !!(o.rundgang || (C6.rundgang && C6.rundgang.an));
          buehne.classList.toggle('c6w-im-rundgang', imRundgang);
          aktiv = true; tLetzt = 0;
          if (!imRundgang) carlMalen();
          carlEl.hidden = imRundgang;
          if (imRundgang) setTimeout(rundgangEinsteigen, 60); else rundgangAussteigen();
          carl.schlaeft = false; carl.lehnt = false; carl.blickBis = 0;
          if (!schnuppeNaechste) schnuppePlanen(performance.now());
          taktAn();
          // die Kamerafahrt der Höhe skaliert die Bühne; danach einmal nachmessen, damit der Canvas scharf bleibt
          setTimeout(function () { if (aktiv && (buehne.clientWidth !== W || buehne.clientHeight !== H)) groesse(); }, 480);
          if (!C6.strings.alle().length && C6.strings.erster) C6.strings.erster();
          lesen();
          var war = ausSpace; ausSpace = false;
          W = Math.max(1, buehne.clientWidth); H = Math.max(1, buehne.clientHeight);
          groesse();
          if (o.ueberblick && !o.oeffne && !o.faden) { folge = null; zuDir(); }
          var ziel = o.oeffne || o.faden;
          if (ziel && hol(ziel)) {
            folge = ziel; ueberblick = false;
            var p = hol(ziel); bewegen(0);
            cam.tx = soll.tx = p.pos[0]; cam.ty = soll.ty = p.pos[1]; cam.tz = soll.tz = p.pos[2];
            fliegZu(ziel, !!o.oeffne);
          } else if (war && folge && hol(folge)) {
            // Auftauchen aus dem Space: weich zurück auf Abstand
            var q = hol(folge); soll.dist = Math.max(2.6, q.r * 7.5 + (q.monde.length ? 1.2 : 0));
          } else if (!folge) {
            uebersicht(true);
            // Hinauf: die Kamera beginnt dicht über dir (der Sonne) und zieht sich zurück, bis alle Planeten im Bild sind
            if (!erneut && !C6.ruhig && !imRundgang) { cam.dist = soll.dist * 0.28; cam.pitch = Math.min(1.42, soll.pitch + 0.6); cam.yaw = soll.yaw - 0.6; tLetzt = 0; hinaufBis = performance.now() + 2200; }
          }
          tauchEl.classList.remove('c6w-an');
          mitteZeigen();
          var n = welt.planeten.length;
          var erstBesuch = !(C6.S.himmel && C6.S.himmel.begruesst);
          if (!imRundgang && !ziel && (erstBesuch || !n)) {
            try { C6.S.himmel = C6.S.himmel && typeof C6.S.himmel === 'object' ? C6.S.himmel : {}; if (n) C6.S.himmel.begruesst = Date.now(); } catch (e) {}
            if (!n) stimme(satz('himmel.leer', 'Dein Himmel ist noch still. Woran denkst du gerade? Daraus wird dein erster Planet.'), 9000);
            else stimme(satz('himmel.raum', 'Das bist du, in der Mitte. Alles, woran du denkst, kreist um dich. Tipp einen Planeten an, dann fliegen wir hin.'), 7000);
          }
          if (o.zeig === 'neu') setTimeout(neuerPlanet, 400);
          wink();
          bewegen(0);
          if (!imRundgang && !erneut) ankunft(war, ziel);
          zeichne(); weiter();
        },
        verlassen: function () {
          aktiv = false; taktAb(); zieh = null; geste = null; zeiger = {}; schwung = 0;
          tauchen = null; tauchFeder = null; schnuppe = null;
          boten = []; wartet = {}; pulse = {}; carl.flug = null; carl.unterwegs = false; carl.traegt = null; carlFlieg(false); rauch.length = 0; fahrt.x = null;
          spiel = null; spur = []; couchAn = false; couchEl.hidden = true; carl.ort = { art: 'du' }; carl.w = null;
          // beim Abstieg steht er auf; das Gefährt bleibt hier oben
          carlAussteigen(); rundgangAussteigen(); carlWach(); carl.wipp.x = 0; carl.wipp.v = 0;
          if (!imRundgang) gesehen();
          schliessen(true);
          setTimeout(function () { if (!aktiv) tauchEl.classList.remove('c6w-an'); }, 700);
        },
        groesse: groesse
      };
    }
  });
})();
