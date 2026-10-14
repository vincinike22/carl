/* Nadel & Post · Motor
   Kommentar-Nadel (an jede Stelle stecken) und Werkstatt-Post (Briefe-Verlauf).
   Läuft ohne Laufzeit (alles bleibt im Briefkasten auf dem Gerät), mit db
   (Sammlung „post“, ein Dokument je Nachricht) und mit sample (Carl antwortet kurz).
   Nichts hier darf die App anhalten: jede Stelle ist abgesichert, nichts wiederholt sich endlos. */
function NadelPostMotor(cfg){
  'use strict';
  var AUSGANG='carl.post.ausgang',VERLAUF='carl.post.verlauf',ZEIG='carl.post.zeigen',ENTWURF='carl.post.entwurf',MAXV=400;
  var ERSATZ='Ich hab’s eingesteckt. Antworten kann ich gerade nicht, aber die Werkstatt liest es.';
  var ERSATZ2='Eingesteckt. Die Werkstatt liest es.'; /* ab dem zweiten Mal in einer Sitzung: die Entschuldigung nur einmal */
  var DAUERHAFT=['not_granted','sampling_disabled','not_declared','capability_disabled','capability_removed','session_expired'];
  var sitzung='s'+Date.now().toString(36)+Math.random().toString(36).slice(2,7);
  var N={db:null,dbStatus:'sucht',sample:null,sampleAus:false,autor:null,verlauf:[],abo:null,aboVersuche:0,schickt:false,gesperrt:false,
    an:false,zeigen:true,karte:null,blatt:false,knopfDa:true,ersatzGesagt:false,hoerer:[],ctls:{},ebene:null,gestartet:false};

  /* ---------- kleine Helfer ---------- */
  function lies(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
  function schreib(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function neueId(){return 'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,8);}
  function still(){try{return !!(cfg.ruhig&&cfg.ruhig())||matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}}
  function warte(ms){return new Promise(function(r){setTimeout(r,ms);});}
  function online(){try{return navigator.onLine!==false;}catch(e){return true;}}
  function frist(p,ms){return Promise.race([p,new Promise(function(_,rej){setTimeout(function(){rej({code:'frist'});},ms);})]);}
  function el(tag,kl,txt){var e=document.createElement(tag);if(kl)e.className=kl;if(txt!=null)e.textContent=txt;return e;}
  function melde(was,id){N.hoerer.slice().forEach(function(f){try{f(was,id);}catch(e){}});try{cfg.melde&&cfg.melde(was,id);}catch(e){}}
  function hoer(f){N.hoerer.push(f);return function(){var i=N.hoerer.indexOf(f);if(i>=0)N.hoerer.splice(i,1);};}
  function wo(){try{var w=cfg.wo();return{raum:String(w.raum||'?'),raumName:String(w.raumName||w.raum||'?')};}catch(e){return{raum:'?',raumName:'?'};}}
  function geraet(){try{return String(cfg.geraet()||'?');}catch(e){return '?';}}
  function carlName(){try{return String(cfg.carlName()||'Carl');}catch(e){return 'Carl';}}
  function bild(){try{return Math.round(innerWidth)+'×'+Math.round(innerHeight);}catch(e){return '';}}
  function fassung(){try{return document.title||'';}catch(e){return '';}}
  function uhr(z){try{return new Date(z).toLocaleTimeString('de-AT',{hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
  function tagVon(z){try{var d=new Date(z);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();}catch(e){return '';}}
  function tagName(z){try{var d=new Date(z),n=new Date(),g=new Date();g.setDate(n.getDate()-1);
      if(d.toDateString()===n.toDateString())return 'Heute';if(d.toDateString()===g.toDateString())return 'Gestern';
      return d.toLocaleDateString('de-AT',{weekday:'long',day:'numeric',month:'long'});}catch(e){return '';}}
  function sortiere(){N.verlauf.sort(function(a,b){return String(a.zeit).localeCompare(String(b.zeit));});}

  /* ---------- Zeichen ---------- */
  var SVGNS='http://www.w3.org/2000/svg';
  function nadelSvg(gross){ /* Schneiderinnen-Stecknadel: Spitze unten links, runder roter Kopf oben rechts */
    return gross
      ?'<svg viewBox="0 0 34 44" width="34" height="44" aria-hidden="true" focusable="false"><ellipse cx="5" cy="41.2" rx="4" ry="1.4" fill="#2b2722" opacity=".18"/><path d="M4.6 40.6 L23.4 15.6" stroke="#5c554b" stroke-width="2.1" stroke-linecap="round"/><path d="M8.2 34.4 L22.4 15.4" stroke="#fbf7f0" stroke-width=".7" stroke-linecap="round" opacity=".9"/><circle cx="25.6" cy="12.4" r="6.6" fill="#d62a26" stroke="#2b2722" stroke-width="1.6"/><circle cx="23.4" cy="10.1" r="1.8" fill="#fbf7f0" opacity=".75"/></svg>'
      :'<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true" focusable="false"><path d="M5.2 23.2 L17.4 9.8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="19.2" cy="7.9" r="4.6" fill="#d62a26" stroke="#2b2722" stroke-width="1.5"/><circle cx="17.8" cy="6.4" r="1.2" fill="#fbf7f0" opacity=".8"/></svg>';}
  var ENV_SVG='<svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><rect x="3.5" y="6.5" width="21" height="15" rx="2"/><path d="M4.2 7.6l9.8 7.4 9.8-7.4"/></svg>';
  var KIESEL='<svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><path d="M20 12.5 C17 6.5 11.5 5.8 9.6 8.4 C12.4 11.6 16.2 12.6 20 12.5Z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.3" stroke-linejoin="round"/><path d="M20 12.5 C23 6.5 28.5 5.8 30.4 8.4 C27.6 11.6 23.8 12.6 20 12.5Z" fill="#8ea37a" stroke="#2b2722" stroke-width="1.3" stroke-linejoin="round"/><path d="M20 12.6 V15" stroke="#2b2722" stroke-width="1.3"/><path d="M6.5 26 C6.5 18.5 12.5 14.5 20 14.5 C27.5 14.5 33.5 18.5 33.5 26 C33.5 32 28 35.4 20 35.4 C12 35.4 6.5 32 6.5 26Z" fill="#d9d0c2" stroke="#2b2722" stroke-width="1.6"/><circle cx="15.6" cy="24" r="2.3" fill="#f0a830" stroke="#2b2722" stroke-width="1"/><circle cx="24.4" cy="24" r="2.3" fill="#f0a830" stroke="#2b2722" stroke-width="1"/><circle cx="15.9" cy="24.3" r=".9" fill="#2b2722"/><circle cx="24.7" cy="24.3" r=".9" fill="#2b2722"/><ellipse cx="12.4" cy="28.4" rx="2" ry="1.1" fill="#e8a59a" opacity=".8"/><ellipse cx="27.6" cy="28.4" rx="2" ry="1.1" fill="#e8a59a" opacity=".8"/></svg>';
  function avatar(){var h=el('span','c6p-av');try{if(cfg.avatar){var a=cfg.avatar(h);if(a===true)return h;if(a&&a.nodeType){h.appendChild(a);return h;}}}catch(e){}h.innerHTML=KIESEL;return h;}

  /* ---------- Verlauf & Briefkasten (lokal, immer) ---------- */
  function merken(){schreib(VERLAUF,N.verlauf.filter(function(m){return m.st!=='schreibt'||m.text;}).slice(-MAXV).map(function(m){var o={};for(var k in m)o[k]=m[k];if(o.st==='schreibt')o.st='ausgang';return o;}));}
  function finde(id){for(var i=0;i<N.verlauf.length;i++)if(N.verlauf[i].id===id)return N.verlauf[i];return null;}
  function dazu(m){var a=finde(m.id);if(a){for(var k in m)a[k]=m[k];}else N.verlauf.push(m);sortiere();}
  function entferne(id){N.verlauf=N.verlauf.filter(function(m){return m.id!==id;});}
  function ausgang(){var a=lies(AUSGANG,[]);return Array.isArray(a)?a.filter(function(d){return d&&d.id&&typeof d.text==='string';}):[];}
  function ausgangSetzen(a){schreib(AUSGANG,a);}
  function inAusgang(d){var a=ausgang().filter(function(x){return x.id!==d.id;});a.push(d);ausgangSetzen(a);}
  function ausAusgang(id){ausgangSetzen(ausgang().filter(function(x){return x.id!==id;}));}
  var FELDER=['art','von','text','raum','raumName','x','y','element','geraet','bildschirm','zeit','sitzung','antwortAuf','autor','ersatz','fassung'];
  function koerper(m){var d={};FELDER.forEach(function(k){var v=m[k];if(v!==undefined&&v!==null&&v!=='')d[k]=v;});d.text=String(m.text||'').slice(0,4000);return d;}

  /* ---------- Laufzeit (darf fehlen) ---------- */
  function holen(n){try{var c=window.claude;if(c&&typeof c.use==='function')return Promise.resolve(c.use(n)).then(function(r){return r||null;},function(){return null;});}catch(e){}return Promise.resolve(null);}
  function start(){if(N.gestartet)return;N.gestartet=true;
    var v=lies(VERLAUF,[]);N.verlauf=Array.isArray(v)?v.filter(function(m){return m&&m.id&&typeof m.text==='string';}):[];
    ausgang().forEach(function(d){var m=finde(d.id);if(m)m.st='ausgang';else{var o={};for(var k in d)o[k]=d[k];o.st='ausgang';N.verlauf.push(o);}});
    sortiere();N.zeigen=lies(ZEIG,true)!==false;melde('liste');
    var p1=holen('db').then(function(db){N.db=db&&typeof db.collection==='function'?db:null;N.dbStatus=N.db?'da':'fehlt';melde('stand');});
    var p2=holen('sample').then(function(s){N.sample=typeof s==='function'?s:null;});
    var p3=holen('user').then(function(u){if(u&&typeof u.id==='function')return Promise.resolve(u.id()).then(function(i){N.autor=i||null;},function(){});});
    Promise.all([p1,p2,p3]).then(function(){abonnieren();nachschicken();melde('stand');},function(){N.dbStatus=N.db?'da':'fehlt';melde('stand');});
    addEventListener('online',function(){nachschicken();melde('stand');});
    addEventListener('offline',function(){melde('stand');});
    document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')nachschicken();});
    setInterval(function(){if(N.db&&!N.schickt&&online()&&ausgang().length)nachschicken();},45000);}

  /* Jede angemeldete Person schreibt unter post/<autor>/briefe (db-Regel: post nur Besitzer, post/{self} jeder Angemeldete). Ohne Autor-ID: flach in post (nur der Besitzer darf das). */
  function sammlung(){return N.autor?N.db.collection('post/'+N.autor+'/briefe'):N.db.collection('post');}
  var kopfGesetzt=false;
  function kopfDoc(m){if(kopfGesetzt||!N.autor||!N.db)return;kopfGesetzt=true;
    try{Promise.resolve(N.db.doc('post/'+N.autor).set({autor:N.autor,zuletzt:m.zeit,fassung:m.fassung||'',geraet:m.geraet||''})).catch(function(){kopfGesetzt=false;});}catch(e){kopfGesetzt=false;}}
  /* Einmal abonnieren (nie aus dem Zeichnen heraus). */
  function abonnieren(){if(N.abo||!N.db)return;
    try{N.abo=sammlung().orderBy('zeit','desc').limit(300).onSnapshot(function(snap){try{
        var imA={};ausgang().forEach(function(d){imA[d.id]=1;});var neu=false;
        (snap&&snap.docs||[]).forEach(function(d){var x=d&&d.exists!==false&&d.data&&d.data();if(!x||typeof x.text!=='string')return;
          if(N.autor&&x.autor&&x.autor!==N.autor)return;
          var alt=finde(d.id);if(alt&&alt.st==='schreibt')return;
          var st=imA[d.id]?'ausgang':'da';if(alt&&alt.st===st&&alt.text===x.text)return;
          var o={};for(var k in x)o[k]=x[k];o.id=d.id;o.st=st;dazu(o);neu=true;});
        if(neu){merken();melde('liste');}}catch(e){}},
      function(err){N.abo=null;var c=err&&err.code;
        if((c==='unavailable'||c==='resource_exhausted')&&N.aboVersuche<3){N.aboVersuche++;setTimeout(abonnieren,5000*N.aboVersuche);return;}
        if(['revoked','not_granted','capability_disabled','capability_removed'].indexOf(c)>=0){N.db=null;N.dbStatus='fehlt';melde('stand');}});
    }catch(e){N.abo=null;}}

  /* Ein Brief zur Werkstatt: 'da' | 'ausgang' | 'gesperrt'. Höchstens ein zweiter Versuch. */
  function senden(m){
    if(!N.db)return Promise.resolve('ausgang');if(N.gesperrt)return Promise.resolve('gesperrt');if(!online())return Promise.resolve('ausgang');
    var versuch=function(v){var ref;try{ref=sammlung().doc(m.id);}catch(e){return Promise.resolve('gesperrt');}
      return frist(Promise.resolve().then(function(){return ref.set(koerper(m));}),15000).then(function(){kopfDoc(m);return 'da';},function(e){var c=e&&e.code;
        if(c==='unavailable'&&v===0)return warte(500+Math.random()*900).then(function(){return versuch(1);});
        if(c==='invalid_argument'||c==='transform_error'||c==='quota_exceeded'){N.gesperrt=true;return 'gesperrt';}
        if(['revoked','not_granted','capability_disabled','capability_removed'].indexOf(c)>=0){N.db=null;N.dbStatus='fehlt';return 'ausgang';}
        return 'ausgang';});};
    return versuch(0);}
  function nachschicken(){if(N.schickt||!N.db||N.gesperrt||!online())return Promise.resolve();var a=ausgang();if(!a.length)return Promise.resolve();N.schickt=true;
    var i=0;var weiter=function(){if(i>=a.length)return Promise.resolve();var d=a[i++];
      return senden(d).then(function(r){var m=finde(d.id);if(r==='da'){ausAusgang(d.id);if(m&&m.st!=='schreibt')m.st='da';melde('liste',d.id);return weiter();}if(m&&m.st!=='schreibt')m.st=r;});};
    return weiter().then(fertig,fertig);function fertig(){N.schickt=false;merken();melde('liste');melde('stand');}}
  function ablegen(m){m.st='ausgang';dazu(m);var d=koerper(m);d.id=m.id;inAusgang(d);merken();melde('liste',m.id);melde('stand');
    return senden(m).then(function(r){var x=finde(m.id);if(r==='da'){ausAusgang(m.id);if(x)x.st='da';}else if(x)x.st=r;
      merken();melde('liste',m.id);melde('stand');if(r==='da')nachschicken();return r;},function(){return 'ausgang';});}

  /* ---------- Zustand, ehrlich ---------- */
  /* Je Brief nur ein kurzes Wort. Die Erklärung (warum, bis wann) steht genau einmal: im Kopf der Post. */
  function zustand(m){if(!m||m.st==='schreibt')return '';if(m.st==='da')return 'bei der Werkstatt ✓';
    if(m.st==='gesperrt')return 'liegt hier';
    return 'im Briefkasten';}
  function kopfStatus(){var n=ausgang().length,briefe=n===1?'1 Brief liegt':n+' Briefe liegen';
    if(N.dbStatus==='sucht')return 'Ich schau, ob die Werkstatt erreichbar ist.';
    if(!N.db)return 'Von hier komm ich nicht zur Werkstatt durch. Ich heb alles im Briefkasten auf, bis es geht.';
    if(!online())return n?'Kein Netz. '+briefe+' im Briefkasten, bis es wieder da ist.':'Kein Netz. Was du schreibst, geht raus, sobald es wieder da ist.';
    if(N.gesperrt)return 'Die Werkstatt nimmt gerade nichts an. Deine Briefe bleiben hier.';
    return n?briefe+' noch im Briefkasten.':'Die Werkstatt liest nachts alles.';}

  /* ---------- Carl antwortet ---------- */
  function regeln(fuer){
    var wo2='Sie war im Raum „'+(fuer.raumName||fuer.raum||'?')+'“, Gerät: '+(fuer.geraet||'?')+'.';
    if(fuer.art==='nadel'&&fuer.element){var e=fuer.element;wo2+=' Sie hat eine rote Nadel genau an eine Stelle gesteckt: '+(e.tag||'')+(e.text?' „'+e.text+'“':'')+'.';}
    return 'Du bist '+carlName()+', ein kleiner Kiesel mit Keimblattpaar und Beinchen, der in einer App wohnt. Das hier ist die Werkstatt-Post: Die Person sagt dir etwas über die App selbst (was kaputt ist, was bremst, was verwirrt, was sie sich wünscht, was sie freut). Du steckst es wörtlich ein, die Werkstatt liest es nachts gesammelt. Du änderst nichts an der App und versprichst nicht, was die Werkstatt tun wird.\n'
      +'Deine Haltung: Du verbindest, ich lege hin. Ehrlich wie ein Freund. Leise. Neugier vor Antwort. Dein Weg, nicht meiner. Erst fragen, dann ändern. Ein Stein mit Humor.\n'
      +'So antwortest du:\n- Deutsch, Ich-Form, ein oder zwei kurze Sätze, zusammen höchstens 35 Wörter.\n'
      +'- Zuerst bestätigst du knapp in eigenen Worten, was du an die Werkstatt weitergibst. Nicht wörtlich wiederholen.\n'
      +'- Höchstens EINE Frage, ganz am Ende, und nur wenn sie die Rückmeldung genauer macht (was sie erwartet hat, was sie davor getan hat, ob es immer passiert). Ist es schon klar, frag nichts.\n'
      +'- Kein Ausrufezeichen, keine Superlative, kein Emoji, keine Aufzählung, kein Markdown.\n'
      +'- Keine Technikwörter, sprich in den Wörtern der Person. Ein trockener Halbsatz über dich ist erlaubt, nie über die Person und nie, wenn etwas kaputt ist.\n'
      +wo2;}
  function eingabe(fuer){
    if(fuer.art==='nadel')return regeln(fuer)+'\n\nIhre Nachricht zu dieser Stelle:\n'+String(fuer.text).slice(0,2000);
    var t=[{role:'user',content:regeln(fuer)}];
    N.verlauf.filter(function(m){return m.sitzung===sitzung&&m.art==='post'&&m.text&&!m.ersatz&&m.st!=='schreibt';}).slice(-8).forEach(function(m){
      t.push({role:m.von==='carl'?'assistant':'user',content:String(m.text).slice(0,1500)});});
    while(t.length>1&&t[t.length-1].role!=='user')t.pop();
    if(t.length<2)t.push({role:'user',content:String(fuer.text).slice(0,1500)});
    return t;}
  function antworten(fuer){
    var id=neueId(),m={id:id,art:fuer.art,von:'carl',text:'',raum:fuer.raum,raumName:fuer.raumName,zeit:new Date(Date.parse(fuer.zeit)+1).toISOString(),
      geraet:fuer.geraet,bildschirm:fuer.bildschirm,sitzung:sitzung,antwortAuf:fuer.id,fassung:fuer.fassung,st:'schreibt'};
    if(fuer.art==='nadel'){m.x=fuer.x;m.y=fuer.y;}
    if(N.autor)m.autor=N.autor;
    var ein=eingabe(fuer);dazu(m);melde('liste',id);
    var fertig=function(text,ersatz){var x=finde(id);if(!x)return null;
      if(ersatz){x.ersatz=true;text=N.ersatzGesagt?ERSATZ2:ERSATZ;N.ersatzGesagt=true;}
      x.text=text;melde('text',id);return ablegen(x).then(function(){return x;});};
    if(!N.sample||N.sampleAus||!online())return warte(still()?0:520).then(function(){return fertig(ERSATZ,true);});
    var ctl=new AbortController(),abgelaufen=false,erstes=false;N.ctls[id]=ctl;
    var wache=setTimeout(function(){if(!erstes){abgelaufen=true;try{ctl.abort();}catch(e){}}},60000);
    var auf;try{auf=Promise.resolve(N.sample(ein,{modelTier:'quick',cache:false,signal:ctl.signal,
        onText:function(u){erstes=true;var x=finde(id);if(x&&u&&typeof u.text==='string'){x.text=u.text;melde('text',id);}}}));}
    catch(e){auf=Promise.reject({code:'upstream_error'});}
    return auf.then(function(r){var t=String(r&&r.text||'').trim();return t?fertig(t,false):fertig(ERSATZ,true);},
      function(e){var c=e&&e.code;
        if(c==='cancelled'&&!abgelaufen){var t=String(e&&e.text||'').trim();if(t)return fertig(t,false);entferne(id);merken();melde('liste');return null;}
        if(DAUERHAFT.indexOf(c)>=0)N.sampleAus=true;return fertig(ERSATZ,true);})
      .then(function(x){clearTimeout(wache);delete N.ctls[id];return x;},function(){clearTimeout(wache);delete N.ctls[id];return null;});}
  function antwortAuf(mid){for(var i=N.verlauf.length-1;i>=0;i--){var m=N.verlauf[i];if(m.von==='carl'&&m.antwortAuf===mid)return m;}return null;}

  /* ---------- Schreiben ---------- */
  function schick(text,o){o=o||{};text=String(text||'').trim();if(!text)return Promise.resolve(null);
    var w=o.wo||wo(),m={id:neueId(),art:o.art||'post',von:'mensch',text:text.slice(0,4000),raum:w.raum,raumName:w.raumName,geraet:geraet(),bildschirm:bild(),
      zeit:new Date().toISOString(),sitzung:sitzung,fassung:fassung()};
    if(o.x!=null){m.x=o.x;m.y=o.y;}if(o.element)m.element=o.element;if(N.autor)m.autor=N.autor;
    var p=ablegen(m);setTimeout(function(){antworten(m).catch(function(){});},still()?0:260);
    return p.then(function(){return m;},function(){return m;});}

  /* ---------- Was liegt unter dem Finger? ---------- */
  function beschreibe(e0){try{if(!e0||e0.nodeType!==1)return null;
      var e1=(e0.closest&&e0.closest('button,a,[role=button],input,textarea,select,label'))||e0;
      var kl=function(e){var c=e.classList?[].slice.call(e.classList):[];return c.filter(function(x){return !/^c6p-/.test(x);});};
      var gross=e1.querySelectorAll&&e1.querySelectorAll('*').length>12;var txt=(e1.getAttribute('aria-label')||e1.getAttribute('alt')||e1.getAttribute('title')||e1.getAttribute('placeholder')||(gross?'':e1.textContent)||'').replace(/\s+/g,' ').trim().slice(0,80);
      var teile=[],e=e1,n=0;
      while(e&&e.nodeType===1&&n<6&&e!==document.body&&e!==document.documentElement){var s=e.tagName.toLowerCase();
        if(e.id)s+='#'+e.id;else{var c=kl(e).slice(0,2);if(c.length)s+='.'+c.join('.');}
        if(e.getAttribute&&e.getAttribute('data-raum'))s+='[data-raum='+e.getAttribute('data-raum')+']';
        teile.unshift(s);e=e.parentElement;n++;}
      return{tag:e1.tagName.toLowerCase(),klassen:kl(e1).slice(0,4).join(' '),text:txt,pfad:teile.join(' > ')};}catch(x){return null;}}
  function unterPunkt(x,y){try{var l=document.elementsFromPoint(x,y)||[];for(var i=0;i<l.length;i++){var e=l[i];if(N.ebene&&N.ebene.contains(e))continue;if(e===document.documentElement||e===document.body)continue;return e;}}catch(e){}return null;}
  function buehnenRect(){var b=null;try{b=cfg.buehne&&cfg.buehne();}catch(e){}var r=b&&b.getBoundingClientRect?b.getBoundingClientRect():null;
    if(!r||r.width<2||r.height<2)return{left:0,top:0,width:innerWidth,height:innerHeight};return r;}

  /* ---------- Ebene (liegt neben der App, nie darin) ---------- */
  var E={};
  function ebeneBauen(){if(N.ebene)return;
    var eb=el('div','c6p-ebene');eb.id='c6p-ebene';
    var nad=el('div','c6p-nadeln');
    var schl=el('div','c6p-schleier');schl.setAttribute('aria-hidden','true');
    var ziel=el('div','c6p-ziel');ziel.setAttribute('aria-hidden','true');
    var geist=el('div','c6p-geist');geist.innerHTML=nadelSvg(true);geist.setAttribute('aria-hidden','true');
    var hin=el('div','c6p-hinweis');hin.setAttribute('role','status');
    var hp=el('p','c6p-hp','Tipp auf die Stelle, die du meinst');
    var hz=el('div','c6p-hz');
    var bAus=el('button','c6p-hk c6p-hzeig');bAus.type='button';
    var bPost=el('button','c6p-hk','Briefe');bPost.type='button';bPost.setAttribute('aria-label','Alle Briefe an die Werkstatt');
    var bAb=el('button','c6p-hk c6p-hab','Abbrechen');bAb.type='button';
    hz.appendChild(bAb);hz.appendChild(bPost);hz.appendChild(bAus);hin.appendChild(hp);hin.appendChild(hz);
    var kn=el('button','c6p-knopf');kn.type='button';kn.id='c6p-knopf';kn.setAttribute('aria-pressed','false');kn.setAttribute('aria-haspopup','menu');kn.setAttribute('aria-expanded','false');
    kn.setAttribute('aria-label','An die Werkstatt: Nadel stecken oder Brief schreiben');kn.title='An die Werkstatt';
    kn.innerHTML=nadelSvg(false)+'<span class="c6p-kzahl" hidden></span>';
    /* Blatt: zwei Wahlen unter dem Knopf */
    var fang=el('div','c6p-fang');fang.hidden=true;fang.setAttribute('aria-hidden','true');
    var bl=el('div','c6p-blatt');bl.id='c6p-blatt';bl.hidden=true;bl.setAttribute('role','menu');bl.setAttribute('aria-label','An die Werkstatt');
    var b1=el('button','c6p-bl c6p-bl-nadel');b1.type='button';b1.setAttribute('role','menuitem');b1.innerHTML=nadelSvg(false)+'<span>Nadel stecken</span>';
    var b2=el('button','c6p-bl c6p-bl-post');b2.type='button';b2.setAttribute('role','menuitem');b2.innerHTML=ENV_SVG+'<span>Brief an die Werkstatt</span><span class="c6p-blzahl" hidden></span>';
    bl.appendChild(b1);bl.appendChild(b2);
    eb.appendChild(nad);eb.appendChild(schl);eb.appendChild(ziel);eb.appendChild(geist);eb.appendChild(hin);eb.appendChild(fang);eb.appendChild(bl);eb.appendChild(kn);
    E={eb:eb,nad:nad,schl:schl,ziel:ziel,geist:geist,hin:hin,bAus:bAus,bPost:bPost,bAb:bAb,kn:kn,fang:fang,bl:bl,b1:b1,b2:b2,pins:{}};N.ebene=eb;
    var par=(cfg.eltern&&cfg.eltern())||document.body;par.appendChild(eb);
    knopfVerdrahten();
    fang.addEventListener('click',function(){blattZu();});
    fang.addEventListener('touchmove',function(ev){ev.preventDefault();},{passive:false});
    b1.addEventListener('click',function(){blattZu(true);modus(true);});
    b2.addEventListener('click',function(){blattZu(true);postAuf();});
    bl.addEventListener('keydown',function(ev){if(ev.key==='ArrowDown'||ev.key==='ArrowUp'){ev.preventDefault();(document.activeElement===b1?b2:b1).focus();}
      if(ev.key==='Tab'){ev.preventDefault();(document.activeElement===b1&&!ev.shiftKey||document.activeElement===b2&&ev.shiftKey?b2:b1).focus();}});
    schl.addEventListener('click',function(ev){if(N.karte){if(N.karte.zustand==='schreiben'&&feldWert())karteRuetteln();else karteZu();return;}
      if(!N.an)return;setze(ev.clientX,ev.clientY);});
    schl.addEventListener('pointermove',function(ev){if(!N.an||N.karte||ev.pointerType==='touch')return;geistZu(ev.clientX,ev.clientY);});
    bAb.addEventListener('click',function(){modus(false);});
    bPost.addEventListener('click',function(){modus(false);postAuf();});
    bAus.addEventListener('click',function(){zeigen(!N.zeigen);});
    addEventListener('keydown',function(ev){if(ev.key!=='Escape')return;
      if(N.blatt){ev.preventDefault();ev.stopImmediatePropagation();blattZu();return;}
      if(N.karte){ev.preventDefault();ev.stopImmediatePropagation();karteZu();return;}
      if(N.an){ev.preventDefault();ev.stopImmediatePropagation();modus(false);}},true);
    var neu=function(){nadelnZeichnen();if(N.karte)karteSetzen();if(cfg.platziere)try{cfg.platziere(kn);}catch(e){}if(N.blatt)blattSetzen();};
    addEventListener('resize',neu);try{if(window.visualViewport){visualViewport.addEventListener('resize',function(){if(N.karte)karteSetzen();});visualViewport.addEventListener('scroll',function(){if(N.karte)karteSetzen();});}}catch(e){}
    hoer(function(was,id){if(was==='liste'||was==='stand'){knopfZahl();nadelnZeichnen();}if(N.karte&&(was==='text'||was==='liste'||was==='stand'))karteAktuell();});
    zeigTaste();knopfZahl();if(cfg.platziere)try{cfg.platziere(kn);}catch(e){}}
  function zeigTaste(){if(!E.bAus)return;E.bAus.textContent=N.zeigen?'Nadeln aus':'Nadeln an';E.bAus.setAttribute('aria-label',N.zeigen?'Meine Nadeln ausblenden':'Meine Nadeln zeigen');E.bAus.setAttribute('aria-pressed',N.zeigen?'true':'false');}
  function knopfZahl(){if(!E.kn)return;var n=ausgang().length,z=E.kn.querySelector('.c6p-kzahl');if(z){z.hidden=!n;z.textContent=n>9?'9+':String(n);}
    var z2=E.b2&&E.b2.querySelector('.c6p-blzahl');if(z2){z2.hidden=!n;z2.textContent=n>9?'9+':String(n);z2.setAttribute('aria-label',n+(n===1?' Brief':' Briefe')+' im Briefkasten');}}
  /* Knopf zeigen/verbergen (z. B. erst nach dem Rundgang, nicht in der Post selbst) */
  function knopfZeigen(da){da=!!da;N.knopfDa=da;if(!E.kn)return;if(!da){blattZu(true);if(N.an)modus(false);}E.kn.hidden=!da;E.kn.setAttribute('aria-hidden',da?'false':'true');}

  /* Knopf: Tipp = Blatt (Nadel stecken · Brief an die Werkstatt); langer Druck = gleich die Briefe */
  function knopfVerdrahten(){var kn=E.kn,t=0,lang=false,x0=0,y0=0;
    var ab=function(){clearTimeout(t);t=0;kn.classList.remove('c6p-drueckt');};
    kn.addEventListener('pointerdown',function(ev){if(ev.button>0)return;lang=false;x0=ev.clientX;y0=ev.clientY;kn.classList.add('c6p-drueckt');
      t=setTimeout(function(){t=0;lang=true;kn.classList.remove('c6p-drueckt');kn.classList.add('c6p-lang');setTimeout(function(){kn.classList.remove('c6p-lang');},400);
        try{navigator.vibrate&&navigator.vibrate(12);}catch(e){}blattZu(true);modus(false);postAuf();},560);});
    kn.addEventListener('pointermove',function(ev){if(t&&Math.abs(ev.clientX-x0)+Math.abs(ev.clientY-y0)>14)ab();});
    kn.addEventListener('pointerup',ab);kn.addEventListener('pointercancel',ab);kn.addEventListener('pointerleave',ab);
    kn.addEventListener('contextmenu',function(ev){ev.preventDefault();});
    kn.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();if(lang){lang=false;return;}
      if(N.an){modus(false);return;}if(N.karte){karteZu();return;}if(N.blatt){blattZu();return;}blattAuf();});}

  /* ---------- Blatt unter dem Knopf ---------- */
  function blattAuf(){if(!E.bl||N.blatt||!N.knopfDa)return;N.blatt=true;knopfZahl();E.fang.hidden=false;E.bl.hidden=false;blattSetzen();E.kn.setAttribute('aria-expanded','true');E.kn.classList.add('c6p-offen');
    requestAnimationFrame(function(){E.bl.classList.add('c6p-blda');E.fang.classList.add('c6p-blda');});
    setTimeout(function(){if(N.blatt)try{E.b1.focus({preventScroll:true});}catch(e){}},40);}
  function blattZu(sofort){if(!E.bl||!N.blatt)return;N.blatt=false;E.kn.setAttribute('aria-expanded','false');E.kn.classList.remove('c6p-offen');
    E.bl.classList.remove('c6p-blda');E.fang.classList.remove('c6p-blda');var bl=E.bl,fang=E.fang;
    setTimeout(function(){if(!N.blatt){bl.hidden=true;fang.hidden=true;}},sofort||still()?0:180);
    if(!sofort)try{E.kn.focus({preventScroll:true});}catch(e){}}
  function blattSetzen(){if(!E.bl||E.bl.hidden)return;var k=E.kn.getBoundingClientRect(),bl=E.bl,w=bl.offsetWidth||240,h=bl.offsetHeight||110;
    var links=k.left+k.width/2<innerWidth/2,s=bl.style;s.left='';s.right='';
    if(links){s.left=Math.max(8,Math.round(k.left))+'px';bl.classList.add('c6p-bllinks');}else{s.right=Math.max(8,Math.round(innerWidth-k.right))+'px';bl.classList.remove('c6p-bllinks');}
    var top=k.bottom+10;if(top+h>innerHeight-12)top=Math.max(12,k.top-10-h);s.top=Math.round(top)+'px';}

  /* ---------- Nadel-Modus ---------- */
  function modus(an){an=!!an;ebeneBauen();if(an&&N.blatt)blattZu(true);if(an&&N.karte)karteZu();if(N.an===an)return;
    N.an=an;E.eb.classList.toggle('c6p-an',an);E.kn.setAttribute('aria-pressed',an?'true':'false');
    E.ziel.classList.remove('c6p-zda');E.geist.classList.remove('c6p-gda');
    if(an){zeigTaste();setTimeout(function(){try{E.bAb.focus({preventScroll:true});}catch(e){}},30);}
    nadelnZeichnen();melde('nadel',an);}
  function geistZu(x,y){E.geist.classList.add('c6p-gda');E.geist.style.transform='translate('+(x-5)+'px,'+(y-41)+'px)';
    var u=unterPunkt(x,y);var z=u&&(u.closest('button,a,[role=button],input,textarea,select,label,h1,h2,h3,p,li,figure,img,svg')||u);
    if(z&&z!==document.body){var r=z.getBoundingClientRect();if(r.width<innerWidth*.9||r.height<innerHeight*.9){rahmen(r);return;}}E.ziel.classList.remove('c6p-zda');}
  function rahmen(r){var s=E.ziel.style;s.left=(r.left-4)+'px';s.top=(r.top-4)+'px';s.width=(r.width+8)+'px';s.height=(r.height+8)+'px';E.ziel.classList.add('c6p-zda');}

  /* Nadel stecken: Punkt, Element, Kärtchen */
  function setze(x,y){var u=unterPunkt(x,y),w=wo(),br=buehnenRect();
    var rel={x:Math.round(((x-br.left)/br.width)*10000)/10000,y:Math.round(((y-br.top)/br.height)*10000)/10000};
    var z=u&&(u.closest('button,a,[role=button],input,textarea,select,label,h1,h2,h3,p,li,figure,img,svg')||u);
    if(z&&z!==document.body){var r=z.getBoundingClientRect();if(r.width<innerWidth*.9||r.height<innerHeight*.9)rahmen(r);}
    E.geist.classList.remove('c6p-gda');
    N.an=false;E.kn.setAttribute('aria-pressed','false');E.eb.classList.remove('c6p-an');E.eb.classList.add('c6p-schreibt');
    var pin=pinBauen(null);pin.classList.add('c6p-pneu');E.nad.appendChild(pin);pinStelle(pin,x,y);
    karteAuf({zustand:'schreiben',punkt:{x:x,y:y},rel:rel,wo:w,element:beschreibe(u),pin:pin});melde('nadel',false);}

  /* ---------- Papierkärtchen ---------- */
  function feldWert(){var f=N.karte&&N.karte.el&&N.karte.el.querySelector('textarea');return f?f.value.trim():'';}
  function karteAuf(k){if(N.karte)karteZu(true);N.karte=k;
    var d=el('div','c6p-karte');d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');d.setAttribute('aria-label','Nadel: was fällt dir hier auf?');d.tabIndex=-1;
    k.el=d;E.eb.appendChild(d);karteInhalt();karteSetzen();E.eb.classList.add('c6p-schreibt');
    requestAnimationFrame(function(){d.classList.add('c6p-kda');var f=d.querySelector('textarea');try{(f||d.querySelector('button')||d).focus({preventScroll:true});}catch(e){}});
    d.addEventListener('keydown',function(ev){if(ev.key==='Tab'){var z=[].slice.call(d.querySelectorAll('button,textarea')).filter(function(x){return x.offsetParent;});if(!z.length)return;
      var a=z[0],b=z[z.length-1];if(ev.shiftKey&&document.activeElement===a){ev.preventDefault();b.focus();}else if(!ev.shiftKey&&document.activeElement===b){ev.preventDefault();a.focus();}}});}
  function karteInhalt(){var k=N.karte,d=k.el;d.textContent='';
    if(k.zustand==='schreiben'){
      var f=el('form','c6p-kform');f.setAttribute('autocomplete','off');
      var lab=el('label','c6p-kfrage','Was fällt dir hier auf?');lab.setAttribute('for','c6p-kfeld');
      var ta=el('textarea','c6p-kfeld');ta.id='c6p-kfeld';ta.rows=3;ta.maxLength=2000;ta.placeholder='Ein, zwei Sätze reichen.';ta.setAttribute('enterkeyhint','send');
      try{var en=sessionStorage.getItem(ENTWURF);if(en)ta.value=en;}catch(e){}
      ta.addEventListener('input',function(){try{sessionStorage.setItem(ENTWURF,ta.value);}catch(e){}});
      ta.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing&&geraet()!=='iphone'){ev.preventDefault();kSenden();}});
      var z=el('div','c6p-ktasten');var ab=el('button','c6p-kleise','Abbrechen');ab.type='button';var se=el('button','c6p-ksenden','Senden');se.type='submit';
      ab.addEventListener('click',function(){karteZu();});z.appendChild(ab);z.appendChild(se);
      f.appendChild(lab);f.appendChild(ta);f.appendChild(z);f.addEventListener('submit',function(ev){ev.preventDefault();kSenden();});d.appendChild(f);return;}
    /* zeigen: eigener Text, Carls Antwort, Zustand */
    var m=finde(k.mid);var kopf=el('p','c6p-kkopf');kopf.appendChild(el('span','c6p-kort',(m&&m.raumName)||''));kopf.appendChild(el('span','c6p-kuhr',m?uhr(m.zeit):''));d.appendChild(kopf);
    d.appendChild(el('p','c6p-kmein',m?m.text:''));
    var c=el('div','c6p-kcarl');c.appendChild(avatar());var ct=el('p','c6p-kct');ct.setAttribute('aria-live','polite');c.appendChild(ct);d.appendChild(c);
    d.appendChild(el('p','c6p-kst'));
    var z2=el('div','c6p-ktasten');var pb=el('button','c6p-kleise','Alle Briefe');pb.type='button';pb.addEventListener('click',function(){karteZu();postAuf();});
    var fe=el('button','c6p-kfertig',k.zustand==='gesendet'?'Fertig':'Schließen');fe.type='button';fe.addEventListener('click',function(){karteZu();});
    z2.appendChild(pb);z2.appendChild(fe);d.appendChild(z2);karteAktuell();}
  function karteAktuell(){var k=N.karte;if(!k||k.zustand==='schreiben'||!k.el)return;var m=finde(k.mid),a=antwortAuf(k.mid);
    var ct=k.el.querySelector('.c6p-kct'),st=k.el.querySelector('.c6p-kst');if(!ct)return;
    if(a&&a.text){if(ct.textContent!==a.text)ct.textContent=a.text;ct.classList.remove('c6p-liest');}
    else if(a||k.zustand==='gesendet'){if(!ct.classList.contains('c6p-liest')){ct.textContent='';ct.classList.add('c6p-liest');ct.appendChild(el('span','c6p-vh',carlName()+' liest'));ct.appendChild(el('i',null,''));ct.appendChild(el('i',null,''));ct.appendChild(el('i',null,''));}}
    else{ct.textContent='';ct.classList.remove('c6p-liest');}
    if(st)st.textContent=zustand(m);if(N.karte)karteSetzen();}
  function kSenden(){var k=N.karte;if(!k)return;var t=feldWert();var f=k.el.querySelector('textarea');if(!t){try{f.focus();}catch(e){}karteRuetteln();return;}
    try{sessionStorage.removeItem(ENTWURF);}catch(e){}
    var m={id:neueId(),art:'nadel',von:'mensch',text:t.slice(0,4000),raum:k.wo.raum,raumName:k.wo.raumName,x:k.rel.x,y:k.rel.y,
      geraet:geraet(),bildschirm:bild(),zeit:new Date().toISOString(),sitzung:sitzung,fassung:fassung()};
    if(k.element)m.element=k.element;if(N.autor)m.autor=N.autor;
    k.mid=m.id;k.zustand='gesendet';if(k.pin){k.pin.dataset.id=m.id;k.pin.classList.remove('c6p-pneu');E.pins[m.id]=k.pin;pinBeschriften(k.pin,m);}
    ablegen(m).catch(function(){});setTimeout(function(){antworten(m).catch(function(){});},still()?0:200);
    karteInhalt();try{k.el.querySelector('.c6p-kfertig').focus({preventScroll:true});}catch(e){}}
  function karteRuetteln(){var d=N.karte&&N.karte.el;if(!d||still())return;d.classList.remove('c6p-rue');void d.offsetWidth;d.classList.add('c6p-rue');}
  function karteZu(sofort){var k=N.karte;if(!k)return;N.karte=null;E.eb.classList.remove('c6p-schreibt');E.ziel.classList.remove('c6p-zda');
    if(k.zustand==='schreiben'&&k.pin){var p=k.pin;p.classList.add('c6p-pweg');setTimeout(function(){try{p.remove();}catch(e){}},sofort||still()?0:220);}
    var d=k.el;if(d){d.classList.remove('c6p-kda');d.classList.add('c6p-kgeht');setTimeout(function(){try{d.remove();}catch(e){}},sofort||still()?0:200);}
    nadelnZeichnen();try{E.kn.focus({preventScroll:true});}catch(e){}}
  function karteSetzen(){var k=N.karte;if(!k||!k.el)return;var d=k.el,vv=window.visualViewport;
    var VW=vv?vv.width:innerWidth,VH=vv?vv.height:innerHeight,OX=vv?vv.offsetLeft:0,OY=vv?vv.offsetTop:0;
    var w=Math.min(330,VW-24);d.style.width=w+'px';var h=d.offsetHeight||200,x=k.punkt.x,y=k.punkt.y;
    /* Kandidaten: rechts neben dem Punkt, links, darunter, darüber. Die Karte meidet, was cfg.meide() nennt (Carls Gesicht). */
    var klemm=function(l,t){return{left:Math.max(OX+12,Math.min(l,OX+VW-12-w)),top:Math.max(OY+12,Math.min(t,OY+VH-12-h))};};
    var kand=[];
    if(x+26+w<=OX+VW-12)kand.push(klemm(x+26,y-Math.min(60,h*.3)));
    if(x-26-w>=OX+12)kand.push(klemm(x-26-w,y-Math.min(60,h*.3)));
    kand.push(klemm(x-w/2,y+18));kand.push(klemm(x-w/2,y-52-h));kand.push(klemm(OX+(VW-w)/2,(y+18+h<=OY+VH-12)?y+18:y-52-h));
    var meide=[];try{meide=(cfg.meide&&cfg.meide())||[];}catch(e){meide=[];}
    /* Dazu Plätze ganz neben, über und unter dem Gemiedenen (Carls Gesicht), damit die Karte es nie verdeckt, wenn es irgendwo Platz gibt */
    meide.forEach(function(r){var yy=Math.min(Math.max(y-Math.min(60,h*.3),r.top),r.bottom-h);
      if(r.right+12+w<=OX+VW-12)kand.push(klemm(r.right+12,yy));if(r.left-12-w>=OX+12)kand.push(klemm(r.left-12-w,yy));
      if(r.top-8-h>=OY+12)kand.push(klemm(x-w/2,r.top-8-h));if(r.bottom+8+h<=OY+VH-12)kand.push(klemm(x-w/2,r.bottom+8));});
    var ueberlapp=function(p){var s=0;meide.forEach(function(r){var dx=Math.min(p.left+w,r.right)-Math.max(p.left,r.left),dy=Math.min(p.top+h,r.bottom)-Math.max(p.top,r.top);if(dx>0&&dy>0)s+=dx*dy*(r.gewicht||4);});
      /* der Punkt selbst soll sichtbar bleiben */ if(x>p.left-6&&x<p.left+w+6&&y>p.top-6&&y<p.top+h+6)s+=4000;
      /* und die Karte bleibt nah am Punkt */ var ax=Math.max(p.left-x,0,x-(p.left+w)),ay=Math.max(p.top-y,0,y-(p.top+h));s+=Math.sqrt(ax*ax+ay*ay)*2;return s;};
    var best=kand[0],bw=Infinity;kand.forEach(function(p){var u=ueberlapp(p);if(u<bw){bw=u;best=p;}});
    d.style.left=Math.round(best.left)+'px';d.style.top=Math.round(best.top)+'px';}

  /* ---------- Nadeln im Raum ---------- */
  function pinBauen(m){var b=el('button','c6p-pin');b.type='button';b.innerHTML=nadelSvg(true);if(m)pinBeschriften(b,m);
    b.addEventListener('click',function(ev){ev.stopPropagation();var id=b.dataset.id;if(!id||N.an)return;var mm=finde(id);if(!mm)return;
      var r=b.getBoundingClientRect();karteAuf({zustand:'zeigen',mid:id,punkt:{x:r.left+7,y:r.bottom-4}});});return b;}
  function pinBeschriften(b,m){b.dataset.id=m.id;b.setAttribute('aria-label','Deine Nadel: '+String(m.text).slice(0,60));}
  function pinStelle(b,x,y){b.style.left=Math.round(x-7)+'px';b.style.top=Math.round(y-40)+'px';}
  var zeichneT=0;
  function nadelnZeichnen(){if(!N.ebene||zeichneT)return;zeichneT=requestAnimationFrame(function(){zeichneT=0;try{nadelnJetzt();}catch(e){}});}
  function nadelnJetzt(){var w=wo(),br=buehnenRect(),soll={};
    if(N.zeigen){N.verlauf.filter(function(m){return m.art==='nadel'&&m.von==='mensch'&&m.raum===w.raum&&typeof m.x==='number'&&typeof m.y==='number';}).slice(-30).forEach(function(m){soll[m.id]=m;});}
    if(N.karte&&N.karte.mid)soll[N.karte.mid]=soll[N.karte.mid]||finde(N.karte.mid);
    Object.keys(E.pins).forEach(function(id){if(!soll[id]){var p=E.pins[id];delete E.pins[id];if(N.karte&&N.karte.pin===p)return;p.classList.add('c6p-pweg');setTimeout(function(){try{p.remove();}catch(e){}},still()?0:200);}});
    Object.keys(soll).forEach(function(id){var m=soll[id];if(!m)return;var p=E.pins[id];if(!p){p=pinBauen(m);E.pins[id]=p;E.nad.appendChild(p);}
      var x=br.left+m.x*br.width,y=br.top+m.y*br.height;pinStelle(p,x,y);
      p.hidden=(x<-20||y<-20||x>innerWidth+20||y>innerHeight+40);});}
  function leuchte(id){nadelnJetzt();var p=E.pins[id];if(!p)return;p.classList.remove('c6p-leucht');void p.offsetWidth;p.classList.add('c6p-leucht');}
  function zeigen(an){N.zeigen=!!an;schreib(ZEIG,N.zeigen);zeigTaste();nadelnZeichnen();melde('zeigen',N.zeigen);}

  /* ---------- Briefe (Verlauf wie ein Messenger) ---------- */
  var ANFAENGE=[['Hier hakt es','Hier hakt es: '],['Das bremst','Das bremst mich: '],['Erwartet hab ich …','Ich hab erwartet, dass '],['Ich wünsch mir …','Ich wünsch mir, dass '],['Schön ist','Schön ist: ']];
  function briefe(host,o){o=o||{};
    var w=el('div','c6p-post');
    var kopf=el('header','c6p-pkopf');var fig=el('span','c6p-pfig');try{if(!(o.figur&&o.figur(fig)))fig.appendChild(avatar());}catch(e){fig.appendChild(avatar());}
    var ti=el('div','c6p-pti');var h2=el('h2','c6p-ptitel','Werkstatt-Post');ti.appendChild(h2);
    var stat=el('p','c6p-pstat');stat.setAttribute('role','status');stat.setAttribute('aria-live','polite');ti.appendChild(stat);
    kopf.appendChild(fig);kopf.appendChild(ti);
    if(o.zu){var x=el('button','c6p-pzu','×');x.type='button';x.setAttribute('aria-label','Briefe schließen, zurück');x.addEventListener('click',o.zu);kopf.appendChild(x);}
    var liste=el('div','c6p-pliste');liste.setAttribute('aria-live','polite');liste.tabIndex=0;liste.setAttribute('aria-label','Verlauf der Briefe');
    var form=el('form','c6p-pein');form.setAttribute('autocomplete','off');
    var anf=el('div','c6p-anf');ANFAENGE.forEach(function(a){var b=el('button','c6p-chip',a[0]);b.type='button';b.addEventListener('click',function(){ta.value=a[1];hoehe();ta.focus();try{ta.setSelectionRange(ta.value.length,ta.value.length);}catch(e){}});anf.appendChild(b);});
    var zeile=el('div','c6p-zeile');var lab=el('label','c6p-vh','Deine Nachricht an die Werkstatt');lab.setAttribute('for','c6p-pfeld');
    var ta=el('textarea','c6p-pfeld');ta.id='c6p-pfeld';ta.rows=1;ta.maxLength=4000;ta.placeholder='Was ist dir aufgefallen?';ta.setAttribute('enterkeyhint','send');
    var se=el('button','c6p-psenden');se.type='submit';se.setAttribute('aria-label','Senden');se.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5.5 11.5L12 5l6.5 6.5"/></svg>';
    zeile.appendChild(lab);zeile.appendChild(ta);zeile.appendChild(se);form.appendChild(anf);form.appendChild(zeile);
    w.appendChild(kopf);w.appendChild(liste);w.appendChild(form);host.appendChild(w);
    var hoehe=function(){ta.style.height='auto';ta.style.height=Math.min(ta.scrollHeight,132)+'px';};
    try{var en=sessionStorage.getItem(ENTWURF+'.post');if(en)ta.value=en;}catch(e){}
    ta.addEventListener('input',function(){hoehe();try{sessionStorage.setItem(ENTWURF+'.post',ta.value);}catch(e){}});
    ta.addEventListener('keydown',function(ev){if(ev.key==='Enter'&&!ev.shiftKey&&!ev.isComposing&&geraet()!=='iphone'){ev.preventDefault();abschicken();}});
    form.addEventListener('submit',function(ev){ev.preventDefault();abschicken();});
    function abschicken(){var t=ta.value.trim();if(!t){ta.focus();return;}ta.value='';hoehe();try{sessionStorage.removeItem(ENTWURF+'.post');}catch(e){}
      schick(t,{wo:o.wo?o.wo():undefined}).catch(function(){});anf.hidden=true;try{ta.focus({preventScroll:true});}catch(e){}unten=true;}
    var knoten={},unten=true;
    liste.addEventListener('scroll',function(){unten=liste.scrollHeight-liste.scrollTop-liste.clientHeight<90;},{passive:true});
    function brief(m){var b=el('div','c6p-b '+(m.von==='carl'?'c6p-bc':'c6p-bm')+(m.art==='nadel'?' c6p-bn':''));b.dataset.id=m.id;
      if(m.von==='carl')b.appendChild(avatar());
      var k=el('div','c6p-bk');
      if(m.von==='carl')k.appendChild(el('p','c6p-bwer',carlName()));
      else if(m.art==='nadel'){var ort=el('p','c6p-bort');ort.innerHTML=nadelSvg(false);ort.appendChild(el('span',null,'Nadel · '+(m.raumName||m.raum||'')));k.appendChild(ort);}
      k.appendChild(el('p','c6p-bt'));
      var meta=el('p','c6p-bmeta');meta.appendChild(el('time'));meta.appendChild(el('span','c6p-bst'));k.appendChild(meta);
      if(m.von!=='carl'&&m.art==='nadel'&&o.zurStelle){var zs=el('button','c6p-bstelle','Zur Stelle');zs.type='button';zs.addEventListener('click',function(){o.zurStelle(finde(m.id)||m);});k.appendChild(zs);}
      b.appendChild(k);return b;}
    function aktuell(b,m){var t=b.querySelector('.c6p-bt');
      if(m.von==='carl'&&m.st==='schreibt'&&!m.text){if(!t.classList.contains('c6p-liest')){t.textContent='';t.classList.add('c6p-liest');t.appendChild(el('span','c6p-vh',carlName()+' liest'));t.appendChild(el('i'));t.appendChild(el('i'));t.appendChild(el('i'));}}
      else{t.classList.remove('c6p-liest');if(t.textContent!==m.text)t.textContent=m.text;}
      var ti2=b.querySelector('time');var u=uhr(m.zeit);if(ti2.textContent!==u){ti2.textContent=u;try{ti2.dateTime=m.zeit;}catch(e){}}
      var z=zustand(m),st=b.querySelector('.c6p-bst');var zt=(m.von!=='carl'&&m.art!=='nadel'&&m.raumName?' · aus '+m.raumName:'')+(z?' · '+z:'');
      if(st.textContent!==zt)st.textContent=zt;b.classList.toggle('c6p-weg',m.st!=='da'&&m.st!=='schreibt');}
    function gruss(){var g=el('div','c6p-b c6p-bc c6p-gruss');g.appendChild(avatar());var k=el('div','c6p-bk');k.appendChild(el('p','c6p-bwer',carlName()));
      k.appendChild(el('p','c6p-bt','Schreib mir, was hakt, bremst oder dich freut. Ich steck’s ein, und die Werkstatt liest es nachts.'));
      var t2=el('p','c6p-bt c6p-btipp');t2.appendChild(document.createTextNode('Oder steck mit der roten Nadel direkt an die Stelle, die du meinst.'));k.appendChild(t2);g.appendChild(k);return g;}
    function zeichne(){try{
      stat.textContent=kopfStatus();
      if(N.verlauf.some(function(m){return m.von==='mensch'&&m.sitzung===sitzung;}))anf.hidden=true;
      var reihe=[],t0='';
      if(!N.verlauf.length){if(!knoten._gruss)knoten._gruss=gruss();reihe.push(knoten._gruss);}
      N.verlauf.forEach(function(m){var tg=tagVon(m.zeit);if(tg!==t0){t0=tg;var key='tag:'+tg;if(!knoten[key]){var p=el('p','c6p-tag');p.appendChild(el('span',null,tagName(m.zeit)));knoten[key]=p;}reihe.push(knoten[key]);}
        var b=knoten[m.id];if(!b){b=brief(m);knoten[m.id]=b;if(!still()&&liste.childNodes.length)b.classList.add('c6p-bneu');}aktuell(b,m);reihe.push(b);});
      reihe.forEach(function(n,i){if(liste.childNodes[i]!==n)liste.insertBefore(n,liste.childNodes[i]||null);});
      while(liste.childNodes.length>reihe.length)liste.removeChild(liste.lastChild);
      if(unten)liste.scrollTop=liste.scrollHeight;}catch(e){}}
    var los=hoer(function(was,id){if(was==='text'&&id&&knoten[id]){var m=finde(id);if(m){aktuell(knoten[id],m);if(unten)liste.scrollTop=liste.scrollHeight;}return;}if(was!=='nadel')zeichne();});
    zeichne();setTimeout(hoehe,0);
    return{el:w,feld:ta,liste:liste,zeichne:zeichne,weg:function(){los();try{w.remove();}catch(e){}},nachUnten:function(){unten=true;liste.scrollTop=liste.scrollHeight;}};}

  function postAuf(){try{cfg.post&&cfg.post();}catch(e){}}

  return{N:N,start:function(){try{start();}catch(e){}try{ebeneBauen();}catch(e){}},modus:modus,zeigen:zeigen,schick:schick,briefe:briefe,leuchte:leuchte,
    nadelnNeu:nadelnZeichnen,karteZu:karteZu,setze:setze,nachschicken:nachschicken,knopfZeigen:knopfZeigen,blattAuf:blattAuf,blattZu:blattZu,
    verlauf:function(){return N.verlauf.slice();},stand:function(){return{db:N.dbStatus,ausgang:ausgang().length,sample:!!N.sample&&!N.sampleAus};},
    hoer:hoer,ERSATZ:ERSATZ,sitzung:sitzung,_beschreibe:beschreibe,
    /* nur Darstellung nach außen (der Raum „post“ zeichnet die Briefe selbst als Zettel) */
    zustand:zustand,kopfStatus:kopfStatus,anfaenge:ANFAENGE.slice(),uhr:uhr,tagName:tagName,tagVon:tagVon,finde:finde,antwortAuf:antwortAuf,carlName:carlName};
}
/* Anbindung an Carl 6 (nur gegen die öffentliche C6-Schnittstelle) */
var C6=window.C6;
if(C6){
  var postFig=null;
  var buehne=function(){var id=C6.jetzt,b=null;try{if(id)b=document.querySelector('.c6-buehne[data-raum="'+String(id).replace(/"/g,'')+'"]');}catch(e){}
    if(b&&b.getBoundingClientRect().width>0)return b;
    var alle=[].slice.call(document.querySelectorAll('.c6-buehne')).filter(function(e){if(e.hidden)return false;var r=e.getBoundingClientRect();return r.width>40&&r.height>40&&r.left<innerWidth*.5&&r.right>innerWidth*.5;});
    return alle[0]||document.getElementById('c6')||document.body;};
  var klon=function(q){try{if(!q)return null;var s=q.tagName&&q.tagName.toLowerCase()==='svg'?q:q.querySelector&&q.querySelector('svg');if(!s)return null;var c=s.cloneNode(true);c.removeAttribute('id');c.setAttribute('aria-hidden','true');return c;}catch(e){return null;}};
  /* Carls Gesicht (oberer Teil der Figur im aktuellen Raum): die Karte weicht ihm aus */
  var gesicht=function(){var aus=[];try{var c=C6.carl,e=c&&c.el;if(e&&e.isConnected){var r=e.getBoundingClientRect();
      if(r.width>20&&r.height>20&&r.bottom>0&&r.top<innerHeight){aus.push({left:r.left-6,top:r.top-6,right:r.right+6,bottom:r.top+r.height*.72,gewicht:4});
        aus.push({left:r.left,top:r.top+r.height*.72,right:r.right,bottom:r.bottom,gewicht:1});}}}catch(e){}return aus;};
  var M=NadelPostMotor({
    wo:function(){var id=C6.jetzt||'',d=(C6.raeume||{})[id];return{raum:id||'?',raumName:(d&&d.name)||id||'?'};},
    buehne:buehne,
    geraet:function(){return C6.geraet||'?';},
    ruhig:function(){return !!C6.ruhig;},
    carlName:function(){try{return (C6.S&&C6.S.du&&C6.S.du.carlName)||'Carl';}catch(e){return 'Carl';}},
    avatar:function(h){try{if(C6.figur&&typeof C6.figur.bild==='function'){var s=C6.figur.bild(36,{stimmung:'froh'});if(s&&/<svg/i.test(s)){h.innerHTML=s;var v=h.querySelector('svg');if(v){v.setAttribute('aria-hidden','true');v.removeAttribute('id');}h.classList.add('c6p-avfig');return true;}}}catch(e){}
      var c=klon(postFig&&postFig.el)||klon(C6.carl&&C6.carl.el);return c||null;},
    post:function(){try{if(C6.raeume&&C6.raeume.post)C6.geh('post');}catch(e){}},
    melde:function(was,id){try{C6.bus.emit(was==='nadel'?'nadel':'post',was==='nadel'?id:{was:was,id:id});}catch(e){}},
    eltern:function(){return document.body;},
    meide:gesicht,
    platziere:function(kn){platz(kn);}
  });
  /* Sichtbar erst nach dem Rundgang (S.du.fertig) und nie im Rundgang oder in der Post selbst */
  function sichtbar(){try{if(C6.rundgang&&C6.rundgang.an)return false;if(C6.jetzt==='rundgang'||C6.jetzt==='post')return false;
      if((C6.kieselpark&&C6.kieselpark.offen)||(C6.keimflug&&C6.keimflug.offen))return false; /* Vollbild-Spiele */
      var fertig=!!(C6.S&&C6.S.du&&C6.S.du.fertig);if(!fertig&&C6.raeume&&C6.raeume.rundgang)return false;return true;}catch(e){return true;}}
  /* Knopf: rechts unter dem Höhenregler. Liegt dort ein Knopf der App, rutscht er höchstens 80 px tiefer, sonst auf die linke Seite. */
  function projektorAuf(){try{return !!(C6.projektor&&C6.projektor.offen)||document.documentElement.classList.contains('c6z-proj-auf');}catch(e){return false;}}
  /* Liegt unter einem Rechteck Inhalt der App? Knöpfe/Felder und gezeichnete Formen/Texte (nicht bühnengroße Hintergründe). */
  var formen=[];
  function formenSammeln(){formen=[];try{var alle=[].slice.call(document.querySelectorAll('.c6-buehne svg')).filter(function(v){var r=v.getBoundingClientRect();return r.width>0&&r.height>0&&r.right>0&&r.left<innerWidth&&r.bottom>0&&r.top<innerHeight;});
      for(var i=0;i<alle.length&&formen.length<2500;i++){var k=alle[i].querySelectorAll('path,rect,circle,ellipse,polygon,polyline,line,text,image,use');
        for(var j=0;j<k.length&&formen.length<2500;j++){var r=k[j].getBoundingClientRect();if(r.width<2||r.height<2)continue;if(r.width>innerWidth*.7&&r.height>innerHeight*.5)continue;
          if(r.right<0||r.left>innerWidth||r.bottom<0||r.top>innerHeight*.6)continue;formen.push(r);}}}catch(e){formen=[];}}
  function formBelegt(l,t,wd,ht){var x0=l-2,x1=l+wd+2,y0=t-2,y1=t+ht+2;for(var i=0;i<formen.length;i++){var r=formen[i];if(r.left<x1&&r.right>x0&&r.top<y1&&r.bottom>y0)return true;}return false;}
  function formFlaeche(l,t,wd,ht){var s=0;for(var i=0;i<formen.length;i++){var r=formen[i];var dx=Math.min(l+wd,r.right)-Math.max(l,r.left),dy=Math.min(t+ht,r.bottom)-Math.max(t,r.top);if(dx>0&&dy>0)s=Math.max(s,dx*dy);}return s;}
  function belegt(l,t,wd,ht){if(formBelegt(l,t,wd,ht))return true;var eb=document.getElementById('c6p-ebene');
    var px=[[l+6,t+6],[l+wd-6,t+6],[l+wd/2,t+ht/2],[l+6,t+ht-6],[l+wd-6,t+ht-6]];
    for(var i=0;i<px.length;i++){var x=px[i][0],y=px[i][1];if(x<0||y<0||x>=innerWidth||y>=innerHeight)continue;
      var l2=document.elementsFromPoint(x,y)||[];
      for(var k=0;k<l2.length;k++){var e=l2[k];if(!e||e===document.documentElement||e===document.body)break;if(eb&&eb.contains(e))continue;
        var tag=e.tagName.toLowerCase();var r=e.getBoundingClientRect();if(r.width>innerWidth*.7&&r.height>innerHeight*.5)break;
        if(/^(button|a|input|textarea|select|img|canvas|video)$/.test(tag)||e.getAttribute('role')==='button')return true;
        if(/^(path|rect|circle|ellipse|polygon|polyline|line|text|tspan|image|use)$/.test(tag)){if(r.width<innerWidth*.9||r.height<innerHeight*.6)return true;break;}
        if(e.childElementCount===0&&(e.textContent||'').trim())return true;
        break;}}
    return false;}
  function platz(kn){try{kn=kn||document.getElementById('c6p-knopf');if(!kn)return;
      var da=sichtbar();M.knopfZeigen(da);if(!da)return;
      kn.style.top='';kn.style.left='';kn.style.right='';kn.classList.remove('c6p-links');
      var r0=kn.getBoundingClientRect();if(!r0.width)return;var W=r0.width,H=r0.height;
      var rand=Math.round(parseFloat(getComputedStyle(kn).right)||10);formenSammeln();
      var setz=function(l,t){kn.classList.toggle('c6p-links',l<innerWidth/2);kn.style.right='auto';kn.style.left=Math.round(l)+'px';kn.style.top=Math.round(t)+'px';};
      /* Fester Platz oben rechts unter dem Höhenregler. Liegt dort ein Knopf der App, rutscht er nur senkrecht, höchstens 80 px, nie nach links auf Inhalt. */
      var l0=innerWidth-rand-W,stufen=[0,40,80];
      /* Offene Leinwand: deckt sie den festen Platz, rutscht der Knopf senkrecht unter ihre Unterkante (gleiche Spalte); reicht das Band bis zu Chips/Dock nicht, bleibt er oben auf der Leinwand-Ecke, die dort nur den Titel trägt. */
      if(projektorAuf()){try{var lw=document.querySelector('.c6z-lw'),lr=lw&&lw.getBoundingClientRect();
          if(lr&&lr.width>40&&lr.left<l0+W&&lr.right>l0&&lr.top<r0.top+H&&lr.bottom>r0.top){var tu=Math.round(lr.bottom+8);
            var grenze=innerHeight;var un=document.querySelector('.c6k-unten'),ur=un&&un.getBoundingClientRect();if(ur&&ur.height)grenze=Math.min(grenze,ur.top);
            var ch=document.querySelector('#c6[data-chips] .c6k-chips'),cr=ch&&ch.getBoundingClientRect();if(cr&&cr.height)grenze=Math.min(grenze,cr.top);
            for(var tt=tu;tt+H<=grenze-8;tt+=16){if(!belegt(l0,tt,W,H)){setz(l0,tt);return;}}}
          return;}catch(e){}}
      for(var ti=0;ti<stufen.length;ti++){var t2=r0.top+stufen[ti];if(!belegt(l0,t2,W,H)){if(ti)setz(l0,t2);return;}}
      /* alles belegt: der Platz mit der kleinsten Überdeckung durch Formen; am angestammten Platz bleiben, wenn er nicht schlechter ist */
      var best=null,bf=Infinity;for(var ti2=0;ti2<stufen.length;ti2++){var t3=r0.top+stufen[ti2],f=formFlaeche(l0,t3,W,H);if(f<bf-40){bf=f;best=t3;}}
      if(best!=null&&best!==r0.top)setz(l0,best);
    }catch(e){}}
  var platzSpaeter=function(){setTimeout(function(){platz();},60);setTimeout(function(){platz();},520);setTimeout(function(){platz();},1000);};
  var api={
    modus:function(an){M.modus(an);},
    zeigen:function(an){M.zeigen(an);},
    post:function(){try{C6.geh('post');}catch(e){}},
    blatt:function(an){if(an===false)M.blattZu();else M.blattAuf();},
    schick:function(t,o){return M.schick(t,o);},
    verlauf:function(){return M.verlauf();},
    stand:function(){return M.stand();},
    _motor:M,
    _figur:function(ctl){postFig=ctl;}
  };
  Object.defineProperty(api,'an',{get:function(){return !!M.N.an;},enumerable:true});
  Object.defineProperty(api,'offen',{get:function(){return !!(M.N.an||M.N.karte||M.N.blatt);},enumerable:true});
  C6.nadel=api;
  try{C6.bus.on('raum',function(){M.blattZu(true);M.nadelnNeu();setTimeout(M.nadelnNeu,480);});}catch(e){}
  try{C6.bus.on('hoehe',function(){M.blattZu(true);setTimeout(M.nadelnNeu,480);});}catch(e){}
  /* die Nadeln hängen außerhalb der Bühne: Schatten-Richtung des aktuellen Raums auf den Nadel-Container spiegeln */
  function lichtSpiegeln(){try{var c=document.querySelector('.c6p-nadeln'),b=C6.gebaut&&C6.gebaut(C6.jetzt);if(!c)return;
      var st=b?getComputedStyle(b):null;['dx','dy','a'].forEach(function(k){var v=st?st.getPropertyValue('--c6-schatten-'+k).trim():'';
        if(v)c.style.setProperty('--c6-schatten-'+k,v);else c.style.removeProperty('--c6-schatten-'+k);});}catch(e){}}
  ['licht','nadel'].forEach(function(n){try{C6.bus.on(n,lichtSpiegeln);}catch(e){}});
  try{C6.bus.on('raum',function(){lichtSpiegeln();setTimeout(lichtSpiegeln,480);});}catch(e){}
  setTimeout(lichtSpiegeln,0);
  ['raum','hoehe','projektor','geraet','rundgang','zustand','chips','tastatur','spiel'].forEach(function(n){try{C6.bus.on(n,platzSpaeter);}catch(e){}});
  addEventListener('resize',platzSpaeter);
  var los=function(){M.start();platz();platzSpaeter();};
  if(document.body)setTimeout(los,0);else addEventListener('DOMContentLoaded',los);
}
