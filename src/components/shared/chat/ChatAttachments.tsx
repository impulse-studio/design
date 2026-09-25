import { RiCloseLine, RiFileTextLine, RiDownloadLine } from "@remixicon/react"
import type { ChatAttachment } from "@/features/chat/types"
import { attachmentIsImage, attachmentSize } from "@/features/chat/attachments"
import {
  Attachment,
  AttachmentMedia,
  AttachmentContent,
  AttachmentTitle,
  AttachmentDescription,
  AttachmentActions,
  AttachmentAction,
} from "@/components/ui/attachment"

export function ChatAttachments({
  items,
  onRemove,
}: {
  items: ChatAttachment[]
  onRemove?: (id: string) => void
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2" aria-label="Pièces jointes">
      {items.map((item) => (
        <Attachment
          key={item.id}
          size="sm"
          state={item.blobUrl ? "done" : "error"}
          className="w-full"
        >
          <AttachmentMedia
            variant={item.blobUrl && attachmentIsImage(item) ? "image" : "icon"}
          >
            {item.blobUrl && attachmentIsImage(item) ? (
              <img src={item.blobUrl} alt={item.name} />
            ) : (
              <RiFileTextLine />
            )}
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle title={item.name}>{item.name}</AttachmentTitle>
            <AttachmentDescription>
              {item.blobUrl
                ? `${attachmentSize(item.size)} · local`
                : "À joindre à nouveau"}
            </AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            {onRemove ? (
              <AttachmentAction
                aria-label={`Retirer ${item.name}`}
                onClick={() => onRemove(item.id)}
              >
                <RiCloseLine />
              </AttachmentAction>
            ) : item.blobUrl ? (
              <AttachmentAction
                aria-label={`Télécharger ${item.name}`}
                render={<a href={item.blobUrl} download={item.name} />}
              >
                <RiDownloadLine />
              </AttachmentAction>
            ) : null}
          </AttachmentActions>
        </Attachment>
      ))}
    </div>
  )
}
