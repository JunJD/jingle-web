import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { RootProvider } from "fumadocs-ui/provider/next"
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server"
import { isLocale, routing } from "@/i18n/routing"
import { site } from "@/lib/site"
import "../globals.css"

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : routing.defaultLocale
  const metadata = await getTranslations({ locale, namespace: "Metadata" })

  return {
    title: {
      default: metadata("title"),
      template: "%s - " + site.name
    },
    description: metadata("description"),
    icons: {
      icon: "/brand/favicon.svg",
      shortcut: "/brand/favicon.svg",
      apple: "/brand/jingle-mark.svg"
    },
    metadataBase: new URL(site.url),
    openGraph: {
      description: metadata("description"),
      siteName: site.name,
      title: metadata("title"),
      type: "website"
    }
  }
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!isLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <RootProvider search={{ enabled: false }} theme={{ enabled: false }}>{children}</RootProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
