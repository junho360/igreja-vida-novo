'use client'

import { useRouter, useParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(
  () => import('@/components/admin/rich-text-editor'),
  { ssr: false }
)
const GaleriaManager = dynamic(
  () => import('@/components/admin/galeria-manager'),
  { ssr: false }
)

interface GaleriaItem {
  id: string
  tipo: string
  url: string
  titulo?: string | null
  ordem: number
}

export default function EditarMinisterioPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [nome, setNome] = useState('')
  const [responsavel, setResponsavel] = useState('')
  const [descricao, setDescricao] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [imagemAtual, setImagemAtual] = useState<string | null>(null)
  const [imagem, setImagem] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [galeria, setGaleria] = useState<GaleriaItem[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/ministerios/${id}`).then((r) => r.json()),
      fetch(`/api/admin/galeria?ministerioId=${id}`).then((r) => r.json()),
    ])
      .then(([data, gal]) => {
        setNome(data.nome ?? '')
        setResponsavel(data.responsavel ?? '')
        setDescricao(data.descricao ?? '')
        setVideoUrl(data.videoUrl ?? '')
        setConteudo(data.conteudo ?? '')
        setImagemAtual(data.imagem ?? null)
        setGaleria(Array.isArray(gal) ? gal : [])
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)

    await fetch(`/api/admin/ministerios/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nome,
        responsavel,
        descricao,
        videoUrl,
        conteudo,
      }),
    })

    if (imagem) {
      const formData = new FormData()
      formData.append('imagem', imagem)
      await fetch(`/api/admin/ministerios/${id}/imagem`, {
        method: 'POST',
        body: formData,
      })
    }

    router.push('/admin/ministerios')
  }

  if (loading) return <p className="text-gray-500">Carregando...</p>

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Editar Ministério</h1>
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
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label
            htmlFor="responsavel"
            className="block text-sm font-medium text-gray-700"
          >
            Responsável
          </label>
          <input
            type="text"
            id="responsavel"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
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
            rows={2}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Imagem
          </label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null
              setImagem(file)
              if (file) {
                setPreview(URL.createObjectURL(file))
              } else {
                setPreview(null)
              }
            }}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-light"
          />
          {(preview || imagemAtual) && (
            <div className="mt-2 flex items-center gap-3">
              <img
                src={preview ?? imagemAtual!}
                alt="Preview"
                className="h-32 rounded-md object-cover"
              />
              <button
                type="button"
                onClick={async () => {
                  if (imagemAtual && !preview) {
                    await fetch(`/api/admin/ministerios/${id}/imagem`, {
                      method: 'DELETE',
                    })
                    setImagemAtual(null)
                  }
                  setImagem(null)
                  setPreview(null)
                  if (fileRef.current) fileRef.current.value = ''
                }}
                className="text-sm text-red-600 hover:underline"
              >
                Remover imagem
              </button>
            </div>
          )}
        </div>
        <div>
          <label
            htmlFor="videoUrl"
            className="block text-sm font-medium text-gray-700"
          >
            URL do Vídeo (YouTube)
          </label>
          <input
            type="url"
            id="videoUrl"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Conteúdo
          </label>
          <div className="mt-1">
            <RichTextEditor value={conteudo} onChange={setConteudo} />
          </div>
        </div>
        <GaleriaManager ministerioId={id} itens={galeria} />
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-50"
          >
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
          <a
            href="/admin/ministerios"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>
      </form>
    </div>
  )
}
