import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminMinisteriosPage() {
  const ministerios = await prisma.ministerio.findMany({
    orderBy: { nome: 'asc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Ministérios</h1>
        <Link
          href="/admin/ministerios/novo"
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
                Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Responsável
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
            {ministerios.map((m) => (
              <tr key={m.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {m.nome}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {m.responsavel ?? '—'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {m.ativo ? 'Sim' : 'Não'}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link
                    href={`/admin/ministerios/${m.id}/editar`}
                    className="text-primary hover:underline"
                  >
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
