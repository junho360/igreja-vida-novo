import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail } from '@/lib/email'

export async function GET() {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const items = await prisma.mensagemContato.findMany({
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(items)
}

export async function PUT(request: Request) {
  const session = await auth()
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const item = await prisma.mensagemContato.update({
    where: { id: body.id },
    data: {
      lida: body.lida,
      respondida: body.respondida,
      resposta: body.resposta !== undefined ? body.resposta : undefined,
    },
  })

  let emailEnviado = false

  if (body.resposta && item.email) {
    emailEnviado = await sendEmail({
      to: item.email,
      subject: `Re: ${item.assunto} - Igreja Vida`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e3a5f; color: white; padding: 16px; text-align: center;">
            <h2 style="margin: 0;">Igreja Vida</h2>
          </div>
          <div style="padding: 24px; border: 1px solid #e5e7eb;">
            <p>Olá <strong>${item.nome}</strong>,</p>
            <p>Sua mensagem sobre <em>"${item.assunto}"</em> foi respondida:</p>
            <div style="background-color: #f9fafb; border-left: 4px solid #1e3a5f; padding: 12px; margin: 16px 0;">
              <p style="margin: 0; color: #374151;">${body.resposta}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="font-size: 12px; color: #9ca3af;">Igreja Vida - Resposta automática</p>
          </div>
        </div>
      `,
    })
  }

  return NextResponse.json({
    ...item,
    emailEnviado,
    telefone: item.telefone,
  })
}
