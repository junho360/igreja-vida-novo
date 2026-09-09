'use client'

import Link from 'next/link'
import { useState } from 'react'

const menuItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/ministerios', label: 'Ministérios' },
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/devocionais', label: 'Devocionais' },
  { href: '/admin/estudos', label: 'Estudos' },
  { href: '/admin/pregacoes', label: 'Pregações' },
  { href: '/admin/celulas', label: 'Células' },
  { href: '/admin/destaques', label: 'Destaques' },
  { href: '/admin/inscricoes', label: 'Inscrições' },
  { href: '/admin/configuracoes', label: 'Configurações' },
  { href: '/admin/pedidos-oracao', label: 'Pedidos de Oração' },
  { href: '/admin/mensagens', label: 'Mensagens' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [aberto, setAberto] = useState(false)

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <header className="bg-gray-900 text-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="font-bold">
            Igreja Vida - Admin
          </Link>
          <button
            type="button"
            onClick={() => setAberto((a) => !a)}
            className="rounded-md px-2 py-1 text-sm text-gray-300 hover:text-white"
            aria-expanded={aberto}
          >
            {aberto ? '✕ Fechar' : '☰ Menu'}
          </button>
        </div>
        {aberto && (
          <nav className="px-4 pb-4 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setAberto(false)}
                className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/"
              className="block border-t border-gray-800 pt-2 text-sm text-gray-400 hover:text-white"
              onClick={() => setAberto(false)}
            >
              ← Voltar ao site
            </Link>
          </nav>
        )}
      </header>

      <aside className="hidden lg:flex w-64 bg-gray-900 text-white flex-col min-h-screen">
        <div className="p-4 border-b border-gray-800">
          <Link href="/admin" className="text-lg font-bold">
            Igreja Vida - Admin
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <Link href="/" className="text-sm text-gray-400 hover:text-white">
            ← Voltar ao site
          </Link>
        </div>
      </aside>

      <main className="flex-1 overflow-x-auto p-4 lg:p-6">{children}</main>
    </div>
  )
}
