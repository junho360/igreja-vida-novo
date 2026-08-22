import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const ministerios = await prisma.ministerio.findMany({
    orderBy: { nome: 'asc' },
  })
  return NextResponse.json(ministerios)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const ministerio = await prisma.ministerio.create({ data: body })
  return NextResponse.json(ministerio)
}
