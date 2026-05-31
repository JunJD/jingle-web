import { FileText } from "lucide-react"
import { useTranslations } from "next-intl"
import { BrandMark } from "@/components/brand-mark"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Link } from "@/i18n/navigation"
import { site } from "@/lib/site"

export function SiteHeader() {
  const nav = useTranslations("Nav")
  const siteText = useTranslations("Site")
  const navItems = [
    { href: "/#features", label: nav("features") },
    { href: "/#extensions", label: nav("extensions") },
    { href: "/roadmap", label: nav("roadmap") },
    { href: "/brand", label: nav("brand") },
    { href: "/developers", label: nav("developers") },
    { href: "/developers/api-reference", label: nav("docs") }
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-[rgba(255,253,247,0.84)] backdrop-blur-xl">
      <div className="page-shell flex h-[68px] items-center justify-between gap-6">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-xl">
          <BrandMark priority className="h-9 w-9 brand-icon-shadow" />
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold">{site.name}</span>
            <span className="mt-1 text-xs font-medium text-[color:var(--muted)]">{site.cnName}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[color:var(--line)] bg-[color:var(--panel)]/72 p-1 text-sm text-[color:var(--muted)] shadow-sm md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="focus-ring rounded-full px-3 py-2 hover:bg-[var(--soft)] hover:text-[color:var(--foreground)]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link
            href="/developers"
            className="focus-ring dark-button inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-medium"
          >
            {siteText("developerCta")}
            <FileText className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </header>
  )
}
