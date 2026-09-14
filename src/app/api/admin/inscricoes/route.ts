import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const eventos = await prisma.evento.findMany({
    orderBy: { data: 'desc' },
    select: {
      id: true,
      titulo: true,
      data: true,
      valor: true,
      inscricoes: {
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          nome: true,
          nomeConvidado: true,
          email: true,
          telefone: true,
          valor: true,
          status: true,
          comprovanteDados: true,
          createdAt: true,
          lote: { select: { nome: true } },
        },
      },
    },
  })

  const limpos = eventos.map((e) => ({
    ...e,
    inscricoes: e.inscricoes.map(({ comprovanteDados, ...rest }) => ({
      ...rest,
      temComprovante: comprovanteDados != null,
    })),
  }))

  return NextResponse.json(limpos)
}
