import { z } from "zod"
import { collectRenderedElements } from "./rendered-elements"

export const previewRectSchema = z
  .object({
    x: z.number().finite(),
    y: z.number().finite(),
    width: z.number().nonnegative(),
    height: z.number().nonnegative(),
    viewportWidth: z.number().positive(),
    viewportHeight: z.number().positive(),
  })
  .strict()
export type PreviewRect = z.infer<typeof previewRectSchema>
const previewInventoryEntrySchema = z
  .object({
    id: z.string().max(100),
    count: z.number().int().positive(),
  })
  .strict()
export type PreviewInventoryEntry = z.infer<typeof previewInventoryEntrySchema>
export const previewMessageSchema = z.object({
  source: z.literal("digit-site"),
  token: z.string(),
  revision: z.number().int(),
  type: z.enum(["ready", "selection", "hover", "inventory", "route", "error"]),
  id: z.string().max(100).optional(),
  count: z.number().int().optional(),
  tag: z.string().max(100).optional(),
  rect: previewRectSchema.optional(),
  elements: z.array(previewInventoryEntrySchema).max(10000).optional(),
  path: z.string().max(500).optional(),
  message: z.string().max(2000).optional(),
})
export const bridgeSource = (
  token: string,
  revision: number,
  initialPath: string,
  editing: boolean,
  hasRouter = true,
  framework: "react-vite" | "vue-vite" = "react-vite"
) => `
${hasRouter ? (framework === "vue-vite" ? "import {router as vueRouter} from './src/routes/router';const router={navigate:({to})=>vueRouter.push(to),history:{back:()=>vueRouter.back(),forward:()=>vueRouter.forward()},subscribe:(_,cb)=>vueRouter.afterEach(cb),get state(){return {location:{pathname:vueRouter.currentRoute.value.path}}}};" : "import {router} from './src/routes/router';") : "const router = { navigate: async () => {}, history: { back: () => {}, forward: () => {} }, subscribe: () => {}, state: { location: { pathname: '/' } } };"}
const token=${JSON.stringify(token)}, revision=${revision};
const send=(type,payload={})=>parent.postMessage({source:'digit-site',token,revision,type,...payload},'*');
let editing=${editing}, selected=null, selectedNode=null, hovered=null;
const rectOf=(element)=>{const rect=element.getBoundingClientRect();return {x:rect.left,y:rect.top,width:rect.width,height:rect.height,viewportWidth:window.innerWidth,viewportHeight:window.innerHeight};};
const isVisible=(element)=>{const rect=element.getBoundingClientRect();return rect.width>0||rect.height>0;};
const collectRenderedElements=${collectRenderedElements.toString()};
let renderedSnapshot=null;
const snapshot=()=>renderedSnapshot??(renderedSnapshot=collectRenderedElements(document.getElementById('root')));
const elementsWithId=(id)=>Array.from(snapshot().entries.get(id)?.elements??[]);
const targetOf=(target)=>{if(!(target instanceof Element))return null;const {componentIds}=snapshot();for(let element=target;element;element=element.parentElement){const domId=element.getAttribute('data-digi-id');if(domId)return {element,id:domId};const id=componentIds.get(element);if(id)return {element,id};}return null;};
const visibleElement=(id)=>elementsWithId(id).find(isVisible)??null;
const reportInventory=()=>{renderedSnapshot=null;send('inventory',{elements:Array.from(snapshot().entries,([id,entry])=>({id,count:entry.instances.size}))});};
let inventoryScheduled=false;
const scheduleInventory=()=>{renderedSnapshot=null;if(inventoryScheduled)return;inventoryScheduled=true;requestAnimationFrame(()=>{inventoryScheduled=false;reportInventory();});};
const reportHover=()=>{if(!editing||!hovered){send('hover',{id:''});return;}send('hover',{id:hovered.id,tag:hovered.element.localName,rect:rectOf(hovered.element)});};
const reportSelection=()=>{const element=selectedNode?.isConnected&&isVisible(selectedNode)?selectedNode:visibleElement(selected);send('selection',{id:selected??'',count:selected?(snapshot().entries.get(selected)?.instances.size??0):0,tag:element?.localName,rect:element?rectOf(element):undefined});};
const root=document.getElementById('root');
if(root)new MutationObserver(scheduleInventory).observe(root,{attributes:true,attributeFilter:['class','style','data-digi-id','data-state','hidden','open','aria-hidden','inert'],childList:true,characterData:true,subtree:true});
window.addEventListener('error',event=>send('error',{message:String(event.message).slice(0,2000)}));
window.addEventListener('unhandledrejection',event=>send('error',{message:String(event.reason).slice(0,2000)}));
window.addEventListener('message',event=>{const m=event.data;if(event.source!==parent||!m||m.token!==token||m.revision!==revision||m.source!=='digit-host')return;if(m.type==='mode'){editing=!!m.editing;if(!editing){hovered=null;reportHover();}}if(m.type==='navigate'&&typeof m.path==='string')void router.navigate({to:m.path});if(m.type==='back')router.history.back();if(m.type==='forward')router.history.forward();if(m.type==='select'){selected=typeof m.id==='string'?m.id:null;selectedNode=visibleElement(selected);reportSelection();}});
document.addEventListener('pointermove',event=>{if(!editing)return;const target=targetOf(event.target);if(target?.element!==hovered?.element||target?.id!==hovered?.id){hovered=target;reportHover();}},true);
document.addEventListener('pointerout',event=>{if(editing&&event.relatedTarget==null){hovered=null;reportHover();}},true);
document.addEventListener('scroll',()=>{reportHover();reportSelection();},true);window.addEventListener('resize',()=>{reportHover();reportSelection();scheduleInventory();});window.addEventListener('blur',()=>{hovered=null;reportHover();});
document.addEventListener('click',event=>{if(!editing)return;event.preventDefault();event.stopImmediatePropagation();const target=targetOf(event.target);selected=target?.id??null;selectedNode=target?.element??null;reportSelection();},true);
document.addEventListener('submit',event=>{if(editing){event.preventDefault();event.stopImmediatePropagation()}},true);
document.addEventListener('keydown',event=>{if(editing&&event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();selected=null;selectedNode=null;hovered=null;reportHover();reportSelection();}},true);
router.subscribe('onResolved',()=>{send('route',{path:router.state.location.pathname});scheduleInventory();});
void router.navigate({to:${JSON.stringify(initialPath)}}).then(()=>{reportInventory();send('ready');});
`
export const previewHtml = (code: string) =>
  `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'"></head><body><div id="root"></div><script>${code.replace(/<\/script/gi, "<\\/script")}</script></body></html>`
