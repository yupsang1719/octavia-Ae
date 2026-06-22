import { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { BubbleMenu } from '@tiptap/extension-bubble-menu'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import Placeholder from '@tiptap/extension-placeholder'
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Minus,
  Link as LinkIcon, AlignLeft, AlignCenter, AlignRight,
  Undo2, Redo2, ChevronDown,
} from 'lucide-react'

// ── Shared button ────────────────────────────────────────────────────────────
function Btn({ onClick, active, title, children, variant = 'toolbar' }) {
  const base = 'inline-flex items-center justify-center rounded transition-colors duration-100 select-none'
  const styles = {
    toolbar: `p-1.5 ${active ? 'bg-brand-green/10 text-brand-green' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`,
    bubble:  `px-2 py-1 text-xs font-medium font-sans ${active ? 'bg-white text-brand-green' : 'text-white/80 hover:text-white hover:bg-white/10'}`,
  }
  return (
    <button
      type="button"
      title={title}
      onMouseDown={e => { e.preventDefault(); onClick() }}
      className={`${base} ${styles[variant]}`}
    >
      {children}
    </button>
  )
}

function Sep() {
  return <div className="w-px h-4 bg-gray-200 mx-0.5 flex-shrink-0" />
}

// ── Heading selector ─────────────────────────────────────────────────────────
function HeadingSelect({ editor }) {
  const levels = [
    { label: 'Normal text', value: 0 },
    { label: 'Heading 1',   value: 1 },
    { label: 'Heading 2',   value: 2 },
    { label: 'Heading 3',   value: 3 },
  ]
  const active = levels.find(l =>
    l.value === 0 ? !editor.isActive('heading') : editor.isActive('heading', { level: l.value })
  ) || levels[0]

  return (
    <div className="relative group">
      <button
        type="button"
        onMouseDown={e => e.preventDefault()}
        className="flex items-center gap-1 px-2 py-1 rounded text-sm font-sans text-gray-600 hover:bg-gray-100 transition-colors min-w-[110px] justify-between"
      >
        <span>{active.label}</span>
        <ChevronDown size={13} className="text-gray-400" />
      </button>
      <div className="absolute top-full left-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 hidden group-hover:block">
        {levels.map(l => (
          <button
            key={l.value}
            type="button"
            onMouseDown={e => {
              e.preventDefault()
              if (l.value === 0) editor.chain().focus().setParagraph().run()
              else editor.chain().focus().toggleHeading({ level: l.value }).run()
            }}
            className={`w-full text-left px-3 py-1.5 text-sm font-sans transition-colors hover:bg-gray-50 ${
              active.value === l.value ? 'text-brand-green font-medium' : 'text-gray-700'
            }`}
          >
            {l.value === 0
              ? <span className="text-sm">Normal text</span>
              : <span className={`font-serif font-medium text-brand-dark ${l.value === 1 ? 'text-lg' : l.value === 2 ? 'text-base' : 'text-sm'}`}>Heading {l.value}</span>
            }
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Main editor ──────────────────────────────────────────────────────────────
export default function RichTextEditor({ value, onChange, placeholder = 'Write your post…' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Underline,
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-brand-green underline cursor-pointer' } }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: 'tiptap min-h-[500px] px-8 py-6 focus:outline-none font-sans text-[15px] leading-7' },
    },
  })

  // Sync external value into editor (handles async API load after mount)
  useEffect(() => {
    if (!editor) return
    if (value && value !== editor.getHTML()) {
      editor.commands.setContent(value, false)
    }
  }, [editor, value])

  function setLink() {
    const prev = editor.getAttributes('link').href
    const url = window.prompt('Link URL', prev || 'https://')
    if (url === null) return
    if (url === '') editor.chain().focus().extendMarkRange('link').unsetLink().run()
    else editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  if (!editor) return (
    <div className="border border-gray-200 rounded-xl h-[580px] flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-brand-green focus-within:shadow-md transition-all duration-200">

      {/* ── Fixed toolbar ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">

        <Btn onClick={() => editor.chain().focus().undo().run()} title="Undo (⌘Z)">
          <Undo2 size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().redo().run()} title="Redo (⌘⇧Z)">
          <Redo2 size={14} />
        </Btn>

        <Sep />
        <HeadingSelect editor={editor} />
        <Sep />

        <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (⌘B)">
          <Bold size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (⌘I)">
          <Italic size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (⌘U)">
          <UnderlineIcon size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={14} />
        </Btn>

        <Sep />

        <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet list">
          <List size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered list">
          <ListOrdered size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
          <Quote size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divider line">
          <Minus size={14} />
        </Btn>

        <Sep />

        <Btn onClick={setLink} active={editor.isActive('link')} title="Insert / edit link">
          <LinkIcon size={14} />
        </Btn>

        <Sep />

        <Btn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align left">
          <AlignLeft size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Align centre">
          <AlignCenter size={14} />
        </Btn>
        <Btn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align right">
          <AlignRight size={14} />
        </Btn>
      </div>

      {/* ── Bubble menu — appears on text selection ── */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100, placement: 'top' }}
        className="flex items-center gap-0.5 bg-gray-900 text-white rounded-lg px-1.5 py-1 shadow-xl"
      >
        <Btn variant="bubble" onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
          <Bold size={13} />
        </Btn>
        <Btn variant="bubble" onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
          <Italic size={13} />
        </Btn>
        <Btn variant="bubble" onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
          <UnderlineIcon size={13} />
        </Btn>
        <Btn variant="bubble" onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
          <Strikethrough size={13} />
        </Btn>
        <div className="w-px h-3.5 bg-white/20 mx-0.5" />
        <Btn variant="bubble" onClick={setLink} active={editor.isActive('link')} title="Link">
          <LinkIcon size={13} />
        </Btn>
        <div className="w-px h-3.5 bg-white/20 mx-0.5" />
        <Btn variant="bubble" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">
          <span className="text-xs font-bold">H2</span>
        </Btn>
        <Btn variant="bubble" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">
          <span className="text-xs font-bold">H3</span>
        </Btn>
      </BubbleMenu>

      {/* ── Editor area ── */}
      <div className="bg-white">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
