import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { SearchField } from "@/components/shared/SearchField"
import { compileSite } from "@/features/sites/compile"
import { previewHtml } from "@/features/sites/bridge"
import { createSiteDocument } from "@/features/sites/template"
import { applyLibrary, libraryPrefix } from "@/features/libraries/merge"
import type { LibrarySnapshot } from "@/features/libraries/schema"
export function LibraryCatalog({snapshot}:{snapshot:LibrarySnapshot}) {
  const [query,setQuery]=useState(""),[html,setHtml]=useState<string|null>(null),[error,setError]=useState<string|null>(null),[busy,setBusy]=useState(false)
  const preview=async(index:number)=>{
    if(busy)return
    setBusy(true);setError(null)
    try {
      const component=snapshot.payload.components[index]
      const doc=applyLibrary(createSiteDocument(snapshot.payload.framework),snapshot)
      const source=component.example??component.path
      const name=component.example?"default":component.exportName
      const statement=`import ${name==="default"?"Example":`{ ${name} as Example }`} from ${JSON.stringify("../"+libraryPrefix(snapshot.libraryId)+source)};`
      doc.files[doc.kind==="vue-vite"?"src/App.vue":"src/App.tsx"]=doc.kind==="vue-vite"?`<script setup lang="ts">${statement}</script><template><Example /></template>`:`${statement}\nexport function App(){return <Example />}`
      setHtml(previewHtml(await compileSite(doc)))
    } catch(error){setError(error instanceof Error?error.message:"Aperçu indisponible.")}
    finally{setBusy(false)}
  }
  return <div className="flex flex-col gap-3">
    <SearchField value={query} onValueChange={setQuery} label="Rechercher un composant" placeholder="Rechercher un composant…"/>
    <div className="divide-y rounded-md border">
      {snapshot.payload.components.map((component,index)=>({component,index})).filter(({component})=>(component.name+component.description).toLowerCase().includes(query.toLowerCase())).map(({component,index})=><div key={`${component.path}:${component.exportName}`} className="flex flex-col gap-2 p-3">
        <div className="flex items-center justify-between gap-3"><span className="font-medium">{component.name}</span><Button size="sm" variant="ghost" disabled={busy || (!component.example && Object.values(component.props).some(type=>!type.includes("optionnel")))} onClick={()=>void preview(index)}>Aperçu</Button></div>
        <p className="text-xs text-muted-foreground">{component.description||component.path}</p>
        <code className="break-all text-xs">{component.exportName==="default"?`import ${component.name}`:`import { ${component.exportName} }`} from "@/libraries/{snapshot.libraryId}/{component.path}"</code>
        <div className="flex flex-wrap gap-1">{Object.entries(component.props).map(([name,type])=><Badge key={name} variant="secondary">{name}: {type}</Badge>)}</div>
        {!component.example && Object.values(component.props).some(type=>!type.includes("optionnel"))&&<p className="text-xs text-muted-foreground">Un exemple avec les props requises est nécessaire pour l’aperçu.</p>}
      </div>)}
      {!snapshot.payload.components.length&&<p className="p-4 text-sm text-muted-foreground">Aucun composant exporté détecté. Déclarez ses exports dans studio.library.json.</p>}
    </div>
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
    <Dialog open={html!==null} onOpenChange={open=>{if(!open)setHtml(null)}}><DialogContent className="sm:max-w-3xl"><DialogHeader><DialogTitle>Aperçu du composant</DialogTitle><DialogDescription>Exemple isolé de la version {snapshot.version}.</DialogDescription></DialogHeader>{html&&<iframe title="Aperçu de bibliothèque" sandbox="allow-scripts" srcDoc={html} className="h-96 w-full rounded-md border bg-background"/>}</DialogContent></Dialog>
  </div>
}
