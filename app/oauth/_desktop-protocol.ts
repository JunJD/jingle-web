import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto"

export type OAuthProviderId = "figma" | "github" | "notion"

export const DESKTOP_OAUTH_CONTRACT = {
  clientId: "jingle-desktop",
  codeChallengeMethod: "S256",
  redirectUri: "jingle://oauth/callback",
  responseType: "code"
} as const

export interface OAuthTokenPayload {
  access_token: string
  expires_in?: number
  refresh_token?: string
  scope?: string
  token_type?: string
}

export interface DesktopOAuthReturnState {
  client_id: string
  code_challenge: string
  code_challenge_method: typeof DESKTOP_OAUTH_CONTRACT.codeChallengeMethod
  connection_id?: string
  extension_name?: string
  redirect_uri: string
  state: string
}

export interface HandoffPayload extends OAuthTokenPayload {
  access_token: string
  client_id: string
  code_challenge: string
  code_challenge_method: typeof DESKTOP_OAUTH_CONTRACT.codeChallengeMethod
  connection_id?: string
  exp: number
  extension_name?: string
  provider: OAuthProviderId
  redirect_uri: string
  state: string
  token_type: string
}

export interface DesktopTokenRequestBody {
  client_id: string
  code: string
  code_verifier: string
  redirect_uri: string
  state: string
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isOAuthProviderId(value: unknown): value is OAuthProviderId {
  return value === "figma" || value === "github" || value === "notion"
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string"
}

function isDesktopOAuthReturnState(value: unknown): value is DesktopOAuthReturnState {
  return (
    isObjectRecord(value) &&
    value.client_id === DESKTOP_OAUTH_CONTRACT.clientId &&
    typeof value.code_challenge === "string" &&
    value.code_challenge.length > 0 &&
    value.code_challenge_method === DESKTOP_OAUTH_CONTRACT.codeChallengeMethod &&
    isOptionalString(value.connection_id) &&
    isOptionalString(value.extension_name) &&
    value.redirect_uri === DESKTOP_OAUTH_CONTRACT.redirectUri &&
    typeof value.state === "string" &&
    value.state.length > 0
  )
}

function isHandoffPayload(value: unknown): value is HandoffPayload {
  return (
    isObjectRecord(value) &&
    typeof value.access_token === "string" &&
    value.client_id === DESKTOP_OAUTH_CONTRACT.clientId &&
    typeof value.code_challenge === "string" &&
    value.code_challenge.length > 0 &&
    value.code_challenge_method === DESKTOP_OAUTH_CONTRACT.codeChallengeMethod &&
    isOptionalString(value.connection_id) &&
    typeof value.exp === "number" &&
    isOptionalString(value.extension_name) &&
    isOAuthProviderId(value.provider) &&
    value.redirect_uri === DESKTOP_OAUTH_CONTRACT.redirectUri &&
    typeof value.state === "string" &&
    value.state.length > 0
  )
}

function requireDesktopQueryParam(searchParams: URLSearchParams, name: string): string {
  const value = searchParams.get(name)
  if (!value) {
    throw new Error(`Missing ${name}`)
  }
  return value
}

function getOptionalDesktopQueryParam(searchParams: URLSearchParams, name: string): string | undefined {
  return searchParams.get(name) || undefined
}

export function parseDesktopStartRequest(searchParams: URLSearchParams): DesktopOAuthReturnState {
  const clientId = requireDesktopQueryParam(searchParams, "client_id")
  if (clientId !== DESKTOP_OAUTH_CONTRACT.clientId) {
    throw new Error("Invalid client_id")
  }

  const redirectUri = requireDesktopQueryParam(searchParams, "redirect_uri")
  if (redirectUri !== DESKTOP_OAUTH_CONTRACT.redirectUri) {
    throw new Error("Invalid redirect_uri")
  }

  const responseType = requireDesktopQueryParam(searchParams, "response_type")
  if (responseType !== DESKTOP_OAUTH_CONTRACT.responseType) {
    throw new Error("Invalid response_type")
  }

  const codeChallengeMethod = requireDesktopQueryParam(searchParams, "code_challenge_method")
  if (codeChallengeMethod !== DESKTOP_OAUTH_CONTRACT.codeChallengeMethod) {
    throw new Error("Invalid code_challenge_method")
  }

  return {
    client_id: clientId,
    code_challenge: requireDesktopQueryParam(searchParams, "code_challenge"),
    code_challenge_method: DESKTOP_OAUTH_CONTRACT.codeChallengeMethod,
    connection_id: getOptionalDesktopQueryParam(searchParams, "connection_id"),
    extension_name: getOptionalDesktopQueryParam(searchParams, "extension_name"),
    redirect_uri: redirectUri,
    state: requireDesktopQueryParam(searchParams, "state")
  }
}

export function getDesktopRedirectCookieName(provider: OAuthProviderId, state: string) {
  return `jingle_${provider}_oauth_${Buffer.from(state).toString("base64url")}`
}

export function serializeDesktopReturnState(state: DesktopOAuthReturnState) {
  return Buffer.from(JSON.stringify(state)).toString("base64url")
}

export function parseDesktopReturnState(value: string): DesktopOAuthReturnState {
  const parsed: unknown = JSON.parse(Buffer.from(value, "base64url").toString("utf8"))
  if (!isDesktopOAuthReturnState(parsed)) {
    throw new Error("Invalid desktop OAuth return state")
  }

  return parsed
}

function getHandoffKey(clientSecret: string) {
  const secret = process.env.JINGLE_OAUTH_HANDOFF_SECRET ?? clientSecret
  if (!secret) {
    throw new Error("OAuth handoff is not configured")
  }

  return createHash("sha256").update(secret).digest()
}

export function createHandoffToken(params: {
  clientSecret: string
  desktopReturnState: DesktopOAuthReturnState
  payload: OAuthTokenPayload
  provider: OAuthProviderId
}) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", getHandoffKey(params.clientSecret), iv)
  const plaintext = JSON.stringify({
    ...params.payload,
    client_id: params.desktopReturnState.client_id,
    code_challenge: params.desktopReturnState.code_challenge,
    code_challenge_method: params.desktopReturnState.code_challenge_method,
    connection_id: params.desktopReturnState.connection_id,
    exp: Date.now() + 10 * 60 * 1000,
    extension_name: params.desktopReturnState.extension_name,
    provider: params.provider,
    redirect_uri: params.desktopReturnState.redirect_uri,
    state: params.desktopReturnState.state,
    token_type: params.payload.token_type ?? "bearer"
  } satisfies HandoffPayload)
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return [
    "v1",
    iv.toString("base64url"),
    ciphertext.toString("base64url"),
    tag.toString("base64url")
  ].join(".")
}

