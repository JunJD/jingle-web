"use client"

import { Languages } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import type { Locale } from "@/i18n/routing"

export function LanguageSwitcher() {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const siteText = useTranslations("Site")
  const nextLocale: Locale = locale === "en" ? "zh" : "en"

  return (
    <Link
      href={pathname}
      locale={nextLocale}
      className="focus-ring subtle-button inline-flex h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-[color:var(--muted)] hover:text-[#101312]"
      aria-label={siteText("languageLabel")}
    >
      <Languages className="h-4 w-4" aria-hidden="true" />
      {siteText("languageSwitch")}
    </Link>
  )
}
