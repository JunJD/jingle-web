import { createOAuthTokenHandler } from "../../_shared"
import { figmaProvider } from "../config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export const POST = createOAuthTokenHandler(figmaProvider)
