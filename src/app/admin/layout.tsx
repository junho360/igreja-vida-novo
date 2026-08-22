import Link from 'next/link'

const menuItems = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/ministerios', label: 'Ministérios' },
  { href: '/admin/eventos', label: 'Eventos' },
  { href: '/admin/devocionais', label: 'Devocionais' },
  { href: '/admin/estudos', label: 'Estudos' },
  { href: '/admin/pregacoes', label: 'Pregações' },
  { href: '/admin/celulas', label: 'Células' },
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
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
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
      <main className="flex-1 overflow-auto p-6">{children}</main>
    </div>
  )
}
