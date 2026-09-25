#!/usr/bin/env node
import { readdir, readFile, realpath, stat } from "node:fs/promises"
import { resolve, join, relative, sep } from "node:path"
import { createHash } from "node:crypto"
import { createInterface } from "node:readline/promises"
import { stdin, stdout } from "node:process"

const [serverArg, folderArg] = process.argv.slice(2)
if(!serverArg || !folderArg) { console.error('Usage : node scripts/library-connect.mjs https://studio.example.com /chemin/bibliotheque'); process.exit(1) }
const server = new URL('/api/library-sync',serverArg)
if(server.protocol!=='https:' && !(server.protocol==='http:' && ['localhost','127.0.0.1','[::1]'].includes(server.hostname))) throw new Error('Utilisez HTTPS ou un serveur local.')
const root=await realpath(resolve(folderArg))
if(!(await stat(root)).isDirectory()) throw new Error('Le chemin doit être un dossier.')
const rl=createInterface({input:stdin,output:stdout})
let token=await rl.question('Code temporaire affiché dans le Studio : ')
rl.close()
const call=async(payload)=>{
  const response=await fetch(server,{method:payload?'POST':'GET',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:payload?JSON.stringify(payload):undefined,signal:AbortSignal.timeout(180_000),redirect:'error'})
  const data=await response.json()
  if(!response.ok) { const error=new Error(data.error ?? `Erreur ${response.status}`); error.status=response.status; throw error }
  return data
}
const connection=await call()
if(!connection.token) throw new Error('Le code temporaire a déjà été utilisé.')
token=connection.token
const mime={png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',webp:'image/webp',svg:'image/svg+xml',woff2:'font/woff2'}
const snapshot=async()=>{
  const files={},assets={}; let size=0,count=0
  const visit=async dir=>{
    for(const entry of (await readdir(dir,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))) {
      if(entry.name.startsWith('.') || ['node_modules','dist','credentials','secrets'].includes(entry.name)) continue
      if(entry.isSymbolicLink()) continue
      const path=join(dir,entry.name)
      const actual=await realpath(path)
      if(!actual.startsWith(root+sep)) throw new Error('Chemin extérieur au dossier autorisé.')
      if(entry.isDirectory()) {await visit(path);continue}
      const ext=entry.name.split('.').at(-1)
      if(!mime[ext] && !/\.(vue|[jt]sx?|css|json)$/.test(entry.name)) continue
      const info=await stat(path);size+=info.size;count++
      if(size>10_000_000 || count>250) throw new Error('Bibliothèque limitée à 250 fichiers et 10 Mo.')
      const data=await readFile(path),key=relative(root,path).split(sep).join('/')
      if(mime[ext]) assets[key]={mime:mime[ext],base64:data.toString('base64')}
      else files[key]=data.toString('utf8')
    }
  }
  await visit(root)
  const pkg=JSON.parse(files['package.json'] ?? '{}')
  const manifest=JSON.parse(files['studio.library.json'] ?? '{}')
  return {framework:connection.framework,files,assets,dependencies:{...pkg.peerDependencies,...pkg.dependencies},components:manifest.components ?? []}
}
let digest='',stopped=false
process.on('SIGINT',()=>{stopped=true})
process.on('SIGTERM',()=>{stopped=true})
console.log(`Synchronisation en lecture seule : ${root}`)
while(!stopped) {
  try {
    const payload=await snapshot()
    const next=createHash('sha256').update(JSON.stringify(payload)).digest('hex')
    if(next!==digest) {const result=await call(payload);digest=next;console.log(`Bibliothèque synchronisée · version ${result.version}`)}
    else await call()
  } catch(error) {
    console.error(error.message)
    if([401,403].includes(error.status)) break
  }
  await new Promise(resolve=>setTimeout(resolve,3000))
}
