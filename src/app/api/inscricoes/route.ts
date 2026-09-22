import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { listDiasDiaria } from '@/lib/dias-diaria'

export async function POST(request: Request) {
  const body = await request.json()

  if (!body.nome || !body.email || !body.eventoId) {
    return NextResponse.json(
      { error: 'Nome, email e evento são obrigatórios' },
      { status: 400 }
    )
  }

  const evento = await prisma.evento.findUnique({
    where: { id: body.eventoId },
  })
  if (!evento) {
    return NextResponse.json(
      { error: 'Evento não encontrado' },
      { status: 404 }
    )
  }

  let valor = evento.valor ?? 0
  let loteId: string | null = null
  const diaDiaria: string | null =
    typeof body.diaDiaria === 'string' && body.diaDiaria ? body.diaDiaria : null

  if (diaDiaria) {
    if (!evento.temDiaria || evento.diariaValor == null) {
      return NextResponse.json(
        { error: 'Evento não oferece inscrição de diária' },
        { status: 400 }
      )
    }
    const diasValidos = listDiasDiaria(evento.data, evento.dataFim)
    if (!diasValidos.includes(diaDiaria)) {
      return NextResponse.json(
        { error: 'Dia inválido para a diária' },
        { status: 400 }
      )
    }
    valor = evento.diariaValor
  } else if (
    evento.valorComConvidado != null &&
    evento.valorSemConvidado != null
  ) {
    valor =
      body.temConvidado === true
        ? evento.valorComConvidado
        : evento.valorSemConvidado
  } else if (body.loteId) {
    const lote = await prisma.loteInscricao.findUnique({
      where: { id: body.loteId },
    })
    if (lote && lote.eventoId === body.eventoId) {
      const inscritosNoLote = await prisma.inscricao.count({
        where: { loteId: lote.id },
      })
      if (inscritosNoLote < lote.quantidade) {
        valor = lote.valor
        loteId = lote.id
      }
    }
  }

  const inscricao = await prisma.inscricao.create({
    data: {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone,
      nomeConvidado: body.nomeConvidado || null,
      diaDiaria,
      valor,
      eventoId: body.eventoId,
      loteId,
    },
  })

  return NextResponse.json(inscricao)
}
