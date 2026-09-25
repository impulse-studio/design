import { beforeEach, describe, expect, it, vi } from "vitest"
import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { CreateTeamForm } from "./CreateTeamForm"
import { InviteMemberForm } from "./InviteMemberForm"
import { TeamSettings } from "./TeamSettings"

const actions = vi.hoisted(() => ({
  create: vi.fn(),
  inviteMember: vi.fn(),
  update: vi.fn(),
  invalidate: vi.fn(),
  invalidateQueries: vi.fn(),
}))
vi.mock("@/features/auth/client", () => ({
  authClient: { organization: actions },
}))
vi.mock("@tanstack/react-router", () => ({
  useRouter: () => ({ invalidate: actions.invalidate }),
}))
vi.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ invalidateQueries: actions.invalidateQueries }),
}))
vi.mock("@/lib/use-orpc", () => ({
  useOrpc: () => ({
    auth: { getCurrentUser: { queryKey: () => ["auth", "getCurrentUser"] } },
    teams: { getOverview: { queryKey: () => ["teams", "getOverview"] } },
    mockups: { list: { queryKey: () => ["mockups", "list"] } },
  }),
}))

beforeEach(() => {
  vi.clearAllMocks()
  actions.create.mockResolvedValue({ error: null })
  actions.inviteMember.mockResolvedValue({ error: null })
  actions.update.mockResolvedValue({ error: null })
  actions.invalidate.mockResolvedValue(undefined)
  actions.invalidateQueries.mockResolvedValue(undefined)
})

describe("formulaires d’équipe", () => {
  it("refuse un nom vide, corrige l’erreur et envoie le nom normalisé", async () => {
    render(<CreateTeamForm />)
    const input = screen.getByRole("textbox", { name: "Nom de l’équipe" })
    fireEvent.change(input, { target: { value: "   " } })
    fireEvent.click(screen.getByRole("button", { name: "Créer l’équipe" }))
    expect(await screen.findByRole("alert")).toHaveProperty(
      "textContent",
      "Saisissez le nom de l’équipe."
    )
    expect(input.getAttribute("aria-invalid")).toBe("true")
    expect(actions.create).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: "  Équipe produit  " } })
    fireEvent.click(screen.getByRole("button", { name: "Créer l’équipe" }))
    await waitFor(() =>
      expect(actions.create).toHaveBeenCalledWith({
        name: "Équipe produit",
        slug: expect.stringMatching(/^equipe-produit-/),
      })
    )
    await waitFor(() => expect(input).toHaveProperty("value", ""))
    expect(actions.invalidate).toHaveBeenCalledOnce()
  })

  it("garde la saisie après un échec et permet de réessayer", async () => {
    actions.create.mockRejectedValueOnce(new Error("Offline"))
    render(<CreateTeamForm />)
    const input = screen.getByRole("textbox", { name: "Nom de l’équipe" })
    fireEvent.change(input, { target: { value: "Design" } })
    fireEvent.click(screen.getByRole("button", { name: "Créer l’équipe" }))
    await screen.findByText("L’équipe n’a pas pu être créée.")
    expect(input).toHaveProperty("value", "Design")
    fireEvent.click(screen.getByRole("button", { name: "Créer l’équipe" }))
    await waitFor(() => expect(actions.create).toHaveBeenCalledTimes(2))
    await waitFor(() => expect(input).toHaveProperty("value", ""))
  })

  it("refuse les adresses externes et normalise une invitation valide", async () => {
    render(<InviteMemberForm organizationId="team-1" isOwner />)
    const input = screen.getByRole("textbox", { name: "Adresse Digitevent" })
    fireEvent.change(input, { target: { value: "alice@example.com" } })
    fireEvent.click(screen.getByRole("button", { name: "Inviter" }))
    await screen.findByText("Utilisez une adresse @digitevent.com.")
    expect(actions.inviteMember).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: " Alice@Digitevent.com " } })
    fireEvent.click(screen.getByRole("button", { name: "Inviter" }))
    await waitFor(() =>
      expect(actions.inviteMember).toHaveBeenCalledWith({
        organizationId: "team-1",
        email: "alice@digitevent.com",
        role: "member",
      })
    )
    await screen.findByText("Invitation créée.")
    expect(input).toHaveProperty("value", "")
  })

  it("refuse un renommage vide et envoie le nom normalisé", async () => {
    const team = { id: "team-1", name: "Design", slug: "design", role: "owner" }
    render(<TeamSettings team={team} canManage />)
    const input = screen.getByRole("textbox", { name: "Nom de l’équipe" })
    fireEvent.change(input, { target: { value: " " } })
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    await screen.findByText("Saisissez le nom de l’équipe.")
    expect(actions.update).not.toHaveBeenCalled()
    fireEvent.change(input, { target: { value: "  Produit  " } })
    fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }))
    await waitFor(() =>
      expect(actions.update).toHaveBeenCalledWith({
        organizationId: "team-1",
        data: { name: "Produit" },
      })
    )
    await waitFor(() => expect(input).toHaveProperty("value", "Produit"))
  })
})
