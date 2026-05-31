import Image from "next/image"
import { ArrowRight, Command, FileText, Search } from "lucide-react"
import { useTranslations } from "next-intl"
import { BrandMark } from "@/components/brand-mark"
import { Link } from "@/i18n/navigation"
import {
  homePillarIcons,
  homeRoadmapIcons,
  homeTrustIcons,
  homeWorkflowIcons,
  site
} from "@/lib/site"

interface HeroAction {
  href: string
  label: string
  primary: boolean
}

interface TextCard {
  body?: string
  description?: string
  detail?: string
  href?: string
  icon?: string
  status?: string
  title: string
}

export function HomePage() {
  const t = useTranslations("Home")
  const actions = t.raw("hero.actions") as HeroAction[]
  const demoItems = t.raw("hero.demoItems") as string[]
  const demoCards = t.raw("hero.demoCards") as TextCard[]
  const pillars = t.raw("features.pillars") as TextCard[]
  const workflowRows = t.raw("workflow.rows") as TextCard[]
  const extensionCards = t.raw("extensions.cards") as TextCard[]
  const roadmapItems = t.raw("roadmap.items") as TextCard[]
  const trustItems = t.raw("trust.items") as TextCard[]

  return (
    <main>
      <section className="grid-paper border-b border-[color:var(--line)]">
        <div className="page-shell grid min-h-[calc(100vh-68px)] items-center gap-12 py-12 md:grid-cols-[1.02fr_0.98fr] md:py-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white/72 px-3 py-2 text-sm text-[color:var(--muted)] shadow-sm backdrop-blur">
              <BrandMark className="h-5 w-5" />
              {site.name} / {site.cnName}
            </div>
            <h1 className="mt-7 text-5xl font-semibold leading-[0.98] md:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)]">
              {t("hero.subtitle")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    action.primary
                      ? "focus-ring dark-button inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
                      : "focus-ring subtle-button inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold"
                  }
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="material-panel relative min-h-[540px] overflow-hidden rounded-[26px] bg-[color:var(--brand-ink)]">
            <Image
              src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1400&q=80"
              alt={t("hero.imageAlt")}
              fill
              className="object-cover opacity-28"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[color:var(--brand-ink)]/8 via-[color:var(--brand-ink)]/34 to-[color:var(--brand-ink)]/82" />
            <div className="absolute inset-x-5 top-5 rounded-[22px] border border-white/18 bg-[color:var(--brand-cream)]/90 p-3 shadow-2xl backdrop-blur-2xl">
              <div className="flex h-11 items-center gap-3 rounded-2xl bg-[color:var(--soft)] px-4">
                <Search className="h-4 w-4 text-[#7b827f]" aria-hidden="true" />
                <span className="text-sm text-[#777f7b]">{t("hero.searchPlaceholder")}</span>
                <kbd className="ml-auto rounded-lg bg-white px-2 py-1 text-[11px] font-semibold text-[#777f7b] shadow-sm">⌘K</kbd>
              </div>
              <div className="mt-5 pl-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#7b827f]">
                {t("hero.recentLabel")}
              </div>
              <div className="mt-2 overflow-hidden rounded-2xl bg-white">
                {demoItems.map((item) => (
                  <div
                    key={item}
                    className="flex h-12 items-center justify-between border-b border-[color:var(--line)] px-4 last:border-b-0 first:bg-[color:var(--soft)]"
                  >
                    <span className="text-sm font-medium text-[#1d2422]">{item}</span>
                    <Command className="h-4 w-4 text-[#8b918f]" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute inset-x-5 bottom-5 grid gap-3 md:grid-cols-2">
              {demoCards.map((card) => (
                <div key={card.title} className="rounded-[20px] border border-white/14 bg-white/88 p-4 shadow-xl backdrop-blur-2xl">
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">{card.body}</p>
                </div>
              ))}
            </div>
            <div className="absolute bottom-[156px] left-5 right-5 flex items-center justify-between rounded-full border border-white/12 bg-white/10 px-4 py-3 text-xs font-medium text-white/72 backdrop-blur-xl">
              <span>{t("hero.footerStatus")}</span>
              <span>{t("hero.footerAction")}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="page-shell py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("features.eyebrow")}
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
              {t("features.title")}
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-[color:var(--muted)]">
            {t("features.body")}
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {pillars.map((pillar, index) => {
            const Icon = homePillarIcons[index]
            return (
              <article key={pillar.title} className="grouped-panel rounded-[22px] p-5">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                  <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{pillar.description}</p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y border-[color:var(--line)] bg-white/62 py-20">
        <div className="page-shell grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("workflow.eyebrow")}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              {t("workflow.title")}
            </h2>
          </div>
          <div className="overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/82 shadow-sm">
            {workflowRows.map((row, index) => {
              const Icon = homeWorkflowIcons[index]
              return (
                <article key={row.title} className="flex min-h-[86px] items-center gap-4 border-b border-[color:var(--line)] px-5 last:border-b-0">
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--soft)]">
                    <Icon className="h-5 w-5 text-[color:var(--blue)]" aria-hidden="true" />
                  </span>
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
          {t("extensions.eyebrow")}
        </p>
        <h2 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight md:text-5xl">
          {t("extensions.title")}
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {extensionCards.map((extension) => (
            <article key={extension.title} className="grouped-panel rounded-[22px] p-5">
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#101312] text-sm font-semibold text-white shadow-sm">
                  {extension.icon}
                </span>
                <span className="rounded-full border border-[color:var(--line)] bg-[var(--soft)] px-3 py-1 text-xs text-[color:var(--muted)]">
                  {extension.status}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{extension.title}</h3>
              <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{extension.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-[color:var(--line)] bg-white/62 py-20">
        <div className="page-shell">
          <div className="grid gap-6 md:grid-cols-[0.85fr_1.15fr] md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
                {t("roadmap.eyebrow")}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                {t("roadmap.title")}
              </h2>
            </div>
            <p className="text-base leading-7 text-[color:var(--muted)]">
              {t("roadmap.body")}
            </p>
          </div>
          <div className="mt-10 grid gap-3 md:grid-cols-2">
            {roadmapItems.map((item, index) => {
              const Icon = homeRoadmapIcons[index]
              return (
                <article
                  key={item.title}
                  className="grouped-panel flex min-h-40 flex-col justify-between rounded-[22px] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                      <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                    </span>
                    <span className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-5">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
                      {item.description}
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-4 md:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("trust.eyebrow")}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              {t("trust.title")}
            </h2>
          </div>
          <div className="grid gap-3">
            {trustItems.map((item, index) => {
              const Icon = homeTrustIcons[index]
              return (
                <article key={item.title} className="grouped-panel rounded-[22px] p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                    <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{item.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="page-shell pb-20">
        <div className="material-panel flex flex-col items-start justify-between gap-6 rounded-[26px] p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-2xl font-semibold">{t("cta.title")}</h2>
            <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{t("cta.body")}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/roadmap"
              className="focus-ring subtle-button inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold"
            >
              {t("cta.guide")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/developers"
              className="focus-ring dark-button inline-flex h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold"
            >
              {t("cta.developers")}
              <FileText className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
