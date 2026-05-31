import type { Metadata } from "next"
import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { useTranslations } from "next-intl"
import { PageHeading } from "@/components/page-heading"
import { isLocale } from "@/i18n/routing"
import { brandCssVariables, brandTokens } from "@/lib/brand-tokens"

interface AssetCard {
  body: string
  title: string
  type: "desktop" | "web" | "favicon" | "modes" | "flat" | "mono" | "lockup" | "apparel" | "merch"
}

interface Principle {
  body: string
  title: string
}

const assetDownloads = [
  ["/brand/jingle-mark.svg", "SVG"],
  ["/brand/jingle-mark-flat.svg", "SVG"],
  ["/brand/jingle-mark-monochrome.svg", "SVG"],
  ["/brand/jingle-lockup-light.svg", "SVG"],
  ["/brand/jingle-lockup-dark.svg", "SVG"],
  ["/brand/favicon.svg", "SVG"],
  ["/brand/export/jingle-app-icon-1024.png", "PNG 1024"],
  ["/brand/export/jingle-app-icon-512.png", "PNG 512"],
  ["/brand/export/jingle-app-icon-256.png", "PNG 256"],
  ["/brand/export/jingle-favicon-64.png", "PNG 64"],
  ["/brand/export/jingle-favicon-32.png", "PNG 32"],
  ["/brand/export/jingle-favicon-16.png", "PNG 16"],
  ["/brand/export/jingle-mark-flat-512.png", "PNG 512"],
  ["/brand/export/jingle-mark-monochrome-512.png", "PNG 512"],
  ["/brand/export/jingle-lockup-light-1200.png", "PNG 1200"]
] as const

const tokenSwatches = [
  ["brandInk", brandTokens.color.foreground],
  ["background", brandTokens.color.background],
  ["panel", brandTokens.color.panel],
  ["cream", brandTokens.color.cream],
  ["green", brandTokens.color.green],
  ["gold", brandTokens.color.gold],
  ["muted", brandTokens.color.muted],
  ["line", brandTokens.color.line]
] as const

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "Brand" })
  return { title: t("metadataTitle") }
}

export default async function BrandPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (isLocale(locale)) {
    setRequestLocale(locale)
  }

  return <BrandContent />
}

