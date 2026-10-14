// Zuhause: Carls Stube. Der Raum ist der Gesprächsplatz.
/* Carls eigener Platz: ein niedriges Filzsofa in Kieselform (Lehne wie ein zweiter Kiesel, Armlehnen als kleine Kiesel) */
var SOFA = '<svg viewBox="0 0 520 220">' +
  '<defs><linearGradient id="c6m-eg-sofa" gradientUnits="userSpaceOnUse" x1="40" y1="60" x2="480" y2="180"><stop offset=".3" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".2"/></linearGradient></defs>' +
  '<rect x="92" y="196" width="22" height="16" rx="6" fill="#8a6744" stroke="#2b2722" stroke-width="3"/>' +
  '<rect x="406" y="196" width="22" height="16" rx="6" fill="#8a6744" stroke="#2b2722" stroke-width="3"/>' +
  '<path d="M70 168 C58 92 150 30 262 30 C374 30 466 88 452 168 Z" fill="#c9805a" stroke="#2b2722" stroke-width="3.5" stroke-linejoin="round"/>' +
  '<path d="M118 92 C160 58 220 48 268 50" fill="none" stroke="#e8b08c" stroke-width="10" stroke-linecap="round" opacity=".55"/>' +
  '<circle cx="262" cy="96" r="9" fill="#8ea37a" stroke="#2b2722" stroke-width="3"/>' +
  '<path d="M60 150 C60 128 92 120 132 126 L388 126 C428 120 460 128 460 150 L460 186 C460 198 450 204 438 204 L82 204 C70 204 60 198 60 186 Z" fill="#dc966d" stroke="#2b2722" stroke-width="3.5" stroke-linejoin="round"/>' +
  '<path d="M96 140 C180 134 340 134 424 140" fill="none" stroke="#f0bf9c" stroke-width="7" stroke-linecap="round" opacity=".7"/>' +
  '<path d="M18 160 C14 120 44 104 76 110 C102 115 108 140 104 170 C100 196 84 206 58 206 C32 206 20 190 18 160 Z" fill="#c9805a" stroke="#2b2722" stroke-width="3.5"/>' +
  '<path d="M502 160 C506 120 476 104 444 110 C418 115 412 140 416 170 C420 196 436 206 462 206 C488 206 500 190 502 160 Z" fill="#c9805a" stroke="#2b2722" stroke-width="3.5"/>' +
  '<path d="M36 132 C44 120 60 116 74 118" fill="none" stroke="#e8b08c" stroke-width="6" stroke-linecap="round" opacity=".6"/>' +
  '<path d="M446 118 C460 116 474 122 482 132" fill="none" stroke="#e8b08c" stroke-width="6" stroke-linecap="round" opacity=".6"/>' +
  '</svg>';
var C6 = window.C6;
if (!C6 || !C6.raum) return;
var D = document;
function mach(tag, cls, vater) { var e = D.createElement(tag); if (cls) e.className = cls; if (vater) vater.appendChild(e); return e; }
function ruhig() { return !!C6.ruhig; }

var FENSTER = '<svg viewBox="0 0 160 196" aria-hidden="true">' +
  '<defs><linearGradient id="c6z-himmel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--c6z-h1)"/><stop offset="1" style="stop-color:var(--c6z-h2)"/></linearGradient>' +
  '<clipPath id="c6z-glas"><rect x="18" y="14" width="124" height="128"/></clipPath></defs>' +
  '<rect x="10" y="6" width="140" height="144" rx="3" fill="#efe4d0" stroke="#2b2722" stroke-width="2.6"/>' +
  '<g clip-path="url(#c6z-glas)"><rect x="18" y="14" width="124" height="128" fill="url(#c6z-himmel)"/>' +
  '<g class="c6z-sterne" fill="#fff6dc"><g class="c6m-funkeln"><circle cx="40" cy="34" r="1.6"/><circle cx="104" cy="28" r="1.2"/><circle cx="124" cy="60" r="1.5"/><circle cx="62" cy="58" r="1"/><circle cx="90" cy="48" r="1.3"/></g></g>' +
  '<g class="c6z-sonne"><circle cx="0" cy="0" r="13" style="fill:var(--c6z-sonne)"/><circle cx="0" cy="0" r="22" style="fill:var(--c6z-sonne)" opacity=".22"/></g>' +
  '<path class="c6z-mond" d="M108,40 a13,13 0 1 0 12,18 a10,10 0 1 1 -12,-18z" fill="#fff3cf"/>' +
  '<g class="c6m-wolken" style="fill:var(--c6m-wolke)"><path d="M-40,58 c2,-9 14,-11 19,-5 c4,-8 18,-7 20,2 c8,-2 13,5 10,10 H-38 c-4,-1 -4,-5 -2,-7z"/><path d="M30,36 c2,-7 11,-9 15,-4 c3,-6 14,-5 15,2 c6,-1 10,4 8,8 H32 c-3,-1 -3,-4 -2,-6z" opacity=".8"/><path d="M98,70 c2,-6 10,-7 13,-3 c3,-5 12,-4 13,2 c5,-1 8,3 6,6 H100 c-3,-1 -3,-3 -2,-5z" opacity=".7"/></g>' +
  '<path d="M18,118 C44,100 66,104 86,112 C104,98 126,96 142,106 V142 H18Z" style="fill:var(--c6z-huegel)"/>' +
  '<path d="M18,130 C50,120 92,126 142,120 V142 H18Z" style="fill:var(--c6z-huegel2)"/>' +
  '<path d="M112,104 v-14 M106,96 q6,-12 12,0 q-6,4 -12,0z" stroke="#2b2722" stroke-width="1.4" style="fill:var(--c6z-huegel2)"/>' +
  '</g>' +
  '<rect x="18" y="14" width="124" height="128" fill="none" stroke="#2b2722" stroke-width="2.2"/>' +
  '<path d="M80,14V142M18,78H142" stroke="#efe4d0" stroke-width="5"/><path d="M80,14V142M18,78H142" stroke="#2b2722" stroke-width="1.4" opacity=".55"/>' +
  '<ellipse cx="80" cy="161" rx="74" ry="4.5" fill="rgba(43,39,34,.16)"/><rect x="2" y="146" width="156" height="12" rx="3" fill="#d9c3a2" stroke="#2b2722" stroke-width="2.4"/>' +
  '<path d="M114,146 l3,-18 h22 l3,18z" fill="#c98b6b" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>' +
  '<g class="c6m-pflanze"><path d="M128,128 q-1,-9 1,-14" fill="none" stroke="#2b2722" stroke-width="2.2" stroke-linecap="round"/>' +
  '<path d="M129,114 c-10,-2 -14,-9 -12,-12 c6,0 11,4 12,12z M129,114 c8,-3 12,-10 10,-14 c-6,1 -10,6 -10,14z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.8" stroke-linejoin="round"/></g>' +
  '<g class="c6m-tasse"><g class="c6m-dampf"><path d="M46,126 c-3,-4 2,-7 -1,-11" fill="none" stroke="#e8dcc6" stroke-width="1.6" stroke-linecap="round"/><path d="M52,124 c-3,-4 2,-7 -1,-10" fill="none" stroke="#e8dcc6" stroke-width="1.6" stroke-linecap="round" opacity=".7"/></g>' +
  '<path d="M40,132 h18 l-2,13 q-7,3 -14,0z" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.8" stroke-linejoin="round"/><path d="M58,135 q6,0 5,5 q-1,4 -6,4" fill="none" stroke="#2b2722" stroke-width="1.6"/><ellipse cx="48" cy="146" rx="11" ry="2" fill="rgba(43,39,34,.18)"/></g>' +
  '<g class="c6m-vogel" opacity="0"><ellipse cx="0" cy="0" rx="8" ry="5.5" fill="#8f8277" stroke="#2b2722" stroke-width="1.5"/><circle cx="7" cy="-4" r="4" fill="#a39585" stroke="#2b2722" stroke-width="1.5"/><path d="M11,-4 l4,1 -4,1.4z" fill="#e2b93b" stroke="#2b2722" stroke-width="1"/><circle cx="8" cy="-5" r=".9" fill="#2b2722"/><path d="M-8,-1 l-7,-3 M-8,1 l-7,2" stroke="#2b2722" stroke-width="1.4" stroke-linecap="round"/><path class="c6m-fluegel" d="M-3,-3 q4,-6 9,-2 q-5,1 -9,2z" fill="#7a6d62" stroke="#2b2722" stroke-width="1.2"/><path d="M-2,5 v4 M3,5 v4" stroke="#2b2722" stroke-width="1.2"/></g>' +
  '<g class="c6m-vorhang"><path d="M6,4 C22,30 18,90 30,150 L8,150 C2,100 2,40 6,4Z" fill="#dccdb0" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>' +
  '<path d="M12,20 C16,60 14,110 20,146" fill="none" stroke="#2b2722" stroke-width="1.2" opacity=".35"/></g>' +
  '</svg>';

