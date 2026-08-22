import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.configuracao.findMany({
    orderBy: { chave: 'asc' },
  })
  return NextResponse.json(items)
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const items = await Promise.all(
    body.map((item: { chave: string; valor: string }) =>
      prisma.configuracao.upsert({
        where: { chave: item.chave },
        update: { valor: item.valor },
        create: { chave: item.chave, valor: item.valor },
      })
    )
  )
  return NextResponse.json(items)
}
