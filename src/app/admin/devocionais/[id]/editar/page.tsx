'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function EditarDevocionalPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titulo: '',
    conteudo: '',
    publicado: false,
    publicadoEm: '',
  })

  useEffect(() => {
    fetch(`/api/admin/devocionais/${id}`)
      .then((r) => r.json())
      .then((data) => {
        let pubDate = ''
        if (data.publicadoEm) {
          const d = new Date(data.publicadoEm)
          pubDate = d.toISOString().slice(0, 10)
        }
        setForm({
          titulo: data.titulo ?? '',
          conteudo: data.conteudo ?? '',
          publicado: data.publicado ?? false,
          publicadoEm: pubDate,
        })
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar devocional.')
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const res = await fetch(`/api/admin/devocionais/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        publicadoEm: form.publicadoEm
          ? new Date(form.publicadoEm + 'T12:00:00').toISOString()
          : null,
      }),
    })

    if (!res.ok) {
      setError('Erro ao salvar devocional. Tente novamente.')
      setSaving(false)
      return
    }

    router.push('/admin/devocionais')
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Devocional</h1>
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
            htmlFor="publicadoEm"
            className="block text-sm font-medium text-gray-700"
          >
            Data de publicação
          </label>
          <input
            type="date"
            id="publicadoEm"
            value={form.publicadoEm}
            onChange={(e) => setForm({ ...form, publicadoEm: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="conteudo"
            className="block text-sm font-medium text-gray-700"
          >
            Conteúdo *
          </label>
          <textarea
            id="conteudo"
            rows={8}
            required
            value={form.conteudo}
            onChange={(e) => setForm({ ...form, conteudo: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="publicado"
            checked={form.publicado}
            onChange={(e) => setForm({ ...form, publicado: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="publicado" className="text-sm text-gray-700">
            Publicar
          </label>
        </div>
        {error && (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/devocionais"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
