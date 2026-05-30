import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CheckCircle2, Command, Download, Search, Sparkles } from "lucide-react"
import {
  developerCards,
  extensionCards,
  heroActions,
  productPillars,
  site,
  trustItems,
  workflowRows
} from "@/lib/site"

export default function HomePage() {
  return (
    <main>
      <section className="grid-paper border-b border-[color:var(--line)]">
        <div className="page-shell grid min-h-[calc(100vh-64px)] items-center gap-12 py-12 md:grid-cols-[1.02fr_0.98fr] md:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[color:var(--line)] bg-[var(--panel)] px-3 py-2 text-sm text-[color:var(--muted)] shadow-sm">
              <Sparkles className="h-4 w-4 text-[color:var(--gold)]" aria-hidden="true" />
              {site.name} / {site.cnName}
            </div>
            <h1 className="mt-7 text-5xl font-semibold leading-[0.98] md:text-7xl">
              A faster way to work with your desktop.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              Jingle is a command center for launching workflows, connecting extensions,
              and giving AI the context it needs to help without taking over your workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {heroActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    action.primary
                      ? "focus-ring dark-button inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold"
                      : "focus-ring inline-flex h-12 items-center justify-center gap-2 rounded-md border border-[color:var(--line)] bg-[var(--panel)] px-5 text-sm font-semibold hover:bg-white"
                  }
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="relative min-h-[540px] overflow-hidden rounded-md border border-[color:var(--line)] bg-[#101312] shadow-2xl">
            <Image
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80"
              alt="Desktop workspace placeholder"
              fill
              className="object-cover opacity-38"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#101312]/15 via-[#101312]/42 to-[#101312]/88" />
            <div className="absolute inset-x-6 top-6 rounded-md border border-white/14 bg-white/94 p-4 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-2 border-b border-[color:var(--line)] pb-3">
                <Search className="h-4 w-4 text-[color:var(--muted)]" aria-hidden="true" />
                <span className="text-sm text-[color:var(--muted)]">Search apps, commands, files, and agents</span>
              </div>
              <div className="mt-4 space-y-2">
                {["Open project notes", "Create launch plan", "Review today's changes"].map((item) => (
                  <div key={item} className="flex items-center justify-between rounded-md bg-[var(--soft)] px-3 py-3">
                    <span className="text-sm font-medium">{item}</span>
                    <Command className="h-4 w-4 text-[color:var(--muted)]" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-6 bottom-6 grid gap-3 md:grid-cols-2">
              <div className="rounded-md border border-white/12 bg-white/94 p-4 backdrop-blur">
                <h3 className="text-sm font-semibold">Extension actions</h3>
                <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
                  Run connected workflows from one surface instead of switching apps.
                </p>
              </div>
              <div className="rounded-md border border-white/12 bg-white/94 p-4 backdrop-blur">
                <h3 className="text-sm font-semibold">AI with context</h3>
                <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">
                  Attach files, memories, and tools while keeping approval visible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="page-shell py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              Features
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              Everything starts from the command surface.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[color:var(--muted)]">
            Built for repeated work: quick to invoke, easy to scan, and explicit about what runs.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {productPillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <article key={pillar.title} className="rounded-md border border-[color:var(--line)] bg-white p-5 shadow-sm">
                <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                <h3 className="mt-5 text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{pillar.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y border-[color:var(--line)] bg-white py-20">
        <div className="page-shell grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              Workflow
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Find, act, and hand off in one place.
            </h2>
          </div>
          <div className="grid gap-3">
            {workflowRows.map((row) => {
              const Icon = row.icon
              return (
                <article key={row.title} className="flex items-start gap-4 rounded-md border border-[color:var(--line)] bg-[var(--background)] p-5">
                  <Icon className="mt-1 h-5 w-5 text-[color:var(--blue)]" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold">{row.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[color:var(--muted)]">{row.detail}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="extensions" className="page-shell py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
          Extensions
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          Connect the tools your work already depends on.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {extensionCards.map((extension) => (
            <article key={extension.title} className="rounded-md border border-[color:var(--line)] bg-white p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-[#101312] text-sm font-semibold text-white">
                  {extension.icon}
                </span>
                <span className="rounded-md border border-[color:var(--line)] bg-[var(--soft)] px-3 py-1 text-xs text-[color:var(--muted)]">
                  {extension.status}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{extension.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{extension.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="developers" className="border-y border-[color:var(--line)] bg-[#101312] py-20 text-white">
        <div className="page-shell grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--gold)]">
              Developers
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Build commands that feel native to the desktop.
            </h2>
            <p className="mt-5 text-base leading-7 text-white/68">
              Jingle extensions are package-based: declare capabilities, render command views,
              and expose tools that agents can use with clear boundaries.
            </p>
          </div>
          <div className="grid gap-3">
            {developerCards.map((card) => {
              const Icon = card.icon
              return (
                <Link
                  key={card.href}
                  href={card.href}
                  className="focus-ring group rounded-md border border-white/12 bg-white/7 p-5 hover:bg-white/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Icon className="mt-1 h-5 w-5 text-[color:var(--gold)]" aria-hidden="true" />
                    <ArrowRight className="h-4 w-4 text-white/45 group-hover:text-white" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/68">{card.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              Trust
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              Designed for user-controlled automation.
            </h2>
          </div>
          <div className="grid gap-3">
            {trustItems.map((item) => {
              const Icon = item.icon
              return (
                <article key={item.title} className="rounded-md border border-[color:var(--line)] bg-white p-5">
                  <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-shell pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-md border border-[color:var(--line)] bg-white p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">Start building with Jingle.</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
              Read the extension guide or try the product shell locally.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/docs/extensions"
              className="focus-ring inline-flex h-11 items-center gap-2 rounded-md border border-[color:var(--line)] px-4 text-sm font-semibold hover:bg-white"
            >
              Extension guide
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/docs"
              className="focus-ring dark-button inline-flex h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold"
            >
              Download
              <Download className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
