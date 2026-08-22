import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const eventos = await prisma.evento.findMany({
    orderBy: { data: 'desc' },
    include: {
      inscricoes: {
        orderBy: { createdAt: 'desc' },
        include: { lote: { select: { nome: true } } },
      },
    },
  })

  return NextResponse.json(eventos)
}
