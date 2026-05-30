import type { Metadata } from "next"
import { Blocks, CheckCircle2, KeyRound, LockKeyhole } from "lucide-react"
import { AuthDiagram } from "@/components/auth-diagram"
import { PageHeading } from "@/components/page-heading"

export const metadata: Metadata = {
  title: "Connections"
}

const requirements = [
  "Provider registry for GitHub, Notion, and future integrations.",
  "Authorization code flow with state validation and PKCE where supported.",
  "Desktop return route through custom URL scheme or loopback redirect.",
  "Secure credential storage separate from plain extension preferences.",
  "Connection states: connected, missing, expired, revoked, scope-missing.",
  "Standard Connect UI for commands that require account access."
]

const connectionSteps = [
  {
    description: "Extensions declare provider, scopes, return target, and credential requirements.",
    icon: Blocks,
    title: "Declare"
  },
  {
    description: "Jingle opens the provider page with state and PKCE where the provider supports it.",
    icon: KeyRound,
    title: "Authorize"
  },
  {
    description: "The desktop app finishes the exchange and stores credentials outside plain preferences.",
    icon: LockKeyhole,
    title: "Store"
  },
  {
    description: "Commands receive connected, missing, expired, or scope-missing state.",
    icon: CheckCircle2,
    title: "Resolve"
  }
]

export default function ConnectionsDocsPage() {
  return (
    <main>
      <PageHeading eyebrow="Connections" title="Connected accounts are part of the platform contract.">
        Extensions declare the accounts and scopes they need. Jingle owns the browser handoff,
        validation, secure storage, refresh, revoke, and connection state.
      </PageHeading>

      <section className="page-shell pb-20">
        <AuthDiagram steps={connectionSteps} />
        <div className="mt-12 grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
          <article className="rounded-md border border-[color:var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-2xl font-semibold">Provider examples</h2>
            <div className="mt-6 space-y-5">
              <div>
                <h3 className="font-semibold">GitHub</h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  Use OAuth App or GitHub App depending on permission shape. GitHub App gives
                  finer permissions and short-lived installation or user credentials.
                </p>
              </div>
              <div>
                <h3 className="font-semibold">Notion</h3>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  Public connections use OAuth. Users approve workspace and page access, then
                  Jingle stores the approved account connection for extension commands.
                </p>
              </div>
            </div>
          </article>
          <article className="rounded-md border border-[color:var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-2xl font-semibold">Implementation checklist</h2>
            <ul className="mt-6 space-y-3">
              {requirements.map((item) => (
                <li key={item} className="rounded-md bg-[var(--soft)] px-4 py-3 text-sm leading-6 text-[color:var(--muted)]">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </main>
  )
}
