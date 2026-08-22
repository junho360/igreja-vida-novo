import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function AdminEventosPage() {
  const eventos = await prisma.evento.findMany({
    orderBy: { data: 'asc' },
    include: { ministerio: true, avaliacao: true },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
        <Link
          href="/admin/eventos/novo"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Novo
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Data
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Local
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {eventos.map((e) => {
              const hoje = new Date()
              const passou = e.data < hoje
              const status = passou
                ? e.avaliacao
                  ? 'avaliado'
                  : 'pendente'
                : 'futuro'
              return (
                <tr key={e.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {e.titulo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {e.data.toLocaleDateString('pt-BR')}{' '}
                    {e.data.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {e.dataFim && (
                      <>
                        {' '}
                        — {e.dataFim.toLocaleDateString('pt-BR')}{' '}
                        {e.dataFim.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {e.local ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {status === 'avaliado' && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        Avaliado
                      </span>
                    )}
                    {status === 'pendente' && (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        Avaliação pendente
                      </span>
                    )}
                    {status === 'futuro' && (
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                        Futuro
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-sm space-x-3">
                    <Link
                      href={`/admin/eventos/${e.id}/editar`}
                      className="text-primary hover:underline"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/eventos/${e.id}/relatorio`}
                      className="text-indigo-600 hover:underline font-medium"
                    >
                      Relatório
                    </Link>
                    {passou && (
                      <Link
                        href={`/admin/eventos/${e.id}/avaliar`}
                        className="text-amber-600 hover:underline font-medium"
                      >
                        {e.avaliacao ? 'Ver avaliação' : 'Avaliar'}
                      </Link>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
