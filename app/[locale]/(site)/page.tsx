import { HomePage } from "@/components/home-page"
import { setRequestLocale } from "next-intl/server"
import { isLocale } from "@/i18n/routing"

export default async function LocalizedHomePage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (isLocale(locale)) {
    setRequestLocale(locale)
  }

  return <HomePage />
}
