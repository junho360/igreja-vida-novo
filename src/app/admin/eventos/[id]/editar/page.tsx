'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import LoteManager from '@/components/admin/lote-manager'

export default function EditarEventoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [ministerios, setMinisterios] = useState<
    Array<{ id: string; nome: string }>
  >([])
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    data: '',
    dataFim: '',
    local: '',
    valor: '0',
    inscricaoInicio: '',
    inscricaoFim: '',
    dataPlanejamentoInicio: '',
    ministerioId: '',
    publicado: false,
  })

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/eventos/${id}`).then((r) => {
        if (!r.ok) throw new Error('Erro ao carregar evento')
        return r.json()
      }),
      fetch('/api/admin/ministerios').then((r) => {
        if (!r.ok) throw new Error('Erro ao carregar ministérios')
        return r.json()
      }),
    ])
      .then(([evento, mins]) => {
        setMinisterios(mins)
        function toLocal(iso: string | null) {
          if (!iso) return ''
          const d = new Date(iso)
          const offset = d.getTimezoneOffset()
          return new Date(d.getTime() - offset * 60000)
            .toISOString()
            .slice(0, 16)
        }
        setForm({
          titulo: evento.titulo ?? '',
          descricao: evento.descricao ?? '',
          data: toLocal(evento.data),
          dataFim: toLocal(evento.dataFim),
          local: evento.local ?? '',
          valor: String(evento.valor ?? 0),
          inscricaoInicio: toLocal(evento.inscricaoInicio),
          inscricaoFim: toLocal(evento.inscricaoFim),
          dataPlanejamentoInicio: evento.dataPlanejamentoInicio
            ? new Date(evento.dataPlanejamentoInicio).toISOString().slice(0, 10)
            : '',
          ministerioId: evento.ministerioId ?? '',
          publicado: evento.publicado ?? false,
        })
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar o evento.')
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch(`/api/admin/eventos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        data: new Date(form.data).toISOString(),
        dataFim: form.dataFim ? new Date(form.dataFim).toISOString() : null,
        inscricaoInicio: form.inscricaoInicio
          ? new Date(form.inscricaoInicio).toISOString()
          : null,
        inscricaoFim: form.inscricaoFim
          ? new Date(form.inscricaoFim).toISOString()
          : null,
        valor: Number(form.valor) || 0,
        ministerioId: form.ministerioId || null,
        publicado: form.publicado,
      }),
    })

    if (!res.ok) {
      setError('Erro ao salvar o evento. Tente novamente.')
      setSaving(false)
      return
    }

    router.push('/admin/eventos')
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Evento</h1>
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
            required
            value={form.titulo}
            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
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
              required
              value={form.data}
              onChange={(e) => setForm({ ...form, data: e.target.value })}
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
              value={form.dataFim}
              onChange={(e) => setForm({ ...form, dataFim: e.target.value })}
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
            value={form.local}
            onChange={(e) => setForm({ ...form, local: e.target.value })}
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
            value={form.dataPlanejamentoInicio}
            onChange={(e) =>
              setForm({ ...form, dataPlanejamentoInicio: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="valor"
            className="block text-sm font-medium text-gray-700"
          >
            Valor (R$) - 0 = Gratuito
          </label>
          <input
            type="number"
            id="valor"
            step="0.01"
            value={form.valor}
            onChange={(e) => setForm({ ...form, valor: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="publicado"
            checked={form.publicado}
            onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
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
              value={form.inscricaoInicio}
              onChange={(e) =>
                setForm({ ...form, inscricaoInicio: e.target.value })
              }
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
              value={form.inscricaoFim}
              onChange={(e) =>
                setForm({ ...form, inscricaoFim: e.target.value })
              }
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
            value={form.ministerioId}
            onChange={(e) => setForm({ ...form, ministerioId: e.target.value })}
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
            rows={3}
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <LoteManager eventoId={id} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
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
