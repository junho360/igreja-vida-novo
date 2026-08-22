import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import { join } from 'path'

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null

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

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Arquivo muito grande. Máximo 5MB.' },
        { status: 400 }
      )
    }

    const ext = file.name.split('.').pop() ?? 'jpg'
    const filename = `galeria-${Date.now()}.${ext}`
    const filepath = join(process.cwd(), 'public', 'uploads', filename)

    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filepath, buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (err) {
    console.error('Erro ao fazer upload:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
