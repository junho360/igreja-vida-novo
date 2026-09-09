import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminDevocionaisPage() {
  const items = await prisma.devocional.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Devocionais
        </h1>
        <Link
          href="/admin/devocionais/novo"
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
        >
          + Novo
        </Link>
      </div>
      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Título
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Publicado
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
                  {item.publicado ? 'Sim' : 'Não'}
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <Link
                    href={`/admin/devocionais/${item.id}/editar`}
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
