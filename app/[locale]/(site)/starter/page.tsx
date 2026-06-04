import type { Metadata } from "next"
import {
  ArrowRight,
  Brain,
  CheckCircle2,
  DatabaseZap,
  KeyRound,
  LockKeyhole,
  MonitorCog,
  Settings2,
  ShieldCheck,
  Workflow
} from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"
import { BrandMark } from "@/components/brand-mark"
import { Link } from "@/i18n/navigation"
import { isLocale } from "@/i18n/routing"

interface StarterAction {
  href: string
  label: string
  primary: boolean
}

interface StarterStep {
  description: string
  title: string
}

interface StarterBoundary {
  body: string
  title: string
}

interface StarterUsageCard {
  body: string
  title: string
}

interface StarterProviderRow {
  label: string
  model: string
  status: "active" | "default"
}

const stepIcons = [Settings2, KeyRound, DatabaseZap, CheckCircle2] as const
const boundaryIcons = [MonitorCog, Workflow, LockKeyhole, Brain] as const
const usageIcons = [Brain, Workflow, ShieldCheck, Settings2] as const

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Starter" })
  return { title: t("metadataTitle") }
}

export default async function StarterPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (isLocale(locale)) {
    setRequestLocale(locale)
  }

  return <StarterContent />
}

function StarterContent() {
  const t = useTranslations("Starter")
  const actions = t.raw("hero.actions") as StarterAction[]
  const steps = t.raw("flow.steps") as StarterStep[]
  const boundaries = t.raw("boundary.items") as StarterBoundary[]
  const usageCards = t.raw("usage.cards") as StarterUsageCard[]
  const principles = t.raw("principles.items") as string[]
  const providerRows = t.raw("visual.providerRows") as StarterProviderRow[]

  return (
    <main>
      <section className="grid-paper border-b border-[color:var(--line)]">
        <div className="page-shell grid min-w-0 gap-10 py-14 md:grid-cols-[0.92fr_1.08fr] md:items-center md:py-20">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white/72 px-3 py-2 text-sm font-medium text-[color:var(--muted)] shadow-sm backdrop-blur">
              <BrandMark className="h-5 w-5" />
              {t("hero.eyebrow")}
            </div>
            <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.04] sm:text-5xl md:text-7xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl break-words text-lg leading-8 text-[color:var(--muted)]">
              {t("hero.body")}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              {actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    action.primary
                      ? "focus-ring dark-button inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold sm:w-auto"
                      : "focus-ring subtle-button inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold sm:w-auto"
                  }
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-[26px] border border-[#26312c] bg-[#101312] p-4 text-white shadow-[0_18px_55px_rgba(16,19,18,0.18)]">
            <div className="min-w-0 rounded-[22px] border border-white/10 bg-white/8 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/52">
                    {t("visual.windowLabel")}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">{t("visual.title")}</h2>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[color:var(--green)] text-[#101312]">
                  <Brain className="h-5 w-5" aria-hidden="true" />
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                {providerRows.map((provider) => (
                  <div
                    key={provider.label}
                    className="grid min-h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-2xl border border-white/10 bg-white/9 px-4"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{provider.label}</p>
                      <p className="mt-1 truncate text-xs text-white/52">{provider.model}</p>
                    </div>
                    <span
                      className={
                        provider.status === "default"
                          ? "rounded-full bg-[color:var(--gold)] px-3 py-1 text-xs font-semibold text-[#101312]"
                          : "rounded-full border border-white/14 px-3 py-1 text-xs font-semibold text-white/62"
                      }
                    >
                      {provider.status === "default"
                        ? t("visual.defaultBadge")
                        : t("visual.activeBadge")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/9 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    {t("visual.intentLabel")}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-white/84">
                    {t("visual.defaultModelValue")}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/9 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/45">
                    {t("visual.secretLabel")}
                  </p>
                  <p className="mt-2 font-mono text-sm text-white/84">{t("visual.secretValue")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="flow" className="page-shell py-16">
        <div className="grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("flow.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {t("flow.title")}
            </h2>
          </div>
          <p className="text-base leading-7 text-[color:var(--muted)]">{t("flow.body")}</p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = stepIcons[index]
            return (
              <article key={step.title} className="grouped-panel rounded-[22px] p-5">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                  <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">
                  {step.description}
                </p>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-y border-[color:var(--line)] bg-white/62 py-16">
        <div className="page-shell">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("boundary.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {t("boundary.title")}
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {boundaries.map((item, index) => {
              const Icon = boundaryIcons[index]
              return (
                <article key={item.title} className="grouped-panel rounded-[22px] p-5">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                    <Icon className="h-5 w-5 text-[color:var(--blue)]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{item.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section id="usage" className="page-shell py-16">
        <div className="grid gap-8 md:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("usage.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              {t("usage.title")}
            </h2>
            <p className="mt-5 text-base leading-7 text-[color:var(--muted)]">
              {t("usage.body")}
            </p>
          </div>

          <div className="grid gap-3">
            {usageCards.map((card, index) => {
              const Icon = usageIcons[index]
              return (
                <article
                  key={card.title}
                  className="grouped-panel grid gap-4 rounded-[22px] p-5 md:grid-cols-[auto_minmax(0,1fr)]"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[var(--soft)]">
                    <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{card.body}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[color:var(--line)] bg-[#101312] py-16 text-white">
        <div className="page-shell grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("principles.eyebrow")}
            </p>
            <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{t("principles.title")}</h2>
          </div>
          <div className="grid gap-3">
            {principles.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-[20px] border border-white/12 bg-white/7 p-4 text-sm leading-6 text-white/72"
              >
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--green)]" aria-hidden="true" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
