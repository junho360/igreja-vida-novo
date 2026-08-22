'use client'

import { useEffect, useRef, useState } from 'react'
import { generatePixPayload } from '@/lib/pix'

interface PixButtonProps {
  pix: string
  nome?: string
  cidade?: string
}

function renderQrToCanvas(canvas: HTMLCanvasElement, text: string) {
  import('qrcode-generator').then((mod) => {
    const qrcode = mod.default
    const qr = qrcode(0, 'M')
    qr.addData(text)
    qr.make()

    const moduleCount = qr.getModuleCount()
    const cellSize = 10
    const margin = 4
    const size = moduleCount * cellSize + margin * 2

    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, size, size)

    ctx.fillStyle = '#000000'
    for (let row = 0; row < moduleCount; row++) {
      for (let col = 0; col < moduleCount; col++) {
        if (qr.isDark(row, col)) {
          ctx.fillRect(
            margin + col * cellSize,
            margin + row * cellSize,
            cellSize,
            cellSize
          )
        }
      }
    }
  })
}

export default function PixButton({
  pix,
  nome = 'Igreja Vida',
  cidade = 'Sao Paulo',
}: PixButtonProps) {
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (canvasRef.current) {
      const payload = generatePixPayload(pix, nome, cidade)
      renderQrToCanvas(canvasRef.current, payload)
    }
  }, [pix, nome, cidade])

  async function handleCopy() {
    await navigator.clipboard.writeText(pix)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-6 inline-block rounded-lg border border-gray-200 bg-white px-8 py-6 shadow-sm">
      <canvas
        ref={canvasRef}
        className="mx-auto block"
        style={{ width: 240, height: 240, imageRendering: 'pixelated' }}
      />
      <p className="mt-4 text-xs text-gray-500">Chave PIX:</p>
      <p className="font-mono text-lg font-semibold text-foreground">{pix}</p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light transition-colors"
      >
        {copied ? 'Copiado!' : 'Copiar chave PIX'}
      </button>
    </div>
  )
}