function BrandContent() {
  const t = useTranslations("Brand")
  const assetCards = t.raw("assets.cards") as AssetCard[]
  const principles = t.raw("principles.items") as Principle[]
  const cssVariableEntries = Object.entries(brandCssVariables)

  return (
    <main>
      <PageHeading eyebrow={t("eyebrow")} title={t("title")}>
        {t("body")}
      </PageHeading>

      <section className="page-shell pb-16">
        <div className="material-panel grid gap-8 overflow-hidden rounded-[26px] p-6 md:grid-cols-[0.9fr_1.1fr] md:p-8">
          <div className="flex flex-col justify-between gap-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
                {t("final.eyebrow")}
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                {t("final.title")}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--muted)]">
                {t("final.body")}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {principles.map((principle) => (
                <div key={principle.title} className="rounded-[20px] border border-[color:var(--line)] bg-white/66 p-4">
                  <h3 className="text-sm font-semibold">{principle.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[color:var(--muted)]">{principle.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid min-h-[420px] place-items-center rounded-[24px] bg-[color:var(--brand-ink)] p-8">
            <Image
              src="/brand/jingle-mark.svg"
              alt={t("final.alt")}
              width={260}
              height={260}
              priority
              unoptimized
              className="brand-icon-shadow h-auto w-[min(260px,70vw)]"
            />
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("assets.eyebrow")}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              {t("assets.title")}
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-[color:var(--muted)]">
            {t("assets.body")}
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {assetCards.map((card) => (
            <article key={card.title} className="grouped-panel overflow-hidden rounded-[22px]">
              <BrandAssetPreview type={card.type} />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{card.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[color:var(--line)] bg-white/62 py-16">
        <div className="page-shell">
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
                {t("tokens.eyebrow")}
              </p>
              <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
                {t("tokens.title")}
              </h2>
            </div>
            <p className="text-base leading-7 text-[color:var(--muted)]">{t("tokens.body")}</p>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tokenSwatches.map(([key, value]) => (
              <div key={key} className="grouped-panel rounded-[20px] p-4">
                <div
                  className="h-20 rounded-[16px] border border-[color:var(--line)]"
                  style={{ backgroundColor: value }}
                />
                <h3 className="mt-4 text-sm font-semibold">{t(`tokens.names.${key}`)}</h3>
                <p className="mt-1 font-mono text-xs text-[color:var(--muted)]">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="grouped-panel rounded-[20px] p-5">
              <h3 className="text-sm font-semibold">{t("tokens.radiusTitle")}</h3>
              <p className="mt-2 font-mono text-sm text-[color:var(--muted)]">
                icon {brandTokens.radius.icon}px / card {brandTokens.radius.card}px
              </p>
            </div>
            <div className="grouped-panel rounded-[20px] p-5">
              <h3 className="text-sm font-semibold">{t("tokens.shadowTitle")}</h3>
              <p className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{brandTokens.shadow.icon}</p>
            </div>
            <div className="grouped-panel rounded-[20px] p-5">
              <h3 className="text-sm font-semibold">{t("tokens.assetTitle")}</h3>
              <p className="mt-2 font-mono text-xs leading-5 text-[color:var(--muted)]">
                /brand/jingle-mark.svg
                <br />
                /brand/favicon.svg
                <br />
                /brand/jingle-lockup-light.svg
              </p>
            </div>
          </div>
          <div className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--brand-ink)] p-5 text-white">
            <h3 className="text-sm font-semibold">{t("tokens.cssTitle")}</h3>
            <div className="mt-4 grid gap-2 font-mono text-xs leading-5 text-white/72 md:grid-cols-2">
              {cssVariableEntries.map(([name, value]) => (
                <div key={name} className="rounded-xl bg-white/7 px-3 py-2">
                  {name}: {value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
              {t("downloads.eyebrow")}
            </p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">
              {t("downloads.title")}
            </h2>
          </div>
          <p className="max-w-lg text-base leading-7 text-[color:var(--muted)]">
            {t("downloads.body")}
          </p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {assetDownloads.map(([href, format]) => (
            <a
              key={href}
              href={href}
              className="focus-ring grouped-panel flex min-w-0 flex-col items-start justify-between gap-3 rounded-[18px] p-4 hover:bg-white sm:flex-row sm:items-center"
            >
              <span className="min-w-0 max-w-full">
                <span className="block max-w-full break-all font-mono text-xs text-[color:var(--muted)]">{href}</span>
                <span className="mt-1 block text-sm font-semibold">{format}</span>
              </span>
              <span className="shrink-0 rounded-full bg-[color:var(--soft)] px-3 py-1 text-xs text-[color:var(--muted)]">
                {t("downloads.open")}
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  )
}

function BrandAssetPreview({ type }: { type: AssetCard["type"] }) {
  return (
    <div className="grid min-h-[210px] place-items-center border-b border-[color:var(--line)] bg-[color:var(--soft)] p-5">
      {type === "desktop" ? <DesktopPreview /> : null}
      {type === "web" ? <WebPreview /> : null}
      {type === "favicon" ? <FaviconPreview /> : null}
      {type === "modes" ? <ModePreview /> : null}
      {type === "flat" ? <Image src="/brand/jingle-mark-flat.svg" alt="" width={92} height={92} unoptimized /> : null}
      {type === "mono" ? (
        <div className="grid h-32 w-32 place-items-center rounded-[24px] bg-[color:var(--brand-ink)]">
          <Image src="/brand/jingle-mark-monochrome.svg" alt="" width={86} height={86} unoptimized />
        </div>
      ) : null}
      {type === "lockup" ? <Image src="/brand/jingle-lockup-light.svg" alt="" width={270} height={78} unoptimized /> : null}
      {type === "apparel" ? <ApparelPreview /> : null}
      {type === "merch" ? <MerchPreview /> : null}
    </div>
  )
}

function DesktopPreview() {
  return (
    <div className="flex items-end gap-3 rounded-[22px] border border-white/14 bg-[color:var(--brand-ink)] p-4 shadow-2xl">
      <span className="h-10 w-10 rounded-xl bg-white/34" />
      <Image src="/brand/jingle-mark.svg" alt="" width={74} height={74} unoptimized />
      <span className="h-10 w-10 rounded-xl bg-white/20" />
    </div>
  )
}

function WebPreview() {
  return (
    <div className="w-full max-w-[300px] rounded-[20px] border border-[color:var(--line)] bg-white shadow-xl">
      <div className="flex gap-1.5 border-b border-[color:var(--line)] p-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7cdbc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7cdbc]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#d7cdbc]" />
      </div>
      <div className="flex items-center gap-3 p-5">
        <Image src="/brand/jingle-mark.svg" alt="" width={44} height={44} unoptimized />
        <div>
          <strong className="block text-2xl leading-none">Jingle</strong>
          <span className="mt-1 block text-xs text-[color:var(--muted)]">Command everything</span>
        </div>
      </div>
    </div>
  )
}

function FaviconPreview() {
  return (
    <div className="flex items-center gap-5 rounded-[22px] bg-[color:var(--brand-ink)] p-5">
      <Image src="/brand/favicon.svg" alt="" width={64} height={64} unoptimized />
      <Image src="/brand/favicon.svg" alt="" width={32} height={32} unoptimized />
      <Image src="/brand/favicon.svg" alt="" width={16} height={16} unoptimized />
    </div>
  )
}

function ModePreview() {
  return (
    <div className="grid w-full max-w-[260px] grid-cols-2 overflow-hidden rounded-[22px] border border-[color:var(--line)]">
      <div className="grid h-36 place-items-center bg-[color:var(--background)]">
        <Image src="/brand/jingle-mark.svg" alt="" width={74} height={74} unoptimized />
      </div>
      <div className="grid h-36 place-items-center bg-[color:var(--brand-ink)]">
        <Image src="/brand/jingle-mark.svg" alt="" width={74} height={74} unoptimized />
      </div>
    </div>
  )
}

function ApparelPreview() {
  return (
    <div className="relative h-[134px] w-[162px] bg-[#eee8db] shadow-xl [clip-path:polygon(22%_16%,37%_6%,63%_6%,78%_16%,94%_34%,78%_47%,75%_100%,25%_100%,22%_47%,6%_34%)]">
      <Image
        src="/brand/jingle-mark.svg"
        alt=""
        width={44}
        height={44}
        unoptimized
        className="absolute left-1/2 top-[44%] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  )
}

function MerchPreview() {
  return (
    <div className="relative h-[130px] w-[214px]">
      <div className="absolute left-0 top-2 grid h-[74px] w-[74px] rotate-[-8deg] place-items-center rounded-full border border-[color:var(--line)] bg-white shadow-xl">
        <Image src="/brand/jingle-mark.svg" alt="" width={34} height={34} unoptimized />
      </div>
      <div className="absolute bottom-0 left-[66px] grid h-[102px] w-[82px] place-items-center rounded-b-lg rounded-t-[8px] border border-[color:var(--line)] bg-white shadow-xl before:absolute before:-top-3 before:h-6 before:w-11 before:rounded-t-full before:border-[3px] before:border-b-0 before:border-[#d6cdbc]">
        <Image src="/brand/jingle-mark.svg" alt="" width={34} height={34} unoptimized />
      </div>
      <div className="absolute bottom-2.5 right-1 grid h-[74px] w-16 place-items-center rounded-b-[18px] rounded-t-lg border border-[color:var(--line)] bg-white shadow-xl">
        <Image src="/brand/jingle-mark.svg" alt="" width={34} height={34} unoptimized />
      </div>
    </div>
  )
}
