import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailOptions): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('SMTP não configurado. Defina SMTP_USER e SMTP_PASS no .env')
    return false
  }

  try {
    await transporter.sendMail({
      from: `"Igreja Vida" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    })
    return true
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    return false
  }
}
