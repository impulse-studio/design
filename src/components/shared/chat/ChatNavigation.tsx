import { RiSideBarLine, RiAddLine } from "@remixicon/react"
import { AISidebar } from "@/components/shared/ai-sidebar/AISidebar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

export function ChatNavigation({ onNewChat }: { onNewChat: () => void }) {
  const { open, setOpen, openMobile, setOpenMobile } = useSidebar()
  const content = (
    <>
      <SidebarHeader>
        <Button
          variant="ghost"
          className="justify-start"
          onClick={() => {
            onNewChat()
            setOpenMobile(false)
          }}
        >
          <RiAddLine />
          Nouvelle conversation
        </Button>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <AISidebar
          defaultItems={[
            {
              id: "project",
              kind: "project",
              label: "Mon espace",
              children: [{ id: "chat", kind: "file", label: "Conversation" }],
            },
          ]}
          defaultExpandedIds={["project"]}
          defaultActiveId="chat"
          onActiveChange={() => setOpenMobile(false)}
        />
      </SidebarContent>
    </>
  )
  return (
    <>
      {open && (
        <Sidebar
          collapsible="none"
          className="hidden shrink-0 border-r @min-[600px]:flex"
        >
          {content}
        </Sidebar>
      )}
      <Sheet open={openMobile} onOpenChange={setOpenMobile}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetHeader>
            <SheetTitle>Conversations</SheetTitle>
          </SheetHeader>
          {content}
        </SheetContent>
      </Sheet>
      <div
        className="absolute top-3 left-3 @min-[600px]:left-auto"
        style={
          open ? { left: "calc(var(--sidebar-width) + 0.75rem)" } : undefined
        }
      >
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden @min-[600px]:inline-flex"
          aria-label="Afficher ou masquer les conversations"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <RiSideBarLine />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-3 left-3 @min-[600px]:hidden"
        aria-label="Ouvrir les conversations"
        onClick={() => setOpenMobile(true)}
      >
        <RiSideBarLine />
      </Button>
    </>
  )
}
