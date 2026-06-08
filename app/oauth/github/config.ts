import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto"
import { NextRequest, NextResponse } from "next/server"

export const githubAuthorizeUrl = "https://github.com/login/oauth/authorize"
export const githubTokenUrl = "https://github.com/login/oauth/access_token"

export function oauthError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

export function requireGitHubOAuthConfig() {
  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    throw new Error("GitHub OAuth is not configured")
  }

  return { clientId, clientSecret }
}

export function getGitHubRedirectUri(request: NextRequest) {
  return (
    process.env.GITHUB_REDIRECT_URI ??
    new URL("/oauth/github/callback", request.nextUrl.origin).toString()
  )
}

export function getDesktopRedirectCookieName(state: string) {
  return `jingle_github_oauth_${Buffer.from(state).toString("base64url")}`
}

interface DesktopOAuthReturnState {
  connection_id?: string
  extension_name?: string
  redirect_uri: string
}

function isDesktopOAuthReturnState(value: unknown): value is DesktopOAuthReturnState {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    typeof (value as DesktopOAuthReturnState).redirect_uri === "string"
  )
}

export function createDesktopReturnState(params: {
  connectionId: string | null
  extensionName: string | null
  redirectUri: string
}) {
  return Buffer.from(
    JSON.stringify({
      connection_id: params.connectionId ?? undefined,
      extension_name: params.extensionName ?? undefined,
      redirect_uri: params.redirectUri
    } satisfies DesktopOAuthReturnState)
  ).toString("base64url")
}

export function readDesktopReturnState(value: string | undefined): DesktopOAuthReturnState {
  if (!value) {
    return { redirect_uri: "jingle://oauth/callback" }
  }

  const parsed: unknown = JSON.parse(Buffer.from(value, "base64url").toString("utf8"))
  if (!isDesktopOAuthReturnState(parsed)) {
    throw new Error("Invalid desktop OAuth return state")
  }

  return parsed
}

interface GitHubHandoffPayload {
  access_token: string
  exp: number
  provider: "github"
  scope?: string
  token_type: string
}

function getHandoffKey() {
  const secret = process.env.JINGLE_OAUTH_HANDOFF_SECRET ?? process.env.GITHUB_CLIENT_SECRET
  if (!secret) {
    throw new Error("GitHub OAuth handoff is not configured")
  }

  return createHash("sha256").update(secret).digest()
}

export function createGitHubHandoffToken(
  payload: Omit<GitHubHandoffPayload, "exp" | "provider">
) {
  const iv = randomBytes(12)
  const cipher = createCipheriv("aes-256-gcm", getHandoffKey(), iv)
  const plaintext = JSON.stringify({
    ...payload,
    exp: Date.now() + 10 * 60 * 1000,
    provider: "github"
  } satisfies GitHubHandoffPayload)
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()])
  const tag = cipher.getAuthTag()

  return [
    "v1",
    iv.toString("base64url"),
    ciphertext.toString("base64url"),
    tag.toString("base64url")
  ].join(".")
}

export function readGitHubHandoffToken(token: string): GitHubHandoffPayload {
  const [version, iv, ciphertext, tag] = token.split(".")
  if (version !== "v1" || !iv || !ciphertext || !tag) {
    throw new Error("Invalid GitHub OAuth handoff token")
  }

  const decipher = createDecipheriv("aes-256-gcm", getHandoffKey(), Buffer.from(iv, "base64url"))
  decipher.setAuthTag(Buffer.from(tag, "base64url"))
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(ciphertext, "base64url")),
    decipher.final()
  ]).toString("utf8")
  const payload = JSON.parse(plaintext) as GitHubHandoffPayload

  if (payload.provider !== "github" || typeof payload.access_token !== "string") {
    throw new Error("Invalid GitHub OAuth handoff payload")
  }
  if (Date.now() > payload.exp) {
    throw new Error("GitHub OAuth handoff token expired")
  }

  return payload
}
