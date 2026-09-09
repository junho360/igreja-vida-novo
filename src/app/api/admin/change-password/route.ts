import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { senhaAtual, novaSenha } = await request.json()

  if (!senhaAtual || !novaSenha) {
    return NextResponse.json(
      { error: 'Senha atual e nova senha são obrigatórias' },
      { status: 400 }
    )
  }

  if (novaSenha.length < 6) {
    return NextResponse.json(
      { error: 'A nova senha deve ter pelo menos 6 caracteres' },
      { status: 400 }
    )
  }

  const usuario = await prisma.usuario.findUnique({
    where: { email: session.user?.email as string },
  })

  if (!usuario) {
    return NextResponse.json(
      { error: 'Usuário não encontrado' },
      { status: 404 }
    )
  }

  const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha)
  if (!senhaValida) {
    return NextResponse.json(
      { error: 'Senha atual incorreta' },
      { status: 400 }
    )
  }

  const novaHash = await bcrypt.hash(novaSenha, 10)
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { senha: novaHash },
  })

  return NextResponse.json({ success: true })
}
