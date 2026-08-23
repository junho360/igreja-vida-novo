import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.preGacao.findMany({ orderBy: { data: 'desc' } })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const item = await prisma.preGacao.create({
    data: {
      ...body,
      data: body.data ? new Date(body.data) : null,
      publicado: body.publicado === true || body.publicado === 'true',
    },
  })
  return NextResponse.json(item)
}
