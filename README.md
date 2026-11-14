# Nick Kim’s portfolio

```sh
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). About and experience live at `/about`, coding projects at `/work`, hobbies at `/misc`, and the contact form at `/contact`. The main copy and links are in `lib/data.ts`.

The About layout takes inspiration from [Ruby Lu](https://www.rubylu.dev/about). The typography is Geist, as used on [Martin Sit’s portfolio](https://martinsit.ca/).

For live integrations, set `HEVY_API_KEY` and `RESEND_API_KEY` in a local `.env.local` file or in your hosting environment. The site and the direct contact links still work without those keys.


### Spotify thought bubble

For a quick local test, set `spotify_key` in `.env.local` to a Spotify user access token with the `user-read-recently-played` scope. That access token expires after about an hour. A Spotify app Client ID or Client Secret alone cannot read listening history.

For ongoing access:

1. Add `http://127.0.0.1:3899/spotify/callback` as a Redirect URI in your [Spotify app dashboard](https://developer.spotify.com/dashboard).
2. Set `SPOTIFY_CLIENT_ID` to that app's Client ID in `.env.local`. Run `npm run spotify:connect` and open the authorization URL it prints.
3. Approve access to your recently played tracks. The script saves `SPOTIFY_REFRESH_TOKEN` in `.env.local`. Restart the site to load it.
4. To enable the bubble on Vercel, add `SPOTIFY_CLIENT_ID` and `SPOTIFY_REFRESH_TOKEN` to the relevant environment and redeploy. The script uses PKCE, so its tokens do not require a Client Secret. If Spotify revokes or expires the refresh token, run the connection command again and update the deployment variable.

The site's public bubble displays only the most recently played track and links to Spotify. The Spotify credentials are read by the server.
