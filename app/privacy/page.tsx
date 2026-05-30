import type { Metadata } from "next"
import { LockKeyhole, ShieldCheck } from "lucide-react"
import { PageHeading } from "@/components/page-heading"

export const metadata: Metadata = {
  title: "Privacy"
}

const sections = [
  {
    body: "Long-term memory, workspace context, extension preferences, and account connection metadata should be stored locally first. Server sync, when introduced, must be explicit and reversible.",
    title: "Local-first product data"
  },
  {
    body: "Account credentials belong in secure storage. They should not be written to plain settings files, logs, telemetry, or extension-visible preference objects.",
    title: "Sensitive credentials"
  },
  {
    body: "Extensions only receive the capabilities and connection state needed for the command they are running. Jingle owns account connection, refresh, revocation, and provider responses.",
    title: "Extension boundaries"
  },
  {
    body: "Users should be able to inspect connected accounts, revoke access, delete local memories, and understand which data remains local versus synchronized.",
    title: "User control"
  }
]

export default function PrivacyPage() {
  return (
    <main>
      <PageHeading eyebrow="Privacy" title="Jingle is designed around local ownership and explicit connections.">
        Our privacy model starts with local control: users should know what is stored,
        what is connected, and what an agent or extension can access.
      </PageHeading>

      <section className="page-shell pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section, index) => (
            <article key={section.title} className="rounded-md border border-[color:var(--line)] bg-[var(--panel)] p-6">
              {index % 2 === 0 ? (
                <ShieldCheck className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
              ) : (
                <LockKeyhole className="h-5 w-5 text-[color:var(--blue)]" aria-hidden="true" />
              )}
              <h2 className="mt-5 text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{section.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
