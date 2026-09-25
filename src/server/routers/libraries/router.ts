import { z } from "zod"
import { and, eq } from "drizzle-orm"
import { protectedProcedure } from "@/server/procedure/protected.procedure"
import { base } from "@/server/context"
import { findActiveTeam } from "@/features/teams/repository.server"
import { listLibraries, publishLibrary, installLibrary, previewLibraryUpdate, projectOrganization, requireLibraryAccess } from "@/features/libraries/repository.server"
import { createLibraryConnection, revokeLibraryConnection } from "@/features/libraries/connections.server"
import { importLibrarySchema, libraryUpdateSchema } from "@/features/libraries/schema"
import { member } from "@/db/schema"
import { getDatabase } from "@/db/client.server"
import type { CurrentUser } from "@/features/auth/session.server"
const teamId=async(user:CurrentUser)=>{
  const team=await findActiveTeam(user.id,user.activeOrganizationId)
  if(!team) throw new Error("Sélectionnez une équipe.")
  return team.id
}
export const librariesRouter=base.router({
  list:protectedProcedure.input(z.object({projectId:z.string().max(100).optional()}).default({})).handler(async({context,input})=>listLibraries(input.projectId ? await projectOrganization(input.projectId,context.user.id) : await teamId(context.user),context.user.id)).route({method:"GET"}),
  publish:protectedProcedure.input(importLibrarySchema).handler(async({context,input})=>publishLibrary(await teamId(context.user),context.user.id,input)).route({method:"POST"}),
  compare:protectedProcedure.input(libraryUpdateSchema).handler(async({context,input})=>previewLibraryUpdate(context.user.id,input)).route({method:"GET"}),
  install:protectedProcedure.input(libraryUpdateSchema).handler(async({context,input})=>installLibrary(context.user.id,input)).route({method:"POST"}),
  connect:protectedProcedure.input(z.object({libraryId:z.string().uuid()})).handler(async({context,input})=>createLibraryConnection(input.libraryId,await teamId(context.user),context.user.id)).route({method:"POST"}),
  disconnect:protectedProcedure.input(z.object({id:z.string().uuid()})).handler(async({context,input})=>revokeLibraryConnection(input.id,await teamId(context.user),context.user.id)).route({method:"POST"}),
  permission:protectedProcedure.input(z.object({organizationId:z.string(),memberId:z.string(),enabled:z.boolean()})).handler(async({context,input,errors})=>{
    await getDatabase().transaction(async tx=>{
      const access=await requireLibraryAccess(input.organizationId,context.user.id,false,tx)
      if(access.role!=="owner") throw errors.FORBIDDEN({message:"Seul un propriétaire peut attribuer cette permission."})
      const rows=await tx.update(member).set({canManageLibraries:input.enabled}).where(and(eq(member.id,input.memberId),eq(member.organizationId,input.organizationId))).returning({id:member.id})
      if(!rows.length) throw errors.NOT_FOUND()
    })
    return {ok:true}
  }).route({method:"POST"}),
})
