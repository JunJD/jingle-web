import Link from "next/link"
import { footerGroups, site } from "@/lib/site"

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--line)] bg-white">
      <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.4fr_2fr]">
        <div>
          <p className="text-sm font-semibold">{site.name}</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-[color:var(--muted)]">
            A desktop command center for extensions, AI workflows, and local knowledge.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {footerGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold">{group.title}</h2>
              <div className="mt-3 grid gap-2 text-sm text-[color:var(--muted)]">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="focus-ring rounded-md hover:text-[#101312]">
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
