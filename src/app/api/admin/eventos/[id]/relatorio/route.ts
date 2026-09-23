import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const inscricoes = await prisma.inscricao.findMany({
    where: { eventoId: id },
    orderBy: [{ status: 'asc' }, { nome: 'asc' }],
    select: {
      id: true,
      nome: true,
      nomeConvidado: true,
      diaDiaria: true,
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
