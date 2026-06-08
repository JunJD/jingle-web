import { NextRequest, NextResponse } from "next/server"
import {
  createDesktopReturnState,
  getDesktopRedirectCookieName,
  getGitHubRedirectUri,
  githubAuthorizeUrl,
  oauthError,
  requireGitHubOAuthConfig
} from "../config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export function GET(request: NextRequest) {
  let config: ReturnType<typeof requireGitHubOAuthConfig>
  try {
    config = requireGitHubOAuthConfig()
  } catch (error) {
    return oauthError(error instanceof Error ? error.message : "GitHub OAuth is not configured", 500)
  }

  const state = request.nextUrl.searchParams.get("state")
  const scope = request.nextUrl.searchParams.get("scope")
  if (!state) {
    return oauthError("Missing state")
  }
  if (!scope) {
    return oauthError("Missing scope")
  }

  const authorizeUrl = new URL(githubAuthorizeUrl)
  authorizeUrl.searchParams.set("client_id", config.clientId)
  authorizeUrl.searchParams.set("redirect_uri", getGitHubRedirectUri(request))
  authorizeUrl.searchParams.set("scope", scope)
  authorizeUrl.searchParams.set("state", state)

  const response = NextResponse.redirect(authorizeUrl)
  response.cookies.set({
    httpOnly: true,
    maxAge: 600,
    name: getDesktopRedirectCookieName(state),
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    value: createDesktopReturnState({
      connectionId: request.nextUrl.searchParams.get("connection_id"),
      extensionName: request.nextUrl.searchParams.get("extension_name"),
      redirectUri: request.nextUrl.searchParams.get("redirect_uri") ?? "jingle://oauth/callback"
    })
  })
  return response
}
