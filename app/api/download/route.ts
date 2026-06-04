import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type DownloadPlatform = "macos" | "windows" | "linux"

interface GitHubReleaseAsset {
  browser_download_url: string
  content_type: string
  name: string
  size: number
  url: string
}

interface GitHubRelease {
  assets: GitHubReleaseAsset[]
  html_url: string
  tag_name: string
}

const defaultReleaseRepo = "JunJD/Jingle"

const platformExtensions: Record<DownloadPlatform, string[]> = {
  macos: [".dmg"],
  windows: [".exe"],
  linux: [".AppImage"]
}

const platformNameHints: Record<DownloadPlatform, string[]> = {
  macos: ["mac", "macos", "darwin"],
  windows: ["win", "windows"],
  linux: ["linux"]
}

function getRequestedPlatform(request: NextRequest): DownloadPlatform {
  const platform = request.nextUrl.searchParams.get("platform")?.toLowerCase()

  if (platform === "mac" || platform === "darwin" || platform === "macos") {
    return "macos"
  }

  if (
    platform === "windows" ||
    platform === "window" ||
    platform === "win" ||
    platform === "win32"
  ) {
    return "windows"
  }

  if (platform === "linux") {
    return "linux"
  }

  const userAgent = request.headers.get("user-agent")?.toLowerCase() ?? ""

  if (userAgent.includes("windows")) {
    return "windows"
  }

  if (userAgent.includes("linux")) {
    return "linux"
  }

  return "macos"
}

function getGitHubHeaders(token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28"
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

function selectReleaseAsset(release: GitHubRelease, platform: DownloadPlatform) {
  const extensions = platformExtensions[platform]
  const nameHints = platformNameHints[platform]

  return release.assets.find((asset) => {
    const name = asset.name.toLowerCase()
    return (
      extensions.some((extension) => name.endsWith(extension.toLowerCase())) &&
      nameHints.some((hint) => name.includes(hint))
    )
  })
}

function releaseError(message: string, status = 502) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request: NextRequest) {
  const releaseRepo = process.env.JINGLE_RELEASE_REPO ?? defaultReleaseRepo
  const releaseToken = process.env.JINGLE_RELEASE_TOKEN
  const platform = getRequestedPlatform(request)
  const releaseResponse = await fetch(
    `https://api.github.com/repos/${releaseRepo}/releases/latest`,
    {
      headers: getGitHubHeaders(releaseToken),
      next: { revalidate: 300 }
    }
  )

  if (releaseResponse.status === 404) {
    return releaseError("No Jingle release is available yet.", 404)
  }

  if (!releaseResponse.ok) {
    return releaseError("Unable to load the latest Jingle release.")
  }

  const release = (await releaseResponse.json()) as GitHubRelease
  const asset = selectReleaseAsset(release, platform)

  if (!asset) {
    return NextResponse.redirect(release.html_url)
  }

  if (!releaseToken) {
    return NextResponse.redirect(asset.browser_download_url)
  }

  const assetResponse = await fetch(asset.url, {
    headers: {
      ...getGitHubHeaders(releaseToken),
      Accept: "application/octet-stream"
    },
    redirect: "manual"
  })

  const downloadLocation = assetResponse.headers.get("location")

  if (downloadLocation) {
    return NextResponse.redirect(downloadLocation)
  }

  if (!assetResponse.ok || !assetResponse.body) {
    return releaseError("Unable to download the selected Jingle release asset.")
  }

  return new Response(assetResponse.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${asset.name}"`,
      "Content-Length": String(asset.size),
      "Content-Type": asset.content_type || "application/octet-stream"
    }
  })
}
