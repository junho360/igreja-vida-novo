'use client'

import { useEffect, useState } from 'react'

interface Configuracao {
  id: string
  chave: string
  valor: string
  descricao: string | null
}

export default function AdminConfiguracoesPage() {
  const [configs, setConfigs] = useState<Configuracao[]>([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/admin/configuracoes')
      .then((r) => r.json())
      .then(setConfigs)
  }, [])

  function handleChange(chave: string, valor: string) {
    setConfigs(configs.map((c) => (c.chave === chave ? { ...c, valor } : c)))
  }

  async function handleSave() {
    setLoading(true)
    setSaved(false)
    await fetch('/api/admin/configuracoes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        configs.map(({ chave, valor }) => ({ chave, valor }))
      ),
    })
    setLoading(false)
    setSaved(true)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
      <p className="mt-2 text-sm text-gray-500">
        Edite as informações que aparecem no site.
      </p>

      <div className="mt-6 space-y-4">
        {configs.map((config) => (
          <div key={config.chave}>
            <label className="block text-sm font-medium text-gray-700">
              {config.descricao ?? config.chave}
            </label>
            <input
              type="text"
              value={config.valor}
              onChange={(e) => handleChange(config.chave, e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={loading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
        {saved && (
          <span className="text-sm text-green-600">Salvo com sucesso!</span>
        )}
      </div>
    </div>
  )
}
