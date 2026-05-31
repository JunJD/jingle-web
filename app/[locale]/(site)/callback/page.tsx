import type { Metadata } from "next"
import { ArrowRight, CheckCircle2, CircleAlert, Home } from "lucide-react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"
import { PageHeading } from "@/components/page-heading"
import { Link } from "@/i18n/navigation"
import { isLocale } from "@/i18n/routing"

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Callback" })
  return { title: t("metadataTitle") }
}

export default async function CallbackPage({
  params,
  searchParams
}: {
  params: Promise<{ locale: string }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const { locale } = await params

  if (isLocale(locale)) {
    setRequestLocale(locale)
  }

  const resolvedSearchParams = (await searchParams) ?? {}
  const code = readParam(resolvedSearchParams.code)
  const error = readParam(resolvedSearchParams.error)

  return <CallbackContent hasCode={Boolean(code)} hasError={Boolean(error)} />
}

function CallbackContent({ hasCode, hasError }: { hasCode: boolean; hasError: boolean }) {
  const t = useTranslations("Callback")
  const isReady = hasCode && !hasError

  return (
    <main>
      <PageHeading eyebrow={t("eyebrow")} title={t("title")}>
        {t("body")}
      </PageHeading>

      <section className="page-shell pb-20">
        <article className="material-panel mx-auto max-w-2xl rounded-[26px] p-6 text-center">
          {hasError ? (
            <CircleAlert className="mx-auto h-8 w-8 text-[color:var(--red)]" aria-hidden="true" />
          ) : (
            <CheckCircle2 className="mx-auto h-8 w-8 text-[color:var(--green)]" aria-hidden="true" />
          )}
          <h2 className="mt-5 text-2xl font-semibold">
            {hasError ? t("errorTitle") : isReady ? t("readyTitle") : t("waitingTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[color:var(--muted)]">
            {hasError ? t("errorBody") : t("readyBody")}
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="focus-ring dark-button inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium"
            >
              {t("backHome")}
              <Home className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/developers/connections"
              className="focus-ring subtle-button inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-sm font-medium"
            >
              {t("guide")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </article>
      </section>
    </main>
  )
}

function readParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}
