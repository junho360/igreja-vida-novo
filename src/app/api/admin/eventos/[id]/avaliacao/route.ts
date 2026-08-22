import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const avaliacao = await prisma.eventoAvaliacao.findUnique({
    where: { eventoId: id },
  })
  return NextResponse.json(avaliacao)
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()

  const avaliacao = await prisma.eventoAvaliacao.upsert({
    where: { eventoId: id },
    update: {
      custo: body.custo ? parseFloat(body.custo) : null,
      receita: body.receita ? parseFloat(body.receita) : null,
      presenca: body.presenca ? parseInt(body.presenca) : null,
      satisfacao: body.satisfacao ? parseInt(body.satisfacao) : null,
      pros: body.pros || null,
      contras: body.contras || null,
      melhorias: body.melhorias || null,
    },
    create: {
      eventoId: id,
      custo: body.custo ? parseFloat(body.custo) : null,
      receita: body.receita ? parseFloat(body.receita) : null,
      presenca: body.presenca ? parseInt(body.presenca) : null,
      satisfacao: body.satisfacao ? parseInt(body.satisfacao) : null,
      pros: body.pros || null,
      contras: body.contras || null,
      melhorias: body.melhorias || null,
    },
  })

  return NextResponse.json(avaliacao)
}
