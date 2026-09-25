import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join, relative } from "node:path"
import { execFile } from "node:child_process"
import { promisify } from "node:util"
import { build } from "esbuild"
import { z } from "zod"
import type { LibraryPayload } from "./schema"
import type { RuntimeModules } from "@/features/sites/compiler"

const exec = promisify(execFile)
const core = /^(react(?:-dom)?(?:\/.*)?|vue)$/
const packageOf = (specifier: string) => specifier.startsWith("@") ? specifier.split("/").slice(0,2).join("/") : specifier.split("/")[0]
const lockSchema = z.object({packages:z.record(z.string(), z.object({version:z.string().optional(),resolved:z.string().optional(),integrity:z.string().optional()}).passthrough())}).passthrough()
// Only npm metadata is installed; library source and lifecycle scripts are never executed.
export const prepareDependencies = async (payload: LibraryPayload): Promise<{payload:LibraryPayload;runtime:RuntimeModules}> => {
  const requests = new Set<string>()
  for(const code of Object.values(payload.files)) for(const match of code.matchAll(/(?:from\s*|import\s*\(?\s*|require\s*\(\s*)["']([^"']+)["']/g)) {
    const name=match[1]
    if(name.startsWith(".") || name.startsWith("@/")) continue
    if(/^(?:node:|https?:|file:|\/)/.test(name)) throw new Error(`Import interdit : ${name}`)
    if(!core.test(name)) {
      if(!Object.hasOwn(payload.dependencies,packageOf(name))) throw new Error(`Dépendance non déclarée : ${name}`)
      requests.add(name)
    }
  }
  if(!Object.keys(payload.dependencies).filter(n=>!core.test(n)).length) return {payload,runtime:{imports:{},modules:{}}}
  const dir=await mkdtemp(join(tmpdir(),"studio-library-"))
  const env={PATH:process.env.PATH, HOME:dir, npm_config_userconfig:join(dir,"npmrc"), npm_config_globalconfig:join(dir,"global-npmrc"), npm_config_cache:join(dir,"cache"), npm_config_registry:"https://registry.npmjs.org/", npm_config_ignore_scripts:"true", npm_config_audit:"false", npm_config_fund:"false"}
  try {
    await writeFile(join(dir,"npmrc"),"")
    await writeFile(join(dir,"global-npmrc"),"")
    await writeFile(join(dir,"package.json"),JSON.stringify({private:true,dependencies:payload.dependencies}))
    const run=async(args:string[]) => {
      try { await exec("npm",args,{cwd:dir,env,timeout:120000,maxBuffer:1_000_000}) }
      catch { throw new Error("Résolution npm impossible : paquet public absent, incompatible ou délai dépassé.") }
    }
    await run(["install","--package-lock-only","--ignore-scripts","--no-audit","--no-fund"])
    const lockText=await readFile(join(dir,"package-lock.json"),"utf8")
    const lock=lockSchema.parse(JSON.parse(lockText))
    if(Object.keys(lock.packages).length>500) throw new Error("Trop de dépendances (500 maximum).")
    for(const [path,item] of Object.entries(lock.packages)) if(path && (!item.resolved?.startsWith("https://registry.npmjs.org/") || !item.integrity)) throw new Error("Seuls les paquets du registre npm public avec intégrité sont acceptés.")
    await run(["ci","--ignore-scripts","--no-audit","--no-fund"])
    const dependencies={...payload.dependencies}
    for(const name of Object.keys(dependencies)) {
      const version=lock.packages[`node_modules/${name}`]?.version
      if(!version) throw new Error(`Version non résolue : ${name}`)
      dependencies[name]=version
    }
    const entryPoints:Record<string,string>={}
    for(const [i,name] of [...requests].entries()) {
      const path=join(dir,`entry-${i}.js`)
      await writeFile(path,`import * as value from ${JSON.stringify(name)}; export * from ${JSON.stringify(name)}; export default value.default;`)
      entryPoints[`dep-${i}`]=path
    }
    const result=requests.size ? await build({entryPoints,bundle:true,splitting:true,write:false,format:"esm",platform:"browser",target:"es2022",outdir:join(dir,"out"),minify:true,external:["react","react/*","react-dom","react-dom/*","vue"],loader:{".woff2":"dataurl",".png":"dataurl",".jpg":"dataurl",".svg":"dataurl"},define:{"process.env.NODE_ENV":'"production"'},logLevel:"silent"}) : null
    const modules=Object.fromEntries((result?.outputFiles ?? []).map(f=>[relative(join(dir,"out"),f.path),f.text]))
    // esbuild extracts dependency styles; attach them to every entry (once per page).
    const css=Object.entries(modules).filter(([p])=>p.endsWith(".css")).map(([,s])=>s).join("\n")
    if(css) for(const key of Object.keys(entryPoints)) modules[`${key}.js`]=`{const s=document.createElement('style');s.textContent=${JSON.stringify(css)};document.head.appendChild(s);}\n`+modules[`${key}.js`]
    if(JSON.stringify(modules).length>5_000_000) throw new Error("Dépendances compilées trop volumineuses (5 Mo maximum).")
    return {payload:{...payload,dependencies,files:{...payload.files,"studio.dependencies.lock.json":lockText}},runtime:{imports:Object.fromEntries([...requests].map((name,i)=>[name,`dep-${i}.js`])),modules}}
  } finally { await rm(dir,{recursive:true,force:true}) }
}
