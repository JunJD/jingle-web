import { useTranslations } from "next-intl"
import { BrandMark } from "@/components/brand-mark"
import { Link } from "@/i18n/navigation"
import { site } from "@/lib/site"

export function SiteFooter() {
  const footer = useTranslations("Footer")
  const siteText = useTranslations("Site")
  const groups = [
    {
      links: [
        { href: "/#features", label: footer("features") },
        { href: "/#extensions", label: footer("extensions") },
        { href: "/roadmap", label: footer("roadmap") },
        { href: "/brand", label: footer("brand") },
        { href: "/developers", label: footer("developers") }
      ],
      title: footer("product")
    },
    {
      links: [
        { href: "/developers", label: footer("docs") },
        { href: "/developers/extensions", label: footer("extensionGuide") },
        { href: "/developers/connections", label: footer("connectionGuide") }
      ],
      title: footer("resources")
    },
    {
      links: [
        { href: "/privacy", label: footer("privacy") },
        { href: "/developers", label: footer("contact") }
      ],
      title: footer("company")
    }
  ]

  return (
    <footer className="border-t border-[color:var(--line)] bg-[color:var(--panel)]/72">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.4fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-9 w-9 brand-icon-shadow" />
            <div>
              <p className="text-sm font-semibold">{site.name}</p>
              <p className="mt-1 text-xs font-medium text-[color:var(--muted)]">{site.cnName}</p>
            </div>
          </div>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[color:var(--muted)]">
            {siteText("description")}
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <div className="mt-3 grid gap-2 text-sm text-[color:var(--muted)]">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="focus-ring rounded-lg hover:text-[color:var(--foreground)]">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
