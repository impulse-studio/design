import { readFile } from "node:fs/promises"
import { build } from "esbuild"
import { describe, expect, it } from "vitest"
import { JSDOM } from "jsdom"
import { createSiteDocument } from "./template"
import { applySiteProposal, elementsOf, applyTextEdit, applyVisualEdit } from "./source"
import { compileOptions } from "./compiler"
import { previewHtml, bridgeSource } from "./bridge"
import { scenarioDocument } from "./scenarios"
const runtime=JSON.parse(await readFile("public/site-runtime/modules.json","utf8"))
describe("Vue site runtime",()=>{
  it("compiles, renders and edits Vue sources with scoped styles and scenarios",async()=>{
    const doc=applySiteProposal(createSiteDocument("vue-vite"),{summary:"Vue",operations:[
      {type:"writeFile",path:"src/App.vue",content:`<script setup lang="ts">import Counter from './Counter.vue'; import scenarios from './scenarios.json'; const scenario=scenarios.scenarios.find(s=>s.id===scenarios.defaultId)!;</script><template><main><h1>Bonjour</h1><Counter :initial="scenario.data.count" /></main></template><style scoped>h1{color:red}</style>`},
      {type:"writeFile",path:"src/Counter.vue",content:`<script setup lang="ts">import {ref} from 'vue';const props=defineProps<{initial:number}>();const count=ref(props.initial)</script><template><button @click="count++">{{count}}</button></template>`},
      {type:"writeFile",path:"src/scenarios.json",content:JSON.stringify({defaultId:"a",scenarios:[{id:"a",name:"A",path:"/",data:{count:2}},{id:"b",name:"B",path:"/",data:{count:5}}]})},
    ]})
    const heading=elementsOf(doc).find(e=>e.tag==="h1")!
    let edited=applyTextEdit(doc,heading.id,"Bonjour <équipe>")
    edited=applyVisualEdit(edited,{id:heading.id,breakpoint:"base",styles:{fontSize:"2rem"}})
    edited=scenarioDocument(edited,"b")
    const result=await build(compileOptions(edited,runtime,{"studio-entry.ts":"import './studio-bridge';import './src/main';","studio-bridge.ts":bridgeSource("vue",1,"/",true,false,"vue-vite")}))
    const dom=new JSDOM(previewHtml(result.outputFiles![0].text),{runScripts:"dangerously",pretendToBeVisual:true})
    await new Promise(resolve=>setTimeout(resolve,50))
    expect(dom.window.document.querySelector("h1")?.textContent).toBe("Bonjour <équipe>")
    expect(dom.window.document.querySelector("button")?.textContent).toBe("5")
    expect(dom.window.document.head.textContent).toContain("data-v-")
    dom.window.close()
  })
  it("rejects malformed components before a save",async()=>{
    expect(()=>applySiteProposal(createSiteDocument("vue-vite"),{summary:"invalid",operations:[{type:"writeFile",path:"src/App.vue",content:"<template><p></template>"}]})).toThrow()
  })
})
