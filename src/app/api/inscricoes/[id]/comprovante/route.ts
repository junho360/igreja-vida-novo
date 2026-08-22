import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import { join } from 'path'

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

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `${id}-${Date.now()}.${ext}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    await prisma.inscricao.update({
      where: { id },
      data: { comprovante: `/uploads/${filename}` },
    })

    return NextResponse.json({
      success: true,
      comprovante: `/uploads/${filename}`,
    })
  } catch (err) {
    console.error('Erro ao enviar comprovante:', err)
    return NextResponse.json(
      { error: 'Erro interno ao processar upload' },
      { status: 500 }
    )
  }
}
