import { useState } from "react"
import { useForm, revalidateLogic } from "@tanstack/react-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FormTextField } from "@/components/shared/FormTextField"
import { OptionSelect } from "@/components/shared/OptionSelect"
import { createSiteFormSchema, frameworkOptions } from "@/features/libraries/forms"
import type { SiteKind } from "@/features/sites/schema"
export function CreateSiteDialog({disabled,onCreate}:{disabled:boolean;onCreate:(input:{name:string;kind:SiteKind})=>Promise<void>}) {
  const [open,setOpen]=useState(false)
  const [error,setError]=useState<string|null>(null)
  const form=useForm({defaultValues:{name:"Nouveau site",kind:"react-vite" as SiteKind},validationLogic:revalidateLogic({mode:"blur"}),validators:{onDynamic:createSiteFormSchema},onSubmit:async({value})=>{
    setError(null)
    try {await onCreate(createSiteFormSchema.parse(value));setOpen(false)} catch(error) {setError(error instanceof Error?error.message:"Création impossible.")}
  }})
  return <Dialog open={open} onOpenChange={setOpen}><DialogTrigger render={<Button size="sm" disabled={disabled}/>}>Nouveau site</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Créer un site</DialogTitle><DialogDescription>Un projet indépendant, avec les bibliothèques de votre choix.</DialogDescription></DialogHeader><form className="flex flex-col gap-4" onSubmit={e=>{e.preventDefault();if(!form.state.isSubmitting) void form.handleSubmit()}}>
    <form.Field name="name">{field=><FormTextField field={field} label="Nom du site" required maxLength={200}/>}</form.Field>
    <form.Field name="kind">{field=><OptionSelect label="Framework" value={field.state.value} onValueChange={v=>field.handleChange(v as SiteKind)} options={frameworkOptions}/>}</form.Field>
    {error&&<p role="alert" className="text-sm text-destructive">{error}</p>}
    <form.Subscribe selector={s=>s.isSubmitting}>{pending=><Button type="submit" disabled={pending}>{pending?"Création…":"Créer le site"}</Button>}</form.Subscribe>
  </form></DialogContent></Dialog>
}
