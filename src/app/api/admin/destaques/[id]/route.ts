import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const item = await prisma.destaqueHome.findUnique({ where: { id } })
  if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(item)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const item = await prisma.destaqueHome.update({
    where: { id },
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

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.destaqueHome.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
