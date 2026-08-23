import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const evento = await prisma.evento.findUnique({
    where: { id },
    include: {
      _count: { select: { inscricoes: true } },
    },
  })

  if (!evento)
    return NextResponse.json(
      { error: 'Evento não encontrado' },
      { status: 404 }
    )

  const inscricoesConfirmadas = await prisma.inscricao.count({
    where: { eventoId: id, status: 'confirmada' },
  })

  return NextResponse.json({
    ...evento,
    inscricoesConfirmadas,
  })
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const evento = await prisma.evento.update({
    where: { id },
    data: {
      titulo: body.titulo,
      descricao: body.descricao,
      data: new Date(body.data),
      dataFim: body.dataFim ? new Date(body.dataFim) : null,
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
      publicado: body.publicado === true || body.publicado === 'true',
    },
  })

  return NextResponse.json(evento)
}
