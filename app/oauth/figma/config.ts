import { NextRequest } from "next/server"
import {
  createBasicAuthHeader,
  requireOAuthConfig,
  type OAuthProvider,
  type OAuthTokenPayload
} from "../_shared"

const figmaAuthorizeUrl = "https://www.figma.com/oauth"
const figmaTokenUrl = "https://api.figma.com/v1/oauth/token"

interface FigmaTokenResponse {
  access_token?: unknown
  error?: unknown
  error_description?: unknown
  expires_in?: unknown
  refresh_token?: unknown
  scope?: unknown
  token_type?: unknown
}

function getFigmaRedirectUri(request: NextRequest) {
  return (
    process.env.FIGMA_REDIRECT_URI ??
    new URL("/oauth/figma/callback", request.nextUrl.origin).toString()
  )
}

export const figmaProvider: OAuthProvider = {
  buildAuthorizeUrl({ config, request, state }) {
    const scope = request.nextUrl.searchParams.get("scope")
    if (!scope) {
      throw new Error("Missing scope")
    }

    const authorizeUrl = new URL(figmaAuthorizeUrl)
    authorizeUrl.searchParams.set("client_id", config.clientId)
    authorizeUrl.searchParams.set("redirect_uri", getFigmaRedirectUri(request))
    authorizeUrl.searchParams.set("scope", scope)
    authorizeUrl.searchParams.set("state", state)
    authorizeUrl.searchParams.set("response_type", "code")
    return authorizeUrl
  },
  async exchangeCode({ code, config, request }): Promise<OAuthTokenPayload> {
    const body = new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri: getFigmaRedirectUri(request)
    })
    const response = await fetch(figmaTokenUrl, {
      body,
      headers: {
        Accept: "application/json",
        Authorization: createBasicAuthHeader(config),
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST"
    })
    const payload = (await response.json()) as FigmaTokenResponse

    if (!response.ok || typeof payload.access_token !== "string") {
      throw new Error(
        typeof payload.error_description === "string"
          ? payload.error_description
          : typeof payload.error === "string"
            ? payload.error
            : "Figma token exchange failed."
      )
    }

    return {
      access_token: payload.access_token,
      expires_in: typeof payload.expires_in === "number" ? payload.expires_in : undefined,
      refresh_token:
        typeof payload.refresh_token === "string" ? payload.refresh_token : undefined,
      scope: typeof payload.scope === "string" ? payload.scope : undefined,
      token_type: typeof payload.token_type === "string" ? payload.token_type : "bearer"
    }
  },
  provider: "figma",
  requireConfig() {
    return requireOAuthConfig({
      clientIdEnvName: "FIGMA_CLIENT_ID",
      clientSecretEnvName: "FIGMA_CLIENT_SECRET",
      title: "Figma"
    })
  },
  title: "Figma"
}
