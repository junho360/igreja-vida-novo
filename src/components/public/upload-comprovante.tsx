'use client'

import { useState, useRef } from 'react'

export default function UploadComprovante({
  inscricaoId,
  onUploaded,
}: {
  inscricaoId: string
  onUploaded?: () => void
}) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const cameraRef = useRef<HTMLInputElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File | null) {
    if (!file) return
    setUploading(true)
    setError('')

    if (
      !['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(
        file.type
      )
    ) {
      setError('Tipo não permitido. Use foto ou PDF.')
      setUploading(false)
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Arquivo muito grande. Máximo 5MB.')
      setUploading(false)
      return
    }

    const formData = new FormData()
    formData.append('comprovante', file)

    const res = await fetch(`/api/inscricoes/${inscricaoId}/comprovante`, {
      method: 'POST',
      body: formData,
    })

    const data = res.headers.get('content-type')?.includes('application/json')
      ? await res.json()
      : { error: 'Erro ao enviar' }

    if (res.ok) {
      onUploaded?.()
    } else {
      setError(data.error || 'Erro ao enviar')
    }
    setUploading(false)
  }

  return (
    <div className="mt-3 space-y-2">
      <p className="text-sm font-medium text-gray-700">
        Como quer enviar o comprovante?
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={uploading}
          className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50 transition-colors"
        >
          📷 Tirar foto
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Escolher arquivo/foto
        </button>
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0] ?? null)
          e.target.value = ''
        }}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files?.[0] ?? null)
          e.target.value = ''
        }}
      />
      {uploading && (
        <p className="text-sm text-gray-500">Enviando comprovante...</p>
      )}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
