import os,glob,sys
R=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def lies(p):
    return open(p,encoding='utf8').read()
css=[R+'/src/kern.css']+sorted(glob.glob(R+'/src/module/*.css'))+sorted(glob.glob(R+'/src/raeume/*.css'))
js=[R+'/src/kern.js']+sorted(glob.glob(R+'/src/module/*.js'))+sorted(glob.glob(R+'/src/raeume/*.js'))+[R+'/src/start.js']
out=['<title>Carl</title>','<meta name="theme-color" content="#f4eee4">',
 '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600&display=swap" rel="stylesheet">']
out.append('<style>'+'\n'.join(lies(p) for p in css if os.path.exists(p))+'</style>')
out.append('<div id="c6"></div>')
for p in js:
    if os.path.exists(p):
        out.append('<script>/*'+os.path.basename(p)+'*/\ntry{(function(){\n'+lies(p)+'\n})()}catch(e){console.error("Modul '+os.path.basename(p)+'",e)}</script>')
dst=sys.argv[1] if len(sys.argv)>1 else R+'/carl6.html'
open(dst,'w',encoding='utf8').write('\n'.join(out))
# Vollseite zum lokalen Testen
open(R+'/carl6-test.html','w',encoding='utf8').write('<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>html,body{margin:0;padding:0}</style></head><body>'+'\n'.join(out)+'</body></html>')
print('gebaut',dst)