var SESSEL = '<svg viewBox="0 0 220 180" aria-hidden="true">' +
  '<path d="M40,30 C40,8 180,8 180,30 L184,118 L36,118Z" fill="#8fa79e" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' +
  '<path d="M64,36 C66,22 154,22 156,36" fill="none" stroke="#2b2722" stroke-width="1.4" opacity=".35"/>' +
  '<path d="M44,104 C44,92 176,92 176,104 L178,140 L42,140Z" fill="#9fb6ad" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' +
  '<path d="M12,80 C12,64 44,62 46,80 L46,150 L12,150Z" fill="#7d958c" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' +
  '<path d="M174,80 C176,62 208,64 208,80 L208,150 L174,150Z" fill="#7d958c" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' +
  '<path d="M150,60 C150,44 196,46 194,66 C192,82 152,80 150,60Z" fill="#e4c7a0" stroke="#2b2722" stroke-width="2.2"/>' +
  '<path d="M156,58 q18,6 34,2" fill="none" stroke="#2b2722" stroke-width="1.2" opacity=".4"/>' +
  '<path d="M22,150 v18 M198,150 v18 M60,140 v14 M160,140 v14" stroke="#2b2722" stroke-width="5" stroke-linecap="round"/>' +
  '<rect x="12" y="140" width="196" height="12" rx="4" fill="#6f857c" stroke="#2b2722" stroke-width="2.4"/>' +
  '<defs><linearGradient id="c6m-eg-sessel" gradientUnits="userSpaceOnUse" x1="20" y1="40" x2="200" y2="140"><stop offset=".35" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".22"/></linearGradient></defs>' +
  '<g class="c6m-eigen" fill="url(#c6m-eg-sessel)" pointer-events="none"><path d="M40,30 C40,8 180,8 180,30 L184,118 L36,118Z"/><path d="M44,104 C44,92 176,92 176,104 L178,140 L42,140Z"/><path d="M12,80 C12,64 44,62 46,80 L46,150 L12,150Z"/><path d="M174,80 C176,62 208,64 208,80 L208,150 L174,150Z"/></g>' +
  '</svg>';

var TUER = '<svg viewBox="0 0 120 230" aria-hidden="true">' +
  '<rect x="4" y="4" width="112" height="226" rx="3" fill="#e2d2b8" stroke="#2b2722" stroke-width="2.6"/>' +
  '<rect x="14" y="14" width="92" height="216" fill="#4a3a2c"/>' +
  '<path class="c6z-tuer-glut" d="M14,230 L14,14 L106,14 L106,230Z" fill="#f2c27a" opacity="0"/>' +
  '<g class="c6z-tuerblatt"><rect x="14" y="14" width="92" height="216" fill="#c7a27c" stroke="#2b2722" stroke-width="2.4"/>' +
  '<rect x="26" y="28" width="68" height="74" rx="3" fill="none" stroke="#2b2722" stroke-width="1.8" opacity=".55"/>' +
  '<rect x="26" y="116" width="68" height="96" rx="3" fill="none" stroke="#2b2722" stroke-width="1.8" opacity=".55"/>' +
  '<circle cx="92" cy="124" r="5.5" fill="#e2b93b" stroke="#2b2722" stroke-width="2"/></g>' +
  '<rect class="c6m-spalt" x="14" y="227" width="92" height="3" fill="#f2c27a"/><rect class="c6m-spalt" x="104" y="16" width="2" height="212" fill="#f2c27a"/>' +
  '</svg>';

var BILD = '<svg viewBox="0 0 120 92" aria-hidden="true">' +
  '<rect x="3" y="3" width="114" height="86" rx="2" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.6"/>' +
  '<rect x="11" y="11" width="98" height="70" fill="none" stroke="#c9a27a" stroke-width="3"/>' +
  '<g fill="none" stroke="#2b2722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
  '<circle cx="38" cy="58" r="13"/><circle cx="84" cy="58" r="13"/><path d="M38,58 L52,38 L74,38 L84,58 M52,38 L60,58 L74,38 M60,58 H38 M50,32 h8 M72,38 l-3,-8 h8"/></g>' +
  '<path d="M60,4 L54,-6 M60,4 L66,-6" stroke="#2b2722" stroke-width="1.6" stroke-linecap="round" fill="none"/>' +
  '</svg>';

var KNAEUEL = '<svg viewBox="0 0 120 64" aria-hidden="true">' +
  '<path class="c6z-faden-lose" d="M52,54 C70,62 86,54 98,58 S114,62 118,56" fill="none" stroke="#c9952f" stroke-width="2.4" stroke-linecap="round"/>' +
  '<g class="c6z-ball"><circle cx="30" cy="34" r="26" fill="#dcaa45" stroke="#2b2722" stroke-width="2.6"/>' +
  '<g fill="none" stroke="#a87a22" stroke-width="2" stroke-linecap="round"><path d="M10,24 C24,30 40,30 54,22"/><path d="M8,36 C24,42 42,40 56,32"/><path d="M14,48 C26,52 40,52 50,46"/><path d="M22,10 C30,24 30,46 24,58"/><path d="M38,9 C44,22 46,40 40,58"/></g>' +
  '<circle cx="30" cy="34" r="26" fill="none" stroke="#2b2722" stroke-width="2.6"/></g>' +
  '</svg>';

var LAMPE = '<svg viewBox="0 0 80 260" aria-hidden="true">' +
  '<path d="M40,58 V246" stroke="#2b2722" stroke-width="3.4"/><ellipse cx="40" cy="250" rx="22" ry="6" fill="#6f857c" stroke="#2b2722" stroke-width="2.4"/>' +
  '<path d="M14,58 L24,8 H56 L66,58Z" fill="#efe1c4" stroke="#2b2722" stroke-width="2.6" stroke-linejoin="round"/>' +
  '<defs><linearGradient id="c6m-eg-lampe" gradientUnits="userSpaceOnUse" x1="14" y1="30" x2="66" y2="30"><stop offset=".4" stop-color="#2b2722" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".16"/></linearGradient></defs>' +
  '<path class="c6m-eigen" d="M14,58 L24,8 H56 L66,58Z" fill="url(#c6m-eg-lampe)" pointer-events="none"/>' +
  '<path class="c6z-lampen-licht" d="M18,56 L62,56 L58,40 L22,40Z" fill="#f6c86a" opacity="0"/>' +
  '</svg>';

var REGAL = '<svg viewBox="0 0 200 70" aria-hidden="true">' +
  '<path d="M6,40 h188" stroke="#2b2722" stroke-width="2.4"/><rect x="4" y="40" width="192" height="9" rx="2" fill="#d2b089" stroke="#2b2722" stroke-width="2.2"/>' +
  '<path d="M24,49 l-6,12 M176,49 l6,12" stroke="#2b2722" stroke-width="2" stroke-linecap="round"/>' +
  '<rect x="14" y="14" width="11" height="26" rx="1.5" fill="#a4492e" stroke="#2b2722" stroke-width="2"/>' +
  '<rect x="25" y="10" width="9" height="30" rx="1.5" fill="#2f5f8a" stroke="#2b2722" stroke-width="2"/>' +
  '<rect x="34" y="16" width="12" height="24" rx="1.5" fill="#e2b93b" stroke="#2b2722" stroke-width="2"/>' +
  '<path d="M48,40 l10,-24 l8,3.4 l-10,24z" fill="#5f7f3e" stroke="#2b2722" stroke-width="2" stroke-linejoin="round"/>' +
  '<path d="M17,20h5M28,16h3M37,22h6" stroke="#fbf7f0" stroke-width="1.6" stroke-linecap="round" opacity=".7"/>' +
  '<path d="M66,40 c0,-7 5,-10 11,-9 c6,1 8,5 7,9z" fill="#b9ad9c" stroke="#2b2722" stroke-width="2"/>' +
  '<path d="M90,40 l2,-13 h22 l2,13z" fill="#c98b6b" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round"/>' +
  '<g class="c6m-pflanze"><path d="M103,27 q-1,-8 1,-13" fill="none" stroke="#2b2722" stroke-width="2" stroke-linecap="round"/>' +
  '<path d="M104,14 c-9,-2 -13,-8 -11,-11 c6,0 10,4 11,11z M104,14 c7,-3 11,-9 9,-13 c-6,1 -9,6 -9,13z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.6" stroke-linejoin="round"/></g>' +
  '<path d="M140,24 h18 l-2,16 q-7,3 -14,0z" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.8" stroke-linejoin="round"/><path d="M158,28 q6,0 5,5 q-1,4 -6,4" fill="none" stroke="#2b2722" stroke-width="1.5"/>' +
  '<ellipse cx="34" cy="41" rx="22" ry="2" fill="rgba(43,39,34,.14)"/><ellipse cx="75" cy="41" rx="9" ry="1.6" fill="rgba(43,39,34,.14)"/><ellipse cx="103" cy="41" rx="13" ry="2" fill="rgba(43,39,34,.14)"/><ellipse cx="149" cy="41" rx="10" ry="1.8" fill="rgba(43,39,34,.14)"/>' +
  '</svg>';
