import { NextRequest } from "next/server"
import { requireOAuthConfig, type OAuthProvider, type OAuthTokenPayload } from "../_shared"

const githubAuthorizeUrl = "https://github.com/login/oauth/authorize"
const githubTokenUrl = "https://github.com/login/oauth/access_token"

interface GitHubTokenResponse {
  access_token?: unknown
  error?: unknown
  error_description?: unknown
  scope?: unknown
  token_type?: unknown
}

function getGitHubRedirectUri(request: NextRequest) {
  return (
    process.env.GITHUB_REDIRECT_URI ??
    new URL("/oauth/github/callback", request.nextUrl.origin).toString()
  )
}

export const githubProvider: OAuthProvider = {
  buildAuthorizeUrl({ config, request, state }) {
    const scope = request.nextUrl.searchParams.get("scope")
    if (!scope) {
      throw new Error("Missing scope")
    }

    const authorizeUrl = new URL(githubAuthorizeUrl)
    authorizeUrl.searchParams.set("client_id", config.clientId)
    authorizeUrl.searchParams.set("redirect_uri", getGitHubRedirectUri(request))
    authorizeUrl.searchParams.set("scope", scope)
    authorizeUrl.searchParams.set("state", state)
    return authorizeUrl
  },
  async exchangeCode({ code, config, request }): Promise<OAuthTokenPayload> {
    const response = await fetch(githubTokenUrl, {
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
    const payload = (await response.json()) as GitHubTokenResponse

    if (!response.ok || typeof payload.access_token !== "string") {
      throw new Error(
        typeof payload.error_description === "string"
          ? payload.error_description
          : typeof payload.error === "string"
            ? payload.error
            : "GitHub token exchange failed."
      )
    }

    return {
      access_token: payload.access_token,
      scope: typeof payload.scope === "string" ? payload.scope : undefined,
      token_type: typeof payload.token_type === "string" ? payload.token_type : "bearer"
    }
  },
  provider: "github",
  requireConfig() {
    return requireOAuthConfig({
      clientIdEnvName: "GITHUB_CLIENT_ID",
      clientSecretEnvName: "GITHUB_CLIENT_SECRET",
      title: "GitHub"
    })
  },
  title: "GitHub"
}
