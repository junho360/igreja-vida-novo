'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function EditarCelulaPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    lider: '',
    horario: '',
    local: '',
    telefone: '',
    ordem: '0',
    ativo: true,
  })

  useEffect(() => {
    fetch(`/api/admin/celulas/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setForm({
          nome: data.nome ?? '',
          descricao: data.descricao ?? '',
          lider: data.lider ?? '',
          horario: data.horario ?? '',
          local: data.local ?? '',
          telefone: data.telefone ?? '',
          ordem: String(data.ordem ?? 0),
          ativo: data.ativo ?? true,
        })
        setLoading(false)
      })
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    await fetch(`/api/admin/celulas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    router.push('/admin/celulas')
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Célula</h1>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-gray-700"
          >
            Nome *
          </label>
          <input
            type="text"
            id="nome"
            required
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="lider"
              className="block text-sm font-medium text-gray-700"
            >
              Líder
            </label>
            <input
              type="text"
              id="lider"
              value={form.lider}
              onChange={(e) => setForm({ ...form, lider: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="telefone"
              className="block text-sm font-medium text-gray-700"
            >
              Telefone
            </label>
            <input
              type="text"
              id="telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
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
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/celulas"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
