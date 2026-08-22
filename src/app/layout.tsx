import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/public/navbar'
import Footer from '@/components/public/footer'
import { getConfigs } from '@/lib/configuracoes'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Igreja Vida',
  description: 'Igreja Vida - Uma comunidade de fé, amor e esperança',
}

export const dynamic = 'force-dynamic'

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const cfg = await getConfigs(['instagram', 'youtube', 'telefone'])

  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar cfg={cfg} />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
