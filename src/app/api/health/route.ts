import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const info: Record<string, string> = {}

  info.nodeEnv = process.env.NODE_ENV || 'NOT SET'
  info.tursoUrl = process.env.TURSO_DATABASE_URL || 'NOT SET'
  info.tursoToken = process.env.TURSO_AUTH_TOKEN
    ? 'SET (len=' + process.env.TURSO_AUTH_TOKEN.length + ')'
    : 'NOT SET'
  info.databaseUrl = process.env.DATABASE_URL || 'NOT SET'

  const isProduction = process.env.NODE_ENV === 'production'
  info.connectingTo = isProduction ? 'TURSO' : 'LOCAL SQLite'

  try {
    const { prisma } = await import('@/lib/prisma')
    const result = await prisma.configuracao.findMany()
    info.configCount = String(result.length)
    info.configs = JSON.stringify(
      Object.fromEntries(result.map((c) => [c.chave, c.valor]))
    )
    info.dbConnection = 'OK'
  } catch (e) {
    info.dbConnection = 'FAILED'
    info.dbError = e instanceof Error ? e.message : String(e)
  }

  return NextResponse.json(info)
}
