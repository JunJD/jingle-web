import type { Metadata } from "next"
import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { site } from "@/lib/site"

export const metadata: Metadata = {
  title: {
    default: `${site.name} - desktop command center`,
    template: `%s - ${site.name}`
  },
  description: site.description,
  metadataBase: new URL(site.url),
  openGraph: {
    description: site.description,
    siteName: site.name,
    title: `${site.name} - desktop command center`,
    type: "website"
  }
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  )
}
