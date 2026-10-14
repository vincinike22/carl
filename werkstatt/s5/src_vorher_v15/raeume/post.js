/* Raum „post“: Werkstatt-Post als Raum. Carl steht da, neben ihm ein Briefkasten, die Briefe hängen an einer Leine.
   Kein Reiter in der Leiste (ohne `reihe`); erreichbar über den Nadel-Knopf (Blatt „Brief an die Werkstatt“), C6.nadel.post() oder C6.geh('post').
   Der Motor (nadel.js) bleibt, wie er ist: db, Briefkasten auf dem Gerät, Carls Antwort. Hier wird nur gezeichnet.
   Geschrieben wird im gewöhnlichen Dock: der Raum meldet sich mit C6.eingabe.hoert an, der Text geht in den Briefkasten, nicht ins Gespräch. */
var C6=window.C6;
if(C6&&C6.raum&&C6.nadel&&C6.nadel._motor){
  var M=C6.nadel._motor,vorher=null;
  var ENV='<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.6 6.4l8.4 6.4 8.4-6.4"/></svg>';
  var NADEL='<svg viewBox="0 0 28 28" width="18" height="18" aria-hidden="true"><path d="M5.2 23.2 L17.4 9.8" stroke="#5c554b" stroke-width="2" stroke-linecap="round"/><circle cx="19.2" cy="7.9" r="4.6" fill="#d62a26" stroke="#2b2722" stroke-width="1.5"/><circle cx="17.8" cy="6.4" r="1.2" fill="#fbf7f0" opacity=".8"/></svg>';
  /* Briefkasten: eigener Entwurf, ein Kasten auf einem Pfahl mit Klappe, Schlitz und einer kleinen Fahne, die steht, wenn etwas drin liegt */
  var KASTEN='<svg class="c6p-kasten-bild" viewBox="0 0 120 236" aria-hidden="true">'+
    '<ellipse class="c6p-kasten-schatten" cx="60" cy="229" rx="34" ry="5"/>'+
    '<path d="M58 96v132" stroke="#2b2722" stroke-width="2.4" stroke-linecap="round"/><path d="M48 228h20" stroke="#2b2722" stroke-width="2.4" stroke-linecap="round"/>'+
    '<g class="c6p-fahne"><path d="M88 46V18" stroke="#2b2722" stroke-width="2.2" stroke-linecap="round"/><path d="M88 18h18l-5 7 5 7H88z" fill="#d62a26" stroke="#2b2722" stroke-width="1.8" stroke-linejoin="round"/></g>'+
    '<rect x="18" y="46" width="84" height="52" rx="10" fill="#e3b23c" stroke="#2b2722" stroke-width="2.2"/>'+
    '<path class="c6p-kasten-licht" d="M22 52q8-4 76 0v8q-68-4-76 0z" fill="#fbf7f0" opacity=".35"/>'+
    '<rect x="34" y="58" width="48" height="6" rx="3" fill="#2b2722"/>'+
    '<path d="M18 80h84" stroke="#2b2722" stroke-width="1.6" opacity=".55"/>'+
    '<circle cx="60" cy="88" r="3.2" fill="#2b2722"/>'+
    '<path class="c6p-kasten-eigen" d="M84 48q18 4 18 24v16q0 10-10 10H84z" fill="#2b2722" opacity=".12"/>'+
    '</svg>';
  /* Fenster links oben: die Lichtquelle des Raums (Rahmen, Himmel, Sonne, Fensterbank) */
  var FENSTER='<svg class="c6p-fenster-bild" viewBox="0 0 120 140" aria-hidden="true"><rect x="6" y="6" width="108" height="112" rx="5" fill="#dfe9ea" stroke="#2b2722" stroke-width="2.2"/><circle cx="36" cy="40" r="13" fill="#f0a830" opacity=".9"/><path d="M14 92q22-16 44-6t48-14v38H14z" fill="#b9c9a6"/><path d="M60 6v112M6 62h108" stroke="#2b2722" stroke-width="2.2"/><rect x="0" y="118" width="120" height="8" rx="2" fill="#e3b23c" stroke="#2b2722" stroke-width="2"/><path d="M8 126v10M112 126v10" stroke="#2b2722" stroke-width="2.2" stroke-linecap="round"/></svg>';
  /* ein kleiner Tisch mit Papier und Stift: hier schreibt man */
  var TISCH='<svg class="c6p-tisch-bild" viewBox="0 0 120 70" aria-hidden="true"><ellipse class="c6p-kasten-schatten" cx="60" cy="66" rx="48" ry="4"/><path d="M14 20h92" stroke="#2b2722" stroke-width="2.4" stroke-linecap="round"/><rect x="12" y="16" width="96" height="8" rx="2" fill="#c9a06a" stroke="#2b2722" stroke-width="2"/><path d="M22 24v40M98 24v40" stroke="#2b2722" stroke-width="2.4" stroke-linecap="round"/><rect x="34" y="4" width="34" height="12" rx="1.5" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.8" transform="rotate(-6 51 10)"/><path d="M74 12l20-5" stroke="#2b2722" stroke-width="2.6" stroke-linecap="round"/><path d="M92 7.5l5-1.3" stroke="#e8621a" stroke-width="2.6" stroke-linecap="round"/></svg>';
  /* ein Regalbrett an der Wand: alte, gestempelte Briefe, verschnürt, einer lehnt daneben. Nur Bild, nichts zum Antippen. */
  var REGAL='<svg class="c6p-regal-bild" viewBox="0 0 140 92" aria-hidden="true">'+
    '<path class="c6p-regal-wandschatten" d="M10 70h124v6q-62 8-124 0z"/>'+
    '<ellipse class="c6p-regal-kontakt" cx="50" cy="62" rx="32" ry="2.6"/><ellipse class="c6p-regal-kontakt" cx="104" cy="62" rx="16" ry="2.2"/>'+
    '<rect x="21" y="53" width="58" height="9" rx="1.5" fill="#efe4cf" stroke="#2b2722" stroke-width="1.8"/>'+
    '<rect x="24" y="44.5" width="54" height="9" rx="1.5" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.8" transform="rotate(-2 51 49)"/>'+
    '<rect x="22" y="36" width="56" height="9" rx="1.5" fill="#f2e9d8" stroke="#2b2722" stroke-width="1.8" transform="rotate(1.5 50 40)"/>'+
    '<path d="M49 35.5v26.5" stroke="#b4460c" stroke-width="1.6"/><path d="M49 36q-7-6-9-1t9 1q7-6 9-1t-9 1" fill="none" stroke="#b4460c" stroke-width="1.5" stroke-linejoin="round"/>'+
    '<g transform="rotate(14 104 62)"><rect x="88" y="20" width="32" height="42" rx="1.5" fill="#fbf7f0" stroke="#2b2722" stroke-width="1.8"/>'+
    '<path d="M88.6 21l15.4 13 15.4-13" fill="none" stroke="#2b2722" stroke-width="1.4" opacity=".6"/>'+
    '<rect x="108" y="40" width="9" height="11" fill="#d62a26" stroke="#2b2722" stroke-width="1.3" stroke-dasharray="1.6 1"/>'+
    '<circle cx="104" cy="47" r="6" fill="none" stroke="#8a8378" stroke-width="1.2" opacity=".8"/><path d="M92 44q3-2 6 0t6 0M92 49q3-2 6 0t6 0" fill="none" stroke="#8a8378" stroke-width="1.1" opacity=".8"/></g>'+
    '<rect x="8" y="62" width="124" height="8" rx="2" fill="#c9a06a" stroke="#2b2722" stroke-width="2"/>'+
    '<rect x="11" y="63.6" width="118" height="1.6" rx=".8" fill="#fbf7f0" opacity=".45"/>'+
    '<path d="M26 70v13l11-13M114 70v13l-11-13" fill="none" stroke="#2b2722" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>'+
    '</svg>';
  var zurueck=function(){try{if(C6.vorher&&C6.vorher!=='post'&&C6.raeume[C6.vorher]&&C6.vorher!=='rundgang')C6.geh(C6.vorher);else if(C6.zurueck)C6.zurueck();else C6.geh('zuhause');}catch(e){}};
  function el(tag,kl,txt){var e=document.createElement(tag);if(kl)e.className=kl;if(txt!=null)e.textContent=txt;return e;}
  function stimme(k,w,r){try{var t=C6.stimme&&C6.stimme.sag(k,w);return t||r||'';}catch(e){return r||'';}}
  function still(){return !!C6.ruhig;}
  /* ehrlicher Stempel je Brief: drei Wörter, nicht mehr */
  function stempel(m){if(!m||m.st==='schreibt')return '';if(m.st==='da')return 'ist raus';if(m.st==='gesperrt')return 'liegt hier';return 'im Briefkasten';}

  C6.raum({id:'post',name:'Post',hoehe:'boden',symbol:ENV,regler:false,platzhalter:'Was ist dir aufgefallen?',entwurf:'post',
    bauen:function(buehne){
      var wurzel=el('div','c6p-raum');buehne.appendChild(wurzel);
      wurzel.innerHTML=
        '<div class="c6p-wand" aria-hidden="true" data-tiefe="fern"><i class="c6p-fensterlicht"></i><div class="c6p-fenster">'+FENSTER+'</div><div class="c6p-regal">'+REGAL+'</div></div>'+
        '<div class="c6p-leine" data-c6-kein-wisch data-tiefe="mitte"><i class="c6p-haken c6p-haken-l" aria-hidden="true"></i><i class="c6p-haken c6p-haken-r" aria-hidden="true"></i><i class="c6p-schnur" aria-hidden="true"></i><div class="c6p-zettelreihe" role="list" aria-label="Deine Briefe an die Werkstatt" tabindex="0"></div></div>'+
        '<div class="c6p-boden" aria-hidden="true" data-tiefe="nah"></div>'+
        '<div class="c6p-tisch" aria-hidden="true" data-tiefe="mitte">'+TISCH+'</div>'+
        '<div class="c6p-carl" data-tiefe="mitte"></div>'+
        '<div class="c6p-kasten" data-tiefe="mitte">'+KASTEN+'<span class="c6p-kasten-zahl" hidden></span><p class="c6p-schild" role="status" aria-live="polite"></p></div>'+
        '<div class="c6p-anf" role="group" aria-label="Satzanfänge"></div>';
      var q=function(s){return wurzel.querySelector(s);};
      var reihe=q('.c6p-zettelreihe'),carlEl=q('.c6p-carl'),kasten=q('.c6p-kasten'),zahl=q('.c6p-kasten-zahl'),schild=q('.c6p-schild'),anf=q('.c6p-anf');

      /* Licht: Fenster links oben, wie im Zuhause. Der Kern setzt daraus die Schatten-Variablen auf der Bühne. */
      try{C6.lichtquelle&&C6.lichtquelle.setze('post',{x:.2,y:.1,art:'fenster',warm:.6,staerke:.7,hoehe:.7});}catch(e){}

      /* Carl steht im Raum */
      var ctl=null;
      function groesse(){var h=buehne.clientHeight||innerHeight;return C6.geraet==='computer'?Math.min(250,Math.round(h*.3)):Math.min(172,Math.round(h*.21));}
      try{ctl=C6.figur.male(carlEl,{groesse:groesse()});}catch(e){ctl=null;}
      if(ctl){try{ctl.stimmung('ruhig');}catch(e){}try{C6.nadel._figur(ctl);}catch(e){}try{C6.setzeCarl&&C6.setzeCarl(ctl,'post');}catch(e){}}
      addEventListener('resize',function(){try{ctl&&ctl.groesse(groesse());}catch(e){}});
      function schauAuf(e){try{if(!ctl||!e)return;var r=e.getBoundingClientRect();ctl.schau(r.left+r.width/2,r.top+r.height/2);setTimeout(function(){try{ctl.schau(null);}catch(x){}},2600);}catch(x){}}

      /* Satzanfänge als Chips über dem Dock, bis der erste Brief dieser Sitzung hängt */
      function anfZeigen(an){anf.hidden=!an;wurzel.classList.toggle('c6p-ohne-anf',!an);}
      function insFeld(t){try{C6.eingabe.setze(t);C6.eingabe.fokus();var f=C6.eingabe.feld;if(f)f.setSelectionRange(f.value.length,f.value.length);}catch(e){}}
      M.anfaenge.forEach(function(a){var b=el('button','c6p-chip',a[0]);b.type='button';b.addEventListener('click',function(){insFeld(a[1]);});anf.appendChild(b);});
      /* ein alter Entwurf aus dem früheren eigenen Feld zieht einmal ins Dock um */
      var ALT='carl.post.entwurf.post',altEntwurf='';try{altEntwurf=sessionStorage.getItem(ALT)||'';sessionStorage.removeItem(ALT);}catch(e){}
      function wo(){var id=vorher&&vorher!=='post'?vorher:'post',d=(C6.raeume||{})[id];return{raum:id,raumName:(d&&d.name)||id};}
      function abschicken(t){t=String(t||'').trim();if(!t)return false;
        M.schick(t,{wo:wo()}).then(function(m){if(m)setTimeout(function(){var z=knoten[m.id];if(z)schauAuf(z);},still()?0:420);}).catch(function(){});
        anfZeigen(false);try{ctl&&ctl.stimmung('denkt');}catch(e){}try{C6.schweig&&C6.schweig();}catch(e){}unten=true;return true;}
      /* das Dock gehört in diesem Raum dem Briefkasten */
      try{C6.eingabe.hoert(function(t){return abschicken(t);},{raum:'post'});}catch(e){}

      /* Briefe an der Leine */
      var knoten={},unten=true,gesehen={};
      reihe.addEventListener('scroll',function(){unten=reihe.scrollLeft<80;},{passive:true});
      function zettel(m){
        var z=el('article','c6p-z '+(m.von==='carl'?'c6p-zc':'c6p-zm')+(m.art==='nadel'?' c6p-zn':''));z.dataset.id=m.id;z.setAttribute('role','listitem');
        z.appendChild(el('i','c6p-klammer')).setAttribute('aria-hidden','true');
        if(m.von==='carl')z.appendChild(el('p','c6p-zwer',M.carlName()));
        else if(m.art==='nadel'){var o=el('p','c6p-zort');o.innerHTML=NADEL;o.appendChild(el('span',null,'Nadel · '+(m.raumName||m.raum||'')));z.appendChild(o);}
        z.appendChild(el('p','c6p-zt'));
        var meta=el('p','c6p-zmeta');meta.appendChild(el('time'));if(m.von!=='carl'&&m.art!=='nadel'&&m.raumName&&m.raum!=='post')meta.appendChild(el('span',null,' · aus '+m.raumName));z.appendChild(meta);
        if(m.von!=='carl'){z.appendChild(el('span','c6p-stempel'));}
        if(m.von!=='carl'&&m.art==='nadel'){var zs=el('button','c6p-bstelle','Zur Stelle');zs.type='button';zs.addEventListener('click',function(){zurStelle(M.finde(m.id)||m);});z.appendChild(zs);}
        return z;}
      function aktuell(z,m){var t=z.querySelector('.c6p-zt');
        if(m.von==='carl'&&m.st==='schreibt'&&!m.text){if(!t.classList.contains('c6p-liest')){t.textContent='';t.classList.add('c6p-liest');t.appendChild(el('span','c6p-vh',M.carlName()+' liest'));t.appendChild(el('i'));t.appendChild(el('i'));t.appendChild(el('i'));}}
        else{t.classList.remove('c6p-liest');if(t.textContent!==m.text)t.textContent=m.text;}
        var ti=z.querySelector('time'),u=M.uhr(m.zeit);if(ti.textContent!==u){ti.textContent=u;try{ti.dateTime=m.zeit;}catch(e){}}
        var st=z.querySelector('.c6p-stempel');if(st){var s=stempel(m);if(st.textContent!==s){st.textContent=s;st.dataset.st=m.st||'';st.classList.remove('c6p-stempelt');void st.offsetWidth;st.classList.add('c6p-stempelt');}}
        z.classList.toggle('c6p-zweg',m.st!=='da'&&m.st!=='schreibt'&&m.von!=='carl');}
      function zeichne(){try{
        var v=M.verlauf();
        schild.textContent=M.kopfStatus();
        var n=M.stand().ausgang;zahl.hidden=!n;zahl.textContent=n>9?'9+':String(n);zahl.setAttribute('aria-label',n+(n===1?' Brief':' Briefe')+' im Briefkasten');kasten.classList.toggle('c6p-voll',n>0);
        if(v.some(function(m){return m.von==='mensch'&&m.sitzung===M.sitzung;}))anfZeigen(false);
        var folge=[],t0='',genommen={};
        /* Briefe von links nach rechts, der neueste zuerst; Carls Antwort hängt rechts neben dem Brief, zu dem sie gehört */
        var einheiten=[];
        v.forEach(function(m){if(genommen[m.id])return;var e=[m];genommen[m.id]=1;if(m.von!=='carl'){var a=M.antwortAuf(m.id);if(a&&!genommen[a.id]){e.push(a);genommen[a.id]=1;}}einheiten.push(e);});
        einheiten.reverse().forEach(function(e){var m=e[0],tg=M.tagVon(m.zeit);if(tg!==t0){t0=tg;var key='tag:'+tg;if(!knoten[key]){var p=el('p','c6p-tag');p.appendChild(el('span',null,M.tagName(m.zeit)));knoten[key]=p;}folge.push(knoten[key]);}
          e.forEach(function(x){var z=knoten[x.id];if(!z){z=zettel(x);knoten[x.id]=z;if(!still()&&reihe.childNodes.length&&C6.jetzt==='post')z.classList.add('c6p-zneu');}aktuell(z,x);folge.push(z);});});
        folge.forEach(function(nd,i){if(reihe.childNodes[i]!==nd)reihe.insertBefore(nd,reihe.childNodes[i]||null);});
        while(reihe.childNodes.length>folge.length)reihe.removeChild(reihe.lastChild);
        /* nur die drei neuesten Briefe bewegen sich leise im Luftzug */
        var zs=[].slice.call(reihe.querySelectorAll('.c6p-z'));zs.forEach(function(z,i){z.classList.toggle('c6p-lebt',i<3);z.style.setProperty('--n',i%5);});
        wurzel.classList.toggle('c6p-leer',!v.length);
        if(unten)reihe.scrollLeft=0;}catch(e){}}
      function nachRechts(){unten=true;reihe.scrollLeft=0;}
      function zurStelle(m){try{if(!m||!C6.raeume[m.raum]||m.raum==='post')return;C6.geh(m.raum);setTimeout(function(){M.zeigen(true);M.leuchte(m.id);},520);}catch(e){}}
      M.hoer(function(was,id){
        if(was==='text'&&id&&knoten[id]){var m=M.finde(id);if(m){aktuell(knoten[id],m);}return;}
        if(was==='nadel')return;
        zeichne();
        if(C6.jetzt!=='post')return;
        /* Carl reagiert: Antwort da → froh, schaut auf den Brief; Brief im Briefkasten → schaut zum Kasten */
        if(was==='liste'&&id){var m2=M.finde(id);if(m2&&m2.von==='carl'&&m2.text&&!gesehen[id]){gesehen[id]=1;try{ctl&&ctl.stimmung(m2.ersatz?'ruhig':'froh');}catch(e){}schauAuf(knoten[id]);}
          else if(m2&&m2.von==='mensch'&&m2.st!=='da'&&!gesehen['k'+id]){gesehen['k'+id]=1;setTimeout(function(){schauAuf(kasten);},300);}}
      });
      zeichne();
      var gesagt=false;
      return{
        betreten:function(o){wurzel.classList.add('c6p-aktiv');if(C6.vorher&&C6.vorher!=='post')vorher=C6.vorher;M.modus(false);M.blattZu(true);zeichne();nachRechts();
          if(o&&o.text)insFeld(o.text);else if(altEntwurf&&!(C6.eingabe.wert()||'').trim()){insFeld(altEntwurf);}altEntwurf='';
          try{ctl&&ctl.stimmung('ruhig');}catch(e){}
          if(!gesagt){gesagt=true;setTimeout(function(){try{if(C6.jetzt!=='post')return;var leer=!M.verlauf().length;C6.sag(leer?stimme('post.leer',null,'Hier hängt noch kein Brief. Schreib mir, was hakt, bremst oder dich freut.'):stimme('raum.post'));}catch(e){}},still()?100:700);}
          if(C6.geraet==='computer')setTimeout(function(){try{if(C6.jetzt==='post')C6.eingabe.fokus();}catch(e){}},460);},
        verlassen:function(){wurzel.classList.remove('c6p-aktiv');try{ctl&&ctl.schau(null);}catch(e){}}
      };
    }});
}
