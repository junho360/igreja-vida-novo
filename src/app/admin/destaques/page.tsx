import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ExcluirDestaqueButton from './excluir-button'

export default async function AdminDestaquesPage() {
  const items = await prisma.destaqueHome.findMany({
    orderBy: { ordem: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Destaques da Home</h1>
        <Link
          href="/admin/destaques/novo"
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
                Subtítulo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Horário
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Local
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ícone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ordem
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Ativo
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {item.titulo}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.subtitulo ?? '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.horario ?? '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.local ?? '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.icone ?? '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.ordem}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {item.ativo ? 'Sim' : 'Não'}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link
                    href={`/admin/destaques/${item.id}/editar`}
                    className="text-primary hover:underline"
                  >
                    Editar
                  </Link>{' '}
                  <ExcluirDestaqueButton id={item.id} titulo={item.titulo} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 && (
          <p className="px-6 py-4 text-sm text-gray-500">
            Nenhum destaque cadastrado.
          </p>
        )}
      </div>
    </div>
  )
}
