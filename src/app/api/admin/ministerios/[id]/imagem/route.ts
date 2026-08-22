import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { writeFile, unlink } from 'fs/promises'
import { join } from 'path'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const ministerio = await prisma.ministerio.findUnique({ where: { id } })
    if (!ministerio)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const formData = await request.formData()
    const file = formData.get('imagem') as File | null

    if (!file)
      return NextResponse.json(
        { error: 'Nenhum arquivo enviado' },
        { status: 400 }
      )

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Tipo não permitido. Use JPG, PNG ou WebP.' },
        { status: 400 }
      )
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `ministerio-${id}-${Date.now()}.${ext}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    if (ministerio.imagem) {
      const oldPath = join(process.cwd(), 'public', ministerio.imagem)
      await unlink(oldPath).catch(() => {})
    }

    await prisma.ministerio.update({
      where: { id },
      data: { imagem: `/uploads/${filename}` },
    })

    return NextResponse.json({ success: true, imagem: `/uploads/${filename}` })
  } catch (err) {
    console.error('Erro ao enviar imagem:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    const ministerio = await prisma.ministerio.findUnique({ where: { id } })
    if (!ministerio)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (ministerio.imagem) {
      const filepath = join(process.cwd(), 'public', ministerio.imagem)
      await unlink(filepath).catch(() => {})
    }

    await prisma.ministerio.update({
      where: { id },
      data: { imagem: null },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erro ao remover imagem:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
