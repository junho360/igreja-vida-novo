import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.destaqueHome.findMany({
    orderBy: { ordem: 'asc' },
  })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const item = await prisma.destaqueHome.create({
    data: {
      titulo: body.titulo,
      subtitulo: body.subtitulo,
      horario: body.horario,
      local: body.local,
      icone: body.icone,
      ordem: Number(body.ordem) || 0,
      ativo: body.ativo === true || body.ativo === 'true',
    },
  })
  return NextResponse.json(item)
}
