import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [
    ministerios,
    eventos,
    devocionais,
    estudos,
    pregacoes,
    celulas,
    inscricoes,
    pedidosOracao,
    mensagens,
  ] = await Promise.all([
    prisma.ministerio.count(),
    prisma.evento.count(),
    prisma.devocional.count(),
    prisma.estudo.count(),
    prisma.preGacao.count(),
    prisma.celula.count(),
    prisma.inscricao.count({ where: { status: 'pendente' } }),
    prisma.pedidoOracao.count({ where: { aprovado: false } }),
    prisma.mensagemContato.count({ where: { lida: false } }),
  ])

  const stats = [
    { label: 'Ministérios', value: ministerios, href: '/admin/ministerios' },
    { label: 'Eventos', value: eventos, href: '/admin/eventos' },
    { label: 'Devocionais', value: devocionais, href: '/admin/devocionais' },
    { label: 'Estudos', value: estudos, href: '/admin/estudos' },
    { label: 'Pregações', value: pregacoes, href: '/admin/pregacoes' },
    { label: 'Células', value: celulas, href: '/admin/celulas' },
    {
      label: 'Inscrições Pendentes',
      value: inscricoes,
      href: '/admin/inscricoes',
      alert: inscricoes > 0,
    },
    {
      label: 'Pedidos de Oração',
      value: pedidosOracao,
      href: '/admin/pedidos-oracao',
      alert: pedidosOracao > 0,
    },
    {
      label: 'Mensagens',
      value: mensagens,
      href: '/admin/mensagens',
      alert: mensagens > 0,
    },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <a
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
            {stat.alert && (
              <p className="mt-1 text-xs text-red-600">Novos para revisar</p>
            )}
          </a>
        ))}
      </div>
    </div>
  )
}
