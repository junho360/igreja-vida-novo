import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const eventos = await prisma.evento.findMany({
    orderBy: { data: 'asc' },
    include: { ministerio: true },
  })
  return NextResponse.json(eventos)
}

export async function POST(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const evento = await prisma.evento.create({
    data: {
      titulo: body.titulo,
      descricao: body.descricao,
      data: new Date(body.data),
      dataFim: body.dataFim ? new Date(body.dataFim) : null,
      horario: null,
      local: body.local,
      valor: Number(body.valor) || 0,
      inscricaoInicio: body.inscricaoInicio
        ? new Date(body.inscricaoInicio)
        : null,
      inscricaoFim: body.inscricaoFim ? new Date(body.inscricaoFim) : null,
      dataPlanejamentoInicio: body.dataPlanejamentoInicio
        ? new Date(body.dataPlanejamentoInicio)
        : null,
      ministerioId: body.ministerioId || null,
    },
  })
  return NextResponse.json(evento)
}
