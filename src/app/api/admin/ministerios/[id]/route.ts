import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const ministerio = await prisma.ministerio.findUnique({ where: { id } })
  if (!ministerio)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(ministerio)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const ministerio = await prisma.ministerio.update({
    where: { id },
    data: body,
  })
  return NextResponse.json(ministerio)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await prisma.ministerio.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
