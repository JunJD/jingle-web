import { createOAuthTokenHandler } from "../../_shared"
import { notionProvider } from "../config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const POST = createOAuthTokenHandler(notionProvider)
