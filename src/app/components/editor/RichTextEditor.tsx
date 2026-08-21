import { useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle, FontSize } from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Heading2,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Minus,
  Palette,
} from 'lucide-react';
import { uploadImage } from '../../lib/api';

const TEXT_SIZES = [
  { value: '', label: 'Size' },
  { value: '0.85rem', label: 'Small' },
  { value: '1rem', label: 'Normal' },
  { value: '1.25rem', label: 'Large' },
  { value: '1.5rem', label: 'XL' },
];

interface Props {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false }),
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  function addLink() {
    const url = window.prompt('URL:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  async function handleImageFile(file: File | undefined | null) {
    if (!file) return;
    setUploadError('');
    setUploading(true);
    try {
      const { url } = await uploadImage(file);
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  const btn = (action: () => void, active: boolean, label: string, Icon: React.ElementType) => (
    <button
      type="button"
      onClick={action}
      title={label}
      className={`p-1.5 rounded-[6px] transition-colors ${active ? 'bg-white/20 text-white' : 'text-white/40 hover:text-white hover:bg-white/10'}`}
    >
      <Icon size={14} strokeWidth={1.5} />
    </button>
  );
  const currentColor = editor.getAttributes('textStyle').color || '#ffffff';
  const currentFontSize = editor.getAttributes('textStyle').fontSize || '';

  return (
    <div className="rounded-[12px] border border-white/10 bg-white/5 overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-0.5 px-2 py-2 border-b border-white/10 bg-white/[0.02]">
        {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold', Bold)}
        {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic', Italic)}
        {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'Heading', Heading2)}
        <div className="w-px bg-white/10 mx-1" />
        {btn(() => editor.chain().focus().setTextAlign('left').run(), editor.isActive({ textAlign: 'left' }), 'Align left', AlignLeft)}
        {btn(() => editor.chain().focus().setTextAlign('center').run(), editor.isActive({ textAlign: 'center' }), 'Align center', AlignCenter)}
        {btn(() => editor.chain().focus().setTextAlign('right').run(), editor.isActive({ textAlign: 'right' }), 'Align right', AlignRight)}
        {btn(() => editor.chain().focus().setTextAlign('justify').run(), editor.isActive({ textAlign: 'justify' }), 'Justify text', AlignJustify)}
        <div className="w-px bg-white/10 mx-1" />
        <label
          className="relative flex items-center justify-center p-1.5 rounded-[6px] text-white/40 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          title="Text color"
        >
          <Palette size={14} strokeWidth={1.5} />
          <span
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-0.5 rounded-full"
            style={{ backgroundColor: currentColor }}
          />
          <input
            type="color"
            value={currentColor}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Text color"
            onChange={event => editor.chain().focus().setColor(event.target.value).run()}
          />
        </label>
        <select
          value={currentFontSize}
          aria-label="Text size"
          title="Text size"
          onChange={event => {
            const chain = editor.chain().focus();
            if (event.target.value) chain.setFontSize(event.target.value).run();
            else chain.unsetFontSize().run();
          }}
          className="h-[29px] max-w-[74px] rounded-[6px] bg-transparent px-1.5 text-[0.7rem] text-white/55 outline-none hover:bg-white/10 hover:text-white cursor-pointer"
        >
          {TEXT_SIZES.map(size => (
            <option key={size.value} value={size.value} className="bg-[#242424] text-white">
              {size.label}
            </option>
          ))}
        </select>
        <div className="w-px bg-white/10 mx-1" />
        {btn(() => editor.chain().focus().toggleBulletList().run(), editor.isActive('bulletList'), 'Bullet list', List)}
        {btn(() => editor.chain().focus().toggleOrderedList().run(), editor.isActive('orderedList'), 'Ordered list', ListOrdered)}
        <div className="w-px bg-white/10 mx-1" />
        {btn(addLink, editor.isActive('link'), 'Link', LinkIcon)}
        {btn(() => fileRef.current?.click(), false, 'Insert image', uploading ? () => <Loader2 size={14} className="animate-spin" /> : ImageIcon)}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp,image/avif"
          className="hidden"
          onChange={e => handleImageFile(e.target.files?.[0])}
        />
        {btn(() => editor.chain().focus().setHorizontalRule().run(), false, 'Divider', Minus)}
      </div>
      {uploadError && (
        <p className="px-3 py-1.5 text-[#d25d5f] text-[0.72rem] font-['Source_Sans_3',sans-serif] border-b border-white/10">{uploadError}</p>
      )}

      {/* Editor area */}
      <div className="relative">
        {!editor.getText() && placeholder && (
          <p className="absolute top-3 left-4 text-white/20 text-[0.85rem] font-['Source_Sans_3',sans-serif] pointer-events-none select-none">
            {placeholder}
          </p>
        )}
        <EditorContent
          editor={editor}
          className="prose prose-invert prose-sm max-w-none px-4 py-3 text-white/80 text-[0.85rem] font-['Source_Sans_3',sans-serif] min-h-[120px] focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[120px]"
        />
      </div>
    </div>
  );
}
