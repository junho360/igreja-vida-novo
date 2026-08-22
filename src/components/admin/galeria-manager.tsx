'use client'

import { useState, useRef } from 'react'

interface GaleriaItem {
  id: string
  tipo: string
  url: string
  titulo?: string | null
  ordem: number
}

export default function GaleriaManager({
  ministerioId,
  itens,
}: {
  ministerioId: string
  itens: GaleriaItem[]
}) {
  const [items, setItems] = useState<GaleriaItem[]>(itens)
  const [tipo, setTipo] = useState<'imagem' | 'video'>('imagem')
  const [videoUrl, setVideoUrl] = useState('')
  const [titulo, setTitulo] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleUploadImagem() {
    const file = fileRef.current?.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('/api/admin/galeria/upload', {
      method: 'POST',
      body: formData,
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Erro ao enviar')
      setUploading(false)
      return
    }

    const saveRes = await fetch('/api/admin/galeria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'imagem',
        url: data.url,
        titulo,
        ministerioId,
        ordem: items.length,
      }),
    })

    const saved = await saveRes.json()
    if (saveRes.ok) {
      setItems([...items, saved])
      setTitulo('')
      if (fileRef.current) fileRef.current.value = ''
    }
    setUploading(false)
  }

  async function handleAddVideo() {
    if (!videoUrl) return

    setError('')
    const res = await fetch('/api/admin/galeria', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tipo: 'video',
        url: videoUrl,
        titulo,
        ministerioId,
        ordem: items.length,
      }),
    })

    const saved = await res.json()
    if (res.ok) {
      setItems([...items, saved])
      setVideoUrl('')
      setTitulo('')
    }
    setUploading(false)
  }

  async function handleRemove(id: string) {
    const item = items.find((i) => i.id === id)
    if (!item) return

    const res = await fetch('/api/admin/galeria', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })

    if (res.ok) {
      setItems(items.filter((i) => i.id !== id))
    }
  }

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">Galeria</label>

      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-md border border-gray-200"
            >
              {item.tipo === 'imagem' ? (
                <img
                  src={item.url}
                  alt={item.titulo ?? ''}
                  className="h-32 w-full object-cover"
                />
              ) : (
                <div className="h-32 w-full bg-gray-100 flex items-center justify-center">
                  <span className="text-2xl">🎥</span>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="absolute right-1 top-1 rounded-full bg-red-600 px-2 py-0.5 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ✕
              </button>
              {item.titulo && (
                <p className="px-2 py-1 text-xs text-gray-600 truncate">
                  {item.titulo}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="rounded-md border border-gray-200 p-4 space-y-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTipo('imagem')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${tipo === 'imagem' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Imagem
          </button>
          <button
            type="button"
            onClick={() => setTipo('video')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${tipo === 'video' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            Vídeo
          </button>
        </div>

        <input
          type="text"
          placeholder="Título (opcional)"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        />

        {tipo === 'imagem' ? (
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-light"
            />
            <p className="mt-1 text-xs text-gray-400">
              JPG, PNG ou WebP. Máximo 5MB.
            </p>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <button
              type="button"
              onClick={handleUploadImagem}
              disabled={uploading}
              className="mt-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
            >
              {uploading ? 'Enviando...' : 'Adicionar imagem'}
            </button>
          </div>
        ) : (
          <div>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-1.5 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
            <button
              type="button"
              onClick={handleAddVideo}
              disabled={!videoUrl}
              className="mt-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
            >
              Adicionar vídeo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
