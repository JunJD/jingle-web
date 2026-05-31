import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import defaultMdxComponents from "fumadocs-ui/mdx"
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page"
import { Callout, StatusBadge } from "@/components/developers/mdx-primitives"
import { isLocale, routing } from "@/i18n/routing"
import { source } from "@/lib/source"

export function generateStaticParams() {
  return source.generateParams("slug", "locale")
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale
  const page = source.getPage(slug, locale)

  if (!page) {
    return {}
  }

  return {
    description: page.data.description,
    title: page.data.title
  }
}

export default async function DeveloperDocPage({
  params
}: {
  params: Promise<{ locale: string; slug?: string[] }>
}) {
  const { locale, slug } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  if (slug?.join("/") === "introduction") {
    redirect("/" + locale + "/developers")
  }

  const page = source.getPage(slug, locale)
  if (!page) {
    notFound()
  }

  setRequestLocale(locale)
  const MDX = page.data.body

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      {page.data.description ? <DocsDescription>{page.data.description}</DocsDescription> : null}
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Callout,
            StatusBadge
          }}
        />
      </DocsBody>
    </DocsPage>
  )
}
