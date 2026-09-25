import { randomUUID } from "node:crypto"
import { and, desc, eq, isNull, sql } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { member, mockups, teamLibraries, libraryVersions, libraryConnections, siteProjects, siteVersions } from "@/db/schema"
import { loadRecord } from "@/features/mockups/repository.server"
import { validateSiteBuild } from "@/features/sites/compile.server"
import { createSiteDocument } from "@/features/sites/template"
import { normalizeSources } from "@/features/sites/source"
import { applyLibrary, compareLibrary, libraryPrefix } from "./merge"
import { prepareDependencies } from "./dependencies.server"
import { discoverComponents } from "./import"
import { importLibrarySchema, librarySnapshotSchema, libraryUpdateSchema } from "./schema"
import type { LibrarySnapshot } from "./schema"

type Database = ReturnType<typeof getDatabase>
type Transaction = Parameters<Parameters<Database["transaction"]>[0]>[0]
export const requireLibraryAccess = async (organizationId:string,userId:string,write=false,db:Database|Transaction=getDatabase()) => {
  const query=db.select().from(member).where(and(eq(member.organizationId,organizationId),eq(member.userId,userId)))
  const row=await ("rollback" in db ? query.for("share") : query).then(rows=>rows.at(0))
  if(!row || (write && row.role!=="owner" && !row.canManageLibraries)) throw new Error("Accès aux bibliothèques non autorisé.")
  return row
}
export const listLibraries = async (organizationId:string,userId:string) => {
  const access=await requireLibraryAccess(organizationId,userId)
  const libraries=await getDatabase().select().from(teamLibraries).where(eq(teamLibraries.organizationId,organizationId)).orderBy(desc(teamLibraries.updatedAt))
  const items=await Promise.all(libraries.map(async library=>{
    const latest=await getDatabase().select({snapshot:libraryVersions.snapshot}).from(libraryVersions).where(and(eq(libraryVersions.libraryId,library.id),eq(libraryVersions.version,library.version))).then(rows=>rows.at(0)?.snapshot ?? null)
    const connections=await getDatabase().select({id:libraryConnections.id,userId:libraryConnections.userId,claimed:libraryConnections.claimed,lastSeenAt:libraryConnections.lastSeenAt,lastSuccessAt:libraryConnections.lastSuccessAt,error:libraryConnections.error,expiresAt:libraryConnections.expiresAt}).from(libraryConnections).where(and(eq(libraryConnections.libraryId,library.id),isNull(libraryConnections.revokedAt)))
    return {...library,latest,connections}
  }))
  return {organizationId,canManage:access.role==="owner" || access.canManageLibraries,items}
}
export const publishLibrary = async (organizationId:string,userId:string,raw:unknown) => {
  await requireLibraryAccess(organizationId,userId,true)
  const input=importLibrarySchema.parse(raw)
  const payload={...input.payload,components:input.payload.components.length ? input.payload.components : discoverComponents(input.payload.files,input.payload.framework)}
  const prepared=await prepareDependencies(payload)
  const libraryId=input.libraryId ?? randomUUID()
  const snapshot=librarySnapshotSchema.parse({id:randomUUID(),libraryId,name:input.name,version:input.expectedVersion+1,...prepared})
  const candidate=applyLibrary(createSiteDocument(payload.framework),snapshot)
  // Import every source module so unused components cannot publish broken imports.
  candidate.files[payload.framework==="vue-vite" ? "src/main.ts" : "src/main.tsx"] += "\n" + Object.keys(payload.files).filter(p=>/\.(vue|[jt]sx?)$/.test(p) && !p.endsWith(".d.ts")).map(p=>`import ${JSON.stringify("./libraries/"+libraryId+"/"+p)};`).join("\n")
  await validateSiteBuild(candidate)
  return getDatabase().transaction(async tx=>{
    await requireLibraryAccess(organizationId,userId,true,tx)
    if(input.libraryId) {
      const library=await tx.select().from(teamLibraries).where(and(eq(teamLibraries.id,libraryId),eq(teamLibraries.organizationId,organizationId))).for("update").then(rows=>rows.at(0))
      if(!library) throw new Error("Bibliothèque introuvable.")
      if(library.version!==input.expectedVersion) throw new Error("La bibliothèque a changé. Rechargez avant de publier.")
      if(library.framework!==payload.framework) throw new Error("Le framework d’une bibliothèque ne peut pas changer.")
      await tx.update(teamLibraries).set({name:input.name,version:snapshot.version,updatedAt:new Date()}).where(eq(teamLibraries.id,libraryId))
    } else {
      if(input.expectedVersion!==0) throw new Error("Version initiale invalide.")
      await tx.insert(teamLibraries).values({id:libraryId,organizationId,name:input.name,framework:payload.framework,version:1})
    }
    await tx.insert(libraryVersions).values({id:snapshot.id,libraryId,version:snapshot.version,snapshot,createdBy:userId})
    return snapshot
  })
}
export const readLibraryVersion = async (versionId:string,organizationId:string,userId:string) => {
  await requireLibraryAccess(organizationId,userId)
  const row=await getDatabase().select({snapshot:libraryVersions.snapshot}).from(libraryVersions).innerJoin(teamLibraries,eq(teamLibraries.id,libraryVersions.libraryId)).where(and(eq(libraryVersions.id,versionId),eq(teamLibraries.organizationId,organizationId))).then(rows=>rows.at(0))
  if(!row) throw new Error("Version de bibliothèque introuvable.")
  return librarySnapshotSchema.parse(row.snapshot)
}
export const projectOrganization = async (id:string,userId:string) => {
  await loadRecord(id,userId)
  const row=await getDatabase().select({organizationId:mockups.organizationId}).from(mockups).where(eq(mockups.id,id)).then(rows=>rows.at(0))
  if(!row?.organizationId) throw new Error("Équipe du projet introuvable.")
  return row.organizationId
}
export const previewLibraryUpdate = async (userId:string,raw:unknown) => {
  const input=libraryUpdateSchema.parse(raw)
  const organizationId=await projectOrganization(input.projectId,userId)
  const snapshot=await readLibraryVersion(input.versionId,organizationId,userId)
  const project=await getDatabase().select().from(siteProjects).where(eq(siteProjects.id,input.projectId)).then(rows=>rows.at(0))
  if(!project || project.revision!==input.expectedRevision) throw new Error("Le projet a changé. Rechargez la comparaison.")
  return {snapshot,differences:compareLibrary(normalizeSources(project.doc),snapshot)}
}
export const installLibrary = async (userId:string,raw:unknown) => {
  const input=libraryUpdateSchema.parse(raw)
  const record=await loadRecord(input.projectId,userId)
  if(!record.canEdit) throw new Error("Projet en lecture seule.")
  const {snapshot}=await previewLibraryUpdate(userId,input)
  return getDatabase().transaction(async tx=>{
    const project=await tx.select().from(siteProjects).where(eq(siteProjects.id,input.projectId)).for("update").then(rows=>rows.at(0))
    if(!project || project.revision!==input.expectedRevision) throw new Error("Le projet a changé. Rechargez la comparaison.")
    const organizationId=await projectOrganization(input.projectId,userId)
    const access=await requireLibraryAccess(organizationId,userId,false,tx)
    if(!["owner","admin","member"].includes(access.role)) throw new Error("Projet en lecture seule.")
    const doc=applyLibrary(normalizeSources(project.doc),snapshot,input.resolutions)
    await validateSiteBuild(doc)
    const revision=project.revision+1
    await tx.update(siteProjects).set({doc,revision}).where(eq(siteProjects.id,project.id))
    await tx.insert(siteVersions).values({id:randomUUID(),projectId:project.id,revision,doc,summary:`${snapshot.name} · version ${snapshot.version}`})
    await tx.update(mockups).set({updatedAt:new Date(),revision:sql`${mockups.revision}+1`}).where(eq(mockups.id,project.id))
    return {id:project.id,doc,revision}
  })
}
export const libraryExampleDocument = (snapshot:LibrarySnapshot,index:number) => {
  const component=snapshot.payload.components[index]
  if(!component?.example) throw new Error("Ce composant ne fournit pas encore d’exemple.")
  const doc=applyLibrary(createSiteDocument(snapshot.payload.framework),snapshot)
  const path=libraryPrefix(snapshot.libraryId)+component.example
  if(doc.kind==="vue-vite") doc.files["src/App.vue"]=`<script setup lang="ts">import Example from ${JSON.stringify("../"+path)};</script><template><Example /></template>`
  else doc.files["src/App.tsx"]=`import Example from ${JSON.stringify("../"+path)}; export function App(){return <Example />}`
  return doc
}
