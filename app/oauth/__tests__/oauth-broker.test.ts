import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import test from "node:test"
import { NextRequest } from "next/server"
import { DESKTOP_OAUTH_CONTRACT, type OAuthProviderId } from "../_desktop-protocol"
import { GET as figmaCallback } from "../figma/callback/route"
import { GET as figmaStart } from "../figma/start/route"
import { POST as figmaToken } from "../figma/token/route"
import { GET as githubCallback } from "../github/callback/route"
import { GET as githubStart } from "../github/start/route"
import { POST as githubToken } from "../github/token/route"
import { GET as notionCallback } from "../notion/callback/route"
import { GET as notionStart } from "../notion/start/route"
import { POST as notionToken } from "../notion/token/route"

const originalEnv = {
  FIGMA_CLIENT_ID: process.env.FIGMA_CLIENT_ID,
  FIGMA_CLIENT_SECRET: process.env.FIGMA_CLIENT_SECRET,
  FIGMA_REDIRECT_URI: process.env.FIGMA_REDIRECT_URI,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  GITHUB_REDIRECT_URI: process.env.GITHUB_REDIRECT_URI,
  JINGLE_OAUTH_HANDOFF_SECRET: process.env.JINGLE_OAUTH_HANDOFF_SECRET,
  NOTION_CLIENT_ID: process.env.NOTION_CLIENT_ID,
  NOTION_CLIENT_SECRET: process.env.NOTION_CLIENT_SECRET,
  NOTION_REDIRECT_URI: process.env.NOTION_REDIRECT_URI
}

const desktopClientId = DESKTOP_OAUTH_CONTRACT.clientId
const desktopRedirectUri = DESKTOP_OAUTH_CONTRACT.redirectUri
const codeVerifier = "oauth-test-code-verifier"
const codeChallenge = createHash("sha256").update(codeVerifier).digest("base64url")

function setTestEnv(): void {
  process.env.FIGMA_CLIENT_ID = "figma-client-id"
  process.env.FIGMA_CLIENT_SECRET = "figma-client-secret"
  process.env.FIGMA_REDIRECT_URI = "https://jingle.cool/oauth/figma/callback"
  process.env.GITHUB_CLIENT_ID = "github-client-id"
  process.env.GITHUB_CLIENT_SECRET = "github-client-secret"
  process.env.GITHUB_REDIRECT_URI = "https://jingle.cool/oauth/github/callback"
  process.env.JINGLE_OAUTH_HANDOFF_SECRET = "broker-test-secret"
  process.env.NOTION_CLIENT_ID = "notion-client-id"
  process.env.NOTION_CLIENT_SECRET = "notion-client-secret"
  process.env.NOTION_REDIRECT_URI = "https://jingle.cool/oauth/notion/callback"
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key]
    } else {
      process.env[key] = value
    }
  }
}

function createStartRequest(
  provider: OAuthProviderId,
  overrides: Record<string, string> = {}
): NextRequest {
  const url = new URL(`https://jingle.cool/oauth/${provider}/start`)
  const params = {
    client_id: desktopClientId,
    code_challenge: codeChallenge,
    code_challenge_method: DESKTOP_OAUTH_CONTRACT.codeChallengeMethod,
    connection_id: "default",
    extension_name:
      provider === "figma" ? "figma-files" : provider === "github" ? "github" : "notion",
    provider,
    redirect_uri: desktopRedirectUri,
    response_type: DESKTOP_OAUTH_CONTRACT.responseType,
    state: "state-123",
    ...overrides
  }

  const scope =
    provider === "figma"
      ? "current_user:read projects:read"
      : provider === "github"
        ? "repo read:user notifications"
        : undefined
  if (scope) {
    url.searchParams.set("scope", scope)
  }
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value)
  }

  return new NextRequest(url)
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  return (await response.json()) as Record<string, unknown>
}

function getSetCookie(response: Response): string {
  const setCookie = response.headers.get("set-cookie")
  assert.ok(setCookie)
  return setCookie
}

function getLocation(response: Response): string {
  const location = response.headers.get("location")
  assert.ok(location)
  return location
}

test.after(restoreEnv)

test("desktop OAuth broker contract stays aligned with Openwork", () => {
  assert.deepEqual(DESKTOP_OAUTH_CONTRACT, {
    clientId: "jingle-desktop",
    codeChallengeMethod: "S256",
    redirectUri: "jingle://oauth/callback",
    responseType: "code"
  })
})

