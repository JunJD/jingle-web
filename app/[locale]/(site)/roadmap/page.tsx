import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { isLocale } from "@/i18n/routing"
import { productRoadmapIcons } from "@/lib/site"

interface RoadmapSection {
  body: string
  next: string
  status: string
  title: string
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Roadmap" })
  return { title: t("metadataTitle") }
}

export default async function RoadmapPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (isLocale(locale)) {
    setRequestLocale(locale)
  }

  return <RoadmapContent />
}

function RoadmapContent() {
  const t = useTranslations("Roadmap")
  const sections = t.raw("sections") as RoadmapSection[]
  const notes = t.raw("notes") as string[]

  return (
    <main>
      <section className="grid-paper border-b border-[color:var(--line)]">
        <div className="page-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
            {t("eyebrow")}
          </p>
          <h1 className="mt-5 max-w-5xl text-5xl font-semibold leading-tight md:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">
            {t("body")}
          </p>
        </div>
      </section>

      <section className="border-b border-[color:var(--line)] bg-white/62">
        <div className="page-shell grid gap-4 py-12 md:grid-cols-[0.8fr_1.2fr]">
          <h2 className="text-2xl font-semibold">{t("statusTitle")}</h2>
          <p className="text-base leading-7 text-[color:var(--muted)]">{t("statusBody")}</p>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section, index) => {
            const Icon = productRoadmapIcons[index]
            return (
              <article
                key={section.title}
                className="grouped-panel rounded-[22px] p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                    <Icon className="h-5 w-5 text-[color:var(--green)]" aria-hidden="true" />
                  </span>
                  <span className="rounded-full border border-[color:var(--line)] bg-white px-3 py-1 text-xs font-semibold text-[color:var(--muted)]">
                    {section.status}
                  </span>
                </div>
                <h2 className="mt-5 text-xl font-semibold">{section.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[color:var(--muted)]">{section.body}</p>
                <div className="mt-5 rounded-2xl bg-[var(--soft)] p-4">
                  <p className="text-sm leading-6 text-[color:var(--muted)]">{section.next}</p>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <section className="border-t border-[color:var(--line)] bg-[#101312] py-16 text-white">
        <div className="page-shell grid gap-8 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h2 className="text-3xl font-semibold">{t("notesTitle")}</h2>
            <Link
              href="/developers/platform-roadmap"
              className="focus-ring mt-6 inline-flex h-11 items-center gap-2 rounded-full border border-white/16 px-4 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t("developerLink")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-3">
            {notes.map((note) => (
              <div key={note} className="rounded-[20px] border border-white/12 bg-white/7 p-4 text-sm leading-6 text-white/72">
                {note}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
