import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"
import { PageHeading } from "@/components/page-heading"
import { isLocale } from "@/i18n/routing"
import { privacySectionIcons } from "@/lib/site"

interface PrivacySection {
  body: string
  title: string
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Privacy" })
  return { title: t("metadataTitle") }
}

export default async function PrivacyPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (isLocale(locale)) {
    setRequestLocale(locale)
  }

  return <PrivacyContent />
}

function PrivacyContent() {
  const t = useTranslations("Privacy")
  const sections = t.raw("sections") as PrivacySection[]

  return (
    <main>
      <PageHeading eyebrow={t("eyebrow")} title={t("title")}>
        {t("body")}
      </PageHeading>

      <section className="page-shell pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          {sections.map((section, index) => {
            const Icon = privacySectionIcons[index]
            return (
              <article key={section.title} className="grouped-panel rounded-[22px] p-6">
                <span className="grid h-9 w-9 place-items-center rounded-2xl bg-[var(--soft)]">
                  <Icon className={index % 2 === 0 ? "h-5 w-5 text-[color:var(--green)]" : "h-5 w-5 text-[color:var(--blue)]"} aria-hidden="true" />
                </span>
                <h2 className="mt-5 text-xl font-semibold">{section.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{section.body}</p>
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}
