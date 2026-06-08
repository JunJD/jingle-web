import { NextRequest } from "next/server"
import {
  createBasicAuthHeader,
  requireOAuthConfig,
  type OAuthProvider,
  type OAuthTokenPayload
} from "../_shared"

const notionAuthorizeUrl = "https://api.notion.com/v1/oauth/authorize"
const notionTokenUrl = "https://api.notion.com/v1/oauth/token"

interface NotionTokenResponse {
  access_token?: unknown
  error?: unknown
  error_description?: unknown
  refresh_token?: unknown
  token_type?: unknown
}

function getNotionRedirectUri(request: NextRequest) {
  return (
    process.env.NOTION_REDIRECT_URI ??
    new URL("/oauth/notion/callback", request.nextUrl.origin).toString()
  )
}

export const notionProvider: OAuthProvider = {
  buildAuthorizeUrl({ config, request, state }) {
    const authorizeUrl = new URL(notionAuthorizeUrl)
    authorizeUrl.searchParams.set("client_id", config.clientId)
    authorizeUrl.searchParams.set("redirect_uri", getNotionRedirectUri(request))
    authorizeUrl.searchParams.set("response_type", "code")
    authorizeUrl.searchParams.set("owner", "user")
    authorizeUrl.searchParams.set("state", state)
    return authorizeUrl
  },
  async exchangeCode({ code, config, request }): Promise<OAuthTokenPayload> {
    const response = await fetch(notionTokenUrl, {
      body: JSON.stringify({
        code,
        grant_type: "authorization_code",
        redirect_uri: getNotionRedirectUri(request)
      }),
      headers: {
        Accept: "application/json",
        Authorization: createBasicAuthHeader(config),
        "Content-Type": "application/json"
      },
      method: "POST"
    })
    const payload = (await response.json()) as NotionTokenResponse

    if (!response.ok || typeof payload.access_token !== "string") {
      throw new Error(
        typeof payload.error_description === "string"
          ? payload.error_description
          : typeof payload.error === "string"
            ? payload.error
            : "Notion token exchange failed."
      )
    }

    return {
      access_token: payload.access_token,
      refresh_token:
        typeof payload.refresh_token === "string" ? payload.refresh_token : undefined,
      token_type: typeof payload.token_type === "string" ? payload.token_type : "bearer"
    }
  },
  provider: "notion",
  requireConfig() {
    return requireOAuthConfig({
      clientIdEnvName: "NOTION_CLIENT_ID",
      clientSecretEnvName: "NOTION_CLIENT_SECRET",
      title: "Notion"
    })
  },
  title: "Notion"
}
