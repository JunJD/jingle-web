import { createOAuthTokenHandler } from "../../_shared"
import { githubProvider } from "../config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const POST = createOAuthTokenHandler(githubProvider)
