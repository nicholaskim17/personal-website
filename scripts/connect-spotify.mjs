import { createHash, randomBytes } from 'node:crypto'
import { chmod, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { loadEnvFile } from 'node:process'

const callback = new URL('http://127.0.0.1:3899/spotify/callback')
const envFile = '.env.local'

for (const path of [envFile, '.env']) {
  try {
    loadEnvFile(path)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
}

const clientId = process.env.SPOTIFY_CLIENT_ID?.trim()
if (!clientId) {
  console.error('Set SPOTIFY_CLIENT_ID to your Spotify app Client ID in .env.local first.')
  process.exit(1)
}

const state = randomBytes(32).toString('base64url')
const verifier = randomBytes(64).toString('base64url')
const challenge = createHash('sha256').update(verifier).digest('base64url')
const authorize = new URL('https://accounts.spotify.com/authorize')
authorize.search = new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: callback.href,
  scope: 'user-read-recently-played',
  state,
  code_challenge_method: 'S256',
  code_challenge: challenge,
}).toString()

async function saveToken(token) {
  let contents = ''
  try {
    contents = await readFile(envFile, 'utf8')
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }

  const lines = contents.trimEnd().split(/\r?\n/).filter(line =>
    line && !/^\s*(?:export\s+)?SPOTIFY_REFRESH_TOKEN\s*=/.test(line),
  )
  lines.push(`SPOTIFY_REFRESH_TOKEN=${token}`)
  await writeFile(envFile, lines.join('\n').trimEnd() + '\n', { mode: 0o600 })
  await chmod(envFile, 0o600)
}

let completing = false
const server = createServer(async (request, response) => {
  const url = new URL(request.url, callback)
  response.setHeader('Content-Type', 'text/plain; charset=utf-8')
  response.setHeader('Cache-Control', 'no-store')

  if (url.pathname !== callback.pathname || request.method !== 'GET') {
    response.writeHead(404).end('Not found.')
    return
  }

  if (url.searchParams.get('state') !== state || completing) {
    response.writeHead(400).end('This Spotify sign-in request is invalid or already used.')
    return
  }

  const code = url.searchParams.get('code')
  if (!code) {
    response.writeHead(400).end('Spotify authorization was declined. Run the setup again when ready.')
    stop(1)
    return
  }

  completing = true
  try {
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        client_id: clientId,
        redirect_uri: callback.href,
        code_verifier: verifier,
      }),
      signal: AbortSignal.timeout(10_000),
    })
    const token = tokenResponse.ok ? (await tokenResponse.json()).refresh_token : undefined
    if (typeof token !== 'string' || !/^[A-Za-z0-9._~+\/-]+=*$/.test(token)) {
      throw new Error('Spotify did not issue a refresh token.')
    }
    await saveToken(token)
    response.end('Spotify connected. Restart the local website to see your last played song.')
    console.log('Spotify connected. Wrote SPOTIFY_REFRESH_TOKEN to .env.local.')
    stop(0)
  } catch {
    response.writeHead(500).end('Spotify setup failed. Check your app settings and try again.')
    stop(1)
  }
})

const timeout = setTimeout(() => {
  console.error('Spotify setup timed out. Run it again when you are ready to authorize.')
  stop(1)
}, 5 * 60_000)

function stop(exitCode) {
  clearTimeout(timeout)
  process.exitCode = exitCode
  server.close()
}

server.on('error', () => {
  clearTimeout(timeout)
  process.exitCode = 1
  console.error('Could not start the Spotify callback. Make sure port 3899 is available.')
})

server.listen(Number(callback.port), callback.hostname, () => {
  console.log(`Register ${callback.href} as a Redirect URI in your Spotify app settings.`)
  console.log('Then open this URL and authorize access to your recently played tracks.')
  console.log(authorize.href)
})
