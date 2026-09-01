import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const inscricoes = await prisma.inscricao.findMany({
    where: { eventoId: id },
    orderBy: [{ status: 'asc' }, { nome: 'asc' }],
    select: {
      id: true,
      nome: true,
      nomeConvidado: true,
      email: true,
      telefone: true,
      valor: true,
      status: true,
      comprovante: true,
      createdAt: true,
      lote: { select: { nome: true } },
    },
  })

  return NextResponse.json(inscricoes)
}