var BILD2 = '<svg viewBox="0 0 84 100" aria-hidden="true">' +
  '<rect x="3" y="3" width="78" height="94" rx="2" fill="#fbf7f0" stroke="#2b2722" stroke-width="2.4"/><rect x="10" y="10" width="64" height="80" fill="none" stroke="#c9a27a" stroke-width="2.6"/>' +
  '<g fill="none" stroke="#2b2722" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M42,78 q-2,-18 1,-34"/><path d="M43,46 c-14,-3 -20,-13 -17,-19 c9,0 16,7 17,19z"/><path d="M43,46 c12,-5 18,-15 15,-21 c-9,1 -14,9 -15,21z"/><path d="M26,80 q16,-5 32,0"/></g>' +
  '<path d="M42,2 L36,-7 M42,2 L48,-7" stroke="#2b2722" stroke-width="1.5" stroke-linecap="round" fill="none"/>' +
  '</svg>';

var GRUEN = '<svg viewBox="0 0 110 190" aria-hidden="true">' +
  '<g class="c6m-blattwerk" fill="#8ea37a" stroke="#2b2722" stroke-width="2.2" stroke-linejoin="round">' +
  '<path d="M55,128 C40,96 14,92 6,70 C30,66 50,86 55,128Z"/><path d="M55,128 C70,96 98,94 106,72 C80,66 60,88 55,128Z"/>' +
  '<path d="M55,124 C44,84 30,52 40,18 C58,40 62,84 55,124Z" fill="#7d955f"/><path d="M56,124 C66,90 80,62 76,34 C62,52 56,90 56,124Z" fill="#a7bb8f"/>' +
  '<path d="M54,130 C34,118 20,120 12,110 C28,102 44,110 54,130Z" fill="#a7bb8f"/></g>' +
  '<g fill="none" stroke="#2b2722" stroke-width="1.2" opacity=".35"><path d="M55,124 C48,90 44,60 42,30"/><path d="M56,124 C64,96 70,70 74,44"/></g>' +
  '<path d="M28,130 H82 L76,184 H34Z" fill="#c8744a" stroke="#2b2722" stroke-width="2.4" stroke-linejoin="round"/>' +
  '<path d="M24,128 H86 V140 H24Z" fill="#d98a5f" stroke="#2b2722" stroke-width="2.4" stroke-linejoin="round"/>' +
  '<path d="M36,148 L40,178" stroke="#fff" stroke-opacity=".3" stroke-width="3" stroke-linecap="round"/>' +
  '</svg>';

// Der Teppich: gewebt, mit Bordüre, Rauten, einem Keimblatt-Medaillon in der Mitte und Fransen an den Enden
var TEPPICH = (function () {
  var cx = 300, cy = 60, s = '<svg viewBox="-18 0 636 120" preserveAspectRatio="none">' +
    '<defs><radialGradient id="c6m-tp-licht" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#fff6dc" stop-opacity=".55"/><stop offset=".55" stop-color="#fff6dc" stop-opacity="0"/><stop offset="1" stop-color="#2b2722" stop-opacity=".12"/></radialGradient>' +
    '<pattern id="c6m-tp-web" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3h6M3 0v6" stroke="#2b2722" stroke-opacity=".045" stroke-width="1"/></pattern>' +
    '<clipPath id="c6m-tp-clip"><ellipse cx="300" cy="60" rx="298" ry="57"/></clipPath></defs>';
  // Fransen links und rechts
  for (var i = -5; i <= 5; i++) {
    var y = cy + i * 8.5, k = Math.sqrt(Math.max(0, 1 - Math.pow((y - cy) / 57, 2)));
    var xl = cx - 298 * k, xr = cx + 298 * k;
    s += '<path d="M' + (xl + 3).toFixed(1) + ' ' + y + ' q-9 ' + (i % 2 ? 2 : -2) + ' -15 ' + (i % 2 ? 1 : 3) + ' M' + (xr - 3).toFixed(1) + ' ' + y + ' q9 ' + (i % 2 ? -2 : 2) + ' 15 ' + (i % 2 ? 3 : 1) + '" fill="none" stroke="#c9a36d" stroke-width="2.2" stroke-linecap="round"/>';
  }
  s += '<g clip-path="url(#c6m-tp-clip)">' +
    '<ellipse cx="300" cy="60" rx="298" ry="57" fill="#c9805a"/>' +
    '<ellipse cx="300" cy="60" rx="282" ry="50" fill="#ecd3b1"/>';
  // Rauten-Bordüre
  for (var a = 0; a < 64; a++) {
    var t = a / 64 * Math.PI * 2, x = cx + Math.cos(t) * 266, y2 = cy + Math.sin(t) * 44;
    s += '<path d="M' + x.toFixed(1) + ' ' + (y2 - 4).toFixed(1) + ' l4 4 l-4 4 l-4 -4z" fill="' + (a % 2 ? '#b5613a' : '#8ea37a') + '" opacity=".8"/>';
  }
  s += '<ellipse cx="300" cy="60" rx="250" ry="38" fill="none" stroke="#c9805a" stroke-width="3"/>' +
    '<ellipse cx="300" cy="60" rx="238" ry="33" fill="#e9c9a0"/>' +
    '<ellipse cx="300" cy="60" rx="170" ry="24" fill="none" stroke="#d6a77a" stroke-width="2" stroke-dasharray="6 5"/>' +
    '<ellipse cx="300" cy="86" rx="70" ry="12" fill="#d98a5f" stroke="#b5613a" stroke-width="2"/>' +
    // Medaillon: zwei Keimblätter wie Carls
    '<path d="M300 90 q-18 -2 -24 -9 q16 -3 24 9z M300 90 q18 -2 24 -9 q-16 -3 -24 9z" fill="#8ea37a" stroke="#5f7f3e" stroke-width="1.4"/>' +
    '<path d="M300 90 v5" stroke="#5f7f3e" stroke-width="1.6" stroke-linecap="round"/>' +
    '<ellipse cx="300" cy="60" rx="298" ry="57" fill="url(#c6m-tp-web)"/>' +
    '<ellipse cx="300" cy="60" rx="298" ry="57" fill="url(#c6m-tp-licht)"/></g>' +
    '<ellipse cx="300" cy="60" rx="298" ry="57" fill="none" stroke="#2b2722" stroke-width="2.6" vector-effect="non-scaling-stroke"/>' +
    '</svg>';
  return s;
})();

function zeitVon(h) { return h >= 5 && h < 9 ? 'morgen' : h >= 9 && h < 17 ? 'tag' : h >= 17 && h < 21 ? 'abend' : 'nacht'; }