test("figma start redirects valid desktop OAuth requests to provider authorization URL", () => {
  setTestEnv()

  const response = figmaStart(createStartRequest("figma"))

  assert.equal(response.status, 307)
  const location = new URL(getLocation(response))
  assert.equal(location.origin, "https://www.figma.com")
  assert.equal(location.pathname, "/oauth")
  assert.equal(location.searchParams.get("client_id"), "figma-client-id")
  assert.equal(
    location.searchParams.get("redirect_uri"),
    "https://jingle.cool/oauth/figma/callback"
  )
  assert.equal(location.searchParams.get("response_type"), "code")
  assert.equal(location.searchParams.get("state"), "state-123")
  assert.equal(location.searchParams.get("scope"), "current_user:read projects:read")
  assert.match(getSetCookie(response), /jingle_figma_oauth_/)
  assert.match(getSetCookie(response), /HttpOnly/)
})

test("figma start rejects unregistered desktop redirect_uri", async () => {
  setTestEnv()

  const response = figmaStart(
    createStartRequest("figma", { redirect_uri: "https://evil.example/cb" })
  )

  assert.equal(response.status, 400)
  const payload = await readJson(response)
  assert.equal(payload.error, "Invalid redirect_uri")
  assert.equal("access_token" in payload, false)
})

test("figma start rejects missing code_challenge", async () => {
  setTestEnv()
  const request = createStartRequest("figma")
  request.nextUrl.searchParams.delete("code_challenge")

  const response = figmaStart(request)

  assert.equal(response.status, 400)
  const payload = await readJson(response)
  assert.equal(payload.error, "Missing code_challenge")
  assert.equal("access_token" in payload, false)
})

