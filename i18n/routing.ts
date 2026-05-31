import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  defaultLocale: "en",
  localePrefix: "always",
  locales: ["en", "zh"]
})

export type Locale = (typeof routing.locales)[number]

export function isLocale(locale: string): locale is Locale {
  return routing.locales.includes(locale as Locale)
}
