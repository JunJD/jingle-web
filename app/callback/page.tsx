import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, CheckCircle2, CircleAlert, Home } from "lucide-react"
import { PageHeading } from "@/components/page-heading"

export const metadata: Metadata = {
  title: "Connection Callback"
}

export default function CallbackPage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <main>
      <PageHeading eyebrow="Account connection" title="Finish connecting your account.">
        This page is used when an external service returns to Jingle after sign-in.
        If Jingle is open, the desktop app will finish the connection there.
      </PageHeading>
      <CallbackInspector searchParams={searchParams} />
    </main>
  )
}

async function CallbackInspector({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = (await searchParams) ?? {}
  const code = readParam(params.code)
  const error = readParam(params.error)
  const isReady = Boolean(code) && !error

  return (
    <section className="page-shell pb-20">
      <article className="mx-auto max-w-2xl rounded-md border border-[color:var(--line)] bg-[var(--panel)] p-6 text-center shadow-sm">
        {error ? (
          <CircleAlert className="mx-auto h-8 w-8 text-[color:var(--red)]" aria-hidden="true" />
        ) : (
          <CheckCircle2 className="mx-auto h-8 w-8 text-[color:var(--green)]" aria-hidden="true" />
        )}
        <h2 className="mt-5 text-2xl font-semibold">
          {error ? "Connection needs attention" : isReady ? "Connection response received" : "Waiting for a connection response"}
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[color:var(--muted)]">
          {error
            ? "Return to Jingle and try connecting again. If the problem continues, check the connection guide."
            : "You can return to the desktop app. Jingle will complete the connection and take you back to the command that asked for access."}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="focus-ring dark-button inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium"
          >
            Back to Jingle
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/docs/connections"
            className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-[color:var(--line)] px-4 text-sm font-medium"
          >
            Connection guide
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </article>
    </section>
  )
}

function readParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) {
    return value[0]
  }
  return value
}
