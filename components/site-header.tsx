import Link from "next/link"
import { Download } from "lucide-react"
import { navItems, site } from "@/lib/site"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--line)] bg-white/88 backdrop-blur-xl">
      <div className="page-shell flex h-16 items-center justify-between gap-6">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[#101312] text-sm font-semibold text-white">
            金
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold">{site.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-[color:var(--muted)] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="focus-ring rounded-md hover:text-[#101312]">
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/docs"
          className="focus-ring dark-button inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium"
        >
          Download
          <Download className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </header>
  )
}
