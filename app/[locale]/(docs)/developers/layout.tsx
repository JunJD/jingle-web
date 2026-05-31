import type { ReactNode } from "react"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"
import { BrandMark } from "@/components/brand-mark"
import { source } from "@/lib/source"
import { isLocale, type Locale } from "@/i18n/routing"

const localizedCopy: Record<Locale, {
  agent: string
  connections: string
  home: string
  title: string
}> = {
  en: {
    agent: "Agent tools",
    connections: "Connections",
    home: "Home",
    title: "Jingle Developers"
  },
  zh: {
    agent: "Agent 工具",
    connections: "账号连接",
    home: "首页",
    title: "Jingle Developers"
  }
}

function getLayoutOptions(locale: Locale): BaseLayoutProps {
  const copy = localizedCopy[locale]

  return {
    githubUrl: undefined,
    i18n: false,
    links: [
      {
        active: "none",
        text: copy.home,
        url: "/" + locale
      },
      {
        active: "nested-url",
        text: copy.connections,
        url: "/" + locale + "/developers/connections"
      },
      {
        active: "nested-url",
        text: copy.agent,
        url: "/" + locale + "/developers/agent-tools"
      }
    ],
    nav: {
      title: (
        <span className="inline-flex items-center gap-2.5">
          <BrandMark className="h-7 w-7" />
          <span>{copy.title}</span>
        </span>
      ),
      url: "/" + locale + "/developers"
    },
    searchToggle: {
      enabled: false
    },
    themeSwitch: {
      enabled: false
    }
  }
}

export default async function DevelopersLayout({
  children,
  params
}: Readonly<{
  children: ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale: rawLocale } = await params
  const locale = isLocale(rawLocale) ? rawLocale : "en"

  return (
    <DocsLayout
      {...getLayoutOptions(locale)}
      sidebar={{ defaultOpenLevel: 1 }}
      tree={source.getPageTree(locale)}
    >
      {children}
    </DocsLayout>
  )
}
