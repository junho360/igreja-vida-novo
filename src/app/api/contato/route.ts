import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  const body = await request.json()

  await prisma.mensagemContato.create({
    data: {
      nome: body.nome,
      email: body.email,
      telefone: body.telefone || null,
      assunto: body.assunto,
      mensagem: body.mensagem,
    },
  })

  return NextResponse.json({ success: true })
}
