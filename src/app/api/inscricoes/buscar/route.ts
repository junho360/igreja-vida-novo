import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 })
  }

  const inscricoes = await prisma.inscricao.findMany({
    where: { email: email.toLowerCase().trim() },
    orderBy: { createdAt: 'desc' },
    include: {
      evento: { select: { titulo: true, data: true } },
      lote: { select: { nome: true } },
    },
  })

  const result = inscricoes.map((i) => ({
    id: i.id,
    nome: i.nome,
    email: i.email,
    valor: i.valor,
    status: i.status,
    comprovante: i.comprovante,
    lote: i.lote,
    createdAt: i.createdAt.toISOString(),
    evento: {
      titulo: i.evento.titulo,
      data: i.evento.data.toISOString(),
    },
  }))

  return NextResponse.json(result)
}
