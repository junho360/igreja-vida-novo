'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import LoteManager from '@/components/admin/lote-manager'

export default function NovoEventoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [ministerios, setMinisterios] = useState<
    Array<{ id: string; nome: string }>
  >([])
  const [eventoId, setEventoId] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/ministerios')
      .then((r) => r.json())
      .then(setMinisterios)
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const res = await fetch('/api/admin/eventos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: form.get('titulo'),
        descricao: form.get('descricao'),
        data: form.get('data'),
        dataFim: form.get('dataFim') || null,
        local: form.get('local'),
        valor: form.get('valor'),
        valorComConvidado: form.get('valorComConvidado'),
        valorSemConvidado: form.get('valorSemConvidado'),
        inscricaoInicio: form.get('inscricaoInicio') || null,
        inscricaoFim: form.get('inscricaoFim') || null,
        dataPlanejamentoInicio: form.get('dataPlanejamentoInicio') || null,
        ministerioId: form.get('ministerioId') || null,
        publicado: form.get('publicado') === 'true',
      }),
    })

    const data = await res.json()
    setEventoId(data.id)
    setLoading(false)
  }

  if (eventoId) {
    return (
      <div className="max-w-xl">
        <h1 className="text-2xl font-bold text-gray-900">Evento criado!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Agora adicione os lotes de inscrição (opcional).
        </p>
        <div className="mt-6">
          <LoteManager eventoId={eventoId} />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            onClick={() => router.push('/admin/eventos')}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          >
            Concluir
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Novo Evento</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="titulo"
            className="block text-sm font-medium text-gray-700"
          >
            Título *
          </label>
          <input
            type="text"
            id="titulo"
            name="titulo"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="data"
              className="block text-sm font-medium text-gray-700"
            >
              Data e hora início *
            </label>
            <input
              type="datetime-local"
              id="data"
              name="data"
              required
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="dataFim"
              className="block text-sm font-medium text-gray-700"
            >
              Data e hora fim
            </label>
            <input
              type="datetime-local"
              id="dataFim"
              name="dataFim"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="local"
            className="block text-sm font-medium text-gray-700"
          >
            Local
          </label>
          <input
            type="text"
            id="local"
            name="local"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="dataPlanejamentoInicio"
            className="block text-sm font-medium text-gray-700"
          >
            Início do planejamento
          </label>
          <input
            type="date"
            id="dataPlanejamentoInicio"
            name="dataPlanejamentoInicio"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="valorSemConvidado"
            className="block text-sm font-medium text-gray-700"
          >
            Valor sem convidado (R$) - 0 = Gratuito
          </label>
          <input
            type="number"
            id="valorSemConvidado"
            name="valorSemConvidado"
            step="0.01"
            defaultValue="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="valorComConvidado"
            className="block text-sm font-medium text-gray-700"
          >
            Valor com convidado (R$) - 0 = Gratuito
          </label>
          <input
            type="number"
            id="valorComConvidado"
            name="valorComConvidado"
            step="0.01"
            defaultValue="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="valor"
            className="block text-sm font-medium text-gray-700"
          >
            Valor único (R$) - usado se não definir os dois acima
          </label>
          <input
            type="number"
            id="valor"
            name="valor"
            step="0.01"
            defaultValue="0"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="publicado"
            name="publicado"
            value="true"
            defaultChecked={false}
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <label
            htmlFor="publicado"
            className="ml-2 block text-sm text-gray-700"
          >
            Publicado
          </label>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="inscricaoInicio"
              className="block text-sm font-medium text-gray-700"
            >
              Inscrições abrem
            </label>
            <input
              type="datetime-local"
              id="inscricaoInicio"
              name="inscricaoInicio"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="inscricaoFim"
              className="block text-sm font-medium text-gray-700"
            >
              Inscrições encerram
            </label>
            <input
              type="datetime-local"
              id="inscricaoFim"
              name="inscricaoFim"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="ministerioId"
            className="block text-sm font-medium text-gray-700"
          >
            Ministério
          </label>
          <select
            id="ministerioId"
            name="ministerioId"
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Nenhum</option>
            {ministerios.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700"
          >
            Descrição
          </label>
          <textarea
            id="descricao"
            name="descricao"
            rows={3}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/eventos"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
