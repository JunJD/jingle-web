import { loader } from "fumadocs-core/source"
import { developers } from "@/.source/server"
import { docsI18n } from "@/i18n/docs"

export const source = loader({
  baseUrl: "/developers",
  i18n: docsI18n,
  source: developers.toFumadocsSource()
})
