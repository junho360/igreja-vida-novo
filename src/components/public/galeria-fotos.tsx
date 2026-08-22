'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

interface Foto {
  id: string
  url: string
  titulo?: string | null
}

export default function GaleriaFotos({ fotos }: { fotos: Foto[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index)
  }, [])

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null)
  }, [])

  const goNext = useCallback(() => {
    if (lightboxIndex !== null && lightboxIndex < fotos.length - 1) {
      setLightboxIndex(lightboxIndex + 1)
    }
  }, [lightboxIndex, fotos.length])

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null && lightboxIndex > 0) {
      setLightboxIndex(lightboxIndex - 1)
    }
  }, [lightboxIndex])

  useEffect(() => {
    if (lightboxIndex === null) return

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }

    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [lightboxIndex, closeLightbox, goNext, goPrev])

  if (fotos.length === 0) return null

  return (
    <div>
      {fotos.length === 1 ? (
        <button
          type="button"
          onClick={() => openLightbox(0)}
          className="relative block w-full overflow-hidden rounded-lg bg-gray-50"
        >
          <div
            className="relative w-full"
            style={{ height: 'min(500px, 70vh)' }}
          >
            <Image
              src={fotos[0].url}
              alt={fotos[0].titulo ?? ''}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          {fotos[0].titulo && (
            <p className="mt-2 text-sm text-gray-500 text-center">
              {fotos[0].titulo}
            </p>
          )}
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {fotos.map((foto, i) => (
            <button
              key={foto.id}
              type="button"
              onClick={() => openLightbox(i)}
              className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
            >
              <Image
                src={foto.url}
                alt={foto.titulo ?? ''}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </button>
          ))}
        </div>
      )}

      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 text-white/80 hover:text-white"
          >
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {lightboxIndex > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goPrev()
              }}
              className="absolute left-4 z-10 text-white/80 hover:text-white"
            >
              <svg
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
          )}

          {lightboxIndex < fotos.length - 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                goNext()
              }}
              className="absolute right-4 z-10 text-white/80 hover:text-white"
            >
              <svg
                className="h-10 w-10"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>
          )}

          <div
            className="flex h-full w-full items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={fotos[lightboxIndex].url}
              alt={fotos[lightboxIndex].titulo ?? ''}
              className="max-h-[85vh] max-w-[90vw] object-contain"
            />
          </div>

          {fotos[lightboxIndex].titulo && (
            <p className="absolute bottom-4 left-0 right-0 text-center text-sm text-white/80">
              {fotos[lightboxIndex].titulo}
            </p>
          )}

          {fotos.length > 1 && (
            <div className="absolute bottom-10 left-0 right-0 text-center text-xs text-white/50">
              {lightboxIndex + 1} / {fotos.length}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
