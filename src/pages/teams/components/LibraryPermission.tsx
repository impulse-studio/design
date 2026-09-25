import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "@tanstack/react-router"
import { Checkbox } from "@/components/ui/checkbox"
import { useOrpc } from "@/lib/use-orpc"
export function LibraryPermission({organizationId,memberId,name,enabled,disabled}:{organizationId:string;memberId:string;name:string;enabled:boolean;disabled:boolean}) {
  const orpc=useOrpc(),queryClient=useQueryClient(),router=useRouter(),mutation=useMutation(orpc.libraries.permission.mutationOptions())
  const [error,setError]=useState<string|null>(null)
  const update=async(value:boolean)=>{setError(null);try{await mutation.mutateAsync({organizationId,memberId,enabled:value});await queryClient.invalidateQueries({queryKey:orpc.teams.getOverview.queryKey()});await queryClient.invalidateQueries({queryKey:orpc.libraries.list.queryKey()});await router.invalidate()}catch(error){setError(error instanceof Error?error.message:"Modification impossible.")}}
  return <div className="flex flex-col gap-1"><Checkbox aria-label={`Autoriser ${name} à importer et synchroniser les bibliothèques`} checked={enabled} disabled={disabled||mutation.isPending} onCheckedChange={value=>void update(value===true)}/>{error&&<p role="alert" className="text-xs text-destructive">{error}</p>}</div>
}