C6.raum({
  id: 'zuhause', name: 'Zuhause', hoehe: 'boden', reihe: 0,
  symbol: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5h-5v5H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
  bauen: function (buehne) {
    var st = mach('div', 'c6z-stube', buehne);
    st.innerHTML =
      '<div class="c6z-wand"></div>' +
      '<div class="c6z-boden"><i class="c6z-leiste"></i></div>' +
      '<div class="c6z-licht" data-tiefe="nah" aria-hidden="true"></div>' +
      '<div class="c6m-mondlicht" aria-hidden="true"></div>' +
      '<div class="c6m-wandlicht" aria-hidden="true"></div>' +
      '<button type="button" class="c6z-ding c6z-fenster" data-c6s="fenster" data-tiefe="fern" aria-label="Fenster">' + FENSTER + '</button>' +
      '<button type="button" class="c6z-ding c6z-bild" data-tiefe="fern" data-c6-bild aria-label="Zum Fahrrad">' + BILD + '</button>' +
      '<button type="button" class="c6z-ding c6m-regal" data-tiefe="fern" data-c6-bild aria-label="Zur Bibliothek">' + REGAL + '</button>' +
      '<button type="button" class="c6z-ding c6m-kalender" data-tiefe="fern" data-c6-bild aria-label="Dein Wochenende"></button>' +
      '<div class="c6m-kegel" aria-hidden="true"></div>' +
      '<div class="c6m-lampenschatten" aria-hidden="true"></div>' +
      '<div class="c6z-ding c6z-lampe" data-tiefe="mitte" aria-hidden="true"><i class="c6m-schatten" data-sw="1.1" data-sh=".16"></i>' + LAMPE + '<i class="c6z-glut"></i></div>' +
      '<button type="button" class="c6z-ding c6z-tuer" data-tiefe="mitte" aria-label="Zur Werkstatt"><i class="c6m-schatten" data-sw=".86" data-sh=".07"></i>' + TUER + '<span class="c6z-schild">Werkstatt</span></button>' +
      '<div class="c6z-ding c6m-gruen" data-tiefe="mitte" aria-hidden="true"><i class="c6m-schatten" data-sw=".7" data-sh=".12"></i>' + GRUEN + '</div>' +
      '<div class="c6z-ding c6z-sessel" data-tiefe="mitte" aria-hidden="true"><i class="c6m-schatten" data-sw=".92" data-sh=".12"></i>' + SESSEL + '</div>' +
      '<div class="c6z-teppich c6m-teppich" data-tiefe="nah" aria-hidden="true">' + TEPPICH + '</div>' +
      '<div class="c6z-sofa" data-tiefe="mitte" aria-hidden="true"><i class="c6m-schatten" data-sw=".9" data-sh=".1"></i>' + SOFA + '</div>' +
      '<div class="c6z-carl"></div>' +
      '<button type="button" class="c6z-ding c6z-knaeuel" data-tiefe="nah" aria-label="Fadenknäuel"><i class="c6m-schatten" data-sw=".5" data-sh=".2" data-sx="-.25"></i>' + KNAEUEL + '</button>' +
      '<div class="c6z-ablage" data-tiefe="nah" data-c6-ablage></div>' +
      '<div class="c6z-sb-brett" role="group" aria-label="Deine Spaces" lang="de"><i class="c6z-sb-brett-holz" aria-hidden="true"></i><div class="c6z-sb-haken"></div></div>' +
      '<button type="button" class="c6z-verlauf" aria-label="Unser Gespräch zeigen"></button>' +
      '<div class="c6z-flug" aria-hidden="true"></div>';
    function q(s) { return st.querySelector(s); }
    var el = { brett: q('.c6z-sb-brett'), haken: q('.c6z-sb-haken'), carl: q('.c6z-carl'), fenster: q('.c6z-fenster'), tuer: q('.c6z-tuer'), bild: q('.c6z-bild'), knaeuel: q('.c6z-knaeuel'), verlauf: q('.c6z-verlauf'), flug: q('.c6z-flug'), sonne: q('.c6z-sonne'),
      kalender: q('.c6m-kalender'), lampe: q('.c6z-lampe'), gruen: q('.c6m-gruen'), regal: q('.c6m-regal'), sofa: q('.c6z-sofa'), sessel: q('.c6z-sessel'), kegel: q('.c6m-kegel'), lampenschatten: q('.c6m-lampenschatten'), vogel: q('.c6m-vogel'), licht: q('.c6z-licht') };

    // Ablage am Boden rechts vom Teppich (Gegenstück zum Knäuel): dort legt Carl Mitgebrachtes hin, z. B. einen Brief
    var ablage = q('.c6z-ablage');
    C6.zuhause = C6.zuhause || {};
    C6.zuhause.ablage = function (ding) {
      if (ding && ding.nodeType === 1 && ding.parentNode !== ablage) { ding.style.left = ''; ding.style.top = ''; ablage.appendChild(ding); }
      return ablage;
    };
    // der Brief von Carl (Aufgabe des Tages) liegt in der Ablage, sobald er da ist
    function nimmBrief() { var b = st.ownerDocument.getElementById('c6r-a-brief'); if (b && b.parentNode !== ablage) C6.zuhause.ablage(b); }
    C6.bus.on('auftrag', function () { setTimeout(nimmBrief, 0); });
    C6.bus.on('raum', function (r) { if (r === 'zuhause') setTimeout(nimmBrief, 60); });
    var ctl = null;
    try { ctl = C6.figur.male(el.carl, { groesse: 260 }); } catch (e) { ctl = null; }
    if (ctl && C6.setzeCarl) C6.setzeCarl(ctl, 'zuhause');
    var hier = false, uhrZeit = null, uhrSchlaf = null, uhrSitz = null, letzteRegung = Date.now(), sockenVorher = null;

    // ---------- Größe & Lage ----------
    function groesse() {
      var h = st.clientHeight || window.innerHeight, w = st.clientWidth || window.innerWidth;
      if (!h || !w) return;
      var comp = (C6.geraet || (w >= 820 ? 'computer' : 'iphone')) === 'computer';
      var unten = Math.max(124, parseFloat(getComputedStyle(st).getPropertyValue('--c6-unten')) || 140);
      try { var ue = D.querySelector('.c6k-unten'); if (ue) { var ur = ue.getBoundingClientRect(), sr = st.getBoundingClientRect(); if (ur.height > 0) unten = Math.max(unten, Math.round(sr.bottom - ur.top + 10)); } } catch (e) { }
      st.style.setProperty('--c6z-fuss', Math.round(unten + (comp ? 40 : 26)) + 'px');
      var px = comp ? Math.max(h * 0.38, Math.min(h * 0.44, h - unten - 260)) : Math.min(h * 0.35, h - unten - 210);
      px = Math.max(comp ? 220 : 170, Math.round(px));
      var fuss = Math.round(unten + (comp ? 40 : 26));
      var boden = Math.round(h * (comp ? 0.6 : 0.57));
      if (boden > h - fuss - px * 0.35) boden = Math.round(h - fuss - px * 0.35);
      st.classList.toggle('c6z-computer', comp);
      st.style.setProperty('--c6z-carl', px + 'px');
      st.style.setProperty('--c6z-boden', boden + 'px');
      if (ctl) ctl.groesse(px);
      einrichten(w, h, comp, px, boden);
      clearTimeout(schattenUhr); schattenUhr = setTimeout(schatten, 70);
    }
    var schattenUhr = null;
    // Die Einrichtung sucht sich ihren Platz: rechts zwischen Sofa und Tür steht der Sessel (oder, wenn es eng ist,
    // die Pflanze); das Fahrradbild hängt immer frei an der Wand, nie hinter der Tür.
    function setze(e, o) { if (!e) return; for (var k in o) e.style[k] = o[k]; }
    function einrichten(w, h, comp, px, boden) {
      var keins = { left: '', right: '', top: '', width: '', display: '' };
      if (!comp) { setze(el.sessel, keins); setze(el.bild, keins); setze(el.gruen, keins); setze(el.regal, keins); setze(el.kalender, { left: '', right: '', top: '' }); return; }
      var sofaR = w / 2 + px * 0.66 + 18, tuerL = w * 0.95 - 150 - 18, gap = tuerL - sofaR;
      var regalTop = Math.max(118, boden - 442), bildTop = boden - 330, bw = 130;
      setze(el.regal, { top: regalTop + 'px' });
      // der Wandkalender: neben der Tür, solange dort kein Bild hängt; sonst zwischen Fenster und Bücherbord
      setze(el.kalender, gap >= 170 ? { left: (w * 0.1 + 232) + 'px', right: 'auto', top: (boden - 356) + 'px' } : { left: '', right: '', top: '' });
      if (gap >= 170) {
        var sw = Math.min(230, gap), sl = sofaR + (gap - sw) / 2;
        setze(el.sessel, { display: '', left: sl + 'px', right: 'auto', width: sw + 'px' });
        setze(el.bild, { left: (sl + sw / 2 - bw / 2) + 'px', right: 'auto', top: bildTop + 'px', width: bw + 'px' });
        // in der Ecke rechts neben der Tür, wenn Platz ist
        var ecke = w * 0.05 - 8;
        setze(el.gruen, ecke >= 60 ? { display: 'block', left: 'auto', right: '2px', width: Math.min(92, ecke) + 'px' } : { display: 'none' });
      } else {
        setze(el.sessel, { display: 'none' });
        var gw = Math.min(96, Math.max(0, gap));
        setze(el.gruen, gw >= 60 ? { display: 'block', left: (sofaR + (gap - gw) / 2) + 'px', right: 'auto', width: gw + 'px' } : { display: 'none' });
        if (gap >= bw + 10) setze(el.bild, { left: (sofaR + (gap - bw) / 2) + 'px', right: 'auto', top: bildTop + 'px', width: bw + 'px' });
        else {
          // links neben der Lampe, unter dem Bücherbord
          var bw2 = 112, l = w * 0.1 + 318;
          setze(el.bild, { left: l + 'px', right: 'auto', top: Math.max(regalTop + 82, bildTop) + 'px', width: bw2 + 'px' });
        }
      }
    }

    // ---------- Tageszeit und das eine Licht ----------
    var stundeFest = null, sonneU = 0.5, lampeAn = false;
    function stundeJetzt() { if (stundeFest != null) return stundeFest; var d = new Date(); return d.getHours() + d.getMinutes() / 60; }
    function zeit() {
      var h = stundeJetzt(), z = zeitVon(Math.floor(h));
      st.setAttribute('data-zeit', z);
      // Sonne wandert über das Fenster
      var u = Math.max(0, Math.min(1, (h - 5) / 16)); sonneU = u;
      var sx = 30 + u * 100, sy = 112 - Math.sin(u * Math.PI) * 80;
      if (el.sonne) el.sonne.setAttribute('transform', 'translate(' + sx.toFixed(1) + ',' + sy.toFixed(1) + ')');
      st.style.setProperty('--c6z-schraeg', (15 - u * 30).toFixed(1) + 'deg');
      st.style.setProperty('--c6z-fleck', Math.round((0.5 - u) * 90) + 'px');
      st.style.setProperty('--c6z-fleck-b', (0.8 + Math.sin(u * Math.PI) * 0.35).toFixed(2));
      var an = (z === 'abend' || z === 'nacht');
      if (an !== lampeAn) { lampeAn = an; st.classList.toggle('c6m-lampe-an', an); }
      licht();
    }
    // Lichtquelle des Raums: tags das Fenster (die Sonne darin), abends und nachts die Stehlampe
    function licht() {
      if (!C6.lichtquelle || !C6.lichtquelle.setze) return;
      var sr = st.getBoundingClientRect(); if (!sr.width || !sr.height) return;
      var z = st.getAttribute('data-zeit') || 'tag', q;
      if (lampeAn && el.lampe) {
        var lr = el.lampe.getBoundingClientRect();
        q = { x: (lr.left + lr.width / 2 - sr.left) / sr.width, y: (lr.top + lr.height * 0.12 - sr.top) / sr.height, art: 'lampe', warm: 0.92, staerke: z === 'nacht' ? 0.95 : 0.8, hoehe: 0.55 };
      } else {
        var fr = el.fenster.getBoundingClientRect();
        var sx = fr.left + fr.width * (0.14 + sonneU * 0.62), sy = fr.top + fr.height * (0.62 - Math.sin(sonneU * Math.PI) * 0.42);
        q = { x: (sx - sr.left) / sr.width, y: (sy - sr.top) / sr.height, art: 'fenster', warm: z === 'morgen' ? 0.75 : 0.55, staerke: z === 'morgen' ? 0.6 : 0.7, hoehe: 0.4 + Math.sin(sonneU * Math.PI) * 0.45 };
      }
      try { C6.lichtquelle.setze('zuhause', q); } catch (e) { }
      schatten();
    }
    // Kontaktschatten und Eigenschatten der Dinge folgen dem Licht
    function schatten() {
      if (!C6.lichtquelle || !C6.lichtquelle.hol) return;
      var sr = st.getBoundingClientRect(); if (!sr.width) return;
      var q = C6.lichtquelle.hol('zuhause');
      var lx = sr.left + q.x * sr.width, ly = sr.top + q.y * sr.height;
      [].forEach.call(st.querySelectorAll('.c6m-schatten'), function (i) {
        var d = i.parentNode, r = d.getBoundingClientRect(); if (!r.width) return;
        var fx = r.left + r.width / 2, fy = r.bottom;
        var s = C6.lichtquelle.schatten((fx - sr.left) / sr.width, (fy - sr.top) / sr.height, r.height);
        var dx = s.dx, dy = s.dy, l = Math.hypot(dx, dy) || 1;
        var weit = Math.max(8, Math.min(r.height * 0.45, l)) ;
        var sw = parseFloat(i.getAttribute('data-sw') || '1'), sh = parseFloat(i.getAttribute('data-sh') || '.14'), sx = parseFloat(i.getAttribute('data-sx') || '0');
        i.style.setProperty('--sw', Math.round(r.width * sw) + 'px');
        i.style.setProperty('--sh', Math.max(6, Math.round(r.width * sh)) + 'px');
        i.style.setProperty('--sdx', (dx / l * weit * 0.6 + sx * r.width).toFixed(1) + 'px');
        i.style.setProperty('--sdy', (Math.max(1, dy / l * weit * 0.35)).toFixed(1) + 'px');
        i.style.setProperty('--ssx', (1 + Math.min(0.5, (s.skala - 1) * 0.6)).toFixed(2));
        i.style.setProperty('--sa', Math.min(0.34, s.a * 1.15).toFixed(2));
      });
      // Eigenschatten: der Verlauf dreht sich zur lichtabgewandten Seite
      [['c6m-eg-sofa', el.sofa, 240], ['c6m-eg-sessel', el.sessel, 110], ['c6m-eg-lampe', el.lampe, 40]].forEach(function (p) {
        var g = st.querySelector('#' + p[0]); if (!g || !p[1]) return;
        var r = p[1].getBoundingClientRect(); if (!r.width) return;
        var svg = g.ownerSVGElement, vb = svg.viewBox.baseVal, k = vb.width / r.width;
        var cx = vb.x + vb.width / 2, cy = vb.y + vb.height * 0.55;
        var dx = (lx - (r.left + r.width / 2)) * k, dy = (ly - (r.top + r.height * 0.55)) * k, d = Math.hypot(dx, dy) || 1;
        g.setAttribute('x1', (cx + dx / d * p[2]).toFixed(1)); g.setAttribute('y1', (cy + dy / d * p[2]).toFixed(1));
        g.setAttribute('x2', (cx - dx / d * p[2]).toFixed(1)); g.setAttribute('y2', (cy - dy / d * p[2]).toFixed(1));
      });
      // Schlagschatten der Lampe an der Wand (nur angedeutet, nur bei Fensterlicht)
      if (el.lampenschatten && el.lampe) {
        var lr = el.lampe.getBoundingClientRect();
        var vx = (lr.left + lr.width / 2) - lx, vy = (lr.top + lr.height * 0.3) - ly, vl = Math.hypot(vx, vy) || 1;
        el.lampenschatten.style.left = (lr.left - sr.left + lr.width / 2) + 'px';
        el.lampenschatten.style.bottom = (sr.bottom - lr.bottom) + 'px';
        el.lampenschatten.style.height = Math.round(lr.height * 0.92) + 'px';
        el.lampenschatten.style.width = Math.round(lr.width * 0.5) + 'px';
        el.lampenschatten.style.transform = 'translateX(-50%) skewX(' + Math.max(-28, Math.min(28, -vx / vl * 30)).toFixed(1) + 'deg)';
        el.lampenschatten.style.opacity = lampeAn ? '0' : (0.5 * q.staerke).toFixed(2);
      }
      // Lichtkegel der Lampe auf dem Boden
      if (el.kegel && el.lampe) {
        var kr = el.lampe.getBoundingClientRect();
        el.kegel.style.left = (kr.left - sr.left + kr.width / 2) + 'px';
        el.kegel.style.bottom = (sr.bottom - kr.bottom - kr.width * 0.12) + 'px';
      }
    }
    C6.zuhause.stunde = function (h) { stundeFest = (h == null ? null : Math.max(0, Math.min(23.99, +h))); zeit(); return stundeFest; };
    C6.bus.on('geraet', function () { setTimeout(zeit, 80); });

    // ---------- Zettel ----------
    function verlaufBauen() {
      var g = (C6.S && C6.S.gespraech) || [];
      var du = g.filter(function (r) { return r && r.von === 'du' && istSatz(r.t); }).slice(-1);
      el.verlauf.innerHTML = '';
      du.forEach(function (r, i) {
        var z = mach('span', 'c6z-zettel c6z-zettel-liegt', el.verlauf);
        z.textContent = r.t;
        z.style.setProperty('--r', ((i % 2 ? 1 : -1) * (1.5 + i)).toFixed(1) + 'deg');
        z.style.setProperty('--i', du.length - 1 - i);
      });
      el.verlauf.hidden = true;
    }
    function istSatz(t) { t = (t || '').trim(); return t.split(/\s+/).length >= 4 || t.length >= 26; }
    function zettel(t) {
      if (!istSatz(t) || el.verlauf.hidden) return;
      verlaufBauen();
      var neu = el.verlauf.lastChild;
      if (!neu || ruhig() || !neu.animate) return;
      var sr = st.getBoundingClientRect(), nr = neu.getBoundingClientRect();
      var unten = parseFloat(getComputedStyle(st).getPropertyValue('--c6-unten')) || 140;
      var sx = sr.left + sr.width / 2 - (nr.left + nr.width / 2), sy = sr.bottom - unten - 30 - (nr.top + nr.height / 2);
      var cr = ctl ? ctl.el.getBoundingClientRect() : null;
      var mx = cr ? cr.left + cr.width * 0.5 - (nr.left + nr.width / 2) : sx * 0.6, my = cr ? cr.top + cr.height * 0.2 - (nr.top + nr.height / 2) : sy * 0.4;
      neu.animate([
        { transform: 'translate(' + sx + 'px,' + sy + 'px) rotate(0deg) scale(.86)', opacity: 0 },
        { transform: 'translate(' + sx + 'px,' + (sy - 24) + 'px) rotate(-2deg) scale(1)', opacity: 1, offset: 0.16 },
        { transform: 'translate(' + (mx * 0.7) + 'px,' + (my - 30) + 'px) rotate(4deg) scale(.96)', opacity: 1, offset: 0.55 },
        { transform: 'translate(0,0) rotate(var(--r)) scale(1)', opacity: 1 }
      ], { duration: 1500, easing: 'cubic-bezier(.35,.1,.25,1)' });
    }
    function gespraechZeigen() {
      C6.projektor && C6.projektor.auf({
        titel: 'Unser Gespräch',
        inhalt: function (ziel) {
          var g = ((C6.S && C6.S.gespraech) || []).slice(-40);
          if (!g.length) { var p = mach('p', 'c6z-lw-leer', ziel); p.textContent = 'Noch ist das Blatt leer.'; return; }
          var ul = mach('ul', 'c6z-lw-gespraech', ziel);
          g.forEach(function (r) { var li = mach('li', r.von === 'du' ? 'c6z-du' : 'c6z-er', ul); li.textContent = r.t; });
          setTimeout(function () { ziel.scrollTop = ziel.scrollHeight; }, 30);
        }
      });
    }

    // ---------- Regungen ----------
    // Carl setzt sich nach einer Weile Ruhe aufs Sofa und steht auf, sobald etwas geschieht
    function aufstehen() { if (ctl && ctl.sitz && ctl.sitztJetzt) ctl.sitz(false); }
    function sitzPruef() {
      if (!hier || !ctl || !ctl.sitz || ctl.sitztJetzt) return;
      if (Date.now() - letzteRegung < 8000) return;
      if ((C6.projektor && C6.projektor.offen) || (C6.rundgang && C6.rundgang.an) || ctl.fliegtJetzt) return;
      if (C6.denktGerade && C6.denktGerade()) return;
      ctl.sitz(true);
    }
    ['gesagt', 'denkt', 'gespraech', 'chip', 'werkzeug', 'projektor', 'verlauf'].forEach(function (n) {
      C6.bus.on(n, function () { if (hier) { letzteRegung = Date.now(); aufstehen(); } });
    });
    try { C6.eingabe.feld.addEventListener('focus', function () { if (hier) { letzteRegung = Date.now(); aufstehen(); } }); } catch (e) {}
    function regung() {
      aufstehen();
      letzteRegung = Date.now();
      if (ctl && ctl.stimmungJetzt === 'schlaeft') { ctl.stimmung('staunt'); setTimeout(function () { ctl && ctl.stimmungJetzt === 'staunt' && ctl.stimmung('ruhig'); }, 900); }
    }
    function schlafPruef() {
      if (!hier || !ctl) return;
      if (Date.now() - letzteRegung > 120000 && ctl.stimmungJetzt === 'ruhig' && !(C6.projektor && C6.projektor.offen)) ctl.stimmung('schlaeft');
    }
    st.addEventListener('pointerdown', regung, { passive: true });
    if (ctl) ctl.el.addEventListener('click', function () {
      if (C6.rundgang && C6.rundgang.an) return;
      try { C6.eingabe && C6.eingabe.fokus && C6.eingabe.fokus(); } catch (e) { }
      var gesagt = C6.S && C6.S.zuhause && C6.S.zuhause.tippen;
      if (!gesagt && typeof C6.sag === 'function') {
        try { C6.aendern(function (S) { S.zuhause = S.zuhause || {}; S.zuhause.tippen = Date.now(); }); } catch (e) { }
        var satz = (C6.stimme && C6.stimme.sag && C6.stimme.sag('tippen')) || 'Du kannst mich antippen. Dann hör ich zu.';
        setTimeout(function () { C6.sag(satz); }, 260);
      }
    });
    // Unten (Dock, Chips, Leiste) ändert sich → Carl rückt weich nach
    try {
      var wurzel = D.getElementById('c6');
      if (wurzel && 'MutationObserver' in window) { var mo = null; new MutationObserver(function () { clearTimeout(mo); mo = setTimeout(groesse, 60); }).observe(wurzel, { attributes: true, attributeFilter: ['style', 'data-chips'] }); }
    } catch (e) { }

    function kleidAuffrischen() {
      if (!ctl) return;
      try { if (C6.laden && C6.laden.an) ctl.kleid(C6.laden.an() || {}); } catch (e) { }
    }
    function sockenPruef() {
      var s = C6.S && C6.S.du && C6.S.du.socken;
      if (s && s !== sockenVorher) {
        sockenVorher = s;
        var an = null; try { an = C6.laden && C6.laden.an && C6.laden.an(); } catch (e) { }
        if (ctl && !(an && an.socken)) ctl.kleid({ socken: { farbe: s } });
      }
    }
    sockenPruef();

    // ---------- Schlüsselbrett: deine Spaces an der Wand ----------
    var brettSchl = '';
    var KEY = function (f) { return '<svg class="c6z-sb-key" viewBox="0 0 26 14" aria-hidden="true"><circle cx="6.5" cy="7" r="4.6" fill="' + f + '" stroke="#2b2722" stroke-width="1.6"/><circle cx="6.5" cy="7" r="1.5" fill="#fbf7f0"/><path d="M11 7h12.5M19.5 7v3.4M22.5 7v2.6" fill="none" stroke="#2b2722" stroke-width="1.8" stroke-linecap="round"/></svg>'; };
    function schluessel() {
      var alle = []; try { alle = (C6.space && C6.space.alle) ? C6.space.alle() : []; } catch (e) { alle = []; }
      var w = el.haken.clientWidth;
      var schl = alle.map(function (x) { return x.stringId + x.titel + x.farbe; }).join('|') + '#' + w;
      if (schl === brettSchl) return;
      brettSchl = schl;
      el.haken.textContent = '';
      var keys = alle.map(function (x, i) {
        var b = mach('button', 'c6z-sb-schl', el.haken); b.type = 'button';
        b.setAttribute('aria-label', 'Space „' + x.titel + '“ öffnen');
        b.style.setProperty('--r', ((i % 2 ? 1 : -1) * (1.2 + (i % 3) * 0.8)).toFixed(1) + 'deg');
        b.style.setProperty('--l', (16 + (i % 3) * 9) + 'px');
        b.innerHTML = '<i class="c6z-sb-nagel" aria-hidden="true"></i><i class="c6z-sb-schnur" aria-hidden="true"></i>';
        var t = mach('span', 'c6z-sb-anh', b);
        t.innerHTML = KEY(x.farbe || '#d62a26');
        passeName(mach('span', 'c6z-sb-anh-name', t), x.titel);
        b.addEventListener('click', function () { nimmSchluessel(b, function () { C6.space && C6.space.oeffne(x.stringId); }); });
        return b;
      });
      var mehr = mach('button', 'c6z-sb-schl c6z-sb-schl-alle', el.haken); mehr.type = 'button';
      mehr.innerHTML = '<i class="c6z-sb-nagel" aria-hidden="true"></i><i class="c6z-sb-schnur" aria-hidden="true"></i><span class="c6z-sb-anh"></span>';
      mehr.addEventListener('click', function () { nimmSchluessel(mehr, function () { C6.space && C6.space.oeffne(null, { liste: true }); }); });
      mehr.hidden = true;
      var n = mach('button', 'c6z-sb-schl c6z-sb-schl-neu', el.haken); n.type = 'button';
      n.setAttribute('aria-label', 'Neuer Space');
      n.innerHTML = '<i class="c6z-sb-nagel" aria-hidden="true"></i><i class="c6z-sb-schnur" aria-hidden="true"></i><span class="c6z-sb-anh"><b aria-hidden="true">+</b><span>Neuer Space</span></span>';
      n.addEventListener('click', function () {
        regung();
        if (ctl) { var r = n.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height / 2); }
        if (C6.space && C6.space.frageNeu) C6.space.frageNeu();
      });
      // so viele Schlüssel, wie ans Brett passen; der Rest hängt als Bund daneben
      if (!w) return;
      var weg = 0;
      while (keys.length && el.haken.scrollWidth > el.haken.clientWidth + 1) {
        keys.pop().remove(); weg++;
        mehr.hidden = false;
        mehr.lastChild.textContent = '+' + weg;
        mehr.setAttribute('aria-label', 'Alle Spaces, ' + weg + ' weitere');
      }
    }
    // Namen am Brett: nie mitten im Wort trennen. Ein langes Wort macht die Schrift kleiner, bis es passt;
    // mehr als zwei Zeilen werden nach einem ganzen Wort mit „…“ gekürzt (der volle Name steht im aria-label).
    function passeName(el, titel) {
      el.textContent = titel;
      try { el.closest('button').title = titel; } catch (e) {}
      setTimeout(function () {
        if (!el.isConnected) return;
        var fs = parseFloat(getComputedStyle(el).fontSize) || 16, i = 0;
        // kleiner, aber nie unter 13 px; dann darf der Anhänger breiter werden; erst ganz zuletzt „…“ am Wortende
        while (i++ < 6 && fs > 13.5 && el.scrollWidth > el.clientWidth + 1) { fs = Math.max(13, fs * 0.9); el.style.fontSize = fs.toFixed(1) + 'px'; }
        var t0 = String(titel);
        while (t0.length > 4 && el.scrollWidth > el.clientWidth + 1) { t0 = t0.slice(0, -1); el.textContent = t0 + '…'; }
        var w = String(titel).split(/\s+/);
        while (w.length > 1 && el.scrollHeight > el.clientHeight + 4) { w.pop(); el.textContent = w.join(' ') + ' …'; }
      }, 0);
    }
    function nimmSchluessel(b, dann) {
      regung();
      b.classList.remove('c6z-sb-schwingt'); void b.offsetWidth; b.classList.add('c6z-sb-schwingt');
      if (ctl) { var r = b.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height / 2); ctl.stimmung('froh'); }
      setTimeout(function () { try { dann(); } catch (e) { } }, ruhig() ? 0 : 340);
      setTimeout(function () { b.classList.remove('c6z-sb-schwingt'); if (ctl) { ctl.schau(); ctl.stimmungJetzt === 'froh' && ctl.stimmung('ruhig'); } }, 1400);
    }
    C6.bus.on('strings', function () { if (hier) schluessel(); });

    // ---------- Dinge im Raum ----------
    el.fenster.addEventListener('click', function () {
      regung();
      if (ctl) { var r = el.fenster.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height / 2); ctl.stimmung('staunt'); setTimeout(function () { ctl.schau(); ctl.stimmung('ruhig'); }, 1600); }
    });
    el.tuer.addEventListener('click', function () {
      regung();
      el.tuer.classList.add('c6z-tuer-auf');
      if (ctl) { var r = el.tuer.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height / 2); }
      setTimeout(function () { if (C6.raeume && C6.raeume.werkstatt) C6.geh('werkstatt'); }, ruhig() ? 0 : 320);
      setTimeout(function () { el.tuer.classList.remove('c6z-tuer-auf'); ctl && ctl.schau(); }, 1200);
    });
    // Der Wandkalender „Dein Wochenende“: Samstag und Sonntag, je drei Kästchen; ein Haken nur für echtes Tun
    function kalenderZeichnen() {
      var k = el.kalender; if (!k) return;
      var st = null;
      try { st = C6.lernweg && C6.lernweg.stand ? C6.lernweg.stand() : null; } catch (e) { st = null; }
      k.hidden = !st;
      if (!st) return;
      var fertig = {}; (st.fertig || []).forEach(function (i) { fertig[i] = 1; });
      var namen = {}; (st.stationen || []).forEach(function (x) { namen[x.id] = x.name; });
      var T = 'stroke="#2b2722" stroke-linecap="round" stroke-linejoin="round"';
      var g = '<svg viewBox="0 0 120 150" aria-hidden="true">' +
        '<path d="M60 4 L44 18 M60 4 L76 18" fill="none" ' + T + ' stroke-width="1.6"/><circle cx="60" cy="4" r="2.2" fill="#2b2722"/>' +
        '<rect x="8" y="16" width="104" height="128" rx="3" fill="#fbf7f0" ' + T + ' stroke-width="2.4"/>' +
        '<rect x="8" y="16" width="104" height="22" rx="3" fill="#d62a26" ' + T + ' stroke-width="2.4"/>' +
        '<path d="M22 12 v10 M98 12 v10" ' + T + ' stroke-width="2.4"/>' +
        '<text x="60" y="32" text-anchor="middle" font-family="Caveat,cursive" font-weight="700" font-size="15" fill="#fbf7f0">Dein Wochenende</text>' +
        '<text x="36" y="56" text-anchor="middle" font-family="Figtree,system-ui,sans-serif" font-weight="600" font-size="10" fill="#5f5a52">Samstag</text>' +
        '<text x="84" y="56" text-anchor="middle" font-family="Figtree,system-ui,sans-serif" font-weight="600" font-size="10" fill="#5f5a52">Sonntag</text>' +
        '<path d="M60 46 V136" stroke="#2b2722" stroke-opacity=".2" stroke-width="1.2"/>';
      [1, 2, 3, 4, 5, 6].forEach(function (i) {
        var x = i <= 3 ? 24 : 72, y = 66 + ((i - 1) % 3) * 24, an = !!fertig[i], naechst = st.naechste === i;
        g += '<rect x="' + x + '" y="' + y + '" width="24" height="18" rx="2.5" fill="' + (an ? '#e3ead2' : '#fff') + '" stroke="#2b2722" stroke-opacity="' + (naechst ? 1 : .55) + '" stroke-width="' + (naechst ? 2 : 1.4) + '"/>';
        if (an) g += '<path d="M' + (x + 5) + ' ' + (y + 9) + ' l5 5 l10 -11" fill="none" stroke="#4f6b34" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
      });
      g += '</svg>';
      if (k._g !== g) { k._g = g; k.innerHTML = g; }
      // vorlesen, wie es wirklich steht: je Tag, was geschafft ist, und was als Nächstes kommt
      var stn = st.stationen || [], WZ = ['nichts', 'eins', 'zwei', 'drei'];
      function tag(t) { var l = stn.filter(function (x) { return x.tag === t; }), n = l.filter(function (x) { return x.fertig; }).length; return t + ': ' + (n === l.length && n ? 'alles geschafft' : (n ? WZ[n] + ' von ' + WZ[l.length] + ' geschafft' : 'noch nichts')); }
      var naechste = stn.filter(function (x) { return !x.fertig; })[0];
      k.setAttribute('aria-label', 'Dein Wochenende mit Carl. ' + (naechste ? tag('Samstag') + '. ' + tag('Sonntag') + '. Als Nächstes: ' + naechste.name + '.' : 'Alles gelernt.'));
      k.title = k.getAttribute('aria-label');
    }
    try { C6.bus.on('lernweg', function () { kalenderZeichnen(); }); } catch (e) {}
    setTimeout(kalenderZeichnen, 0);
    el.kalender.addEventListener('click', function () {
      if (ctl) { var r = el.kalender.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height / 2); }
      if (!ruhig() && el.kalender.animate) el.kalender.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(2.5deg)' }, { transform: 'rotate(-1.5deg)' }, { transform: 'rotate(0)' }], { duration: 520, easing: 'ease-in-out' });
      setTimeout(function () { try { C6.lernweg && C6.lernweg.oeffne && C6.lernweg.oeffne(); } catch (e) {} }, ruhig() ? 0 : 200);
    });

    // das Bücherbord führt in die Bibliothek: von hier aus ist jeder Raum erreichbar
    el.regal.addEventListener('click', function () {
      if (ctl) { var r = el.regal.getBoundingClientRect(); ctl.schau(r.left + r.width / 2, r.top + r.height / 2); }
      if (!ruhig() && el.regal.animate) el.regal.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-1.5deg)' }, { transform: 'rotate(0)' }], { duration: 360, easing: 'ease-in-out' });
      setTimeout(function () { if (C6.raeume && C6.raeume.bibliothek) C6.geh('bibliothek'); }, ruhig() ? 0 : 300);
    });
    el.bild.addEventListener('click', function () {
      regung();
      if (C6.raeume && C6.raeume.fahrrad) C6.geh('fahrrad');
    });
    el.knaeuel.addEventListener('click', function () {
      regung();
      el.knaeuel.classList.remove('c6z-rollt'); void el.knaeuel.offsetWidth; el.knaeuel.classList.add('c6z-rollt');
      if (ctl) {
        var r = el.knaeuel.getBoundingClientRect(); ctl.schau(r.left + r.width * 0.3, r.top + r.height / 2);
        setTimeout(function () { ctl.stimmung('froh'); }, 380);
        setTimeout(function () { ctl.schau(); ctl.stimmungJetzt === 'froh' && ctl.stimmung('ruhig'); }, 2000);
      }
    });
    el.verlauf.addEventListener('click', function () { regung(); gespraechZeigen(); });

    // ---------- Der Vogel am Fenster (kommt, wenn du eine Weile still bist) ----------
    var vogelDa = false, vogelUhr = null, vogelAnim = null;
    function vogelWeg() {
      if (!vogelDa || !el.vogel) return;
      vogelDa = false; clearTimeout(vogelUhr);
      if (vogelAnim) { try { vogelAnim.cancel(); } catch (e) { } vogelAnim = null; }
      if (ruhig() || !el.vogel.animate) { el.vogel.setAttribute('opacity', '0'); return; }
      var a = el.vogel.animate([{ transform: 'translate(84px,132px)', opacity: 1 }, { transform: 'translate(112px,96px)', opacity: 1, offset: 0.4 }, { transform: 'translate(170px,20px)', opacity: 0 }], { duration: 900, easing: 'cubic-bezier(.3,.6,.4,1)', fill: 'forwards' });
      a.onfinish = function () { el.vogel.setAttribute('opacity', '0'); try { a.cancel(); } catch (e) { } };
    }
    function vogelKommt() {
      if (vogelDa || !hier || !el.vogel || D.hidden) return;
      if ((C6.projektor && C6.projektor.offen) || (C6.rundgang && C6.rundgang.an)) return;
      vogelDa = true;
      el.vogel.setAttribute('opacity', '1');
      var r = el.fenster.getBoundingClientRect();
      if (ruhig() || !el.vogel.animate) {
        el.vogel.style.transform = 'translate(84px,132px)';
      } else {
        vogelAnim = el.vogel.animate([
          { transform: 'translate(-30px,10px) scale(.8)', opacity: 0 },
          { transform: 'translate(20px,70px) scale(1)', opacity: 1, offset: 0.45 },
          { transform: 'translate(86px,126px)', offset: 0.85 },
          { transform: 'translate(84px,132px)' }
        ], { duration: 1300, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'forwards' });
        vogelAnim.onfinish = function () {
          if (!vogelDa) return;
          // kleine Hüpfer und Picken
          vogelAnim = el.vogel.animate([
            { transform: 'translate(84px,132px)' }, { transform: 'translate(84px,132px) rotate(14deg)', offset: 0.18 }, { transform: 'translate(84px,132px)', offset: 0.3 },
            { transform: 'translate(90px,132px)', offset: 0.5 }, { transform: 'translate(90px,132px) rotate(12deg)', offset: 0.62 }, { transform: 'translate(90px,132px)', offset: 0.75 }, { transform: 'translate(84px,132px)' }
          ], { duration: 4200, easing: 'ease-in-out', fill: 'forwards' });
        };
      }
      if (ctl) { ctl.schau(r.left + r.width * 0.45, r.top + r.height * 0.72); ctl.stimmung('staunt'); setTimeout(function () { if (ctl && ctl.stimmungJetzt === 'staunt') ctl.stimmung('ruhig'); }, 1400); }
      clearTimeout(vogelUhr);
      vogelUhr = setTimeout(function () { vogelWeg(); if (ctl) ctl.schau(); }, 7000);
    }
    C6.bus.on('warte', function (d) { if (!hier || !d) return; if (d.stufe === 2) vogelKommt(); });
    C6.bus.on('wach', function () { if (vogelDa) { vogelWeg(); if (ctl) ctl.schau(); } });
    if (ctl && typeof ctl.gewohnheiten === 'function') { try { ctl.gewohnheiten(['sitzen', 'umsehen', 'gaehnen']); } catch (e) { } }

    // ---------- Gespräch ----------
    C6.bus.on('gesagt', function (d) {
      if (!hier) return;
      regung();
      zettel(d && d.t);
      if (ctl) { ctl.schau(); ctl.stimmung('hoert'); }
    });
    C6.bus.on('antwort', function () { if (hier && ctl && ctl.stimmungJetzt === 'hoert') ctl.stimmung('ruhig'); });
    C6.bus.on('kleid', kleidAuffrischen);
    C6.bus.on('zustand', function () { sockenPruef(); });
    C6.bus.on('fertig', function (d) { if (hier && d && C6.projektor) C6.projektor.bereit(d); });
    C6.bus.on('geraet', function () { groesse(); brettSchl = ''; schluessel(); });
    function rundgang(an) { st.classList.toggle('c6z-im-rundgang', !!an); }
    C6.bus.on('rundgang', rundgang);
    rundgang(C6.rundgang && C6.rundgang.an);

    groesse(); zeit(); verlaufBauen();
    st.classList.add('c6m-still');
    setTimeout(schluessel, 0);

    return {
      betreten: function (o) {
        nimmBrief(); kalenderZeichnen();
        o = o || {};
        hier = true; letzteRegung = Date.now(); st.classList.remove('c6m-still');
        st.classList.toggle('c6z-im-rundgang', !!(o.rundgang || (C6.rundgang && C6.rundgang.an)));
        groesse(); zeit(); verlaufBauen(); schluessel();
        setTimeout(groesse, 350); setTimeout(groesse, 1200); setTimeout(licht, 420);
        clearInterval(uhrZeit); uhrZeit = setInterval(zeit, 300000);
        clearInterval(uhrSchlaf); uhrSchlaf = setInterval(schlafPruef, 15000);
        clearInterval(uhrSitz); uhrSitz = setInterval(sitzPruef, 1000);
        if (ctl) {
          if (ctl.stimmungJetzt === 'schlaeft') ctl.stimmung('ruhig');
          ctl.blick(0, 0.15); setTimeout(function () { ctl && ctl.blick(); }, 1200);
          if (o.von && !ruhig()) setTimeout(function () { ctl && ctl.huepf(10); }, 260);
        }
        if (o.zeig) {
          var z = { fenster: el.fenster, tuer: el.tuer, bild: el.bild, knaeuel: el.knaeuel, carl: el.carl, brett: el.brett }[o.zeig];
          if (z) { z.classList.remove('c6z-zeig'); void z.offsetWidth; z.classList.add('c6z-zeig'); setTimeout(function () { z.classList.remove('c6z-zeig'); }, 2400); }
        }
      },
      verlassen: function () {
        hier = false; st.classList.add('c6m-still');
        vogelWeg();
        aufstehen();
        clearInterval(uhrZeit); clearInterval(uhrSchlaf); clearInterval(uhrSitz); uhrZeit = uhrSchlaf = uhrSitz = null;
      },
      groesse: function () { groesse(); brettSchl = ''; schluessel(); }
    };
  }
});
