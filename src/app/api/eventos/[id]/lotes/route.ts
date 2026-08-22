import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const evento = await prisma.evento.findUnique({
      where: { id },
      select: { valor: true },
    })
    if (!evento)
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      )

    const lotes = await prisma.loteInscricao.findMany({
      where: { eventoId: id },
      orderBy: { ordem: 'asc' },
    })

    const lotesComStatus = await Promise.all(
      lotes.map(async (l) => {
        const inscritos = await prisma.inscricao.count({
          where: { loteId: l.id },
        })
        return {
          id: l.id,
          nome: l.nome,
          valor: l.valor,
          quantidade: l.quantidade,
          inscritos,
          vagasRestantes: l.quantidade - inscritos,
          esgotado: inscritos >= l.quantidade,
        }
      })
    )

    const loteDisponivel = lotesComStatus.find((l) => !l.esgotado)

    return NextResponse.json({
      lotes: lotesComStatus,
      loteDisponivel: loteDisponivel ?? null,
      valorCheio: evento.valor ?? 0,
      todosEsgotados:
        lotes.length > 0 && lotesComStatus.every((l) => l.esgotado),
    })
  } catch (error) {
    console.error('Error fetching lotes:', error)
    return NextResponse.json({
      lotes: [],
      loteDisponivel: null,
      valorCheio: 0,
      todosEsgotados: false,
    })
  }
}
