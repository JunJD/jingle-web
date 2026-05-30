export function PageHeading({
  eyebrow,
  title,
  children
}: {
  eyebrow: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="page-shell py-16 md:py-20">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[color:var(--green)]">
        {eyebrow}
      </p>
      <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] md:text-6xl">
        {title}
      </h1>
      <div className="mt-6 max-w-3xl text-lg leading-8 text-[color:var(--muted)]">{children}</div>
    </section>
  )
}
