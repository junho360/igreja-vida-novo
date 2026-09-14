import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const inscricao = await prisma.inscricao.findUnique({ where: { id } })
  if (!inscricao?.comprovanteDados || !inscricao?.comprovanteMime) {
    return NextResponse.json(
      { error: 'Comprovante não encontrado' },
      { status: 404 }
    )
  }

  const buffer = Buffer.from(inscricao.comprovanteDados, 'base64')

  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': inscricao.comprovanteMime,
      'Content-Disposition': 'inline',
    },
  })
}
