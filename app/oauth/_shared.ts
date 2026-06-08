import { NextRequest, NextResponse } from "next/server"
import {
  createHandoffToken,
  getDesktopRedirectCookieName,
  parseDesktopReturnState,
  parseDesktopStartRequest,
  parseDesktopTokenRequestBody,
  readHandoffToken,
  serializeDesktopReturnState,
  verifyDesktopTokenRequest,
  type DesktopOAuthReturnState,
  type HandoffPayload,
  type OAuthProviderId,
  type OAuthTokenPayload
} from "./_desktop-protocol"

export interface OAuthConfig {
  clientId: string
  clientSecret: string
}

export type { OAuthProviderId, OAuthTokenPayload }

export interface OAuthProvider {
  buildAuthorizeUrl(params: {
    config: OAuthConfig
    request: NextRequest
    state: string
  }): URL
  exchangeCode(params: {
    code: string
    config: OAuthConfig
    request: NextRequest
  }): Promise<OAuthTokenPayload>
  provider: OAuthProviderId
  requireConfig(): OAuthConfig
  title: string
}

export function oauthError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function createBasicAuthHeader(config: OAuthConfig) {
  return `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`
}

export function requireOAuthConfig(params: {
  clientIdEnvName: string
  clientSecretEnvName: string
  title: string
}): OAuthConfig {
  const clientId = process.env[params.clientIdEnvName]
  const clientSecret = process.env[params.clientSecretEnvName]

  if (!clientId || !clientSecret) {
    throw new Error(`${params.title} OAuth is not configured`)
  }

  return { clientId, clientSecret }
}

function readDesktopStateFromRequest(
  request: NextRequest,
  provider: OAuthProviderId,
  state: string | null
) {
  if (!state) {
    throw new Error("Missing state")
  }

  const storedRedirect = request.cookies.get(getDesktopRedirectCookieName(provider, state))?.value
  if (!storedRedirect) {
    throw new Error("Missing OAuth return state")
  }

  return parseDesktopReturnState(storedRedirect)
}

function applyCallbackError(callbackUrl: URL, error: string, description: string) {
  callbackUrl.searchParams.set("error", error)
  callbackUrl.searchParams.set("error_description", description)
}

export function createOAuthStartHandler(provider: OAuthProvider) {
  return function GET(request: NextRequest) {
    let config: OAuthConfig
    try {
      config = provider.requireConfig()
    } catch (error) {
      return oauthError(
        error instanceof Error ? error.message : `${provider.title} OAuth is not configured`,
        500
      )
    }

    let desktopReturnState: DesktopOAuthReturnState
    try {
      desktopReturnState = parseDesktopStartRequest(request.nextUrl.searchParams)
    } catch (error) {
      return oauthError(error instanceof Error ? error.message : "Invalid OAuth request")
    }

    let authorizeUrl: URL
    try {
      authorizeUrl = provider.buildAuthorizeUrl({ config, request, state: desktopReturnState.state })
    } catch (error) {
      return oauthError(error instanceof Error ? error.message : "Invalid OAuth request")
    }

    const response = NextResponse.redirect(authorizeUrl)
    response.cookies.set({
      httpOnly: true,
      maxAge: 600,
      name: getDesktopRedirectCookieName(provider.provider, desktopReturnState.state),
      sameSite: "lax",
      secure: request.nextUrl.protocol === "https:",
      value: serializeDesktopReturnState(desktopReturnState)
    })
    return response
  }
}

export function createOAuthCallbackHandler(provider: OAuthProvider) {
  return async function GET(request: NextRequest) {
    const state = request.nextUrl.searchParams.get("state")
    let desktopReturnState: DesktopOAuthReturnState
    try {
      desktopReturnState = readDesktopStateFromRequest(request, provider.provider, state)
    } catch (error) {
      return oauthError(error instanceof Error ? error.message : "Invalid OAuth callback")
    }
    if (desktopReturnState.state !== state) {
      return oauthError("OAuth state mismatch")
    }

    const desktopCallbackUrl = new URL(desktopReturnState.redirect_uri)

    if (state) {
      desktopCallbackUrl.searchParams.set("state", state)
    }

    desktopCallbackUrl.searchParams.set("provider", provider.provider)
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
      applyCallbackError(
        desktopCallbackUrl,
        "missing_code",
        `${provider.title} did not return an OAuth code.`
      )
    } else {
      try {
        const config = provider.requireConfig()
        const tokenPayload = await provider.exchangeCode({ code, config, request })
        desktopCallbackUrl.searchParams.set(
          "handoff_token",
          createHandoffToken({
            clientSecret: config.clientSecret,
            desktopReturnState,
            payload: tokenPayload,
            provider: provider.provider
          })
        )
      } catch (error) {
        applyCallbackError(
          desktopCallbackUrl,
          `${provider.provider}_token_exchange_failed`,
          error instanceof Error ? error.message : `${provider.title} token exchange failed.`
        )
      }
    }

    const response = NextResponse.redirect(desktopCallbackUrl)
    if (state) {
      response.cookies.delete(getDesktopRedirectCookieName(provider.provider, state))
    }
    return response
  }
}

export function createOAuthTokenHandler(provider: OAuthProvider) {
  return async function POST(request: NextRequest) {
    let body: ReturnType<typeof parseDesktopTokenRequestBody>
    try {
      body = parseDesktopTokenRequestBody(await request.json())
    } catch (error) {
      return oauthError(error instanceof Error ? error.message : "Invalid OAuth token request")
    }

    let config: OAuthConfig
    try {
      config = provider.requireConfig()
    } catch (error) {
      return oauthError(
        error instanceof Error ? error.message : `${provider.title} OAuth is not configured`,
        500
      )
    }

    let payload: HandoffPayload
    try {
      payload = readHandoffToken({
        clientSecret: config.clientSecret,
        provider: provider.provider,
        token: body.code
      })
    } catch (error) {
      return oauthError(
        error instanceof Error
          ? error.message
          : `Invalid ${provider.title} OAuth handoff token`,
        400
      )
    }

    try {
      verifyDesktopTokenRequest({ payload, requestBody: body })
    } catch (error) {
      return oauthError(error instanceof Error ? error.message : "Invalid OAuth token request")
    }

    return NextResponse.json({
      access_token: payload.access_token,
      expires_in: payload.expires_in,
      scope: payload.scope,
      token_type: payload.token_type
    })
  }
}
