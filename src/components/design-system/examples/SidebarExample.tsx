import source from "./SidebarExample.tsx?raw"
import { createExampleCode } from "@/features/design-system/example-code"

// @example:start
import { useState } from "react"
import { RiFolderLine } from "@remixicon/react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

export function SidebarExample() {
  const [selected, setSelected] = useState("Récents")
  return (
    <SidebarProvider className="min-h-0 w-full max-w-md overflow-hidden rounded-lg border">
      <Sidebar collapsible="none" className="w-44">
        <SidebarHeader>
          <p className="section-title [font-family:var(--font-heading)] [font-variation-settings:'opsz'_32] text-[16px] leading-[24px] font-semibold tracking-[-0.012em] p-2">Espace de travail</p>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Projets</SidebarGroupLabel>
            <SidebarMenu>
              {["Récents", "Favoris", "Archives"].map((name) => (
                <SidebarMenuItem key={name}>
                  <SidebarMenuButton
                    isActive={selected === name}
                    onClick={() => setSelected(name)}
                  >
                    <RiFolderLine />
                    <span>{name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <div className="flex min-h-52 flex-1 items-center justify-center p-4">
        <p className="body-copy text-[13px] leading-[1.55]">{selected}</p>
      </div>
    </SidebarProvider>
  )
}
// @example:end

export const getCode = createExampleCode(source)
