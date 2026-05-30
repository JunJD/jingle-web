import type { Metadata } from "next"
import { PageHeading } from "@/components/page-heading"

export const metadata: Metadata = {
  title: "Extensions"
}

const layers = [
  {
    body: "Manifest owns title, icon, commands, runtime modes, preferences, and platform support.",
    title: "Manifest"
  },
  {
    body: "Runtime package owns React command views, no-view commands, menu bar surfaces, and SDK calls.",
    title: "Runtime"
  },
  {
    body: "Main package owns privileged host calls, local APIs, filesystem bridges, and native integrations.",
    title: "Main"
  },
  {
    body: "AI package exposes typed tools with permission metadata and human-readable presentation.",
    title: "Agent tools"
  }
]

export default function ExtensionDocsPage() {
  return (
    <main>
      <PageHeading eyebrow="Extensions" title="A package model for desktop commands and agent tools.">
        Jingle extensions should feel native: fast command views, clear settings,
        account connections, and AI tools that can be inspected before they act.
      </PageHeading>

      <section className="page-shell pb-20">
        <div className="grid gap-4 md:grid-cols-4">
          {layers.map((layer) => (
            <article key={layer.title} className="rounded-md border border-[color:var(--line)] bg-[var(--panel)] p-5">
              <h2 className="text-lg font-semibold">{layer.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{layer.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-12 rounded-md border border-[color:var(--line)] bg-[#101312] p-6 text-[color:var(--panel)]">
          <h2 className="text-2xl font-semibold">Package layout</h2>
          <pre className="mt-5 overflow-x-auto rounded-md border border-white/10 bg-black/24 p-4 text-sm leading-7 text-white/72">
{`extensions/github/
  manifest.ts
  runtime.ts
  runtime-metadata.ts
  main.ts
  src/
    my-issues.tsx
    tools.ts`}
          </pre>
        </div>
      </section>
    </main>
  )
}
