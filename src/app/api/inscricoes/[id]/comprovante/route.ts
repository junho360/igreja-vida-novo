import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const ALLOWED_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
]

function detectMime(buffer: Buffer): string | null {
  if (
    buffer.length > 3 &&
    buffer[0] === 0xff &&
    buffer[1] === 0xd8 &&
    buffer[2] === 0xff
  )
    return 'image/jpeg'
  if (
    buffer.length > 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  )
    return 'image/png'
  if (
    buffer.length > 12 &&
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  )
    return 'image/webp'
  if (
    buffer.length > 4 &&
    buffer[0] === 0x25 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x44 &&
    buffer[3] === 0x46
  )
    return 'application/pdf'
  return null
}

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

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const mime = detectMime(buffer)
    if (!mime || !ALLOWED_MIMES.includes(mime)) {
      return NextResponse.json(
        { error: 'Tipo não permitido. Use imagem ou PDF.' },
        { status: 400 }
      )
    }

    const base64 = buffer.toString('base64')

    await prisma.inscricao.update({
      where: { id },
      data: {
        comprovante: 'ok',
        comprovanteDados: base64,
        comprovanteMime: mime,
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
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-store',
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
