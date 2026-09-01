import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const inscricao = await prisma.inscricao.findUnique({ where: { id } })
    if (!inscricao) {
      return NextResponse.json(
        { error: 'Inscrição não encontrada' },
        { status: 404 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('comprovante') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo não permitido. Use imagem ou PDF.' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')

    await prisma.inscricao.update({
      where: { id },
      data: {
        comprovante: 'ok',
        comprovanteDados: base64,
        comprovanteMime: file.type,
      },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erro ao enviar comprovante:', err)
    return NextResponse.json(
      { error: 'Erro interno ao processar upload' },
      { status: 500 }
    )
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
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
  } catch (err) {
    console.error('Erro ao buscar comprovante:', err)
    return NextResponse.json(
      { error: 'Erro interno ao buscar comprovante' },
      { status: 500 }
    )
  }
}
