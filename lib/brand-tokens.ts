export const brandTokens = {
  color: {
    background: "#f7f4ec",
    backgroundDark: "#080b09",
    foreground: "#111816",
    muted: "#66706b",
    panel: "#fffdf7",
    cream: "#fffff6",
    soft: "#edf3eb",
    line: "#dfe7dc",
    gold: "#e5bf62",
    green: "#28c97b",
    greenDark: "#1c7f61",
    red: "#c64e3b",
    blue: "#256fa3"
  },
  radius: {
    icon: 25.5,
    card: 8,
    control: 999
  },
  shadow: {
    icon: "0 24px 38px rgba(17, 24, 22, 0.22)",
    panel: "0 18px 55px rgba(17, 24, 22, 0.08)"
  }
} as const

export const brandCssVariables = {
  "--background": brandTokens.color.background,
  "--foreground": brandTokens.color.foreground,
  "--muted": brandTokens.color.muted,
  "--panel": brandTokens.color.panel,
  "--soft": brandTokens.color.soft,
  "--line": brandTokens.color.line,
  "--gold": brandTokens.color.gold,
  "--green": brandTokens.color.green,
  "--green-dark": brandTokens.color.greenDark,
  "--brand-cream": brandTokens.color.cream,
  "--brand-ink": brandTokens.color.foreground,
  "--brand-shadow-icon": brandTokens.shadow.icon,
  "--radius-card": `${brandTokens.radius.card}px`
} as const
