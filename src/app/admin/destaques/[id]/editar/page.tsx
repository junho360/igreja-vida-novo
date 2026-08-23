'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function EditarDestaquePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    horario: '',
    local: '',
    icone: '',
    ordem: '0',
    ativo: true,
  })

  useEffect(() => {
    fetch(`/api/admin/destaques/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Erro ao carregar dados')
        return r.json()
      })
      .then((data) => {
        setForm({
          titulo: data.titulo ?? '',
          subtitulo: data.subtitulo ?? '',
          horario: data.horario ?? '',
          local: data.local ?? '',
          icone: data.icone ?? '',
          ordem: String(data.ordem ?? 0),
          ativo: data.ativo ?? true,
        })
        setLoading(false)
      })
      .catch(() => {
        setError('Erro ao carregar dados')
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    const res = await fetch(`/api/admin/destaques/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    if (!res.ok) {
      setError('Erro ao salvar')
      setSaving(false)
      return
    }

    router.push('/admin/destaques')
  }

  async function handleDelete() {
    if (!confirm(`Excluir o destaque "${form.titulo}"?`)) return
    setDeleting(true)

    const res = await fetch(`/api/admin/destaques/${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      alert('Erro ao excluir')
      setDeleting(false)
      return
    }

    router.push('/admin/destaques')
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Destaque</h1>
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
            htmlFor="subtitulo"
            className="block text-sm font-medium text-gray-700"
          >
            Subtítulo
          </label>
          <input
            type="text"
            id="subtitulo"
            value={form.subtitulo}
            onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="horario"
              className="block text-sm font-medium text-gray-700"
            >
              Horário
            </label>
            <input
              type="text"
              id="horario"
              value={form.horario}
              onChange={(e) => setForm({ ...form, horario: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
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
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="icone"
              className="block text-sm font-medium text-gray-700"
            >
              Ícone
            </label>
            <input
              type="text"
              id="icone"
              value={form.icone}
              onChange={(e) => setForm({ ...form, icone: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="ordem"
              className="block text-sm font-medium text-gray-700"
            >
              Ordem
            </label>
            <input
              type="number"
              id="ordem"
              value={form.ordem}
              onChange={(e) => setForm({ ...form, ordem: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="ativo"
            checked={form.ativo}
            onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
            className="rounded border-gray-300"
          />
          <label htmlFor="ativo" className="text-sm text-gray-700">
            Ativo
          </label>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/destaques"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto rounded-md border border-red-300 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? 'Excluindo...' : 'Excluir'}
          </button>
        </div>
      </form>
    </div>
  )
}
