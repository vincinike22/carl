(function(){
 C6.einrichten.oeffne({ort:'space', sid:window._sid});
 function tipp(id, fx, fy){
   var reihe=C6.einrichten.katalog.filter(function(k){return k.id===id})[0].reihe;
   [].forEach.call(document.querySelectorAll('.c6e-reihe'),function(b){ if(b.textContent===({moebel:'Möbel',pflanzen:'Pflanzen',lampen:'Lampen',bilder:'Bilder',teppiche:'Teppiche'})[reihe]) b.click(); });
   document.querySelector('.c6e-karte[data-id="'+id+'"]').click();
   var f=document.querySelector('.c6e-fang'), r=f.getBoundingClientRect();
   f.dispatchEvent(new MouseEvent('click',{bubbles:true,clientX:r.left+r.width*fx,clientY:r.top+r.height*fy}));
 }
 var pc=C6.geraet==='computer'; if(pc){tipp('bank',0.2,0.8); tipp('stehlampe',0.33,0.8); tipp('topf',0.08,0.8); tipp('teppichrund',0.5,0.86);} else {tipp('bank',0.24,0.62); tipp('stehlampe',0.86,0.62); tipp('topf',0.06,0.62);}
 console.error('dinge '+C6.einrichten.dinge('space:'+window._sid).length);
})()
