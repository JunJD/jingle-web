import { NextRequest, NextResponse } from "next/server"
import {
  createGitHubHandoffToken,
  getDesktopRedirectCookieName,
  getGitHubRedirectUri,
  githubTokenUrl,
  readDesktopReturnState,
  requireGitHubOAuthConfig
} from "../config"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

function getDesktopReturnState(request: NextRequest, state: string | null) {
  if (!state) {
    return readDesktopReturnState(undefined)
  }

  const storedRedirect = request.cookies.get(getDesktopRedirectCookieName(state))?.value
  return readDesktopReturnState(storedRedirect)
}

interface GitHubTokenResponse {
  access_token?: unknown
  error?: unknown
  error_description?: unknown
  scope?: unknown
  token_type?: unknown
}

function applyCallbackError(callbackUrl: URL, error: string, description: string) {
  callbackUrl.searchParams.set("error", error)
  callbackUrl.searchParams.set("error_description", description)
}

export async function GET(request: NextRequest) {
  const state = request.nextUrl.searchParams.get("state")
  const desktopReturnState = getDesktopReturnState(request, state)
  const desktopCallbackUrl = new URL(desktopReturnState.redirect_uri)

  for (const name of ["state"]) {
    const value = request.nextUrl.searchParams.get(name)
    if (value) {
      desktopCallbackUrl.searchParams.set(name, value)
    }
  }

  desktopCallbackUrl.searchParams.set("provider", "github")
  if (desktopReturnState.extension_name) {
    desktopCallbackUrl.searchParams.set("extension_name", desktopReturnState.extension_name)
  }
  if (desktopReturnState.connection_id) {
    desktopCallbackUrl.searchParams.set("connection_id", desktopReturnState.connection_id)
  }
  const providerError = request.nextUrl.searchParams.get("error")
  const code = request.nextUrl.searchParams.get("code")

  if (providerError) {
    applyCallbackError(
      desktopCallbackUrl,
      providerError,
      request.nextUrl.searchParams.get("error_description") ?? providerError
    )
  } else if (!code) {
    applyCallbackError(desktopCallbackUrl, "missing_code", "GitHub did not return an OAuth code.")
  } else {
    try {
      const config = requireGitHubOAuthConfig()
      const tokenResponse = await fetch(githubTokenUrl, {
        body: JSON.stringify({
          client_id: config.clientId,
          client_secret: config.clientSecret,
          code,
          redirect_uri: getGitHubRedirectUri(request)
        }),
        headers: {
          Accept: "application/json",
          "content-type": "application/json"
        },
        method: "POST"
      })
      const payload = (await tokenResponse.json()) as GitHubTokenResponse

      if (!tokenResponse.ok || typeof payload.access_token !== "string") {
        applyCallbackError(
          desktopCallbackUrl,
          typeof payload.error === "string" ? payload.error : "github_token_exchange_failed",
          typeof payload.error_description === "string"
            ? payload.error_description
            : "GitHub token exchange failed."
        )
      } else {
        desktopCallbackUrl.searchParams.set(
          "handoff_token",
          createGitHubHandoffToken({
            access_token: payload.access_token,
            scope: typeof payload.scope === "string" ? payload.scope : undefined,
            token_type: typeof payload.token_type === "string" ? payload.token_type : "bearer"
          })
        )
      }
    } catch (error) {
      applyCallbackError(
        desktopCallbackUrl,
        "github_token_exchange_failed",
        error instanceof Error ? error.message : "GitHub token exchange failed."
      )
    }
  }

  const response = NextResponse.redirect(desktopCallbackUrl)
  if (state) {
    response.cookies.delete(getDesktopRedirectCookieName(state))
  }
  return response
}