test("figma token rejects handoff when code_verifier does not match PKCE challenge", async () => {
  setTestEnv()
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () =>
    new Response(JSON.stringify({ access_token: "figma-access-token", token_type: "bearer" }), {
      headers: {
        "content-type": "application/json"
      },
      status: 200
    })) as typeof fetch

  try {
    const startResponse = figmaStart(createStartRequest("figma"))
    const callbackResponse = await figmaCallback(
      new NextRequest("https://jingle.cool/oauth/figma/callback?state=state-123&code=provider-code", {
        headers: {
          cookie: getSetCookie(startResponse)
        }
      })
    )
    const handoffToken = new URL(getLocation(callbackResponse)).searchParams.get("handoff_token")
    assert.ok(handoffToken)

    const response = await figmaToken(
      new NextRequest("https://jingle.cool/oauth/figma/token", {
        body: JSON.stringify({
          client_id: desktopClientId,
          code: handoffToken,
          code_verifier: "wrong-code-verifier",
          redirect_uri: desktopRedirectUri,
          state: "state-123"
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
    )

    assert.equal(response.status, 400)
    const payload = await readJson(response)
    assert.equal(payload.error, "OAuth code_verifier mismatch")
    assert.equal("access_token" in payload, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("figma token returns access_token when desktop request matches handoff payload", async () => {
  setTestEnv()
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        access_token: "figma-access-token",
        expires_in: 3600,
        scope: "current_user:read projects:read",
        token_type: "bearer"
      }),
      {
        headers: {
          "content-type": "application/json"
        },
        status: 200
      }
    )) as typeof fetch

  try {
    const startResponse = figmaStart(createStartRequest("figma"))
    const callbackResponse = await figmaCallback(
      new NextRequest("https://jingle.cool/oauth/figma/callback?state=state-123&code=provider-code", {
        headers: {
          cookie: getSetCookie(startResponse)
        }
      })
    )
    const handoffToken = new URL(getLocation(callbackResponse)).searchParams.get("handoff_token")
    assert.ok(handoffToken)

    const response = await figmaToken(
      new NextRequest("https://jingle.cool/oauth/figma/token", {
        body: JSON.stringify({
          client_id: desktopClientId,
          code: handoffToken,
          code_verifier: codeVerifier,
          redirect_uri: desktopRedirectUri,
          state: "state-123"
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
    )

    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      access_token: "figma-access-token",
      expires_in: 3600,
      scope: "current_user:read projects:read",
      token_type: "bearer"
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("github start redirects valid desktop OAuth requests to provider authorization URL", () => {
  setTestEnv()

  const response = githubStart(createStartRequest("github"))

  assert.equal(response.status, 307)
  const location = new URL(getLocation(response))
  assert.equal(location.origin, "https://github.com")
  assert.equal(location.pathname, "/login/oauth/authorize")
  assert.equal(location.searchParams.get("client_id"), "github-client-id")
  assert.equal(
    location.searchParams.get("redirect_uri"),
    "https://jingle.cool/oauth/github/callback"
  )
  assert.equal(location.searchParams.get("state"), "state-123")
  assert.equal(location.searchParams.get("scope"), "repo read:user notifications")
  assert.match(getSetCookie(response), /jingle_github_oauth_/)
  assert.match(getSetCookie(response), /HttpOnly/)
})

test("github start rejects missing code_challenge", async () => {
  setTestEnv()
  const request = createStartRequest("github")
  request.nextUrl.searchParams.delete("code_challenge")

  const response = githubStart(request)

  assert.equal(response.status, 400)
  const payload = await readJson(response)
  assert.equal(payload.error, "Missing code_challenge")
  assert.equal("access_token" in payload, false)
})

test("github start rejects unregistered desktop redirect_uri", async () => {
  setTestEnv()

  const response = githubStart(
    createStartRequest("github", { redirect_uri: "https://evil.example/cb" })
  )

  assert.equal(response.status, 400)
  const payload = await readJson(response)
  assert.equal(payload.error, "Invalid redirect_uri")
  assert.equal("access_token" in payload, false)
})

test("github token rejects legacy code-only exchange requests", async () => {
  setTestEnv()

  const response = await githubToken(
    new NextRequest("https://jingle.cool/oauth/github/token", {
      body: JSON.stringify({
        code: "handoff-token"
      }),
      headers: {
        "content-type": "application/json"
      },
      method: "POST"
    })
  )

  assert.equal(response.status, 400)
  const payload = await readJson(response)
  assert.equal(payload.error, "Missing client_id")
  assert.equal("access_token" in payload, false)
})

test("github token rejects handoff when code_verifier does not match PKCE challenge", async () => {
  setTestEnv()
  const originalFetch = globalThis.fetch
  globalThis.fetch = (async () =>
    new Response(
      JSON.stringify({
        access_token: "github-access-token",
        scope: "repo,read:user,notifications",
        token_type: "bearer"
      }),
      {
        headers: {
          "content-type": "application/json"
        },
        status: 200
      }
    )) as typeof fetch

  try {
    const startResponse = githubStart(createStartRequest("github"))
    const callbackResponse = await githubCallback(
      new NextRequest("https://jingle.cool/oauth/github/callback?state=state-123&code=provider-code", {
        headers: {
          cookie: getSetCookie(startResponse)
        }
      })
    )
    const handoffToken = new URL(getLocation(callbackResponse)).searchParams.get("handoff_token")
    assert.ok(handoffToken)

    const response = await githubToken(
      new NextRequest("https://jingle.cool/oauth/github/token", {
        body: JSON.stringify({
          client_id: desktopClientId,
          code: handoffToken,
          code_verifier: "wrong-code-verifier",
          redirect_uri: desktopRedirectUri,
          state: "state-123"
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
    )

    assert.equal(response.status, 400)
    const payload = await readJson(response)
    assert.equal(payload.error, "OAuth code_verifier mismatch")
    assert.equal("access_token" in payload, false)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("github token returns access_token when desktop request matches handoff payload", async () => {
  setTestEnv()
  const originalFetch = globalThis.fetch
  const tokenRequests: Array<{ body: Record<string, unknown>; headers: Headers; url: string }> = []
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    tokenRequests.push({
      body: JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>,
      headers: new Headers(init?.headers),
      url: String(input)
    })
    return new Response(
      JSON.stringify({
        access_token: "github-access-token",
        scope: "repo,read:user,notifications",
        token_type: "bearer"
      }),
      {
        headers: {
          "content-type": "application/json"
        },
        status: 200
      }
    )
  }) as typeof fetch

  try {
    const startResponse = githubStart(createStartRequest("github"))
    const callbackResponse = await githubCallback(
      new NextRequest("https://jingle.cool/oauth/github/callback?state=state-123&code=provider-code", {
        headers: {
          cookie: getSetCookie(startResponse)
        }
      })
    )
    const handoffToken = new URL(getLocation(callbackResponse)).searchParams.get("handoff_token")
    assert.ok(handoffToken)

    const response = await githubToken(
      new NextRequest("https://jingle.cool/oauth/github/token", {
        body: JSON.stringify({
          client_id: desktopClientId,
          code: handoffToken,
          code_verifier: codeVerifier,
          redirect_uri: desktopRedirectUri,
          state: "state-123"
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
    )

    assert.equal(tokenRequests.length, 1)
    assert.equal(tokenRequests[0]?.url, "https://github.com/login/oauth/access_token")
    assert.equal(tokenRequests[0]?.body.client_id, "github-client-id")
    assert.equal(tokenRequests[0]?.body.client_secret, "github-client-secret")
    assert.equal(tokenRequests[0]?.body.code, "provider-code")
    assert.equal(
      tokenRequests[0]?.body.redirect_uri,
      "https://jingle.cool/oauth/github/callback"
    )
    assert.equal(tokenRequests[0]?.headers.get("accept"), "application/json")
    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      access_token: "github-access-token",
      scope: "repo,read:user,notifications",
      token_type: "bearer"
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("notion start redirects without requiring scope", () => {
  setTestEnv()

  const response = notionStart(createStartRequest("notion"))

  assert.equal(response.status, 307)
  const location = new URL(getLocation(response))
  assert.equal(location.origin, "https://api.notion.com")
  assert.equal(location.pathname, "/v1/oauth/authorize")
  assert.equal(location.searchParams.get("client_id"), "notion-client-id")
  assert.equal(
    location.searchParams.get("redirect_uri"),
    "https://jingle.cool/oauth/notion/callback"
  )
  assert.equal(location.searchParams.get("response_type"), DESKTOP_OAUTH_CONTRACT.responseType)
  assert.equal(location.searchParams.get("owner"), "user")
  assert.equal(location.searchParams.get("state"), "state-123")
  assert.equal(location.searchParams.has("scope"), false)
  assert.match(getSetCookie(response), /jingle_notion_oauth_/)
  assert.match(getSetCookie(response), /HttpOnly/)
})

test("notion start rejects unregistered desktop redirect_uri", async () => {
  setTestEnv()

  const response = notionStart(
    createStartRequest("notion", { redirect_uri: "https://evil.example/cb" })
  )

  assert.equal(response.status, 400)
  const payload = await readJson(response)
  assert.equal(payload.error, "Invalid redirect_uri")
  assert.equal("access_token" in payload, false)
})

test("notion start rejects missing code_challenge", async () => {
  setTestEnv()
  const request = createStartRequest("notion")
  request.nextUrl.searchParams.delete("code_challenge")

  const response = notionStart(request)

  assert.equal(response.status, 400)
  const payload = await readJson(response)
  assert.equal(payload.error, "Missing code_challenge")
  assert.equal("access_token" in payload, false)
})

test("notion token returns access_token when desktop request matches handoff payload", async () => {
  setTestEnv()
  const originalFetch = globalThis.fetch
  const tokenRequests: Array<{ body: Record<string, unknown>; headers: Headers; url: string }> = []
  globalThis.fetch = (async (input: URL | RequestInfo, init?: RequestInit) => {
    tokenRequests.push({
      body: JSON.parse(String(init?.body ?? "{}")) as Record<string, unknown>,
      headers: new Headers(init?.headers),
      url: String(input)
    })
    return new Response(
      JSON.stringify({
        access_token: "notion-access-token",
        token_type: "bearer"
      }),
      {
        headers: {
          "content-type": "application/json"
        },
        status: 200
      }
    )
  }) as typeof fetch

  try {
    const startResponse = notionStart(createStartRequest("notion"))
    const callbackResponse = await notionCallback(
      new NextRequest("https://jingle.cool/oauth/notion/callback?state=state-123&code=provider-code", {
        headers: {
          cookie: getSetCookie(startResponse)
        }
      })
    )
    const handoffToken = new URL(getLocation(callbackResponse)).searchParams.get("handoff_token")
    assert.ok(handoffToken)

    const response = await notionToken(
      new NextRequest("https://jingle.cool/oauth/notion/token", {
        body: JSON.stringify({
          client_id: desktopClientId,
          code: handoffToken,
          code_verifier: codeVerifier,
          redirect_uri: desktopRedirectUri,
          state: "state-123"
        }),
        headers: {
          "content-type": "application/json"
        },
        method: "POST"
      })
    )

    assert.equal(tokenRequests.length, 1)
    assert.equal(tokenRequests[0]?.url, "https://api.notion.com/v1/oauth/token")
    assert.equal(tokenRequests[0]?.body.code, "provider-code")
    assert.equal(tokenRequests[0]?.body.grant_type, "authorization_code")
    assert.equal(
      tokenRequests[0]?.body.redirect_uri,
      "https://jingle.cool/oauth/notion/callback"
    )
    assert.equal(
      tokenRequests[0]?.headers.get("authorization"),
      "Basic bm90aW9uLWNsaWVudC1pZDpub3Rpb24tY2xpZW50LXNlY3JldA=="
    )
    assert.equal(response.status, 200)
    assert.deepEqual(await readJson(response), {
      access_token: "notion-access-token",
      token_type: "bearer"
    })
  } finally {
    globalThis.fetch = originalFetch
  }
})
