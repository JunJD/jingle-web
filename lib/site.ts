import {
  Blocks,
  Brain,
  CheckCircle2,
  Command,
  DatabaseZap,
  FileSearch,
  Globe2,
  KeyRound,
  LibraryBig,
  LockKeyhole,
  MonitorUp,
  MessageSquare,
  PlugZap,
  Puzzle,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  Workflow
} from "lucide-react"

export const site = {
  name: "Jingle",
  cnName: "金狗",
  url: "https://jingle.ai"
} as const

export const homePillarIcons = [Command, PlugZap, Brain, LibraryBig] as const

export const homeWorkflowIcons = [Search, Workflow, Sparkles] as const

export const homeTrustIcons = [LockKeyhole, ShieldCheck, CheckCircle2] as const

export const homeRoadmapIcons = [Search, Puzzle, Brain, Store, MonitorUp, Globe2, FileSearch, ShieldCheck] as const

export const productRoadmapIcons = [Search, FileSearch, Puzzle, Brain, Store, Globe2, MonitorUp, ShieldCheck] as const

export const docsCardIcons = [Sparkles, KeyRound, MessageSquare] as const

export const connectionStepIcons = [Blocks, KeyRound, LockKeyhole, CheckCircle2] as const

export const privacySectionIcons = [ShieldCheck, LockKeyhole, ShieldCheck, LockKeyhole] as const
