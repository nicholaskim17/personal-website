import { getRecentTrack } from '@/lib/spotify'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const track = await getRecentTrack()
    return Response.json({ track }, {
      headers: { 'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120' },
    })
  } catch {
    return Response.json({ track: null }, { status: 502 })
  }
}
