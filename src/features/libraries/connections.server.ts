import { randomBytes, randomUUID, createHash } from "node:crypto"
import { and, eq, isNull } from "drizzle-orm"
import { getDatabase } from "@/db/client.server"
import { libraryConnections, teamLibraries } from "@/db/schema"
import { requireLibraryAccess, publishLibrary } from "./repository.server"
import { libraryPayloadSchema } from "./schema"
const hash=(value:string)=>createHash("sha256").update(value).digest("hex")
export const createLibraryConnection = async (libraryId:string,organizationId:string,userId:string) => {
  await requireLibraryAccess(organizationId,userId,true)
  const library=await getDatabase().select().from(teamLibraries).where(and(eq(teamLibraries.id,libraryId),eq(teamLibraries.organizationId,organizationId))).then(r=>r.at(0))
  if(!library) throw new Error("Bibliothèque introuvable.")
  const code=randomBytes(24).toString("base64url")
  const expiresAt=new Date(Date.now()+10*60_000)
  const id=randomUUID()
  await getDatabase().insert(libraryConnections).values({id,libraryId,userId,tokenHash:hash(code),expiresAt})
  return {id,code,expiresAt}
}
export const revokeLibraryConnection = async (id:string,organizationId:string,userId:string) => {
  await requireLibraryAccess(organizationId,userId,true)
  const row=await getDatabase().select({connection:libraryConnections}).from(libraryConnections).innerJoin(teamLibraries,eq(teamLibraries.id,libraryConnections.libraryId)).where(and(eq(libraryConnections.id,id),eq(teamLibraries.organizationId,organizationId))).then(r=>r.at(0))
  if(!row) throw new Error("Connexion introuvable.")
  await getDatabase().update(libraryConnections).set({revokedAt:new Date()}).where(eq(libraryConnections.id,id))
}
export const handleLibrarySync = async (request:Request) => {
  const token=request.headers.get("authorization")?.replace(/^Bearer /,"") ?? ""
  if(!token || token.length>200) return Response.json({error:"Connexion requise."},{status:401})
  const row=await getDatabase().select({connection:libraryConnections,library:teamLibraries}).from(libraryConnections).innerJoin(teamLibraries,eq(teamLibraries.id,libraryConnections.libraryId)).where(and(eq(libraryConnections.tokenHash,hash(token)),isNull(libraryConnections.revokedAt))).then(r=>r.at(0))
  if(!row || row.connection.expiresAt.getTime()<Date.now()) return Response.json({error:"Connexion expirée ou révoquée."},{status:401})
  const {connection,library}=row
  try {
    await requireLibraryAccess(library.organizationId,connection.userId,true)
    if(!connection.claimed) {
      const nextToken=randomBytes(32).toString("base64url")
      const claimed=await getDatabase().update(libraryConnections).set({claimed:true,tokenHash:hash(nextToken),expiresAt:new Date(Date.now()+30*86400_000),lastSeenAt:new Date()}).where(and(eq(libraryConnections.id,connection.id),eq(libraryConnections.claimed,false))).returning({id:libraryConnections.id})
      if(!claimed.length) return Response.json({error:"Code déjà utilisé."},{status:409})
      return Response.json({token:nextToken,framework:library.framework,version:library.version})
    }
    await getDatabase().update(libraryConnections).set({lastSeenAt:new Date()}).where(eq(libraryConnections.id,connection.id))
    if(request.method==="GET") return Response.json({framework:library.framework,version:library.version})
    if(Number(request.headers.get("content-length"))>12_000_000) return Response.json({error:"Import trop volumineux."},{status:413})
    const reader=request.body?.getReader()
    if(!reader) throw new Error("Contenu absent.")
    const chunks:Uint8Array[]=[]; let size=0
    for(;;) { const {done,value}=await reader.read(); if(done) break; size+=value.byteLength; if(size>12_000_000) {await reader.cancel(); return Response.json({error:"Import trop volumineux."},{status:413})} chunks.push(value) }
    const body=Buffer.concat(chunks).toString("utf8")
    const payload=libraryPayloadSchema.parse(JSON.parse(body))
    const digest=hash(JSON.stringify(payload))
    if(connection.digest===digest) return Response.json({version:library.version,unchanged:true})
    const snapshot=await publishLibrary(library.organizationId,connection.userId,{name:library.name,libraryId:library.id,expectedVersion:library.version,payload})
    await getDatabase().update(libraryConnections).set({digest,error:null,lastSuccessAt:new Date()}).where(eq(libraryConnections.id,connection.id))
    return Response.json({version:snapshot.version})
  } catch(error) {
    const message=error instanceof Error ? error.message.slice(0,2000) : "Synchronisation impossible."
    await getDatabase().update(libraryConnections).set({error:message}).where(eq(libraryConnections.id,connection.id))
    return Response.json({error:message},{status:/non autorisé/.test(message)?403:409})
  }
}
