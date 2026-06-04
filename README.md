# Jingle Web

Product website for Jingle, the desktop command center for extensions, agents, and local memory.

## Run

```bash
pnpm install
pnpm dev
```

## Desktop Downloads

The homepage uses explicit download links for macOS and Windows so visitors do
not receive the wrong installer from browser user-agent detection. The download
route resolves the latest Jingle GitHub Release and redirects to the matching
release asset.

Environment variables:

- `JINGLE_RELEASE_REPO`: release repository, defaults to `JunJD/Jingle`
- `JINGLE_RELEASE_TOKEN`: GitHub token for private release repositories

Explicit platform links:

- `/api/download?platform=macos`
- `/api/download?platform=windows`
- `/api/download?platform=linux`

## Pages

- `/` product homepage
- `/starter` AI model connection starter
- `/callback` OAuth callback landing page
- `/privacy` privacy policy
- `/docs` developer docs overview
- `/docs/oauth` OAuth architecture notes
- `/docs/extensions` extension publishing notes
