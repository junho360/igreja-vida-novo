'use client'

import { useState } from 'react'

interface InscricaoItem {
  id: string
  nome: string
  nomeConvidado?: string | null
  email: string
  telefone?: string | null
  valor: number
  status: string
  comprovante?: string | null
  lote?: { nome: string } | null
  createdAt: string | Date
}

const statusLabel: Record<string, string> = {
  pendente: 'Pendente',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
}

const statusColor: Record<string, string> = {
  pendente: 'bg-yellow-100 text-yellow-800',
  confirmado: 'bg-green-100 text-green-800',
  cancelado: 'bg-red-100 text-red-800',
}

export default function InscricaoActions({
  item,
  onStatusChange,
}: {
  item: InscricaoItem
  onStatusChange?: () => void
}) {
  const [status, setStatus] = useState(item.status)

  async function updateStatus(newStatus: string) {
    const res = await fetch(`/api/admin/inscricoes/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setStatus(newStatus)
      onStatusChange?.()
    }
  }

  return (
    <tr>
      <td className="px-6 py-4 text-sm font-medium text-gray-900">
        {item.nome}
        {item.nomeConvidado && (
          <span className="block text-xs font-normal text-gray-500">
            + convidado: {item.nomeConvidado}
          </span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">{item.email}</td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {item.telefone ?? '—'}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500">
        {item.lote && (
          <span className="text-xs bg-primary/10 text-primary rounded px-1.5 py-0.5 mr-1">
            {item.lote.nome}
          </span>
        )}
        {item.valor > 0 ? `R$ ${item.valor.toFixed(2)}` : 'Gratuito'}
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[status] ?? 'bg-gray-100 text-gray-800'}`}
        >
          {statusLabel[status] ?? status}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        {item.comprovante ? (
          <a
            href={`/api/inscricoes/${item.id}/comprovante`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Ver comprovante
          </a>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>
      <td className="px-6 py-4 text-right text-sm">
        {status === 'pendente' && (
          <button
            type="button"
            onClick={() => updateStatus('confirmado')}
            className="text-green-600 hover:underline"
          >
            Confirmar
          </button>
        )}
        {status === 'confirmado' && (
          <button
            type="button"
            onClick={() => updateStatus('cancelado')}
            className="text-red-600 hover:underline"
          >
            Cancelar
          </button>
        )}
        {status === 'cancelado' && (
          <button
            type="button"
            onClick={() => updateStatus('pendente')}
            className="text-yellow-600 hover:underline"
          >
            Reabrir
          </button>
        )}
      </td>
    </tr>
  )
}
