import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const info: Record<string, string> = {}

  info.nodeEnv = process.env.NODE_ENV || 'NOT SET'
  info.connectingTo =
    process.env.NODE_ENV === 'production' ? 'TURSO' : 'LOCAL SQLite'

  try {
    const { prisma } = await import('@/lib/prisma')
    const result = await prisma.configuracao.findMany()
    info.configCount = String(result.length)
    info.dbConnection = 'OK'
  } catch {
    info.dbConnection = 'FAILED'
  }

  return NextResponse.json(info)
}
