import type { ReactNode } from "react"

type CalloutTone = "info" | "preview" | "ready" | "research" | "warning"

export const developerMedia = {
  introduction:
    "https://developers.raycast.com/~gitbook/image?url=https%3A%2F%2F2922539984-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-Me_8A39tFhZg3UaVoSN%252Fuploads%252Fgit-blob-8a4f81b2b9ccaf142983dad7a0c7a2ce953467d5%252Fintroduction-hello-world.webp%3Falt%3Dmedia&width=768&dpr=2&quality=100&sign=d1796f36&sv=2",
  commandSearch:
    "https://developers.raycast.com/~gitbook/image?url=https%3A%2F%2F2922539984-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-Me_8A39tFhZg3UaVoSN%252Fuploads%252Fgit-blob-3cf0d0478508eca468e31c4f9ee871ea269d71e4%252Fhello-world.webp%3Falt%3Dmedia&width=768&dpr=2&quality=100&sign=38503a8b&sv=2",
  commandDetail:
    "https://developers.raycast.com/~gitbook/image?url=https%3A%2F%2F2922539984-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-Me_8A39tFhZg3UaVoSN%252Fuploads%252Fgit-blob-2927c54a56a87fd95fb0340b9acfcd26f48f0f40%252Fhello-world-2.webp%3Falt%3Dmedia&width=768&dpr=2&quality=100&sign=1a3dd2d1&sv=2",
  developerVideoHref: "https://www.youtube.com/watch?v=NZwqx_dS-k0",
  developerVideoPoster:
    "https://developers.raycast.com/~gitbook/image?url=https%3A%2F%2F2922539984-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F-Me_8A39tFhZg3UaVoSN%252Fuploads%252Fgit-blob-8a4f81b2b9ccaf142983dad7a0c7a2ce953467d5%252Fintroduction-hello-world.webp%3Falt%3Dmedia&width=768&dpr=2&quality=100&sign=d1796f36&sv=2"
} as const

const calloutClasses: Record<CalloutTone, string> = {
  info: "border-[color:var(--line)] bg-white/82",
  preview: "border-[color:rgba(39,89,135,0.28)] bg-[rgba(39,89,135,0.08)]",
  ready: "border-[color:rgba(26,124,93,0.25)] bg-[rgba(26,124,93,0.07)]",
  research: "border-[color:rgba(201,137,24,0.32)] bg-[rgba(201,137,24,0.09)]",
  warning: "border-[color:rgba(198,78,59,0.3)] bg-[rgba(198,78,59,0.08)]"
}

export function Callout({
  children,
  title,
  tone = "info"
}: {
  children: ReactNode
  title?: string
  tone?: CalloutTone
}) {
  return (
    <aside className={`my-6 rounded-[20px] border p-4 ${calloutClasses[tone]}`}>
      {title ? <p className="mb-2 text-sm font-semibold text-[#101312]">{title}</p> : null}
      <div className="text-sm leading-7 text-[color:var(--muted)]">{children}</div>
    </aside>
  )
}

export function StatusBadge({
  children,
  tone = "ready"
}: {
  children: ReactNode
  tone?: Extract<CalloutTone, "preview" | "ready" | "research" | "warning">
}) {
  const toneClass =
    tone === "ready"
      ? "border-[color:rgba(26,124,93,0.25)] bg-[rgba(26,124,93,0.08)] text-[color:var(--green)]"
      : tone === "preview"
        ? "border-[color:rgba(39,89,135,0.28)] bg-[rgba(39,89,135,0.08)] text-[#275987]"
      : tone === "warning"
        ? "border-[color:rgba(198,78,59,0.3)] bg-[rgba(198,78,59,0.08)] text-[color:var(--red)]"
        : "border-[color:rgba(201,137,24,0.35)] bg-[rgba(201,137,24,0.1)] text-[color:var(--gold)]"

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneClass}`}>
      {children}
    </span>
  )
}

export function MediaFrame({
  alt,
  caption,
  src
}: {
  alt: string
  caption?: ReactNode
  src: string
}) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-white/82 p-2 shadow-[0_18px_50px_rgba(16,19,18,0.08)]">
      <div className="overflow-hidden rounded-[18px] bg-[#101312]">
        <img alt={alt} className="block h-auto w-full" loading="lazy" src={src} />
      </div>
      {caption ? (
        <figcaption className="px-2 pb-1 pt-3 text-xs leading-5 text-[color:var(--muted)]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}

export function VideoFrame({
  caption,
  href,
  poster,
  title
}: {
  caption?: ReactNode
  href: string
  poster: string
  title: string
}) {
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-[24px] border border-[color:var(--line)] bg-[#101312] p-2 shadow-[0_18px_50px_rgba(16,19,18,0.1)]">
      <a
        aria-label={title}
        className="group relative block aspect-video overflow-hidden rounded-[18px] bg-black"
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        <img
          alt=""
          className="h-full w-full object-cover opacity-90 transition duration-200 group-hover:scale-[1.02] group-hover:opacity-100"
          loading="lazy"
          src={poster}
        />
        <span className="absolute inset-0 bg-black/35" />
        <span
          aria-hidden
          className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur"
        >
          <span className="ml-1 h-0 w-0 border-y-[8px] border-l-[13px] border-y-transparent border-l-white" />
        </span>
      </a>
      {caption ? (
        <figcaption className="px-2 pb-1 pt-3 text-xs leading-5 text-white/65">{caption}</figcaption>
      ) : null}
    </figure>
  )
}
