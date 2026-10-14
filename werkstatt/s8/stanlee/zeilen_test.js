global.window=global; global.navigator={userAgent:''}; global.document={addEventListener(){}};
const {webcrypto}=require('crypto'); globalThis.crypto=webcrypto;
require('vm').runInThisContext(require('fs').readFileSync('/home/claude/carl/n13/src/module/verbindung.js','utf8'));
(async()=>{const out=[];for(const n of ['K7M2QX','AAAAAA','Z9Z9Z9','HQ3PWN']) for(const w of ['claude','codex']) out.push({n,w,js:await C6.verbindung._code(n,w),mac:C6.verbindung._zeile(n,w,'mac'),linux:C6.verbindung._zeile(n,w,'linux'),win:C6.verbindung._zeile(n,w,'windows')});
require('fs').writeFileSync('faelle.json',JSON.stringify(out));})();