export function readHandoffToken(params: {
  clientSecret: string
  provider: OAuthProviderId
  token: string
}): HandoffPayload {
  const [version, iv, ciphertext, tag] = params.token.split(".")
  if (version !== "v1" || !iv || !ciphertext || !tag) {
    throw new Error(`Invalid ${params.provider} OAuth handoff token`)
  }

  const decipher = createDecipheriv(
    "aes-256-gcm",
    getHandoffKey(params.clientSecret),
    Buffer.from(iv, "base64url")
  )
  decipher.setAuthTag(Buffer.from(tag, "base64url"))
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64url")),
    decipher.final()
  ]).toString("utf8")
  const payload = JSON.parse(plaintext) as unknown

  if (!isHandoffPayload(payload) || payload.provider !== params.provider) {
    throw new Error(`Invalid ${params.provider} OAuth handoff payload`)
  }
  if (Date.now() > payload.exp) {
    throw new Error(`${params.provider} OAuth handoff token expired`)
  }

  return payload
}

export function parseDesktopTokenRequestBody(value: unknown): DesktopTokenRequestBody {
  if (!isObjectRecord(value) || typeof value.code !== "string") {
    throw new Error("Missing code")
  }
  if (typeof value.client_id !== "string") {
    throw new Error("Missing client_id")
  }
  if (typeof value.redirect_uri !== "string") {
    throw new Error("Missing redirect_uri")
  }
  if (typeof value.code_verifier !== "string") {
    throw new Error("Missing code_verifier")
  }
  if (typeof value.state !== "string") {
    throw new Error("Missing state")
  }

  return {
    client_id: value.client_id,
    code: value.code,
    code_verifier: value.code_verifier,
    redirect_uri: value.redirect_uri,
    state: value.state
  }
}

function createPkceChallenge(codeVerifier: string): string {
  return createHash("sha256").update(codeVerifier).digest("base64url")
}

export function verifyDesktopTokenRequest(params: {
  payload: HandoffPayload
  requestBody: DesktopTokenRequestBody
}) {
  if (params.requestBody.client_id !== params.payload.client_id) {
    throw new Error("OAuth client_id mismatch")
  }
  if (params.requestBody.redirect_uri !== params.payload.redirect_uri) {
    throw new Error("OAuth redirect_uri mismatch")
  }
  if (params.requestBody.state !== params.payload.state) {
    throw new Error("OAuth state mismatch")
  }
  if (createPkceChallenge(params.requestBody.code_verifier) !== params.payload.code_challenge) {
    throw new Error("OAuth code_verifier mismatch")
  }
}
