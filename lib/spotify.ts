export interface RecentTrack {
  title: string
  artist: string
  url: string
}

interface SpotifyTrack {
  name?: string
  artists?: { name?: string }[]
  external_urls?: { spotify?: string }
}

let access: { token: string; expiresAt: number } | undefined

async function getAccessToken() {
  const key = process.env.spotify_key?.trim() || process.env.SPOTIFY_KEY?.trim()
  const clientId = process.env.SPOTIFY_CLIENT_ID?.trim()
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET?.trim()
  const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN?.trim()

  if (!clientId || !refreshToken) {
    // Dashboard client IDs and secrets are not Spotify user access tokens.
    return key && !/^[a-f0-9]{32}$/i.test(key) ? key : undefined
  }
  if (access && access.expiresAt > Date.now()) return access.token

  const headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
  const body = new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken })

  if (clientSecret) {
    const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    headers.set('Authorization', `Basic ${credentials}`)
  } else {
    body.set('client_id', clientId)
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers,
    body,
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) throw new Error('Spotify token refresh failed.')

  const data = await response.json() as { access_token?: string; expires_in?: number }
  if (!data.access_token || !data.expires_in) throw new Error('Spotify did not return an access token.')
  access = { token: data.access_token, expiresAt: Date.now() + (data.expires_in - 60) * 1000 }
  return access.token
}

let recent: { track: RecentTrack | null; expiresAt: number } | undefined
let pending: Promise<RecentTrack | null> | undefined
let retryAt = 0

async function fetchRecentTrack(): Promise<RecentTrack | null> {
  const token = await getAccessToken()
  if (!token) return null

  const response = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
    signal: AbortSignal.timeout(5000),
  })
  if (!response.ok) {
    if (response.status === 401) access = undefined
    if (response.status === 429) {
      const retryAfter = Number(response.headers.get('Retry-After')) || 60
      retryAt = Date.now() + retryAfter * 1000
    }
    throw new Error('Spotify listening history is unavailable.')
  }

  const { items } = await response.json() as { items?: { track?: SpotifyTrack }[] }
  const track = items?.[0]?.track
  const artist = track?.artists?.map(artist => artist.name).filter(Boolean).join(', ')
  const url = track?.external_urls?.spotify
  if (!track?.name || !artist || !url || !/^https:\/\/open\.spotify\.com\/track\/[a-zA-Z0-9]+(?:\?.*)?$/.test(url)) return null
  return { title: track.name, artist, url }
}

export async function getRecentTrack() {
  const now = Date.now()
  if (recent && recent.expiresAt > now) return recent.track
  if (retryAt > now) throw new Error('Spotify is temporarily unavailable.')

  pending ??= fetchRecentTrack().then(track => {
    recent = { track, expiresAt: Date.now() + 60_000 }
    return track
  }).catch(error => {
    retryAt = Math.max(retryAt, Date.now() + 60_000)
    throw error
  }).finally(() => {
    pending = undefined
  })
  return pending
}
