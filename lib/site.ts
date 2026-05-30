import {
  Blocks,
  Brain,
  Building2,
  CheckCircle2,
  Command,
  DatabaseZap,
  FileText,
  Github,
  KeyRound,
  LibraryBig,
  LifeBuoy,
  LockKeyhole,
  MessageSquare,
  PlugZap,
  Search,
  ShieldCheck,
  Sparkles,
  Workflow
} from "lucide-react"

export const site = {
  name: "Jingle",
  cnName: "金狗",
  description: "A desktop command center for extensions, AI workflows, and local knowledge.",
  url: "https://jingle.ai"
}

export const navItems = [
  { href: "/#features", label: "Features" },
  { href: "/#extensions", label: "Extensions" },
  { href: "/#developers", label: "Developers" },
  { href: "/docs", label: "Docs" }
]

export const heroActions = [
  { href: "/docs", label: "Read the docs", primary: true },
  { href: "/#extensions", label: "Explore extensions", primary: false }
]

export const productPillars = [
  {
    description: "Launch commands, switch context, and operate repeat workflows without leaving the keyboard.",
    icon: Command,
    title: "Command center"
  },
  {
    description: "Connect apps, run extension views, and bring provider actions into one predictable surface.",
    icon: PlugZap,
    title: "Extension store"
  },
  {
    description: "Give AI workflows the right files, tools, memories, and approval boundaries.",
    icon: Brain,
    title: "AI workspace"
  },
  {
    description: "Keep working context local-first, searchable, editable, and visible to the user.",
    icon: LibraryBig,
    title: "Local knowledge"
  }
]

export const workflowRows = [
  {
    detail: "Search, open, and act across apps.",
    icon: Search,
    title: "Find anything"
  },
  {
    detail: "Run extension commands with native-feeling views.",
    icon: Workflow,
    title: "Do the work"
  },
  {
    detail: "Let agents use approved tools and local context.",
    icon: Sparkles,
    title: "Hand off safely"
  }
]

export const extensionCards = [
  {
    description: "Issues, pull requests, notifications, and repository workflows.",
    icon: "GH",
    status: "Developer preview",
    title: "GitHub"
  },
  {
    description: "Pages, databases, capture flows, and workspace search.",
    icon: "N",
    status: "Developer preview",
    title: "Notion"
  },
  {
    description: "Native reminders, due dates, quick capture, and local task flows.",
    icon: "R",
    status: "Built-in",
    title: "Reminders"
  }
]

export const developerCards = [
  {
    description: "Ship command views, menu bar tools, no-view commands, and AI tools from one package.",
    href: "/docs/extensions",
    icon: Blocks,
    title: "Extension model"
  },
  {
    description: "Use documented connection, storage, settings, and command APIs from the runtime SDK.",
    href: "/docs",
    icon: DatabaseZap,
    title: "Runtime APIs"
  },
  {
    description: "Build tools that agents can call with clear approval and presentation boundaries.",
    href: "/docs#agents",
    icon: MessageSquare,
    title: "Agent tools"
  }
]

export const trustItems = [
  {
    description: "Sensitive credentials belong to host-managed secure storage, not plain extension settings.",
    icon: LockKeyhole,
    title: "Credential boundaries"
  },
  {
    description: "Users should understand which context is local, which is shared, and what agents can access.",
    icon: ShieldCheck,
    title: "User control"
  },
  {
    description: "Connections, memories, and tool permissions are designed as inspectable product surfaces.",
    icon: CheckCircle2,
    title: "Inspectable state"
  }
]

export const docs = [
  {
    description: "Build view commands, no-view commands, menu bar commands, and AI tools.",
    href: "/docs/extensions",
    icon: Sparkles,
    title: "Extension model"
  },
  {
    description: "Account connection flow, secure storage, and connection state.",
    href: "/docs/connections",
    icon: KeyRound,
    title: "Connections"
  },
  {
    description: "How agents request tool access, present approvals, and report results.",
    href: "/docs#agents",
    icon: MessageSquare,
    title: "Agent tools"
  }
]

export const footerGroups = [
  {
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#extensions", label: "Extensions" },
      { href: "/#developers", label: "Developers" }
    ],
    title: "Product"
  },
  {
    links: [
      { href: "/docs", label: "Docs" },
      { href: "/docs/extensions", label: "Extension guide" },
      { href: "/docs/connections", label: "Connection guide" }
    ],
    title: "Resources"
  },
  {
    links: [
      { href: "/privacy", label: "Privacy" },
      { href: "/docs", label: "Contact" }
    ],
    title: "Company"
  }
]

export const docsQuickLinks = [
  {
    href: "/docs/extensions",
    icon: FileText,
    title: "Create an extension"
  },
  {
    href: "/docs/connections",
    icon: KeyRound,
    title: "Connect accounts"
  },
  {
    href: "/privacy",
    icon: LifeBuoy,
    title: "Privacy model"
  },
  {
    href: "https://github.com",
    icon: Github,
    title: "GitHub"
  },
  {
    href: "/#developers",
    icon: Building2,
    title: "For developers"
  }
]
