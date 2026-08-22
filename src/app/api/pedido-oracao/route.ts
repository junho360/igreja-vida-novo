import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()

  await prisma.pedidoOracao.create({
    data: {
      nome: body.nome,
      email: body.email || null,
      telefone: body.telefone || null,
      mensagem: body.mensagem,
    },
  })

  return NextResponse.json({ success: true })
}
