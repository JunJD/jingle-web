import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { PageHeading } from "@/components/page-heading"
import { docs } from "@/lib/site"

export const metadata: Metadata = {
  title: "Docs"
}

export default function DocsPage() {
  return (
    <main>
      <PageHeading eyebrow="Docs" title="Build commands, extensions, connected accounts, and agent tools.">
        Technical guides for building on Jingle, from extension packages to account connections
        and agent tool boundaries.
      </PageHeading>

      <section className="page-shell pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          {docs.map((doc) => {
            const Icon = doc.icon
            return (
              <Link key={doc.href} href={doc.href} className="focus-ring group rounded-md border border-[color:var(--line)] bg-[var(--panel)] p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                  <ArrowRight className="h-4 w-4 text-[color:var(--muted)] group-hover:text-[#101312]" aria-hidden="true" />
                </div>
                <h2 className="mt-5 text-xl font-semibold">{doc.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{doc.description}</p>
              </Link>
            )
          })}
        </div>

        <div id="agents" className="mt-12 rounded-md border border-[color:var(--line)] bg-[#101312] p-6 text-[color:var(--panel)]">
          <h2 className="text-2xl font-semibold">Agent tool contract</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {["Tools are declared by extensions", "Host owns permission and approval", "Renderer receives typed presentation"].map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-white/10 bg-white/7 p-4">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-[var(--gold)]" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/72">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
