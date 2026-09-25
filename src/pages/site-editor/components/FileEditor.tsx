import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import { z } from "zod"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
const schema=z.object({content:z.string().max(200_000,"Fichier trop volumineux.")})
export function SiteFileEditor({path,content,onSave,onCancel}:{path:string;content:string;onSave:(path:string,content:string)=>Promise<void>;onCancel:()=>void}) {
  const [error,setError]=useState<string|null>(null)
  const form=useForm({defaultValues:{content},validators:{onSubmit:schema},onSubmit:async({value})=>{setError(null);try{await onSave(path,schema.parse(value).content);onCancel()}catch(error){setError(error instanceof Error?error.message:"Enregistrement impossible.")}}})
  return <form className="flex flex-col gap-3 p-4" onSubmit={e=>{e.preventDefault();if(!form.state.isSubmitting)void form.handleSubmit()}}>
    <p className="text-xs text-muted-foreground">Cette modification concerne uniquement ce projet.</p>
    <form.Field name="content">{field=><Textarea aria-label={`Code de ${path}`} aria-invalid={!field.state.meta.isValid} aria-describedby={error?"file-editor-error":undefined} value={field.state.value} onChange={e=>field.handleChange(e.target.value)} onBlur={field.handleBlur} className="min-h-96 font-mono text-xs" spellCheck={false}/>}</form.Field>
    {error&&<p id="file-editor-error" role="alert" className="text-sm text-destructive">{error}</p>}
    <form.Subscribe selector={s=>s.isSubmitting}>{pending=><div className="flex justify-end gap-2"><Button type="button" variant="ghost" disabled={pending} onClick={onCancel}>Annuler</Button><Button type="submit" disabled={pending}>{pending?"Compilation et enregistrement…":"Enregistrer dans ce projet"}</Button></div>}</form.Subscribe>
  </form>
}
