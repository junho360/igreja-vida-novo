import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const ministerioId = searchParams.get('ministerioId')

  if (!ministerioId)
    return NextResponse.json(
      { error: 'ministerioId required' },
      { status: 400 }
    )

  const itens = await prisma.galeriaMinisterio.findMany({
    where: { ministerioId },
    orderBy: { ordem: 'asc' },
  })

  return NextResponse.json(itens)
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()

    const item = await prisma.galeriaMinisterio.create({
      data: {
        tipo: body.tipo,
        url: body.url,
        titulo: body.titulo || null,
        ministerioId: body.ministerioId,
        ordem: body.ordem ?? 0,
      },
    })

    return NextResponse.json(item)
  } catch (err) {
    console.error('Erro ao criar item da galeria:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await request.json()

    const item = await prisma.galeriaMinisterio.findUnique({ where: { id } })
    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    if (item.tipo === 'imagem' && item.url.startsWith('/uploads/')) {
      const { unlink } = await import('fs/promises')
      const { join } = await import('path')
      await unlink(join(process.cwd(), 'public', item.url)).catch(() => {})
    }

    await prisma.galeriaMinisterio.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Erro ao deletar item da galeria:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
