import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.celula.findMany({ orderBy: { ordem: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const item = await prisma.celula.create({
    data: {
      nome: body.nome,
      descricao: body.descricao,
      lider: body.lider,
      horario: body.horario,
      local: body.local,
      telefone: body.telefone,
      ordem: Number(body.ordem) || 0,
      ativo: body.ativo === true || body.ativo === 'true',
    },
  })
  return NextResponse.json(item)
}
