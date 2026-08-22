import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const info: Record<string, string> = {}

  info.tursoUrl = process.env.TURSO_DATABASE_URL || 'NOT SET'
  info.tursoToken = process.env.TURSO_AUTH_TOKEN
    ? 'SET (len=' + process.env.TURSO_AUTH_TOKEN.length + ')'
    : 'NOT SET'

  try {
    const { createClient } = await import('@libsql/client')
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    })
    const result = await client.execute('SELECT 1 as test')
    info.dbConnection = 'OK'
    info.dbResult = JSON.stringify(result.rows)
  } catch (e) {
    info.dbConnection = 'FAILED'
    info.dbError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(info)
}
