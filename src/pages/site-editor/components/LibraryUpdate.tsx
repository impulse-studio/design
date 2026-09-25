import { useState } from "react"
import { useMutation } from "@tanstack/react-query"
import { useOrpc } from "@/lib/use-orpc"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { OptionSelect } from "@/components/shared/OptionSelect"
import { FileDiff } from "@/components/shared/FileDiff"
import { compareLibrary } from "@/features/libraries/merge"
import type { SiteRecord } from "@/features/sites/schema"
import type { LibrarySnapshot } from "@/features/libraries/schema"
export function LibraryUpdate({record,snapshot,onClose,onUpdated}:{record:SiteRecord;snapshot:LibrarySnapshot;onClose:()=>void;onUpdated:()=>Promise<void>}) {
  const orpc=useOrpc(),install=useMutation(orpc.libraries.install.mutationOptions())
  const [resolutions,setResolutions]=useState<Record<string,"local"|"incoming">>({}),[error,setError]=useState<string|null>(null)
  const differences=compareLibrary(record.doc,snapshot)
  const unresolved=differences.some(diff=>diff.conflict && !resolutions[diff.path])
  const apply=async()=>{if(install.isPending)return;setError(null);try{await install.mutateAsync({projectId:record.id,expectedRevision:record.revision,versionId:snapshot.id,resolutions});await onUpdated();onClose()}catch(error){setError(error instanceof Error?error.message:"Mise à jour impossible.")}}
  return <Dialog open onOpenChange={open=>{if(!open&&!install.isPending)onClose()}}><DialogContent className="max-h-[85svh] overflow-y-auto sm:max-w-3xl"><DialogHeader><DialogTitle>{snapshot.name} · version {snapshot.version}</DialogTitle><DialogDescription>Les changements s’appliquent uniquement à ce projet. Les personnalisations sont conservées ; résolvez les conflits avant de continuer.</DialogDescription></DialogHeader>
    <div className="flex flex-col gap-4">{differences.map(diff=><div key={diff.path} className="min-w-0 rounded-md border p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="break-all text-xs font-medium">{diff.path}</span><span className="text-xs text-muted-foreground">{diff.conflict?"Conflit":diff.incoming===undefined?"Suppression":diff.local===undefined?"Ajout":"Mise à jour"}</span></div>
      {diff.conflict&&<OptionSelect value={resolutions[diff.path]??""} label={`Résolution pour ${diff.path}`} placeholder="Choisir une résolution" disabled={install.isPending} options={[{value:"local",label:"Conserver ma version"},{value:"incoming",label:diff.incoming===undefined?"Accepter la suppression":"Utiliser la bibliothèque"}]} onValueChange={value=>setResolutions(previous=>({...previous,[diff.path]:value as "local"|"incoming"}))}/>}
      {diff.kind==="file"?<details className="mt-2 text-xs"><summary className="cursor-pointer text-muted-foreground">Voir les différences</summary><div className="mt-2 max-h-80 overflow-auto"><FileDiff file={diff.path} rows={[...(diff.local??"").split("\n").map((text,index)=>({old:index+1,cur:null,type:"del" as const,text})),...(diff.incoming??"").split("\n").map((text,index)=>({old:null,cur:index+1,type:"add" as const,text}))]}/>{diff.conflict&&<FileDiff file="Version d’origine" mode="code" rows={(diff.base??"").split("\n").map((text,index)=>({old:null,cur:index+1,type:"ctx" as const,text}))}/>}</div></details>:<p className="mt-2 text-xs text-muted-foreground">Asset binaire : choisissez la version à conserver.</p>}
    </div>)}{!differences.length&&<p className="text-sm text-muted-foreground">Aucun fichier à remplacer. Les personnalisations locales restent intactes.</p>}</div>
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
    <div className="flex justify-end gap-2"><Button variant="ghost" disabled={install.isPending} onClick={onClose}>Annuler</Button><Button disabled={install.isPending||unresolved} onClick={()=>void apply()}>{install.isPending?"Compilation et application…":"Appliquer à ce projet"}</Button></div>
  </DialogContent></Dialog>
}
