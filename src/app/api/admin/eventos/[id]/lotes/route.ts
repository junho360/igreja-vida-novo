import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lotes = await prisma.loteInscricao.findMany({
      where: { eventoId: id },
      orderBy: { ordem: 'asc' },
    })

    const lotesComVagas = await Promise.all(
      lotes.map(async (l) => {
        const inscritos = await prisma.inscricao.count({
          where: { loteId: l.id },
        })
        return {
          ...l,
          inscritos,
          vagasRestantes: l.quantidade - inscritos,
        }
      })
    )

    return NextResponse.json(lotesComVagas)
  } catch (error) {
    console.error('Error fetching lotes:', error)
    return NextResponse.json({ error: 'Erro ao buscar lotes' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await req.json()

    console.log('Creating lote:', { eventoId: id, body })

    const maxOrdem = await prisma.loteInscricao.aggregate({
      where: { eventoId: id },
      _max: { ordem: true },
    })

    const lote = await prisma.loteInscricao.create({
      data: {
        nome: body.nome,
        valor: parseFloat(body.valor),
        quantidade: parseInt(body.quantidade),
        ordem: (maxOrdem._max.ordem ?? 0) + 1,
        eventoId: id,
      },
    })

    console.log('Lote created:', lote)
    return NextResponse.json(lote)
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Erro ao criar lote'
    console.error('Error creating lote:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const loteId = searchParams.get('loteId')
    if (!loteId)
      return NextResponse.json({ error: 'loteId required' }, { status: 400 })

    await prisma.loteInscricao.delete({ where: { id: loteId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error deleting lote:', error)
    return NextResponse.json({ error: 'Erro ao deletar lote' }, { status: 500 })
  }
}
