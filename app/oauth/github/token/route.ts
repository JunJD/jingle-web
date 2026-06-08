import { NextRequest, NextResponse } from "next/server"
import { oauthError, readGitHubHandoffToken } from "../config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

interface TokenRequestBody {
  code?: unknown
}

function isTokenRequestBody(value: unknown): value is TokenRequestBody {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

export async function POST(request: NextRequest) {
  const body: unknown = await request.json()
  if (!isTokenRequestBody(body) || typeof body.code !== "string") {
    return oauthError("Missing code")
  }

  let payload: ReturnType<typeof readGitHubHandoffToken>
  try {
    payload = readGitHubHandoffToken(body.code)
  } catch (error) {
    return oauthError(
      error instanceof Error ? error.message : "Invalid GitHub OAuth handoff token",
      400
    )
  }

  return NextResponse.json({
    access_token: payload.access_token,
    scope: typeof payload.scope === "string" ? payload.scope : undefined,
    token_type: typeof payload.token_type === "string" ? payload.token_type : "bearer"
  })
}
