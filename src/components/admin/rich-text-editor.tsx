'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import FontFamily from '@tiptap/extension-font-family'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({
  value,
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose max-w-none min-h-[300px] p-4 focus:outline-none',
      },
    },
  })

  if (!editor) return null

  const fonts = [
    'Arial',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Verdana',
    'Tahoma',
  ]
  const sizes = [
    { label: 'P', value: '12px' },
    { label: 'M', value: '16px' },
    { label: 'G', value: '20px' },
    { label: 'GG', value: '24px' },
  ]

  return (
    <div className="rounded-md border border-gray-300 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 p-2">
        <select
          onChange={(e) =>
            editor.chain().focus().setFontFamily(e.target.value).run()
          }
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Fonte</option>
          {fonts.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => {
            const size = e.target.value
            if (size) {
              editor
                .chain()
                .focus()
                .setMark('textStyle', { style: `font-size: ${size}` })
                .run()
            } else {
              editor.chain().focus().unsetMark('textStyle').run()
            }
          }}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="">Tamanho</option>
          {sizes.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="h-7 w-7 cursor-pointer rounded border border-gray-300"
          title="Cor do texto"
        />

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded px-2 py-1 text-sm font-bold ${editor.isActive('bold') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Negrito"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded px-2 py-1 text-sm italic ${editor.isActive('italic') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Itálico"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded px-2 py-1 text-sm underline ${editor.isActive('underline') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Sublinhado"
        >
          U
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded px-2 py-1 text-sm line-through ${editor.isActive('strike') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Tachado"
        >
          S
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`rounded px-2 py-1 text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Título"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`rounded px-2 py-1 text-sm font-bold ${editor.isActive('heading', { level: 3 }) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Subtítulo"
        >
          H2
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive('bulletList') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Lista"
        >
          • Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive('orderedList') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Lista numerada"
        >
          1. Lista
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive('blockquote') ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Citação"
        >
          &ldquo; Citação
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive({ textAlign: 'left' }) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Alinhar à esquerda"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive({ textAlign: 'center' }) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Centralizar"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive({ textAlign: 'right' }) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Alinhar à direita"
        >
          ≡
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={`rounded px-2 py-1 text-sm ${editor.isActive({ textAlign: 'justify' }) ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'}`}
          title="Justificar"
        >
          ≡
        </button>

        <div className="mx-1 h-5 w-px bg-gray-300" />

        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100"
          title="Linha horizontal"
        >
          ─
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-30"
          title="Desfazer"
        >
          ↶
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded px-2 py-1 text-sm text-gray-700 hover:bg-gray-100 disabled:opacity-30"
          title="Refazer"
        >
          ↷
        </button>
      </div>

      <EditorContent editor={editor} />
    </div>
  )
}
