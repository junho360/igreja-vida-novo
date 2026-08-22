'use client'

import { useState, useEffect } from 'react'

interface Lote {
  id: string
  nome: string
  valor: number
  quantidade: number
  ordem: number
  inscritos: number
  vagasRestantes: number
}

export default function LoteManager({ eventoId }: { eventoId: string }) {
  const [lotes, setLotes] = useState<Lote[]>([])
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState('')

  useEffect(() => {
    fetch(`/api/admin/eventos/${eventoId}/lotes`)
      .then((r) => (r.ok ? r.json() : []))
      .then(setLotes)
      .catch(() => setLotes([]))
  }, [eventoId])

  async function adicionarLote() {
    if (!nome || !valor || !quantidade) return
    setSalvando(true)
    setErro('')

    try {
      const res = await fetch(`/api/admin/eventos/${eventoId}/lotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, valor, quantidade }),
      })

      if (res.ok) {
        const lote = await res.json()
        setLotes([
          ...lotes,
          { ...lote, inscritos: 0, vagasRestantes: lote.quantidade },
        ])
        setNome('')
        setValor('')
        setQuantidade('')
      } else {
        const data = await res.json().catch(() => ({}))
        setErro(data.error || `Erro ${res.status}`)
      }
    } catch {
      setErro('Erro de conexão')
    }
    setSalvando(false)
  }

  async function removerLote(loteId: string) {
    if (!confirm('Remover este lote?')) return
    const res = await fetch(
      `/api/admin/eventos/${eventoId}/lotes?loteId=${loteId}`,
      { method: 'DELETE' }
    )
    if (res.ok) setLotes(lotes.filter((l) => l.id !== loteId))
  }

  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">
        Lotes de Inscrição
      </h3>

      {lotes.length > 0 && (
        <div className="mb-4 space-y-2">
          {lotes.map((lote) => (
            <div
              key={lote.id}
              className="flex items-center justify-between rounded-md bg-white border px-3 py-2 text-sm"
            >
              <div>
                <span className="font-medium">{lote.nome}</span>
                <span className="ml-2 text-gray-500">
                  R$ {lote.valor.toFixed(2)}
                </span>
                <span className="ml-2 text-gray-400">
                  · {lote.inscritos}/{lote.quantidade} inscritos
                </span>
              </div>
              <button
                type="button"
                onClick={() => removerLote(lote.id)}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2 flex-wrap items-end">
        <input
          type="text"
          placeholder="Nome do lote"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm flex-1 min-w-[120px]"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Valor (R$)"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm w-28"
        />
        <input
          type="number"
          placeholder="Qtd vagas"
          value={quantidade}
          onChange={(e) => setQuantidade(e.target.value)}
          className="rounded-md border px-2 py-1 text-sm w-24"
        />
        <button
          type="button"
          onClick={adicionarLote}
          disabled={salvando || !nome || !valor || !quantidade}
          className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-white hover:bg-primary-light disabled:opacity-50"
        >
          + Adicionar
        </button>
      </div>
      <p className="mt-2 text-xs text-gray-400">
        O valor cheio do evento (campo &quot;Valor&quot; acima) será cobrado
        quando todos os lotes esgotarem.
      </p>
      {erro && <p className="mt-2 text-xs text-red-600">{erro}</p>}
    </div>
  )
}
