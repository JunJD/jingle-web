import { redirect } from "next/navigation"

export default async function ConnectionsDocsRedirectPage({
  params
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  redirect(`/${locale}/developers/connections`)
}
