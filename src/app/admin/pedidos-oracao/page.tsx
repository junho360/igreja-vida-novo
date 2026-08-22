'use client'

import { useEffect, useState } from 'react'

interface PedidoOracao {
  id: string
  nome: string
  email: string | null
  telefone: string | null
  mensagem: string
  aprovado: boolean
  createdAt: string
}

export default function AdminPedidosOracaoPage() {
  const [pedidos, setPedidos] = useState<PedidoOracao[]>([])
  const [filtro, setFiltro] = useState<'todos' | 'pendente' | 'aprovado'>(
    'todos'
  )
  const [busca, setBusca] = useState('')

  useEffect(() => {
    fetch('/api/admin/pedidos-oracao')
      .then((r) => r.json())
      .then(setPedidos)
  }, [])

  async function toggleAprovado(id: string, aprovado: boolean) {
    await fetch('/api/admin/pedidos-oracao', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, aprovado }),
    })
    setPedidos(pedidos.map((p) => (p.id === id ? { ...p, aprovado } : p)))
  }

  const filtrados = pedidos.filter((p) => {
    if (filtro === 'pendente' && p.aprovado) return false
    if (filtro === 'aprovado' && !p.aprovado) return false
    if (busca) {
      const q = busca.toLowerCase()
      return (
        p.nome.toLowerCase().includes(q) ||
        p.mensagem.toLowerCase().includes(q) ||
        (p.email?.toLowerCase().includes(q) ?? false)
      )
    }
    return true
  })

  const pendentes = pedidos.filter((p) => !p.aprovado).length

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Pedidos de Oração</h1>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setFiltro('todos')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === 'todos' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          Todos ({pedidos.length})
        </button>
        <button
          onClick={() => setFiltro('pendente')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === 'pendente' ? 'bg-yellow-500 text-white' : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'}`}
        >
          Pendentes ({pendentes})
        </button>
        <button
          onClick={() => setFiltro('aprovado')}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${filtro === 'aprovado' ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100'}`}
        >
          Aprovados ({pedidos.length - pendentes})
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="ml-auto rounded-md border px-3 py-1.5 text-sm"
        />
      </div>

      <div className="mt-6 space-y-3">
        {filtrados.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum pedido encontrado.</p>
        )}
        {filtrados.map((pedido) => (
          <div
            key={pedido.id}
            className={`rounded-lg border bg-white p-4 shadow-sm transition ${pedido.aprovado ? 'border-green-200 opacity-70' : 'border-yellow-200'}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900">{pedido.nome}</p>
                  {pedido.aprovado ? (
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Aprovado
                    </span>
                  ) : (
                    <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                      Pendente
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                  {pedido.email && <span>{pedido.email}</span>}
                  {pedido.telefone && <span>{pedido.telefone}</span>}
                  <span>
                    {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}{' '}
                    {new Date(pedido.createdAt).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="mt-2 text-gray-700 whitespace-pre-wrap">
                  {pedido.mensagem}
                </p>
              </div>
              <button
                onClick={() => toggleAprovado(pedido.id, !pedido.aprovado)}
                className={`shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold transition ${pedido.aprovado ? 'bg-gray-100 text-gray-600 hover:bg-gray-200' : 'bg-green-600 text-white hover:bg-green-700'}`}
              >
                {pedido.aprovado ? 'Desaprovar' : 'Aprovar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
