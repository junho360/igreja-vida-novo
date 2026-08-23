'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function EditarPregacaoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    urlYoutube: '',
    data: '',
    pregador: '',
    duracao: '',
    publicado: false,
  })

  useEffect(() => {
    fetch(`/api/admin/pregacoes/${id}`)
      .then((r) => r.json())
      .then((data) => {
        let dateStr = ''
        if (data.data) {
          dateStr = new Date(data.data).toISOString().slice(0, 10)
        }
        setForm({
          titulo: data.titulo ?? '',
          descricao: data.descricao ?? '',
          urlYoutube: data.urlYoutube ?? '',
          data: dateStr,
          pregador: data.pregador ?? '',
          duracao: data.duracao ?? '',
          publicado: data.publicado ?? false,
        })
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar pregação.')
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch(`/api/admin/pregacoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        data: form.data
          ? new Date(form.data + 'T12:00:00').toISOString()
          : null,
        publicado: form.publicado,
      }),
    })

    if (!res.ok) {
      setError('Erro ao salvar pregação. Tente novamente.')
      setSaving(false)
      return
    }

    router.push('/admin/pregacoes')
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Pregação</h1>
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
        <div>
          <label
            htmlFor="urlYoutube"
            className="block text-sm font-medium text-gray-700"
          >
            URL YouTube *
          </label>
          <input
            type="url"
            id="urlYoutube"
            required
            value={form.urlYoutube}
            onChange={(e) => setForm({ ...form, urlYoutube: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="pregador"
              className="block text-sm font-medium text-gray-700"
            >
              Pregador
            </label>
            <input
              type="text"
              id="pregador"
              value={form.pregador}
              onChange={(e) => setForm({ ...form, pregador: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="duracao"
              className="block text-sm font-medium text-gray-700"
            >
              Duração
            </label>
            <input
              type="text"
              id="duracao"
              value={form.duracao}
              onChange={(e) => setForm({ ...form, duracao: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="data"
            className="block text-sm font-medium text-gray-700"
          >
            Data
          </label>
          <input
            type="date"
            id="data"
            value={form.data}
            onChange={(e) => setForm({ ...form, data: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
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
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="publicado"
            checked={form.publicado}
            onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="publicado" className="text-sm text-gray-700">
            Publicado
          </label>
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/pregacoes"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
